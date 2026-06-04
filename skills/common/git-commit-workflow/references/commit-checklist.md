# Commit 檢查清單

## 何時使用

- 被要求提交 commit。
- 需要拆分多個 commit。
- 同一檔案混有本次與無關修改。
- 需要確認文件、技能或任務脈絡是否一起更新。

## 提交前檢查

1. 執行 `git status --short`。
2. 執行 `git diff --stat`。
3. 確認是否需要拆 commit。
4. 確認是否有無關檔案或 hunk 不應 stage。
5. 任務追蹤號來自 Notion（格式如 `TSK-NNN`）：
   - Notion MCP 可用時：直接查對應頁面取得編號。
   - Notion MCP 不可用時：詢問使用者 Notion 上是否有對應任務，若有請提供編號。
   - 取得後放在 commit subject 末尾，空一格，不加括號，例如：`[feat] 修正匯出權限 TSK-123`。
6. 檢查相關文件與技能是否需要同步。
7. 若本次含資料庫遷移，檢查檔名時間戳是否與相依、部署或回復順序一致。
8. 提交前執行 `git diff --staged` 並完整檢查內容。

## Commit Message 原則

- 使用 `[type] 摘要` 格式，例如 `[fix] 修正任務匯出權限`。
- `type` 使用簡短英文分類，例如 `feat`、`fix`、`docs`、`chore`、`refactor`、`test`。
- 摘要使用中文為主，描述這個提交實際改變了什麼。
- 不在 commit subject 尾端附加 skill 名稱、流程分類或其他括號註記，除非使用者明確指定。
- 一個 commit 只做一件事。
- 簡單修改可單行描述。
- 複雜修改再補 why / what / impact。

## 常見誤區

- 把無關 hunk 一起 stage。
- 為了省事整支檔案直接 stage。
- 有規格或流程變更卻忘記同步文件或技能。
- 有任務編號可對應卻沒有回看任務脈絡。
- Notion MCP 可用卻沒主動查任務編號，或 MCP 不可用卻忘記問使用者。
- 任務編號放錯位置（非 subject 末尾）或加了多餘括號。
- 資料庫遷移檔名時間戳與 commit、部署或回復順序衝突。
