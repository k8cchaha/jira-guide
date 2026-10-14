import assert from 'node:assert/strict'
import test from 'node:test'
import { WORKFLOW_CATALOG } from './workflowCatalog.js'
import { WORKFLOW_CORPUS, WORKFLOW_CORPUS_TEXT } from './workflowCorpus.js'

const roles = new Set(['PM', 'RD', 'QA'])
const phases = new Set(['foundation', 'pre-sprint', 'in-sprint', 'end-sprint', 'deploy'])

test('workflow catalog has unique, valid, searchable cards', () => {
  assert.equal(WORKFLOW_CATALOG.length, 33)
  assert.equal(new Set(WORKFLOW_CATALOG.map(card => card.id)).size, WORKFLOW_CATALOG.length)

  for (const card of WORKFLOW_CATALOG) {
    assert.ok(card.id)
    assert.ok(card.title)
    assert.ok(card.bodyText.length >= 20)
    assert.ok(card.roles.every(role => roles.has(role)))
    assert.ok(card.phases.every(phase => phases.has(phase)))
    assert.ok(phases.has(card.section))
    assert.ok(Array.isArray(card.aliases))
  }
})

test('workflow corpus preserves catalog order and IDs', () => {
  assert.deepEqual(
    WORKFLOW_CORPUS.map(card => card.id),
    WORKFLOW_CATALOG.map(card => card.id),
  )
  for (const card of WORKFLOW_CATALOG) {
    assert.match(WORKFLOW_CORPUS_TEXT, new RegExp(`\\[${card.id}\\]`))
  }
})
