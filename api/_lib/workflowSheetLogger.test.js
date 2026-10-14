import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createWorkflowSheetLogger,
  sanitizeSheetText,
  WorkflowSheetLoggerError,
} from './workflowSheetLogger.js'

const env = {
  WORKFLOW_LOG_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/test/exec',
  WORKFLOW_LOG_SECRET: 'server-secret',
}
const record = {
  timestamp: '2026-10-14T12:00:00.000Z',
  question: '怎麼處理？',
  summary: '請參考相關規範。',
  cardTitles: ['規範一', '規範二'],
}

test('fails closed when workflow log configuration is missing', async () => {
  let called = false
  const sheetLogger = createWorkflowSheetLogger({
    env: {},
    fetchImpl: async () => {
      called = true
      return new Response('{"ok":true}')
    },
  })

  await assert.rejects(() => sheetLogger.append(record), WorkflowSheetLoggerError)
  assert.equal(called, false)
})

test('posts the sanitized workflow record to Apps Script', async () => {
  let request
  const sheetLogger = createWorkflowSheetLogger({
    env,
    timeoutMs: 1234,
    fetchImpl: async (url, options) => {
      request = { url, options }
      return new Response('{"ok":true}', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    },
  })

  await sheetLogger.append({
    ...record,
    question: '  =IMPORTXML("x")',
    summary: '+SUM(1,2)',
    cardTitles: ['正常標題', '@command'],
  })

  assert.equal(request.url, env.WORKFLOW_LOG_APPS_SCRIPT_URL)
  assert.equal(request.url.includes(env.WORKFLOW_LOG_SECRET), false)
  assert.equal(request.options.method, 'POST')
  assert.equal(request.options.headers['content-type'], 'application/json')
  assert.ok(request.options.signal instanceof AbortSignal)
  assert.deepEqual(JSON.parse(request.options.body), {
    action: 'workflow_ai_log',
    secret: env.WORKFLOW_LOG_SECRET,
    timestamp: record.timestamp,
    question: `'  =IMPORTXML("x")`,
    summary: "'+SUM(1,2)",
    cardTitles: ['正常標題', "'@command"],
  })
})

test('sanitizes formula-like text and preserves normal text', () => {
  assert.equal(sanitizeSheetText('正常文字'), '正常文字')
  assert.equal(sanitizeSheetText(' =1+1'), "' =1+1")
  assert.equal(sanitizeSheetText('\t-10'), "'\t-10")
  assert.equal(sanitizeSheetText('@name'), "'@name")
})

test('rejects failed or invalid Apps Script responses generically', async () => {
  const responses = [
    async () => { throw new Error('private network detail') },
    async () => new Response('private upstream detail', { status: 500 }),
    async () => new Response('not json', { status: 200 }),
    async () => new Response('{"ok":false,"detail":"private"}', { status: 200 }),
  ]

  for (const fetchImpl of responses) {
    const sheetLogger = createWorkflowSheetLogger({ env, fetchImpl })
    await assert.rejects(
      () => sheetLogger.append(record),
      error => {
        assert.equal(error instanceof WorkflowSheetLoggerError, true)
        assert.equal(error.message.includes('private'), false)
        assert.equal(error.message.includes(env.WORKFLOW_LOG_SECRET), false)
        return true
      },
    )
  }
})
