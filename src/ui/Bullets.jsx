export function Bullets({ children, sub, style }) {
  return (
    <ul className={`bullets${sub ? ' sub' : ''}`} style={style}>
      {children}
    </ul>
  )
}
