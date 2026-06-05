# Supermedia Skills

Supermedia 開發者與 AI coding agents 共用的 shared engineering skills。

這個 repository 把可重複使用的開發流程包成 Codex / Claude 可安裝的 private plugin marketplace。目標是讓不同專案共用同一份工程慣例，而不是在每個專案複製一份 skill 內文。

## 功能

- 提供跨專案共用的 AI coding workflows。
- 支援 Codex plugin marketplace。
- 支援 Claude Code plugin marketplace。
- 只維護一份 canonical skill 內文：`skills/<skill-name>/SKILL.md`。
- 用 generated adapter files 承接 Codex / Claude 的包裝差異。
- 提供 validator，避免 skill catalog、版本號、frontmatter 與 plugin adapter 漂移。

## Included Skills

| Skill | Scope | 用途 |
| --- | --- | --- |
| `project-truth-source` | common | 規格、實作、測試、文件互相衝突時，用來判斷真相來源。 |
| `ai-change-review-guardrails` | common | 審查 AI 生成或大範圍修改的風險、假設與 blast radius。 |
| `test-review-sop` | common | 新增、修改、刪除或審查測試時使用。 |
| `git-commit-workflow` | common | 暫存、拆分、檢查與建立 commit。 |
| `skill-maintenance-governance` | common | 維護 shared / project skills，避免重複與漂移。 |
| `tenant-access-boundaries` | common | 實作或審查 tenant / organization / workspace 存取邊界。 |
| `scheduler-side-effect-guardrails` | common | 審查排程、queue、過期處理、通知與批次副作用。 |
| `laravel-migration-safety` | laravel | Laravel migration、backfill、改欄位與部署安全。 |
| `laravel-api-contract` | laravel | Laravel API request / response / Resource / Scramble 契約。 |
| `laravel-auth-authorization-flow` | laravel | Laravel auth、Sanctum、middleware、role、token abilities。 |
| `laravel-route-authorization-matrix` | laravel | Laravel route group、middleware chain、role access matrix。 |
| `laravel-scramble-api-docs` | laravel | Laravel Scramble API schema 與文件輸出。 |
| `laravel-security-testing` | laravel | Laravel API 安全測試、權限矩陣、租戶隔離、敏感資料。 |
| `laravel-pdf-generation` | laravel | Laravel PDF 產生方案與 CJK 字型 / rendering 風險。 |

## 安裝

### Codex

先把 marketplace 加到 Codex，並 pin 到 release tag：

```bash
codex plugin marketplace add https://github.com/s80144659/supermedia-skills.git --ref v0.1.0
codex plugin add supermedia-skills@supermedia
```

檢查：

```bash
codex plugin marketplace list
codex plugin list
```

更新 marketplace snapshot：

```bash
codex plugin marketplace upgrade supermedia
```

### Claude Code

在 Claude Code 互動模式內：

```text
/plugin marketplace add https://github.com/s80144659/supermedia-skills.git#v0.1.0
/plugin install supermedia-skills@supermedia
/reload-plugins
```

或用 shell CLI：

```bash
claude plugin marketplace add https://github.com/s80144659/supermedia-skills.git#v0.1.0
claude plugin install supermedia-skills@supermedia --scope project
```

`--scope project` 會把安裝宣告寫入專案設定，方便團隊共用。只給自己使用時可用 `--scope user` 或省略。

## 在專案中引用

Consuming project 只保留 project-specific instructions，例如業務規則、環境命令、部署限制與專案 overlay。共通工程行為回到本 repository 維護。

建議在 consuming project 的 `AGENTS.md` 或 `CLAUDE.md` 記錄：

```md
## Shared Skills Contract

- Marketplace source: https://github.com/s80144659/supermedia-skills.git
- Marketplace name: supermedia
- Plugin name: supermedia-skills
- Integration method: private-plugin-marketplace
- Pinned ref: v0.1.0

Do not edit shared skills locally in this project. Update shared behavior in
supermedia-skills, release a new tag, then intentionally upgrade this project.
```

可使用 `templates/consuming-project-AGENTS.md` 作為最小範本。

## Repository 結構

本 repository root 本身就是 private plugin root，沒有 `dist/` skill copy。

Canonical source:

- `skills/<skill-name>/SKILL.md`
- 選用的 `skills/<skill-name>/references/`、`scripts/`、`assets/`
- `skills.manifest.json`

Generated adapter files:

- `.codex-plugin/plugin.json`
- `.agents/plugins/marketplace.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

`skills/` 是唯一可手動維護的 skill 內文來源。Codex / Claude 差異只放在 `skills.manifest.json` 的 `distribution` 區塊，再由 `node scripts/sync-plugin-adapters.mjs` 產生 adapter files。

不要手動修改 generated adapter files；改 `skills/` 或 `skills.manifest.json` 後重新執行同步腳本。

## 維護流程

修改 skill 或 metadata 後：

```bash
node scripts/sync-plugin-adapters.mjs
node scripts/validate-skills.mjs
```

Release 前至少確認：

```bash
node scripts/sync-plugin-adapters.mjs --check
node scripts/validate-skills.mjs
claude plugin validate .
```

若目前環境有 Codex 的 `plugin-creator` skill，也可以再執行它提供的 plugin validator。

建立 release：

```bash
git add -A
git commit -m "[chore] 發布 supermedia skills 版本"
git tag -a v0.1.0 -m "v0.1.0"
git push origin main
git push origin v0.1.0
```

## scripts 說明

- `scripts/sync-plugin-adapters.mjs`: 從 `skills.manifest.json` 與 `VERSION` 產生 Codex / Claude adapter files。加上 `--check` 時只檢查是否同步，不寫檔。
- `scripts/validate-skills.mjs`: 驗證 VERSION、CHANGELOG、manifest、skill path、frontmatter、discovered skills 與 generated adapters 是否一致。

一般維護者只需要執行 scripts，不需要閱讀 scripts 內容；只有驗證失敗或要改 plugin 包裝規則時才需要進去看。

## Repo 轉移

未來如果 repository 從 `s80144659/supermedia-skills` 轉移到其他 GitHub organization，plugin 內部通常不需要重包，因為 marketplace name `supermedia` 和 plugin name `supermedia-skills` 可以保持不變。

需要更新的是 consuming projects 的 marketplace source：

- Codex: 重新 `codex plugin marketplace add <new-url> --ref <tag>`，或移除舊 source 後再加新 source。
- Claude: 重新 `claude plugin marketplace add <new-url>#<tag>`，或更新專案的 `.claude/settings.json`。
- 專案文件中的 Marketplace source URL。

GitHub 可能會保留 redirect，但正式團隊流程不要依賴 redirect；轉移後建議明確更新成新 organization URL。

## 原則

- Shared skills 保持專案中立，不放單一產品規格。
- Project-specific rules 留在 consuming project。
- Consuming project pin tag 或 commit SHA，不追浮動 main。
- 變更會影響 agent 行為時，更新 `CHANGELOG.md`。
- Adapter files 由 script 產生，不手動維護。
