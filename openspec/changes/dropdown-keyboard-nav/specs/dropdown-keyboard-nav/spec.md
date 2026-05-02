## ADDED Requirements

### Requirement: 鍵盤方向鍵導覽下拉選單
系統 SHALL 在搜尋框獲得焦點且下拉選單開啟時，支援鍵盤方向鍵移動高亮項目。

#### Scenario: 按下 ↓ 移動高亮至下一項
- **WHEN** 下拉選單開啟，使用者按下 ↓ 鍵
- **THEN** 高亮項目移動至下一個，到達最後一項後停止（不循環）

#### Scenario: 按下 ↑ 移動高亮至上一項
- **WHEN** 下拉選單開啟，使用者按下 ↑ 鍵
- **THEN** 高亮項目移動至上一個，到達第一項後停止（不循環）

#### Scenario: 無高亮時按 ↓ 高亮第一項
- **WHEN** 下拉選單剛開啟（無高亮），使用者按下 ↓ 鍵
- **THEN** 第一個項目被高亮

#### Scenario: 高亮項目超出可視區時自動捲動
- **WHEN** 高亮項目在下拉選單可視區之外
- **THEN** 系統自動捲動，使高亮項目進入視窗

---

### Requirement: Enter 鍵確認選取
系統 SHALL 在有高亮項目時，按下 Enter 鍵確認選取並關閉下拉選單。

#### Scenario: Enter 選取高亮項目
- **WHEN** 下拉選單開啟且有高亮項目，使用者按下 Enter
- **THEN** 該高亮項目被選取，下拉選單關閉，搜尋框顯示所選城市名稱

#### Scenario: 無高亮時 Enter 不觸發選取
- **WHEN** 下拉選單開啟但無高亮項目（index = -1），使用者按下 Enter
- **THEN** 不執行任何選取動作（保持預設表單送出行為，但本 app 無表單送出，故無副作用）

---

### Requirement: Escape 鍵關閉下拉選單
系統 SHALL 在下拉選單開啟時，按下 Escape 關閉選單並清除高亮。

#### Scenario: Escape 關閉選單
- **WHEN** 下拉選單開啟，使用者按下 Escape
- **THEN** 下拉選單關閉，高亮 index 重置為 -1，搜尋框文字維持不變

---

### Requirement: 輸入新字元時重置高亮
系統 SHALL 在搜尋字詞改變時，將高亮 index 重置為 -1。

#### Scenario: 輸入字元後高亮重置
- **WHEN** 下拉選單開啟且有高亮項目，使用者輸入新字元
- **THEN** 高亮清除（index = -1），新的搜尋結果顯示

---

### Requirement: 高亮項目有視覺樣式
系統 SHALL 對高亮項目套用與 hover 相同的背景色，區別於未高亮項目。

#### Scenario: 淺色模式高亮樣式
- **WHEN** App 為淺色模式，某下拉項目被鍵盤高亮
- **THEN** 該項目背景顯示淺色高亮色（與 hover 一致）

#### Scenario: 深色模式高亮樣式
- **WHEN** App 為深色模式，某下拉項目被鍵盤高亮
- **THEN** 該項目背景顯示深色高亮色（與 hover 一致）
