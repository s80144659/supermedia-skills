---
name: laravel-route-authorization-matrix
description: Use when adding, changing, or reviewing Laravel API routes, route groups, middleware chains, role access, throttle policies, or public versus protected endpoint boundaries.
---

# Laravel 路由授權矩陣

路由是安全契約的一部分。路由註冊、中介層、角色、限流與測試必須保持一致。

## 搭配規則

- 本技能負責路由註冊、中介層與允許/拒絕矩陣。
- 只載入與本次實際變更面相關的搭配 skill，不要因搭配規則遞迴載入整個 catalog。
- 若同時改請求或回應形狀，先用 `laravel-api-contract` 定義契約。
- 若同時改 token ability、guard、role loading 或 401/403 語意，搭配 `laravel-auth-authorization-flow`。
- 若矩陣涉及租戶或資源歸屬，搭配 `tenant-access-boundaries`。
- 若目標是補足測試覆蓋或審查安全測試，搭配 `laravel-security-testing`。

## 作業流程

1. 列出受影響路由與 HTTP 方法。
2. 將每個路由分類為公開、已認證、角色限制、租戶範圍、僅管理/支援或內部路由。
3. 將路由群組中介層與附近端點比對。
4. 驗證中介層順序，特別是包裝、認證、角色、租戶、權限、限流與綁定。
5. 建立或更新允許/拒絕角色或脈絡的矩陣。
6. 視需要加入無權杖、錯誤角色、正確角色、租戶不符、缺少權限與限流行為測試。

## 預設拒絕規則

- 未列入允許矩陣的角色、能力、租戶狀態或生命週期狀態，預設拒絕。
- Route model binding 取得資源後，仍要確認 policy、scope 或服務層有覆蓋資源歸屬。
- 新增可改變狀態的路由時，沒有拒絕路徑測試就不能視為完成。

## 檢查清單

- 公開路由是有意公開，且在有濫用風險時具備限流。
- 受保護路由不能被其他角色或租戶的權杖存取。
- 路由模型綁定不繞過租戶或政策檢查。
- 管理/支援覆寫明確且可稽核。
- 錯誤狀態碼穩定：通常未認證為 401，已認證但禁止存取為 403。

## 停止條件

遇到以下情況，合併前應停止：

- 路由的預期對象不清楚。
- 中介層與類似端點不同，且沒有明確理由。
- 路由可改變狀態，但缺少授權測試。
- 產生的 API 文件顯示端點公開/受保護狀態與路由定義不一致。
