---
name: project-truth-source
description: Use when a task depends on project specs, implementation behavior, tests, or docs that may disagree across files or sources.
---

# Project Truth Source

Use this skill to keep project work anchored when specifications, code, tests, and docs may not agree.

## Core Rules

- Treat named specs and decision docs as the source of intended behavior.
- Treat code and tests as the source of currently executable behavior.
- When intended behavior and executable behavior conflict, stop and list the conflict before changing behavior.
- Prefer the newest explicit decision over older generated docs, but record that precedence instead of silently assuming it.
- Before finalizing, re-check touched files, tests, and generated docs so the response matches the actual workspace state.

## Standard Output

For implementation or review work, include:

1. Impacted layers: database, service, controller, middleware, route, resource, job, scheduler, docs, tests.
2. Synced artifacts: related controllers, services, policies, resources, migrations, tests, docs.
3. Boundary checks: auth, authorization, tenant/project isolation, state machine, rate limit, audit log, data contract.
4. Verification: exact commands run and whether they passed.

## Stop Conditions

Stop and ask for a decision when:

- A destructive data change is required.
- Specs disagree on auth, money, eligibility, status transitions, notifications, or legal/compliance behavior.
- The only available source is stale or explicitly marked draft.
- A test protects a behavior that the latest product rule appears to retire.
