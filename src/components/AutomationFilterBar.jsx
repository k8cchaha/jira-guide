import { useState } from 'react'
import { KEYWORDS } from '../data/automations'

export function AutomationFilterBar({ active, onToggle, visible, total }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = active.size

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
            <span className="filter-label">分類</span>
            <div className="chips">
              {KEYWORDS.map(kw => (
                <button
                  key={kw.id}
                  className={`chip${active.has(kw.id) ? ' active' : ''}`}
                  data-value={kw.id}
                  onClick={() => onToggle(kw.id)}
                >{kw.label}</button>
              ))}
            </div>
          </div>

          <span className="result-count">顯示 {visible} / {total} 項</span>
        </div>
      </div>
    </div>
  )
}
