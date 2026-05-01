## 1. 修復下拉選單 z-index 衝突

- [x] 1.1 在 Origin 區塊的外層 `<div class="mb-3 relative">` 加入 `:style="{ zIndex: showOriginDrop ? 10 : '' }"` 動態綁定
- [x] 1.2 在 Destination 區塊的外層 `<div class="relative">` 加入 `:style="{ zIndex: showDestDrop ? 10 : '' }"` 動態綁定
- [x] 1.3 移除時區設定卡片（`.lg-glass.mb-4`）上的 `:style="{ zIndex: ... }"` 綁定（改由各子區塊管理，避免與其他卡片衝突）

## 2. 新增重設旅程功能

- [x] 2.1 在 Vue setup 中新增 `resetTrip` 函式：清空 `originTz`、`destTz`、`originSearch`、`destSearch`、`departTime`、`arriveTime`、`tripActive`、`arrived` 並同步清除對應 localStorage 鍵值
- [x] 2.2 在時區設定卡片底部（Destination 區塊之後）加入「重設旅程」按鈕，使用 `v-if="originTz || destTz"` 條件顯示、`@click="resetTrip"`、樣式 `lg-btn lg-btn-ghost w-full mt-3 text-sm`
- [x] 2.3 將 `resetTrip` 加入 Vue `return` 物件，確保 template 可呼叫

## 3. 加入 IATA 機場代號至 CITIES

- [x] 3.1 為 Asia - East 的城市加入 `iata` 欄位（東京 NRT、大阪 KIX、京都 ITM、札幌 CTS、福岡 FUK、首爾 ICN、釜山 PUS、台北 TPE、高雄 KHH、北京 PEK、上海 PVG、廣州 CAN、深圳 SZX、成都 CTU、香港 HKG、澳門 MFM、烏蘭巴托 ULN）
- [x] 3.2 為 Asia - Southeast 的城市加入 `iata` 欄位（新加坡 SIN、吉隆坡 KUL、曼谷 BKK、清邁 CNX、普吉島 HKT、雅加達 CGK、峇里島 DPS、馬尼拉 MNL、宿霧 CEB、胡志明市 SGN、河內 HAN、金邊 PNH、永珍 VTE、仰光 RGN、奈比多 NYT、汶萊 BWN）
- [x] 3.3 為 Asia - South 及 Asia - West 城市加入 `iata` 欄位（德里 DEL、孟買 BOM、班加羅爾 BLR、清奈 MAA、科倫坡 CMB、卡拉奇 KHI、伊斯蘭堡 ISB、達卡 DAC、加德滿都 KTM、杜拜 DXB、阿布達比 AUH、多哈 DOH、科威特 KWI、利雅德 RUH、吉達 JED、安曼 AMM、貝魯特 BEY、巴格達 BGW、德黑蘭 IKA）
- [x] 3.4 為歐洲城市加入 `iata` 欄位（倫敦 LHR、巴黎 CDG、法蘭克福 FRA、阿姆斯特丹 AMS、馬德里 MAD、羅馬 FCO、米蘭 MXP、慕尼黑 MUC、蘇黎世 ZRH、維也納 VIE、布魯塞爾 BRU、哥本哈根 CPH、奧斯陸 OSL、斯德哥爾摩 ARN、赫爾辛基 HEL、華沙 WAW、布拉格 PRG、布達佩斯 BUD、雅典 ATH、伊斯坦堡 IST）
- [x] 3.5 為非洲、大洋洲、美洲城市加入 `iata` 欄位（開羅 CAI、奈洛比 NBO、約翰尼斯堡 JNB、拉哥斯 LOS、達累斯薩拉姆 DAR、阿克拉 ACC、亞的斯亞貝巴 ADD、卡薩布蘭卡 CMN、悉尼 SYD、墨爾本 MEL、奧克蘭 AKL、布里斯本 BNE、紐約 JFK、洛杉磯 LAX、舊金山 SFO、芝加哥 ORD、多倫多 YYZ、溫哥華 YVR、墨西哥城 MEX、聖保羅 GRU、布宜諾斯艾利斯 EZE、波哥大 BOG、利馬 LIM、聖地牙哥 SCL）

## 4. 更新搜尋邏輯與下拉顯示

- [x] 4.1 在 `fuzzyMatch` 函式中加入 IATA 比對：`(city.iata && city.iata.toUpperCase() === q.trim().toUpperCase()) || (city.iata && city.iata.toLowerCase().includes(q.toLowerCase()))`
- [x] 4.2 在 Origin 和 Destination 下拉清單的每個 `dropdown-item` 內，在 offset 後加入 IATA badge：`<span v-if="r.iata" class="ml-1.5 text-xs font-mono opacity-60">{{ r.iata }}</span>`
- [x] 4.3 更新搜尋框 placeholder 文字：出發地改為「搜尋城市或機場代號…」、目的地改為「搜尋目的地城市或機場代號…」
