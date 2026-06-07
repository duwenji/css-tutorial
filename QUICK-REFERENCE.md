# CSS クイックリファレンス

チュートリアル全体で扱うCSSプロパティと概念の早見表です。

## Flexbox 主要プロパティ

| プロパティ | 対象 | 役割 | 代表値 |
|-----------|------|------|--------|
| `display: flex` | コンテナ | flexコンテナ化 | flex, inline-flex |
| `flex-direction` | コンテナ | 主轴の方向 | row, column |
| `justify-content` | コンテナ | 主軸方向の配置 | center, space-between, flex-start |
| `align-items` | コンテナ | 交差軸方向の配置 | center, stretch, flex-start |
| `flex` | アイテム | 伸縮比率 | 1, 0 0 auto |
| `flex-shrink` | アイテム | 縮小抑制 | 0 (縮まない) |
| `min-height: 0` | アイテム | flexデフォルト上書き | 0 |
| `overflow` | アイテム | オーバーフロー制御 | auto, hidden, scroll |

## CSS Grid 主要プロパティ

| プロパティ | 対象 | 役割 | 代表値 |
|-----------|------|------|--------|
| `display: grid` | コンテナ | gridコンテナ化 | grid, inline-grid |
| `grid-template-columns` | コンテナ | 列定義 | 1fr 2fr, repeat(3, 1fr) |
| `grid-template-rows` | コンテナ | 行定義 | auto, 1fr, min-content |
| `gap` | コンテナ | セル間隔 | 16px, 1rem |
| `grid-column` | アイテム | 列の占有範囲 | span 2, 1 / 3 |
| `grid-row` | アイテム | 行の占有範囲 | span 2 |

## Layout Guidelines 核心ルール

| # | 原則 | 内容 |
|---|------|------|
| 1 | 固定値はルートのみ | `100vh`/`calc()` は html/body/#root 以外禁止 |
| 2 | 伝播はflex | 高さ伝播には `flex: 1` を使用 |
| 3 | min-height: 0必須 | flex子要素には必ず設定 |
| 4 | overflowは末端のみ | スクロールは末端レイヤーに設定 |
| 5 | flex-shrink: 0 | 固定高さ要素の縮小防止 |
| 6 | overflow: hidden | スクロール境界の明示に使用 |

## スクロールレイヤー設計

```
html/body/#root  →  overflowなし（ブラウザ任せ）
  └── main       →  overflow: auto（最終境界）
        └── panel-wrapper → overflow: hidden（内部スクロール境界）
              └── content → overflow-y: auto（実際のスクロール箇所）