# Supermedia Skills

Supermedia 開發者與 AI coding agents 共用的工程 skills repository。

## 目的

本 repository 集中維護可重複使用的 skills，支援軟體交付流程中的規劃、實作、審查、測試、發布與維護。

本 repository 用於共享作業指引，不承載特定專案的業務規則。

本 repository 不是 agent persona catalog；skills 應是 task-specific、可載入、可執行、可維護的工作包。

## 相容性

Skills 應盡可能維持可被 Codex、Claude 與相容 agent workflows 讀取與使用。

每個 skill 應保持可移植、精要，並避免依賴單一 consuming project；必要依賴必須明確揭露。

## Repository 結構

Skills 依 scope 組織，並以自包含目錄維護。

每個 skill 必須包含 `SKILL.md`，作為主要 instruction source。

選用資源僅應在能直接提升 skill 的可靠性、清楚度或操作價值時加入。

`skills/common` 用於跨框架共通工程流程；技術棧限定的共通 skill 應使用對應 scope，例如 `skills/laravel`。

`skills.manifest.json` 是本 repository 的唯一 skill catalog。

## 治理

共享 skills 必須維持專案中立、精要、可審查，並可跨團隊重複使用。

特定專案規則應放在 consuming projects 中，不應放入本 repository。

Skill 變更應針對清楚度、觸發條件準確性、操作安全性，以及與支援 agents 的相容性進行審查。

會改變 agent 行為的變更，必須在廣泛採用前完成紀錄。

## Skill 品質

每個 skill 應定義清楚目的、精準觸發條件、必要 workflow、預期輸出與驗證要求。

Skill 內容應避免不必要背景、重複文件，以及會降低 agent 可預測性的寬泛指令。

非必要常駐的長篇參考資料、可重複使用 scripts 與 assets，應與主要 instruction file 分離。

## 版本管理

Consuming projects 在載入共享 skills 前，應以 tag 或 commit SHA 固定本 repository 版本。

會改變行為的更新應有意識地發布，並在廣泛 rollout 前以實際專案使用情境審查。

實際專案情境只用於驗證 shared skill 的通用性，不得把該專案業務規則回灌到 shared skill。

Draft skills 可以快速演進。Stable skills 僅應透過已審查變更更新。

## 專案引用

本 repository 是共通 SKILL 的 canonical source。Consuming projects 只保留專案業務規則、環境設定、repo-specific commands 與部署限制。

Consuming projects 不應 local-edit shared skills；若需要改 shared 行為，應回到本 repository 修改並更新 changelog。

引用方式可依專案工具鏈選擇 git submodule、vendored copy 或 agent skill path，但必須記錄 pinned tag 或 commit SHA，以及實際 integration method。

Consuming project 的 `AGENTS.md` 應明確列出 shared skills 來源、pinned ref、升級時需檢查 `CHANGELOG.md`，並說明本專案只補 project-specific instructions。

可使用 `templates/consuming-project-AGENTS.md` 作為 consuming project 的最小引用範本。

## 貢獻

所有新增與更新都必須維持本 repository 的共享範圍。

新增 skills 應審查命名、觸發準確性、可移植性、安全性與維護成本。

既有 skills 僅應在能改善重複執行、降低歧義，或處理已觀察到的失敗模式時修訂。
