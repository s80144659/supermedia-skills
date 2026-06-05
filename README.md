# Supermedia Skills

Supermedia Skills 是給組織內部共用的 AI coding workflows。

它把工程判斷、審查流程、Laravel API 慣例、測試與 release 工作流包成 Codex / Claude Code 可安裝的 private plugin marketplace。團隊成員在不同專案安裝同一個 plugin，就能使用同一套 shared skills。

## 有什麼

- 一份組織共用的 shared skills 來源。
- 一個 marketplace：`supermedia`。
- 一個 plugin：`supermedia-skills`。
- Codex 與 Claude Code 安裝入口。
- 版本策略：內部專案預設追 `stable`，需要可重現版本時使用 release tag 或 commit SHA。
- Private repo 分享模式：透過 GitHub repo 權限授權給同事與團隊。
- 適合放在公司、團隊或多專案共用的工程 workflow。

## 原理

Codex 與 Claude Code 都支援 plugin marketplace。Marketplace 像是一份 plugin 目錄；各專案加入 marketplace 後，就能安裝其中的 plugin。Plugin 內的 skills 會依任務描述被 agent 載入，也能由使用者明確指定。

Supermedia Skills 的使用方式是：

1. Shared engineering workflows 維護在本 repository。
2. 各專案透過 marketplace 安裝 `supermedia-skills`。
3. 內部專案預設追 `stable`。
4. Shared workflow 驗證後推進 `stable`，重要里程碑再發布 release tag。

這個做法讓組織只維護一份 shared skill 內容，同時讓不同專案保留自己的 `AGENTS.md`、`CLAUDE.md` 與 project-specific rules。

## 功能

| Skill | 用途 |
| --- | --- |
| `project-truth-source` | 判斷規格、實作、測試與文件之間的真相來源。 |
| `ai-change-review-guardrails` | 審查 AI 生成或大範圍修改的風險、假設與 blast radius。 |
| `test-review-sop` | 新增、修改、刪除或審查測試時使用。 |
| `git-commit-workflow` | 暫存、拆分、檢查與建立 commit。 |
| `skill-maintenance-governance` | 維護 shared / project skills 的職責邊界與版本漂移。 |
| `tenant-access-boundaries` | 實作或審查 tenant / organization / workspace 存取邊界。 |
| `scheduler-side-effect-guardrails` | 審查排程、queue、過期處理、通知與批次副作用。 |
| `laravel-migration-safety` | Laravel migration、backfill、改欄位與部署安全。 |
| `laravel-api-contract` | Laravel API request / response / Resource / Scramble 契約。 |
| `laravel-auth-authorization-flow` | Laravel auth、Sanctum、middleware、role、token abilities。 |
| `laravel-route-authorization-matrix` | Laravel route group、middleware chain、role access matrix。 |
| `laravel-scramble-api-docs` | Laravel Scramble API schema 與文件輸出。 |
| `laravel-security-testing` | Laravel API 安全測試、權限矩陣、租戶隔離、敏感資料。 |
| `laravel-pdf-generation` | Laravel PDF 產生方案與 CJK 字型 / rendering 風險。 |

## 分支與版本策略

| Ref | 用途 |
| --- | --- |
| `main` | 最新開發線，適合維護者快速迭代與測試。 |
| `stable` | 組織內推薦使用線，驗證後才推進。 |
| `vX.Y.Z` | 歷史固定版本，適合需要完全可重現的專案。 |
| Commit SHA | 單一固定 commit，適合臨時鎖定或問題排查。 |

## 安裝

### Codex

加入 marketplace 並追蹤組織穩定分支：

```bash
codex plugin marketplace add https://github.com/s80144659/supermedia-skills.git --ref stable
codex plugin add supermedia-skills@supermedia
```

檢查 marketplace 與 plugin：

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
/plugin marketplace add https://github.com/s80144659/supermedia-skills.git#stable
/plugin install supermedia-skills@supermedia
/reload-plugins
```

或使用 shell CLI：

```bash
claude plugin marketplace add https://github.com/s80144659/supermedia-skills.git#stable
claude plugin install supermedia-skills@supermedia --scope project
```

`--scope project` 會把安裝宣告寫入專案設定，方便團隊共用。個人使用可用 `--scope user`。

## 專案使用方式

Consuming project 建議在 `AGENTS.md` 或 `CLAUDE.md` 記錄 shared skills contract：

```md
## Shared Skills Contract

- Marketplace source: https://github.com/s80144659/supermedia-skills.git
- Marketplace name: supermedia
- Plugin name: supermedia-skills
- Integration method: private-plugin-marketplace
- Pinned ref: stable
```

常見使用方式：

- 「請用 shared guardrails 審查這次 API 變更」
- 「請用 Laravel migration safety 檢查這個 migration」
- 「請用 git commit workflow 幫我整理 commit」
- 「請用 test review SOP 檢查這次測試調整」

Codex / Claude Code 的 plugin 或 skill 選單也可以搜尋對應 skill name。

## 版本更新

### Codex

```bash
codex plugin marketplace upgrade supermedia
```

### Claude Code

```bash
claude plugin marketplace update supermedia
claude plugin update supermedia-skills
```

升級前建議先查看 `CHANGELOG.md`，確認新版本的 workflow 變更。

## GitHub Organization 轉移

Repository 轉移到新的 GitHub organization 時，Marketplace name `supermedia` 與 Plugin name `supermedia-skills` 可以維持一致。

需要同步的項目：

- Codex marketplace source URL。
- Claude Code marketplace source URL。
- 各專案文件中的 Marketplace source。
- 各專案設定中的 marketplace source。

轉移後使用新 organization URL 重新加入 marketplace，並讓內部專案追 `stable`；需要可重現版本時再 pin release tag 或 commit SHA。

## 參考

- [OpenAI Codex: Plugins](https://developers.openai.com/codex/plugins)
- [OpenAI Codex: Build plugins](https://developers.openai.com/codex/plugins/build)
- [OpenAI Skills Catalog](https://github.com/openai/skills)
- [Claude Code: Discover and install plugins](https://code.claude.com/docs/en/discover-plugins)
- [Claude Code: Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [Claude Help Center: Manage plugins for your organization](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization)
- [Anthropic official Claude plugins marketplace](https://github.com/anthropics/claude-plugins-official)
