## Context

iOS Safari 系統深色模式下，`@media (prefers-color-scheme: dark)` 在 `:root` 寫入深色 CSS 變數，使 `.lg-glass { background: var(--lg-surface) }` 取得深色值。雖然 `.theme-light .lg-glass { background: ... !important }` 可覆蓋 background，但 `::before`/`::after` 的 `var(--lg-border-top)` 等屬性仍從 `:root` 取深色值；加上 iOS WebKit `backdrop-filter: saturate(160%)` 在藍色漸層背景上的渲染行為與 Chrome 不同，共同造成卡片持續顯示深灰。

## Goals / Non-Goals

**Goals:**
- 淺色模式下所有 `.lg-glass` 卡片呈現接近白色的外觀（無論系統模式）
- 深色模式下（sleep/dusk 時段）維持深色卡片
- `datetime-local` 輸入框有正確的白色背景
- 捲軸、按鈕對比度符合 WCAG AA（4.5:1）

**Non-Goals:**
- 不引入系統層級的深色模式自動切換（保持 app 自行管理）
- 不重構 Vue 邏輯
- 不改變 PWA service worker 快取策略

## Decisions

**決策 1：移除 `@media (prefers-color-scheme)` 的 `:root` token**
- 保留原因移除：這段 CSS 的原意是「在 app 未決定主題前提供 fallback」，但它持續覆蓋 `:root`，導致 `var()` 取值不可預測
- 替代方案：在 `:root` 只設定 light 預設值，由 `.theme-dark` class 覆蓋深色值

**決策 2：`body` 加顯式背景色**
- `body { background: #f0f6ff }` 配合 `@media (prefers-color-scheme: dark) { body { background: #0f172a } }`
- 這讓 backdrop-filter 有穩定的模糊對象，不受 CSS variable 影響

**決策 3：淺色模式移除 `saturate()` from backdrop-filter**
- `saturate(120%)` 在藍色背景上放大藍色偏移，改為 `blur(16px)` 純模糊

**決策 4：datetime-local 改用 `lg-input`**
- 直接複用已有的 light/dark mode explicit background 修正

## Risks / Trade-offs

- 移除 `@media (prefers-color-scheme)` `:root` fallback 後，若 Vue 未 mount（JS 載入前短暫空白），`.theme-light`/`.theme-dark` 尚未套用，頁面短暫用 `:root` 的 light 預設值渲染（可接受）
- `body` 背景色在深色模式下需要 media query，這是唯一保留的 media query 用途（僅控制 body，不控制 token）
