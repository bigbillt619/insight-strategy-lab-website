# `/diagnostic` — Lead-Gen Diagnostic Tool: Deep-Dive Assessment

Focused technical breakdown of the diagnostic tool only, prepared for another AI/developer to review and edit.

---

## 1. Purpose

A 5-question interactive wizard on `/diagnostic` that qualifies a visitor, computes a data-driven "recommended system" for their business, then captures them as a lead with full context. This is the site's primary lead-generation mechanism (the other is the plain `/contact` form).

---

## 2. User Flow (state machine, all client-side)

The page is a single component (`src/pages/public/Diagnostic.tsx`) driven by one `step` integer with no routing per step:

1. **Steps `0` to `N-1`** — one question at a time, single-choice radio buttons, auto-advances 300ms after selecting an answer (no "Next" button click needed).
2. **Step `N` (`isComplete`)** — recommendation is computed and shown, immediately followed by...
3. **Step `N+1` (`showLeadForm`)** — same screen also renders the lead-capture form below the recommendation (name, email, phone, message, plus the 5 qualifier fields **pre-filled** from the diagnostic answers but still editable).
4. **Step `> N+1` (`isFinished`)** — thank-you screen with a link back home.

There are 5 questions today (`business_type`, `company_size`, `biggest_bottleneck`, `current_tools`, `revenue_range`), defined in `src/features/diagnostic/questions.ts`. Adding/removing a question only requires editing that one array — the wizard step count adapts automatically.

---

## 3. Recommendation Engine

Pure function `computeRecommendation(answers, map)` in `src/features/diagnostic/api.ts`:

- `map` is the full `recommendation_map` table (loaded once via `useRecommendationMap()`), rows shaped as `{ trigger_type, trigger_value, recommended_systems: string[], rationale, priority }`.
- For each answered question, find every rule where `trigger_type === question key` and `trigger_value === the given answer`.
- Sort matches by `priority` descending.
- Flatten `recommended_systems` across matches, deduped, preserving priority order → first item is `primary`, next two are `also_consider`.
- `why` = the rationale text of the highest-priority match that has one, or a generic fallback sentence if none of the matched rules have rationale text set.

**This is entirely data-driven** — no hardcoded business logic maps answers to systems. All of it lives in the `recommendation_map` table, edited by the owner via the admin **Recommendation Map** tab (`RecommendationManager.tsx`): add/edit/delete rules, each rule = one trigger (question + answer) → list of systems + rationale + priority.

**Known limitation:** the matching is single-answer-per-rule (one `trigger_type`/`trigger_value` pair per row) — there's no support for compound rules (e.g., "business_type = gym AND company_size = solo"). If the owner wants more nuanced logic (e.g., different recommendation when bottleneck + revenue combine a certain way), the schema would need multi-condition rules, and `computeRecommendation` would need a rewrite from a flat filter to rule-group matching.

---

## 4. Data Captured & Persistence

Two writes happen on lead-form submit, in `handleLeadSubmit`:

1. **`leads` table** (via `useCreateLead` in `src/features/leads/api.ts`) — the primary, must-succeed capture: name, email, phone, message, `source` (`"diagnostic"` or `"vehicle_qr"` if the visitor arrived via the QR landing page — tracked through `sessionStorage.isl_lead_source`), plus the 5 qualifier answers as separate columns (`business_type`, `company_size`, `biggest_bottleneck`, `current_tools`, `revenue_range`).
2. **`diagnostic_results` table** (via `useSaveDiagnosticResult`) — best-effort only: full raw `answers` object + the computed `recommendation` output, linked by `lead_id`. Wrapped in its own try/catch so a failure here does **not** block the user from reaching the thank-you screen — the lead is already captured at that point. This is a deliberate resilience choice: losing the diagnostic detail is acceptable, losing the lead is not.

**RLS note:** `useSaveDiagnosticResult`'s insert has no `.select()` — this is intentional so the anonymous/public insert policy only needs `INSERT`, never a `SELECT` grant on `diagnostic_results`. Any AI editing this must preserve that pattern or it will either break for anonymous users or over-grant read access on a table containing raw lead answers.

---

## 5. Content/Copy Editability

Nearly all copy on this page is CMS-driven via `useContent("diagnostic")`, not hardcoded:
- Wizard intro (`wizard_intro_eyebrow`, `wizard_intro_body`, `wizard_outcome_heading`, `wizard_outcome_items` — newline-separated list), SEO title/description
- Recommendation screen labels (`report_label`, `report_opportunity_prefix`, `report_also_consider`)
- Lead form (`form_heading`, `form_body`, `form_message_placeholder`, `form_submit`)
- Finished screen (`finished_heading`, `finished_body`, `finished_button`)

**Not editable via CMS** (hardcoded in `questions.ts`, requires a code change): the actual question text, helper text, and answer options. This is an intentional boundary — question logic is structural/coupled to the recommendation engine, whereas surrounding marketing copy is not.

---

## 6. Dependencies Between Diagnostic and Other Features

- **Vehicle QR landing page** (`/vehicle-qr-code-1`) sets `sessionStorage.isl_lead_source = "vehicle_qr"` before sending visitors to `/diagnostic`; the diagnostic reads and clears that key on submit so lead source attribution survives the hop between pages. Any migration must preserve `sessionStorage` behavior across that route boundary (not an issue if staying client-side SPA; would need explicit handling if migrating to multi-page/SSR).
- **Admin Leads Pipeline** (`LeadManager.tsx`) displays leads with a source filter that includes `"diagnostic"` vs `"vehicle_qr"` — depends on the `source` value written here staying consistent.
- **Admin Recommendation Map** (`RecommendationManager.tsx`) is the only place rules are authored; it depends on `DIAGNOSTIC_QUESTIONS` (from `questions.ts`) to populate its trigger-type/trigger-value dropdowns, so the two files are coupled by the `key`/`value` strings — renaming a question `key` or an option `value` silently orphans any recommendation rules referencing the old string (no cascade/validation exists today).

---

## 7. Known Gaps / Risk Areas Specific to This Tool

1. **No compound-condition rules** (see Section 3) — flat single-answer matching only.
2. **No validation that a `recommendation_map` rule's `trigger_value` still matches a live option** in `questions.ts` — if an admin edits/removes an answer option in code, existing rules referencing the old value silently stop matching (no error surfaced anywhere).
3. **No conversion tracking** — GA4 is wired for page views only; diagnostic completion / lead submission is not fired as a GA4 event yet (flagged in the broader project assessment too).
4. **`diagnostic_results` failures are silently swallowed** (`console.error` only) — acceptable given the resilience rationale in Section 4, but means the owner has no visibility if this table is failing to write for many/all users (e.g., a schema drift). Worth a lightweight alerting hook if this table's data becomes business-critical.
5. **Revenue range question is optional in spirit** (helper text says "Optional") but the wizard still requires an answer to advance since all questions use the same single-choice-required UI — there's no actual skip mechanism. Minor UX inconsistency between the copy and the behavior.

---

## 8. What Another AI Needs to Preserve on Any Rewrite/Migration

- The `key` strings in `questions.ts` must exactly match the `trigger_type` values already stored in the live `recommendation_map` table — do not rename without a data migration.
- The anonymous insert-only RLS pattern on `diagnostic_results` (Section 4).
- The `sessionStorage` lead-source handoff from the QR page.
- The "lead capture must succeed independently of diagnostic detail" resilience pattern — don't merge these into a single transaction/request without deciding whether that changes the failure semantics intentionally.
