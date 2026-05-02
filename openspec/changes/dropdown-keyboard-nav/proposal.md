## Why

桌機使用者在搜尋機場時，只能用滑鼠點選下拉結果，無法用鍵盤方向鍵導覽並按 Enter 確認，操作效率低且不符合桌機 UX 慣例。

## What Changes

- 出發地搜尋輸入框加入鍵盤事件處理：↑/↓ 移動高亮項目，Enter 選取，Escape 關閉下拉選單
- 目的地搜尋輸入框同上
- 下拉選單高亮項目有視覺樣式（區別於 hover 的靜態 CSS）
- 高亮項目超出可視區時自動捲動（`scrollIntoView`）

## Capabilities

### New Capabilities

- `dropdown-keyboard-nav`: 機場搜尋下拉選單的鍵盤導覽行為（方向鍵、Enter、Escape）

### Modified Capabilities

（無，現有 dropdown-stacking-fix spec 只涵蓋 z-index 行為，不涉及互動行為）

## Impact

- 僅修改 `index.html`：兩個 `<input>` 新增 `@keydown` handler，`<div v-for>` 加入高亮 class 綁定，Vue data 新增 `originHighlight` / `destHighlight` 兩個 index 變數
- 不影響資料結構、localStorage、PWA manifest 或 sw.js
