## 1. 提取時區偵測 Helper

- [x] 1.1 在 `onMounted` 之前，將時區偵測邏輯抽取為 `detectOriginTz()` 函式（`Intl.DateTimeFormat().resolvedOptions().timeZone` + CITIES 查詢 + 設定 `originTz` / `originSearch`）
- [x] 1.2 將 `onMounted` 內的原始偵測邏輯改為呼叫 `detectOriginTz()`，確認行為不變

## 2. 修復 resetTrip

- [x] 2.1 在 `resetTrip()` 的清空邏輯末尾呼叫 `detectOriginTz()`，讓出發地自動回填裝置時區
