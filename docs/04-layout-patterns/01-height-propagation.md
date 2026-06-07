# 高さ伝播レイヤー設計

## この教材で身につくこと

- 高さ伝播チェーンの設計原則を理解する
- `flex: 1` + `min-height: 0` による正しい高さ伝播を実装できる
- 固定値（`100vh`, `calc()`）の危険性を理解する
- レイヤー構成図を読み解き、自身で設計できる

## 概要

CSS Layout Design Guidelines の第1章「高さ伝播レイヤーの設計原則」の実践教材です。
レイアウト崩れの根本原因の多くは、高さの伝播方法に起因します。
ここで正しい設計パターンを身につけます。

## レイヤー構成図（Guidelinesより再掲）

```
html/body/#root        → height: 100%          ← ルート制約（唯一の固定値）
  └── .App             → display: flex; flex-direction: column; height: 100%
        ├── header     → flex-shrink: 0          ← 固定高さ要素
        └── main       → flex: 1; overflow: auto; min-height: 0  ← スクロール境界
              └── page → height: 100%; display: flex; flex-direction: column; min-height: 0
                    ├── top-row  → flex-shrink: 0
                    └── root     → flex: 1; min-height: 0
```

## 4つの原則（Guidelines準拠）

### 原則1: 固定値はルートのみ

```css
/* ✅ 良い: 固定値は html/body/#root のみ */
html, body, #root {
  height: 100%;
}

/* ❌ 悪い: 中間レイヤーでの固定値 */
.page {
  height: calc(100vh - 120px); /* 禁止！ */
}
```

**なぜ禁止か:**
- ヘッダー高さの変更に追従できない
- モバイルのアドレスバー表示/非表示でビューポート高さが変わる
- `100vh` はモバイルブラウザで誤差が大きい

### 原則2: 伝播はflex

```css
/* ✅ 良い: flex で高さを伝播 */
.parent {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.child {
  flex: 1;
  min-height: 0;
}

/* ❌ 悪い: height: 100% だけでは不十分 */
.parent {
  /* display, height の明示なし */
}
.child {
  height: 100%; /* 親の高さが未定義だと効かない */
}
```

### 原則3: min-height: 0 必須

flex子要素のデフォルト `min-height: auto` は、コンテンツの最小サイズを
保証しようとして親を押し広げます。`min-height: 0` でこの挙動を打ち消します。

```css
.content {
  flex: 1;
  min-height: 0;      /* ← 必須 */
  overflow-y: auto;   /* ← スクロール境界 */
}
```

### 原則4: overflowは末端のみ

```css
/* ❌ 悪い: 上位層に overflow: hidden */
html, body, #root {
  overflow: hidden;   /* 下位の内容が完全に隠れる */
}

/* ✅ 良い: overflowはコンテンツ末端にのみ */
.content-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;   /* 実際のスクロール箇所 */
}
```

## 実ソースコード: 完全なレイヤー実装

```html
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* 原則1: 固定値はルートのみ */
  html, body, #root { height: 100%; }
  body { font-family: sans-serif; }

  /* 原則2: flexで伝播 */
  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* 固定ヘッダー */
  .app-header {
    flex-shrink: 0;
    background: #1a1a2e;
    color: #fff;
    padding: 16px 24px;
  }

  /* スクロール境界 */
  .app-main {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  /* 内部ページ */
  .page {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .page-header {
    flex-shrink: 0;
    background: #16213e;
    color: #fff;
    padding: 12px 24px;
  }

  .page-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 24px;
  }

  /* コンテンツ量の確認用 */
  .dummy-item {
    background: #e0e0e0;
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 4px;
  }
</style>
</head>
<body>
  <div id="root">
    <div class="app">
      <header class="app-header">App ヘッダー（flex-shrink: 0）</header>
      <main class="app-main">
        <div class="page">
          <div class="page-header">ページヘッダー（flex-shrink: 0）</div>
          <div class="page-content">
            <div class="dummy-item">コンテンツ 1</div>
            <div class="dummy-item">コンテンツ 2</div>
            <div class="dummy-item">コンテンツ 3</div>
            <!-- 30個まで増やしてもレイアウトは崩れない -->
            <div class="dummy-item">コンテンツ 30</div>
          </div>
        </div>
      </main>
    </div>
  </div>
</body>
</html>
```

## Guidelinesのアンチパターンと修正

| # | 問題 | 原因 | 修正 |
|---|------|------|------|
| 1 | 縦幅が大きすぎる | `calc(100vh - 120px)` | flex: 1 + min-height: 0 |
| 2 | チャット比率不適切 | `1fr auto` | flex比率で制御 |
| 3 | textareaレイアウト崩れ | `flex: 0 0 auto` | min-height: 0 |
| 4 | 画面下部が隠れる | 上位層overflow:hidden | 末端のみoverflow |

## 演習課題

1. 以下のCSSの問題点を指摘し、修正せよ
   ```css
   .page { height: calc(100vh - 60px); overflow: hidden; }
   .content { height: 100%; }
   ```
2. 3階層のflexネストで、各層に正しく `min-height: 0` が設定されているか確認する方法を答えよ

## 理解度チェック

- [ ] 固定値をルート以外で使ってはいけない理由を説明できる
- [ ] flex + min-height: 0 の組み合わせが必要な理由を説明できる
- [ ] レイヤー構成図を自分で描ける
- [ ] 10件/30件/50件のデータ量で崩れないレイアウトを組める

---

**前へ:** [00-README.md](00-README.md)  
**次へ:** [02-scroll-strategy.md](02-scroll-strategy.md)