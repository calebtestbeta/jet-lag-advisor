## MODIFIED Requirements

### Requirement: 重設旅程按鈕
系統 SHALL 在時區設定卡片底部提供「重設旅程」按鈕，清除全部旅程狀態並回到初始空白畫面。重設後系統 SHALL 自動偵測裝置時區並回填出發地。

#### Scenario: 按鈕可見性
- **WHEN** 使用者已設定出發地或目的地（`originTz` 或 `destTz` 不為空）
- **THEN** 時區設定卡片底部顯示「重設旅程」按鈕（`.lg-btn lg-btn-ghost` 樣式）

#### Scenario: 空白初始狀態不顯示
- **WHEN** 出發地和目的地均未設定
- **THEN** 重設旅程按鈕不顯示（`v-if="originTz || destTz"`）

#### Scenario: 點擊重設
- **WHEN** 使用者點擊「重設旅程」按鈕
- **THEN** 系統清除所有旅程資料：出發地、目的地、出發時間、抵達時間、航程追蹤狀態，並將清除結果同步寫入 localStorage
- **THEN** 畫面回到初始狀態（顯示空白狀態的 globe icon 和「設定目的地開始使用」提示）
- **THEN** 目的地搜尋輸入框清空，可立即重新輸入

#### Scenario: 重設後出發地自動回填裝置時區
- **WHEN** 使用者點擊「重設旅程」
- **THEN** 系統以 `Intl.DateTimeFormat().resolvedOptions().timeZone` 偵測裝置時區
- **THEN** `originTz` 設為偵測到的時區，`originSearch` 顯示對應城市名稱（若 CITIES 列表有匹配）或 IANA 時區識別碼
- **THEN** 出發地欄位顯示自動偵測到的城市，不需使用者手動重新搜尋

#### Scenario: 重設後可重新設定
- **WHEN** 重設旅程後
- **THEN** 使用者可立即在目的地搜尋框輸入新的城市並選擇，功能正常運作
