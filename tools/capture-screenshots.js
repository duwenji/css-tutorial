/**
 * 全HTMLファイルのスクリーンショットを一括生成するスクリプト
 *
 * 使い方: node tools/capture-screenshots.js
 *
 * docs/htmls/ 内の全 .html ファイルをブラウザで開き、
 * 1200x900 のビューポートでスクリーンショットを撮影し、
 * docs/images/ に同名の .png として保存します。
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const HTMLS_DIR = path.resolve(__dirname, '../docs/htmls');
const IMAGES_DIR = path.resolve(__dirname, '../docs/images');
const VIEWPORT_WIDTH = 1200;
const VIEWPORT_HEIGHT = 900;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureAll() {
  // 出力ディレクトリがなければ作成
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // HTMLファイル一覧を取得
  const files = fs.readdirSync(HTMLS_DIR)
    .filter(f => f.endsWith('.html'))
    .sort();

  if (files.length === 0) {
    console.log('HTMLファイルが見つかりません: ' + HTMLS_DIR);
    process.exit(1);
  }

  console.log(`${files.length} 個のHTMLファイルを処理します...\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const htmlPath = path.join(HTMLS_DIR, file);
    const baseName = path.basename(file, '.html');
    const pngPath = path.join(IMAGES_DIR, baseName + '.png');

    console.log(`[${success + failed + 1}/${files.length}] ${file} ...`);

    try {
      const page = await browser.newPage();
      await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        deviceScaleFactor: 1
      });

      const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
      await page.goto(fileUrl, {
        waitUntil: 'networkidle0',
        timeout: 10000
      });

      // フォントや画像のレンダリングを待つ
      await sleep(500);

      await page.screenshot({
        path: pngPath,
        type: 'png',
        fullPage: false // ビューポートサイズで切り取る
      });

      await page.close();

      const stats = fs.statSync(pngPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`  -> 保存完了: ${baseName}.png (${sizeKB} KB)`);
      success++;
    } catch (err) {
      console.error(`  -> エラー: ${err.message}`);
      failed++;
    }
  }

  await browser.close();

  console.log(`\n===== 完了 =====`);
  console.log(`成功: ${success} / 失敗: ${failed} / 合計: ${files.length}`);
}

captureAll();