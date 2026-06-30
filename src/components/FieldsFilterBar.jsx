import { useState } from 'react'
import { ISSUE_TYPE_GROUPS, TIMINGS } from '../data/fields'

export function FieldsFilterBar({ active, onToggle, visible, total }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = active.role.size + active.issueType.size + active.timing.size + (active.required ? 1 : 0)

  return (
    <div className="filter-bar">
      <button
        className={`filter-toggle${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(o => !o)}
      >
        <span className="filter-toggle-label">篩選</span>
        <span className={`filter-badge${activeCount > 0 ? ' visible' : ''}`}>{activeCount}</span>
        <span className="filter-chevron">▼</span>
      </button>

      <div className={`filter-groups-wrap${mobileOpen ? ' open' : ''}`}>
        <div className="filter-bar-inner">

          <div className="filter-group">
            <span className="filter-label">角色</span>
            <div className="chips">
              {['PM', 'RD', 'QA'].map(role => (
                <button
                  key={role}
                  className={`chip${active.role.has(role) ? ' active' : ''}`}
                  data-value={role}
                  onClick={() => onToggle('role', role)}
                >{role}</button>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div className="filter-group">
            <span className="filter-label">Issue Type</span>
            <div className="chips">
              {ISSUE_TYPE_GROUPS.map(g => (
                <button
                  key={g.id}
                  className={`chip${active.issueType.has(g.id) ? ' active' : ''}`}
                  data-value={g.id}
                  onClick={() => onToggle('issueType', g.id)}
                >{g.label}</button>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div className="filter-group">
            <span className="filter-label">填寫時機</span>
            <div className="chips">
              {TIMINGS.map(t => (
                <button
                  key={t.id}
                  className={`chip${active.timing.has(t.id) ? ' active' : ''}`}
                  data-value={t.id}
                  onClick={() => onToggle('timing', t.id)}
                >{t.label}</button>
              ))}
            </div>
          </div>

          <div className="divider" />

          <label className="required-checkbox">
            <input
              type="checkbox"
              checked={active.required}
              onChange={() => onToggle('required')}
            />
            <span>必填</span>
          </label>

          <span className="result-count">顯示 {visible} / {total} 項</span>
        </div>
      </div>
    </div>
  )
}
