# Proppi Agent changelog

Each entry belongs to the named package version. A version entry is not proof of a published Release; official source snapshots can be installed before publication.

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
