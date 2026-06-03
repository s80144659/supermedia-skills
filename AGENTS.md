# AGENTS.md

本文件提供 Codex、Claude 類 coding agents 在維護本 repository 時的操作規則。

## Repository Role

本 repository 是 Supermedia shared engineering skills catalog。目標是維護 task-specific skill packages，而不是 agent persona catalog。

請優先維持 skills 的可發現性、可載入性、可執行性、可驗證性與跨工具相容性。

## Working Rules

- 修改前先閱讀 `README.md`、`CONTRIBUTING.md`、`skills.manifest.json` 與目標 `SKILL.md`。
- 不要把單一 consuming project 的業務規則、暫時性 workaround 或環境設定加入 shared skill。
- `SKILL.md` frontmatter 的 `name` 與 `description` 使用英文優先。
- `description` 必須描述 skill 做什麼，以及何時使用。
- 除必要技術名詞、工具名、程式碼、指令與欄位名稱外，`SKILL.md` 正文使用中文。
- `skills/common` 僅放跨框架共通工程流程；Laravel 等技術棧限定 skill 使用對應 scope。
- 保持 `SKILL.md` 精要；長篇資料放入 `references/`。
- 只有在能提升可靠性、清楚度或操作價值時，才新增 `scripts/`、`references/` 或 `assets/`。
- 新增、刪除或移動 skill 時，同步更新 `skills.manifest.json`。
- 會影響 agent 行為的變更，必須更新 `CHANGELOG.md`。
- 新增、刪除、移動、重新命名 skill 或調整 stability，也必須更新 `CHANGELOG.md`。
- Commit message 使用 `[type] 摘要` 格式，摘要以中文為主，不在尾端附加額外括號註記。
- 不要回退使用者或其他 agent 已做出的無關變更。

## Validation

完成變更後執行：

```bash
node scripts/validate-skills.mjs
```

若 validation 失敗，先修正 repository 結構、frontmatter、manifest 或 version mismatch，再交付結果。

## Review Focus

審查時優先檢查：

- 觸發條件是否精準
- workflow 是否可被 agent 直接執行
- stop conditions 是否能防止錯誤行為
- optional resources 是否符合 progressive disclosure
- skill 是否仍保持專案中立
- manifest、VERSION、CHANGELOG 是否同步

## Output Expectations

回報變更時，說明 touched files、行為影響、validation 結果與任何未處理風險。若未執行 validation，必須說明原因。
