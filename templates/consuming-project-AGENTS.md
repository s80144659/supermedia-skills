# Shared Skills Contract

Shared engineering skills are sourced from `supermedia-skills`.

- Pinned ref: `<tag-or-commit-sha>`
- Integration method: `private-plugin-marketplace`
- Marketplace source: `<private-git-url-or-owner/repo>`
- Marketplace name: `supermedia`
- Plugin name: `supermedia-skills`
- Codex marketplace catalog in `supermedia-skills`: `.agents/plugins/marketplace.json`
- Claude marketplace catalog in `supermedia-skills`: `.claude-plugin/marketplace.json`

### Codex — `.agents/plugins/marketplace.json`

Create this file at `.agents/plugins/marketplace.json` in the consuming project. Use `"source": "git"` so Codex fetches the plugin from the remote repository. Do not copy the `"source": "local"` variant found inside `supermedia-skills` itself — that file is for the plugin repo's own self-description, not for consuming projects.

```json
{
  "name": "supermedia",
  "interface": {
    "displayName": "Supermedia"
  },
  "plugins": [
    {
      "name": "supermedia-skills",
      "source": {
        "source": "git",
        "url": "<private-git-url>",
        "ref": "stable"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

### Claude — `.claude/settings.json`

Add the marketplace entry and enable the plugin:

```json
{
  "enabledPlugins": {
    "supermedia-skills@supermedia": true
  },
  "extraKnownMarketplaces": {
    "supermedia": {
      "source": {
        "source": "git",
        "url": "<private-git-url>",
        "ref": "stable"
      }
    }
  }
}
```

Optional local authoring paths, only for offline fallback or tools that cannot install the private marketplace:

- Shared skill root: `<path-to-supermedia-skills>/skills`
- Shared catalog: `<path-to-supermedia-skills>/skills.manifest.json`

This project keeps only project-specific instructions here: business rules, runtime constraints, environment commands, deployment limits, and repo-local workflows.

Do not edit shared skills locally in this project. If shared behavior must change, update `supermedia-skills`, regenerate its plugin adapters, review its `CHANGELOG.md`, and bump this pinned ref intentionally.

When shared skills and project-specific instructions conflict, project runtime constraints apply for this project. Do not copy project-specific rules back into shared skills unless they have been generalized and reviewed in `supermedia-skills`.
