---
name: Preserve auth and session tables
description: Existing PostgreSQL auth/session tables were not initially represented in the Drizzle schema, making schema pushes propose dropping them.
---

Keep the existing `users` and `sessions` table definitions represented in the shared Drizzle schema. If a schema push proposes dropping either table, stop and resolve the schema mismatch rather than forcing the push.

**Why:** The development database contained user and session records even though those tables were missing from the Drizzle schema; the push warned that applying the diff would delete them.

**How to apply:** Before future schema pushes, inspect any proposed destructive changes. Preserve the existing auth/session tables and apply only the intended additive schema change.
