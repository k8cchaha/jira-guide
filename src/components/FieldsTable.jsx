import { ISSUE_TYPE_GROUPS, TIMINGS } from '../data/fields'

const GROUP_LABEL = Object.fromEntries(ISSUE_TYPE_GROUPS.map(g => [g.id, g.label]))
const TIMING_LABEL = Object.fromEntries(TIMINGS.map(t => [t.id, t.label]))

export function FieldsTable({ fields }) {
  if (fields.length === 0) {
    return (
      <div className="no-results">
        <p>目前篩選條件無符合的欄位</p>
      </div>
    )
  }

  return (
    <div className="fields-table-wrap">
      <table className="fields-table">
        <thead>
          <tr>
            <th className="col-name">欄位名稱 / 定義</th>
            <th className="col-usage">使用情境</th>
            <th className="col-type">適用 Issue Type</th>
            <th className="col-who">誰填 · 填寫時機</th>
            <th className="col-meta">類型 · 填寫</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(field => (
            <tr key={field.id}>
              <td className="col-name">
                <span className="field-name">
                  {field.name}
                  {field.required && <span className="required-mark" aria-label="必填">＊</span>}
                </span>
                <span className="field-def">{field.definition}</span>
              </td>
              <td className="col-usage">{field.usage}</td>
              <td className="col-type">
                <IssueTypeCell groups={field.issueTypeGroups} />
              </td>
              <td className="col-who">
                <WhoCell roles={field.roles} timing={field.timing} />
              </td>
              <td className="col-meta">
                <div className="meta-combined">
                  <IssueTypeCell groups={field.issueTypeGroups} />
                  <WhoCell roles={field.roles} timing={field.timing} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function IssueTypeCell({ groups }) {
  if (groups.includes('all')) {
    return <span className="it-chip it-all">全部</span>
  }
  return (
    <div className="it-chips">
      {groups.map(g => (
        <span key={g} className={`it-chip it-${g}`}>{GROUP_LABEL[g]}</span>
      ))}
    </div>
  )
}

function WhoCell({ roles, timing }) {
  const isAuto = roles.length === 0

  return (
    <div className="who-cell">
      <div className="who-roles">
        {isAuto
          ? <span className="field-auto">⚡ 自動</span>
          : roles.map(r => <span key={r} className={`tag tag-${r}`}>{r}</span>)
        }
      </div>
      {timing.length > 0 && (
        <div className="who-timing">
          {timing.map(t => TIMING_LABEL[t]).join(' / ')}
        </div>
      )}
    </div>
  )
}
