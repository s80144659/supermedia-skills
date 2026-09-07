---
name: laravel-api-contract
description: Use when adding or changing Laravel API endpoints, Form Requests, Resources, response wrappers, OpenAPI/Scramble docs, or client-facing response shapes.
---

# Laravel API 契約

API 行為是後端、客戶端、測試與產生文件之間的契約。四者必須保持一致。

## 搭配規則

- 本技能是新增或修改 API 端點時的 primary skill。
- 只載入與本次實際變更面相關的搭配 skill，不要因搭配規則遞迴載入整個 catalog。
- 若同時改認證方式、token ability、guard、role loading 或 401/403 語意，搭配 `laravel-auth-authorization-flow`。
- 若同時改路由、中介層、角色或公開/受保護狀態，搭配 `laravel-route-authorization-matrix`。
- 若端點涉及租戶、組織、帳戶、工作區或專案邊界，搭配 `tenant-access-boundaries`。
- 若目標是測試或審查安全覆蓋，搭配 `laravel-security-testing`。
- 只有在 Scramble 推導或匯出結果需要調整時，才額外載入 `laravel-scramble-api-docs`。

## 作業流程

1. 找出既有端點風格：路由檔案、控制器模式、Form Request、Resource、回應包裝、錯誤格式。
2. 除非專案慣例不同，否則在 Form Request 定義請求契約。
3. 可行時透過 Resource 或具型別回應物件定義回應契約。
4. 保持成功與錯誤形狀穩定：`status/code/message/data/meta` 不應在不同端點間漂移。
5. 只在框架推導不足時，更新專案使用的 API 文件或註解，例如 Scramble 回應屬性。
6. 為狀態碼、認證邊界、驗證失敗、成功形狀與重要錯誤情境加入功能測試。

## 契約檢查

- 必填與可空欄位明確。
- 金額、日期、時區、狀態值與列舉字串穩定。
- 列表在需要時包含分頁或文件化排序。
- Resource 不洩漏敏感欄位。
- 公開端點在有濫用風險時具備速率限制。
- 管理端點有角色/中介層覆蓋。
- 巢狀回應物件可追溯到 Resource 或具型別結構定義，而不只是手寫範例。

## 冪等鍵的內容比對

端點以 `Idempotency-Key` 或等價去重鍵判斷重送時：

- 指紋只納入呼叫端實際送出的內容。伺服器自行產生、且每次呼叫都會變的值不得納入：時間戳、UUID、隨機 token、流水號。判準是「同一份請求重送時值會不會變」，不是「由誰產生」；伺服器決定但固定不變的值可以納入。
- 納入前先正規化成實際保存的形式：時區、數值精度、選填欄位預設值，未傳與明確 `null` 視為相同。格式差異不得造成假衝突。
- 欄位從呼叫端輸入改成伺服器產生時，必須同時移出指紋。漏掉這步的症狀是正常重送開始回衝突，但呼叫端送的內容一個字都沒變，從錯誤訊息追查不到原因，且呼叫端最可能的處理是換一把鍵重送，正好造成冪等要防的重複資源。
- 測試至少覆蓋同鍵同內容回既有資源、同鍵不同內容回衝突，以及拉開時間差後重送仍視為同一份。

## 停止條件

遇到以下情況，編碼前應停止：

- 面向客戶端的形狀與既有 Resource 或文件化包裝衝突。
- 規格對認證、通知通道、資格、金額門檻或狀態名稱互相衝突。
- 端點需要的第三方契約仍缺失。
