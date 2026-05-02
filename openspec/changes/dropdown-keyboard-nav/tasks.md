## 1. Vue data 新增高亮 index

- [x] 1.1 在 `data()` 新增 `originHighlight: -1` 和 `destHighlight: -1` 兩個變數

## 2. 出發地搜尋框鍵盤支援

- [x] 2.1 在出發地 `<input>` 新增 `@keydown="onOriginKeydown"` 事件
- [x] 2.2 實作 `onOriginKeydown(e)` method：↓ 高亮下移、↑ 高亮上移、Enter 選取、Escape 關閉；同時防止 ↑/↓ 捲動頁面（`e.preventDefault()`）
- [x] 2.3 修改 `onOriginSearch` handler，在輸入新字元時重置 `originHighlight = -1`
- [x] 2.4 出發地下拉列表 `v-for` 項目加入高亮 class 綁定：`:class="['px-4 py-3 cursor-pointer dropdown-item', index === originHighlight ? (isDark ? 'bg-white/10' : 'bg-indigo-500/10') : '']"`
- [x] 2.5 出發地下拉容器加入 `ref="originList"`，用於 `scrollIntoView` 捲動
- [x] 2.6 `onOriginKeydown` 在高亮改變後呼叫 `nextTick`，對高亮 DOM 節點執行 `scrollIntoView({ block: 'nearest' })`

## 3. 目的地搜尋框鍵盤支援

- [x] 3.1 在目的地 `<input>` 新增 `@keydown="onDestKeydown"` 事件
- [x] 3.2 實作 `onDestKeydown(e)` method（同出發地邏輯，操作 `destHighlight` 和 `destResults`）
- [x] 3.3 修改 `onDestSearch` handler，在輸入新字元時重置 `destHighlight = -1`
- [x] 3.4 目的地下拉列表 `v-for` 項目加入高亮 class 綁定（同出發地）
- [x] 3.5 目的地下拉容器加入 `ref="destList"`，並在 `onDestKeydown` 中執行 `scrollIntoView`

## 4. 收尾

- [x] 4.1 確認 `hideDrop` 關閉選單時同時重置兩個 highlight index 為 -1
