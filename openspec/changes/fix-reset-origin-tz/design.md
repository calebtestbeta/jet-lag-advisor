## Context

裝置時區自動偵測邏輯位於 `onMounted`（index.html 約第 1544 行）：

```js
const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (!originTz.value && detected) {
  originTz.value = detected;
  const c = CITIES.find(x => x.tz === detected);
  originSearch.value = c ? `${c.zh} · ${c.en}` : detected;
}
```

`resetTrip()`（約第 1293 行）把 `originTz` 和 `originSearch` 清空後，此段邏輯不會再執行，導致出發地空白。

## Goals / Non-Goals

**Goals:**
- `resetTrip()` 完成後，出發地自動回填為裝置當前時區

**Non-Goals:**
- 不改變偵測邏輯本身（`Intl.DateTimeFormat` + CITIES 查詢）
- 不改變 `clearTrip()`（僅清除行程資料，保留時區設定）

## Decisions

**決策：提取 `detectOriginTz()` helper，在 `onMounted` 與 `resetTrip()` 共用**

在 `onMounted` 之前抽出一個 `detectOriginTz()` 函式，包含偵測邏輯（`Intl.DateTimeFormat().resolvedOptions().timeZone` + CITIES 查詢），然後：
- `onMounted` 改為呼叫 `detectOriginTz()`
- `resetTrip()` 在清空後呼叫 `detectOriginTz()`

替代方案：直接在 `resetTrip()` 複製貼上偵測邏輯 — 拒絕，因為重複程式碼維護風險高。

## Risks / Trade-offs

- 若裝置時區偵測失敗（極少見），`originTz` 維持空白，行為與現有 `onMounted` 相同，無退步 → 可接受
