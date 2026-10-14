const card = (metadata) => Object.freeze({
  ...metadata,
  roles: Object.freeze(metadata.roles),
  phases: Object.freeze(metadata.phases),
  contexts: Array.isArray(metadata.contexts) ? Object.freeze(metadata.contexts) : metadata.contexts,
  aliases: Object.freeze(metadata.aliases),
})

/**
 * Server-safe workflow metadata. This module deliberately contains no React or JSX imports.
 * `bodyText` is a semantic rendering of the visible card content for retrieval and LLM use.
 */
export const WORKFLOW_CATALOG = Object.freeze([
  card({
    id: 'project-info', title: '專案資訊', roles: ['PM', 'RD', 'QA'], phases: ['foundation'], section: 'foundation', contexts: 'all',
    aliases: ['Jira 專案', 'project key', 'Scrum Board', 'Release Board', 'SUN', 'TKK', 'Saku', 'Telasa'],
    bodyText: 'Saku 使用 SAKU Unified（SUN），Telasa 使用 Telasa x KKCompany（TKK）；兩者各有 Scrum Board 與 Release Board。Scrum Board 以 Sprint 開發進度為核心，供開發團隊日常追蹤；Release Board 以功能交付與部署狀態為核心，供 PO、QA 掌握全局。',
  }),
  card({
    id: 'task-hierarchy', title: '任務階層結構', roles: ['PM', 'RD', 'QA'], phases: ['foundation'], section: 'foundation', contexts: 'all',
    aliases: ['Epic', '母單', '子單', 'Story', 'Task', 'Bug', 'DEV-Task', 'QA-Task', 'issue hierarchy'],
    bodyText: 'Jira 任務採三層：Epic → 需求單（母單）→ 開發單（子單）。Epic 用於較大、跨團隊功能或集合；Story、Task、Bug 母單定義需求目標；DEV-Task、QA-Task 子單記錄開發執行。每張母單都必須建立子單。Feature Bug 掛在 Epic 下並與 Story 平行，以追蹤功能產生的 Bug。',
  }),
  card({
    id: 'points-rules', title: '點數規範', roles: ['PM', 'RD', 'QA'], phases: ['foundation'], section: 'foundation', contexts: 'all',
    aliases: ['Estimated Effort', 'Story Points', 'Actual Story Points', 'SP', '估點', '實際點數'],
    bodyText: 'Estimated Effort 用於 SPEC 不清楚時的 Epic、Story 早期決策；Story Points 在 Sprint 啟動前填於 DEV-Task、QA-Task；Actual Story Points 在子單完成後立即記錄實際花費。Story Points 與 Actual Story Points 僅能填在 subtask，最小 0.1，不可留空；母單由 Automation 匯總且不能手改。Actual Story Points 可由 EP Tool 的 MR description 自動回填。',
  }),
  card({
    id: 'story-vs-task', title: 'Story vs Task 核心差異', roles: ['PM', 'RD', 'QA'], phases: ['foundation'], section: 'foundation', contexts: 'all',
    aliases: ['Story', 'Task', '環境驗證', 'workflow', '狀態流程'],
    bodyText: 'Story 是需要環境驗證的需求，預設建立 DEV-Task 與 QA-Task，經 Open、In Progress、Dev Ready、各環境 Ready/Verified，最終由 QA 在 Prod 驗證後 Done。Task 是不需環境驗證的技術、營運或 Spike 工作，預設僅 DEV-Task，需要時再加 QA-Task；流程為 Open、In Progress、In Review，Reviewer 確認後手動 Done。',
  }),
  card({
    id: 'child-status', title: '子單狀態切換', roles: ['PM', 'RD', 'QA'], phases: ['foundation'], section: 'foundation', contexts: 'all',
    aliases: ['subtask status', 'DEV-Task 狀態', 'QA-Task 狀態', 'MR Create', 'MR Merged'],
    bodyText: 'DEV-Task、QA-Task 從 Open 到 In Progress 均由執行者手動切換。有 GitLab MR 連動時，MR Create 會自動切到 In Review，MR Merged 自動切到 Done；沒有 MR 連動時，In Review 與 Done 都需手動切換。',
  }),
  card({
    id: 'parent-status', title: '母單狀態切換', roles: ['PM', 'RD', 'QA'], phases: ['foundation'], section: 'foundation', contexts: 'all',
    aliases: ['parent issue status', '母票狀態', 'Automation', 'Dev Ready', 'QA Ready', 'PREP Ready', 'Prod Ready'],
    bodyText: '母單由 Jira Automation 依子單狀態推進，驗證環節才手動。Story/Bug：任一 DEV-Task In Progress 時母單自動 In Progress；所有 DEV-Task Done 時自動 Dev Ready；部署至 QA、PREP、Prod 時自動進入對應 Ready；QA 驗證通過後手動切至 QA/PREP Verified 或 Done。Task：任一 DEV-Task 開始時自動 In Progress，全部完成時自動 In Review，Reviewer 確認後手動 Done。',
  }),
  card({
    id: 'security-level', title: '權限控管', roles: ['PM'], phases: ['foundation'], section: 'foundation', contexts: 'all',
    aliases: ['Security Level', 'Internal', 'External', 'OPmust', 'FeatureMust', '外部存取', '權限'],
    bodyText: 'Security Level 控制 Jira 單據存取。Internal 僅開發成員可存取，預設用於 Epic、Story、Task、DEV-Task、QA-Task；External 可供開發成員與日方客戶存取，預設用於 Bug。加上 OPmust 或 FeatureMust Label 後，Automation 會將 Security Level 改為 External，目前主要由 OPM 使用。',
  }),
  card({
    id: 'ticket-creation', title: '需求開單規範', roles: ['PM'], phases: ['pre-sprint'], section: 'pre-sprint', contexts: ['pm-planning'],
    aliases: ['開票', 'Create All Dev Story', 'Custom Dev Story', 'Custom Dev Task', 'Component', 'SPEC', 'A/C'],
    bodyText: 'PM 建立 Epic 並填 Components 後，可用 Create All Dev Story 一鍵依 Component 建立 Story/Task 與 subtasks；也可用 Custom Dev Story、Custom Dev Task、Custom Pre-spike Task、Custom Spike Task 精準選擇類型與 Component，超出 Epic 範圍者會被忽略。每張需求單都必須有完整 SPEC 與 A/C 驗收條件。建議透過 Automation 建立子單，避免關鍵資訊漏填。',
  }),
  card({
    id: 'cross-team-tracking', title: '跨團隊工作追蹤（SRE / EP / SDET）', roles: ['PM', 'RD', 'QA'], phases: ['pre-sprint', 'in-sprint'], section: 'pre-sprint', contexts: ['pm-planning', 'pm-sprint', 'rd-dev', 'qa-testing'],
    aliases: ['跨團隊', 'SRE', 'EP', 'SDET', 'Status Link', '外部團隊'],
    bodyText: '需要 SRE、EP、SDET 支援時，PM 在 Epic Components 勾選團隊，再依是否需要跨環境驗證以 Automation 建立 Story 或 Task。系統在外部團隊 Project 建立工單，透過 Status Link 連動專案 DEV-Task；外部工單狀態變更會同步 DEV-Task 與需求單。PM、QA 只需追蹤專案需求單，不必另行跟催。',
  }),
  card({
    id: 'spike', title: 'Spike 研究型任務', roles: ['RD', 'PM', 'QA'], phases: ['pre-sprint', 'in-sprint'], section: 'pre-sprint', contexts: ['rd-spike', 'pm-planning'],
    aliases: ['Spike', 'Pre-Spike', '研究任務', '技術研究', 'Custom Spike Task'],
    bodyText: 'Spike 使用 Task 母單。有 Epic 時用 Custom Pre-spike/Spike Task by Component 自動建立 DEV-Task 並帶 Dev Type；無 Epic 時手建 Task，Summary 加 [Spike] 或 [Pre-Spike]。內容必須寫明預期產出，多次討論可註明場數或 Milestone。研究完成後將 DEV-Task Done，母單自動 In Review 並 Assign Reporter；負責人 Review 後手動將母單 Done。',
  }),
  card({
    id: 'dor', title: '需求就緒', roles: ['PM', 'RD', 'QA'], phases: ['pre-sprint'], section: 'pre-sprint', contexts: ['pm-planning'],
    aliases: ['DoR', 'Definition of Ready', '需求準備', '進 Sprint 條件'],
    bodyText: '進入 Sprint 前必須符合 Definition of Ready。Story/Task 要有明確 SPEC、A/C 驗收條件、設計連結與相依資訊；Bug 要有可重現條件（環境、版本、帳號、權限、資料前置）、截圖或錄影及驗證標準。',
  }),
  card({
    id: 'estimated-effort', title: '需求粗估（Optional）', roles: ['PM', 'RD'], phases: ['pre-sprint'], section: 'pre-sprint', contexts: ['pm-planning'],
    aliases: ['粗估', 'Estimated Effort', 'early estimate', '初估', 'Spike'],
    bodyText: 'PM 提出要粗估的 Story 或 Epic，RD 依已知資訊估算。信心過低時主動與 PM 討論先做 Spike；若仍需粗估，應在 Comment 註明不確定性。將點數填入 Story 或 Epic 的 Estimated Effort。粗估只供排程與決策，不等於實際開發點數。',
  }),
  card({
    id: 'sprint-planning', title: '規劃 Sprint 需求並排序', roles: ['PM'], phases: ['pre-sprint'], section: 'pre-sprint', contexts: ['pm-sprint'],
    aliases: ['Sprint Planning', '優先順序', '排 Sprint', 'Release Package', 'Capacity'],
    bodyText: 'PM 主導討論預計排入 Sprint 的客戶需求、OP Issues、Bugs、工程需求及初步優先順序，再依各團隊 Capacity 與預估點數決策。Saku 還需與 PO 確認需求所屬的大 Sprint，填入 Release Package，對應兩個月交付週期。',
  }),
  card({
    id: 'spec-confirm', title: 'SPEC & A/C 確認', roles: ['RD', 'QA'], phases: ['pre-sprint'], section: 'pre-sprint', contexts: ['rd-dev', 'qa-testing'],
    aliases: ['SPEC 確認', 'A/C', '驗收條件', 'Request Info', '需求不清'],
    bodyText: 'RD、QA 逐項確認 SPEC 與 A/C。遇到不清楚處，在 Jira Comment Tag PM/QA，將狀態改為 Request Info 並 Assign 給待回覆者；補充後確認無誤再恢復正常流程。需定期檢查 Assign 給自己的 Request Info，避免忘記轉派、漏看對方回覆或待確認事項。',
  }),
  card({
    id: 'auto-subtask-rules', title: '自動建單規則', roles: ['PM', 'RD', 'QA'], phases: ['pre-sprint'], section: 'pre-sprint', contexts: ['pm-planning', 'rd-dev'],
    aliases: ['Automation 建子單', '預設子單', 'subtask', 'Story 子單', 'Bug 子單', 'Task 子單'],
    bodyText: '母單建立後 Automation 自動產生子單：Story 預設 DEV-Task 加兩張 QA-Task；Bug 預設 DEV-Task 加 QA-Task；Task 預設僅 DEV-Task，需要時手動新增 QA-Task。若缺少或需要進一步拆分，手動新增子單。',
  }),
  card({
    id: 'split-estimate', title: '拆單 & 估點', roles: ['RD', 'QA'], phases: ['pre-sprint'], section: 'pre-sprint', contexts: ['rd-dev'],
    aliases: ['拆票', '拆單', '估點', 'Story Points', 'Sprint 容量'],
    bodyText: '以 Story/Task 需求單為單位評估：母單應能在一個 Sprint 內完成，DEV-Task 應能在一週內完成且少於 10 點。超過一個 Sprint 時須拆分，可建多張 Task 分階段完成，或保留原需求並縮減點數後排後續 Sprint。所有子單都要填 Story Points，建議團隊共同估點，最小 0.1。',
  }),
  card({
    id: 'qa-task-rules', title: 'DEV-Task / QA-Task 建立規則', roles: ['RD', 'QA'], phases: ['pre-sprint'], section: 'pre-sprint', contexts: ['rd-dev', 'qa-testing'],
    aliases: ['DEV-Task', 'QA-Task', 'Test Case Creation', 'Test Execution', 'Dev Type'],
    bodyText: 'DEV-Task 的 Dev Type 依母單自動填為 Dev、OP-Task、Bug、OP-Bug、Spike 或 Pre-Spike；Sprint 前填 Story Points，完成後填 Actual Story Points。Story 的 QA-Task 分 Test Case Creation 與 Test Execution：前者在 RD 開發期間同步建立，後者於 QA Ready 後執行；兩者皆填 Story Points、Due Date，完成後填 Actual SP。Test Execution 估點基準約 35 個 Test Case 等於 1 人天。',
  }),
  card({
    id: 'start-dev', title: '開始開發', roles: ['RD'], phases: ['in-sprint'], section: 'in-sprint', contexts: ['rd-dev', 'rd-bug'],
    aliases: ['開始工作', 'In Progress', '需求不清', 'Bug 無法重現', 'Request Info', 'Reproduce'],
    bodyText: 'RD 開始開發時找到 DEV-Task 子單並手動切至 In Progress。Story/Task SPEC 不清時，在母單留言、切 Request Info、Assign PM；Bug SPEC 不清亦將 Bug 單切 Request Info 並 Assign PM；Bug 無法重現時將 Bug 單切 Reproduce 並 Assign QA。',
  }),
  card({
    id: 'git-mr', title: 'Git MR 自動化流程', roles: ['RD'], phases: ['in-sprint', 'deploy'], section: 'in-sprint', contexts: ['rd-dev', 'rd-bug'],
    aliases: ['GitLab MR', 'merge request', 'MR Create', 'MR Merged', 'Release', '部署自動化'],
    bodyText: '有程式碼的 DEV-Task：MR 標註 Jira 單號後自動進 In Review，MR Merged 後自動 Done；Release 部署至 QA、PREP、PROD 時，母單分別自動進 QA Ready、PREP Ready、Prod Ready。沒有程式碼或 MR 連動的 DEV-Task，所有狀態由開發者手動切換。',
  }),
  card({
    id: 'actual-sp', title: '開發完成 — Actual Story Points 回填', roles: ['RD'], phases: ['in-sprint'], section: 'in-sprint', contexts: ['rd-dev'],
    aliases: ['Actual Story Points', 'Actual SP', '實際點數', '點數回填', 'Resolution'],
    bodyText: '每張 DEV-Task 完成後立即填 Actual Story Points。Resolution 為 Done/Fixed 的有效單須如實填寫，最小 0.1；Duplicate、Won’t Do 等無效單可不填，但若已花時間仍建議記錄。母單 Story Points 與 Actual Story Points 由 Automation 匯總，無法也禁止手改。',
  }),
  card({
    id: 'bug-create', title: 'Bug 開單規範', roles: ['QA'], phases: ['deploy'], section: 'deploy', contexts: ['qa-bug'],
    aliases: ['Bug ticket', '缺陷開單', 'Description', 'Defect Type', 'Feature Bug', 'Known Issue'],
    bodyText: 'Bug Description 必填 Env、Pre-condition（帳號/權限/資料）、Steps to Reproduce、Actual Result、Expected Result。其他必填為 Defect Type（Feature Bug 或 Known Issue）、Label、Release Package、Components、Assignee，並 Link 相關 Story 或 Task。',
  }),
  card({
    id: 'bug-fix', title: 'Bug 修復流程', roles: ['RD'], phases: ['in-sprint'], section: 'in-sprint', contexts: ['rd-bug'],
    aliases: ['修 Bug', 'Root Cause', 'Solution', 'Defect Cause', 'Dev Ready'],
    bodyText: 'Bug 修復時，在 MR 標註 DEV-Task 單號讓 Git 自動更新狀態；在 Bug 母單填 Root Cause、Solution、Defect Cause；在 DEV-Task 填 Actual Story Points。Root Cause 與 Solution 任一未填，即使子單全 Done，母單也不會自動進 Dev Ready；兩者填齊後 Automation 才推進。',
  }),
  card({
    id: 'bug-special', title: 'Bug 特殊情況處理', roles: ['RD', 'QA'], phases: ['in-sprint'], section: 'in-sprint', contexts: ['rd-bug', 'qa-bug'],
    aliases: ['Bug 無法重現', 'SPEC 遺漏', 'is fixed by', 'ReOpen', '特殊 Bug'],
    bodyText: 'Bug 無法重現：切 Reproduce、Assign QA 並 Comment Tag QA。SPEC 遺漏：切 Request Info、Assign PM 並 Tag PM。已在其他單修復：用 Link 的 is fixed by 指向修復 Bug。Bug 被 ReOpen：建立新的 DEV-Task 修復。',
  }),
  card({
    id: 'sprint-insert', title: '插單（Sprint 中加入新需求）', roles: ['PM', 'RD'], phases: ['in-sprint'], section: 'in-sprint', contexts: ['pm-sprint', 'rd-dev'],
    aliases: ['插單', '緊急需求', 'Sprint scope change', '資源不足', 'Resource'],
    bodyText: 'PM 要在當前 Sprint 插入緊急需求或 Bug 時，先在 Slack 或 Daily 主動告知 RD。RD 內部評估 Resource；不足時告知 PM 並討論把部分既有 Sprint 單移到下個 Sprint；仍無法調整時向主管反映，協調開發資源、加班支援或與客戶溝通。',
  }),
  card({
    id: 'abnormal-close', title: '異常結束處理（無效單）', roles: ['PM', 'RD', 'QA'], phases: ['in-sprint'], section: 'in-sprint', contexts: 'all',
    aliases: ['無效單', '異常關閉', 'Resolution', 'Duplicate', "Won't Do", 'Not a Bug'],
    bodyText: '無效母單先將 Status 切至 Done，再於出現的 Resolution 欄位選擇 Duplicate、Won’t Do、Not a Bug 等對應異常原因。Resolution 只有在狀態切到 Done 後才會出現。',
  }),
  card({
    id: 'dev-task-carryover', title: '需求跨 Sprint 處理', roles: ['PM', 'RD', 'QA'], phases: ['end-sprint'], section: 'end-sprint', contexts: 'all',
    aliases: ['carryover', '跨 Sprint', '未完成', '移到下個 Sprint', '點數切割'],
    bodyText: '跨 Sprint 以 Story/Task/Bug 母單判斷。完全未開始時直接將母單移至下個 Sprint；已進行中則母單留在當前 Sprint 繼續，結束當前 DEV-Task 並記錄已花點數與進度，再建立新 DEV-Task 給下個 Sprint。母單不算部分完成，只能全部完成或尚未完成；可用多張 DEV-Task 切割執行。',
  }),
  card({
    id: 'sprint-coexist', title: 'Sprint 並存說明', roles: ['PM', 'RD', 'QA'], phases: ['end-sprint'], section: 'end-sprint', contexts: 'all',
    aliases: ['多個 Sprint', 'Sprint 並存', 'Complete Sprint', '跨 Sprint', '開發 Cycle'],
    bodyText: '從開發、環境部署到 QA 驗證是一個完整 Cycle，Story/Bug 橫跨多個 Sprint 屬正常。Sprint 到期不強制關閉，所有需求 Done 才 Complete；Scrum Board 同時存在多個 Sprint 也是正常現象。',
  }),
  card({
    id: 'required-fields-check', title: '必填欄位檢核', roles: ['PM', 'RD', 'QA'], phases: ['end-sprint'], section: 'end-sprint', contexts: 'all',
    aliases: ['欄位檢查', '必填', '漏填', 'Story Points', 'Defect Cause', 'Impact Scope'],
    bodyText: 'Sprint 結束時列出不合規單並補齊：DEV-Task、QA-Task 必須有 Story Points 與 Actual Story Points；Bug 必須有 Defect Cause；Saku 的 Story、Task、Bug 必須有 Impact Scope。',
  }),
  card({
    id: 'qa-verify', title: 'QA 驗證流程', roles: ['QA'], phases: ['deploy'], section: 'deploy', contexts: ['qa-testing', 'qa-bug'],
    aliases: ['QA Ready', 'QA Verified', 'PREP Ready', 'PREP Verified', 'Prod Ready', '環境驗證'],
    bodyText: '部署 QA 後母單自動 QA Ready，QA 執行 Test Execution，通過後手動 QA Verified；部署 PREP 後自動 PREP Ready，通過後手動 PREP Verified；部署 PROD 後自動 Prod Ready，通過後手動 Done。QA-Task 狀態不影響母單推進，母單狀態只跟 DEV-Task。',
  }),
  card({
    id: 'verify-found-bug', title: '驗證過程發現 Bug', roles: ['QA'], phases: ['deploy'], section: 'deploy', contexts: ['qa-bug', 'qa-testing'],
    aliases: ['測試發現 Bug', 'QA 開 Bug', 'Defect Type', '驗證缺陷', 'Parent Epic'],
    bodyText: '驗證時發現問題，建立 Bug 並填完整 Env、Pre-condition、Steps、Actual Result、Expected Result，設定 Label、Release Package、Components、Assignee、Defect Type。問題未涵蓋於 SPEC/A/C 時可先 Assign PM 補充定義；功能有 Epic 時將 Bug Parent 設為該 Epic。Bug 建立後系統自動產生 DEV-Task 與 QA-Task 各一張。',
  }),
  card({
    id: 'bug-reopen', title: 'Bug ReOpen 處理', roles: ['QA', 'RD'], phases: ['in-sprint', 'deploy'], section: 'in-sprint', contexts: ['qa-bug', 'rd-bug'],
    aliases: ['ReOpen', 'Reopened Count', '重開 Bug', '驗證失敗', '新 DEV-Task'],
    bodyText: 'RD 修復後 QA 驗證仍有問題時，QA 將 Bug 母單切回 In Progress；Automation 建立新的 DEV-Task 供繼續修復，並建立新的 QA-Task 記錄後續驗證；Reopened Count 自動加一。',
  }),
  card({
    id: 'impact-scope', title: '[Saku 專屬] Impact Scope 填寫規範', roles: ['PM', 'RD'], phases: ['in-sprint'], section: 'in-sprint', contexts: ['pm-planning', 'rd-dev', 'rd-bug'],
    aliases: ['Impact Scope', 'License', 'Playback', 'Reports', 'Saku', '影響範圍'],
    bodyText: 'Saku 的 Impact Scope 供客戶掌握變更影響，可複選 License、Playback、Reports。License 包含購買邏輯與流程、觀看權限、顯示邏輯、合約判定；Playback 是 Player 周邊任何變更；Reports 包含報表相關 Amplitude、CP/BI Reports，以及 Billing Logs、EST Integration Logs、Campaign Logs、CP/BI Reports 的產生邏輯。只要範圍有變更就須選取，包含程式碼修改、Refactoring、版本更新。',
  }),
  card({
    id: 'spec-change', title: 'SPEC Change 處理', roles: ['RD', 'PM'], phases: ['deploy'], section: 'deploy', contexts: ['rd-dev', 'pm-sprint'],
    aliases: ['SpecChange', 'SPEC 變更', 'Deploy 加開 DEV-Task', '部分上線', '延後發布'],
    bodyText: '母單進入 QA Ready、PREP Ready 等 Deploy 階段後若因 SPEC 變更加開 DEV-Task，系統加 SpecChange Label，母單拉回 In Progress，Jira 與 Git 進度不同步屬正常。能在 Release to PREP 前完成就正常開發重送測；來不及但允許部分上線，將新需求移到新單並排下個 Sprint；若要下次一併發布，撤回已 merge 的半成品程式碼。PM 須與客戶確認採本次部分上線或全部保留至下次。',
  }),
])

const catalogById = new Map()
for (const item of WORKFLOW_CATALOG) {
  const requiredFields = ['id', 'title', 'roles', 'phases', 'section', 'contexts', 'bodyText', 'aliases']
  const missingFields = requiredFields.filter(field => item[field] == null)
  if (missingFields.length) {
    throw new Error(`Workflow catalog card ${item.id ?? '<unknown>'} is missing: ${missingFields.join(', ')}`)
  }
  if (!item.bodyText.trim() || item.bodyText.trim() === item.title.trim()) {
    throw new Error(`Workflow catalog card ${item.id} requires descriptive bodyText`)
  }
  if (catalogById.has(item.id)) throw new Error(`Duplicate workflow catalog id: ${item.id}`)
  catalogById.set(item.id, item)
}

export const WORKFLOW_CATALOG_BY_ID = catalogById

export function getWorkflowCard(id) {
  return WORKFLOW_CATALOG_BY_ID.get(id)
}
