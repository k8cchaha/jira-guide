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

// ─────────────────────────── 基礎概念 ───────────────────────────

const projectInfo = {
  id: 'project-info',
  title: '專案資訊',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
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
        <tr><td><strong>目的</strong></td><td>早期決策依據</td><td>Sprint 評估範圍</td><td>紀錄實際花費</td></tr>
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
  title: '子票狀態切換',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
  content: (
    <>
      <Callout type="info">
        子票（DEV-Task / QA-Task）的狀態切換視有無 <strong>GitLab MR 連動</strong>而不同。
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
  title: '母票狀態切換',
  roles: ['PM', 'RD', 'QA'],
  phases: ['foundation'],
  contexts: 'all',
  content: (
    <>
      <Callout type="info">
        母票狀態由 Jira Automation 根據子票狀態自動推進，
        僅在<strong>驗證環節</strong>需手動切換。
      </Callout>

      <p style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: '#172B4D' }}>Story / Bug</p>
      <Tbl style={{ marginTop: 4 }}>
        <tr><th style={{ width: '42%' }}>狀態切換</th><th style={{ width: '20%' }}>方式</th><th>觸發條件</th></tr>
        <tr>
          <td><St type="open">Open</St> → <St type="prog">In Progress</St></td>
          <td>⚡ 自動</td>
          <td>任一子票進入 In Progress</td>
        </tr>
        <tr>
          <td><St type="prog">In Progress</St> → <St type="devready">Dev Ready</St></td>
          <td>⚡ 自動</td>
          <td>所有子票 Done</td>
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
          <td>任一子票進入 In Progress</td>
        </tr>
        <tr>
          <td><St type="prog">In Progress</St> → <St type="review">In Review</St></td>
          <td>⚡ 自動</td>
          <td>所有子票 Done</td>
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

// ─────────────────────────── Sprint 規劃前 ───────────────────────────

const dor = {
  id: 'dor',
  title: '需求就緒',
  roles: ['PM', 'RD', 'QA'],
  phases: ['pre-sprint'],
  contexts: 'all',
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
      <Callout type="info">粗估目的是幫助排程與決策，<strong>不代表</strong>實際開發點數。</Callout>
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
      <Steps>
        <li>母單下會建立 DEV-Task 與 QA-Task，若發現有缺少或想進行任務拆分請自行添加</li>
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
  title: 'QA-Task 建立規則',
  roles: ['RD', 'QA'],
  phases: ['pre-sprint'],
  contexts: ['rd-dev', 'qa-testing'],
  content: (
    <>
      <Tbl>
        <tr><th>母單類型</th><th>預設子單</th></tr>
        <tr><td>Story</td><td>DEV-Task ＋ QA-Task（預設建立）</td></tr>
        <tr><td>Bug</td><td>DEV-Task ＋ QA-Task（預設建立）</td></tr>
        <tr><td>Task</td><td>僅 DEV-Task（有需要再手動加 QA-Task）</td></tr>
      </Tbl>
      <p style={{ marginTop: 10, fontSize: 12, color: '#42526E' }}><strong>Story 的 QA-Task 分兩張：</strong></p>
      <Steps style={{ marginTop: 4 }}>
        <li><strong>Test Case Creation</strong>：RD 開發期間同步建立，填 Story Points & Due Date，完成後填 Actual SP</li>
        <li><strong>Test Execution</strong>：轉 QA Ready 後開始執行，填 Story Points & Due Date，完成後填 Actual SP<br />
          <span style={{ fontSize: 11, color: '#6B778C' }}>（點數基準：35 個 Test Case ≈ 1 人天）</span>
        </li>
      </Steps>
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
  phases: ['in-sprint'],
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
        <li>無效單（Duplicate / Won't Do…）：可不填，但有花費時間建議記錄</li>
      </Bullets>
      <Callout type="danger" style={{ marginTop: 8 }}>
        母單的點數由 Automation 自動匯總，<strong>禁止手動修改母單的 Story Points / Actual Story Points</strong>。
      </Callout>
    </>
  ),
}

const spike = {
  id: 'spike',
  title: 'Spike 研究任務',
  roles: ['RD', 'PM'],
  phases: ['pre-sprint', 'in-sprint'],
  section: 'in-sprint',
  contexts: ['rd-spike', 'pm-planning'],
  content: (
    <Bullets>
      <li>Spike 工作使用 <strong>DEV-Task</strong> 記錄，<code>Dev Type</code> 由 Automation 自動填為 <code>Spike</code> 或 <code>Pre-Spike</code></li>
      <li>建立時內容必須包含：<strong>預期的產出是什麼</strong></li>
      <li>若屬於多次討論類型，可註明預期進行方式（場數、Milestone）</li>
      <li>Spike 完成後填入 Actual Story Points</li>
    </Bullets>
  ),
}

const bugCreate = {
  id: 'bug-create',
  title: 'Bug 開單規範',
  roles: ['QA'],
  phases: ['in-sprint', 'deploy'],
  section: 'in-sprint',
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
        <li>Label、Release Package、Platform、Assignee</li>
        <li>Link 相關的 Story 或 Task</li>
      </Bullets>
      <Callout type="warning" style={{ marginTop: 8 }}>
        <strong>不要</strong>把 Bug 的 Parent 設為相關 Epic，會影響 Epic 完成度計算。
      </Callout>
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
      <tr><td>Bug 被 ReOpen</td><td>建立新的 DEV-Task 來進行修復</td></tr>
    </Tbl>
  ),
}

