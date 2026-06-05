# Changelog

本文件記錄會影響 agents 發現、載入、執行或維護 shared skills 的變更。

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
