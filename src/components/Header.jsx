export function Header({ onReset }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div>
          <h1>Jira Working Guide</h1>
          <div className="subtitle">v2.0 · Fields × Workflow</div>
        </div>
        <button className="reset-btn" onClick={onReset}>清除篩選</button>
      </div>
    </header>
  )
}
