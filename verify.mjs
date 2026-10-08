import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, "release-manifest.json"), "utf8"));
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
walk(root);
const expected = [...Object.keys(manifest.files), "release-manifest.json"].sort();
if (JSON.stringify(actual.sort()) !== JSON.stringify(expected)) {
  throw new Error("Distribution has missing or unexpected files");
}
for (const [file, expectedHash] of Object.entries(manifest.files)) {
  if (!/^[a-zA-Z0-9_./-]+$/.test(file) || file.split("/").includes("..")) {
    throw new Error("Invalid manifest path");
  }
  const hash = createHash("sha256")
    .update(readFileSync(join(root, file)))
    .digest("hex");
  if (hash !== expectedHash) throw new Error("File integrity check failed: " + file);
}
console.log(
  `Proppi Agent ${manifest.version}: ${expected.length} files verified (${manifest.kind}).`,
);
