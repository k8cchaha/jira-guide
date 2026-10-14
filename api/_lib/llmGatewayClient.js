const GATEWAY_URL = 'https://llm-gateway.kkcompany-internal.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const REQUEST_TIMEOUT_MS = 20_000

export class GatewayConfigurationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'GatewayConfigurationError'
  }
}
export class GatewayResponseError extends Error {
  constructor(message, { status = 502, cause } = {}) {
    super(message, { cause })
    this.name = 'GatewayResponseError'
    this.status = status
  }
}

function requireGatewayConfig(env) {
  const apiKey = env.LLM_GATEWAY_API_KEY
  const model = env.LLM_GATEWAY_MODEL

  if (!apiKey || !model) {
    throw new GatewayConfigurationError('LLM Gateway credentials or model are not configured')
  }

  return { apiKey, model }
}

function readAssistantContent(payload) {
  if (payload?.error) {
    throw new GatewayResponseError('Gateway returned an error')
  }

  const content = payload?.content?.[0]?.text
  if (typeof content !== 'string' || content.trim() === '') {
    throw new GatewayResponseError('Gateway response did not contain assistant text')
  }
  return content
}

export function createLlmGatewayClient({
  env = process.env,
  fetchImpl = fetch,
  timeoutMs = REQUEST_TIMEOUT_MS,
} = {}) {
  return {
    async recommend({ systemPrompt, userPrompt }) {
      const { apiKey, model } = requireGatewayConfig(env)
      let response

      try {
        response = await fetchImpl(GATEWAY_URL, {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': ANTHROPIC_VERSION,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model,
            max_tokens: 600,
            messages: [
              {
                role: 'user',
                content: `${systemPrompt}\n\n${userPrompt}`,
              },
            ],
          }),
          signal: AbortSignal.timeout(timeoutMs),
        })
      } catch (error) {
        const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError'
        throw new GatewayResponseError(
          timedOut ? 'Gateway request timed out' : 'Gateway request failed',
          { status: timedOut ? 504 : 502, cause: error },
        )
      }

      if (!response.ok) {
        const status = response.status === 429 ? 503 : 502
        throw new GatewayResponseError('Gateway returned an error', { status })
      }

      let payload
      try {
        payload = await response.json()
      } catch (error) {
        throw new GatewayResponseError('Gateway returned invalid JSON', { cause: error })
      }

      return readAssistantContent(payload)
    },
  }
}
