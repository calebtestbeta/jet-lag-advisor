## Why

`glass-theme-fix` 將淺色模式玻璃卡片的背景修正為真正的白色（`rgba(255,255,255,0.90)`），副作用是原本在偏灰卡片上勉強可辨識的 `text-slate-400`（對比度 ~2.9:1）和 `text-slate-500`（對比度 ~4.1:1）在白色背景下均低於 WCAG AA 標準（4.5:1），造成輔助文字字體偏淡、不易閱讀。

## What Changes

- 淺色模式下，所有 `text-slate-400` 次要文字升級為 `text-slate-500`（最小變動）或 `text-slate-600`（重要輔助文字）
- 淺色模式下，所有 `text-slate-500` 次要文字升級為 `text-slate-600`（確保 WCAG AA 5.74:1）
- 深色模式文字（`text-white/50`、`text-white/60`）不在本次範圍內（在深色背景上對比度足夠）
- 純裝飾性元素（icon + `opacity-40`）不調整

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `glass-theme-rendering`：新增次要文字對比度要求（補充現有 WCAG AA 需求的覆蓋範圍）

## Impact

- 僅修改 `index.html` 的 Tailwind class（`text-slate-400` → `text-slate-500/600`，`text-slate-500` → `text-slate-600`）
- 影響元素：時鐘卡片時區標籤、下拉清單次要文字（國家、IATA）、行程卡片標籤、建議卡片輔助文字、空狀態提示、知識庫說明
- 不影響 CSS、Vue 邏輯、localStorage
