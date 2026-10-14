import { WORKFLOW_CATALOG } from '../shared/workflowCatalog.js'
import { WORKFLOW_CORPUS_TEXT } from '../shared/workflowCorpus.js'
import { createLlmGatewayClient } from './_lib/llmGatewayClient.js'
import { createWorkflowRecommendationHandler } from './_lib/workflowRecommendationHandler.js'
import { createWorkflowSheetLogger } from './_lib/workflowSheetLogger.js'

const handler = createWorkflowRecommendationHandler({
  gateway: createLlmGatewayClient(),
  sheetLogger: createWorkflowSheetLogger(),
  catalog: WORKFLOW_CATALOG,
  corpus: WORKFLOW_CORPUS_TEXT,
})

export default async function workflowRecommendations(request, response) {
  const result = await handler({
    method: request.method,
    headers: request.headers,
    body: request.body,
    requestId: request.headers['x-vercel-id'] ?? request.headers['x-request-id'],
  })

  response.status(result.status)
  for (const [name, value] of Object.entries(result.headers)) {
    response.setHeader(name, value)
  }
  response.json(result.body)
}
