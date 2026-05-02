## Context

WCAG AA 要求普通文字（<18px）對比度 ≥ 4.5:1。淺色模式的白色玻璃卡片有效背景約 #fdfeff（`rgba(255,255,255,0.90)` over `#f0f6ff`）。

對比度現況：
- `text-slate-400` (#94a3b8)：對比度 2.85:1 — FAIL
- `text-slate-500` (#64748b)：對比度 4.10:1 — FAIL
- `text-slate-600` (#475569)：對比度 5.74:1 — PASS
- `text-slate-700` (#334155)：對比度 8.59:1 — PASS

## Goals / Non-Goals

**Goals:**
- 所有普通次要文字在淺色模式達到 WCAG AA（4.5:1）
- 保留視覺層次感：主要文字仍比次要文字更深

**Non-Goals:**
- 不調整深色模式文字（深色背景下 `text-white/50` = ~7.4:1，已達標）
- 不追求 WCAG AAA（7:1）——維持次要文字的「輕量」感即可
- 不改變 CSS 或新增 class

## Decisions

**決策：統一升級策略**
- `text-slate-400` → `text-slate-600`（跳過 500，因為 500 也 FAIL，一次到位）
- `text-slate-500` → `text-slate-600`（一步升級至 PASS 門檻）
- 例外：在 `isDark` 條件下的 dark-mode 分支維持原樣（`text-white/50`、`text-white/40`）
- 例外：`opacity-40` + decorative icon 不計入可讀性需求

## Risks / Trade-offs

- 升級後次要文字（`text-slate-600`）與主要文字（`text-slate-800`）的對比差縮小，視覺層次略降低，但仍有明顯差距（5.74 vs 14.7）
- `text-slate-400` 的「超淡」風格消失，不再有「ghost text」效果 — 但這在 WCAG 角度是必要犧牲
