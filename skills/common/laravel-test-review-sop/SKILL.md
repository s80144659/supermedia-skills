---
name: laravel-test-review-sop
description: Use when adding, updating, reviewing, or deleting Laravel tests, especially for policy, state machine, API contract, auth, or regression coverage.
---

# Laravel Test Review SOP

Tests should protect product commitments, risky boundaries, and regressions, not incidental implementation details.

## Test Value Criteria

A test should do at least one of these:

- Verify a current requirement or business rule.
- Protect a high-risk boundary: auth, authorization, state transition, tenant isolation, money, rate limit, audit log, API contract.
- Prevent a known regression.
- Serve as executable documentation for a supported workflow.
- Cover a meaningful failure or edge path with low maintenance cost.

## Review Workflow

1. Identify what changed: main flow, fallback flow, onboarding, permission guard, API contract, scheduler, import/export, or state machine.
2. Search nearby tests before adding new ones.
3. For each relevant test, ask what policy it protects and whether that policy still exists.
4. Update stale payloads, names, and assertions when the core test remains valuable.
5. Do not delete tests without confirming they are not the only protection for a supported behavior.
6. Prefer feature tests for API behavior and unit tests for isolated domain logic.

## Purpose Comments

When a test protects a non-obvious rule, add a short purpose comment:

```php
/** Purpose: verifies that an expired claim cannot be submitted after the deadline. */
```

Write the external commitment, not the internal implementation trick.

## Verification

Run the smallest relevant test command first, then broaden when shared behavior changed.
