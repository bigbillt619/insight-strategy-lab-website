---
name: BOS maturity diagnostic replaced rule-based recommendation diagnostic
description: insight-strategy-lab's /diagnostic tool is a scored 6-pillar assessment, not a trigger/value recommendation engine.
---

The diagnostic is a scored Business Operating System (BOS) Maturity
Assessment: 6 fixed pillars answered 1-5, summed into an overall score mapped
to fixed maturity level bands. The questions, scoring, level bands, and risk
labels are intentionally code constants, not CMS/DB-editable — they're the
ISL signature framework and must not drift from an admin screen.

**Why:** a database-driven trigger/value recommendation-rule table was tried
previously and deliberately retired in favor of this fixed scoring model.

**How to apply:** do not reintroduce a DB-backed rule/recommendation table for
this diagnostic. The old demographic lead-qualifier fields (business type,
team size, etc.) have no equivalent under pillar scoring — don't assume they
can be prefilled from assessment answers; confirm with the user before adding
qualifier UI back.
