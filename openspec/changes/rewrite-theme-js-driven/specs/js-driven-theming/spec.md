## ADDED Requirements

### Requirement: JS token 注入在首次渲染前完成
系統 SHALL 在 Vue 掛載（mount）之前，透過 JavaScript 在 `#app` 元素的 inline style 上設定完整的 `--glass-*` CSS custom property 集合，確保首次 paint 即反映正確主題。

#### Scenario: 頁面初次載入，目的地為夜間
- **WHEN** 使用者載入 App，localStorage 已儲存夜間目的地時區，`isDark` 計算為 `true`
- **THEN** 頁面首次渲染時，所有 `.lg-glass` 元素的 `--glass-surface` 已為深色值（R < 60），不出現白色閃爍（FOUC）

#### Scenario: 頁面初次載入，目的地為日間
- **WHEN** 使用者載入 App，localStorage 已儲存日間目的地時區，`isDark` 計算為 `false`
- **THEN** 頁面首次渲染時，所有 `.lg-glass` 元素的 `--glass-surface` 已為白色值（R > 200）

---

### Requirement: isDark 變化時同步更新 inline token
系統 SHALL 在 `isDark` 計算屬性變更的同一個 tick 內，更新 `#app` 上所有 `--glass-*` token 的 inline style 值。

#### Scenario: 時區跨越日夜切換
- **WHEN** 目的地當地時間由 `awake`（日間）跨越為 `sleep`（夜間），`isDark` 從 `false` 變為 `true`
- **THEN** `#app` 的 `style` 屬性中 `--glass-surface` 值在同一 tick 內更新為深色值

#### Scenario: 使用者手動切換目的地時區
- **WHEN** 使用者將目的地時區從日間城市改為夜間城市
- **THEN** 畫面開始執行 background 過渡動畫，1 秒內 `.lg-glass` 背景完成深色轉換

---

### Requirement: inline CSS token 優先級高於所有 CSS 規則
系統 SHALL 確保 `#app` 上設定的 `--glass-*` inline CSS custom properties 不被任何外部 CSS 樣式表（包含 Tailwind CDN、媒體查詢 `!important` 規則）覆寫。

#### Scenario: prefers-reduced-transparency 媒體查詢啟用
- **WHEN** 裝置啟用「減少透明度」輔助功能，`@media (prefers-reduced-transparency: reduce)` 生效
- **THEN** 夜間模式的 `.lg-glass` 背景仍顯示深色（R < 60），不被 `!important` 白色規則蓋過

#### Scenario: 系統深色模式 + App 日間模式
- **WHEN** 裝置系統為深色模式，但 App `timeSegment` 為 `awake`（`isDark === false`）
- **THEN** `.lg-glass` 背景為白色半透明（R > 200），不受系統深色模式影響
