#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const errors = [];
const warnings = [];

const manifestPath = path.join(root, 'skills.manifest.json');
const versionPath = path.join(root, 'VERSION');
const changelogPath = path.join(root, 'CHANGELOG.md');
const skillsRoot = path.join(root, 'skills');
const syncPluginAdaptersPath = path.join(root, 'scripts/sync-plugin-adapters.mjs');

const hyphenCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const skillPathPattern = /^skills\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedStability = new Set(['draft', 'stable', 'deprecated']);
const allowedOptionalDirectories = new Set(['scripts', 'references', 'assets']);
const actionSectionPattern =
  /^## (作業流程|快速流程|審查流程|核心規則|審查面向|選型原則)$/m;
const outputSectionPattern =
  /^## (標準輸出|回覆檢查清單|檢查清單|品質檢查|契約檢查|Laravel 檢查清單|驗證)$/m;

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  } catch (error) {
    addError(`Unable to read ${path.relative(root, filePath)}: ${error.message}`);
    return '';
  }
}

function readJson(filePath) {
  const raw = readText(filePath);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    addError(`Invalid JSON in ${path.relative(root, filePath)}: ${error.message}`);
    return null;
  }
}

function isDirectory(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function parseFrontmatter(skillMdPath) {
  const raw = readText(skillMdPath).replace(/\r\n/g, '\n');

  if (!raw.startsWith('---\n')) {
    addError(`${path.relative(root, skillMdPath)} must start with YAML frontmatter.`);
    return null;
  }

  const endIndex = raw.indexOf('\n---\n', 4);

  if (endIndex === -1) {
    addError(`${path.relative(root, skillMdPath)} has unterminated YAML frontmatter.`);
    return null;
  }

  const frontmatter = raw.slice(4, endIndex).trim();
  const body = raw.slice(endIndex + 5).trim();
  const metadata = {};

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!match) {
      addError(`${path.relative(root, skillMdPath)} has unsupported frontmatter line: ${trimmed}`);
      continue;
    }

    const key = match[1];
    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    metadata[key] = value;
  }

  return { metadata, body };
}

function discoverSkillPaths() {
  const discovered = [];

  if (!isDirectory(skillsRoot)) {
    addError('Missing skills directory.');
    return discovered;
  }

  for (const skillName of fs.readdirSync(skillsRoot).sort()) {
    const skillDir = path.join(skillsRoot, skillName);

    if (!isDirectory(skillDir)) {
      continue;
    }

    if (!hyphenCase.test(skillName)) {
      addError(`Skill folder must be lowercase hyphen-case: skills/${skillName}`);
    }

    if (isFile(path.join(skillDir, 'SKILL.md'))) {
      discovered.push(`skills/${skillName}`);
    } else {
      addWarning(`Skill-like directory is missing SKILL.md and will not be discovered: skills/${skillName}`);
    }
  }

  return discovered;
}

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    addError(`${label} must be an object.`);
    return false;
  }

  return true;
}

const manifest = readJson(manifestPath);
const version = readText(versionPath).trim();
const changelog = readText(changelogPath);
const discoveredSkillPaths = discoverSkillPaths();

