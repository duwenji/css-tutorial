# 新規コンポーネント追加チェックリスト

## この教材で身につくこと

- レイアウト設計原則の全7項目チェックリストを実践できる
- 新規コンポーネント追加時のレイアウト崩れを事前に防止できる
- コードレビュー時に設計原則準拠を確認できる

## 概要

レイアウト設計原則 第5原則のチェックリストを実践的に使うための教材です。
新規コンポーネントを追加する際、この7項目を確認することで
レイアウト崩れを未然に防ぐことができます。

## 7項目チェックリスト

### チェックリスト全文

- [ ] **1. ルート要素は高さ伝播チェーンに従っているか**
- [ ] **2. flex子要素に `min-height: 0` が設定されているか**
- [ ] **3. 固定高さ(`px`, `vh`, `calc()`)はルート以外で使っていないか**
- [ ] **4. `overflow: hidden` は末端コンテンツの表示を妨げないか**
- [ ] **5. スクロールが必要な領域に `overflow-y: auto` が設定されているか**
- [ ] **6. 10件/30件/50件のデータ量でレイアウトが崩れないか**
- [ ] **7. ウィンドウ高さ 600px/768px/900px/1080px で確認したか**

## 各項目の詳細と確認方法

### 1. ルート要素は高さ伝播チェーンに従っているか

```css
/* 確認: html → body → #root → App → ... の階層で */
/* display: flex; flex-direction: column; height: 100% が適切に設定されているか */

/* ✅ 正しいチェーン */
html, body, #root { height: 100%; }
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
```

**確認方法:** ブラウザ開発者ツールで各要素の Computed Height を確認する。
`height: 100%` が期待通りに伝播しているか、数値が途中で途切れていないかをチェック。

### 2. flex子要素に min-height: 0 が設定されているか

```css
/* ✅ 正しい */
.content {
  flex: 1;
  min-height: 0;       /* ← これがあるか */
  overflow-y: auto;
}

/* ❌ 不足 */
.content {
  flex: 1;
  overflow-y: auto;    /* min-height: 0 がない */
}
```

**確認方法:** コンテンツを50件表示させたとき、親要素を押し広げていないか確認する。

### 3. 固定高さはルート以外で使っていないか

```css
/* ✅ ルートのみ固定値 */
html, body, #root { height: 100%; }

/* ❌ 中間レイヤーでの固定値（禁止） */
.page { height: 500px; }
.panel { height: calc(100vh - 120px); }
.header { height: 60px; } /* ← 推奨: padding等で自然な高さに */
```

**確認方法:** CSSファイル内で `100vh`, `calc(100vh`, 固定 `px` の height を検索し、
html/body/#root 以外で使われていないか確認する。

### 4. overflow: hidden は末端コンテンツの表示を妨げないか

```css
/* ✅ 正しい: パネルラッパーに overflow: hidden */
.panel-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ❌ 誤り: html/body/#root に overflow: hidden */
html, body, #root {
  overflow: hidden;  /* 全画面がスクロール不能に */
}
```

**確認方法:** 画面最下部までスクロールできるか、全コンテンツが表示されるか確認する。

### 5. スクロールが必要な領域に overflow-y: auto が設定されているか

```css
/* ✅ 正しい */
.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;  /* ← これがあるか */
}
```

**確認方法:** コンテンツをあふれさせたとき、スクロールバーが表示されるか確認する。

### 6. データ量でレイアウトが崩れないか

テスト手順:
1. コンテンツを10件表示 → 正常か
2. 30件表示 → スクロールは適切か
3. 50件表示 → 親要素を押し広げていないか

開発者ツールで要素を複製すると簡単にテストできます。

### 7. ウィンドウ高さで確認したか

テスト手順:
1. ブラウザ開発者ツールを開く
2. Responsive Design Mode に切り替え
3. 高さを 600px → 768px → 900px → 1080px と切り替え
4. 各高さでレイアウト崩れがないか確認

## 実践: チェックリストを使ったレビュー例

```html
<!-- レビュー対象のコンポーネント -->
<div class="new-component">
  <div class="new-component__header">タイトル</div>
  <div class="new-component__body">
    <!-- 動的に増えるコンテンツ -->
  </div>
</div>
```

```css
/* レビュー前のCSS */
.new-component {
  height: calc(100vh - 200px);  /* ← 項目3違反 */
}
.new-component__body {
  height: 100%;                 /* ← 項目1違反: flex伝播ではない */
  overflow: hidden;             /* ← 項目4違反: コンテンツが隠れる */
}
```

```css
/* レビュー後の修正CSS */
.new-component {
  display: flex;
  flex-direction: column;
  height: 100%;                 /* ✅ 項目1: flex伝播 */
  min-height: 0;                /* ✅ 項目1: min-height */
}
.new-component__body {
  flex: 1;                      /* ✅ 項目1: flexで伝播 */
  min-height: 0;                /* ✅ 項目2: min-height:0 */
  overflow-y: auto;             /* ✅ 項目4,5: 適切なスクロール */
}
```

## アンチパターン修正マッピング

| # | アンチパターン | チェック項目 | 修正 |
|---|--------------|------------|------|
| 1 | `calc(100vh - 120px)` | 項目3 | flex: 1 + min-height: 0 |
| 2 | `1fr auto` の未調整 | 項目1 | flex比率で制御 |
| 3 | `flex: 0 0 auto` + 固定height | 項目2 | min-height: 0 |
| 4 | 上位層 `overflow: hidden` | 項目4 | 末端のみoverflow |
| 5 | ベース/モディファイアの競合 | 項目6 | 詳細度の統一 |
| 6 | `max-height: none` | 項目2 | min-height: 0 |

## 演習課題

1. 以下のCSSの問題点をチェックリストに照らして指摘せよ
   ```css
   .widget { height: calc(100vh - 80px); overflow: hidden; }
   .widget-content { flex: 1; }
   ```
2. 新規コンポーネント追加時のレビュー手順をフロー図で書け
3. チェックリスト7項目のうち、最も見落としやすい項目はどれか、理由とともに答えよ

## 理解度チェック

- [ ] 7項目のチェックリストを暗唱できる
- [ ] 各項目の具体的な確認方法を説明できる
- [ ] アンチパターンを見つけて修正できる
- [ ] 自分のコードをチェックリストで自己レビューできる

---

**前へ:** [03-responsive-layout.md](03-responsive-layout.md)  
**次へ:** [../05-real-world-examples/00-README.md](../05-real-world-examples/00-README.md)