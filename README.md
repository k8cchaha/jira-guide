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
