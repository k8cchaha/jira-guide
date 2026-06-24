import React from 'react'

// Status types: open | prog | review | ready | verify | done
export function St({ type, children }) {
  return <span className={`st st-${type}`}>{children}</span>
}

// Automatically inserts → arrows between children
export function Flow({ children }) {
  const items = React.Children.toArray(children)
  return (
    <div className="flow">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {item}
          {i < items.length - 1 && <span className="flow-arrow">→</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
