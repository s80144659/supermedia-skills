#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const checkOnly = process.argv.includes('--check');

const manifestPath = path.join(root, 'skills.manifest.json');
const versionPath = path.join(root, 'VERSION');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = fs.readFileSync(versionPath, 'utf8').trim();
const distribution = manifest.distribution ?? {};

const pluginName = distribution.plugin_name ?? manifest.name;
const displayName = distribution.display_name ?? 'Supermedia Skills';
const description =
  distribution.description ??
  'Shared Supermedia engineering skills for reusable software delivery workflows.';
const authorName = distribution.author?.name ?? manifest.governance?.owner ?? 'Supermedia Engineering';
const license = distribution.license ?? 'Proprietary';
const marketplaceName = distribution.marketplace_name ?? 'supermedia';
const marketplaceDisplayName = distribution.marketplace_display_name ?? 'Supermedia';
const category = distribution.category ?? 'Productivity';
const codexMarketplacePath =
  distribution.codex?.marketplace_path ?? '.agents/plugins/marketplace.json';
const claudeMarketplacePath =
  distribution.claude?.marketplace_path ?? '.claude-plugin/marketplace.json';
const codexManifestPath =
  distribution.codex?.manifest_path ?? '.codex-plugin/plugin.json';
const claudeManifestPath =
  distribution.claude?.manifest_path ?? '.claude-plugin/plugin.json';
const codexSourcePath = distribution.codex?.source_path ?? './';
const claudeSource = distribution.claude?.source ?? './';

const generatedTargets = [
  codexManifestPath,
  claudeManifestPath,
  codexMarketplacePath,
  claudeMarketplacePath,
];

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function removeUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(removeUndefined);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .map(([key, child]) => [key, removeUndefined(child)]),
    );
  }

  return value;
}

function buildAdapters(destinationRoot) {
  writeJson(path.join(destinationRoot, codexManifestPath), {
    name: pluginName,
    version,
    description,
    author: {
      name: authorName,
    },
    license,
    keywords: ['skills', 'engineering', 'software-delivery', 'supermedia'],
    skills: './skills/',
    interface: {
      displayName,
      shortDescription: description,
      longDescription:
        'Shared Supermedia engineering workflows packaged as reusable Agent Skills for Codex.',
      developerName: authorName,
      category,
      capabilities: ['Skills', 'Review', 'Implementation'],
      defaultPrompt: [
        'Use Supermedia shared skills for this task.',
        'Review this change with the shared guardrails.',
        'Apply the relevant Laravel shared workflow.',
      ],
      brandColor: '#2563EB',
    },
  });

  writeJson(
    path.join(destinationRoot, claudeManifestPath),
    removeUndefined({
      name: pluginName,
      description,
      version,
      author: {
        name: authorName,
      },
      homepage: distribution.homepage ?? undefined,
      repository: distribution.repository ?? undefined,
      license,
    }),
  );

  writeJson(
    path.join(destinationRoot, codexMarketplacePath),
    removeUndefined({
      name: marketplaceName,
      interface: {
        displayName: marketplaceDisplayName,
      },
      plugins: [
        {
          name: pluginName,
          source: {
            source: 'local',
            path: codexSourcePath,
          },
          policy: {
            installation: 'AVAILABLE',
            authentication: 'ON_INSTALL',
          },
          category,
        },
      ],
    }),
  );

  writeJson(
    path.join(destinationRoot, claudeMarketplacePath),
    removeUndefined({
      name: marketplaceName,
      owner: {
        name: authorName,
      },
      description: 'Private Supermedia plugin marketplace.',
      metadata: {
        description: 'Private Supermedia plugin marketplace.',
      },
      version,
      plugins: [
        {
          name: pluginName,
          source: claudeSource,
          description,
          version,
          author: {
            name: authorName,
          },
        },
      ],
    }),
  );
}

function compareFiles(expectedRoot, actualRoot, relativeTarget) {
  const expectedPath = path.join(expectedRoot, relativeTarget);
  const actualPath = path.join(actualRoot, relativeTarget);

  if (!fs.existsSync(actualPath)) {
    return [`Missing generated target: ${relativeTarget}`];
  }

  const expectedContent = fs.readFileSync(expectedPath);
  const actualContent = fs.readFileSync(actualPath);

  return Buffer.compare(expectedContent, actualContent) === 0
    ? []
    : [`Generated file is stale: ${relativeTarget}`];
}

if (checkOnly) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'supermedia-skills-adapters-'));

  try {
    buildAdapters(tempRoot);

    const errors = generatedTargets.flatMap((target) => compareFiles(tempRoot, root, target));

    if (errors.length > 0) {
      for (const error of errors) {
        console.error(`[error] ${error}`);
      }

      console.error('Plugin adapters are stale. Run: node scripts/sync-plugin-adapters.mjs');
      process.exit(1);
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log('Plugin adapters are up to date.');
} else {
  buildAdapters(root);
  console.log(`Synced ${pluginName} plugin adapters for Codex and Claude.`);
}
