import { Callout, Tbl, Steps, Bullets, Flow, St } from '../ui'

/**
 * 卡片資料結構：
 *
 * {
 *   id:       string        — 唯一識別碼
 *   title:    string        — 卡片標題
 *   roles:    string[]      — 適用角色：'PM' | 'RD' | 'QA'
 *   phases:   string[]      — 篩選階段（可多選）
 *   section:  string        — 顯示在哪個 section（預設取 phases[0]）
 *   contexts: string[]|'all'— 任務情境 id，'all' 表示通用
 *   content:  JSX           — 卡片主體，完全自由組合
 * }
 *
 * 可用 UI 元件（from '../ui'）：
 *   <Callout type="info|warning|danger|success">...</Callout>
 *   <Tbl style={...}><tr>...</tr></Tbl>
 *   <Steps><li>...</li></Steps>
 *   <Bullets [sub]><li>...</li></Bullets>
 *   <Flow><St type="open|prog|review|ready|verify|done">Label</St></Flow>
 */

// ─────────────────────────── 核心概念 ───────────────────────────

const projectInfo = {
  id: 'project-info',
  title: '專案資訊',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
  images: ['/card-images/pic-1.jpg'],
  content: (
    <>
      <Tbl>
        <tr><th>專案</th><th>名稱 (KEY)</th><th>Scrum Board</th><th>Release Board</th></tr>
        <tr>
          <td><strong>Saku</strong></td>
          <td>SAKU Unified (SUN)</td>
          <td><a href="https://kkvideo.atlassian.net/jira/software/c/projects/SUN/boards/1164" target="_blank" rel="noreferrer">Scrum Board ↗</a></td>
          <td><a href="https://kkvideo.atlassian.net/jira/software/c/projects/SUN/boards/1165" target="_blank" rel="noreferrer">Release Board ↗</a></td>
        </tr>
        <tr>
          <td><strong>Telasa</strong></td>
          <td>Telasa x KKCompany (TKK)</td>
          <td><a href="https://kkvideo.atlassian.net/jira/software/c/projects/TKK/boards/1198" target="_blank" rel="noreferrer">Scrum Board ↗</a></td>
          <td><a href="https://kkvideo.atlassian.net/jira/software/c/projects/TKK/boards/1199" target="_blank" rel="noreferrer">Release Board ↗</a></td>
        </tr>
      </Tbl>
      <Callout type="info">
        <strong>Scrum Board：</strong>以開發衝刺為核心，追蹤每個 Sprint 的功能進度，適合開發團隊日常使用<br />
        <strong>Release Board：</strong>以功能交付為核心，呈現整體部署狀態，適合 PO / QA 掌握全局進度
      </Callout>
    </>
  ),
}

const taskHierarchy = {
  id: 'task-hierarchy',
  title: '任務階層結構',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
  content: (
    <>
      <p>三層級結構：<strong>Epic → 需求單（母單）→ 開發單（子單）</strong></p>
      <Tbl style={{ marginTop: 10 }}>
        <tr><th>層級</th><th>類型</th><th>用途</th></tr>
        <tr><td>Top</td><td>Epic</td><td>較大或跨團隊的功能，或可作為集合用</td></tr>
        <tr><td>母單</td><td>Story、Task、Bug</td><td>定義「需求目標」</td></tr>
        <tr><td>子單</td><td>DEV-Task、QA-Task</td><td>記錄「開發執行」</td></tr>
      </Tbl>
      <Callout type="danger">
        每張母單都必須建立子單來記錄開發細節。
      </Callout>
      <Callout type="info">
        Feature Bug 掛在 <strong>Epic 下</strong>（與 Story 平行），可清楚追蹤哪個功能產生哪些 Bug。
      </Callout>
    </>
  ),
}

const pointsRules = {
  id: 'points-rules',
  title: '點數規範',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
  content: (
    <>
      <Tbl>
        <tr><th></th><th>Estimated Effort</th><th>Story Points</th><th>Actual Story Points</th></tr>
        <tr><td><strong>時機</strong></td><td>SPEC 不清楚時</td><td>Sprint 啟動前</td><td>任務完成後立即填</td></tr>
        <tr><td><strong>適用</strong></td><td>Epic、Story</td><td>DEV-Task、QA-Task</td><td>DEV-Task、QA-Task</td></tr>
        <tr><td><strong>目的</strong></td><td>早期決策依據</td><td>Sprint 評估範圍</td><td>紀錄實際花費點數</td></tr>
      </Tbl>
      <Callout type="danger" style={{ marginTop: 10 }}>
        Story Points & Actual Story Points <strong>僅限子單填入</strong>。<br />
        最小單位 <strong>0.1</strong>（極小任務也請勿留空，避免系統誤判為未填）。<br />
        母單點數由 Automation 自動匯總，禁止手動修改。
      </Callout>
    </>
  ),
}

