## Why

CSS class-based 主題切換在 Safari iOS 上持續失效：即使 `#app` 已套用正確的 `theme-night` class，`.lg-glass` 卡片背景仍顯示灰白色。根本原因是 Safari GPU 合成層快取、`prefers-color-scheme` 媒體查詢干擾、Tailwind CDN 特異性衝突等多重因素造成 CSS cascade 無法可靠覆寫，兩天內所有修復嘗試均無效。改用 JavaScript 直接設定 inline CSS custom properties，完全繞開 CSS cascade 問題，是唯一能確保跨裝置、跨瀏覽器可靠的方案。

## What Changes

- **移除** CSS class `theme-day` / `theme-night` 的 `--glass-*` token 定義（CSS 版主題切換）
- **新增** Vue `watch(isDark)` → `document.getElementById('app').style.setProperty('--glass-surface', ...)` JavaScript 驅動的 token 注入機制
- **保留** `.lg-glass` 使用 `var(--glass-*)` 的寫法不變（僅改變 token 的設定來源）
- **保留** `theme-day` / `theme-night` class（保留 `color-scheme` 宣告與其他非顏色 token）
- **BREAKING** 移除所有依賴 `.theme-day`/`.theme-night` selector 的 `--glass-surface`、`--glass-border`、`--glass-shadow`、`--glass-shimmer`、`--glass-tint-*` token 定義，改由 JS 控制

## Capabilities

### New Capabilities

- `js-driven-theming`: JavaScript 驅動的 CSS token 注入系統，確保主題切換在所有瀏覽器（包含 Safari iOS）上可靠執行

### Modified Capabilities

- `glass-theme-rendering`: 主題偵測與渲染機制從 CSS class 繼承改為 JS inline style 注入，解決 Safari 上的可靠性問題

## Impact

- `index.html`（唯一修改檔案）：移除 `.theme-day` / `.theme-night` CSS token 定義區塊，新增 Vue `watchEffect` / `watch` 邏輯
- Cypress 測試：`glass-card-transition.cy.js` 驗證邏輯不變（仍驗證 R channel 閾值），無需修改
- Service Worker：需 bump `CACHE_VERSION` 讓客戶端取得新版 `index.html`
