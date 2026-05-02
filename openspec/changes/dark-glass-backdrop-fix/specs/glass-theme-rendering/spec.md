## MODIFIED Requirements

### Requirement: App 深色模式 Glass 卡片外觀
系統 SHALL 確保 `.lg-glass` 卡片在深色模式（`isDark === true`）下正確顯示深色半透明外觀，不受瀏覽器 GPU 合成層快取影響。深色模式下 `backdrop-filter` SHALL 設為 `none` 以消除 Safari/WebKit 的快取問題。

#### Scenario: App 深色模式卡片背景
- **WHEN** App `timeSegment` 為 `sleep` 或 `dusk`（`isDark === true`）
- **THEN** 所有 `.lg-glass` 卡片顯示深色半透明背景（`rgba(30,30,40,0.72)`）
- **THEN** 卡片視覺上與深色 body 背景融合，不顯示灰色或淡色

#### Scenario: 深色模式停用 backdrop-filter
- **WHEN** `#app` 具有 `theme-dark` class
- **THEN** `.lg-glass` 元素的 `backdrop-filter` computed 值為 `none`（Cypress 可驗證）

#### Scenario: 淺色模式保留 backdrop-filter
- **WHEN** `#app` 具有 `theme-light` class
- **THEN** `.lg-glass` 元素的 `backdropFilter` computed 值包含 `blur`（Cypress 可驗證）

## ADDED Requirements

### Requirement: Cypress 驗證深色模式 backdrop-filter
系統的 Cypress 測試 SHALL 驗證深色模式下 `.lg-glass` 的 `backdrop-filter` 為 `none`，淺色模式下含 `blur`，以確保 Safari GPU 快取修復機制持續有效。

#### Scenario: Cypress 驗證深色模式
- **WHEN** Cypress 強制 `#app` class 為 `theme-dark`
- **THEN** `getComputedStyle('.lg-glass').backdropFilter` 或 `webkitBackdropFilter` 回傳 `none` 或空字串

#### Scenario: Cypress 驗證淺色模式
- **WHEN** Cypress 強制 `#app` class 為 `theme-light`
- **THEN** `getComputedStyle('.lg-glass').backdropFilter` 或 `webkitBackdropFilter` 包含 `blur`
