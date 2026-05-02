## Context

目前 `index.html` 使用 `backdrop-filter: blur(...)` 實現毛玻璃效果。Safari 的 GPU compositing layer 快取機制導致切換主題後卡片顏色無法可靠更新——這個問題從底層無法以 CSS 修補。現有 token 系統（`--lg-*`）混合 `:root`、`.theme-light`、`.theme-dark` 三層，層疊關係複雜，容易因媒體查詢或 `!important` 覆蓋產生意外結果。

## Goals / Non-Goals

**Goals:**
- 完全移除 `backdrop-filter`，以不透明度較高的半透明實色背景替代
- 新設計 token 系統（`--glass-*`）：日間模式（awake/dawn）與夜間模式（sleep/dusk）各自完整獨立，不互相繼承
- 主題切換只透過 `#app.theme-day` / `#app.theme-night` 兩個 class 控制，不依賴系統 `prefers-color-scheme`
- 達到 Apple Liquid Glass 的視覺質感（無模糊但有層次感、高光線條、柔和陰影、精緻邊框）
- CSS 改動完整包含在 `index.html` 的 `<style>` 區塊，不新增外部資源

**Non-Goals:**
- 不修改 Vue 應用邏輯（`timeSegment`、`isDark` 計算方式不變）
- 不引入 CSS 預處理器或 build step
- 不改動 Tailwind 工具類別的使用方式

## Decisions

### 1. 以半透明實色背景模擬 Liquid Glass

**選擇**：移除 `backdrop-filter`，使用較高不透明度的半透明背景（日間 `rgba(255,255,255,0.88)` ~ `0.94`；夜間 `rgba(22,24,38,0.82)` ~ `0.90`）搭配 `::before` 漸層高光與 `::after` 彩虹色散層模擬玻璃質感。

**為何不保留 backdrop-filter**：Safari iOS 的 compositing layer 快取問題已確認無法以 CSS 排除；對元素設 `backdrop-filter: none` 仍可能保留舊快取。完全不用 `backdrop-filter` 是唯一可靠方案。

**替代方案考量**：使用 `will-change: transform` 強制 layer 重建 — 測試後在 iOS 18 上仍無效；使用 JavaScript 直接設 `style.background` — 侵入性太高，維護成本高。

### 2. 雙 token 組（`--glass-day-*` vs `--glass-night-*`）取代繼承疊加

**選擇**：在 `.theme-day` 下宣告 `--glass-surface: rgba(255,255,255,0.90)` 等；在 `.theme-night` 下宣告 `--glass-surface: rgba(22,24,38,0.85)` 等。`.lg-glass` 只引用 `var(--glass-surface)`，完全依賴 CSS 繼承，不再有 `.theme-dark .lg-glass` 這類複合選擇器。

**理由**：消除選擇器優先級衝突，每個卡片只有一條 background 宣告，更易追蹤。

### 3. class 名稱從 `theme-dark`/`theme-light` 改為 `theme-night`/`theme-day`

**選擇**：避免與系統 `prefers-color-scheme` 的「dark」語意混淆；明確表達「這是根據目的地時間決定，不是系統主題」。

**Vue template 修改**：`isDark ? 'theme-night' : 'theme-day'`。

### 4. Liquid Glass 視覺層次（無 backdrop-filter 版）

每張 `.lg-glass` 由四層組成：
1. **Base** (`background: var(--glass-surface)`)：半透明實色底
2. **Shimmer** (`::before`)：頂部 1px 高光線 + 淡漸層（模擬玻璃上緣反光）
3. **Tint** (`::after`)：135° 彩色散射漸層（藍紫/玫瑰，僅夜間版調整色相）
4. **Border**：`border: 1px solid var(--glass-border)`（日間淡黑；夜間淡白）

陰影以 `box-shadow` 實現，夜間模式加深，日間模式輕柔。

### 5. 背景漸層保持現有 `.bg-sleep`/`.bg-awake` 等 class

這四個 class 已有良好視覺效果，保留並微調，確保與新卡片顏色搭配。

## Risks / Trade-offs

- **少了毛玻璃模糊** → 在高對比背景下卡片可能顯得「平」。緩解：提高 shimmer 和 tint 層的不透明度，加強 box-shadow 深度感。
- **Cypress 測試更新** → 原測試驗證 `backdropFilter` 值；需改為驗證 `backgroundColor` R channel 在正確範圍內（夜間 < 60，日間 > 200）。
- **既有卡片所有 `theme-dark`/`theme-light` 引用需全部替換** → 以 grep 搜尋確認無遺漏。

## Migration Plan

1. 在 `<style>` 區塊新增 `--glass-day-*` 和 `--glass-night-*` token，並在 `.theme-day` / `.theme-night` 下綁定 `--glass-*` 短名
2. 改寫 `.lg-glass`、`.lg-glass::before`、`.lg-glass::after` 使用新 token
3. 移除所有 `backdrop-filter` 相關宣告（包括 `@media (prefers-reduced-transparency)` 中的）
4. 替換 `isDark ? 'theme-dark' : 'theme-light'` → `isDark ? 'theme-night' : 'theme-day'`
5. 同步更新 `.lg-btn-primary`、`.lg-btn-secondary`、`.lg-input`、`.lg-icon-btn`
6. 升級 `sw.js` 版本號
7. 更新 Cypress 測試

Rollback：git revert 到上一個 commit（v2.6.0 已完成 backdrop-filter 移除）。
