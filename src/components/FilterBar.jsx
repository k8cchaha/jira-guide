import { useState } from 'react'
import { PHASES, ROLES } from '../data/filters'

export function FilterBar({
  active,
  onToggle,
  visible,
  total,
  onToggleAiHelper,
  aiHelperOpen,
  aiActive,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = active.role.size + active.phase.size

  return (
    <div className="filter-bar">
      <div className="mobile-filter-actions">
        <button
          type="button"
          className={`filter-toggle${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(open => !open)}
          aria-expanded={mobileOpen}
          aria-controls="workflow-filter-groups"
        >
          <span className="filter-toggle-label">篩選</span>
          <span className={`filter-badge${activeCount > 0 ? ' visible' : ''}`}>{activeCount}</span>
          <span className="filter-chevron" aria-hidden="true">▼</span>
        </button>
        <button
          type="button"
          className={`ai-helper-trigger mobile-ai-helper${aiActive ? ' active' : ''}`}
          onClick={() => {
            setMobileOpen(false)
            onToggleAiHelper()
          }}
          aria-expanded={aiHelperOpen}
          aria-controls="workflow-ai-panel"
        >
          <span aria-hidden="true">✦</span>
          AI小幫手
        </button>
      </div>

      <div
        id="workflow-filter-groups"
        className={`filter-groups-wrap${mobileOpen ? ' open' : ''}`}
      >
        <div className="filter-bar-inner">
          <div className="filter-group">
            <span className="filter-label">角色</span>
            <div className="chips">
              {ROLES.map(role => (
                <button
                  type="button"
                  key={role}
                  className={`chip${active.role.has(role) ? ' active' : ''}`}
                  data-type="role"
                  data-value={role}
                  aria-pressed={active.role.has(role)}
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
                  type="button"
                  key={phase.id}
                  className={`chip${active.phase.has(phase.id) ? ' active' : ''}`}
                  data-type="phase"
                  data-value={phase.id}
                  aria-pressed={active.phase.has(phase.id)}
                  onClick={() => onToggle('phase', phase.id)}
                >
                  {phase.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divider ai-helper-divider" />

          <div className="filter-group ai-helper-group">
            <button
              type="button"
              className={`ai-helper-trigger desktop-ai-helper${aiActive ? ' active' : ''}`}
              onClick={onToggleAiHelper}
              aria-expanded={aiHelperOpen}
              aria-controls="workflow-ai-panel"
            >
              <span aria-hidden="true">✦</span>
              AI小幫手
            </button>
          </div>

          <span className="result-count">顯示 {visible} / {total} 項</span>
        </div>
      </div>
    </div>
  )
}
