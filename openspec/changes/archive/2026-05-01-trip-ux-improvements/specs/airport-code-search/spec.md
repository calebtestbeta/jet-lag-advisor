## ADDED Requirements

### Requirement: IATA 機場代號欄位
系統 SHALL 在 `CITIES` 陣列的每筆城市物件加入 `iata` 欄位，儲存該城市主要機場的 IATA 三字母代號（大寫）。

#### Scenario: IATA 欄位存在
- **WHEN** 應用程式載入
- **THEN** `CITIES` 陣列每筆物件均有 `iata` 欄位，值為 3 個大寫英文字母（如 `'TPE'`、`'NRT'`、`'FRA'`）

---

### Requirement: IATA 代號搜尋
系統 SHALL 允許使用者在城市搜尋框輸入 IATA 機場代號以找到對應城市。

#### Scenario: 精確代號搜尋
- **WHEN** 使用者在搜尋框輸入 `'TPE'`（大小寫不限）
- **THEN** 下拉清單顯示台北（Taipei）作為搜尋結果

#### Scenario: 大小寫不敏感
- **WHEN** 使用者輸入 `'tpe'` 或 `'Tpe'`
- **THEN** 同樣能找到 IATA 代號為 `'TPE'` 的城市

#### Scenario: 現有搜尋不受影響
- **WHEN** 使用者輸入城市名稱（如 `'Tokyo'`、`'東京'`）
- **THEN** 搜尋結果與原有行為相同，IATA 比對作為額外補充，不取代原有邏輯

---

### Requirement: 下拉選單顯示機場代號
系統 SHALL 在城市搜尋下拉清單的每個選項中顯示 IATA 代號。

#### Scenario: 下拉項目顯示格式
- **WHEN** 搜尋結果下拉清單顯示
- **THEN** 每個項目顯示：城市中文名 · 英文名、國家名、時區 offset、**以及 IATA 代號 badge**（灰色小文字，如 `TPE`）

#### Scenario: 無 iata 欄位的城市
- **WHEN** 某城市物件沒有 `iata` 欄位或值為空
- **THEN** 下拉項目不顯示 IATA badge，其他資訊正常顯示
