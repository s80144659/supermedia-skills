---
name: laravel-pdf-generation
description: Use when choosing a PDF generation approach in a Laravel project, adding a PDF export feature, or troubleshooting PDF font or rendering issues (especially CJK).
---

# Laravel PDF 產生

## 選型原則

含 CJK（中日韓）內容，選 **Gotenberg + spatie/laravel-pdf**。

mPDF 對大型 CJK 字型有系統性缺陷（字型子集化連環 bug），修補成本遠高於導入 Gotenberg。只有純 ASCII／Latin 輕量需求，才考慮 mPDF 或 DOMPDF。

## 防護規則

- 新增 PDF 功能前，先確認字型是否含 CJK；若有，禁止選 mPDF。
- 自訂字型前，先確認 Gotenberg image 是否已內建同名字型（`fc-list` 驗證），避免重複引入殘缺 subset。
- Gotenberg container image 需從自訂 Dockerfile build，不直接使用 base image，確保 `fc-cache` 已執行。

## 停止條件

- 要把 Gotenberg 移出 Docker（改用外部 SaaS）前，先確認字型授權與網路安全邊界。
- 若 PDF 文字顯示正確但 Acrobat 仍有 subset 字型警告，不需額外處理（Chrome subset 命名格式 `AAAAAA+` 是正常行為）。

技術設定步驟與部署清單見 `references/pdf-deployment-checklist.md`。
