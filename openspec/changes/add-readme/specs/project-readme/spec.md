## ADDED Requirements

### Requirement: 專案 README 文件
專案根目錄 SHALL 包含 `README.md`，提供足以讓新訪客理解與使用本應用程式的說明。

#### Scenario: 文件存在
- **WHEN** 訪客造訪 GitHub 儲存庫
- **THEN** 首頁顯示 README 內容，包含專案名稱與簡介段落

#### Scenario: 功能說明完整
- **WHEN** 使用者閱讀 README
- **THEN** 能了解應用程式的主要功能（時區設定、飛行時間追蹤、時差建議）

#### Scenario: 本地端開發啟動說明
- **WHEN** 開發者想在本機執行專案
- **THEN** README 提供明確的啟動指令（如 `python3 -m http.server`）

#### Scenario: 無 emoji
- **WHEN** README 顯示
- **THEN** 全文不含任何 emoji 字元
