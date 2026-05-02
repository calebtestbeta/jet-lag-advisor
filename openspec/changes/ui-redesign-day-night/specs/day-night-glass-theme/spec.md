## ADDED Requirements

### Requirement: Day/Night Design Token 系統
系統 SHALL 定義兩套完整且互不繼承的 CSS Design Token：
- `.theme-day`：日間模式（目的地 `timeSegment` 為 `awake` 或 `dawn`）
- `.theme-night`：夜間模式（目的地 `timeSegment` 為 `sleep` 或 `dusk`）

所有卡片、按鈕、輸入框樣式 SHALL 只引用短名 token（`--glass-surface`、`--glass-border`、`--glass-shadow` 等），由父層 class 決定其值，不得使用 `.theme-night .lg-glass` 這類複合選擇器覆蓋背景。

#### Scenario: #app 持有正確 class
- **WHEN** `isDark === true`（目的地為夜晚）
- **THEN** `#app` 的 class 列表包含 `theme-night`，且不包含 `theme-day`

#### Scenario: #app 持有正確 class（日間）
- **WHEN** `isDark === false`（目的地為白天）
- **THEN** `#app` 的 class 列表包含 `theme-day`，且不包含 `theme-night`

---

### Requirement: 日間 Glass 卡片外觀
系統 SHALL 在 `.theme-day` 環境下，使所有 `.lg-glass` 卡片顯示高亮白色半透明外觀（`rgba(255,255,255,0.90)` 以上），搭配頂部高光線與柔和淺色陰影。

#### Scenario: 日間卡片背景亮度
- **WHEN** `#app` 具有 `theme-day` class
- **THEN** `getComputedStyle('.lg-glass').backgroundColor` 的 R channel ≥ 200

#### Scenario: 無 backdrop-filter
- **WHEN** 任何情境下
- **THEN** 所有 `.lg-glass` 元素的 `backdropFilter`／`webkitBackdropFilter` computed 值為 `none` 或空字串

---

### Requirement: 夜間 Glass 卡片外觀
系統 SHALL 在 `.theme-night` 環境下，使所有 `.lg-glass` 卡片顯示深色半透明外觀（R channel < 60），搭配頂部白色微光與深色陰影，與深色漸層背景自然融合。

#### Scenario: 夜間卡片背景深度
- **WHEN** `#app` 具有 `theme-night` class
- **THEN** `getComputedStyle('.lg-glass').backgroundColor` 的 R channel < 60（渡過 0.8s transition 後）

---

### Requirement: 無系統主題依賴
系統 SHALL 確保 App 外觀完全不受裝置 `prefers-color-scheme` 影響。無論裝置為系統深色或淺色，App 只根據目的地當地 `timeSegment` 切換 `theme-day`／`theme-night`。

#### Scenario: 系統深色模式 + 目的地白天
- **WHEN** 裝置系統為深色模式，但目的地 `timeSegment === 'awake'`
- **THEN** `#app` 持有 `theme-day`，卡片顯示日間外觀（白色半透明）

#### Scenario: 系統淺色模式 + 目的地夜晚
- **WHEN** 裝置系統為淺色模式，但目的地 `timeSegment === 'sleep'`
- **THEN** `#app` 持有 `theme-night`，卡片顯示夜間外觀（深色半透明）

---

### Requirement: Liquid Glass 視覺層次（無 backdrop-filter）
系統 SHALL 使每張 `.lg-glass` 卡片透過以下四層實現 Apple Liquid Glass 視覺質感：
1. 半透明實色底（`background: var(--glass-surface)`）
2. `::before` 頂部高光漸層 + 1px 亮邊（模擬玻璃反光）
3. `::after` 彩色散射漸層（藍紫/玫瑰，夜間版調整色相）
4. `border: 1px solid var(--glass-border)`

#### Scenario: 夜間模式 ::before 高光存在
- **WHEN** `#app` 具有 `theme-night` class
- **THEN** `.lg-glass::before` 呈現由白色半透明漸變為透明的頂部漸層，增加玻璃質感

#### Scenario: 日間模式 ::before 高光存在
- **WHEN** `#app` 具有 `theme-day` class
- **THEN** `.lg-glass::before` 呈現輕柔的頂部白色反光層
