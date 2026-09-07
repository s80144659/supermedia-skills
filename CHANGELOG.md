# Changelog

本文件記錄會影響 agents 發現、載入、執行或維護 shared skills 的變更。

## [Unreleased]

- 補強 `laravel-api-contract` 的冪等鍵內容比對：指紋只納入呼叫端實際送出的內容，伺服器產生且每次呼叫會變的值不得納入，欄位從輸入改為伺服器產生時必須同時移出指紋。原本沒有請求層冪等的規則，既有三處冪等敘述都在排程與重試層面，導致指紋納入重算值時正常重送被判為內容衝突。
- 補強 `scheduler-side-effect-guardrails` 的外部成功邊界：先持久化外部系統已受理或成功的結果，再將本地暫存清理當作獨立可重試的補償，避免清理失敗覆寫已成立的業務成功。
- 補強 `laravel-migration-safety` 的 greenfield 基線與可讀性規則：未發布專案收斂修補鏈、`Schema::create()` 先寫表格註解、非直觀欄位使用精簡現行用途、`down()` 依外鍵反向拆除。
- 補強 `tenant-access-boundaries` 的巢狀資源揭露邊界：掛在父物件下的子資源可見性跟隨父物件，不另設角色門檻，需要收斂時收斂回應欄位範圍而非可見與否，且所有能存取父物件的端點共用同一份序列化來源。原本只規範跨租戶隔離與「相同歸屬檢查不代表相同回應形狀」，沒有說明子資源該不該有自己的門檻，實作時容易為單一端點補一套額外角色判斷，造成同一份資料在不同端點時有時無。
- 補強 `git-commit-workflow` 的工作樹盤點：改用 `git status --porcelain --untracked-files=all` 逐檔展開未追蹤檔案，並在全部提交後複查剩餘內容。預設 status 會把未追蹤目錄摺疊成一行，新增的檔案不會逐一出現，功能少提交一塊也不會在收工前被發現。

## [0.2.3] - 2026-08-18

- 補強 `laravel-scramble-api-docs` 的欄位型別來源與 `toArray()` 回傳型別守門：型別與可空性只認各欄位前 docblock 的 `@var`，method 層 `@return` 不進 schema，`make:resource` 產生的那份直接刪掉；`toArray()` 宣告成 `?array` 並提早 `return null` 會讓該 component 退化成不含欄位的空殼。
- 補強 `laravel-scramble-api-docs` 的推導失敗辨識：export 中 `type: string` 的欄位要逐一核對實際回傳值。Scramble 推導失敗時輸出的 `UnknownType` 繼承 `StringType`，在文件上與真正的字串無法分辨，只看 export 會把錯誤 schema 當成正確結果收工。
- 補強 `git-commit-workflow` 的 commit body 內容判準：body 只寫 diff 看不出來的動機、取捨與影響，`Why:` 不得把單一處程式歸納出的模式寫成專案既成慣例，`Impact:` 不列入未被本次改動影響的既有防護，行為改變以領域語彙而非 code identifier 描述。0.2.2 只定義了三段結構，未約束內容，導致 body 重述 diff、混入推測性慣例並過度冗長。

## [0.2.2] - 2026-08-17

- 明確 `git-commit-workflow` 的 commit body 結構：複雜提交固定使用 `Why:`、`What:`、`Impact:` 三段標籤且三段都要寫。原本「可在主旨後補充 why / what / impact」會被讀成可自由補充散文，導致 body 只寫了 what。

## [0.2.1] - 2026-08-11

- 補強 `laravel-scramble-api-docs`：Form Request 使用 `array:key1,key2` 限制允許鍵時，Scramble 會把列出的每個 key 標為 required，即使子欄位規則為 nullable；陣列含選填欄位時改用純 `array`，required 與可空性交由各子欄位的巢狀規則表達。

## [0.2.0] - 2026-07-31

- 新增 `claude-5-context-engineering`：規範撰寫給 Claude 5 世代 agent 的指令文件，涵蓋原則優先於禁令、介面設計優先於範例、漸進揭露與高保真參照物，並提供既有指令檔的精簡流程與停止條件。
- 補強 skill metadata 與 API 文件格式：`name`、`description` 必須完整使用英文；Controller 公開方法文件中的資料庫欄位名稱使用 Markdown inline code。
- 補強 `ai-change-review-guardrails` 的審查結論：固定使用接受／有條件接受／阻擋，獨立多代理 finding 不採多數決，且測試通過不得單獨作為無風險背書。
- 補強 `laravel-scramble-api-docs` 的 Resource 序列化與格式推導守門：`resolve()` 後的 nested Resource 需以 feature test 驗證實際值，可空格式欄位需同時保留型別與 format。
- 擴充 `ai-change-review-guardrails` 的撰寫階段守門規則：註解只保存可證實且無法由程式碼表達的原因或限制，並以能否阻止合理但錯誤的修改作為保留判準。
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
