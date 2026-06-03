---
name: laravel-api-contract
description: Use when adding or changing Laravel API endpoints, Form Requests, Resources, response wrappers, OpenAPI/Scramble docs, or client-facing response shapes.
---

# Laravel API 契約

API 行為是後端、客戶端、測試與產生文件之間的契約。四者必須保持一致。

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

## 停止條件

遇到以下情況，編碼前應停止：

- 面向客戶端的形狀與既有 Resource 或文件化包裝衝突。
- 規格對認證、通知通道、資格、金額門檻或狀態名稱互相衝突。
- 端點需要的第三方契約仍缺失。
