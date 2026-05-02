## 1. CSS 修復

- [x] 1.1 在 `index.html` 的 `.theme-dark .lg-glass` CSS 規則加入 `backdrop-filter: none; -webkit-backdrop-filter: none;`

## 2. Cypress 測試

- [x] 2.1 在 `cypress/e2e/glass-card-transition.cy.js` 的「Glass Card - CSS Architecture」describe 區塊，新增測試：深色模式下 `.lg-glass` 的 `backdropFilter`（或 `webkitBackdropFilter`）computed 值為 `none` 或空字串
- [x] 2.2 新增測試：淺色模式下 `.lg-glass` 的 `backdropFilter` 包含 `blur`
- [x] 2.3 執行 `npx cypress run` 確認新舊測試全部通過（7 + 2 = 9 tests passing）
