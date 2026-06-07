# CSS Layout Design Guidelines

> 本ドキュメントは AIスタジオV2 のレイアウト修正で得られた知見を体系化したものです。
> 新規コンポーネント追加時の参照用として使用してください。

---

## 1. 高さ伝播レイヤーの設計原則

### レイヤー構成図

```
html/body/#root        → height: 100%          ← ルート制約（唯一の固定値）
  └── .App             → display: flex; flex-direction: column; height: 100%
        ├── header     → flex-shrink: 0          ← 固定高さ要素
        └── main       → flex: 1; overflow: auto; min-height: 0  ← スクロール境界
              └── page → height: 100%; display: flex; flex-direction: column; min-height: 0
                    ├── top-row  → flex-shrink: 0
                    └── root     → flex: 1; min-height: 0
                          ├── section → height: 100%; display: flex; flex-direction: column
                          │     └── content → flex: 1; min-height: 0; overflow-y: auto
                          └── section → height: 100%; display: grid; min-height: 0
                                ├── panel → overflow: hidden; display: flex; flex-direction: column; min-height: 0
                                │     └── messages → flex: 1; min-height: 0; overflow-y: auto
                                └── panel → overflow: hidden; display: flex; flex-direction: column; min-height: 0
                                      └── textarea → flex: 1; min-height: 60px
```

### 原則

| 原則 | 説明 | 禁止事項 |
|------|------|----------|
| 固定値はルートのみ | `height: 100vh` や `calc()` は html/body/#root 以外で使わない | `.page` に `calc(100vh - 120px)` のような固定値 |
| 伝播は flex | 子要素への高さ伝播は `flex: 1` を使用 | `height: 100%` だけでは伝播しないケースあり |
| min-height: 0 必須 | flex 子要素には必ず `min-height: 0` を設定 | デフォルトの `min-height: auto` はコンテンツサイズに拡張する |
| overflow は末端のみ | スクロールはコンテンツが溢れる末端レイヤーにのみ設定 | 上位レイヤーへの `overflow: hidden` |

---

## 2. Flexbox 必須ルール

### ルール1: flex子要素には `min-height: 0` を付与する

**理由:** flex子要素のデフォルト `min-height: auto` は、コンテンツの最小サイズを保証しようとする。
これにより `flex: 1` を指定してもコンテンツ量に応じて拡張し、親を押し広げてしまう。

```css
/* ❌ 悪い例 */
.studio-v2-candidates--default {
  flex: 1;
  max-height: none; /* 無制限に拡張される */
}

/* ✅ 良い例 */
.studio-v2-candidates--default {
  flex: 1;
  min-height: 0; /* 親の制約内に収まる */
}
```

### ルール2: 固定サイズは flex-shrink: 0 で保護する

```css
/* ✅ ヘッダーなど固定高さ要素 */
header {
  flex-shrink: 0; /* 縮まない */
}
```

### ルール3: `height: 100%` だけに頼らない

```css
/* ❌ 不完全（親が明示的な高さを持たない場合に無効） */
.child {
  height: 100%;
}

/* ✅ flex と組み合わせる */
.parent {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.child {
  flex: 1;
  min-height: 0;
}
```

---

## 3. スクロール戦略

### 基本方針

| レイヤー | overflow設定 | 目的 |
|----------|-------------|------|
| html/body/#root | 設定しない | ブラウザデフォルトのスクロール挙動に任せる |
| ページコンテナ (main) | `overflow: auto` | 全体が溢れた場合の最終スクロール境界 |
| パネルラッパー | `overflow: hidden` | 内部でのみスクロールさせるための境界 |
| コンテンツ領域 | `overflow-y: auto` | 実際のスクロール発生箇所 |

### アンチパターン

```css
/* ❌ 上位層に overflow: hidden を設定すると下位の内容が完全に隠れる */
html, body, #root {
  height: 100%;
  overflow: hidden; /* 禁止 */
}
```

---

## 4. CSS 詳細度・継承の注意点

### ベース + モディファイアパターン

```css
/* ベース: 共通プロパティのみ */
.panel {
  border: 1px solid #ccc;
  overflow-y: auto;
}

/* モディファイア: 差分のみ。ベースのプロパティを打ち消さない */
.panel--compact {
  max-height: 260px;     /* OK */
}
.panel--full {
  flex: 1;
  min-height: 0;
  /* ❌ max-height: none はベースの制約を壊す可能性がある */
}
```

**原則:** モディファイアで `max-height: none` や `overflow: visible` のような「制約解除」は避ける。

---

## 5. 新規コンポーネント追加時のチェックリスト

- [ ] ルート要素は高さ伝播チェーンに従っているか
- [ ] flex子要素に `min-height: 0` が設定されているか
- [ ] 固定高さ(`px`, `vh`, `calc()`)はルート以外で使っていないか
- [ ] `overflow: hidden` は末端コンテンツの表示を妨げないか
- [ ] スクロールが必要な領域に `overflow-y: auto` が設定されているか
- [ ] 10件/30件/50件のデータ量でレイアウトが崩れないか
- [ ] ウィンドウ高さ 600px/768px/900px/1080px で確認したか

---

## 6. 参考: AIスタジオV2 で発生した問題と修正履歴

| # | 問題 | 根本原因 | 適用した原則 |
|---|------|----------|-------------|
| 1 | 縦幅が大きすぎてスクロール必要 | 固定値 `calc(100vh - 120px)` の使用 | 原則1: 固定値はルートのみ |
| 2 | チャット比率不適切 | `1fr auto` の未調整 | 原則1: flex比率で制御 |
| 3 | textareaレイアウト崩れ | `flex: 0 0 auto` + 固定height | ルール1: min-height: 0 |
| 4 | 画面下部が完全に隠れる | 上位層への `overflow: hidden` | スクロール戦略 |
| 5 | 銘柄一覧の高さ不安定 | ベースとモディファイアのmax-height競合 | 詳細度・継承の注意点 |
| 6 | 多件数でレイアウト崩れ | `max-height: none` の無制限拡張 | ルール1: min-height: 0 |

---

*最終更新: 2026-06-07*