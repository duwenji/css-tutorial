# セレクタと詳細度

## この教材で身につくこと

- CSSセレクタの種類と使い分け
- 詳細度（Specificity）の計算方法
- スタイル衝突時の優先順位の理解

## 概要

CSSセレクタは「どの要素にスタイルを適用するか」を指定する仕組みです。
複数のルールが同じ要素に適用される場合、詳細度によって優先順位が決まります。

## 基本文法・プロパティ解説

### セレクタの種類

| セレクタ | 記法 | 例 | 詳細度 |
|----------|------|-----|--------|
| ユニバーサル | `*` | `* {}` | 0,0,0,0 |
| 要素型 | `要素名` | `div {}` | 0,0,0,1 |
| クラス | `.クラス名` | `.panel {}` | 0,0,1,0 |
| ID | `#ID名` | `#root {}` | 0,1,0,0 |
| インライン | `style=""` | `<div style="">` | 1,0,0,0 |

### 詳細度の計算ルール

```
a, b, c, d
│  │  │  └─ 要素型セレクタ・擬似要素
│  │  └──── クラスセレクタ・属性セレクタ・擬似クラス
│  └─────── IDセレクタ
└────────── インラインスタイル
```

数値は桁上がりしない独立したカテゴリです（0,0,2,0 は 0,0,1,1 より常に強い）。

### 疑似クラスと疑似要素

**疑似クラス** `:` は要素の**状態**に基づいてスタイルを適用します。詳細度はクラスセレクタと同じ **(0,0,1,0)** です。

| 疑似クラス | 意味 | 例 |
|------------|------|-----|
| `:hover` | マウスが乗っている | `a:hover { color: red; }` |
| `:focus` | フォーカスされている | `input:focus { outline: 2px solid blue; }` |
| `:first-child` | 最初の子要素 | `li:first-child { font-weight: bold; }` |
| `:nth-child(n)` | n番目の子要素 | `tr:nth-child(2n) { background: #eee; }` |

**疑似要素** `::` は要素の**特定の部分**にスタイルを適用します。詳細度は要素型セレクタと同じ **(0,0,0,1)** です。

| 疑似要素 | 意味 | 例 |
|----------|------|-----|
| `::before` | 要素の前に仮想要素を挿入 | `p::before { content: "→ "; }` |
| `::after` | 要素の後に仮想要素を挿入 | `p::after { content: " ←"; }` |
| `::first-line` | 最初の行 | `p::first-line { font-weight: bold; }` |
| `::first-letter` | 最初の文字 | `p::first-letter { font-size: 2em; }` |
| `::placeholder` | プレースホルダー文字列 | `input::placeholder { color: #999; }` |

> **覚え方:** 疑似クラスは**状態**（`:hover` / `:nth-child`）、疑似要素は**部分**（`::before` / `::first-line`）

### 複合セレクタの例

```css
/* 詳細度 0,0,0,1 */
div { color: black; }

/* 詳細度 0,0,1,0 */
.panel { color: blue; }

/* 詳細度 0,0,1,1 */
div.panel { color: green; }

/* 詳細度 0,1,0,0 */
#root { color: red; }
```

## 実ソースコード

```html
<!DOCTYPE html>
<html>
<head>
<style>
  /* 詳細度 0,0,0,1 */
  p { color: red; }

  /* 詳細度 0,0,1,0 — こちらが勝つ */
  .text { color: blue; }

  /* 詳細度 0,1,0,0 — IDが最優先 */
  #highlight { color: green; }

  /* 詳細度 0,0,1,1 — div + classより強い */
  p.text { font-weight: bold; }
</style>
</head>
<body>
  <p class="text" id="highlight">このテキストは緑色で太字</p>
  <p>このテキストは赤色</p>
  <p class="text">このテキストは青色で太字</p>
</body>
</html>
```

## CSS Layout Guidelines との関連

Guidelinesでは「ベース + モディファイア」パターンを推奨しています。
詳細度が高すぎると上書きが困難になるため、IDセレクタよりクラスセレクタを基本とします。

```css
/* ✅ 良い: クラスベースで詳細度を揃える */
.panel { border: 1px solid #ccc; }
.panel--compact { max-height: 260px; }

/* ❌ 悪い: IDとクラスが混在し上書き困難 */
#panel { border: 1px solid #ccc; }
.panel--compact { max-height: 260px; }
```

## 演習課題

1. 以下のスタイルが適用される優先順位を答えよ
   - `div.content p span`
   - `#article .highlight`
2. 詳細度が0,0,1,2になるセレクタを1つ書け

## 理解度チェック

- [ ] クラスセレクタとIDセレクタの詳細度の大小が説明できる
- [ ] 詳細度が等しい場合、どちらのスタイルが適用されるか説明できる
- [ ] なぜIDセレクタよりクラスセレクタが推奨されるか説明できる

---

**前へ:** [00-README.md](00-README.md)  
**次へ:** [02-box-model.md](02-box-model.md)