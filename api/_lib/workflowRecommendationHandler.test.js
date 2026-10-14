import assert from 'node:assert/strict'
import test from 'node:test'
import { createWorkflowRecommendationHandler } from './workflowRecommendationHandler.js'

const catalog = [
  { id: 'one', title: 'One' },
  { id: 'two', title: 'Two' },
]
const headers = { 'content-type': 'application/json' }
const logger = { info() {} }

function setup(result = '{"summary":"相關規範","cardIds":["one"]}') {
  const calls = []
  const handle = createWorkflowRecommendationHandler({
    catalog,
    corpus: '[one] One',
    logger,
    gateway: {
      async recommend(input) {
        calls.push(input)
        return result
      },
    },
  })
  return { handle, calls }
}

test('rejects unsupported methods and content types', async () => {
  const { handle, calls } = setup()
  assert.equal((await handle({ method: 'GET', headers, body: {} })).status, 405)
  assert.equal((await handle({ method: 'POST', headers: {}, body: {} })).status, 415)
  assert.equal(calls.length, 0)
})

test('validates the request shape and question length', async () => {
  const { handle, calls } = setup()
  const extra = await handle({ method: 'POST', headers, body: { question: 'test', model: 'x' } })
  const short = await handle({ method: 'POST', headers, body: { question: ' ' } })
  assert.equal(extra.status, 400)
  assert.equal(short.status, 400)
  assert.equal(calls.length, 0)
})

test('returns validated, deduplicated recommendations', async () => {
  const { handle } = setup('```json\n{"summary":"  相關規範  ","cardIds":["one","one","two"]}\n```')
  const result = await handle({ method: 'POST', headers, body: { question: '怎麼處理問題？' } })
  assert.equal(result.status, 200)
  assert.deepEqual(result.body, { summary: '相關規範', cardIds: ['one', 'two'] })
  assert.equal(result.headers['Cache-Control'], 'no-store')
})

test('does not accept unknown card IDs or expose raw output', async () => {
  const { handle } = setup('{"summary":"secret raw output","cardIds":["made-up"]}')
  const result = await handle({ method: 'POST', headers, body: { question: '怎麼處理問題？' } })
  assert.equal(result.status, 502)
  assert.equal(JSON.stringify(result.body).includes('secret raw output'), false)
})

test('keeps model and corpus outside the client request', async () => {
  const { handle, calls } = setup()
  await handle({ method: 'POST', headers, body: { question: 'Bug reopen 怎麼辦？' } })
  assert.equal(calls.length, 1)
  assert.match(calls[0].userPrompt, /\[one\] One/)
  assert.match(calls[0].userPrompt, /Bug reopen 怎麼辦？/)
})

test('preserves a controlled upstream unavailable status', async () => {
  const handle = createWorkflowRecommendationHandler({
    catalog,
    corpus: '[one] One',
    logger,
    gateway: {
      async recommend() {
        const error = new Error('rate limited')
        error.status = 503
        throw error
      },
    },
  })

  const result = await handle({ method: 'POST', headers, body: { question: '怎麼處理問題？' } })
  assert.equal(result.status, 503)
  assert.equal(result.body.error.code, 'UPSTREAM_UNAVAILABLE')
})
