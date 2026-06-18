---
name: Wouter nested-route navigation (insight-strategy-lab)
description: Navigating with setLocation from inside a wouter <Route nest> must use the "~" absolute prefix, or paths get the nested base prepended.
---

# Navigating out of a nested wouter router

Admin routes are mounted under `<Route path="/admin" nest>` and `AdminLayout`
renders inside it. Any `useLocation()` obtained inside that subtree is scoped to
the `/admin` base, so `setLocation("/admin/login")` resolves to
`/admin/admin/login` (base is prepended), which matches nothing.

**Symptom:** signing out of admin left a blank page / redirect loop — the guard
effect kept firing the broken redirect while `AdminLayout` rendered `null`.

**Fix / rule:** to navigate to an app-root path from inside a nested router, use
wouter's `~` prefix, e.g. `setLocation("~/")` (public home) or
`setLocation("~/admin/login")`. The `~` escapes the nested base and resolves
relative to the top `<Router base=...>`.

**Why:** wouter (v3) scopes nested routers; non-`~` paths are always relative to
the nearest router base.

**How to apply:** components rendered under any `<Route nest>` (currently the
admin shell) must use `~`-prefixed targets when sending the user outside that
nest. Top-level pages like Login (rendered by the outer Switch) do not need it.
