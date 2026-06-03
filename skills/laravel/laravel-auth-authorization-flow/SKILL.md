---
name: laravel-auth-authorization-flow
description: Use when implementing or reviewing Laravel authentication and authorization flows, including Sanctum tokens, token abilities, middleware ordering, role or profile loading, login boundaries, and audit logging.
---

# Laravel 認證授權流程

認證證明身分；授權證明目前身分能在目前脈絡執行目前操作。

## 作業流程

1. 找出認證入口：登入、登出、註冊、密碼重設、權杖更新與個人資料查詢。
2. 找出授權路徑：中介層、政策、gate、服務、路由群組與模型範圍。
3. 明確定義目前角色或脈絡來源：權杖能力、防護、工作階段、成員資格、租戶脈絡或路由參數。
4. 保持權杖能力名稱、中介層解析與角色/個人資料載入同步。
5. 同時存在平台層角色與租戶範圍角色時，清楚分離兩者。
6. 對敏感跨角色或特權操作做稽核，但不記錄機密或完整權杖。
7. 為未認證、已認證但角色錯誤、已認證且角色正確、停用/停權身分，以及過期/格式錯誤權杖情境加入測試。

## Laravel 檢查清單

- 受保護路由使用預期的中介層鏈與順序。
- Sanctum 能力或防護穩定，且在單一位置解析。
- 政策與服務不信任僅來自請求的角色或租戶值。
- 公開認證端點有登入限流與濫用邊界。
- 敏感認證失敗回傳穩定的 401 或 403 回應，且不洩漏帳號狀態。

## 停止條件

遇到以下情況，變更認證行為前應停止：

- 角色、能力、防護或權杖載荷格式要變更，但沒有遷移或相容性計畫。
- 既有權杖可能在不同語意下仍保持有效。
- 稽核日誌歸屬不清楚。
- 產品規則對非啟用生命週期狀態是否可認證互相衝突。
