## 1. CSS Design Token 重建

- [x] 1.1 在 `index.html` `<style>` 區塊中，新增 `--glass-*` 短名 token 定義（`--glass-surface`、`--glass-surface-thin`、`--glass-border`、`--glass-border-top`、`--glass-shadow`、`--glass-shadow-deep`、`--glass-text-primary`、`--glass-text-secondary`、`--glass-text-tertiary`）
- [x] 1.2 在 `.theme-day` selector 下宣告 `--glass-*` 日間值（白色半透明系列，`color-scheme: light`）
- [x] 1.3 在 `.theme-night` selector 下宣告 `--glass-*` 夜間值（深藍/深紫系列，R < 60，`color-scheme: dark`）
- [x] 1.4 確認 `:root { color-scheme: light; }` 保留，並移除 `.theme-light`／`.theme-dark` 舊 selector（全文搜尋確認）

## 2. Vue 主題 class 替換

- [x] 2.1 在 `index.html` template 中，將 `isDark ? 'theme-dark text-white' : 'theme-light text-slate-800'` 改為 `isDark ? 'theme-night text-white' : 'theme-day text-slate-800'`
- [x] 2.2 確認 `bgClass` 計算屬性及其他所有 `theme-dark`／`theme-light` 字串引用已全部替換（grep 全文）

## 3. .lg-glass 四層視覺重建

- [x] 3.1 改寫 `.lg-glass` 基底規則：`background: var(--glass-surface)`，移除所有 `backdrop-filter`（包括 `none`）
- [x] 3.2 改寫 `.lg-glass::before`：保留頂部高光漸層 + `inset` box-shadow（使用 `var(--glass-border-top)`），確認日/夜均有漸層
- [x] 3.3 改寫 `.lg-glass::after`：保留彩色散射漸層，微調夜間版色相（偏藍紫）
- [x] 3.4 確認 `.lg-glass > *` 的 `z-index: 2` 保留，使內容層在偽元素之上
- [x] 3.5 移除舊 `.theme-light .lg-glass`、`.theme-dark .lg-glass`、`.lg-glass-sm`、`.lg-glass-lg` 的 `backdrop-filter` 宣告

## 4. 按鈕、輸入框、其他元件更新

- [x] 4.1 `.lg-btn-primary`：移除 `backdrop-filter`，調整 `background` 為固定 `rgba(99,102,241,0.90)`（夜間）或 `rgba(99,102,241,0.85)`（日間），使用 `var(--glass-surface)` 搭配或保持固定色
- [x] 4.2 `.lg-btn-secondary`：改用 `var(--glass-surface)` 背景，確認日/夜對比
- [x] 4.3 `.lg-icon-btn`：移除 `backdrop-filter`，改用 `var(--glass-surface)` 背景
- [x] 4.4 `.lg-input`、`.theme-day .lg-input`、`.theme-night .lg-input`：確認背景、文字顏色正確（白色/深色），`color-scheme` 宣告正確
- [x] 4.5 `.lg-overlay`、`.lg-sheet`：確認已無 `backdrop-filter`，背景不透明度調整為視覺可接受值
- [x] 4.6 `.dropdown-list`、`.dropdown-list-dark`：確認已無 `backdrop-filter`，不透明度 ≥ 0.97

## 5. `@media (prefers-reduced-transparency)` 清理

- [x] 5.1 移除 `@media (prefers-reduced-transparency)` 區塊中的 `backdrop-filter: none !important` 行（已無意義）
- [x] 5.2 確認該媒體查詢區塊中的 `background !important` 規則仍使用正確 selector（`.theme-night .lg-glass`、`.theme-day .lg-glass`）

## 6. Cypress 測試更新

- [x] 6.1 在 `cypress/e2e/glass-card-transition.cy.js` 中，將所有 `theme-dark`／`theme-light` class 設定替換為 `theme-night`／`theme-day`
- [x] 6.2 確認「背景色 R channel」驗證邏輯：日間 > 200，夜間（過 transition 後）< 60
- [x] 6.3 執行 `npx cypress run` 確認全部測試通過

## 7. SW 快取版本更新

- [x] 7.1 將 `sw.js` 的 `CACHE_VERSION` 升至下一版（當前 `v2.6.0` → `v2.7.0`）
