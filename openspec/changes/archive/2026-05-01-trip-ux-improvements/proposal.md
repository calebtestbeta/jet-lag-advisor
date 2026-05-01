## Why

使用者在操作時發現三個痛點：時區下拉選單因 CSS stacking context 衝突導致被後方目的地欄蓋住、沒有快速重設整段旅程的入口、以及搜尋只支援城市名稱而無法輸入常見的 IATA 機場代號（如 TPE、NRT、FRA）。這三項問題影響核心搜尋流程與旅程重設體驗，需要一次整合修復。

## What Changes

- **修復下拉選單 z-index 衝突**：`.lg-glass > *` 的 `z-index: 2` 讓 Origin 和 Destination 區塊建立平行 stacking context，後者蓋住前者的下拉選單；需在開啟下拉時動態提升該區塊的 z-index。
- **新增「重設旅程」功能**：在時區設定卡片加入「重設旅程」按鈕，一鍵清除出發地、目的地及所有航程資料，並回到初始狀態。
- **IATA 機場代號搜尋**：在 `CITIES` 陣列每筆資料加入 `iata` 欄位（主要機場代號），並在 `fuzzyMatch` 函式中納入比對；下拉清單同步顯示機場代號。

## Capabilities

### New Capabilities
- `trip-reset`: 重設旅程按鈕，清除全部旅程狀態並回到初始畫面
- `airport-code-search`: IATA 機場代號搜尋與顯示

### Modified Capabilities
- `dropdown-stacking-fix`: 修正 z-index stacking context 導致下拉選單被遮蔽的 bug（既有搜尋行為，非新功能，但 UI 規格需更新）

## Impact

- `index.html`：CITIES 常數新增 `iata` 欄位（約 150 筆）、`fuzzyMatch` 新增 iata 比對、template 下拉項目顯示 iata badge、新增 `resetTrip` 函式、時區卡片加入 `:style` 動態 z-index 綁定
- 無外部依賴變更、無 API 異動、無資料結構 breaking change（iata 欄位為 optional）
