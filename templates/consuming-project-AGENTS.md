# Shared Skills Contract

Shared engineering skills are sourced from `supermedia-skills`.

- Pinned ref: `<tag-or-commit-sha>`
- Integration method: `<git-submodule|vendored-copy|agent-skill-path>`
- Shared skill root: `<path-to-supermedia-skills>/skills`
- Shared catalog: `<path-to-supermedia-skills>/skills.manifest.json`

This project keeps only project-specific instructions here: business rules, runtime constraints, environment commands, deployment limits, and repo-local workflows.

Do not edit shared skills locally in this project. If shared behavior must change, update `supermedia-skills`, review its `CHANGELOG.md`, and bump this pinned ref intentionally.

When shared skills and project-specific instructions conflict, project runtime constraints apply for this project. Do not copy project-specific rules back into shared skills unless they have been generalized and reviewed in `supermedia-skills`.
