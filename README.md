# Jira Working Guide

Jira Working Guide 是供 PM、RD、QA 查閱 Workflow、Fields 與 Automation 規範的 React 單頁網站。

## Local development

需求：Node.js 18 或更新版本。

```bash
npm install
npm run dev
```

靜態 production build：

```bash
npm run build
npm run preview
```

`npm run dev` 只啟動 Vite。若要連同 `/api/workflow-recommendations` Vercel Function 一起測試，請安裝 Vercel CLI 並使用：

```bash
vercel dev
```

## Workflow AI recommendations

Workflow 頁可用自然語言提問，公司內部 LLM Gateway 會回傳簡短摘要與相關 Card IDs。瀏覽器只呼叫本站的 Vercel Function，不會取得 Gateway API key、system prompt 或完整 Guide corpus。

### Server environment

將 `.env.example` 複製為未追蹤的本機環境檔，或直接在 Vercel 設定：

- `LLM_GATEWAY_API_KEY`：公司 Gateway API key
- `LLM_GATEWAY_MODEL`：Gateway 接受的 model 字串
- `WORKFLOW_LOG_APPS_SCRIPT_URL`：既有意見反饋 Apps Script Web App `/exec` URL
- `WORKFLOW_LOG_SECRET`：Vercel 與 Apps Script 共用的高強度隨機 secret

這些變數是 server-only，**不可**使用 `VITE_` prefix、不可放入 `src/config.js`，也不可提交真實值。

Gateway endpoint 固定為：

```text
https://llm-gateway.kkcompany-internal.com/v1/messages
```

Adapter 採用已驗證可用的 Messages-compatible 契約：

- Headers：`x-api-key`、`anthropic-version: 2023-06-01`、`content-type: application/json`
- Request body：`model`、`max_tokens` 與 `messages`；固定指令和 catalog 由 server 組入 user message
- Response text：`content[0].text`
- Error payload：`error`（只轉為受控錯誤，不回傳 Gateway 原始訊息給瀏覽器）

Gateway-specific 行為集中在 `api/_lib/llmGatewayClient.js`；不要將 provider 契約擴散到 handler 或前端。

### Google Sheet query log

成功且通過 server 驗證的 AI 查詢會由 Vercel Function 呼叫既有意見反饋 Google Apps Script，並以 `action: "workflow_ai_log"` 分流至 AI 紀錄 Sheet。瀏覽器不會取得 AI 紀錄用的共用 secret。每列包含：

1. 發問時間
2. 問題
3. AI 給的回覆
4. AI 選出的 Workflow Card 標題（多張以換行分隔）

記錄採 best-effort：server 最多等待約 3 秒，寫入失敗不會使 AI 查詢失敗。系統不自動 retry，因為 timeout 發生時 Google 可能已完成寫入，重試會造成重複列。兩端都會防止以 `=`, `+`, `-`, `@` 開頭的內容被 Sheet 解讀為公式。

整合後的 Apps Script 原始碼位於 `google-apps-script/workflowRecommendationLogger.gs`。它固定使用 gid `0` 讀寫既有意見反饋／問題集，並將 `action: "workflow_ai_log"` 寫入 gid `379945495`。部署方式：

1. 在 AI 紀錄 tab 建立 `發問時間`、`問題`、`AI 給的回覆`、`篩選出的卡片` 四個 header。
2. 以 repo 中的 `.gs` 內容取代既有 Apps Script 程式碼。
3. 在 Apps Script 的 Script Properties 設定 `WORKFLOW_LOG_SECRET`。
4. 建立新版本並更新既有 Web App deployment。
5. `WORKFLOW_LOG_APPS_SCRIPT_URL` 使用與 `src/config.js` 相同的 `/exec` URL；將 URL 與 secret 設定到 Vercel Preview／Production，再重新部署。

此 Sheet 會刻意保存完整問題與 AI 摘要，必須限制試算表存取權並訂定資料保存期限。`src/config.js` 的 URL 可公開給既有反饋功能使用，但 `WORKFLOW_LOG_SECRET` 只能放在 Apps Script Properties 與 Vercel server environment。Vercel 與 Apps Script logs 仍不得記錄問題、回覆、Card 標題或 secret 原文。

## Deployment protection

目前 AI 功能定位為內部 MVP，尚未加入 application-level persistent rate limiting。上線前必須：

1. 在 Vercel 對 Production、Preview 與 `/api/*` 啟用 Deployment Protection。
2. 實際確認未登入訪客無法直接 POST `/api/workflow-recommendations`。
3. 在 Gateway 設定 model allowlist、request/spend quota 與警示。
4. Preview 與 Production 使用不同 key 或配額（若 Gateway 支援）。
5. 確認 Function logs 不記錄完整問題、prompt、model output 或 secret。

Deployment Protection 不是正式的 user-level rate limit。若日後開放公開存取，必須先加入正式身份驗證與持久化 limiter；不可使用 process-local `Map`、CORS 或 `Origin` header 代替。

## Maintaining Workflow Cards

Workflow Card 的可搜尋 metadata 與文字語料位於 `shared/workflowCatalog.js`；React presentation 位於 `src/data/cards.jsx`。修改 Card 時需同步維持：

- `id` 唯一且不任意更名
- `title`、roles、phases、section
- `bodyText` 與畫面規範一致
- 必要的口語 aliases

API 只讀取 server-safe catalog，不直接 import 或序列化 JSX。

## Verification

不使用真實 Gateway key 的日常驗證：

```bash
npm test
npm run build
```

完整本機整合應以 mock Gateway 搭配 `vercel dev` 驗證。連接真實 Gateway 的 smoke test 會產生實際用量，執行前應先確認契約與成本。
