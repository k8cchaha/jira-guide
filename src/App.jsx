import { useState, useMemo, useEffect } from 'react'
import { Header } from './components/Header'
import { FilterBar } from './components/FilterBar'
import { Card } from './components/Card'
import { PHASES, ROLE_CONTEXTS } from './data/filters'
import { CARDS } from './data/cards'

const ALL_PHASE_IDS = PHASES.map(p => p.id)
const EMPTY = { role: new Set(), phase: new Set(), context: new Set() }
const LS_KEY = 'jira-guide-filters'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return EMPTY
    const { role, phase, context } = JSON.parse(raw)
    return {
      role:    new Set(role    ?? []),
      phase:   new Set(phase   ?? []),
      context: new Set(context ?? []),
    }
  } catch {
    return EMPTY
  }
}

function saveToStorage(active) {
  localStorage.setItem(LS_KEY, JSON.stringify({
    role:    [...active.role],
    phase:   [...active.phase],
    context: [...active.context],
  }))
}

function isVisible(card, active) {
  const contexts = card.contexts === 'all' ? null : card.contexts
  if (active.role.size > 0 && !card.roles.some(r => active.role.has(r))) return false
  if (active.phase.size > 0 && !card.phases.some(p => active.phase.has(p))) return false
  if (active.context.size > 0 && contexts !== null && !contexts.some(c => active.context.has(c))) return false
  return true
}

// A section is "on" when no phase filter is active, or this phase is included
function isSectionOn(phaseId, activePhase) {
  return activePhase.size === 0 || activePhase.has(phaseId)
}

export default function App() {
  const [active, setActive] = useState(loadFromStorage)

  useEffect(() => { saveToStorage(active) }, [active])

  function toggleFilter(type, value) {
    setActive(prev => {
      const next = new Set(prev[type])
      if (next.has(value)) next.delete(value)
      else next.add(value)

      if (type === 'role') {
        const available = next.size === 0
          ? new Set(Object.values(ROLE_CONTEXTS).flat().map(c => c.id))
          : new Set([...next].flatMap(r => (ROLE_CONTEXTS[r] ?? []).map(c => c.id)))
        const nextCtx = new Set([...prev.context].filter(c => available.has(c)))
        return { ...prev, role: next, context: nextCtx }
      }

      return { ...prev, [type]: next }
    })
  }

  // Toggle a section's visibility by manipulating the phase filter
  // — same state as filter chips, so they always stay in sync
  function toggleSection(phaseId) {
    setActive(prev => {
      // Treat empty filter as "all visible"
      const currentVisible = prev.phase.size === 0
        ? new Set(ALL_PHASE_IDS)
        : new Set(prev.phase)

      let next
      if (currentVisible.has(phaseId)) {
        // Hide this section: remove from currently visible (not from ALL)
        next = new Set([...currentVisible].filter(id => id !== phaseId))
      } else {
        // Show this section: add it back
        next = new Set(currentVisible)
        next.add(phaseId)
      }

      // When all phases are selected, use empty filter (cleaner state = "show all")
      if (next.size === ALL_PHASE_IDS.length) next = new Set()

      return { ...prev, phase: next }
    })
  }

  function resetFilters() {
    setActive({ role: new Set(), phase: new Set(), context: new Set() })
  }

  const visibleCards = useMemo(
    () => new Set(CARDS.filter(c => isVisible(c, active)).map(c => c.id)),
    [active]
  )

  // Cards that pass role/context filter (ignoring phase) — used to decide
  // whether a section label should render at all
  const roleContextVisible = useMemo(
    () => new Set(CARDS.filter(c => isVisible(c, { ...active, phase: new Set() })).map(c => c.id)),
    [active]
  )

  const sections = useMemo(() => PHASES.map(phase => {
    const cards = CARDS.filter(c => (c.section ?? c.phases[0]) === phase.id)
    const relevantCards = cards.filter(c => roleContextVisible.has(c.id))
    const on = isSectionOn(phase.id, active.phase)
    return { phase, cards, relevantCards, on }
  }), [active, visibleCards, roleContextVisible])

  const totalVisible = visibleCards.size

  return (
    <>
      <div className="sticky-top">
        <Header onReset={resetFilters} />
        <FilterBar
          active={active}
          onToggle={toggleFilter}
          onReset={resetFilters}
          visible={totalVisible}
          total={CARDS.length}
        />
      </div>

      <main className="content">
        {sections.map(({ phase, cards, relevantCards, on }) => {
          if (cards.length === 0) return null
          // Hide label entirely when no cards are relevant (e.g. role filter removes all)
          if (relevantCards.length === 0) return null

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

        {totalVisible === 0 && (
          <div className="no-results">
            <p>目前篩選條件無符合的內容</p>
            <p>請調整篩選條件，或<button onClick={resetFilters}>清除全部篩選</button></p>
          </div>
        )}
      </main>

    </>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          className="section-eye"
          onClick={() => onToggle(phaseId)}
          title={on ? '隱藏此區段' : '顯示此區段'}
        >
          <EyeIcon open={on} />
        </button>
      </div>
      {children}
    </>
  )
}

