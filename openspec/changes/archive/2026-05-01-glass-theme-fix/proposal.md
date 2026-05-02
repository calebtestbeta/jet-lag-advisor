## Why

UI review（2026-05-01）揭示了 CSS 主題系統的根本設計缺陷，導致 iOS Safari 系統深色模式下所有 `.lg-glass` 卡片顯示為深灰色，且 `datetime-local` 輸入框背景近黑。反覆以 `!important` 修補均無效，因為問題根源是 `@media (prefers-color-scheme: dark)` 直接覆蓋 `:root` CSS 變數，與 app 自身的 `.theme-light`/`.theme-dark` class 系統衝突。

## What Changes

- **CSS 架構重構**：移除 `@media (prefers-color-scheme)` 對 `:root` 的 token 覆蓋，改由 `.theme-light`/`.theme-dark` class 完全控制所有 token；在 `body` 加入顯式背景色確保 backdrop-filter 有穩定的模糊來源
- **backdrop-filter 調整**：淺色模式移除 `saturate()` 避免藍色偏移，深色模式適當保留
- **datetime-local 輸入框修正**：從 `lg-glass lg-glass-sm` 改為 `lg-input`
- **bg-awake 漸層調整**：降低藍色飽和度，更接近中性白
- **捲軸顏色**：適配淺色/深色模式
- **urgent 邊框修正**：改用 `outline` 避免被 border-color `!important` 覆蓋
- **時鐘標籤對比度**：`text-slate-500` 升至 `text-slate-600`（WCAG AA）
- **取消追蹤按鈕**：加 `py-2` 確保 44pt touch target

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `dropdown-stacking-fix`：原 `.lg-glass` z-index 行為未受影響，無需更新
- `trip-reset`：按鈕樣式對比度改善，視為 visual fix，無需新 spec

## Impact

- 僅修改 `index.html` CSS 與 template 部分
- 不影響 Vue 邏輯、資料結構、localStorage schema
- 不影響 PWA manifest / sw.js（除非需要 cache-bust）
