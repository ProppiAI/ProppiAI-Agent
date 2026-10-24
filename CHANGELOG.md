# Proppi Agent changelog

Each entry belongs to the named package version. A version entry is not proof of a published Release; official source snapshots can be installed before publication.

## [1.1.0]

### Added

- The desktop companion now includes `proppi-account-workflow`, with guidance for connected documents, evidence briefs, property creation, tasks and reviewed listing workflows.
- Operation-specific approvals, current review-token/revision handling and checks for recorded publication or delivery outcomes.

### Fixed

- Account requests now hand off to the connected workflow instead of stopping at the offline skills' capability boundary.
- Installation verification includes the connected skill and its reference. Maintainer tests require a guidance review when the source MCP catalog changes.

### Breaking changes

- No endpoint or account migration. Existing offline skills remain available without an account connection.

### Compatibility

- The companion uses the existing authenticated Streamable HTTP service and a compatible client's sign-in interface. Available tools still depend on the deployed service and account permissions.
- Guidance covers the current source contracts; package verification is not an authenticated production workflow test or a certified Release.

### Upgrade action

- Update the official marketplace source and the installed desktop companion; confirm `proppi-account-workflow` loads alongside the companion's MCP connection.
- Preserve an existing working account connection. Refresh the client's discovered tools if its catalog is stale. Never paste credentials into chat or call business tools merely to test installation.

## [1.0.0]

### Added

- Two skills: property workflow plans and evidence briefs from information you provide.
- An optional desktop companion for connecting your existing Proppi account in a compatible client.
- Two installation routes, a short customer guide and versioned file-integrity metadata.

### Fixed

- Initial distribution; no fixes to an earlier published package.

### Breaking changes

- Initial distribution; no previous package migration.

### Compatibility

- The primary skills package does not require an account connection.
- The optional companion requires authenticated remote MCP support and your account permissions. Imported MCP companions are desktop only.
- There are no earlier published versions of this distribution. Support is confirmed per release; immutable files do not freeze the remote service or promise permanent availability.

### Upgrade action

- Install the current official source ref and record its public SHA when readable. Normal installation does not query tags or Releases or require a particular version.
- Check for an existing installation and account connection first. Review the selected version and auto-update settings before changing them.
- Read the customer guide, verify installation metadata and explicitly choose a first task. Installation verification must not read account records or perform business actions.
