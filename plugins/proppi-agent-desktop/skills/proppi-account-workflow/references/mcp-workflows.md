# Connected Proppi workflows

Reviewed source catalog: `20261015.d3ad65d0`.

This map follows the main application's tool contracts. It does not assert the same build is deployed or available to every account. Discover current tools, read their full schemas and use returned IDs. The service's schema and permission results govern each call; the catalog version is a maintainer check, not an installation gate.

## Contents

- [Find records and document evidence](#find-records-and-document-evidence)
- [Generate and review work](#generate-and-review-work)
- [Create a sourced property](#create-a-sourced-property)
- [Prepare and publish a listing](#prepare-and-publish-a-listing)
- [Review rental and maintenance work](#review-rental-and-maintenance-work)
- [Approve a saved action](#approve-a-saved-action)
- [Handle failures and capability limits](#handle-failures-and-capability-limits)

## Find records and document evidence

| Need | Tool and input notes |
| --- | --- |
| Resolve a property | `proppi_list_properties` with optional `search`, `type`, `status`. Select the returned property UUID. |
| Search property documents | `proppi_search_documents` with optional `property_id`, `search`, `category`, `page`, `limit`. Date filters require `date_type` alongside `date_from`/`date_to`; preserve issued, due and billing-period roles. Follow pagination. |
| Read recorded property/financial facts | `proppi_query_property_data`: optional `property_ids` and `fields` are comma-separated strings, not arrays; `category` is optional. Preserve exact amounts, currencies and conflicting provenance. |
| Read/correct extracted facts | `proppi_list_document_facts({document_id})`; after the member's instruction use `proppi_confirm_document_fact` or `proppi_correct_document_fact` with `document_id`, `fact_id`, `fact_type`, and the correction schema's value/currency. Corrections change records. |
| Read processing state or source file | `proppi_get_document_status({documentId})` and `proppi_get_document_download({documentId})`. These two use camelCase. Download only the relevant file; do not expose unrelated private material or signed URLs publicly. |
| Ask a sourced question | `proppi_ask({message})`. Follow actual returned citations. Use `proppi_poll({pollToken})` only when an actual response supplies a poll token. |
| Store a supplied document | `proppi_store`: exactly one of `file` or `content`. Host file handoff requires `file.download_url` and `file.file_id`; base64 content needs actual complete bytes plus `fileName` and `mimeType`. Never invent a file URL or claim an upload from a filename. |
| Fix property association | `proppi_assign_documents_to_property({document_ids,property_id})`; `property_id: null` unassigns. This changes internal links and can make work stale; it does not reprocess documents. |
| Reprocess a selected file or batch | Discover current `proppi_reprocess_document` alternatives: one `document_id`, or `document_ids` plus `request_id` for a batch. `proppi_select_documents_for_reprocessing` only presents selection. Processing can call external providers. |
| Inspect document coverage | `proppi_get_document_stats({})` reads the available summary; `proppi_list_expiring_documents` accepts optional `days_ahead`. These are account reads, not installation checks. |
| Retry a failed processing stage | `proppi_retry_failed_document_stage({document_id,stage})` retries the supported failed stage. Use the current schema's stage value and check the recorded outcome. |

File storage returns a document ID and processing state. Track that ID with the status tool; queued is not processed. Listing photos use the dedicated listing-photo tool below.

## Generate and review work

For a brief based on account documents, first resolve the property and inspect the relevant sources. Then call `proppi_start_chat_brief` with `request`, `title`, and the resolved `property_id` when applicable. The request describes the question and evidence scope. **This tool currently has no `document_id` or `document_ids` parameter.** Do not promise that only an exact selected subset will be used: if that restriction is essential, prepare the brief from the retrieved sources in chat or use a supported Member selection flow. Set `allow_thin_context` only when the member explicitly chooses to proceed despite limited evidence.

Retain returned `taskId` and `deliverableId`. Use `proppi_get_task({task_id})` for progress and `proppi_get_deliverable({deliverable_id})` for actual content, source references and state. Present the ready result for review. A request to preview without saving permits a chat draft; starting server work persists a task/draft, so explain that distinction when the request forbids any storage.

After the user approves the exact ready brief, call `proppi_accept_deliverable` with `deliverable_id` and `expected_review_token` copied from that reviewed deliverable's `reviewToken`. On a stale/conflict response, re-read the result; never remove the token to bypass review. `proppi_request_deliverable_changes({deliverable_id,feedback})`, `proppi_retry_chat_brief({deliverable_id})` and `proppi_dismiss_deliverable({deliverable_id})` serve different user intentions; follow their actual returned state.

For general work tracking, use `proppi_list_tasks`, `proppi_get_task`, and `proppi_create_task({title,request,property_id?})`. Task creation records work without starting a generic execution engine. `proppi_answer_task_clarification` supplies missing information. `proppi_approve_task` applies only to supported suggested preparation/retry kinds; it does not accept a deliverable or authorise external delivery. `proppi_cancel_task({task_id})` saves a cancellation proposal; complete the specific approval flow below before reporting cancellation.

`proppi_list_deliverables` supports `status`, `job_type`, `limit`, `cursor`; do not invent a `property_id` filter. Check returned property/source association. For attention and calendar work, use `proppi_list_attention_items`, `proppi_get_attention_history`, `proppi_update_attention_item`, `proppi_list_upcoming_events`, `proppi_create_event` and `proppi_create_reminder` as requested. Record exact dates/timezones and distinguish a saved internal reminder from a delivered message.

## Create a sourced property

1. Read `proppi_get_property_creation_guide({})` and check `proppi_list_properties` for an existing property.
2. Gather the required country/jurisdiction, property sector/type and address. The caller AI performs any requested public research using available browsing; Proppi does not fetch research URLs on its behalf.
3. Build `fields` and `sources` using the guide's current schema. Attach actual user/web provenance to supplied nonempty values. `occupancyType` and `yearBought` must come from the user; public sale history is not proof of the member's purchase year. Keep uncertain/missing facts explicit.
4. Call `proppi_prepare_property_creation({fields,sources})`. Read and show the saved proposal. To replace a proposal, use its saved action ID as `replacesActionId` and review the replacement.
5. With explicit consent to that proposal, call `proppi_approve_property_creation({action_id})`. Report creation only from an executed result containing persisted `propertyReceipt.propertyId`/`propertyUrl`.

For an existing property's `property_prefill` deliverable, direct field-selection acceptance to Member. The MCP accept tool does not apply that deliverable type; do not substitute whole-record acceptance.

## Prepare and publish a listing

The full preparation workflow currently targets **New Zealand sale listings on Trade Me**. An empty workspace may accept sale/rent purposes, but that does not establish complete rental publication support. Australian channels, rent/bond/availability details and account eligibility require actual supported service capability.

1. Reuse existing work: `proppi_list_campaigns({property_id})`, `proppi_list_platform_listings({campaign_id})`, then `proppi_get_listing_workspace({listing_id})`. When requested and absent, `proppi_create_platform_listing({property_id,purpose,platform:"trade_me"})` creates/reuses an empty workspace and campaign. Its ID is a Proppi UUID, not a numeric Trade Me ID, property ID, campaign ID or URL.
2. Read the workspace's revision, readiness and `workflow` suggestions. `proppi_prepare_listing_publication({listing_id,expected_revision})` binds existing eligible connection/preparation work; it does not publish. Resolve returned setup/eligibility blockers without claiming signing in guarantees permission to list.
3. Obtain provider choices with `proppi_list_trade_me_listing_choices({listing_id,...})`. Use returned opaque choice IDs and typed attribute metadata. Save requested edits through `proppi_update_listing_workspace({listing_id,expected_revision,...changedFields})`; preserve unmodified fields. Refresh the returned revision after every edit.
4. For AI-authored copy, `proppi_submit_listing_content` saves a reviewable deliverable with `property_id`, `title`, `body`, `draft_kind`, `grounded_on` source document UUIDs, and `listing_id` for `platform_listing`. After review, accepting listing content needs `expected_listing_revision`; the chat brief's `expected_review_token` requirement does not apply to listing content. Acceptance applies copy and clears old approval, without publication.
5. Upload a supplied photo with `proppi_upload_listing_photo({listing_id,expected_revision,file:...})` or its complete base64 alternative. Set ordered existing photos with `proppi_set_listing_photos({listing_id,expected_revision,document_ids})`; first is primary. Use actual user-selected assets.
6. Validate the current draft with `proppi_validate_listing_draft({listing_id,expected_revision})`; inspect `proppi_get_listing_publication_preview({listing_id})`. Show content, destination, account/environment, photos and any returned fees or limitations. Do not infer an absent fee as free.
7. Use `proppi_submit_listing_for_review({listing_id,expected_revision})`, then `proppi_approve_listing({listing_id,expected_revision})` only with the member's approval of that exact revision. A request merely to see a draft stops before approval.
8. For an explicitly requested publication, create a saved proposal with `proppi_request_listing_publication_approval({platform_listing_id,idempotency_key})`. Retain the key for that attempt. Show/read the saved action and obtain consent to its actual destination and revision. Approve via `proppi_approve_listing_publication({action_id,confirmation:"publish"})`.
9. Retain returned `publication.operationContextId`. Call `proppi_get_listing_publication_outcome({operation_context_id})` until the returned state supports the reported outcome. A queued job or an older live URL is not proof the new revision is live. Do not use `job_id` with this tool.

Use `proppi_return_listing_to_draft` for a requested new edit, with the exact current revision and a recovery version only when the service supplies one. Read enquiries through `proppi_list_listing_enquiries`; no enquiry-reply tool is implied. `proppi_create_campaign({property_id,purpose})` creates/reuses a standalone empty campaign when that is the requested work; it does not prepare content or publish a listing.

## Review rental and maintenance work

`proppi_prepare_healthy_homes_review({property_id})` creates a New Zealand review draft. It is not a compliance certificate. For rental renewal notices, `proppi_prepare_rental_renewal_notice_review` requires `property_id`, actual `source_lease_document_ids`, `jurisdiction` and the current `lease` schema; include the Australian `state` where applicable and preserve unknown lease facts. Read/review/accept the result before requesting delivery.

An accepted rental notice still has not been sent. Use `proppi_request_rental_renewal_notice_send_approval({deliverable_id})`, show the saved recipient and content, then use the specific send approval after explicit consent. Read the deliverable's `sendOutcome` before claiming delivery.

Accepted Healthy Homes/Inbox-to-Done work can create internal events, reminders or links. A maintenance reply draft remains a draft. There is no general contractor-dispatch, payment or arbitrary outbound-message tool.

## Approve a saved action

Read `proppi_get_pending_action({action_id})` or discover relevant actions with `proppi_list_pending_actions`. Review the exact target, action type, proposal, expiry and current state. Match the tool to the returned type; never use a general approval for a different operation.

| Saved action type | Approval tool | Arguments |
| --- | --- | --- |
| `CreateProperty` | `proppi_approve_property_creation` | `action_id` |
| `CancelMemberTask` | `proppi_approve_task_cancellation` | `action_id` |
| `ComplianceFollowup` | `proppi_approve_compliance_followup` | `action_id` |
| `RenameDocument` | `proppi_approve_document_rename` | `action_id` |
| `SoftDeleteDocument` | `proppi_approve_document_deletion` | `action_id` |
| `SendRentalRenewalNotice` | `proppi_approve_rental_renewal_notice_send` | `action_id`, `confirmation: "send"` |
| `PublishPlatformListing` | `proppi_approve_listing_publication` | `action_id`, `confirmation: "publish"` |

The first five do not take a `confirmation` field. The send/publish literals are machine arguments used only after actual user consent. For a declined proposal use `proppi_reject_pending_action({action_id})`. To prepare a document rename/bin action, use `proppi_request_document_action_approval` with `document_id`, the discovered `action_type` and `new_title` when renaming. Moving to the bin is not permanent deletion.

## Handle failures and capability limits

- On an authentication/permission error, use the client's existing connection flow and report the specific denied operation. Do not request server credentials.
- On a missing tool or schema mismatch, refresh discovery and inspect the current contract. Never guess replacement names or silently downgrade approval.
- On a stale review/revision, reload and review changed content before another approval. Never invent source versions, review tokens, choice IDs or receipts.
- On a timeout, inspect the saved task/action/deliverable or publication outcome. If external effects are uncertain, report uncertainty and avoid another send/publication attempt until reconciled.
- Accounting support here means evidence retrieval, preserved amounts/currencies, fact review and briefs. It does not post ledger entries or move money. Local service coordination still needs a supported channel and explicit user instruction.
