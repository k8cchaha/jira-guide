import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import { Header } from './components/Header'
import { WorkflowQuestionBar } from './components/WorkflowQuestionBar'
import { Card } from './components/Card'
import { FieldsFilterBar } from './components/FieldsFilterBar'
import { FieldsTable } from './components/FieldsTable'
import { AutomationFilterBar } from './components/AutomationFilterBar'
import { AutomationTable } from './components/AutomationTable'
import { PHASES, ROLES } from './data/filters'
import { CARDS } from './data/cards'
import { FIELDS } from './data/fields'
import { AUTOMATIONS } from './data/automations'

const ALL_PHASE_IDS = PHASES.map(phase => phase.id)
const VALID_ROLES = new Set(ROLES)
const VALID_PHASES = new Set(ALL_PHASE_IDS)
const VALID_CARD_IDS = new Set(CARDS.map(card => card.id))
const EMPTY = { role: new Set(), phase: new Set() }
const FIELDS_EMPTY = { role: new Set(), issueType: new Set(), timing: new Set(), required: false }
const AUTO_EMPTY = new Set()
const LS_KEY = 'jira-guide-filters'
const LS_VERSION = 2

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return EMPTY
    const saved = JSON.parse(raw)
    const role = Array.isArray(saved?.role) ? saved.role.filter(value => VALID_ROLES.has(value)) : []
    const phase = Array.isArray(saved?.phase) ? saved.phase.filter(value => VALID_PHASES.has(value)) : []
    return { role: new Set(role), phase: new Set(phase) }
  } catch {
    return EMPTY
  }
}

function saveToStorage(active) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      version: LS_VERSION,
      role: [...active.role],
      phase: [...active.phase],
    }))
  } catch {
    // Filtering continues to work if browser storage is unavailable.
  }
}

function passesManualFilters(card, active) {
  if (active.role.size > 0 && !card.roles.some(role => active.role.has(role))) return false
  if (active.phase.size > 0 && !card.phases.some(phase => active.phase.has(phase))) return false
  return true
}

function isSectionOn(phaseId, activePhase) {
  return activePhase.size === 0 || activePhase.has(phaseId)
}

function isFieldVisible(field, active) {
  if (active.required && !field.required) return false
  if (active.role.size > 0 && field.roles.length > 0 && !field.roles.some(role => active.role.has(role))) return false
  if (active.issueType.size > 0 && !field.issueTypeGroups.includes('all') && !field.issueTypeGroups.some(group => active.issueType.has(group))) return false
  if (active.timing.size > 0 && !field.timing.some(timing => active.timing.has(timing))) return false
  return true
}

