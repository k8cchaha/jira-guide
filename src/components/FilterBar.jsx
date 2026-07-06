import { useState } from 'react'
import { PHASES, ROLE_CONTEXTS, ALL_CONTEXTS } from '../data/filters'

export function FilterBar({ active, onToggle, onReset, visible, total }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = active.role.size + active.phase.size + active.context.size

  const availableContexts = active.role.size === 0
    ? ALL_CONTEXTS
    : [...active.role].flatMap(r => ROLE_CONTEXTS[r] ?? [])

  return (
    <div className="filter-bar">
      {/* Mobile toggle */}
      <button
        className={`filter-toggle${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(o => !o)}
      >
        <span className="filter-toggle-label">篩選</span>
        <span className={`filter-badge${activeCount > 0 ? ' visible' : ''}`}>{activeCount}</span>
        <span className="filter-chevron">▼</span>
      </button>

      {/* Filter groups */}
      <div className={`filter-groups-wrap${mobileOpen ? ' open' : ''}`}>
        <div className="filter-bar-inner">

          <div className="filter-group">
            <span className="filter-label">角色</span>
            <div className="chips">
              {['PM', 'RD', 'QA'].map(role => (
                <button
                  key={role}
                  className={`chip${active.role.has(role) ? ' active' : ''}`}
                  data-type="role"
                  data-value={role}
                  onClick={() => onToggle('role', role)}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div className="filter-group">
            <span className="filter-label">階段</span>
            <div className="chips">
              {PHASES.map(phase => (
                <button
                  key={phase.id}
                  className={`chip${active.phase.has(phase.id) ? ' active' : ''}`}
                  data-type="phase"
                  data-value={phase.id}
                  onClick={() => onToggle('phase', phase.id)}
                >
                  {phase.label}
                </button>
              ))}
            </div>
          </div>

          <span className="result-count">顯示 {visible} / {total} 項</span>
        </div>
      </div>
    </div>
  )
}
