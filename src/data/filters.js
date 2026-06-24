export const PHASES = [
  { id: 'foundation', label: '基礎概念',      tagLabel: '基礎概念' },
  { id: 'pre-sprint', label: 'Sprint 規劃前',  tagLabel: 'Sprint 規劃前' },
  { id: 'in-sprint',  label: 'Sprint 中',      tagLabel: 'Sprint 中' },
  { id: 'end-sprint', label: 'Sprint 結束',    tagLabel: 'Sprint 結束' },
  { id: 'deploy',     label: '功能部署與驗證',  tagLabel: '部署與驗證' },
]

export const ROLE_CONTEXTS = {
  PM: [
    { id: 'pm-planning', label: '需求規劃' },
    { id: 'pm-sprint',   label: 'Sprint 規劃' },
  ],
  RD: [
    { id: 'rd-dev',   label: '功能開發' },
    { id: 'rd-bug',   label: 'Bug 修復' },
    { id: 'rd-spike', label: 'Spike 研究' },
  ],
  QA: [
    { id: 'qa-testing', label: '功能測試' },
    { id: 'qa-bug',     label: 'Bug 驗證' },
  ],
}

export const ALL_CONTEXTS = Object.values(ROLE_CONTEXTS).flat()
