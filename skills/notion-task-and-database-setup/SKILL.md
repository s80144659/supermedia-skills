---
name: notion-task-and-database-setup
description: Use when creating a Notion task under a project or version page and verifying its bidirectional relation to the project, or when creating a new Notion database (e.g. a sub-item or feature checklist) with a status-grouped board view.
---

# Notion 任務與資料庫建立

建立使用者要求的單一任務，並以重新讀取後的雙向關聯作為完成條件。不要把「API 寫入成功」或任務單邊已有專案關聯視為完成。

## 建立前確認

1. 讀取使用者指定的專案、版本頁面或 URL，確認標題、page ID 與所屬 data source。
2. 讀取專案與任務 data source schema，找出實際的 title、status、date 與 relation 欄位；不要只依欄位顯示名稱猜測。
3. 確認任務端的專案 relation 與專案端的任務 relation 各自指向正確 data source，一律以即時 schema 為準，不要沿用其他專案看過的欄位名稱。
4. 搜尋同一專案下是否已有相同標題或同一需求的任務。若建立結果不明，先重新搜尋，不得直接重試造成重複任務。

## 作業流程

1. 在任務 data source 建立任務，不要把任務當成專案頁正文下的普通 child page。
2. 使用使用者明示的標題、內容與欄位值；其他欄位只依已確認的專案慣例或 schema 必填需求填寫，不自行擴張需求。
3. 建立時寫入任務端的專案 relation。
4. 重新讀取新任務與專案頁，檢查以下不變量：
   - 任務的專案 relation 包含目標專案。
   - 專案的任務 relation 包含新任務。
5. 若任務端正確但專案端尚未出現新任務，更新專案端 relation：保留所有既有 relation 值，只附加新任務一次。
6. 再次讀取兩個頁面。只有兩個方向都包含對方時，才回報建立完成。

## 寫入邊界

- 只建立使用者要求的任務與必要的雙向 relation，不額外建立計畫、子任務、留言或文件。
- 更新 relation array 前必須先讀取現值；不得以只有新任務的 array 覆蓋既有任務。
- 不因修正 relation 改動專案或其他任務的狀態、日期、負責人與內容。
- 若意外建立重複頁面，不自行刪除；回報兩個 page ID、URL 與可安全處理的選項。

## 檢查清單

回報任務編號或標題、直接 URL、所屬專案，以及兩個方向的 relation 驗證結果。若頁面版面隱藏 relation property，說明資料已建立在哪個欄位，避免把顯示問題誤判為關聯失敗。

## 新建資料庫加看板

新建立的 Notion 資料庫（例如任務底下的子項目／功能清單）建立後一律加一個「看板」view，不要留 Notion 預設樣板內容。

1. 用 `notion-create-database` 的 `schema`（SQL DDL）自建欄位，不要用 `database_type`（`tasks`/`projects`/`skills`）的 canonical 建立法——它會帶入 Notion 內建必填屬性與 `default_page_template`/`page_templates` 樣板頁。至少要有一個 `STATUS` 欄位，例如：
   ```sql
   CREATE TABLE ("名稱" TITLE, "狀態" STATUS)
   ```
   `STATUS` 欄位的三個 group 預設就是「未開始」（to_do）／「進行中」（in_progress）／「完成」（complete），已在實際 workspace 驗證過，不用額外改名。
2. 用回傳的 `<data-source>` id 呼叫 `notion-create-view` 建立看板：`database_id` 填新資料庫 URL、`data_source_id` 填步驟 1 拿到的 id、`name` 填「看板」、`type: "board"`、`configure: "GROUP BY \"狀態\""`（卡片只需要顯示標題就加 `SHOW \"名稱\""`）。`hideEmptyGroups` 與只顯示標題是這個 view type 的預設行為，不用另外設。
3. 用 `notion-create-pages` 把項目寫進看板：`parent` 用 `{"type": "data_source_id", "data_source_id": "<純 UUID>"}`。**注意**：這裡的 `data_source_id` 必須是純 UUID，不能像 `notion-create-view` 那樣傳 `collection://...` 形式，否則會回 400 validation_error。`properties` 填標題欄位與狀態欄位。
4. 不要另外套用範本或保留 Notion 建資料庫時自動產生的說明文字／範例列；新資料庫的內容只做步驟 1–3 的事，不擴充其他欄位。新資料庫預設會多一個「Default view」表格 view，這是 API 建庫的固定行為、不是樣板內容，不用特地刪除。
5. `notion-create-database` 沒有 `is_inline` 參數，建出來預設是獨立全頁式（`inline: false`）。要讓看板直接展開顯示在父頁面內文裡，建立後要另外呼叫 `notion-update-data-source`，帶 `data_source_id` 與 `is_inline: true`。
6. 父層要放對關聯位置，不是隨便找頁面貼上去：資料庫本身不能塞進 relation 欄位（relation 只能指向頁面／row）。若這個看板是拆解某個既有任務（任務 data source 裡的一筆 row）的功能項目，parent 應設成那個任務的 page_id，不要掛在專案頁底下——專案頁與任務之間是靠雙向 relation 屬性連結，不是頁面內文的巢狀子項目（見「建立前確認」）。放錯層級時用 `notion-move-pages` 修正：`page_or_database_ids` 可傳頁面或資料庫 id，`new_parent` 支援 `page_id`/`database_id`/`data_source_id`/`workspace`。

## 停止條件

- relation 欄位不存在、不可寫、指向錯誤，或有多個候選且無法判定時，停止並請使用者確認，不自行挑一個。
- 看板的 `STATUS` 分組名稱不確定該對齊哪個既有慣例時，先確認 workspace 現有分組再動作，不要憑印象或未驗證的 DDL 語法硬套。