export default function App() {
  const [mode, setMode] = useState('workflow')
  const [active, setActive] = useState(loadFromStorage)
  const [aiResult, setAiResult] = useState(null)
  const [aiSearching, setAiSearching] = useState(false)
  const [fieldsActive, setFieldsActive] = useState(FIELDS_EMPTY)
  const [autoActive, setAutoActive] = useState(AUTO_EMPTY)

  useEffect(() => { saveToStorage(active) }, [active])

  function toggleFieldsFilter(type, value) {
    setFieldsActive(previous => {
      if (type === 'required') return { ...previous, required: !previous.required }
      const next = new Set(previous[type])
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...previous, [type]: next }
    })
  }

  function toggleFilter(type, value) {
    setActive(previous => {
      const next = new Set(previous[type])
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...previous, [type]: next }
    })
  }

  function toggleSection(phaseId) {
    setActive(previous => {
      const currentVisible = previous.phase.size === 0
        ? new Set(ALL_PHASE_IDS)
        : new Set(previous.phase)

      let next
      if (currentVisible.has(phaseId)) {
        next = new Set([...currentVisible].filter(id => id !== phaseId))
      } else {
        next = new Set(currentVisible)
        next.add(phaseId)
      }

      if (next.size === ALL_PHASE_IDS.length) next = new Set()
      return { ...previous, phase: next }
    })
  }

  function toggleAutoFilter(keyword) {
    setAutoActive(previous => {
      const next = new Set(previous)
      if (next.has(keyword)) next.delete(keyword)
      else next.add(keyword)
      return next
    })
  }

  function changeMode(nextMode) {
    if (mode === 'workflow' && nextMode !== 'workflow') setAiSearching(false)
    setMode(nextMode)
  }

  function resetFilters() {
    if (mode === 'workflow') {
      setActive({ role: new Set(), phase: new Set() })
    } else if (mode === 'fields') {
      setFieldsActive(FIELDS_EMPTY)
    } else {
      setAutoActive(AUTO_EMPTY)
    }
  }

  const aiCardIds = useMemo(
    () => aiResult
      ? new Set(aiResult.cardIds.filter(id => VALID_CARD_IDS.has(id)))
      : null,
    [aiResult]
  )

  const manualVisibleCards = useMemo(
    () => new Set(CARDS.filter(card => passesManualFilters(card, active)).map(card => card.id)),
    [active]
  )

  const visibleCards = useMemo(() => {
    if (aiSearching) return new Set()
    if (!aiCardIds) return manualVisibleCards
    return new Set([...manualVisibleCards].filter(id => aiCardIds.has(id)))
  }, [aiCardIds, aiSearching, manualVisibleCards])

  const sectionRelevantCards = useMemo(() => {
    if (aiSearching) return new Set()
    const withoutPhase = { ...active, phase: new Set() }
    return new Set(CARDS
      .filter(card => passesManualFilters(card, withoutPhase))
      .filter(card => !aiCardIds || aiCardIds.has(card.id))
      .map(card => card.id))
  }, [active, aiCardIds, aiSearching])

  const sections = useMemo(() => PHASES.map(phase => {
    const cards = CARDS.filter(card => (card.section ?? card.phases[0]) === phase.id)
    const relevantCards = cards.filter(card => sectionRelevantCards.has(card.id))
    const on = isSectionOn(phase.id, active.phase)
    return { phase, cards, relevantCards, on }
  }), [active.phase, sectionRelevantCards])

  const totalVisible = visibleCards.size
  const hasManualFilters = active.role.size > 0 || active.phase.size > 0

  const filteredFields = useMemo(
    () => FIELDS.filter(field => isFieldVisible(field, fieldsActive)),
    [fieldsActive]
  )

  const filteredAutomations = useMemo(
    () => autoActive.size === 0
      ? AUTOMATIONS
      : AUTOMATIONS.filter(automation => automation.keywords.some(keyword => autoActive.has(keyword))),
    [autoActive]
  )

  const stickyRef = useRef(null)
  useLayoutEffect(() => {
    const element = stickyRef.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--sticky-top', `${element.offsetHeight}px`)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="sticky-top" ref={stickyRef}>
        <Header mode={mode} onModeChange={changeMode} onReset={resetFilters} />
        {mode === 'workflow' && (
          <WorkflowQuestionBar
            result={aiResult}
            onResultChange={setAiResult}
            onSearchingChange={setAiSearching}
            active={active}
            onToggle={toggleFilter}
            visible={totalVisible}
            total={CARDS.length}
          />
        )}
        {mode === 'fields' && (
          <FieldsFilterBar
            active={fieldsActive}
            onToggle={toggleFieldsFilter}
            visible={filteredFields.length}
            total={FIELDS.length}
          />
        )}
        {mode === 'automation' && (
          <AutomationFilterBar
            active={autoActive}
            onToggle={toggleAutoFilter}
            visible={filteredAutomations.length}
            total={AUTOMATIONS.length}
          />
        )}
      </div>

      <main className="content">
        {mode === 'fields' && <FieldsTable fields={filteredFields} />}
        {mode === 'automation' && <AutomationTable automations={filteredAutomations} />}
        {mode === 'workflow' && sections.map(({ phase, cards, relevantCards, on }) => {
          if (cards.length === 0 || relevantCards.length === 0) return null

          return (
            <SectionGroup
              key={phase.id}
              phaseId={phase.id}
              label={phase.label}
              on={on}
              onToggle={toggleSection}
            >
              {cards.map(card => (
                visibleCards.has(card.id)
                  ? <Card key={card.id} card={card} />
                  : <div key={card.id} className="card hidden" />
              ))}
            </SectionGroup>
          )
        })}

        {mode === 'workflow' && !aiSearching && totalVisible === 0 && aiResult && aiCardIds.size === 0 && (
          <div className="no-results">
            <p>{aiResult.cardIds.length === 0 ? 'AI 找不到直接相關的規範' : 'AI 結果與目前版本的規範不相容'}</p>
            <p>請換個方式描述問題，或清除 AI 結果查看全部內容。</p>
          </div>
        )}
        {mode === 'workflow' && !aiSearching && totalVisible === 0 && aiResult && aiCardIds.size > 0 && hasManualFilters && (
          <div className="no-results">
            <p>AI 結果與目前手動篩選沒有交集</p>
            <p>請調整角色或階段篩選；清除篩選不會移除 AI 結果。</p>
          </div>
        )}
        {mode === 'workflow' && !aiSearching && totalVisible === 0 && !aiResult && (
          <div className="no-results">
            <p>目前篩選條件無符合的內容</p>
            <p>請調整篩選條件，或<button type="button" onClick={resetFilters}>清除全部篩選</button></p>
          </div>
        )}
      </main>
    </>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function SectionGroup({ phaseId, label, on, onToggle, children }) {
  return (
    <>
      <div className={`section-label${on ? '' : ' section-off'}`}>
        <span>{label}</span>
        <button
          type="button"
          className="section-eye"
          onClick={() => onToggle(phaseId)}
          title={on ? '隱藏此區段' : '顯示此區段'}
          aria-label={on ? `隱藏${label}區段` : `顯示${label}區段`}
        >
          <EyeIcon open={on} />
        </button>
      </div>
      {children}
    </>
  )
}
