# Supermedia Skills

Supermedia 開發者與 AI coding agents 共用的工程 skills repository。

## 目的

本 repository 集中維護可重複使用的 skills，支援軟體交付流程中的規劃、實作、審查、測試、發布與維護。

本 repository 用於共享作業指引，不承載特定專案的業務規則。

本 repository 不是 agent persona catalog；skills 應是 task-specific、可載入、可執行、可維護的工作包。

## 相容性

Skills 應盡可能維持可被 Codex、Claude 與相容 agent workflows 讀取與使用。

每個 skill 應保持可移植、精要，並避免依賴單一 consuming project；必要依賴必須明確揭露。

## Repository 結構

本 repository root 本身就是 private plugin root，沒有 `dist/` skill copy。

Canonical skill source:

- `skills/<skill-name>/SKILL.md`
- 選用的 `skills/<skill-name>/references/`、`scripts/`、`assets/`
- `skills.manifest.json`

Generated adapter files:

- `.codex-plugin/plugin.json`
- `.agents/plugins/marketplace.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

`skills/` 是唯一可手動維護的 skill 內文來源。Codex / Claude 差異只放在 `skills.manifest.json` 的 `distribution` 區塊，再由 `node scripts/sync-plugin-adapters.mjs` 產生 adapter files。

所有 canonical skills 使用 flat 目錄：`skills/<skill-name>`。跨框架或技術棧限定的分類不靠資料夾分層，而是記錄在 `skills.manifest.json` 的 `scope` 欄位，例如 `common` 或 `laravel`。

不要手動修改 generated adapter files；改 `skills/` 或 `skills.manifest.json` 後重新執行同步腳本。

## 治理

共享 skills 必須維持專案中立、精要、可審查，並可跨團隊重複使用。

特定專案規則應放在 consuming projects 中，不應放入本 repository。

Skill 變更應針對清楚度、觸發條件準確性、操作安全性，以及與支援 agents 的相容性進行審查。

會改變 agent 行為的變更，必須在廣泛採用前完成紀錄。

## Skill 品質

每個 skill 應定義清楚目的、精準觸發條件、必要 workflow、預期輸出與驗證要求。

Skill 內容應避免不必要背景、重複文件，以及會降低 agent 可預測性的寬泛指令。

非必要常駐的長篇參考資料、可重複使用 scripts 與 assets，應與主要 instruction file 分離。

## 版本管理

Consuming projects 在載入共享 skills 前，應以 tag 或 commit SHA 固定本 repository 版本。

會改變行為的更新應有意識地發布，並在廣泛 rollout 前以實際專案使用情境審查。

實際專案情境只用於驗證 shared skill 的通用性，不得把該專案業務規則回灌到 shared skill。

Draft skills 可以快速演進。Stable skills 僅應透過已審查變更更新。

## Plugin Packaging

全新專案預設使用 private plugin marketplace 取得 shared skills。Skill 內文只維護在 canonical `skills/`；工具差異集中在 `skills.manifest.json` 的 `distribution` 區塊與 generated adapter manifests。直接載入 skill path、git submodule 或 vendored copy 僅保留給離線環境或工具尚未支援 plugin marketplace 的情境。

更新 canonical skills 或 plugin metadata 後，先同步 adapter files：

```bash
node scripts/sync-plugin-adapters.mjs
```

再執行 validation：

```bash
node scripts/validate-skills.mjs
```

Validation 會檢查 manifest、`SKILL.md` frontmatter、skill discovery，以及 Codex / Claude adapter files 是否仍與 manifest 同步且指向 repository root。

Codex adapter：

- Marketplace catalog: `.agents/plugins/marketplace.json`
- Plugin root: repository root
- Plugin manifest: `.codex-plugin/plugin.json`
- Skill source: `skills/`

Claude adapter：

- Marketplace catalog: `.claude-plugin/marketplace.json`
- Plugin root: repository root
- Plugin manifest: `.claude-plugin/plugin.json`
- Skill source: `skills/`

私有分享時，將本 repository 放在 private GitHub、GitLab 或其他 private git host，並讓同事使用自己的 git credentials 安裝 marketplace。Marketplace 是 plugin catalog，不等於公開上架。

## 專案引用

本 repository 是共通 SKILL 的 canonical source。Consuming projects 只保留專案業務規則、環境設定、repo-specific commands 與部署限制。

Consuming projects 不應 local-edit shared skills；若需要改 shared 行為，應回到本 repository 修改並更新 changelog。

引用方式優先使用 private plugin marketplace，並記錄 pinned tag 或 commit SHA。若專案仍使用 git submodule、vendored copy 或 agent skill path，必須說明原因與升級策略。

Consuming project 的 `AGENTS.md` 應明確列出 shared skills 來源、pinned ref、升級時需檢查 `CHANGELOG.md`，並說明本專案只補 project-specific instructions。

可使用 `templates/consuming-project-AGENTS.md` 作為 consuming project 的最小引用範本。

## 貢獻

所有新增與更新都必須維持本 repository 的共享範圍。

新增 skills 應審查命名、觸發準確性、可移植性、安全性與維護成本。

既有 skills 僅應在能改善重複執行、降低歧義，或處理已觀察到的失敗模式時修訂。
