import assert from 'node:assert/strict'
import test from 'node:test'
import { createLlmGatewayClient, GatewayConfigurationError } from './llmGatewayClient.js'

const validEnv = {
  LLM_GATEWAY_API_KEY: 'test-key',
  LLM_GATEWAY_MODEL: 'test-model',
}

function successfulResponse(payload = {
  content: [{ type: 'text', text: '{"summary":"ok","cardIds":[]}' }],
}) {
  return {
    ok: true,
    status: 200,
    async json() {
      return payload
    },
  }
}

test('fails closed when gateway credentials or model are missing', async () => {
  const client = createLlmGatewayClient({ env: {}, fetchImpl: async () => assert.fail() })
  await assert.rejects(
    client.recommend({ systemPrompt: 'system', userPrompt: 'user' }),
    GatewayConfigurationError,
  )
})

test('uses the Messages-compatible gateway contract', async () => {
  let request
  const client = createLlmGatewayClient({
    env: validEnv,
    fetchImpl: async (url, options) => {
      request = { url, options }
      return successfulResponse()
    },
  })

  const content = await client.recommend({ systemPrompt: 'system', userPrompt: 'user' })
  const body = JSON.parse(request.options.body)

  assert.equal(request.url, 'https://llm-gateway.kkcompany-internal.com/v1/messages')
  assert.equal(request.options.headers['x-api-key'], 'test-key')
  assert.equal(request.options.headers['anthropic-version'], '2023-06-01')
  assert.equal(request.options.headers['content-type'], 'application/json')
  assert.equal(request.options.headers.Authorization, undefined)
  assert.deepEqual(body, {
    model: 'test-model',
    max_tokens: 600,
    messages: [{ role: 'user', content: 'system\n\nuser' }],
  })
  assert.equal(content, '{"summary":"ok","cardIds":[]}')
})

test('rejects a gateway error payload without exposing its message', async () => {
  const client = createLlmGatewayClient({
    env: validEnv,
    fetchImpl: async () => successfulResponse({
      error: { message: 'sensitive upstream details' },
    }),
  })

  await assert.rejects(
    client.recommend({ systemPrompt: 'system', userPrompt: 'user' }),
    error => {
      assert.equal(error.name, 'GatewayResponseError')
      assert.equal(error.status, 502)
      assert.equal(error.message.includes('sensitive upstream details'), false)
      return true
    },
  )
})

test('rejects a response without content text', async () => {
  const client = createLlmGatewayClient({
    env: validEnv,
    fetchImpl: async () => successfulResponse({ content: [] }),
  })

  await assert.rejects(
    client.recommend({ systemPrompt: 'system', userPrompt: 'user' }),
    { name: 'GatewayResponseError' },
  )
})
