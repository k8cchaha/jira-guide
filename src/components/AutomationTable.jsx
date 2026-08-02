import { useState, useEffect } from 'react'

function AutomationDetailDialog({ item, onClose }) {
  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog auto-detail-dialog" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <span className="dialog-title">Automation 詳情</span>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body auto-detail-body">
          <p className="auto-detail-purpose">{item.purpose}</p>
          <div className="auto-detail-section">
            <span className="auto-detail-label">觸發條件</span>
            <p className="auto-detail-text">{item.trigger}</p>
          </div>
          <div className="auto-detail-section">
            <span className="auto-detail-label">執行動作</span>
            <p className="auto-detail-text">{item.action}</p>
          </div>
          <div className="auto-detail-section">
            <span className="auto-detail-label">分類</span>
            <div className="kw-tags">
              {item.keywords.map(kw => (
                <span key={kw} className="kw-tag" data-kw={kw}>{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AutomationTable({ automations }) {
  const [selected, setSelected] = useState(null)

  if (automations.length === 0) {
    return (
      <div className="no-results">
        <p>目前篩選條件無符合的 Automation</p>
      </div>
    )
  }

  return (
    <>
      <div className="automation-table-wrap">
        <table className="automation-table">
          <thead>
            <tr>
              <th className="col-purpose">目的</th>
              <th className="col-trigger">觸發條件</th>
              <th className="col-action">執行動作</th>
              <th className="col-kw">分類</th>
            </tr>
          </thead>
          <tbody>
            {automations.map(a => (
              <tr key={a.id} className="auto-row" onClick={() => setSelected(a)}>
                <td className="col-purpose">{a.purpose}</td>
                <td className="col-trigger auto-text">{a.trigger}</td>
                <td className="col-action auto-text">{a.action}</td>
                <td className="col-kw">
                  <div className="kw-tags">
                    {a.keywords.map(kw => (
                      <span key={kw} className="kw-tag" data-kw={kw}>{kw}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <AutomationDetailDialog item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