const storyVsTask = {
  id: 'story-vs-task',
  title: 'Story vs Task 核心差異',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
  content: (
    <>
      <Tbl>
        <tr><th></th><th>Story</th><th>Task</th></tr>
        <tr><td><strong>定義</strong></td><td>需要進行環境驗證的需求</td><td>不需要環境驗證的工作任務（技術/營運/Spike）</td></tr>
        <tr><td><strong>預設子單</strong></td><td>DEV-Task + QA-Task</td><td>僅 DEV-Task（有需要再手動加 QA-Task）</td></tr>
        <tr><td><strong>結束條件</strong></td><td>QA 在 Prod 環境驗證通過</td><td>Reviewer 確認後手動關閉</td></tr>
      </Tbl>
      <p style={{ marginTop: 10, color: '#6B778C', fontSize: 12 }}><strong>Story / Bug 主流程：</strong></p>
      <Flow>
        <St type="open">Open</St>
        <St type="prog">In Progress</St>
        <St type="devready">Dev Ready</St>
        <St type="ready">QA Ready</St>
        <St type="verify">QA Verified</St>
        <St type="ready">PREP Ready</St>
        <St type="verify">PREP Verified</St>
        <St type="ready">Prod Ready</St>
        <St type="done">Done</St>
      </Flow>
      <p style={{ color: '#6B778C', fontSize: 12 }}><strong>Task / 子單 主流程：</strong></p>
      <Flow>
        <St type="open">Open</St>
        <St type="prog">In Progress</St>
        <St type="review">In Review</St>
        <St type="done">Done</St>
      </Flow>
    </>
  ),
}

const childStatus = {
  id: 'child-status',
  title: '子單狀態切換',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
  content: (
    <>
      <Callout type="info">
        子單（DEV-Task / QA-Task）的狀態切換視有無 <strong>GitLab MR 連動</strong>而不同。
      </Callout>
      <Tbl>
        <tr>
          <th style={{ width: '36%' }}>狀態切換</th>
          <th>有 GitLab MR 連動</th>
          <th>無 GitLab MR 連動</th>
        </tr>
        <tr>
          <td><St type="open">Open</St> → <St type="prog">In Progress</St></td>
          <td colSpan={2} style={{ textAlign: 'center', color: '#42526E' }}>✋ 手動（開始執行時）</td>
        </tr>
        <tr>
          <td><St type="prog">In Progress</St> → <St type="review">In Review</St></td>
          <td>⚡ 自動（MR Create）</td>
          <td>✋ 手動</td>
        </tr>
        <tr>
          <td><St type="review">In Review</St> → <St type="done">Done</St></td>
          <td>⚡ 自動（MR Merged）</td>
          <td>✋ 手動</td>
        </tr>
      </Tbl>
    </>
  ),
}

const parentStatus = {
  id: 'parent-status',
  title: '母單狀態切換',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
  content: (
    <>
      <Callout type="info">
        母單狀態由 Jira Automation 根據子單狀態自動推進，
        僅在<strong>驗證環節</strong>需手動切換。
      </Callout>

      <p style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: '#172B4D' }}>Story / Bug</p>
      <Tbl style={{ marginTop: 4 }}>
        <tr><th style={{ width: '42%' }}>狀態切換</th><th style={{ width: '20%' }}>方式</th><th>觸發條件</th></tr>
        <tr>
          <td><St type="open">Open</St> → <St type="prog">In Progress</St></td>
          <td>⚡ 自動</td>
          <td>任一 <strong>DEV-Task</strong> 進入 In Progress</td>
        </tr>
        <tr>
          <td><St type="prog">In Progress</St> → <St type="devready">Dev Ready</St></td>
          <td>⚡ 自動</td>
          <td>所有 <strong>DEV-Task</strong> Done</td>
        </tr>
        <tr>
          <td> → <St type="ready">QA / PREP / Prod Ready</St></td>
          <td>⚡ 自動</td>
          <td>程式碼部署至 QA / PREP / Prod 環境</td>
        </tr>
        <tr>
          <td> → <St type="verify">QA / PREP Verified</St> <St type="done">Done</St></td>
          <td>✋ 手動</td>
          <td>QA 在 QA / PREP / Prod 環境驗證通過</td>
        </tr>
        {/* <tr>
          <td><St type="verify">QA Verified</St> → <St type="ready">PREP Ready</St></td>
          <td>⚡ 自動</td>
          <td>程式碼部署至 PREP 環境</td>
        </tr>
        <tr>
          <td><St type="ready">PREP Ready</St> → <St type="verify">PREP Verified</St></td>
          <td>✋ 手動</td>
          <td>QA 在 PREP 環境驗證通過</td>
        </tr>
        <tr>
          <td><St type="verify">PREP Verified</St> → <St type="ready">Prod Ready</St></td>
          <td>⚡ 自動</td>
          <td>程式碼部署至 Prod 環境</td>
        </tr>
        <tr>
          <td><St type="ready">Prod Ready</St> → <St type="done">Done</St></td>
          <td>✋ 手動</td>
          <td>QA 在 Prod 環境驗證通過</td>
        </tr> */}
      </Tbl>

      <p style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: '#172B4D' }}>Task</p>
      <Tbl style={{ marginTop: 4 }}>
        <tr><th style={{ width: '42%' }}>狀態切換</th><th style={{ width: '20%' }}>方式</th><th>觸發條件</th></tr>
        <tr>
          <td><St type="open">Open</St> → <St type="prog">In Progress</St></td>
          <td>⚡ 自動</td>
          <td>任一 <strong>DEV-Task</strong> 進入 In Progress</td>
        </tr>
        <tr>
          <td><St type="prog">In Progress</St> → <St type="review">In Review</St></td>
          <td>⚡ 自動</td>
          <td>所有 <strong>DEV-Task</strong> Done</td>
        </tr>
        <tr>
          <td><St type="review">In Review</St> → <St type="done">Done</St></td>
          <td>✋ 手動</td>
          <td>Reviewer 驗證確認後操作</td>
        </tr>
      </Tbl>
    </>
  ),
}

