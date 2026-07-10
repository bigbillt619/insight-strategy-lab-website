---
name: BOS maturity diagnostic replaced rule-based recommendation diagnostic
description: insight-strategy-lab's /diagnostic tool is now a scored 6-pillar assessment, not a trigger/value recommendation engine.
---

The old diagnostic (demographic questions -> `recommendation_map` trigger/value
lookup -> suggested software) was replaced by a scored Business Operating
System (BOS) Maturity Assessment: 6 fixed pillars (Strategy, People,
Processes, Technology, Data, AI), each answered 1-5, summed into an overall
score (6-30) mapped to 5 fixed maturity level bands.

**Why:** the questions, scoring, level bands, focus areas, and risk labels are
the ISL signature framework and were made intentionally non-CMS-editable code
constants (`features/diagnostic/questions.ts`, `features/diagnostic/api.ts`)
so they can't drift from an admin screen; only surrounding marketing copy
stays CMS-editable.

**How to apply:** if asked to touch the diagnostic again, do not reintroduce
a database-driven trigger/value/rule table for recommendations — that pattern
was deliberately removed (`recommendation_map` table + admin
`RecommendationManager` UI are gone). The old demographic qualifier fields on
leads (business_type, company_size, biggest_bottleneck, current_tools,
revenue_range) are no longer collected anywhere (Diagnostic.tsx and
Contact.tsx lead forms were simplified to name/email/phone/message only) —
those `leads` table columns still exist but are unused; don't wire new UI to
them without confirming with the user first, since the pillar-scored
questions have no equivalent business-identifying qualifiers.
