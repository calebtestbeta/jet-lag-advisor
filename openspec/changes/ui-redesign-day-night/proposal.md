## Why

卡片深色模式問題經過多次修復（CSS cascade、color-scheme、backdrop-filter 快取）均無法根治，根本原因在於 `backdrop-filter` 在 Safari 的 GPU compositing layer 快取機制無法可靠排除。趁此機會全面重新設計 UI，以 Apple Liquid Glass 風格為基礎，完全移除 `backdrop-filter`，改用不透明半透明背景，同時統一日/夜模式切換邏輯——只依據目的地當地時間判斷，不依賴系統 dark mode。

## What Changes

- **BREAKING** 移除所有 `backdrop-filter`／`-webkit-backdrop-filter` CSS（根治 Safari GPU 合成層問題）
- 重新設計全套 Design Token（`--glass-*`）：日間模式白色半透明卡片、夜間模式深色半透明卡片，兩套各自完整獨立
- 主題切換完全依賴 `isDark`（由目的地 `timeSegment` 計算），徹底移除對 `prefers-color-scheme` 的任何隱性依賴
- 重新設計背景漸層：`bg-sleep`、`bg-dusk`（深色）、`bg-awake`、`bg-dawn`（淺色）
- 卡片、按鈕、輸入框、下拉選單全面採用新 token，確保日/夜外觀正確
- 更新 `color-scheme` 宣告：`#app.theme-dark` 設 `dark`，`#app.theme-light` 設 `light`，`:root` 設 `light`（避免層疊衝突）

## Capabilities

### New Capabilities

- `day-night-glass-theme`: 以目的地日/夜時段為唯一主題依據的 Liquid Glass UI 設計系統；包含 Design Token、背景漸層、卡片/按鈕/輸入框樣式，完全不使用 `backdrop-filter`

### Modified Capabilities

- `glass-theme-rendering`: 主題渲染需求更新——移除 `backdrop-filter`，改為純半透明背景；日間模式改用淺色 token，夜間模式改用深色 token

## Impact

- `index.html`：CSS Design Token、所有 `.lg-glass`／`.lg-btn`／`.lg-input`／`.lg-icon-btn` 樣式全面改寫
- `sw.js`：版本號升級以清除舊快取
- Cypress 測試：`glass-card-transition.cy.js` 更新驗證邏輯（已無 backdrop-filter）