if (manifest) {
  for (const key of [
    'schema_version',
    'name',
    'version',
    'scope',
    'governance',
    'consumer_policy',
    'skill_format',
    'stability',
    'release_policy',
    'validation',
    'skills',
    'distribution',
  ]) {
    if (!(key in manifest)) {
      addError(`skills.manifest.json is missing top-level field: ${key}`);
    }
  }

  if (manifest.version !== version) {
    addError(`VERSION (${version}) must match skills.manifest.json version (${manifest.version}).`);
  }

  if (version && !changelog.includes(`## [${version}]`)) {
    addError(`CHANGELOG.md must contain a section heading for VERSION: ## [${version}]`);
  }

  if (!isDirectory(skillsRoot) || !isFile(manifestPath) || !isFile(versionPath)) {
    addError('Run this validator from the repository root.');
  }

  if (manifest.name !== 'supermedia-skills') {
    addError('skills.manifest.json name must be supermedia-skills.');
  }

  requireObject(manifest.governance, 'governance');
  requireObject(manifest.consumer_policy, 'consumer_policy');
  requireObject(manifest.skill_format, 'skill_format');
  requireObject(manifest.stability, 'stability');
  requireObject(manifest.release_policy, 'release_policy');
  requireObject(manifest.validation, 'validation');
  requireObject(manifest.distribution, 'distribution');

  if (!Array.isArray(manifest.skills)) {
    addError('skills.manifest.json field "skills" must be an array.');
  } else {
    const names = new Set();
    const paths = new Set();

    for (const [index, skill] of manifest.skills.entries()) {
      const label = `skills[${index}]`;

      if (!skill || typeof skill !== 'object' || Array.isArray(skill)) {
        addError(`${label} must be an object.`);
        continue;
      }

      const {
        name,
        scope,
        path: skillPath,
        entrypoint,
        description: manifestDescription,
        stability,
      } = skill;

      if (!name || typeof name !== 'string') {
        addError(`${label}.name is required.`);
      } else if (!hyphenCase.test(name)) {
        addError(`${label}.name must be lowercase hyphen-case: ${name}`);
      } else if (names.has(name)) {
        addError(`Duplicate skill name in manifest: ${name}`);
      } else {
        names.add(name);
      }

      if (!scope || typeof scope !== 'string') {
        addError(`${label}.scope is required.`);
      } else if (!hyphenCase.test(scope)) {
        addError(`${label}.scope must be lowercase hyphen-case: ${scope}`);
      }

      if (!skillPath || typeof skillPath !== 'string') {
        addError(`${label}.path is required.`);
      } else {
        if (!skillPathPattern.test(skillPath)) {
          addError(`${label}.path must match skills/<skill-name>: ${skillPath}`);
        }

        if (paths.has(skillPath)) {
          addError(`Duplicate skill path in manifest: ${skillPath}`);
        } else {
          paths.add(skillPath);
        }

        if (name && path.basename(skillPath) !== name) {
          addError(`${label}.path basename must match name: ${skillPath} != ${name}`);
        }

        if (entrypoint !== 'SKILL.md') {
          addError(`${label}.entrypoint must be SKILL.md.`);
        }

        if (!manifestDescription || typeof manifestDescription !== 'string') {
          addError(`${label}.description is required.`);
        } else if (manifestDescription.length < 40) {
          addWarning(`${label}.description may be too short for reliable discovery.`);
        }

        const skillDir = path.join(root, skillPath);
        const skillMdPath = path.join(skillDir, 'SKILL.md');

        if (!isDirectory(skillDir)) {
          addError(`Manifest skill path does not exist: ${skillPath}`);
        } else if (!isFile(skillMdPath)) {
          addError(`Manifest skill is missing SKILL.md: ${skillPath}`);
        } else {
          const parsed = parseFrontmatter(skillMdPath);

          if (parsed) {
            const { metadata, body } = parsed;
            const frontmatterName = metadata.name;
            const frontmatterDescription = metadata.description;

            if (!frontmatterName) {
              addError(`${skillPath}/SKILL.md frontmatter is missing name.`);
            } else if (frontmatterName !== name) {
              addError(`${skillPath}/SKILL.md frontmatter name must match manifest name.`);
            }

            if (!frontmatterDescription) {
              addError(`${skillPath}/SKILL.md frontmatter is missing description.`);
            } else if (frontmatterDescription !== manifestDescription) {
              addError(`${skillPath}/SKILL.md frontmatter description must match manifest description.`);
            } else if (frontmatterDescription.length < 40) {
              addWarning(`${skillPath}/SKILL.md description may be too short for reliable discovery.`);
            }

            if (!body.startsWith('# ')) {
              addWarning(`${skillPath}/SKILL.md body should start with an H1 heading.`);
            }

            if (!actionSectionPattern.test(body)) {
              addWarning(`${skillPath}/SKILL.md may be missing an explicit workflow or decision section.`);
            }

            if (!body.includes('\n## 停止條件')) {
              addWarning(`${skillPath}/SKILL.md may be missing an explicit stop conditions section.`);
            }

            if (!outputSectionPattern.test(body)) {
              addWarning(`${skillPath}/SKILL.md may be missing an output, checklist, or validation section.`);
            }
          }

          for (const entry of fs.readdirSync(skillDir)) {
            if (entry === 'SKILL.md') {
              continue;
            }

            const entryPath = path.join(skillDir, entry);

            if (isDirectory(entryPath) && !allowedOptionalDirectories.has(entry)) {
              addWarning(`${skillPath} contains non-standard directory: ${entry}`);
            }
          }
        }
      }

      if (!stability || typeof stability !== 'string') {
        addError(`${label}.stability is required.`);
      } else if (!allowedStability.has(stability)) {
        addError(`${label}.stability must be one of: ${Array.from(allowedStability).join(', ')}`);
      }
    }

    for (const discoveredPath of discoveredSkillPaths) {
      if (!paths.has(discoveredPath)) {
        addError(`Discovered skill is missing from manifest: ${discoveredPath}`);
      }
    }
  }
}

