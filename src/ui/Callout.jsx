export function Callout({ type = 'info', children, style }) {
  return (
    <div className={`callout callout-${type}`} style={style}>
      {children}
    </div>
  )
}