const securityLevel = {
  id: 'security-level',
  title: '權限控管',
  roles: ['PM'],
  phases: ['foundation'],
  contexts: 'all',
  content: (
    <>
      <p>專案使用 <strong>Security Level</strong> 控管單據的存取範圍：</p>
      <Tbl style={{ marginTop: 8 }}>
        <thead>
          <tr><th>Security Level</th><th>可存取對象</th><th>預設適用</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Internal</strong></td>
            <td>開發成員</td>
            <td>Epic · Story · Task · DEV-Task · QA-Task</td>
          </tr>
          <tr>
            <td><strong>External</strong></td>
            <td>開發成員 & 日方客戶（可對外）</td>
            <td>Bug</td>
          </tr>
        </tbody>
      </Tbl>
      <Callout type="info" style={{ marginTop: 8 }}>
        當單據加上 Label <code>OPmust</code>，Automation 會自動將 Security Level 調整為 <strong>External</strong>。目前主要由 OPM 使用。
      </Callout>
    </>
  ),
}

// ─────────────────────────── Sprint 規劃前 ───────────────────────────

const ticketCreation = {
  id: 'ticket-creation',
  title: '需求開單規範',
  roles: ['PM'],
  phases: ['pre-sprint'],
  contexts: ['pm-planning'],
  content: (
    <>
      <p style={{ fontWeight: 600, color: '#172B4D' }}>全自動一鍵建立</p>
      <Steps style={{ marginTop: 4 }}>
        <li>建立 Epic 後填入 <strong>Components</strong>，點擊 ⚡ <strong>Create All Dev Story</strong></li>
        <li>系統依 Epic 所選的 Components，自動建立對應的 Story 或 Task，及所有 subtasks</li>
      </Steps>
      <p style={{ fontWeight: 600, color: '#172B4D', marginTop: 12 }}>精準控制開單類型</p>
      <Steps style={{ marginTop: 4 }}>
        <li>建立 Epic 後填入 <strong>Components</strong>，點擊其中一個 Custom 按鈕：
          <Bullets sub style={{ marginTop: 4 }}>
            <li>⚡ <strong>Custom Dev Story by Component</strong>：建立指定 Component 的 Story 單</li>
            <li>⚡ <strong>Custom Dev Task by Component</strong>：建立指定 Component 的 Task 單</li>
            <li>⚡ <strong>Custom Pre-spike Task by Component</strong>：建立指定 Component 的 Pre-spike Task 單</li>
            <li>⚡ <strong>Custom Spike Task by Component</strong>：建立指定 Component 的 Spike Task 單</li>
          </Bullets>
        </li>
        <li>彈出介面中勾選要建立的 Components（超出 Epic 範圍的會被忽略）</li>
        <li>確認後系統自動建立對應的單與 subtasks</li>
      </Steps>
      <Callout type="danger">
        每張需求單都必須提供完整的 <strong>SPEC</strong> 與 <strong>A/C（驗收條件）</strong>，這是後續開發與驗證的基準。
      </Callout>
      <Callout type="warning" style={{ marginTop: 8 }}>
        建議透過 Jira Automation 建立對應子單，確保關鍵資訊自動填入，減少人工漏填風險。
      </Callout>
    </>
  ),
}

