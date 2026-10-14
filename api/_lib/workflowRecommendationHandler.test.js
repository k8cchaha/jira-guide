import assert from 'node:assert/strict'
import test from 'node:test'
import { createWorkflowRecommendationHandler } from './workflowRecommendationHandler.js'

const catalog = [
  { id: 'one', title: 'One' },
  { id: 'two', title: 'Two' },
]
const headers = { 'content-type': 'application/json' }
const logger = { info() {} }

function setup(result = '{"summary":"相關規範","cardIds":["one"]}', options = {}) {
  const calls = []
  const sheetCalls = []
  const logEvents = []
  const handle = createWorkflowRecommendationHandler({
    catalog,
    corpus: '[one] One',
    now: options.now ?? (() => Date.parse('2026-10-14T12:00:00.000Z')),
    logger: options.logger ?? { info(event) { logEvents.push(event) } },
    sheetLogger: options.sheetLogger ?? {
      async append(record) {
        sheetCalls.push(record)
      },
    },
    gateway: options.gateway ?? {
      async recommend(input) {
        calls.push(input)
        return result
      },
    },
  })
  return { handle, calls, sheetCalls, logEvents }
}

test('rejects unsupported methods and content types', async () => {
  const { handle, calls, sheetCalls } = setup()
  assert.equal((await handle({ method: 'GET', headers, body: {} })).status, 405)
  assert.equal((await handle({ method: 'POST', headers: {}, body: {} })).status, 415)
  assert.equal(calls.length, 0)
  assert.equal(sheetCalls.length, 0)
})

test('validates the request shape and question length', async () => {
  const { handle, calls, sheetCalls } = setup()
  const extra = await handle({ method: 'POST', headers, body: { question: 'test', model: 'x' } })
  const short = await handle({ method: 'POST', headers, body: { question: ' ' } })
  assert.equal(extra.status, 400)
  assert.equal(short.status, 400)
  assert.equal(calls.length, 0)
  assert.equal(sheetCalls.length, 0)
})

test('returns validated recommendations and logs trusted card titles', async () => {
  const { handle, sheetCalls } = setup('```json\n{"summary":"  相關規範  ","cardIds":["two","one","two"]}\n```')
  const result = await handle({ method: 'POST', headers, body: { question: '  怎麼處理問題？  ' } })
  assert.equal(result.status, 200)
  assert.deepEqual(result.body, { summary: '相關規範', cardIds: ['two', 'one'] })
  assert.equal(result.headers['Cache-Control'], 'no-store')
  assert.deepEqual(sheetCalls, [{
    timestamp: '2026-10-14T12:00:00.000Z',
    question: '怎麼處理問題？',
    summary: '相關規範',
    cardTitles: ['Two', 'One'],
  }])
})

test('logs an empty title list when no cards match', async () => {
  const { handle, sheetCalls } = setup('{"summary":"找不到相關規範","cardIds":[]}')
  const result = await handle({ method: 'POST', headers, body: { question: '找不到的問題' } })
  assert.equal(result.status, 200)
  assert.deepEqual(sheetCalls[0].cardTitles, [])
})

test('does not accept unknown card IDs, expose raw output, or append a row', async () => {
  const { handle, sheetCalls } = setup('{"summary":"secret raw output","cardIds":["made-up"]}')
  const result = await handle({ method: 'POST', headers, body: { question: '怎麼處理問題？' } })
  assert.equal(result.status, 502)
  assert.equal(JSON.stringify(result.body).includes('secret raw output'), false)
  assert.equal(sheetCalls.length, 0)
})

test('keeps model and corpus outside the client request', async () => {
  const { handle, calls } = setup()
  await handle({ method: 'POST', headers, body: { question: 'Bug reopen 怎麼辦？' } })
  assert.equal(calls.length, 1)
  assert.match(calls[0].userPrompt, /\[one\] One/)
  assert.match(calls[0].userPrompt, /Bug reopen 怎麼辦？/)
})

test('keeps a successful AI response when Sheet logging fails', async () => {
  const privateError = 'private payload should not be logged'
  const { handle, logEvents } = setup(undefined, {
    sheetLogger: {
      async append() {
        const error = new Error(privateError)
        error.name = 'WorkflowSheetLoggerError'
        throw error
      },
    },
  })

  const result = await handle({ method: 'POST', headers, body: { question: '怎麼處理問題？' } })
  assert.equal(result.status, 200)
  assert.deepEqual(result.body, { summary: '相關規範', cardIds: ['one'] })
  assert.equal(logEvents[0].sheetLogStatus, 'failed')
  assert.equal(logEvents[0].sheetLogErrorType, 'WorkflowSheetLoggerError')
  assert.equal(JSON.stringify(logEvents).includes(privateError), false)
  assert.equal(JSON.stringify(logEvents).includes('怎麼處理問題'), false)
})

test('keeps a successful AI response when Sheet logger throws synchronously', async () => {
  const { handle } = setup(undefined, {
    sheetLogger: {
      append() {
        throw new Error('failed')
      },
    },
  })

  const result = await handle({ method: 'POST', headers, body: { question: '怎麼處理問題？' } })
  assert.equal(result.status, 200)
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
