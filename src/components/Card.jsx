import { PHASES } from '../data/filters'

const PHASE_TAG_LABEL = Object.fromEntries(PHASES.map(p => [p.id, p.tagLabel]))

export function Card({ card }) {
  const { title, roles, phases, content } = card

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        <div className="card-tags">
          {roles.map(r => (
            <span key={r} className={`tag tag-${r}`}>{r}</span>
          ))}
          {phases.map(p => (
            <span key={p} className={`tag tag-${p}`}>{PHASE_TAG_LABEL[p]}</span>
          ))}
        </div>
      </div>
      <div className="card-body">
        {content}
      </div>
    </div>
  )
}
