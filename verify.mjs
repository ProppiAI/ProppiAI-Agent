import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, "release-manifest.json"), "utf8"));
const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== "--install")) {
  throw new Error("Usage: node verify.mjs [--install]");
}
const installOnly = args[0] === "--install";
const installationFiles = [
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  "plugins/proppi-agent/plugin.json",
  "plugins/proppi-agent/.claude-plugin/plugin.json",
  "plugins/proppi-agent/skills/proppi-workflow/SKILL.md",
  "plugins/proppi-agent/skills/proppi-evidence-brief/SKILL.md",
  "plugins/proppi-agent-desktop/plugin.json",
  "plugins/proppi-agent-desktop/.claude-plugin/plugin.json",
  "plugins/proppi-agent-desktop/mcp.json",
];
const actual = [];
function walk(directory, prefix = "") {
  for (const name of readdirSync(directory).sort()) {
    if (!prefix && name === ".git") continue;
    const relative = prefix + name;
    const absolute = join(directory, name);
    const stat = lstatSync(absolute);
    if (stat.isSymbolicLink()) throw new Error("Symlink rejected: " + relative);
    if (stat.isDirectory()) walk(absolute, relative + "/");
    else if (stat.isFile()) actual.push(relative);
    else throw new Error("Unsupported file: " + relative);
  }
}
const selected = installOnly ? installationFiles : Object.keys(manifest.files);
const expected = [...selected, "release-manifest.json"].sort();
if (!installOnly) {
  walk(root);
  if (JSON.stringify(actual.sort()) !== JSON.stringify(expected)) {
    throw new Error("Distribution has missing or unexpected files");
  }
}
for (const file of selected) {
  const expectedHash = manifest.files[file];
  if (typeof expectedHash !== "string" || !/^[0-9a-f]{64}$/.test(expectedHash)) {
    throw new Error("Missing or invalid file hash: " + file);
  }
  if (!/^[a-zA-Z0-9_./-]+$/.test(file) || file.split("/").includes("..")) {
    throw new Error("Invalid manifest path");
  }
  let current = root;
  for (const part of file.split("/")) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink()) throw new Error("Symlink rejected: " + file);
  }
  const hash = createHash("sha256")
    .update(readFileSync(join(root, file)))
    .digest("hex");
  if (hash !== expectedHash) throw new Error("File integrity check failed: " + file);
}
if (installOnly) {
  for (const file of installationFiles.filter((file) => file.endsWith(".json"))) {
    const metadata = JSON.parse(readFileSync(join(root, file), "utf8"));
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
      throw new Error("Invalid client metadata: " + file);
    }
  }
  for (const name of ["proppi-workflow", "proppi-evidence-brief"]) {
    const skill = readFileSync(join(root, `plugins/proppi-agent/skills/${name}/SKILL.md`), "utf8");
    if (
      !skill.startsWith("---\n") ||
      !skill.includes(`\nname: ${name}\n`) ||
      !/^description: \S.+$/m.test(skill) ||
      !skill.includes("\n---\n")
    ) {
      throw new Error("Invalid skill metadata: " + name);
    }
  }
  console.log(`Proppi Agent: ${expected.length} required installation files verified.`);
  console.log("Confirm both skills load in your client. Tags and Releases are not checked.");
} else {
  // files hashes complete file bytes; releaseNotes hashes only the named version entry.
  // Earlier official source snapshots omitted scope but used the same entry format.
  const notes = manifest.releaseNotes;
  if (
    !notes ||
    notes.path !== "CHANGELOG.md" ||
    notes.version !== manifest.version ||
    (notes.scope !== undefined && notes.scope !== "version-entry") ||
    !/^[0-9a-f]{64}$/.test(notes.sha256)
  ) {
    throw new Error("Invalid release notes metadata");
  }
  const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8");
  const headings = [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\]\s*$/gm)];
  const matching = headings.filter((heading) => heading[1] === notes.version);
  if (matching.length !== 1) throw new Error("Missing or duplicate release notes version");
  const index = headings.indexOf(matching[0]);
  const entry =
    changelog.slice(matching[0].index, headings[index + 1]?.index ?? changelog.length).trim() +
    "\n";
  if (createHash("sha256").update(entry).digest("hex") !== notes.sha256) {
    throw new Error("Release notes integrity check failed: " + notes.version);
  }
  console.log(
    `Proppi Agent ${manifest.version}: ${expected.length} files verified (${manifest.kind}).`,
  );
  console.log(
    "Version notes verified. Release publication and client installation are not checked.",
  );
}
