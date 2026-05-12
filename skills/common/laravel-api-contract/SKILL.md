---
name: laravel-api-contract
description: Use when adding or changing Laravel API endpoints, Form Requests, Resources, response wrappers, OpenAPI/Scramble docs, or client-facing response shapes.
---

# Laravel API Contract

API behavior is a contract between backend, clients, tests, and generated docs. Keep all four aligned.

## Workflow

1. Find the existing endpoint style: route file, controller pattern, Form Request, Resource, response wrapper, error format.
2. Define the request contract in a Form Request unless the project convention says otherwise.
3. Define the response contract through a Resource or typed response object when practical.
4. Keep success and error shapes stable: status/code/message/data/meta should not drift endpoint by endpoint.
5. Update API docs or annotations used by the project, such as Scramble response attributes.
6. Add feature tests for status code, auth boundary, validation failure, success shape, and important error cases.

## Contract Checks

- Required and nullable fields are explicit.
- Money, dates, time zones, status values, and enum strings are stable.
- Lists include pagination or documented ordering when needed.
- Resources do not leak sensitive fields.
- Public endpoints have rate limits where abuse is plausible.
- Admin endpoints have role/middleware coverage.

## Stop Conditions

Stop before coding when:

- The client-facing shape conflicts with an existing Resource or documented wrapper.
- Specs disagree on auth, notification channel, eligibility, money thresholds, or status names.
- The endpoint requires a third-party contract that is still missing.
