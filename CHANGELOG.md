# Changelog

本文件記錄會影響 agents 發現、載入、執行或維護 shared skills 的變更。

## [Unreleased]

- 補強 `laravel-scramble-api-docs` 的 model-backed Resource 推導原則：優先直接包 Eloquent model、使用 `@mixin`，並在 endpoint 契約不同時拆分專用 Resource。
- 補強 `git-commit-workflow` 的任務追溯流程：可用 Notion MCP 時查找對應 TSK 編號並附於 commit 標題，找不到時不阻擋提交。
- 為 `test-review-sop` 新增「AI 生成測試常見反模式」段落，提供 happy-path bias、測實作而非行為、coverage 灌水、flaky、magic number、assertion roulette、弱斷言與過度 mock 的掃描清單，並導回現行審查流程與停止條件。
- 補強 `project-truth-source` 的規格文件修訂原則：正文保留現行規格，追責性決策變更使用段落「決策註記」，完整脈絡移到「決策紀錄」或「決策說明」。
- 補強 shared skills 語言風格：文件正文以繁體中文與台灣常用術語為主，必要時才保留軟體工程英文名詞、工具名或程式碼識別字。

## [0.1.0] - 2026-06-05

- 建立 `supermedia-skills` repository 的 shared skill catalog 定位。
- 建立中文 README 治理摘要、contribution、agent 操作規則與 changelog 文件。
- 建立 `skills.manifest.json` catalog，並將現有 skills 標示為 `draft`。
- 建立 validation script，用於檢查 `VERSION`、manifest、skill paths、`SKILL.md` frontmatter 與 generated adapter files 一致性。
- 將 canonical skills 統一為 flat `skills/<skill-name>`；跨框架與 Laravel scope 由 `skills.manifest.json` metadata 表達，不再用 `skills/common` 或 `skills/laravel` 作為內文來源。
- 從既有 project skills 抽取共通軟體開發邏輯，新增 commit workflow、skill maintenance、tenant boundary、scheduler side-effect、Laravel auth、route authorization、Scramble docs、security testing 與 PDF generation skills。
- 新增 private plugin marketplace 包裝，採 repo-root plugin 結構；`skills/` 是唯一 skill 內文來源，Codex / Claude 差異由 generated adapter manifests 承接。
- 將 adapter 產生流程整理為 `scripts/sync-plugin-adapters.mjs`，避免誤解成會產生第二份 skill copy。
- 補強 consuming project adoption contract，要求 pin shared skills source 並把 project-specific rules 留在 consuming project。
- 新增 consuming project `AGENTS.md` 最小引用範本。
- 將 shared `SKILL.md` 正文中文化，保留 frontmatter 的英文 `name` 與 `description` 供跨工具觸發。
- 明確規範 commit message 使用 `[type] 摘要` 格式，摘要中文為主且不附加尾端括號註記。
- 補強 shared skills 的安全與決策指引：新增測試刪改停止條件、Laravel migration 停止條件、API/route/security 搭配規則、tenant/auth default-deny 決策，以及 project truth source 的真相優先順序。
- 補強 validation 結構 warning，提示缺少 `SKILL.md` 的 skill-like 目錄，以及可能缺少 workflow、停止條件、輸出、檢查清單或驗證段落的 `SKILL.md`。
