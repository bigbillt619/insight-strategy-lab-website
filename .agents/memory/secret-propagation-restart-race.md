---
name: Secret propagation vs workflow restart race
description: Why workflow restarts must happen AFTER the secret-added confirmation, not before.
---

When you call `requestEnvVar` it pauses execution. After it resumes, the secret is
NOT necessarily injected yet — the platform delivers a separate
`<automatic_updates>` message ("The following secrets have been added…") once the
secret is actually live in the environment.

**Rule:** Restart any long-running workflow that needs a new secret only AFTER the
secret-added confirmation arrives. A restart issued before that confirmation runs
the process with stale env (the secret is still missing), so it will behave as if
unconfigured even though `requestEnvVar` already returned.

**Why:** A direct `node -e` test from a fresh bash shell will pick up the new secret
(bash env is read fresh each invocation) while the already-running workflow process
does not — producing a confusing "works in my test, fails in the server" split.

**How to apply:** After the secret-added automatic update, restart the relevant
workflow, then re-test the live endpoint. Don't trust restarts fired in the same
turn as (or before) the secret confirmation.