const abnormalClose = {
  id: 'abnormal-close',
  title: '異常結束處理（無效單）',
  roles: ['PM', 'RD', 'QA'],
  phases: ['in-sprint', 'end-sprint', 'deploy'],
  section: 'in-sprint',
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
  title: 'DEV-Task 跨 Sprint 處理',
  roles: ['RD'],
  phases: ['end-sprint'],
  contexts: ['rd-dev'],
  content: (
    <>
      <p>若 DEV-Task 在該 Sprint 只完成部分，且已花費超過 1 個 Story Point：</p>
      <Steps style={{ marginTop: 8 }}>
        <li>在 Parent 單下建立<strong>新的 DEV-Task</strong>（下個 Sprint 繼續）</li>
        <li>調整<strong>原 DEV-Task</strong>：
          <Bullets sub style={{ marginTop: 4 }}>
            <li>補上描述：時間花在哪些內容</li>
            <li>Story Points & Actual Story Points → 已花費點數</li>
            <li>Status → <St type="done">Done</St></li>
          </Bullets>
        </li>
        <li>填入新 DEV-Task 的 Story Points（下個 Sprint 的估點）</li>
      </Steps>
    </>
  ),
}

const sprintCoexist = {
  id: 'sprint-coexist',
  title: 'Sprint 並存說明',
  roles: ['PM', 'RD', 'QA'],
  phases: ['end-sprint', 'deploy'],
  section: 'end-sprint',
  contexts: 'all',
  content: (
    <Bullets>
      <li>部分需求（Story / Bug）需要完整的環境驗證，時間會超出 2 週的 Sprint 週期</li>
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

const uatBug = {
  id: 'uat-bug',
  title: 'UAT 客戶 Bug 處理',
  roles: ['QA'],
  phases: ['deploy'],
  contexts: ['qa-bug'],
  content: (
    <Steps>
      <li>在 Bug 單下建立一張 <strong>QA-Task for Reproduce</strong></li>
      <li>先在 QA 環境確認是否能復現相同的 Bug</li>
      <li>確認可重現後，RD 建立 DEV-Task 進行修復</li>
    </Steps>
  ),
}

const specChange = {
  id: 'spec-change',
  title: 'SPEC Change 處理',
  roles: ['RD', 'PM'],
  phases: ['in-sprint', 'deploy'],
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
  dor,
  estimatedEffort,
  sprintPlanning,
  specConfirm,
  splitSubtask,
  qaTaskRules,
  startDev,
  gitMR,
  actualSP,
  spike,
  bugCreate,
  bugFix,
  bugSpecialCase,
  abnormalClose,
  devTaskCarryover,
  sprintCoexist,
  qaVerify,
  uatBug,
  specChange,
]
