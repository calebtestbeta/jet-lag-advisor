## 1. CSS 架構重構（根本修法）

- [x] 1.1 在 `:root` 設定 light 預設 token（移除對 dark 的假設），讓 `.theme-dark` 作為唯一深色 token 來源
- [x] 1.2 移除 `@media (prefers-color-scheme: dark)` 和 `@media (prefers-color-scheme: light)` 對 `:root` 的 CSS variable 覆蓋（第 56–83 行）
- [x] 1.3 在 `body` 加入顯式背景色：淺色 `#f0f6ff`；用 `@media (prefers-color-scheme: dark) { body { background: #0f172a } }` 配合深色系統
- [x] 1.4 調整 `.theme-light .lg-glass`：移除 `saturate(120%)` 只保留 `blur(16px)`，背景改為 `rgba(255,255,255,0.90)`，移除不必要的 `!important`（因架構已修正，`!important` 只在必要處保留）
- [x] 1.5 確認 `.theme-dark .lg-glass` 的背景仍正確（`rgba(30,30,40,0.72)`）

## 2. bg-awake 漸層調整

- [x] 2.1 將 `bg-awake` 從 `#bfdbfe → #e0f2fe → #f8fafc` 調整為 `#dbeafe → #eff6ff → #f8fafc`，降低藍色飽和度，與白色 glass 更協調

## 3. datetime-local 輸入框修正

- [x] 3.1 將「出發時間」input 的 class 從 `lg-glass lg-glass-sm` 改為 `lg-input`
- [x] 3.2 將「預計抵達」input 的 class 從 `lg-glass lg-glass-sm` 改為 `lg-input`

## 4. 視覺細節修正

- [x] 4.1 修正捲軸顏色：基礎改為 `rgba(128,128,128,0.3)`，`.theme-dark` 內設為 `rgba(255,255,255,0.25)`
- [x] 4.2 修正 urgent 邊框：將 `border-amber-400/40` class 改為 inline `:style="advice.urgent ? { outline: '1px solid rgba(251,191,36,0.5)' } : {}"`
- [x] 4.3 時鐘卡片「出發地」「目的地」標籤：淺色模式從 `text-slate-500` 升至 `text-slate-600`
- [x] 4.4 「取消追蹤」按鈕加 `py-2` 確保 touch target

## 5. SW 版本 bump

- [x] 5.1 將 `sw.js` 的 `CACHE_VERSION` 升至 `v2.0.0`，讓裝置強制載入修正後的 CSS
