## Context

Safari/WebKit 的 `backdrop-filter` 使用 GPU 合成層（compositing layer）快取背後的畫面。問題發生時序：

1. App 初始為淺色主題 → body 淡色背景被快取進 `.lg-glass` 的 backdrop layer
2. 切換深色主題 → `#app` class 改為 `theme-dark`
3. `.lg-glass` 的 `background` CSS 更新為 `rgba(30,30,40,0.72)`（正確）
4. 但 backdrop layer 仍持有舊的淡色快取 → 視覺結果：灰色而非深色

現有 Cypress 測試（`glass-card-transition.cy.js`）驗證的是 `getComputedStyle().backgroundColor`，這是 CSSOM 的宣告值，不包含 backdrop-filter 的合成結果，因此無法偵測此問題。

## Goals / Non-Goals

**Goals:**
- 消除深色模式玻璃卡片的 backdrop-filter 快取問題
- 新增 Cypress 測試，可持續驗證 backdrop-filter 行為是否正確

**Non-Goals:**
- 不修改淺色模式的 backdrop-filter（`blur(16px)` 在淺色背景下快取無問題）
- 不追求視覺截圖比對（環境差異大，維護成本高）

## Decisions

**決策 1：深色模式停用 backdrop-filter**

```css
.theme-dark .lg-glass {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
```

- 深色玻璃的視覺效果主要靠 `background: rgba(30,30,40,0.72)` + `border` + `box-shadow`，blur 效果貢獻有限
- 停用後深色模式的卡片外觀幾乎不變，但根本消除快取問題

替代方案 A：`will-change: backdrop-filter` → 強制重新合成，但可能造成大量重繪，且行為在不同 Safari 版本不一致，拒絕。

替代方案 B：JS 切換主題時短暫 toggle backdrop-filter → hack，維護性差，拒絕。

替代方案 C：截圖比對測試 → 環境差異大（OS 字體 rendering、顏色設定），CI 不穩定，拒絕。

**決策 2：Cypress 驗證 `backdropFilter` computed 值**

`getComputedStyle(el).backdropFilter`（或 `-webkit-backdrop-filter`）能直接驗證「深色模式是否為 none」。這個代理指標直接對應 Safari 快取問題的修復機制，且在所有瀏覽器環境下均可穩定測試。

測試策略：
- 強制 `#app` class 為 `theme-dark`，取 `.lg-glass` 的 `backdropFilter`，應為 `none`
- 強制 `#app` class 為 `theme-light`，取 `.lg-glass` 的 `backdropFilter`，應含 `blur`
- 新增至現有 `cypress/e2e/glass-card-transition.cy.js` 的 CSS Architecture describe 區塊

## Risks / Trade-offs

- 深色模式停用 backdrop-filter 後，若卡片後方有高對比內容（罕見，因 body 本身是深色），可能略微影響卡片邊界清晰度 → body 深色背景下視覺差異極小，可接受
- Cypress 在 Electron（Chrome）測試，而 bug 發生在 Safari → 這是已知限制。測試的是「修復機制是否到位」（backdrop-filter:none），而非「Safari 的視覺合成結果」
