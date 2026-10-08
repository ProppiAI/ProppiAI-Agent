# Using Proppi Agent

For existing Proppi customers. Start with the two installation routes in the [README](README.md), using an assistant that supports plugins and your workspace's installation policy.

## Connect your existing account

**Proppi Agent** provides two skills for planning work and preparing evidence briefs from information you supply. It does not connect to your account, retrieve records or perform account actions.

If you want account access, add the separate **Proppi Agent Desktop** companion in a compatible client and use its sign-in interface to connect your existing Proppi account. Imported MCP companions are desktop only; adding a GitHub marketplace does not create a live web account connection. Available tools depend on your account permissions and the current service.

Connected tools exchange your explicit requests and permitted account results between your assistant and Proppi.

Review the connection before granting access. For a supported business action, inspect the property, proposed changes, destination and consequences before explicitly approving it. Installing or signing in is not permission to send, publish or change a record. Never paste a password or token into chat. Your existing [privacy policy](https://www.proppi.ai/privacy) and [terms](https://www.proppi.ai/terms), together with your assistant provider's policies, apply.

Check the installed version and any existing account connection first; avoid a duplicate installation or connection. Before updating, confirm the version you intend to use.

## Check setup and try one task

In the plugin directory, check the installed version and the skills **proppi-workflow** and **proppi-evidence-brief**. For the optional companion, inspect the client's connection/sign-in status. These are metadata checks: do not search account records or call a business tool just to test installation.

Try the skills with a small set of notes:

> Use the maintenance notes I paste below to prepare a plan with supplied facts, missing information and decisions for my review. Do not send messages or change account records.

After connecting, a first read-only task is: **“List my properties. Do not change any records.”** Confirm the intended account/workspace before requesting it, then check the returned properties. For a document-backed question, ask about one property and check the source references. This is intentional first use, separate from installation verification. Skills-only drafts use supplied information; they are not proof that work was completed. If a business action fails or times out, inspect its recorded outcome before retrying.

## Choose when to upgrade

Select a released `vX.Y.Z` tag for terminal marketplaces, or have your workspace administrator select that release's full public commit SHA. See the [installation commands](README.md#add-it-directly). Review auto-update settings and deliberately change the selected version to upgrade. Workspace version selection is controlled by the administrator.

Check release notes for compatibility and support before upgrading or staying on an older version. Immutable files do not freeze the remote service or guarantee permanent availability. Check Proppi's account messages and release notes for service changes; the existing terms govern service notices. No support deadline is created by this guide.

## If something does not work

| What you see                               | Next step                                                                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Plugin missing                             | Check your app's plugin support, selected marketplace version and workspace policy; refresh its directory.                  |
| Skills work but account tools are absent   | Check that the optional companion is installed in a compatible client and separately signed in.                             |
| Sign-in or permission error                | Use the client's sign-in flow; check the intended Proppi account and granted access. Do not work around denied permissions. |
| Service unavailable or compatibility error | Check release notes and retry a metadata/status check later. Do not repeat a business action without checking its outcome.  |

For help, use [Proppi support](https://www.proppi.ai/contact) or **contact@proppi.ai**. Include your app, plugin version, the task and a redacted error message. Report security issues privately using [Proppi's security page](https://www.proppi.ai/security) or **security@proppi.ai**. Public repository issues are for non-sensitive distribution problems: do not post tenant/customer details, financial records, private property documents, passwords or tokens there.

## Disconnect or remove it

To revoke account access, use **Proppi Settings → Connectors → Assistant access → Revoke access**, where available, or the assistant provider's permission controls. If the control is unavailable or fails, contact Proppi support. Reconnecting later requires your consent again.

Uninstalling the plugin removes it from that client; separately revoke its account authorization. Revoking access or uninstalling does not delete information already in Proppi or your assistant conversations. Manage those records in the respective service; account/privacy requests can go to **privacy@proppi.ai**, as described in the existing privacy policy.
