---
name: laravel-scramble-api-docs
description: Use when writing or reviewing Laravel Scramble API documentation, especially Resource or Form Request schemas, nested responses, required fields, nullability, response wrappers, or schema export verification.
---

# Laravel Scramble API 文件

Scramble 文件應反映可執行的 Laravel 請求與回應契約。

## 作業流程

1. 定位路由、控制器、Form Request、Resource、回應包裝與相關測試。
2. 加入手寫範例前，優先使用 Form Request 規則、Resource、具型別回應與 PHPDoc 陣列形狀的推導結果。
3. 對巢狀回應，將結構形狀追到客戶端實際使用的物件或陣列項目。
4. 只在填補推導缺口時使用回應屬性或註解。
5. 可用時執行專案的 Scramble 分析或匯出指令。
6. 比對匯出的 `paths` 與 `components.schemas` 中的方法、請求本文、回應包裝、必填欄位、可空性、項目型別與描述。

## 檢查清單

- 除非必要，請求欄位不在 Form Request 與控制器註解中重複描述。
- 回應包裝欄位，例如 `status`、`code`、`message`、`data`、`meta`，表達一致。
- API 契約需要穩定鍵時，Resource 不使用條件式欄位。
- 範例只用來展示載荷，不取代結構驗證。
- 文件、Resource、Form Request、測試與面向客戶端的行為一致。

## 停止條件

遇到以下情況，停止並回報不一致：

- 聚焦修正後，Scramble 仍無法推導預期結構。
- 匯出的結構與可執行行為不一致。
- 無法判斷巢狀欄位的必填或可空狀態。
- 需要用手寫長 JSON 範例掩蓋真實的 Resource 或 Form Request 契約問題。
