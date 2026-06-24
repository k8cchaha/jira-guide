export function Steps({ children, style }) {
  return (
    <ol className="steps" style={style}>
      {children}
    </ol>
  )
}
