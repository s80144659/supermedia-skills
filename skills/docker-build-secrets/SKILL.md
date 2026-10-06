---
name: docker-build-secrets
description: Use when a Docker build or in-container dependency install needs private credentials such as Composer auth.json, npm tokens, or SSH keys, or when reviewing whether credentials leak into image layers.
---

# Docker 建置期憑證處理

image layer 是永久的。憑證一旦寫進任何一層，之後刪除也拿得回來。

## 核心規則

`COPY`、`ADD`、`RUN` 產生的每一層檔案都保存在 image 裡。後續層的 `rm` 只是標記刪除，前一層的原始內容仍可被取出。`ARG` 與 `ENV` 不產生檔案層，但值會留在 image metadata，`docker history` 可讀。

因此：

- **同一個 `RUN` 內建立的暫存檔，必須在同一個 `RUN` 內刪掉**（用 `&&` 串接）。跨 `RUN` 刪除無效。
- **憑證最好從一開始就不要落地**。BuildKit secret 掛載點本身不進 layer，不需要清理，也就沒有忘記清理的風險。
- `ARG` 與 `ENV` 不可用來傳憑證。

## 建置期取得私有套件

優先採用 `env=` 形式，機密只在該行 `RUN` 存在，全程不落地：

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=composer_auth,env=COMPOSER_AUTH \
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts
```

建置指令：

```bash
docker build --secret id=composer_auth,src="$HOME/.config/composer/auth.json" .
```

`env=` 需要 Dockerfile 語法 1.10 以上。檔案開頭的 `# syntax=docker/dockerfile:1` 會取用 1.x 最新版；舊版建置器不認得這個選項，會直接建置失敗。

次選是掛到路徑 `dst=`；只有在工具無法從環境變數讀取認證時才用。若必須把機密複製到別處（例如工具要求 `COMPOSER_HOME` 內有實體檔案），複製與 `rm -rf` 一定要在同一個 `RUN` 內完成。

其他工具：

- npm 不會自動讀取 `NPM_TOKEN`。build context 內的 `.npmrc` 只寫引用（`//registry.npmjs.org/:_authToken=${NPM_TOKEN}`），不寫 token 本身，再以 `--mount=type=secret,id=npm_token,env=NPM_TOKEN` 提供值。
- Git over SSH 用 `RUN --mount=type=ssh`，建置時須加上 `docker build --ssh default`，否則容器內沒有可用的 agent。

## 必要防護

- `.dockerignore` 必須排除憑證檔（`auth.json`、`.npmrc` 內含 token 時、`.env`、金鑰檔）。`.gitignore` 排除不等於 build context 排除；只要 Dockerfile 有 `COPY . .`，未被 `.dockerignore` 排除的憑證就會進 image。
- 憑證檔存在於專案根目錄時風險最高：開發者為了方便放一份，下次建置就外洩，且不會有任何錯誤訊息。

## 專案現行做法與本規範不同時

專案可能刻意把憑證帶進 image，作為已知取捨。遇到時不要自行改成 secret 掛載；先停下，向使用者說明現況、風險與遷移成本，由使用者決定是否變更。

說明風險前先確認：image 是否推送到 registry、誰能存取 image 與建置主機、憑證的權限範圍與輪替成本。

## 臨時把憑證送進容器

在執行中的容器內安裝套件、需要臨時放入憑證時，用完立即刪除，不要留在容器檔案系統，也不要在之後 `docker commit` 成 image。

## 停止條件

- 專案現行做法與本規範衝突 → 停止，說明後由使用者決定。
- 不確定 image 會流向哪裡（registry、外部交付、CI artifact）→ 停止，確認流向後再判斷。
- 需要輪替或撤銷疑似已外洩的憑證 → 停止，交由使用者處理，不自行操作憑證系統。

## 驗證

變更憑證處理方式後，實際確認而不是推論。只看最終檔案系統不夠：前一層寫入、後一層刪除的憑證在最終檔案系統看不到，卻仍留在 layer 裡。

```bash
# 逐層檢查：匯出 image，列出每一層 tar 的檔名（新舊 save 格式都適用）
docker save <image> -o image.tar && mkdir layers && tar -xf image.tar -C layers
find layers -type f | while read -r f; do
  tar -tf "$f" 2>/dev/null | grep -qE '(^|/)auth\.json$' && echo "found in $f"
done
# 後續層刪除時會留下 .wh.auth.json 這類刪除標記，不含內容；上面的比對已排除它

# 憑證不在 image metadata（ARG、ENV、建置指令）
docker history --no-trunc <image> | grep -c '<機密片段>'

# .dockerignore 確實排除：暫時放置該檔案後，用只做 COPY 的最小 Dockerfile 建置，
# 應失敗於 "not found"。同時用一個未被排除的檔案做對照組，確認測試本身有效。
```

逐層檢查也可改用 `dive` 等 layer 檢視工具。比對字串時注意誤判：base image 可能本來就含有該字串，先確認該字串在憑證加入前是否已存在。