const dor = {
  id: 'dor',
  title: '需求就緒',
  roles: ['PM', 'RD', 'QA'],
  phases: ['pre-sprint'],
  contexts: ['pm-planning'],
  content: (
    <>
      <p>進入 Sprint 前，需求單必須符合 DoR（Definition of Ready）：</p>
      <Tbl style={{ marginTop: 8 }}>
        <tr><th>類型</th><th>必要條件</th></tr>
        <tr><td>Story / Task</td><td>明確的 SPEC & A/C（驗收條件）、設計連結、相依資訊</td></tr>
        <tr><td>Bug</td><td>重現條件（環境/版本、帳號/權限、資料前置）、截圖/錄影、驗證標準</td></tr>
      </Tbl>
    </>
  ),
}

const estimatedEffort = {
  id: 'estimated-effort',
  title: '需求粗估（Optional）',
  roles: ['PM', 'RD'],
  phases: ['pre-sprint'],
  contexts: ['pm-planning'],
  content: (
    <>
      <Steps>
        <li>PM 提出需要進行粗估的單（Story 或 Epic）</li>
        <li>RD 依已知資訊進行粗估
          <Bullets sub style={{ marginTop: 4 }}>
            <li>信心過低時，主動與 PM 溝通是否先做 Spike</li>
            <li>仍要粗估時，在單上 Comment 備註不確定性</li>
          </Bullets>
        </li>
        <li>將粗估點數填入 Story 或 Epic 的 <code>Estimated Effort</code> 欄位</li>
      </Steps>
      <Callout type="warning">粗估目的是幫助排程與決策，<strong>不代表</strong>實際開發點數。</Callout>
    </>
  ),
}

const sprintPlanning = {
  id: 'sprint-planning',
  title: '規劃 Sprint 需求並排序',
  roles: ['PM'],
  phases: ['pre-sprint'],
  contexts: ['pm-sprint'],
  content: (
    <>
      <Bullets>
        <li>PM <strong>主導</strong>討論預期排入 Sprint 的單與初步優先順序</li>
        <li>包含：客戶需求、OP Issues、Bugs、工程端需求</li>
        <li>依各團隊 Capacity & 預估點數做最終決策</li>
      </Bullets>
      <Callout type="info" style={{ marginTop: 8 }}>
        <strong>Saku 專屬：</strong>需與 PO 確認需求放入哪個大 Sprint（<code>Release Package</code> 欄位），對應 2 個月的交付週期。
      </Callout>
    </>
  ),
}

const specConfirm = {
  id: 'spec-confirm',
  title: 'SPEC & A/C 確認',
  roles: ['RD', 'QA'],
  phases: ['pre-sprint'],
  contexts: ['rd-dev', 'qa-testing'],
  content: (
    <Bullets>
      <li>RD / QA 逐項確認 SPEC 與 A/C</li>
      <li>有不清楚的部分：
        <Bullets sub>
          <li>留言到單上 Comment，Tag PM / QA</li>
          <li>或切換狀態到 <code>Request Info</code>，Assign to PM / 接球的同學</li>
        </Bullets>
      </li>
    </Bullets>
  ),
}

const splitSubtask = {
  id: 'split-subtask',
  title: '拆子單 & 估點',
  roles: ['RD', 'QA'],
  phases: ['pre-sprint'],
  contexts: ['rd-dev'],
  content: (
    <>
      <Tbl>
        <tr><th>母單類型</th><th>預設子單</th></tr>
        <tr><td>Story</td><td>DEV-Task ＋ QA-Task x 2（預設建立）</td></tr>
        <tr><td>Bug</td><td>DEV-Task ＋ QA-Task（預設建立）</td></tr>
        <tr><td>Task</td><td>僅 DEV-Task（有需要再手動加 QA-Task）</td></tr>
      </Tbl>
      <Steps style={{ marginTop: 10 }}>
        <li>母單建立後會自動產生對應的子單，若有缺少或需要進一步拆分任務，請自行手動新增</li>
        <li>單一子單點數不超過 <strong>10 點</strong>，若超過需拆分 (建議)</li>
        <li>所有子單完成估點（<code>Story Points</code>）
          <Bullets sub style={{ marginTop: 4 }}>
            <li>建議採用團隊估點，幫助對齊目標</li>
            <li>最小單位：<strong>0.1</strong></li>
          </Bullets>
        </li>
      </Steps>
    </>
  ),
}

