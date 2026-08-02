export function AutomationTable({ automations }) {
  if (automations.length === 0) {
    return (
      <div className="no-results">
        <p>目前篩選條件無符合的 Automation</p>
      </div>
    )
  }

  return (
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
            <tr key={a.id}>
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
  )
}
