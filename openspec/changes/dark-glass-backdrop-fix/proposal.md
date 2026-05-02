## Why

Safari/WebKit 的 `backdrop-filter` 會在 GPU 合成層快取背後的畫面內容。切換到深色主題時，卡片的 `background` CSS 雖然正確更新（`rgba(30,30,40,0.72)`），但 `backdrop-filter` 仍使用舊的淡色快取畫面，導致玻璃卡片視覺上呈現灰色而非深色。現有 Cypress 測試只驗證 `getComputedStyle().backgroundColor`（CSS 宣告值），無法偵測到這個視覺層的問題。

## What Changes

- CSS：`.theme-dark .lg-glass` 加入 `backdrop-filter: none; -webkit-backdrop-filter: none;` 禁用深色模式的模糊效果，消除快取問題
- Cypress：新增測試驗證深色模式下 `.lg-glass` 的 `backdropFilter` 為 `none`，以及淺色模式下有 blur 值

## Capabilities

### New Capabilities
<!-- 無 -->

### Modified Capabilities
- `glass-theme-rendering`：補充深色模式 Glass 卡片的 `backdrop-filter` 行為規格，並新增可驗證的 Cypress 測試場景

## Impact

- `index.html`：CSS `.theme-dark .lg-glass` 規則（約第 80 行）
- `cypress/e2e/glass-card-transition.cy.js`：新增 backdrop-filter 驗證測試
