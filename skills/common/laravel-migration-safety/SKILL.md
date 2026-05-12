---
name: laravel-migration-safety
description: Use when creating, changing, renaming, reviewing, or backfilling Laravel database migrations, especially when deployment status is unknown.
---

# Laravel Migration Safety

Database migrations are production history. Handle them as append-only unless you know the migration has not been deployed.

## Quick Workflow

1. Determine deployment status: deployed, not deployed, or unknown.
2. If deployed or unknown, create a forward migration instead of editing the old migration.
3. If not deployed, editing the original migration is allowed only after noting who must rerun migrations.
4. Identify data impact: table, column, index, foreign key, enum/status values, backfill, irreversible change.
5. Add or update tests, factories, seeders, API resources, and docs affected by the schema change.
6. Run the smallest migration/test commands that prove the change.

## Safety Rules

- Do not change timestamps on existing migrations unless the user explicitly requests it.
- Do not drop columns, tables, indexes, or data without calling out the data loss.
- When modifying a Laravel column, preserve existing attributes in the migration.
- Prefer nullable/additive changes before destructive cleanup when rolling out in phases.
- Backfills should be idempotent or guarded so they can be retried safely.

## Response Checklist

- Deployment judgment and chosen approach.
- Data impact and rollback limitations.
- Backfill or compatibility plan.
- Tests and commands run.
- Remaining product, DBA, or rollout decisions.
