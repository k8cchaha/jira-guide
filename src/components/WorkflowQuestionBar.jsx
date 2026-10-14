import { useEffect, useRef, useState } from 'react'
import { FilterBar } from './FilterBar'

function responseError(response, body) {
  return body?.error?.message || `查詢失敗（${response.status}）`
}

export function WorkflowQuestionBar({
  result,
  onResultChange,
  onSearchingChange,
  active,
  onToggle,
  visible,
  total,
}) {
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState('')
  const [submittedQuestion, setSubmittedQuestion] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const controllerRef = useRef(null)
  const sequenceRef = useRef(0)
  const inputRef = useRef(null)

  useEffect(() => () => {
    controllerRef.current?.abort()
    sequenceRef.current += 1
  }, [])

  useEffect(() => {
    if (!expanded) return undefined
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [expanded])

  async function handleSubmit(event) {
    event.preventDefault()
    const question = draft.trim()
    if (question.length < 2) return

    controllerRef.current?.abort()
    const controller = new AbortController()
    const sequence = sequenceRef.current + 1
    controllerRef.current = controller
    sequenceRef.current = sequence

    onResultChange(null)
    onSearchingChange(true)
    setSubmittedQuestion(question)
    setDraft('')
    setExpanded(false)
    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/workflow-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) throw new Error(responseError(response, body))
      if (
        !body ||
        typeof body.summary !== 'string' ||
        !Array.isArray(body.cardIds) ||
        body.cardIds.some(id => typeof id !== 'string')
      ) {
        throw new Error('AI 回傳格式不正確，請稍後再試。')
      }
      if (sequence !== sequenceRef.current) return

      onResultChange({ question, summary: body.summary, cardIds: body.cardIds })
      onSearchingChange(false)
      setStatus('success')
    } catch (requestError) {
      if (requestError.name === 'AbortError' || sequence !== sequenceRef.current) return
      onSearchingChange(false)
      setStatus('error')
      setError(requestError.message || 'AI 服務目前無法使用，請稍後再試。')
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
    }
  }

  function handleClear() {
    controllerRef.current?.abort()
    controllerRef.current = null
    sequenceRef.current += 1
    onSearchingChange(false)
    onResultChange(null)
    setDraft('')
    setSubmittedQuestion('')
    setExpanded(false)
    setStatus('idle')
    setError('')
  }

  function toggleComposer() {
    if (expanded) {
      setDraft('')
      setExpanded(false)
      return
    }

    if (status === 'loading') {
      controllerRef.current?.abort()
      controllerRef.current = null
      sequenceRef.current += 1
      onSearchingChange(false)
      onResultChange(null)
      setSubmittedQuestion('')
      setStatus('idle')
      setError('')
    }
    setDraft('')
    setExpanded(true)
  }

  const displayQuestion = status === 'loading' || status === 'error'
    ? submittedQuestion
    : result?.question
  const showStatus = !expanded && Boolean(displayQuestion || result || error)

  return (
    <>
      <FilterBar
        active={active}
        onToggle={onToggle}
        visible={visible}
        total={total}
        onToggleAiHelper={toggleComposer}
        aiHelperOpen={expanded}
        aiActive={Boolean(expanded || result || status === 'loading' || status === 'error')}
      />

      {(expanded || showStatus) && (
        <section
          id="workflow-ai-panel"
          className="ai-helper-panel"
          aria-label="AI 小幫手"
          aria-busy={status === 'loading'}
        >
          <div className="ai-helper-panel-inner">
            {expanded ? (
              <form className="ai-inline-form" onSubmit={handleSubmit}>
                <div className="ai-inline-controls">
                  <label className="sr-only" htmlFor="workflow-question">想查詢什麼規範？</label>
                  <input
                    ref={inputRef}
                    id="workflow-question"
                    type="text"
                    value={draft}
                    minLength={2}
                    maxLength={500}
                    onChange={event => setDraft(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Escape') {
                        setDraft('')
                        setExpanded(false)
                      }
                    }}
                    placeholder="例如：Sprint 中發現 SPEC 要修改，該怎麼處理？"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="ai-search-button"
                    disabled={draft.trim().length < 2}
                  >
                    詢問 AI
                  </button>
                </div>
              </form>
            ) : (
              <div className="ai-status-layout">
                <div className="ai-status-copy" role="status" aria-live="polite" aria-atomic="true">
                  {displayQuestion && (
                    <p className="ai-question-text"><strong>Q.</strong> {displayQuestion}</p>
                  )}
                  {status === 'loading' && (
                    <p className="question-loading">規範搜尋中...</p>
                  )}
                  {status === 'error' && (
                    <p className="question-error" role="alert">{error}</p>
                  )}
                  {status !== 'loading' && status !== 'error' && result && (
                    <p className="question-summary">
                      {result.summary}
                      <span className="question-result-count">符合 {result.cardIds.length} 項</span>
                    </p>
                  )}
                </div>
                <div className="ai-status-actions">
                  {status === 'error' && (
                    <button type="button" className="question-retry" onClick={() => setExpanded(true)}>
                      重新提問
                    </button>
                  )}
                  <button type="button" className="question-clear" onClick={handleClear}>
                    {status === 'loading' ? '取消搜尋' : '清除 AI 結果'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
