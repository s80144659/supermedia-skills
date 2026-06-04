# PDF 部署檢查清單

## 快速定位命令

```bash
# 確認 Gotenberg container 是否運行
docker ps | grep gotenberg

# 列出 Gotenberg image 內已安裝字型（需進入容器）
docker exec <gotenberg-container> fc-list | grep -i "noto\|cjk\|chinese\|japanese\|korean"

# 驗證自訂字型已被 fc-cache 收錄
docker exec <gotenberg-container> fc-list | grep <font-name>

# 確認 spatie/laravel-pdf 已安裝
composer show spatie/laravel-pdf

# 本地產生 PDF 測試（Tinker）
php artisan tinker
# > Spatie\LaravelPdf\Facades\Pdf::view('pdf.template', $data)->save('/tmp/test.pdf');

# 檢查產出 PDF 字型子集（需安裝 pdffonts）
pdffonts /tmp/test.pdf
```

---

## 新增 PDF 功能前

- [ ] 確認需要渲染的內容是否含 CJK（中文、日文、韓文）字元
- [ ] 選型確認：含 CJK → Gotenberg + spatie/laravel-pdf；純 ASCII/Latin 輕量需求才考慮 mPDF/DOMPDF
- [ ] 確認 `composer.json` 已有 `spatie/laravel-pdf` 依賴
- [ ] 確認 `.env` 已設定 `GOTENBERG_URL`（對應 `config/laravel-pdf.php` 的 `gotenberg.url`）

---

## Gotenberg container 部署

- [ ] 使用自訂 `Dockerfile` build Gotenberg image，不直接使用 `gotenberg/gotenberg` base image
- [ ] `Dockerfile` 中已在 USER root 下執行 `fc-cache -fv`，確保內建字型被 Chrome 索引
- [ ] `gotenberg/gotenberg:8` 已內建 Noto Sans CJK 系列，通常不需額外 COPY 字型；若需自訂字型先以 `fc-list` 確認 image 是否已有同名字型
- [ ] Build 完成後以 `docker exec <container> fc-list` 驗證字型名稱與 CSS `font-family` 宣告一致
- [ ] `docker-compose.yml`（或 container orchestration 設定）已將 Gotenberg service 網路對 Laravel container 可達

---

## Blade 模板準備

- [ ] PDF Blade 模板的 CSS `font-family` 與容器內 `fc-list` 回傳的字型名稱完全相符（區分大小寫）
- [ ] 未使用 web font CDN（Gotenberg 需要本機字型，外部 CDN 在 headless 環境可能無法載入）
- [ ] 已用小型本地測試驗證 CJK 字元可正常渲染（不出現豆腐字）

---

## 部署後驗證

- [ ] 在 staging 產生含 CJK 的 PDF，用 PDF reader 目視確認文字可讀
- [ ] 確認 `pdffonts` 輸出中字型 subset 標記（`AAAAAA+` 前綴）屬 Chrome 正常行為，不需額外處理
- [ ] 確認 Gotenberg container log 無 `font not found` 或 `cannot find font` 錯誤
- [ ] 若 Acrobat 顯示「內嵌字型子集」警告，確認為正常行為後忽略

---

## 常見問題索引

| 症狀 | 優先查看 |
|------|----------|
| CJK 字元變豆腐字或空白 | `fc-list` 確認字型是否已 cache；CSS `font-family` 名稱是否與 `fc-list` 輸出一致 |
| PDF 完全空白或無法開啟 | Gotenberg container 是否正在運行；`GOTENBERG_URL` 是否設定正確 |
| 字型顯示正確但 Acrobat 警告 | 屬 Chrome subset 命名正常行為（`AAAAAA+`），無需處理 |
| 自訂字型 build 後仍無法顯示 | 確認 `Dockerfile` 中 `fc-cache` 是否在 COPY 字型之後執行 |
| mPDF 子集化 bug | 換 Gotenberg，不修補 mPDF |
