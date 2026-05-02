## MODIFIED Requirements

### Requirement: App 日間 Glass 卡片外觀
系統 SHALL 確保 `.lg-glass` 卡片在日間模式（`isDark === false`，目的地 `timeSegment` 為 `awake` 或 `dawn`）下顯示高亮白色半透明外觀，不使用 `backdrop-filter`，不受裝置系統主題影響。

#### Scenario: 系統淺色模式 + App 日間模式
- **WHEN** 裝置系統為淺色模式，App `timeSegment` 為 `awake`
- **THEN** 所有 `.lg-glass` 卡片 R channel ≥ 200（白色半透明）

#### Scenario: 系統深色模式 + App 日間模式（關鍵場景）
- **WHEN** 裝置系統為深色模式，但 App `timeSegment` 為 `awake`（`isDark === false`）
- **THEN** 所有 `.lg-glass` 卡片仍為 R channel ≥ 200（白色半透明，不受系統影響）

#### Scenario: App 夜間模式
- **WHEN** App `timeSegment` 為 `sleep` 或 `dusk`（`isDark === true`）
- **THEN** 所有 `.lg-glass` 卡片顯示 R channel < 60 的深色半透明背景（過渡後）

---

### Requirement: datetime-local 輸入框背景
系統 SHALL 確保「航程管理」卡片中的時間輸入框有可辨識背景：日間為白色（R channel ≥ 200），夜間為深色（R channel < 80）。

#### Scenario: 日間模式輸入框
- **WHEN** App 處於 `theme-day`，使用者查看航程管理卡片
- **THEN** datetime-local 輸入框背景為白色，文字為深色

#### Scenario: 夜間模式輸入框
- **WHEN** App 處於 `theme-night`，使用者查看航程管理卡片
- **THEN** datetime-local 輸入框背景為深色，文字為白色

---

### Requirement: 文字對比度
系統 SHALL 確保所有卡片內的標籤與輔助文字符合 WCAG AA 標準（對比比率 ≥ 4.5:1）。

#### Scenario: 時鐘卡片標籤（日間）
- **WHEN** 使用者在日間模式查看出發地 / 目的地時鐘卡片
- **THEN** 「出發地」「目的地」標籤文字可清楚辨識

#### Scenario: urgent 建議卡片邊框
- **WHEN** 某條建議標記為 `urgent`
- **THEN** 卡片邊框顯示琥珀色提示，不被其他 CSS 規則覆蓋

---

### Requirement: 捲軸樣式適應主題
系統 SHALL 確保自訂捲軸在日間和夜間模式下均可見。

#### Scenario: 日間模式捲軸
- **WHEN** App 處於 `theme-day`，內容可捲動
- **THEN** 捲軸滑塊為中性灰色，在白色背景上可見

#### Scenario: 夜間模式捲軸
- **WHEN** App 處於 `theme-night`，內容可捲動
- **THEN** 捲軸滑塊為半透明白色，在深色背景上可見
