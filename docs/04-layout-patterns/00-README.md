# 04. Layout Patterns - CSS Layout Design Guidelines 実践

このカテゴリでは、[css-layout-guidelines.md](../../css-layout-guidelines.md) の全原則を実践的に理解し、活用できるようになることを目指します。

## 学習目標

- 高さ伝播レイヤーの設計原則を理解し実装できる
- スクロール戦略を適切に設計できる
- レスポンシブ対応の基本パターンを習得する
- 新規コンポーネント追加時のチェックリストを活用できる

## 中核となるGuidelines

> 本カテゴリは **CSS Layout Design Guidelines** の各章を教材化したものです。

| Guidelines章 | 対応教材 | 核心原則 |
|-------------|---------|---------|
| 1. 高さ伝播レイヤー | [01-height-propagation.md](01-height-propagation.md) | 固定値はルートのみ / 伝播はflex / min-height:0必須 |
| 2. Flexbox必須ルール | （02-flexboxで既習） | flex子要素にはmin-height:0 / flex-shrink:0 |
| 3. スクロール戦略 | [02-scroll-strategy.md](02-scroll-strategy.md) | overflowは末端のみ / 境界にoverflow:hidden |
| 4. 詳細度・継承 | （01-css-basicsで既習） | ベース＋モディファイアパターン |
| 5. チェックリスト | [04-component-checklist.md](04-component-checklist.md) | 7項目の確認手順 |

## 教材一覧

| # | 教材 | 内容 |
|---|------|------|
| 01 | [高さ伝播レイヤー設計](01-height-propagation.md) | flex + min-height:0 による縦方向伝播 |
| 02 | [スクロール戦略](02-scroll-strategy.md) | overflowの適切な配置とスクロール境界 |
| 03 | [レスポンシブ対応](03-responsive-layout.md) | メディアクエリと可変レイアウト |
| 04 | [コンポーネントチェックリスト](04-component-checklist.md) | 新規追加時の7項目確認手順 |

---

**前へ:** [../03-grid/03-grid-exercises.md](../03-grid/03-grid-exercises.md)  
**次へ:** [01-height-propagation.md](01-height-propagation.md)