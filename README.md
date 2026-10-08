# Proppi Agent

Plan property work and prepare evidence briefs from information you provide. The main package contains two skills. An optional desktop companion connects to your Proppi account through a supported client's sign-in flow.

This repository contains generated distribution files. Proppi maintains them in its main repository; changes arrive through reviewed source updates and releases. Do not edit distribution files here.

Already using Proppi? The short [customer guide](CUSTOMER_GUIDE.md) covers connecting your account, a first task, upgrades, help and disconnecting.

Read the [changelog](CHANGELOG.md) for this version's changes, compatibility and any action you need to take.

## Let your assistant help

Copy this sentence into your supported assistant:

> Help me install Proppi Agent from https://github.com/ProppiAI/ProppiAI-Agent using the README, then verify the setup.

Installation still depends on your app's plugin support and workspace policies. Never paste passwords or tokens into a conversation.

For an assistant handling setup: check the client and any existing installation, then use this official repository's current default source ref (currently `generated-code`). Record its resolved public SHA when readable; do not ask the customer to choose a version or SHA. Do not query or verify tags, Releases or publication gates for normal installation. A missing public directory listing does not block a supported Git/local marketplace route.

Run `node verify.mjs --install` to check the required manifests, client metadata and two readable skill files against their file hashes, then continue installation. This does not audit changelog notes or publication. Finally check that the client actually loads **proppi-workflow** and **proppi-evidence-brief**, and report the source and available skills briefly. File checks alone are not installation completion. If the client cannot install skills, explain that limitation and offer only its supported MCP connection route; do not claim the skills are installed. Do not call business tools to test setup.

## Add it directly

Choose a supported route and install the current official source. You do not need a particular version or to make this repository your project workspace. The package currently declares version **1.0.0**; this is informational and does not require a matching tag or Release.

### Terminal marketplace

These commands use the official default source ref. For Codex, register the marketplace, then open `/plugins` and install **Proppi Agent**:

```sh
codex plugin marketplace add ProppiAI/ProppiAI-Agent
```

For Claude Code:

```sh
claude plugin marketplace add https://github.com/ProppiAI/ProppiAI-Agent.git
claude plugin install proppi-agent@proppi-agent
```

An assistant can select a readable public SHA using Codex's `--ref` option or Claude Code's `#` Git ref suffix. This is optional; record the source used without turning version selection into another setup step. Review the client's marketplace auto-update settings when upgrading.

### Workspace marketplace

An administrator can import `https://github.com/ProppiAI/ProppiAI-Agent` through **Admin > Plugins > Add > Import marketplace**, leaving Path empty. Use the default source ref, or its readable full public SHA to hold that snapshot. The administrator controls workspace updates; this does not give each member an independent version choice.

The skills package can work where workspace plugin support permits it. An imported MCP companion is desktop only, including its remote HTTPS connection. Importing it does not grant account access. A live web account connection needs a separately available integration; this package supplies no registered web app identifier.

## Optional account connection

Install **Proppi Agent Desktop** separately only if you want an account connection and your client supports authenticated remote MCP. Use the client's sign-in interface. The public service is `https://agents.proppi.ai/api/mcp`; credentials are not included in this package.

Check installed names, version and skill availability first. Account access and real property actions require a separate, explicit request. Do not use an account search or business action as an installation check. Review the proposed target, changes and consequences before approving an external action.

## Versions and support

Normal installation uses the current official source and does not check tags or Releases. The manifest records the main-repository source commit, file hashes and compatibility; the public checkout has its own SHA. A source install is not a claim of a certified published Release. A hash checks bytes, not publisher identity.

Support is confirmed per release. No end-of-support date has been announced. Immutable client files do not freeze the remote service or guarantee indefinite compatibility.

Verify this checkout locally with Node.js:

```sh
node verify.mjs --install
```

This checks required installation files and their hashes without connecting to a Proppi account. Missing, malformed or changed required files stop installation; obtain a fresh official snapshot rather than ignoring that check. It does not install the plugin or prove the remote service works.

Maintainers use `node verify.mjs` without an option for the separate complete-export check. It also checks changelog notes and extra files. `files["CHANGELOG.md"]` hashes the complete file; `releaseNotes.sha256` hashes the named version entry, identified by `scope: version-entry` in new exports. Those different hash ranges are intentional and are not installation gates.

For a local verification checkout, preserve the published bytes with `git -c core.autocrlf=false clone https://github.com/ProppiAI/ProppiAI-Agent.git`. Record `git rev-parse HEAD` in that checkout and select it as a local marketplace if the client supports that route.

Technical installation references: [terminal marketplace](https://developers.openai.com/plugins/build/plugins), [compatible marketplace](https://code.claude.com/docs/en/discover-plugins), [workspace administration](https://learn.chatgpt.com/docs/enterprise/plugin-management).
