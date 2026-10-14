import { WORKFLOW_CATALOG } from './workflowCatalog.js'

/**
 * Compact server-safe documents suitable for search, ranking, or LLM prompt context.
 * Metadata remains structured while `text` supplies a deterministic readable corpus.
 */
export const WORKFLOW_CORPUS = Object.freeze(WORKFLOW_CATALOG.map((item) => Object.freeze({
  id: item.id,
  title: item.title,
  roles: item.roles,
  phases: item.phases,
  section: item.section,
  contexts: item.contexts,
  aliases: item.aliases,
  bodyText: item.bodyText,
  text: [
    item.title,
    `適用角色：${item.roles.join('、')}`,
    `流程階段：${item.phases.join('、')}`,
    `任務情境：${item.contexts === 'all' ? '全部' : item.contexts.join('、')}`,
    `別名與關鍵詞：${item.aliases.join('、')}`,
    item.bodyText,
  ].join('\n'),
})))

export const WORKFLOW_CORPUS_TEXT = WORKFLOW_CORPUS
  .map((document) => `## ${document.title} [${document.id}]\n${document.text}`)
  .join('\n\n')
