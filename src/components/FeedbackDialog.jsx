import { useState, useEffect } from 'react'
import { APPS_SCRIPT_URL } from '../config'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i
const GDRIVE_RE = /https:\/\/drive\.google\.com\/file\/d\/([^/]+)/

function toImageSrc(urlStr) {
  const gdrive = urlStr.match(GDRIVE_RE)
  if (gdrive) return `https://drive.google.com/thumbnail?id=${gdrive[1]}&sz=w1000`
  try {
    const url = new URL(urlStr)
    if (IMAGE_EXT.test(url.pathname)) return urlStr
  } catch {}
  return null
}

function renderReply(text) {
  return text.replace(/\\n/g, '\n').split('\n').map((line, i) => {
    const src = toImageSrc(line.trim())
    if (src) return <img key={i} src={src} className="faq-img" alt="" />
    return <span key={i}>{line}{'\n'}</span>
  })
}

const EMPTY_FORM = { name: '', category: '問題', content: '' }

export function FeedbackDialog({ open, onClose }) {
  const [tab, setTab] = useState('guide')
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [faqs, setFaqs] = useState([])
  const [faqLoading, setFaqLoading] = useState(false)
  const [faqError, setFaqError] = useState(false)
  const [faqSearch, setFaqSearch] = useState('')

  useEffect(() => {
    if (!open) return
    setTab('guide')
    setSubmitted(false)
    setForm(EMPTY_FORM)
    setErrors({})
  }, [open])

  useEffect(() => {
    if (!open || tab !== 'faq') return
    if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      setFaqError(true)
      return
    }
    setFaqLoading(true)
    setFaqError(false)
    fetch(APPS_SCRIPT_URL)
      .then(r => r.json())
      .then(data => {
        setFaqs(data.filter(r => r.category === '問題' && r.reply))
        setFaqLoading(false)
      })
      .catch(() => {
        setFaqError(true)
        setFaqLoading(false)
      })
  }, [open, tab])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = '請填寫姓名'
    if (!form.content.trim()) errs.content = '請填寫內容'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      setSubmitted(true)
      return
    }
    setSubmitting(true)
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).finally(() => {
      setSubmitting(false)
      setSubmitted(true)
    })
  }

  if (!open) return null

  return (
    <div className="dialog-overlay">
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <span className="dialog-title">意見反饋</span>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>

        <div className="dialog-tabs">
          <button
            className={`dialog-tab${tab === 'guide' ? ' active' : ''}`}
            onClick={() => setTab('guide')}
          >快速上手</button>
          <button
            className={`dialog-tab${tab === 'form' ? ' active' : ''}`}
            onClick={() => setTab('form')}
          >送出反饋</button>
          <button
            className={`dialog-tab${tab === 'faq' ? ' active' : ''}`}
            onClick={() => setTab('faq')}
          >問題集</button>
        </div>

        <div className="dialog-body">
          {tab === 'guide' && (
            <div className="guide-content">
              <p className="guide-intro">系統分為三個區塊：<strong>Workflow</strong>（開發流程）、<strong>Fields</strong>（欄位規範）、<strong>Automation</strong>（自動化規則），可從頁面頂部切換。</p>

              <p className="guide-section-title">建議閱讀流程</p>
              <ol className="guide-steps">
                <li>進入 <strong>Workflow</strong>，切換至自己的角色（PM / RD / QA）</li>
                <li>優先閱讀「<strong>核心概念</strong>」區段，這是所有規範的基礎</li>
                <li>熟悉後點擊右側<strong>眼睛圖示</strong>將核心概念收合，專注瀏覽各階段規範</li>
                <li>掌握每個階段必須遵守的事項後，切換至 <strong>Fields</strong></li>
                <li>同樣選擇自己的角色，勾選「<strong>必填</strong>」快速掌握最關鍵的欄位規範</li>
              </ol>

              <p className="guide-section-title">有問題或建議？</p>
              <p className="guide-note">善用右上角的燈泡圖示開啟意見反饋。有疑問歡迎透過「<strong>問題</strong>」類型提交，會有專人定期回覆；有想法也歡迎透過「<strong>意見</strong>」類型分享。</p>
            </div>
          )}

          {tab === 'form' && (
            submitted ? (
              <div className="dialog-success">
                <p>✓ 已收到，謝謝！</p>
                <button className="dialog-again" onClick={() => { setSubmitted(false); setForm(EMPTY_FORM) }}>
                  再送一則
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>姓名</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="你的名字" className={errors.name ? 'input-error' : ''} />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-field">
                  <label>分類</label>
                  <div className="category-group">
                    {['問題', '意見', '勘誤'].map(c => (
                      <button
                        key={c} type="button"
                        className={`category-btn${form.category === c ? ' active' : ''}`}
                        onClick={() => setForm(prev => ({ ...prev, category: c }))}
                      >{c}</button>
                    ))}
                  </div>
                </div>
                <div className="form-field">
                  <label>內容</label>
                  <textarea name="content" value={form.content} onChange={handleChange} placeholder="詳細說明..." rows={4} className={errors.content ? 'input-error' : ''} />
                  {errors.content && <span className="field-error">{errors.content}</span>}
                </div>
                <button type="submit" className="dialog-submit" disabled={submitting}>
                  {submitting ? '送出中…' : '送出'}
                </button>
              </form>
            )
          )}

          {tab === 'faq' && (() => {
            const keyword = faqSearch.trim().toLowerCase()
            const filtered = faqs.filter(r =>
              !keyword ||
              r.content.toLowerCase().includes(keyword) ||
              r.reply.toLowerCase().includes(keyword)
            )
            return (
              <>
                <div className="faq-search-wrap">
                  <input
                    className="faq-search"
                    placeholder="搜尋關鍵字…"
                    value={faqSearch}
                    onChange={e => setFaqSearch(e.target.value)}
                  />
                </div>
                {faqLoading ? (
                  <p className="dialog-hint">載入中…</p>
                ) : faqError ? (
                  <p className="dialog-hint">尚無資料</p>
                ) : faqs.length === 0 ? (
                  <p className="dialog-hint">目前還沒有已回答的問題</p>
                ) : filtered.length === 0 ? (
                  <p className="dialog-hint">找不到符合的結果</p>
                ) : (
                  <ul className="faq-list">
                    {filtered.map((item, i) => (
                      <li key={i} className="faq-item">
                        <p className="faq-q"><span className="faq-q-label">Q</span>{item.content}</p>
                        <div className="faq-a">{renderReply(item.reply)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
