## Context

Jet Lag Advisor 是單一 `index.html` PWA，使用 Vue 3 CDN + Tailwind CDN。主題切換（日間／夜間）根據目的地當地時間決定 `isDark` 計算屬性，並套用 `theme-day` / `theme-night` CSS class 到 `#app`。

問題：兩天內所有基於 CSS class cascade 的修復均無法在 Safari iOS 上可靠運作：
1. Safari GPU 合成層快取：`backdrop-filter` 建立的合成層在主題切換後不會重新渲染（已移除 backdrop-filter，但問題仍存在）
2. `prefers-color-scheme` 媒體查詢：Tailwind CDN 或瀏覽器預設樣式可能注入依賴系統偏好的規則，蓋過 token 定義
3. CSS cascade 特異性競爭：Tailwind CDN 全域樣式、`@media (prefers-reduced-transparency)` 的 `!important` 規則，加上 `:root` 繼承，形成難以預測的覆寫關係
4. 首次渲染時機：即使 localStorage 預載，Vue 計算屬性的 `isDark` 初始值仍可能在第一次 paint 之後才觸發 class 變更

**根本解法**：JavaScript inline style 的優先級高於所有 CSS 規則（包含 `!important`），只有 `element.style.setProperty()` 能保證不被任何外部樣式覆寫。

## Goals / Non-Goals

**Goals:**
- 確保 `.lg-glass` 背景在所有瀏覽器（尤其 Safari iOS）上正確反映 `isDark` 狀態
- 在 `isDark` 變化的 **同一個 microtask** 內更新 inline CSS token，消除首次渲染不一致
- 保持現有 `var(--glass-*)` CSS 架構不變（`.lg-glass` 依然使用 CSS custom properties）
- 最小化改動範圍：不重寫元件結構，只改變 token 的「設定來源」

**Non-Goals:**
- 不重寫整個 UI 佈局或 Vue 元件樹
- 不引入 build step 或外部套件
- 不移除 `theme-day` / `theme-night` class（保留以維持 `color-scheme` 等非顏色 token）

## Decisions

### Decision 1：使用 `watchEffect` 在 `#app` 上直接設定 inline CSS custom properties

**選擇**：`watchEffect(() => { const app = document.getElementById('app'); app.style.setProperty('--glass-surface', isDark.value ? '...' : '...'); ... })`

**理由**：
- Inline style 在 CSS cascade 優先級最高（style attribute > 任何 stylesheet rule，包含 `!important`）
- `watchEffect` 在 Vue setup 中執行時，首次觸發為同步（immediate），確保在 Vue 掛載前完成 token 設定
- `#app` 是所有 `.lg-glass` 的祖先元素，CSS custom properties 自動繼承，無需逐個設定

**替代方案考慮**：
- **直接設定每個 `.lg-glass` 的 style**：效能差且需 DOM query，不如在根元素設定一次
- **動態注入 `<style>` tag**：仍屬 CSS stylesheet，優先級低於 inline style，且有 FOUC 風險
- **CSS `@layer`**：可控制 Tailwind 優先級，但無法解決 Safari compositing 問題
- **保持 CSS class 方式**：已嘗試且持續失敗

### Decision 2：從 `.theme-day` / `.theme-night` selector 中移除顏色 token 定義，改放 JS 中

**選擇**：CSS 只保留 `color-scheme`、`transition` 等不受主題切換影響的宣告；所有 `--glass-surface`、`--glass-border`、`--glass-shadow` 等顏色 token 改由 JS 設定在 `#app.style` 上。

**理由**：避免 JS 設定的 inline property 被相同名稱的 CSS class property 繼承鏈所干擾（雖然 inline 優先級更高，但移除 CSS 定義可徹底避免混淆）。

### Decision 3：保留 `theme-day` / `theme-night` class

**選擇**：繼續在 `#app` 套用這兩個 class，但只保留 `color-scheme`、捲軸樣式、`backdrop-filter: none` 等 non-color token。

**理由**：`color-scheme: light/dark` 影響表單元件（`<input type="datetime-local">`）的瀏覽器原生渲染，必須保留。

## Risks / Trade-offs

- [Risk] `document.getElementById('app')` 在 SSR 或非瀏覽器環境中為 null → Mitigation: 加上 `if (!app) return` guard；此專案無 SSR
- [Risk] Vue DevTools 中看不到 CSS token 值（因為是 inline style，不在 stylesheet 中）→ Mitigation: 接受此 trade-off，可透過 DevTools Elements panel 直接查看 style 屬性
- [Risk] 若未來有人誤在 CSS 中重新加入相同 token 定義，會被 inline 靜默覆蓋 → Mitigation: 在 tasks.md 中明確標記移除 CSS token 定義

## Migration Plan

1. 在 `index.html` 中新增 `watchEffect` token 注入邏輯
2. 從 `.theme-day` / `.theme-night` CSS selector 中刪除所有 `--glass-*` 顏色 token
3. Bump `sw.js` CACHE_VERSION（`v2.7.0` → `v2.8.0`）
4. 執行 Cypress 測試確認通過
5. 在 Safari iOS 裝置測試確認視覺正確

**Rollback**：Git revert 即可；舊 `CACHE_VERSION` 已廢棄，新版快取建立後無需額外操作。
