## Why

`resetTrip()` 將 `originTz` 清空後，裝置時區的自動偵測邏輯（`Intl.DateTimeFormat().resolvedOptions().timeZone`）只在 `onMounted` 執行一次，不會重新觸發，導致重設後出發地時區永遠空白，使用者必須手動重新搜尋自己的所在地。

## What Changes

- `resetTrip()` 在清空資料後，立即以裝置時區重新填入 `originTz` 和 `originSearch`（與 `onMounted` 相同的偵測邏輯）

## Capabilities

### New Capabilities
<!-- 無新 capability -->

### Modified Capabilities
- `trip-reset`：重設旅程後 `originTz` 應自動回填裝置時區，而非留空

## Impact

- `index.html`：`resetTrip()` 函式（約第 1293 行）加入時區重新偵測
