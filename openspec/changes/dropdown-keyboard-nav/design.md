## Context

目前出發地 / 目的地搜尋框的下拉選單使用 `@mousedown.prevent` 選取項目，完全依賴滑鼠操作。桌機使用者輸入搜尋字詞後仍需拿起滑鼠點選，打斷鍵盤操作流程。Vue 3 CDN 單頁應用，無 build step，所有邏輯在 `index.html` 內完成。

## Goals / Non-Goals

**Goals:**
- 出發地 / 目的地兩個搜尋框均支援 ↑/↓/Enter/Escape 鍵盤操作
- 高亮項目超出可視區時自動捲動到視窗內
- 視覺上高亮項目與 hover 有相同或更明顯的樣式

**Non-Goals:**
- 不支援 Tab 鍵在下拉選單內循環（Tab 維持原生焦點跳轉行為）
- 不改變觸控裝置行為
- 不引入外部套件

## Decisions

**決策 1：高亮 index 用 Vue data 管理，每個搜尋框各自獨立**
- `originHighlight: -1` / `destHighlight: -1`（-1 代表無高亮）
- 輸入新字元時重置為 -1
- 替代方案：用 CSS `:focus-within` — 無法細粒度控制，放棄

**決策 2：高亮樣式用 `:class` 動態綁定，複用既有 `dropdown-item` hover 色**
- `:class="{ 'bg-indigo-500/10 dark:bg-white/10': index === originHighlight }"` 同 hover 顏色
- 不新增 CSS class，直接內聯 Tailwind utility

**決策 3：Enter 鍵選取時直接呼叫現有 `selectOrigin(r)` / `selectDest(r)`**
- 這兩個 method 已處理設值 + 關閉下拉，直接複用即可

**決策 4：`scrollIntoView({ block: 'nearest' })` 搭配 `$refs` 或 `:ref` 動態陣列**
- 用 `:ref="el => setOriginItemRef(el, index)"` 儲存 DOM 節點陣列，高亮改變後呼叫 `nextTick` 捲動
- 替代方案：計算 `scrollTop` 手動設定 — 複雜度高，放棄

## Risks / Trade-offs

- `@blur` 關閉下拉的時機早於 `@keydown`，若 blur 先觸發，Enter 選取可能失效 → 現有實作已用 `hideDrop` + `setTimeout(100)` 延遲關閉，KeyDown 在此窗口內仍可正常觸發，無需額外處理
- `:ref` 動態陣列需在每次 render 前清空，否則舊 ref 殘留 → 在 `v-for` 外層的 `onBeforeUpdate` 鉤子清空陣列
