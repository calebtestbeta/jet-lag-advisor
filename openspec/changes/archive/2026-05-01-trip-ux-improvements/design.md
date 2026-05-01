## Context

`index.html` 是單一檔案 Vue 3 CDN 應用程式，所有 CSS、template、JavaScript 皆在同一檔案中。CITIES 陣列約 150 筆，每筆含 `en`、`zh`、`country`、`countryZh`、`tz` 欄位。下拉選單透過 `v-if` 條件渲染，以 `absolute` 定位疊在輸入框下方。

目前 `.lg-glass > * { position: relative; z-index: 2; }` 讓 glass 卡片的所有直接子元素建立獨立 stacking context。時區設定卡片的 Origin 區塊（子元素 A）和 Destination 區塊（子元素 B）均為 `z-index: 2`，DOM 順序讓 B 永遠覆蓋在 A 上方，使 Origin 下拉選單被 Destination 區塊遮住。

## Goals / Non-Goals

**Goals:**
- 修正下拉選單被後方 DOM 元素遮蔽的 bug（不變更 `.lg-glass > *` 全域規則）
- 新增 `resetTrip()` 函式，清空所有旅程狀態並儲存至 localStorage
- 為 CITIES 每筆資料加入 `iata` 欄位（主機場 IATA 三字代號），並在搜尋與顯示中使用

**Non-Goals:**
- 完整的機場資料庫（僅取每座城市最主要的一個機場代號）
- 多機場城市的多 IATA 代號支援（如東京 HND/NRT 僅選 NRT）
- 自動偵測飛行路線（不在此次範圍）

## Decisions

### 1. Dropdown z-index 修正方式

**決策**：在原有 `<div class="mb-3 relative">` (Origin) 和 `<div class="relative">` (Destination) 加入 `:style` 動態綁定，開啟下拉時提升至 `z-index: 10`，覆蓋 `.lg-glass > *` 給予的 `z-index: 2`。

**為何不改 `.lg-glass > *`**：移除全域 `z-index: 2` 可能讓 pseudo-element 層（`::before`、`::after`）破版，影響 Liquid Glass 四層架構。最小化改動優先。

**為何不用 `z-index: auto`**：需要一個明確正整數才能在同一 stacking context 中排序，`z-index: 10` 夠高且不與其他元素衝突。

### 2. Reset Trip 按鈕位置

**決策**：放在時區設定卡片底部，使用 `.lg-btn lg-btn-ghost` 樣式，只在 `originTz || destTz` 有值時顯示（`v-if`），避免在初始空白狀態出現無意義按鈕。

**為何不放在 header**：header 已有設定和知識庫兩顆按鈕，再加入 reset 會過於擁擠；旅程重設屬於設定操作，放在設定卡片底部語意更清晰。

### 3. IATA 資料維護方式

**決策**：直接在 CITIES 陣列每筆物件加入 `iata: 'XXX'` 欄位。對於無主要機場的城市（如 Macau 澳門，澳門機場代號 MFM）或小城市，同樣加入正確代號。

**為何不建立獨立 AIRPORTS 陣列**：單一檔案架構下，分離陣列增加維護複雜度；IATA 與城市一對一（每城市取最主要機場）可直接合併。

**`fuzzyMatch` 更新**：新增 `(city.iata && city.iata.toLowerCase() === q.trim().toLowerCase())` 精確比對，讓 3 字母代號優先完整匹配而非 includes，避免「TP」誤中「TPE」等部分匹配。但仍支援 includes 以相容手機大小寫輸入。

## Risks / Trade-offs

- **IATA 手動維護**：CITIES 資料為手工維護，IATA 代號需人工填寫，可能有少數錯誤 → 僅影響搜尋結果準確性，不影響功能。初版先以主要旅遊城市確保正確率。
- **z-index 動態切換 flash**：快速切換 focus 可能有一幀 z-index 未更新 → Vue 的響應式更新在同一微任務內完成，實際不可察覺。
- **reset 誤觸**：按鈕樣式為 ghost（半透明），較不顯眼，降低誤觸可能；但若用戶真的誤觸，目前無撤銷機制 → 視為可接受風險，localStorage 即時清除屬預期行為。
