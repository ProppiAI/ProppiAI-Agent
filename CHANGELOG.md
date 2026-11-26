# Proppi Agent changelog

Each entry belongs to the named package version. A version entry is not proof of a published Release; official source snapshots can be installed before publication.

## [Unreleased]

Not yet in a published version.

## [1.1.2]

### Added

- No new skills. The connected workflow reference describes result fields the service now returns (`hasMore`, `total`, `nextPage`, `nextCursor`, `filtered`, `listedStatus`, `matchesLedger`, `alreadyApproved`, an event's `time` and `timezone`) so an assistant can tell part of a list from all of it, and a draft or a queued send from a finished one.

### Fixed

- The README named `generated-code` as the repository's default source ref. The default branch is now `main`, and the README says so. An install whose marketplace source names `generated-code` as its ref can no longer update from it; point that source at `main`. Installs that follow the default branch need no action.
- A change request that regenerates an Inbox-to-Done draft answered "Proppi is preparing a revised brief". It now says a revised draft is being prepared and is not ready to review until `proppi_get_deliverable` reads it as `ready_for_review`.
- `proppi_prepare_tax_summary` returned a tax summary already open for the year with the figures it was frozen with and nothing saying the property's ledger had changed since, so an assistant could present out-of-date rent and expenses as the year as it stands. It now returns `matchesLedger`, and when that is false its text says the figures differ from the ledger as it reads now and to re-read them with `proppi_request_deliverable_changes`. That call re-reads a tax summary in place and now reports it as ready for review again (`finalStatus` `ready_for_review`) instead of "changes requested". The connected workflow reference describes both and records MCP catalog `20261124.7ea34cde`.
- A task's history from `proppi_get_task` can now carry an `accept_outcome` event, the member's acceptance of a completed step's result. The connected workflow reference says a completed task is not an accepted one without that event, and that acceptance is recorded in the Proppi app.
- Approving a rental renewal notice send now returns the queued notice's deliverable and where to read its email outcome, and says the email is queued, not delivered. The connected workflow reference names the actual `deliverable.rentalRenewalSendOutcome` field instead of `sendOutcome`.
- Retrying an approval whose action already ran (for example after a lost response) now returns the recorded outcome with `alreadyApproved: true` and runs nothing, instead of an "Action is not pending" error that made an executed send or publication look failed.
- The confirmation panel now reports an approved rental renewal notice send as queued, not delivered, only when the approval returns the queued `delivery` receipt, and passes that receipt to the assistant so it reads the delivery result; without the receipt it says the email could not be confirmed as queued. A replayed renewal send, or a replayed action without its own receipt, says nothing was run again. The connected workflow reference describes the panel hand-off and records MCP catalog `20261106.5f379be8`.
- `proppi_reprocess_document`, the document query's selection guidance and the document selection panel no longer say reprocessing "starts fresh processing": it clears extracted data and queues processing, which has not finished when the request returns; it is refused only while a processing stage is running, and queued stages are cancelled and replaced. The connected workflow reference says the same and records MCP catalog `20261107.d141fa8b`.
- `proppi_list_pending_actions` with a `limit` now says when more actions are waiting than it returned (`total`, `hasMore` and a note in the text), so an assistant does not report part of the approval queue as all of it. The connected workflow reference says so and records MCP catalog `20261107.8ec6e6a2`.
- Listing documents that expire soon returned at most 10 and counted them as the whole window, so an assistant could tell a landlord with more expiring policies or certificates that only 10 expire. It now lists up to 50, soonest first, and `hasMore` with a note says when the window holds more. The connected workflow reference says so and records MCP catalog `20261107.5bb32246`.
- Accepting a Healthy Homes, Inbox-to-Done or rental renewal notice deliverable through the assistant now requires the `reviewToken` from the read the user reviewed, as chat briefs already did. A draft regenerated after that review is refused as stale instead of being accepted unseen. The connected workflow reference says so and records MCP catalog `20261107.5bb32246`.
- `proppi_create_reminder` no longer says it adds a reminder: it saves a dated calendar entry and that call sets no reminder notification (a member entry with the same title and date is updated and keeps its reminders; a property entry with the same title and date is refused; a document entry with the same title is moved to the new date), and its result now says so. The connected workflow reference tells the assistant never to say a reminder was set.
- `proppi_get_document_stats` no longer claims processing-status counts; its description and result name the "unresolved" count as the member's uploads awaiting a property link.
- Tool descriptions that named internal tool names (`query_property_data`, `list_document_facts`, `prepare_listing_publication`) now name the advertised `proppi_` tools. The connected workflow reference records MCP catalog `20261107.5bb32246`.
- `proppi_list_attention_items` reported its first 20 (or `limit`) items as everything needing attention. It now returns `hasMore` and says when more items need attention than it listed, or when it read only a bounded number of records from a source, including when none of the records read needs attention. The connected workflow reference says so and records MCP catalog `20261107.c8a62190`.
- A rental renewal notice whose send was interrupted before the email service confirmed it (a timeout, a dropped connection, a stopped worker) was retried, so the tenant could receive it twice. It is now never resent: its outcome reads `failed` with a `lastError` starting `Delivery outcome unknown:`, and `proppi_get_deliverable` and the connected workflow reference tell the assistant to report it as possibly delivered, not as not sent. A send the email service refused is still retried.
- Approving suggested work through the assistant (`proppi_approve_task`) now requires the `reviewToken` that `proppi_get_task` returns for that suggestion. A suggestion rewritten by a newer source after the user's read (a different lease, recipient or failed stage) is refused as stale with nothing approved, instead of being approved unseen. The connected workflow reference says so and records MCP catalog `20261108.4326a6eb`.
- `proppi_list_properties`, `proppi_list_deliverables` and `proppi_list_pending_actions` dropped a filter value they did not support and listed everything instead, so asking for archived properties (or a misspelt deliverable status or action type) returned the whole list as if it were the filtered answer. An unsupported value is now refused with the allowed values named and nothing listed; a missing, blank or non-text filter still means no filter. `proppi_list_properties` advertises `status` as `active` or `pending` and says archived properties are never listed. The connected workflow reference says so and records MCP catalog `20261108.9b34dee1`.
- `proppi_query_property_data` dropped any `property_ids` entry that was not a property id, so a property name passed as an id removed the property filter and returned every property's facts, which an assistant could report as the named property's. A name or address in `property_ids` is now refused with nothing queried, and the description says to take the ids from `proppi_list_properties`. The connected workflow reference says so and records MCP catalog `20261108.42434c08`.
- The offline skills `proppi-workflow` and `proppi-evidence-brief` no longer leave room to assign a step to Proppi: they assign execution and follow-up to the owner or someone the owner engages, and say Proppi does not currently arrange trades, inspections, on-site work or accounting services; a step a connected account supports after the owner's approval goes through `proppi-account-workflow`.
- A property search through `proppi_list_properties` treated `_` and `%` in the search text as wildcards, so searching `Unit_2` also listed "Unit 2" and searching `%` listed every property as a match. The search text is now matched literally. The same fix applies to task and calendar event searches in the Proppi app.
- `proppi_list_properties` answered "No properties found." when a search, type or status filter matched nothing, in its text and in the property cards, so an assistant could tell a landlord with properties that they had none. A filtered empty list now names the filters that matched nothing and says to list again without them, the result returns `filtered`, and the cards say no properties match these filters. The connected workflow reference says so and records MCP catalog `20261108.06ee8491`.
- `proppi_list_upcoming_events` returned its first 10 (or `limit`) events as the whole calendar, so an assistant could tell a landlord with more inspections, renewals or deadlines ahead that only those are coming up. It now returns `hasMore` and says when more upcoming events are tracked than it listed, and either how to list more or, at the largest limit, that the rest are in the Proppi app. The connected workflow reference says so and records MCP catalog `20261108.c2d3769d`.
- `proppi_list_tasks` returned at most 50 tasks (or `limit`) with nothing saying more matched, so an assistant could report part of a landlord's open work as all of it. It now returns `total` and `hasMore`, and its text says how many matching tasks are not shown and, once the list is at its maximum of 100, that only narrower filters list the rest. The connected workflow reference says so and records MCP catalog `20261108.0e2e4ee3`.
- `proppi_list_deliverables` with no `status` listed only deliverables ready for review while its description promised every state, and an empty result read "No matching deliverables found", so an assistant could tell a landlord with a failed or still-preparing draft that there was no work. The result now names the status it listed (`listedStatus`) and says how to list the others, and a full page says more match (`hasMore`) and which `cursor` reads the next one with the same filters. An empty list filtered by `job_type` names that type rather than saying no deliverable has the status. The connected workflow reference says the same and records MCP catalog `20261108.69d39ef6`.
- `proppi_list_listing_enquiries` returned a page of Trade Me enquiries as JSON with nothing saying whether more pages followed, and a page past the last one came back empty, so an assistant could report the first page as every enquiry, or a listing with enquiries as having none. The result now returns `hasMore` and `nextPage` and starts with which enquiries the page shows and whether it is the last; a page past the end says how many enquiries the listing has and which pages hold them. When Trade Me's count and its pages disagree (an empty or short page inside the count), the text says so, claims no position, and `hasMore` stays true. The connected workflow reference says so and records MCP catalog `20261108.dab2c140`.
- The brief panel showed a brief that is still preparing, failed or expired as an empty "Prepared brief". It now says what the status means: still being prepared, could not be prepared (nothing to review or accepted, and it can be retried), or expired before it was reviewed (it can no longer be accepted). The connected workflow reference records MCP catalog `20261108.7a9062d1`.
- While a requested revision of a brief is being prepared, or after it failed, the brief panel showed the earlier text under the brief's title with only the status to say anything had changed, so it could read as the revision. It now says the text is the earlier version, not the revision. The connected workflow reference records MCP catalog `20261108.bf0c3df2`.
- `proppi_list_upcoming_events` ordered events on the same date by an internal id, so a list cut inside a day could leave out that day's 9:30 inspection and show its 16:00 viewing, and it gave only the date of a timed event. Events on a date are now listed all-day entries first, then by local time, and each timed event returns `time` and `timezone`, shown in the table as the date, time and zone. The connected workflow reference says so and records MCP catalog `20261108.f1c115aa`.
- `proppi_search_documents` answered a page past the last one with "No matching documents found", although the search had matches, so an assistant reading one page too far could tell a landlord a policy or certificate did not exist; a page with more after it said only the total. An empty page past the end now says how many documents match and on which pages, and every page says which documents it shows and whether to read the next one. The connected workflow reference says so.
- `proppi_list_expiring_documents` read a `days_ahead` it could not use (text such as `"14"`, a fraction, zero or a negative number) as no window and listed the default 90 days, so a request for what expires in the next fortnight could come back as the 90-day list. Such a window is now refused with the accepted range and nothing listed; an omitted or null `days_ahead` still lists 90 days, and a window over 365 days is still capped at 365 and says so.
- `proppi_list_upcoming_events` read a `limit` it could not use (text such as `"30"`, a fraction, zero or a negative number) as no limit and listed the default 10, while its "a larger limit lists more" note invited the same call again. Such a limit is now refused with the accepted range and nothing listed; an omitted or null `limit` still lists 10, and a limit over 50 is still capped at 50.
- `proppi_list_properties` and `proppi_search_documents` dropped a search sent as a list or an object (`["Queen Street"]`, `{ "text": "water rates" }`), so every property or document in scope came back as if it matched. Such a search is now refused with nothing searched; text and numbers are searched as before, and a null or true search still means no search.
- `proppi_search_documents` read a `limit` it could not use (text such as `"30"`, a fraction, zero or a negative number) as no limit and paged by 10, while its page guide said to read the next page "with 10 per page". Such a limit is now refused with the accepted range and nothing searched; an omitted or null `limit` still pages by 10, and a limit over 50 is still capped at 50.
- `proppi_list_deliverables` read a `limit` it could not use (text such as `"5"`, a fraction, zero or a negative number) as no limit and returned a page of the default size. Such a limit is now refused with the accepted range and nothing listed; an omitted or null `limit` still returns the default page, and a limit over 100 is still capped at 100.
- `proppi_list_properties`, `proppi_list_deliverables` and `proppi_list_pending_actions` dropped a filter sent as a list, an object or a number (`status: ["pending"]`, `action_type: { "type": "SoftDeleteDocument" }`), so the whole list came back as if it were the filtered answer. Such a filter is now refused with the allowed values named and nothing listed; a null, true, false or blank filter still means no filter.
- A `proppi_list_properties` result narrowed by a search, type or status filter was headed "(N total)" and its property cards showed nothing to say it was filtered, so an assistant or a landlord could read the matches as the whole portfolio. The text now says how many match which filters and that properties outside them are not shown, the cards say the list is filtered, and an empty unfiltered panel says archived properties are never listed, as the text already did. The connected workflow reference says the same and records MCP catalog `20261117.48f86fe5`.
- `proppi_list_tasks` narrowed by a `status`, `kind` or `property_id` filter said only "N task(s) found.", so an assistant could read the matches as all of the member's work, and an empty match as none at all. The result's `message` and text now name the filters, say tasks outside them are not shown, and for an empty match say to list again without them before saying the member has no work. The connected workflow reference says the same.
- `proppi_list_expiring_documents` lists only expiry dates from today onwards, but an empty window said only "No documents expiring within 90 days", so an assistant asked whether anything had lapsed could report nothing lapsed while a policy or certificate had already expired. Every listed answer now says documents whose expiry date has already passed are not listed, and that this does not mean nothing has lapsed. The connected workflow reference says the same.
- An empty `proppi_list_attention_items` queue said only "No attention items found", although the queue reads expiring documents from today onwards and never includes one that has already expired, so an assistant could report nothing lapsed while a policy or certificate had. The empty answer now says already-expired documents are not included and that this does not mean nothing has lapsed. The connected workflow reference says the same.
- `proppi_list_pending_actions` narrowed by `action_type` answered as if that type were the whole approval queue: an empty match said only "No action is available for confirmation." (or "No pending actions found."), so an assistant could tell a landlord nothing was waiting while an action of another type was. A type-filtered list, empty or not, now says actions of other types are not shown and to list again without `action_type` before saying nothing else is waiting (in the text and in `message`).
- `proppi_list_upcoming_events` lists events dated from today onwards only, but its answers did not say so: "No upcoming events found." could be read as no deadline having passed while a compliance deadline or inspection was already overdue. Every answer that read the calendar now says events dated before today are not listed and that this does not mean no deadline has passed.

### Breaking changes

- None in the package: no skill, file or installation route was removed. The service already requires the `reviewToken` from the user's read when an assistant accepts a Healthy Homes, Inbox-to-Done or rental renewal notice deliverable or approves suggested work, and refuses an unsupported filter value or `limit` instead of ignoring it; this version's reference tells the assistant to send them. A marketplace source pinned to the retired `generated-code` ref no longer receives updates; point it at `main`.

### Compatibility

- Same service and installation routes as 1.1.1, from the repository's default branch `main`. The connected workflow reference was reviewed against MCP catalog `20261126.3f11f561`; available tools still depend on the deployed service and account permissions.

### Upgrade action

- Update the official marketplace source (on `main`) and the installed desktop companion. Refresh the client's discovered tools if its catalog is stale. No reconnection is needed.

## [1.1.1]

### Added

- No new skills or capabilities; this version corrects the connected workflow reference.

### Fixed

- The connected workflow reference now matches the current MCP tool contracts: what a change request starts for each kind of prepared work (and which kinds refuse one), how revised Healthy Homes and rental renewal work starts, the `sale`/`rental` campaign purpose versus the `sale`/`rent` listing purpose, listing validation environments, primary listing photos, enquiry paging, viewing a document inline versus downloading it, current facts versus their history, task inputs and filters, the exact task approval kinds (including that approving a document retry can call external processing providers), attention-item actions, rental renewal recipients and country codes, and recovering a lost publication receipt without approving again.
- The reference records the MCP catalog it was reviewed against, and its tool table is reformatted for readability.

### Breaking changes

- None. No tool, endpoint or account migration; the offline skills are unchanged.

### Compatibility

- Same service and installation routes as 1.1.0. The corrected guidance was reviewed against MCP catalog `20261105.da2b6c85`; available tools still depend on the deployed service and account permissions.

### Upgrade action

- Update the official marketplace source and the installed desktop companion. Refresh the client's discovered tools if its catalog is stale. No reconnection is needed.

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
