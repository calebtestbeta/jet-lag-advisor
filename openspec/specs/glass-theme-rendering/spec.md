## ADDED Requirements

### Requirement: 淺色模式 Glass 卡片外觀
系統 SHALL 確保 `.lg-glass` 卡片在淺色模式（`timeSegment === 'awake'` 或 `'dawn'`）下顯示為接近白色的半透明外觀，無論裝置系統模式為何。

#### Scenario: 系統淺色模式 + App 淺色模式
- **WHEN** 裝置系統為淺色模式，App `timeSegment` 為 `awake`
- **THEN** 所有 `.lg-glass` 卡片背景為白色半透明（視覺上接近白色，非灰色）

#### Scenario: 系統深色模式 + App 淺色模式（最常見問題情境）
- **WHEN** 裝置系統為深色模式，但 App `timeSegment` 為 `awake`（`isDark === false`）
- **THEN** 所有 `.lg-glass` 卡片背景仍為白色半透明，不受系統深色模式影響

#### Scenario: App 深色模式
- **WHEN** App `timeSegment` 為 `sleep` 或 `dusk`（`isDark === true`）
- **THEN** 所有 `.lg-glass` 卡片顯示深色半透明背景

---

### Requirement: datetime-local 輸入框背景
系統 SHALL 確保「航程管理」卡片中的出發時間與預計抵達時間輸入框有可辨識的白色（淺色模式）或深色（深色模式）背景。

#### Scenario: 淺色模式輸入框
- **WHEN** App 處於淺色模式，使用者查看航程管理卡片
- **THEN** datetime-local 輸入框背景為白色，文字為深色，可清楚辨識

#### Scenario: 深色模式輸入框
- **WHEN** App 處於深色模式，使用者查看航程管理卡片
- **THEN** datetime-local 輸入框背景為深色，文字為白色，可清楚辨識

---

### Requirement: 文字對比度
系統 SHALL 確保所有卡片內的標籤與輔助文字符合 WCAG AA 標準（對比比率 ≥ 4.5:1）。

#### Scenario: 時鐘卡片標籤
- **WHEN** 使用者在淺色模式查看出發地 / 目的地時鐘卡片
- **THEN** 「出發地」「目的地」標籤文字可清楚辨識（使用 `text-slate-600` 或更深）

#### Scenario: urgent 建議卡片邊框
- **WHEN** 某條建議標記為 `urgent`
- **THEN** 卡片邊框顯示琥珀色提示，不被其他 CSS 規則覆蓋

---

### Requirement: 捲軸樣式適應主題
系統 SHALL 確保自訂捲軸在淺色和深色模式下均可見。

#### Scenario: 淺色模式捲軸
- **WHEN** App 處於淺色模式，內容可捲動
- **THEN** 捲軸滑塊為中性灰色，在白色背景上可見

#### Scenario: 深色模式捲軸
- **WHEN** App 處於深色模式，內容可捲動
- **THEN** 捲軸滑塊為半透明白色，在深色背景上可見
