# カスケードと継承

## この教材で身につくこと

- カスケードの優先順位（出所・詳細度・出現順）を理解する
- 継承されるプロパティとされないプロパティの区別
- `inherit` / `initial` / `unset` / `revert` キーワードの使い方

## 概要

CSSの「C」はCascade（カスケード）の略です。
複数のスタイル宣言が競合したとき、どの宣言が勝つかはカスケードルールで決まります。
また、一部のプロパティは親から子へ自動的に継承されます。

## 基本文法・プロパティ解説

### カスケードの優先順位

```
1. 出所（Origin）: ユーザーエージェント < ユーザー < 作成者
2. 詳細度（Specificity）: a,b,c,d で比較
3. 出現順（Order）: 後から書いたものが勝つ（!importantを除く）
4. !important: 最優先（ただし乱用禁止）
```

### 継承されるプロパティ（例）

| プロパティ | 継承 |
|-----------|------|
| `color` | ✅ 継承される |
| `font-family` | ✅ 継承される |
| `font-size` | ✅ 継承される |
| `line-height` | ✅ 継承される |
| `text-align` | ✅ 継承される |
| `margin` | ❌ 継承されない |
| `padding` | ❌ 継承されない |
| `border` | ❌ 継承されない |
| `width` / `height` | ❌ 継承されない |
| `display` | ❌ 継承されない |

### 継承制御キーワード

```css
.child {
  color: inherit;   /* 親の値を強制継承 */
  width: initial;   /* プロパティの初期値にリセット */
  margin: unset;    /* 継承プロパティならinherit、非継承ならinitial */
  display: revert;  /* ブラウザデフォルトに戻す */
}
```

## 実ソースコード

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .parent {
    color: #333;
    font-size: 18px;
    border: 2px solid #666;
    padding: 16px;
  }
  /* color/font-sizeは継承されるが、border/paddingは継承されない */
  .child {
    /* 明示的にborderを受け取りたい場合 */
    border: inherit;
  }
</style>
</head>
<body>
  <div class="parent">
    親要素: 色・フォントサイズは継承される
    <div class="child">
      子要素: 色とフォントサイズは親から継承。borderはinherit指定
    </div>
  </div>
</body>
</html>
```

## CSS Layout Guidelines との関連

Guidelinesの「ベース + モディファイア」パターンは、カスケードと詳細度の理解が前提です。

```css
/* ✅ 良い: ベースの詳細度を低く保ち、モディファイアで差分のみ */
.panel {
  border: 1px solid #ccc;
  overflow-y: auto;
}
.panel--compact {
  max-height: 260px;
}
/* .panel--compact の後ろに書くことで出現順でも勝つ */
```

モディファイアで `max-height: none` のような「制約解除」を避けるべき理由は、
カスケードでは解除が元の値の復元を意味せず、無制限を意味するからです。

## 演習課題

1. 継承されるプロパティを3つ、継承されないプロパティを3つ挙げよ
2. `inherit` と `initial` の動作の違いを説明せよ
3. 次の2つのルールのうち、どちらが優先されるか
   - `.box { color: red; }`
   - `div { color: blue !important; }`

## 理解度チェック

- [ ] カスケードの3段階の優先順位（出所 → 詳細度 → 出現順）が説明できる
- [ ] colorが継承され、borderが継承されない理由を説明できる
- [ ] inherit / initial / unset / revert の使い分けが説明できる

---

**前へ:** [02-box-model.md](02-box-model.md)  
**次へ:** [04-display-property.md](04-display-property.md)