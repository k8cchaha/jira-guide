const FEEDBACK_SHEET_ID = 0
const AI_LOG_SHEET_ID = 379945495
const MAX_CARD_TITLES = 12

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON)
}

function getSheetById(sheetId) {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheets()
    .find(function (sheet) { return sheet.getSheetId() === sheetId })
}

function sanitizeSheetText(value) {
  return /^[\s]*[=+\-@]/.test(value) ? "'" + value : value
}

function validAiLog(value) {
  if (typeof value.timestamp !== 'string' || isNaN(new Date(value.timestamp).getTime())) return false
  if (typeof value.question !== 'string' || value.question.length === 0 || value.question.length > 500) return false
  if (typeof value.summary !== 'string' || value.summary.length === 0 || value.summary.length > 300) return false
  if (!Array.isArray(value.cardTitles) || value.cardTitles.length > MAX_CARD_TITLES) return false
  return value.cardTitles.every(function (title) { return typeof title === 'string' })
}

function doGet(e) {
  const sheet = getSheetById(FEEDBACK_SHEET_ID)
  if (!sheet) return jsonResponse([])

  const rows = sheet.getDataRange().getValues()
  const data = rows.slice(1).map(function (row) {
    return { category: row[2], content: row[3], reply: row[4] }
  })
  return jsonResponse(data)
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    if (data.action === 'workflow_ai_log') return saveWorkflowAiLog(data)
    return saveFeedback(data)
  } catch (error) {
    return jsonResponse({ ok: false })
  }
}

function saveFeedback(data) {
  const sheet = getSheetById(FEEDBACK_SHEET_ID)
  if (!sheet) return jsonResponse({ ok: false })

  sheet.appendRow([new Date(), data.name, data.category, data.content, ''])
  return jsonResponse({ ok: true })
}

function saveWorkflowAiLog(data) {
  const expectedSecret = PropertiesService
    .getScriptProperties()
    .getProperty('WORKFLOW_LOG_SECRET')
  if (!expectedSecret || data.secret !== expectedSecret || !validAiLog(data)) {
    return jsonResponse({ ok: false })
  }

  const sheet = getSheetById(AI_LOG_SHEET_ID)
  if (!sheet) return jsonResponse({ ok: false })

  const titles = data.cardTitles.map(sanitizeSheetText).join('\n')
  const row = [
    new Date(data.timestamp),
    sanitizeSheetText(data.question),
    sanitizeSheetText(data.summary),
    sanitizeSheetText(titles),
  ]

  const lock = LockService.getScriptLock()
  lock.waitLock(5000)
  try {
    sheet.appendRow(row)
  } finally {
    lock.releaseLock()
  }

  return jsonResponse({ ok: true })
}
