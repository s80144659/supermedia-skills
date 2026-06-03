# Changelog

本文件記錄會影響 agents 發現、載入、執行或維護 shared skills 的變更。

## [0.1.0-draft] - 2026-06-03

- 建立 `supermedia-skills` repository 的 shared skill catalog 定位。
- 建立中文 README 治理摘要。
- 建立 `skills.manifest.json` catalog，並將現有 skills 標示為 `draft`。
- 建立 contribution、agent 操作規則與 changelog 文件。
- 建立 validation script，用於檢查 `VERSION`、manifest、skill paths 與 `SKILL.md` frontmatter 一致性。
- 將 Laravel-specific skills 移入 `skills/laravel` scope，保留 `skills/common` 給跨框架工程流程。
- 從既有 project skills 抽取共通軟體開發邏輯，新增 commit workflow、skill maintenance、tenant boundary、scheduler side-effect、Laravel auth、route authorization、Scramble docs 與 security testing skills。
- 補強 consuming project adoption contract，要求 pin shared skills source 並把 project-specific rules 留在 consuming project。
- 新增 consuming project `AGENTS.md` 最小引用範本。
- 將 shared `SKILL.md` 正文中文化，保留 frontmatter 的英文 `name` 與 `description` 供跨工具觸發。
- 明確規範 shared `SKILL.md` 的語言策略：frontmatter `name` 與 `description` 英文優先，正文中文優先。
- 明確規範 commit message 使用 `[type] 摘要` 格式，摘要中文為主且不附加尾端括號註記。
- 將 commit workflow 從專案 overlay 上收為 shared skill，加入提交前檢查清單與任務/文件/技能同步檢查。
