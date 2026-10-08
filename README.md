# Proppi Agent

Plan property work and prepare evidence briefs from information you provide. The main package contains two skills. An optional desktop companion connects to your Proppi account through a supported client's sign-in flow.

This repository contains generated distribution files. Proppi maintains them in its main repository; changes arrive through reviewed releases. Do not edit distribution files here.

Already using Proppi? The short [customer guide](CUSTOMER_GUIDE.md) covers connecting your account, a first task, upgrades, help and disconnecting.

Read the [changelog](CHANGELOG.md) for this version's changes, compatibility and any action you need to take.

## Let your assistant help

Copy this sentence into your supported assistant:

> Help me install Proppi Agent from https://github.com/ProppiAI/ProppiAI-Agent using the README, then verify the setup.

Installation still depends on your app's plugin support and workspace policies. Never paste passwords or tokens into a conversation.

## Add it directly

Choose a supported route and pin version **1.0.0**. You do not need to make this repository your project workspace.

### Terminal marketplace

For Codex, register the versioned marketplace, then open `/plugins` and install **Proppi Agent**:

```sh
codex plugin marketplace add ProppiAI/ProppiAI-Agent --ref v1.0.0
```

For Claude Code:

```sh
claude plugin marketplace add https://github.com/ProppiAI/ProppiAI-Agent.git#v1.0.0
claude plugin install proppi-agent@proppi-agent
```

Keep the selected tag to stay on that version. Review the client's marketplace auto-update settings and disable automatic updates if you want to control upgrades. Selecting `main` follows the current distribution. Explicitly change the selected tag when you choose to upgrade.

### Workspace marketplace

An administrator can import `https://github.com/ProppiAI/ProppiAI-Agent` through **Admin > Plugins > Add > Import marketplace**, leaving Path empty. To fix the workspace version, set Ref to the full public commit SHA for the selected release. The administrator controls workspace updates; this does not give each member an independent version choice.

The skills package can work where workspace plugin support permits it. An imported MCP companion is desktop only, including its remote HTTPS connection. Importing it does not grant account access. A live web account connection needs a separately available integration; this release supplies no registered web app identifier.

## Optional account connection

Install **Proppi Agent Desktop** separately only if you want an account connection and your client supports authenticated remote MCP. Use the client's sign-in interface. The public service is `https://agents.proppi.ai/api/mcp`; credentials are not included in this package.

Check installed names, version and skill availability first. Account access and real property actions require a separate, explicit request. Do not use an account search or business action as an installation check. Review the proposed target, changes and consequences before approving an external action.

## Versions and support

Published versions use `v1.0.0` tags. The release manifest records the source commit, file hashes and compatibility. Proppi's publishing process refuses to replace an existing version with different files. Platform-enforced release immutability is reported separately; a hash is an audit record, not a signature proving origin.

Support is confirmed per release. No end-of-support date has been announced. Immutable client files do not freeze the remote service or guarantee indefinite compatibility.

Verify this checkout locally with Node.js:

```sh
node verify.mjs
```

This checks file integrity and extra files, without connecting to a Proppi account. It does not authenticate the publisher or prove the remote service works.

Technical installation references: [terminal marketplace](https://developers.openai.com/plugins/build/plugins), [compatible marketplace](https://code.claude.com/docs/en/discover-plugins), [workspace administration](https://learn.chatgpt.com/docs/enterprise/plugin-management).