function firstPluginByName(marketplace, pluginName) {
  return Array.isArray(marketplace?.plugins)
    ? marketplace.plugins.find((plugin) => plugin?.name === pluginName)
    : undefined;
}

function validatePluginAdapters(manifest, version) {
  if (!requireObject(manifest.distribution, 'distribution')) {
    return;
  }

  const distribution = manifest.distribution;
  const pluginName = distribution.plugin_name ?? manifest.name;
  const marketplaceName = distribution.marketplace_name ?? 'supermedia';
  const canonicalSkillRoot = distribution.canonical_skill_root ?? 'skills';
  const codexManifestPath = distribution.codex?.manifest_path ?? '.codex-plugin/plugin.json';
  const claudeManifestPath = distribution.claude?.manifest_path ?? '.claude-plugin/plugin.json';
  const codexMarketplacePath =
    distribution.codex?.marketplace_path ?? '.agents/plugins/marketplace.json';
  const claudeMarketplacePath =
    distribution.claude?.marketplace_path ?? '.claude-plugin/marketplace.json';
  const codexSourcePath = distribution.codex?.source_path ?? './';
  const claudeSource = distribution.claude?.source ?? './';

  if (distribution.adapter_mode !== 'repo-root-plugin') {
    addError('distribution.adapter_mode must be repo-root-plugin.');
  }

  if (canonicalSkillRoot !== 'skills') {
    addError('distribution.canonical_skill_root must be skills.');
  }

  if (codexSourcePath !== './') {
    addError('distribution.codex.source_path must be ./ so Codex uses the repository root plugin.');
  }

  if (claudeSource !== './') {
    addError('distribution.claude.source must be ./ so Claude uses the repository root plugin.');
  }

  const codexManifest = readJson(path.join(root, codexManifestPath));
  const claudeManifest = readJson(path.join(root, claudeManifestPath));
  const codexMarketplace = readJson(path.join(root, codexMarketplacePath));
  const claudeMarketplace = readJson(path.join(root, claudeMarketplacePath));

  if (codexManifest) {
    if (codexManifest.name !== pluginName) {
      addError(`${codexManifestPath}.name must be ${pluginName}.`);
    }

    if (codexManifest.version !== version) {
      addError(`${codexManifestPath}.version must match VERSION.`);
    }

    if (codexManifest.skills !== './skills/') {
      addError(`${codexManifestPath}.skills must be ./skills/.`);
    }
  }

  if (claudeManifest) {
    if (claudeManifest.name !== pluginName) {
      addError(`${claudeManifestPath}.name must be ${pluginName}.`);
    }

    if (claudeManifest.version !== version) {
      addError(`${claudeManifestPath}.version must match VERSION.`);
    }
  }

  if (codexMarketplace) {
    if (codexMarketplace.name !== marketplaceName) {
      addError(`${codexMarketplacePath}.name must be ${marketplaceName}.`);
    }

    const codexPlugin = firstPluginByName(codexMarketplace, pluginName);

    if (!codexPlugin) {
      addError(`${codexMarketplacePath} must include plugin ${pluginName}.`);
    } else {
      if (codexPlugin.source?.source !== 'local') {
        addError(`${codexMarketplacePath} plugin source.source must be local.`);
      }

      if (codexPlugin.source?.path !== codexSourcePath) {
        addError(`${codexMarketplacePath} plugin source.path must be ${codexSourcePath}.`);
      }
    }
  }

  if (claudeMarketplace) {
    if (claudeMarketplace.name !== marketplaceName) {
      addError(`${claudeMarketplacePath}.name must be ${marketplaceName}.`);
    }

    const claudePlugin = firstPluginByName(claudeMarketplace, pluginName);

    if (!claudePlugin) {
      addError(`${claudeMarketplacePath} must include plugin ${pluginName}.`);
    } else if (claudePlugin.source !== claudeSource) {
      addError(`${claudeMarketplacePath} plugin source must be ${claudeSource}.`);
    }
  }
}

if (manifest) {
  validatePluginAdapters(manifest, version);
}

if (isFile(syncPluginAdaptersPath)) {
  const result = spawnSync(process.execPath, [syncPluginAdaptersPath, '--check'], {
    cwd: root,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    addError(
      [
        'Plugin adapter check failed.',
        result.stdout.trim(),
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }
} else {
  addError('Missing sync script: scripts/sync-plugin-adapters.mjs');
}

for (const warning of warnings) {
  console.warn(`[warn] ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`[error] ${error}`);
  }

  console.error(`Validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Validation passed for ${discoveredSkillPaths.length} skill(s).`);
