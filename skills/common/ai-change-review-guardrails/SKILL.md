---
name: ai-change-review-guardrails
description: Use before accepting AI-generated or large backend/API/scheduler/security changes, especially when hidden assumptions or blast radius matter.
---

# AI Change Review Guardrails

Use this skill as a pre-merge review checklist for AI-generated or broad changes.

## Review Passes

1. Spec fit: confirm the change implements the latest explicit requirement.
2. Blast radius: list touched layers and shared contracts.
3. Hidden assumptions: identify inferred product rules, missing third-party contracts, time zone assumptions, and retry/idempotency assumptions.
4. Trust boundaries: check untrusted input, auth, authorization, rate limits, file uploads, external APIs, and sensitive data exposure.
5. Failure modes: check timeout, duplicate request, retry, partial write, race condition, and rollback behavior.
6. Verification: run tests or explain what could not be verified.

## Backend/API Checklist

- Routes have the expected middleware and throttle behavior.
- Form Requests validate required, nullable, enum, date, and money fields.
- Responses use the project wrapper/resource style.
- State transitions are guarded and tested.
- Database writes are transactional when multi-table consistency matters.
- External calls are timeout-bound and logged without leaking secrets.
- Audit logs exist for admin or eligibility-changing actions.

## Stop Conditions

Stop before merge when:

- The change depends on a draft or conflicting spec.
- A destructive migration lacks an explicit rollout or rollback plan.
- A public or admin API lacks tests for auth and failure paths.
- Verification was skipped for behavior that can be tested locally.
