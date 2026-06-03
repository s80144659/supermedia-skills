---
name: laravel-security-testing
description: Use when planning or reviewing Laravel API security test coverage, including auth boundaries, route permission matrices, tenant isolation, token behavior, rate limits, sensitive data exposure, and OWASP baseline checks.
---

# Laravel 安全測試

安全測試應保護最容易默默失效的邊界：存取控制、租戶隔離、權杖語意與敏感資料處理。

## 作業流程

1. 識別受保護資產：帳號、租戶資料、管理操作、檔案、權杖、金額、匯出資料與個人資料。
2. 依角色、防護機制、租戶脈絡、限流與狀態前置條件映射路由。
3. 在路由、政策、服務與查詢層測試存取控制。
4. 針對列表、詳情、變更操作、檔案、匯出、工作與通知測試租戶隔離。
5. 測試權杖行為：過期、撤銷、能力錯誤、防護錯誤、租戶錯誤與格式錯誤。
6. 測試驗證邏輯，以及回應與日誌中的敏感資料暴露。
7. 先執行聚焦的功能測試，再視需要擴大到更完整的安全測試組合。

## Laravel 檢查清單

- Form Request 對格式錯誤與惡意輸入回 422，而不是 500。
- 認證失敗穩定區分 401 與 403。
- 限流保護公開認證端點與容易被濫用的端點。
- Resource 不暴露密碼、權杖、機密、銀行資料、完整身分證字號或內部旗標。
- 日誌與稽核紀錄避免機密，同時保留足夠追溯性。
- 資料庫遷移或 seeder 不削弱預設角色、權限或租戶歸屬。

## 停止條件

遇到以下情況，簽核前應停止：

- 新路由缺少拒絕角色或跨租戶測試。
- 角色或權杖能力已變更，但矩陣未更新。
- 新暴露敏感資料，且產品決策不明確。
- 正式環境安全設定或限流變更，但沒有發布驗證。
