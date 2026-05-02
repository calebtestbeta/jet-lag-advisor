## 1. 建立 JS Token 注入函式

- [x] 1.1 在 Vue `setup()` 中，於所有 `ref` 宣告之後、`return` 之前，新增 `applyThemeTokens(dark)` 函式，接受布林值，在 `document.getElementById('app').style` 上 `setProperty` 以下 token：
  - `--glass-surface`：dark=`rgba(22,24,38,0.85)` / light=`rgba(255,255,255,0.90)`
  - `--glass-surface-thin`：dark=`rgba(22,24,38,0.70)` / light=`rgba(255,255,255,0.72)`
  - `--glass-border`：dark=`rgba(255,255,255,0.12)` / light=`rgba(0,0,0,0.08)`
  - `--glass-border-top`：dark=`rgba(255,255,255,0.20)` / light=`rgba(255,255,255,0.95)`
  - `--glass-shadow`：dark=`rgba(0,0,0,0.40)` / light=`rgba(0,0,0,0.08)`
  - `--glass-shadow-deep`：dark=`rgba(0,0,0,0.65)` / light=`rgba(0,0,0,0.18)`
  - `--glass-shimmer`：dark=`rgba(255,255,255,0.16)` / light=`rgba(255,255,255,0.22)`
  - `--glass-tint-a`：dark=`rgba(139,92,246,0.12)` / light=`rgba(99,102,241,0.05)`
  - `--glass-tint-b`：dark=`rgba(216,180,254,0.06)` / light=`rgba(244,114,182,0.03)`
  - `--glass-text-primary`：dark=`rgba(255,255,255,0.95)` / light=`rgba(15,23,42,0.90)`
  - `--glass-text-secondary`：dark=`rgba(255,255,255,0.70)` / light=`rgba(15,23,42,0.60)`
  - `--glass-text-tertiary`：dark=`rgba(255,255,255,0.45)` / light=`rgba(15,23,42,0.40)`
- [x] 1.2 使用 `watchEffect(() => { applyThemeTokens(isDark.value) })` 確保首次執行為同步，並在 `isDark` 每次變化時自動觸發

## 2. 清除 CSS Token 定義

- [x] 2.1 從 `.theme-day` selector 中移除所有 `--glass-surface`、`--glass-surface-thin`、`--glass-border`、`--glass-border-top`、`--glass-shadow`、`--glass-shadow-deep`、`--glass-shimmer`、`--glass-tint-a`、`--glass-tint-b`、`--glass-text-primary`、`--glass-text-secondary`、`--glass-text-tertiary` 定義，僅保留 `color-scheme: light`
- [x] 2.2 從 `.theme-night` selector 中移除相同 token 定義，僅保留 `color-scheme: dark`
- [x] 2.3 全文搜尋確認 `--glass-surface` 不再出現在任何 CSS rule 的宣告側（`:` 左側），只剩 `var(--glass-surface)` 的使用側（`:root` fallback 除外）

## 3. 驗證 CSS 保留部分完整

- [x] 3.1 確認 `.lg-glass` 規則仍使用 `background: var(--glass-surface)` 且包含 `transition: ... background 0.8s ease ...`
- [x] 3.2 確認 `.lg-glass::before` 和 `::after` 使用 `var(--glass-shimmer)` 和 `var(--glass-tint-*)` 不變
- [x] 3.3 確認 `@media (prefers-reduced-transparency: reduce)` 中的 `.theme-night .lg-glass` 和 `.theme-day .lg-glass` selector 仍存在（作為 inline style 的備援強化，這裡可保留或移除均可，但確認存在不影響功能）

## 4. SW 版本更新

- [x] 4.1 將 `sw.js` 的 `CACHE_VERSION` 從 `v2.7.0` 升至 `v2.8.0`

## 5. 測試驗證

- [x] 5.1 執行 `npx cypress run` 確認 `glass-card-transition.cy.js` 全部測試通過（R channel 閾值：日間 > 200，夜間 < 60）
- [x] 5.2 確認 Cypress 測試中「背景色 R channel」驗證邏輯在 inline style token 架構下仍能正確讀取 computed backgroundColor
