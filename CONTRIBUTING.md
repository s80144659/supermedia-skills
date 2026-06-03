# Contributing

本文件定義 Supermedia shared skills 的新增、修改、審查與發布流程。

## 維護原則

本 repository 只維護可跨專案重複使用的 engineering skills。特定專案的業務規則、暫時性 workaround、環境專屬設定與未經驗證的團隊偏好，應留在 consuming project。

Skill 內容應可被 coding agents 發現、載入、執行與驗證。每次變更都應改善觸發準確性、操作清楚度、安全性、可移植性或已觀察到的失敗模式。

## 新增 Skill 流程

1. 確認需求屬於 shared skill，而不是單一專案規則。
2. 在 `skills/<scope>/<skill-name>/` 建立自包含目錄。
3. 建立 `SKILL.md`，並加入英文優先的 frontmatter。
4. 讓 `description` 同時說明 skill 做什麼，以及何時應使用。
5. 只在必要時加入 `scripts/`、`references/` 或 `assets/`。
6. 將新 skill 加入 `skills.manifest.json`，並設定 `stability`。
7. 執行 validation script。
8. 更新 `CHANGELOG.md`。

## 修改 Skill 流程

1. 先閱讀目標 skill 的 `SKILL.md` 與相關 `references/`。
2. 判斷修改是清楚度改善、觸發條件調整、workflow 改動、驗證要求改動，或相容性修正。
3. 保持 `SKILL.md` 精要，將長篇背景、政策、表格與非必要常駐資料移到 `references/`。
4. 若修改會影響 agent 的決策、停止條件、輸出格式或驗證要求，更新 `CHANGELOG.md`。
5. 執行 validation script。

## SKILL.md 要求

每個 `SKILL.md` 必須包含 YAML frontmatter，且至少包含 `name` 和 `description`。

`name` 必須與 skill folder name 及 manifest entry 一致。`description` 應英文優先，並具備足夠觸發情境，避免過短或過泛。

除必要技術名詞、工具名、程式碼、指令與欄位名稱外，`SKILL.md` 正文使用中文。此規則不適用於 frontmatter 的 `name` 與 `description`。

Validation 目前只支援 simple scalar frontmatter，也就是每行使用 `key: value`。不要在 frontmatter 使用 multiline YAML、nested object 或 array。

正文應包含必要 workflow、停止條件、輸出要求或驗證要求。避免把 agent persona、單一專案背景或大量參考資料放入主要 instruction source。

## Optional Resources

`scripts/` 用於可重複、需要確定性或容易出錯的操作。

`references/` 用於長篇資料、政策、背景脈絡、表格或較少需要載入的內容。

`assets/` 用於模板、靜態素材與輸出資源。

Optional resources 必須能直接提升 skill 的可靠性、清楚度或操作價值。

## Stability

`draft` 表示 skill 仍可快速調整，尚未完成共享採用前的穩定審查。

`stable` 表示 skill 已通過共享使用審查，更新時應確認行為影響並記錄必要變更。

`deprecated` 表示保留相容性，但不建議新專案採用。

## Review Checklist

審查新增或修改時，至少確認以下項目：

- 是否屬於 shared repository 範圍
- skill name 與 folder name 是否使用英文 hyphen-case
- frontmatter 是否完整且英文優先
- description 是否能支援跨 agent 觸發
- `SKILL.md` 正文是否遵守中文優先，且僅保留必要技術名詞
- workflow 是否精要、可執行、可驗證
- 是否避免專案專屬規則與過度 persona 化
- optional resources 是否必要
- manifest、VERSION 與 changelog 是否一致
- validation script 是否通過

## Validation

在提交前執行：

```bash
node scripts/validate-skills.mjs
```

Validation 通過只代表 repository 結構與 metadata 一致。Reviewer 仍需審查 skill 的實際行為品質與跨專案適用性。

## Commit Message

Commit message 使用 `[type] 摘要` 格式。

`type` 使用簡短英文分類，例如 `feat`、`fix`、`docs`、`chore`、`refactor`、`test`。

摘要使用中文為主，描述該提交實際改變的行為或文件。

不要在 commit subject 尾端附加 skill 名稱、流程分類或其他括號註記，除非使用者明確指定。

## Release

Consuming projects 應以 git tag 或 commit SHA pin 版本。

新增、刪除、移動、重新命名 skill、調整 stability 或改變 agent 行為的內容，必須記錄於 `CHANGELOG.md`，並在廣泛 rollout 前以至少一個實際專案情境審查。

`VERSION` 是本 repository 的版本來源，`skills.manifest.json` 的 `version` 必須與其一致。

Release 前檢查：

1. 更新 `VERSION`。
2. 同步 `skills.manifest.json.version`。
3. 更新 `CHANGELOG.md` 對應版本段落。
4. 執行 `node scripts/validate-skills.mjs`。
5. 建立符合 `v<version>` 格式的 tag。