const qaTaskRules = {
  id: 'qa-task-rules',
  title: 'DEV-Task / QA-Task 建立規則',
  roles: ['RD', 'QA'],
  phases: ['pre-sprint'],
  contexts: ['rd-dev', 'qa-testing'],
  content: (
    <>
      <Tbl>
        <tr>
          <th style={{ width: '50%' }}>DEV-Task</th>
          <th style={{ width: '50%' }}>QA-Task（Story 分兩張）</th>
        </tr>
        <tr>
          <td style={{ verticalAlign: 'top' }}>
            <Bullets>
              <li><code>Dev Type</code> 依母單類型自動填入：<code>Dev</code> / <code>OP-Dev</code> / <code>Bug</code> / <code>OP-Bug</code> / <code>Spike</code> / <code>Pre-Spike</code></li>
              <li>Sprint 開始前填入 <strong>Story Points</strong></li>
              <li>完成後填入 <strong>Actual Story Points</strong></li>
            </Bullets>
          </td>
          <td style={{ verticalAlign: 'top' }}>
            <Steps>
              <li><strong>Test Case Creation</strong> RD 開發期間同步建立，填 Story Points & Due Date，完成後填 Actual SP</li>
              <li><strong>Test Execution</strong> 轉 QA Ready 後開始執行，填 Story Points & Due Date，完成後填 Actual SP<br />
                <span style={{ fontSize: 11, color: '#6B778C' }}>（點數基準：35 個 Test Case ≈ 1 人天）</span>
              </li>
            </Steps>
          </td>
        </tr>
      </Tbl>
    </>
  ),
}

// ─────────────────────────── Sprint 中 ───────────────────────────

const startDev = {
  id: 'start-dev',
  title: '開始開發',
  roles: ['RD'],
  phases: ['in-sprint'],
  contexts: ['rd-dev', 'rd-bug'],
  content: (
    <>
      <Steps>
        <li>找到對應的子單（<code>DEV-Task</code>）</li>
        <li>切換 Status → <St type="prog">In Progress</St></li>
      </Steps>
      <p style={{ marginTop: 10 }}><strong>需求不清楚時：</strong></p>
      <Tbl style={{ marginTop: 6 }}>
        <tr><th>情況</th><th>操作</th></tr>
        <tr><td>Story / Task SPEC 不清楚</td><td>留言並切換母單 Status → <code>Request Info</code>，Assign to PM</td></tr>
        <tr><td>Bug SPEC 沒定義清楚</td><td>切換 Bug 單 → <code>Request Info</code>，Assign to PM</td></tr>
        <tr><td>Bug 無法重現</td><td>切換 Bug 單 → <code>Reproduce</code>，Assign to QA</td></tr>
      </Tbl>
    </>
  ),
}

const gitMR = {
  id: 'git-mr',
  title: 'Git MR 自動化流程',
  roles: ['RD'],
  phases: ['in-sprint', 'deploy'],
  section: 'in-sprint',
  contexts: ['rd-dev', 'rd-bug'],
  content: (
    <>
      <p><strong>有進 Code 的 DEV-Task：</strong></p>
      <Tbl style={{ marginTop: 6 }}>
        <tr><th>事件</th><th>操作</th><th>Jira 自動變化</th></tr>
        <tr><td>發 MR</td><td>在 MR 標註 Jira 單號</td><td>DEV-Task → <St type="review">In Review</St></td></tr>
        <tr><td>MR Merged</td><td>—</td><td>DEV-Task → <St type="done">Done</St></td></tr>
        <tr><td>部署至 QA</td><td>Release 操作</td><td>母單 → <St type="ready">QA Ready</St>（自動）</td></tr>
        <tr><td>部署至 PREP</td><td>Release 操作</td><td>母單 → <St type="ready">PREP Ready</St>（自動）</td></tr>
        <tr><td>部署至 PROD</td><td>Release 操作</td><td>母單 → <St type="ready">Prod Ready</St>（自動）</td></tr>
      </Tbl>
      <Callout type="info" style={{ marginTop: 8 }}>
        <strong>無 Code 的 DEV-Task：</strong>所有狀態皆由開發人員<strong>手動</strong>切換。
      </Callout>
    </>
  ),
}

const actualSP = {
  id: 'actual-sp',
  title: '開發完成 — Actual Story Points 回填',
  roles: ['RD'],
  phases: ['in-sprint'],
  contexts: ['rd-dev'],
  content: (
    <>
      <Bullets>
        <li>每張 DEV-Task 完成後，<strong>立即填入</strong> <code>Actual Story Points</code></li>
        <li>有效單（Resolution: Done / Fixed）：如實填入，最小單位 0.1</li>
        <li>無效單（Duplicate / Won't Do…）：可不填，但若有花費時間，建議記錄</li>
      </Bullets>
      <Callout type="danger" style={{ marginTop: 8 }}>
        母單的點數由 Automation 自動匯總，<strong>禁止手動修改母單的 Story Points / Actual Story Points</strong>。
      </Callout>
    </>
  ),
}

