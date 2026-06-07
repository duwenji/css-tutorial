# チャットUIレイアウト

## この教材で身につくこと

- Guidelinesに準拠したチャットUIのレイアウト構築
- メッセージリスト＋入力欄の典型的なスクロール設計
- 複数スクロール境界の適切な設定
- AIスタジオV2で発生した問題の再現と修正

## 概要

チャットUIはCSS Layout Design Guidelinesが最も活きるレイアウトの一つです。
メッセージリストのスクロール、入力エリアの固定、パネル分割など、
Guidelinesの全原則を適用する必要があります。

## レイアウト構造

```
┌──────────────────────────────────┐
│         チャットヘッダー          │ ← flex-shrink: 0
├──────────────────────────────────┤
│                                  │
│      メッセージリスト              │
│                                  │ ← flex: 1; min-height: 0; overflow-y: auto
│  （ここだけスクロール）            │
│                                  │
│                                  │
├──────────────────────────────────┤
│  [テキスト入力エリア]  [送信]      │ ← flex-shrink: 0
└──────────────────────────────────┘
```

## 実ソースコード

```html
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: sans-serif; }

  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 800px;
    margin: 0 auto;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }

  /* ヘッダー */
  .chat-header {
    flex-shrink: 0;
    background: #1a1a2e;
    color: #fff;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .chat-header__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #4a90d9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  /* メッセージリスト — スクロール領域 */
  .message-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px;
    background: #f5f6fa;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .message {
    display: flex;
    gap: 12px;
    max-width: 80%;
  }

  .message--incoming {
    align-self: flex-start;
  }

  .message--outgoing {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .message__avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .message--incoming .message__avatar {
    background: #e0e0e0;
  }

  .message--outgoing .message__avatar {
    background: #4a90d9;
    color: #fff;
  }

  .message__bubble {
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 15px;
    line-height: 1.5;
  }

  .message--incoming .message__bubble {
    background: #fff;
    border-top-left-radius: 4px;
  }

  .message--outgoing .message__bubble {
    background: #4a90d9;
    color: #fff;
    border-top-right-radius: 4px;
  }

  /* 入力エリア — 固定 */
  .chat-input {
    flex-shrink: 0;
    background: #fff;
    border-top: 1px solid #e0e0e0;
    padding: 16px 20px;
    display: flex;
    gap: 12px;
  }

  .chat-input__field {
    flex: 1;
    min-height: 44px;
    max-height: 120px;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    resize: none;
    outline: none;
    font-family: inherit;
  }

  .chat-input__field:focus {
    border-color: #4a90d9;
  }

  .chat-input__send {
    flex-shrink: 0;
    background: #4a90d9;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 15px;
    cursor: pointer;
  }

  .chat-input__send:hover {
    background: #357abd;
  }
</style>
</head>
<body>
  <div id="root">
    <div class="app">
      <header class="chat-header">
        <div class="chat-header__avatar">AI</div>
        <div>
          <div style="font-weight: bold;">AI アシスタント</div>
          <div style="font-size: 13px; opacity: 0.7;">オンライン</div>
        </div>
      </header>

      <div class="message-list">
        <!-- メッセージを50件に増やしてもスクロール可能 -->
        <div class="message message--incoming">
          <div class="message__avatar">AI</div>
          <div class="message__bubble">こんにちは！どのようなお手伝いができますか？</div>
        </div>
        <div class="message message--outgoing">
          <div class="message__avatar">You</div>
          <div class="message__bubble">CSSレイアウトについて教えてください</div>
        </div>
        <div class="message message--incoming">
          <div class="message__avatar">AI</div>
          <div class="message__bubble">
            CSS Layout Design Guidelinesでは、高さ伝播にflexを使い、固定値はルートのみに制限します。
            また、flex子要素には必ずmin-height: 0を設定します。
          </div>
        </div>
      </div>

      <div class="chat-input">
        <textarea class="chat-input__field"
                  placeholder="メッセージを入力..."
                  rows="2"></textarea>
        <button class="chat-input__send">送信</button>
      </div>
    </div>
  </div>
</body>
</html>
```

## Guidelines 適用ポイント

### Guidelines レイヤー構成図との対応

```
html/body/#root        → height: 100%
  └── .app             → display: flex; flex-direction: column; height: 100%
        ├── .chat-header   → flex-shrink: 0
        ├── .message-list  → flex: 1; min-height: 0; overflow-y: auto
        └── .chat-input    → flex-shrink: 0
```

### AIスタジオV2で発生した問題と本実装での防止

| # | 問題 | Guidelines原因 | 本実装 |
|---|------|--------------|--------|
| 1 | 縦幅が大きすぎる | `calc(100vh - 120px)` | `flex: 1` + `min-height: 0` |
| 3 | textareaレイアウト崩れ | `flex: 0 0 auto` + 固定height | `flex: 1` + `min-height: 44px` |
| 4 | 画面下部が隠れる | 上位層 `overflow: hidden` | `.message-list` のみ `overflow-y: auto` |
| 6 | 多件数でレイアウト崩れ | `max-height: none` | `min-height: 0` で制約内に収める |

## Guidelines チェックリスト検証

| # | 項目 | 対応 |
|---|------|------|
| 1 | 高さ伝播チェーン | html → body → #root → .app → .message-list |
| 2 | min-height: 0 | .message-list に設定 |
| 3 | 固定値はルートのみ | html/body/#rootのみ height: 100% |
| 4 | overflow: hidden | 不使用 |
| 5 | overflow-y: auto | .message-list に設定 |
| 6 | データ量テスト | 50メッセージでも安定スクロール |
| 7 | ウィンドウ高さテスト | 600/768/900/1080px で確認済 |

## 演習課題

1. メッセージを30件追加し、スクロールが適切に動作するか確認せよ
2. textareaの高さが自動で拡張するよう `min-height: 44px` の意味を説明せよ
3. 入力エリアの高さを変えずにメッセージリストだけが伸縮する理由を説明せよ

## 理解度チェック

- [ ] チャットUIのスクロール境界を適切に設計できる
- [ ] flex: 1 + min-height: 0 の組み合わせを説明できる
- [ ] AIスタジオV2の問題がなぜ発生し、どう修正されたか説明できる

---

**前へ:** [01-dashboard-layout.md](01-dashboard-layout.md)  
**次へ:** [03-admin-panel.md](03-admin-panel.md)