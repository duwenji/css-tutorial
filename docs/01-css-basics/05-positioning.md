# position指定

## この教材で身につくこと

- `position` プロパティの5つの値とその動作
- 座標指定（top/right/bottom/left）の効果
- `z-index` による重なり順の制御
- 実践的な配置パターン

## 概要

`position` プロパティは、要素を通常のドキュメントフローから切り離して
任意の位置に配置するための仕組みです。
CSS Layout Design Guidelines では原則としてflexによる配置を推奨しますが、
モーダルやツールチップなど、例外的に position が必要な場面もあります。

## 基本文法・プロパティ解説

### positionの値

| 値 | 基準 | フロー | 使用例 |
|-----|------|--------|--------|
| `static` (デフォルト) | なし | 通常フロー | デフォルト |
| `relative` | 自身の本来の位置 | 通常フロー維持 | 微調整、absoluteの基準 |
| `absolute` | 最も近いposition指定祖先 | フローから除去 | モーダル、ドロップダウン |
| `fixed` | ビューポート | フローから除去 | 固定ヘッダー、FAB |
| `sticky` | スクロールコンテナ | 通常フロー維持 | 固定ヘッダー（スクロール追従） |

### 座標指定

```css
.element {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* 親要素全体に広がる */
}
```

### z-index

```css
/* 重なり順: 値が大きいほど前面に表示 */
.front { position: relative; z-index: 10; }
.back  { position: relative; z-index: 1; }
/* z-indexはpositionがstatic以外の要素にのみ有効 */
```

## 実ソースコード

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .container { position: relative; width: 300px; height: 200px;
               background: #f0f0f0; margin: 16px; }
  .box { width: 80px; height: 40px; padding: 8px; color: #fff; }
  .relative { position: relative; top: 10px; left: 20px; background: #4a90d9; }
  .absolute { position: absolute; top: 10px; right: 10px; background: #d94a4a; }
  .fixed { position: fixed; bottom: 20px; right: 20px; background: #4ad94a; }
</style>
</head>
<body>
  <div class="container">
    <div class="box">static（通常位置）</div>
    <div class="box relative">relative（本来位置からずらす）</div>
    <div class="box absolute">absolute（親の右上）</div>
  </div>
  <div class="box fixed">fixed（画面右下固定）</div>
</body>
</html>
```

## CSS Layout Guidelines との関連

Layout Design Guidelinesでは、レイアウト全体は flex/grid で構成し、
`position` は補助的にのみ使用する方針です。

```css
/* ❌ Guidelines非推奨: positionで全体レイアウト */
.sidebar { position: fixed; left: 0; top: 0; width: 240px; }
.main { margin-left: 240px; }

/* ✅ Guidelines推奨: flexで全体レイアウト */
.layout { display: flex; height: 100%; }
.sidebar { flex-shrink: 0; width: 240px; }
.main { flex: 1; min-width: 0; }
```

`position: fixed` のようなビューポート基準の配置は、
高さ伝播チェーンを断ち切るため、Guidelinesの原則と競合します。

## 演習課題

1. `position: relative` と `position: absolute` の違いを説明せよ
2. 親要素の中央に子要素を配置するCSSを2通り考えよ
3. stickyが効かない場合の原因を2つ挙げよ

## 理解度チェック

- [ ] positionの5つの値の特徴を説明できる
- [ ] absoluteの配置基準となる要素がどれか説明できる
- [ ] z-indexが効くための条件を説明できる

---

**前へ:** [04-display-property.md](04-display-property.md)  
**次へ:** [../02-flexbox/00-README.md](../02-flexbox/00-README.md)