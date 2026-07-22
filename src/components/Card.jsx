import { useState } from 'react'
import { PHASES } from '../data/filters'

const PHASE_TAG_LABEL = Object.fromEntries(PHASES.map(p => [p.id, p.tagLabel]))


function ImageIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

export function Card({ card }) {
  const { title, roles, phases, content, images } = card
  const [imgOpen, setImgOpen] = useState(false)

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>{title}</span>
            {images?.length > 0 && (
              <button className="card-img-btn" onClick={() => setImgOpen(true)} title="補充圖片">
                <ImageIcon />
              </button>
            )}
          </div>
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

      {imgOpen && (
        <div className="dialog-overlay" onClick={() => setImgOpen(false)}>
          <div className="dialog card-img-dialog" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <span className="dialog-title">{title}</span>
              <button className="dialog-close" onClick={() => setImgOpen(false)}>×</button>
            </div>
            <div className="dialog-body card-img-dialog-body">
              {images.map((url, i) => (
                <img key={i} src={url} alt="" className="card-img-preview" />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