const spike = {
  id: 'spike',
  title: 'Spike 研究型任務',
  roles: ['RD', 'PM', 'QA'],
  phases: ['pre-sprint', 'in-sprint'],
  contexts: ['rd-spike', 'pm-planning'],
  content: (
    <Steps>
      <li>
        建立 <strong>Spike 母單（Task 單）</strong>，Summary 加上前綴 <code>[Spike]</code> 或 <code>[Pre-Spike]</code>
        <Bullets sub style={{ marginTop: 4 }}>
          <li>Automation 會自動建立 DEV-Task，並帶入對應的 <code>Dev Type</code></li>
          <li>內容必須包含：<strong>預期的產出是什麼</strong></li>
          <li>若屬於多次討論類型，可註明預期進行方式（場數、Milestone）</li>
        </Bullets>
      </li>
      <li>完成指定研究產出後，將 <strong>DEV-Task</strong> 切換至 <St type="done">Done</St>，母單狀態自動切換至 <St type="review">In Review</St></li>
      <li>在母單 Comment 中 Tag 負責 Review 產出的人</li>
      <li>負責人 Review 確認無誤後，手動將母單切換至 <St type="done">Done</St></li>
    </Steps>
  ),
}

const bugCreate = {
  id: 'bug-create',
  title: 'Bug 開單規範',
  roles: ['QA'],
  phases: ['deploy'],
  contexts: ['qa-bug'],
  content: (
    <>
      <p><strong>Description 格式（必填）：</strong></p>
      <Bullets style={{ marginTop: 6 }}>
        <li><strong>Env</strong>：發生的環境</li>
        <li><strong>Pre-condition</strong>：前置條件（帳號/權限/資料）</li>
        <li><strong>Steps to Reproduce</strong>：重現步驟</li>
        <li><strong>Actual Result</strong>：實際結果</li>
        <li><strong>Expected Result</strong>：預期結果</li>
      </Bullets>
      <p style={{ marginTop: 10 }}><strong>其他必填欄位：</strong></p>
      <Bullets style={{ marginTop: 4 }}>
        <li><code>Defect Type</code>：Feature Bug（此次造成）/ Known Issue（舊問題）</li>
        <li>Label、Release Package、Components、Assignee</li>
        <li>Link 相關的 Story 或 Task</li>
      </Bullets>
    </>
  ),
}

const bugFix = {
  id: 'bug-fix',
  title: 'Bug 修復流程',
  roles: ['RD'],
  phases: ['in-sprint'],
  contexts: ['rd-bug'],
  content: (
    <>
      <Steps>
        <li>在 MR 上標註對應的 <code>DEV-Task</code> 單號（Git 自動更新狀態）</li>
        <li>在 <strong>Bug 母單</strong>填上：
          <Bullets sub style={{ marginTop: 4 }}>
            <li><code>Root Cause</code>：問題發生原因</li>
            <li><code>Solution</code>：採取的解法摘要</li>
            <li><code>Defect Cause</code>：問題原因分類</li>
          </Bullets>
        </li>
        <li>DEV-Task 填上 <code>Actual Story Points</code></li>
      </Steps>
      <Callout type="warning" style={{ marginTop: 8 }}>
        Root Cause & Solution 未填時，即使子單都 Done，母單狀態不會自動切換到 Dev Ready。<br />
        兩個值都填入後，Automation 才會自動推進。
      </Callout>
    </>
  ),
}

const bugSpecialCase = {
  id: 'bug-special',
  title: 'Bug 特殊情況處理',
  roles: ['RD', 'QA'],
  phases: ['in-sprint'],
  contexts: ['rd-bug', 'qa-bug'],
  content: (
    <Tbl>
      <tr><th>情況</th><th>操作</th></tr>
      <tr><td>Bug 無法重現</td><td>Status → <code>Reproduce</code>，Assign 回 QA，comment Tag QA</td></tr>
      <tr><td>SPEC 遺漏</td><td>Status → <code>Request Info</code>，Assign 給 PM，comment Tag PM</td></tr>
      <tr><td>已在其他單中修復</td><td>Link → 選 <code>is fixed by</code>，填入修復的 Bug 單號</td></tr>
      <tr><td>Bug 被 ReOpen</td><td>使用新的 DEV-Task 來進行修復</td></tr>
    </Tbl>
  ),
}

const sprintInsert = {
  id: 'sprint-insert',
  title: '插單（Sprint 中加入新需求）',
  roles: ['PM', 'RD'],
  phases: ['in-sprint'],
  contexts: ['pm-sprint', 'rd-dev'],
  content: (
    <>
      <Callout type="warning">
        PM 有緊急需求或 Bug 需插入當前 Sprint 時，須先於 <strong>Slack 或 Daily</strong> 主動告知 RD 團隊。
      </Callout>
      <p style={{ marginTop: 8 }}>RD 團隊依以下順序處理：</p>
      <Steps style={{ marginTop: 6 }}>
        <li>內部討論，評估插單的 Resource 是否可行</li>
        <li>若 Resource 不足，告知 PM 現況，討論是否將部分現有 Sprint 單移出到下個 Sprint</li>
        <li>若無法進行調整，向主管反映，協調開發資源、安排加班支援或與客戶溝通</li>
      </Steps>
    </>
  ),
}

