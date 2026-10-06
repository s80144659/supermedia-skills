---
name: container-install-permissions
description: Use when running Composer, npm, or similar dependency installs inside a development container, especially when they fail with write errors, post-install script failures, or file ownership mismatches between the container user and mounted directories.
---

# 容器內套件安裝的執行身分

在開發容器內跑 `composer`、`npm` 等安裝指令前，先確認**執行身分與檔案 owner 一致**。兩者不一致時會出現看似無關的錯誤（寫入失敗、安裝後腳本失敗），真正原因卻是權限。

## 作業流程

1. 比對容器的執行 uid 與目標目錄（專案根目錄、`vendor/`、`node_modules/`、套件快取目錄）的 owner uid。
2. 不一致時，優先讓兩者一致（compose 的 `user:` 設定，或調整 mount 策略），而不是每次用 `-u` 繞過。
3. 確實無法一致時，以 `--no-scripts`（npm 為 `--ignore-scripts`）跳過安裝後腳本，再以有寫入權限的身分補跑該腳本（例如 Laravel 的 `php artisan package:discover`）。

混用 bind mount 與 named volume 的專案特別容易踩到：兩者的 owner 可能不同，導致任何單一身分都有寫不進的位置。這時要逐一列出每個寫入位置的 owner，不要只看專案根目錄。

## 防護

- 不用 `chmod -R 777` 或把整個專案改成 root 擁有來「解決」權限問題；這會掩蓋 owner 不一致，並讓宿主機上的檔案變成 root 才能改。
- 不在共用或正式環境的容器內改 owner；先確認該容器是否只供本機開發使用。

## 停止條件

- 需要變更 compose 檔、Dockerfile 的 `USER` 或 mount 策略 → 先說明影響範圍，由使用者決定。
- 無法判斷某個寫入位置是 bind mount 還是 named volume → 先查 compose 設定與 `docker inspect`，不要猜。

## 驗證

```bash
# 容器執行身分
docker compose exec <service> id

# 目標目錄的 owner（數字 uid，避免容器內外名稱對照不同）
docker compose exec <service> stat -c '%u:%g %n' <project-root> <project-root>/vendor
```

修正後重新執行原本失敗的安裝指令，確認錯誤消失，且產生的檔案 owner 與預期一致。
