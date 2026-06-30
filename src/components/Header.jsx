export function Header({ mode, onModeChange, onReset }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <div className="header-title-row">
            <h1>Jira Working Guide</h1>
            <span className="version-tag">v2.0</span>
          </div>
          <div className="subtitle">
            <span
              className={`subtitle-tab subtitle-workflow${mode === 'workflow' ? ' active' : ''}`}
              onClick={() => onModeChange('workflow')}
            >Workflow</span>
            {' × '}
            <span
              className={`subtitle-tab subtitle-fields${mode === 'fields' ? ' active' : ''}`}
              onClick={() => onModeChange('fields')}
            >Fields</span>
            {' × '}
            <span className="subtitle-automation">Automation</span>
          </div>
        </div>
        <button className="reset-btn" onClick={onReset}>清除篩選</button>
      </div>
    </header>
  )
}