const abnormalClose = {
  id: 'abnormal-close',
  title: '異常結束處理（無效單）',
  roles: ['PM', 'RD', 'QA'],
  phases: ['in-sprint'],
  contexts: 'all',
  content: (
    <>
      <Steps>
        <li>將母單 Status 切換至 <St type="done">Done</St></li>
        <li>在 <code>Resolution</code> 欄位選擇對應的異常原因：
          <code>Duplicate</code>、<code>Won't Do</code>、<code>Not a Bug</code>…
        </li>
      </Steps>
      <Callout type="info">
        Resolution 欄位在 Status 切至 Done <strong>之後</strong>才會出現。
      </Callout>
    </>
  ),
}

// ─────────────────────────── Sprint 結束 ───────────────────────────

const devTaskCarryover = {
  id: 'dev-task-carryover',
  title: '需求跨 Sprint 處理',
  roles: ['PM', 'RD', 'QA'],
  phases: ['end-sprint'],
  contexts: 'all',
  content: (
    <>
      <p>以<strong>母單（Story / Task / Bug）</strong>為基準，判斷跨 Sprint 的處理方式：</p>
      <Steps style={{ marginTop: 8 }}>
        <li>
          <strong>完全未開始</strong>：直接將母單移至下個 Sprint
        </li>
        <li>
          <strong>已在進行中</strong>：母單留在當前 Sprint 繼續執行
          <Bullets sub style={{ marginTop: 4 }}>
            <li>將當前的 Dev-Task 所花費的<strong>點數與進度紀錄</strong>並結束這張單，開新的 Dev-Task，提供給下個 Sprint 使用</li>
          </Bullets>
        </li>
      </Steps>
      <Callout type="warning" style={{ marginTop: 8 }}>
        母單<strong>不存在部分完成</strong>。雖然一張母單下可以自由拆成多張 DEV-Task 進行任務切割，但母單本身需顧及功能完整性，只有「全部完成」或「尚未完成」兩種狀態。
      </Callout>
    </>
  ),
}

const requiredFieldsCheck = {
  id: 'required-fields-check',
  title: '必填欄位檢核',
  roles: ['PM', 'RD', 'QA'],
  phases: ['end-sprint'],
  contexts: 'all',
  content: (
    <>
      <p>將不合規的單列出，請同學儘速補齊必要資訊：</p>
      <Tbl style={{ marginTop: 8 }}>
        <thead>
          <tr><th>類型</th><th>必填欄位</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>DEV-Task / QA-Task</td>
            <td>
              <Bullets>
                <li>Story Points</li>
                <li>Actual Story Points</li>
              </Bullets>
            </td>
          </tr>
          <tr>
            <td>Bug</td>
            <td>
              <Bullets>
                <li>Defect Cause</li>
              </Bullets>
            </td>
          </tr>
        </tbody>
      </Tbl>
    </>
  ),
}

const sprintCoexist = {
  id: 'sprint-coexist',
  title: 'Sprint 並存說明',
  roles: ['PM', 'RD', 'QA'],
  phases: ['end-sprint'],
  contexts: 'all',
  content: (
    <Bullets>
      <li>從開發到環境部署、QA 驗證是<strong>完整的開發 Cycle</strong>，需求（Story / Bug）橫跨多個 Sprint 是正常流程，不是例外</li>
      <li>Sprint <strong>不在到期時強制關閉</strong>，等到所有需求都 Done 才 Complete</li>
      <li>Scrum Board 上同時存在<strong>多個 Sprint 是正常現象</strong>，不是異常</li>
    </Bullets>
  ),
}

// ─────────────────────────── 功能部署與驗證 ───────────────────────────

const qaVerify = {
  id: 'qa-verify',
  title: 'QA 驗證流程',
  roles: ['QA'],
  phases: ['deploy'],
  contexts: ['qa-testing', 'qa-bug'],
  content: (
    <>
      <Steps>
        <li>程式碼部署至 QA 環境 → 母單自動切換至 <St type="ready">QA Ready</St></li>
        <li>執行 QA-Task（Test Execution），開始在 QA 環境驗證</li>
        <li>驗證通過 → 手動切換母單至 <St type="verify">QA Verified</St></li>
        <li>程式碼部署至 PREP 環境 → 母單自動切換至 <St type="ready">PREP Ready</St></li>
        <li>驗證通過 → 手動切換至 <St type="verify">PREP Verified</St></li>
        <li>程式碼部署至 PROD 環境 → 母單自動切換至 <St type="ready">Prod Ready</St></li>
        <li>驗證通過 → 手動切換至 <St type="done">Done</St></li>
      </Steps>
      <Callout type="info" style={{ marginTop: 8 }}>
        QA-Task 的狀態<strong>不影響</strong>母單推進，母單狀態只跟著 DEV-Task 走。
      </Callout>
    </>
  ),
}

