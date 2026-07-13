import { useState } from 'react'
import { FeedbackDialog } from './FeedbackDialog'

export function Header({ mode, onModeChange, onReset }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

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
        <div className="header-right">
          <button className="feedback-btn" onClick={() => setFeedbackOpen(true)}>
            <svg width="16" height="16" viewBox="-3 -3 30 30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21h6" />
              <path d="M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.15-3 5.19V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.81C7.2 13.15 6 11.22 6 9a6 6 0 0 1 6-6z" />
              <g className="bulb-rays">
                <line x1="12" y1="-2" x2="12" y2="1.5" />
                <line x1="19.5" y1="0.5" x2="17" y2="3" />
                <line x1="23" y1="9" x2="19.5" y2="9" />
                <line x1="4.5" y1="0.5" x2="7" y2="3" />
                <line x1="1" y1="9" x2="4.5" y2="9" />
              </g>
            </svg>
            小幫手
          </button>
          <button className="reset-btn" onClick={onReset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            清除篩選
          </button>
        </div>
      </div>
      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </header>
  )
}
