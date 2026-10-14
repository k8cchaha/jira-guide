const REQUEST_TIMEOUT_MS = 3_000
const FORMULA_PREFIX = /^[\s]*[=+\-@]/

export class WorkflowSheetLoggerError extends Error {
  constructor(message, { cause } = {}) {
    super(message, { cause })
    this.name = 'WorkflowSheetLoggerError'
  }
}

export function sanitizeSheetText(value) {
  if (typeof value !== 'string') {
    throw new WorkflowSheetLoggerError('Workflow log value must be text')
  }
  return FORMULA_PREFIX.test(value) ? `'${value}` : value
}

function requireConfig(env) {
  const url = env.WORKFLOW_LOG_APPS_SCRIPT_URL
  const secret = env.WORKFLOW_LOG_SECRET

  if (!url || !secret) {
    throw new WorkflowSheetLoggerError('Workflow log is not configured')
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new WorkflowSheetLoggerError('Workflow log is not configured')
  }
  if (parsedUrl.protocol !== 'https:') {
    throw new WorkflowSheetLoggerError('Workflow log is not configured')
  }

  return { url: parsedUrl.toString(), secret }
}

export function createWorkflowSheetLogger({
  env = process.env,
  fetchImpl = fetch,
  timeoutMs = REQUEST_TIMEOUT_MS,
} = {}) {
  return {
    async append({ timestamp, question, summary, cardTitles }) {
      const { url, secret } = requireConfig(env)
      if (!Array.isArray(cardTitles)) {
        throw new WorkflowSheetLoggerError('Workflow log record is invalid')
      }

      const payload = {
        action: 'workflow_ai_log',
        secret,
        timestamp: sanitizeSheetText(timestamp),
        question: sanitizeSheetText(question),
        summary: sanitizeSheetText(summary),
        cardTitles: cardTitles.map(sanitizeSheetText),
      }

      let response
      try {
        response = await fetchImpl(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(timeoutMs),
        })
      } catch (error) {
        throw new WorkflowSheetLoggerError('Workflow log request failed', { cause: error })
      }

      if (!response.ok) {
        throw new WorkflowSheetLoggerError('Workflow log request failed')
      }

      let result
      try {
        result = await response.json()
      } catch (error) {
        throw new WorkflowSheetLoggerError('Workflow log response was invalid', { cause: error })
      }
      if (result?.ok !== true) {
        throw new WorkflowSheetLoggerError('Workflow log request was rejected')
      }
    },
  }
}