const verifyFoundBug = {
  id: 'verify-found-bug',
  title: '驗證過程發現 Bug',
  roles: ['QA'],
  phases: ['deploy'],
  contexts: ['qa-bug', 'qa-testing'],
  content: (
    <>
      <Steps>
        <li>開一張 <strong>Bug 單</strong></li>
        <li>填寫完整 Description（Env / Pre-condition / Steps / Actual Result / Expected Result）</li>
        <li>設定 Label、Release Package、Components、Assignee、<strong>Defect Type</strong></li>
        <li>若問題未涵蓋於 Spec 或 A/C，視情況優先將 Bug 單 Assign 給 PM 補充定義</li>
        <li>若對應功能需求有 Epic，設 <strong>Parent 為該 Epic 單</strong></li>
      </Steps>
      <Callout type="info" style={{ marginTop: 8 }}>
        Bug 單建立後，系統會自動建立 <strong>DEV-Task & QA-Task</strong> 各一張
      </Callout>
    </>
  ),
}

const bugReopen = {
  id: 'bug-reopen',
  title: 'Bug ReOpen 處理',
  roles: ['QA', 'RD'],
  phases: ['in-sprint', 'deploy'],
  contexts: ['qa-bug', 'rd-bug'],
  content: (
    <>
      <p>RD 修復後 QA 驗證，發現問題仍存在：</p>
      <Steps style={{ marginTop: 8 }}>
        <li>QA 將 Bug 單狀態切換至 <St type="prog">In Progress</St></li>
        <li>自動建立新的 <strong>DEV-Task</strong> 繼續修復，同時建立對應的 <strong>QA-Task</strong> 作為後續驗證紀錄</li>
        <li><code>Reopened Count</code> 欄位自動累加計數</li>
      </Steps>
    </>
  ),
}

const helpFixBug = {
  id: 'help-fix-bug',
  title: '協助夥伴修復 Feature Bug',
  roles: ['RD'],
  phases: ['in-sprint'],
  contexts: ['rd-bug'],
  content: (
    <>
      <p>當 Feature Bug 由<strong>其他 RD 協助修復</strong>時，需明確區分「Bug 歸屬」與「執行歸屬」：</p>
      <Tbl style={{ marginTop: 8 }}>
        <tr><th>單據</th><th>Assignee</th><th>代表意義</th></tr>
        <tr>
          <td><strong>Bug 單（母單）</strong></td>
          <td>原始開發者</td>
          <td>此 Bug 由誰的開發造成</td>
        </tr>
        <tr>
          <td><strong>DEV-Task（子單）</strong></td>
          <td>協助修復者</td>
          <td>實際執行修復的人</td>
        </tr>
      </Tbl>
      <Callout type="warning" style={{ marginTop: 8 }}>
        系統會分析每位 RD 的「功能開發點數 vs Bug 點數」比例作為開發品質指標。<br />
        Bug 母單 Assignee 決定 Bug 歸屬於誰，若填錯會影響協助者的品質數據。
      </Callout>
    </>
  ),
}

const specChange = {
  id: 'spec-change',
  title: 'SPEC Change 處理',
  roles: ['RD', 'PM'],
  phases: ['deploy'],
  section: 'deploy',
  contexts: ['rd-dev', 'pm-sprint'],
  content: (
    <>
      <p>當母單已進入 Deploy 階段（QA Ready、PREP Ready…）後因 SPEC 變更需加開 DEV-Task：</p>
      <Bullets style={{ marginTop: 8 }}>
        <li>系統自動加上 <code>SpecChange</code> Label 提醒</li>
        <li>母單狀態被拉回 <St type="prog">In Progress</St>（Jira 與 Git 進度不同步為正常現象）</li>
      </Bullets>
      <Tbl style={{ marginTop: 10 }}>
        <tr><th>情況</th><th>處理方式</th></tr>
        <tr><td>能在 Release to PREP 前完成</td><td>正常流程開發，完成後重新送測，不影響 Release</td></tr>
        <tr><td>來不及完成</td><td>需將已 merge 的半成品程式碼撤回，避免帶出未完成邏輯</td></tr>
      </Tbl>
    </>
  ),
}

// ─────────────────────────── 匯出 ───────────────────────────

export const CARDS = [
  projectInfo,
  taskHierarchy,
  pointsRules,
  storyVsTask,
  childStatus,
  parentStatus,
  securityLevel,
  ticketCreation,
  spike,
  dor,
  estimatedEffort,
  sprintPlanning,
  specConfirm,
  splitSubtask,
  qaTaskRules,
  startDev,
  gitMR,
  actualSP,
  bugCreate,
  bugFix,
  bugSpecialCase,
  sprintInsert,
  abnormalClose,
  devTaskCarryover,
  sprintCoexist,
  requiredFieldsCheck,
  qaVerify,
  verifyFoundBug,
  bugReopen,
  helpFixBug,
  specChange,
]
