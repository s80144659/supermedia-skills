---
name: skill-maintenance-governance
description: Use when creating, updating, compressing, removing, or syncing shared or project skills, especially to prevent duplicated agent instructions, drift, or project-specific rules leaking into shared skills.
---

# 技能維護治理

維護任務導向技能套件時使用本技能。

## 來源邊界

- 長期產品政策屬於所屬產品或知識來源。
- 程式碼與測試描述目前可執行行為。
- `SKILL.md` 應只包含代理必要的最小工作流程、防護規則、停止條件與驗證要求。
- `references/` 放較長的檢查清單、查找表或不需每次載入的背景資料。
- `scripts/` 放可重複且結果確定的操作。
- `assets/` 放技能會使用的模板或靜態資源。

## 作業流程

1. 判斷規則屬於共享工程邏輯，還是專案專屬行為。
2. 建立新技能前先搜尋既有技能。
3. 前置中繼資料的 `name` 與 `description` 保持英文優先且以觸發條件為導向。
4. 除必要技術名詞、工具名、程式碼、指令與欄位名稱外，`SKILL.md` 正文使用中文。
5. 共通指引移入共享技能後，從專案文件移除重複內容。
6. 專案專屬命令、容器名稱、業務角色與環境限制留在引用專案。
7. 新增、移動、重新命名或刪除技能時，同步更新技能清單、變更紀錄與驗證期待。
8. 執行儲存庫的技能驗證指令。

## 品質檢查

- 技能有清楚觸發條件，且可獨立使用。
- `name` 與 `description` 保持英文優先，正文維持中文優先。
- 作業流程不需要閱讀無關專案歷史也能執行。
- 停止條件能防止不安全假設。
- 選用資源以漸進揭露方式載入，不預設貼進 `SKILL.md`。
- 技能避免代理人設語言與模型專屬行為。

## 停止條件

遇到以下情況，編輯前應停止：

- 提議的技能主要是產品規格或專案業務規則。
- 來源文件互相衝突，且沒有清楚優先順序。
- 變更會在沒有變更紀錄覆蓋的情況下默默改變引用專案行為。
- 共享技能需要專案本機命令才能運作。
