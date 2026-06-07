/**
 * 全HTMLファイルのスクリーンショットを一括生成するスクリプト
 *
 * 使い方: node tools/capture-screenshots.js
 *
 * docs/<chapter>/examples/ 内の全 .html ファイルをブラウザで開き、
 * 1200x900 のビューポートでスクリーンショットを撮影し、
 * 同じディレクトリに同名の .png として保存します。
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const DOCS_DIR = path.resolve(__dirname, '../docs');
const VIEWPORT_WIDTH = 1200;
const VIEWPORT_HEIGHT = 900;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function collectHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(collectHtmlFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      // chapter/examples 配下のHTMLのみを対象にする
      const normalized = fullPath.replace(/\\/g, '/');
      if (normalized.includes('/docs/') && normalized.includes('/examples/')) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

async function captureAll() {
  // HTMLファイル一覧を取得
  const files = collectHtmlFiles(DOCS_DIR).sort();

  if (files.length === 0) {
    console.log('examples 配下にHTMLファイルが見つかりません: ' + DOCS_DIR);
    process.exit(1);
  }

  console.log(`${files.length} 個のHTMLファイルを処理します...\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let success = 0;
  let failed = 0;

  for (const htmlPath of files) {
    const baseName = path.basename(htmlPath, '.html');
    const pngPath = path.join(path.dirname(htmlPath), baseName + '.png');
    const displayPath = path.relative(DOCS_DIR, htmlPath).replace(/\\/g, '/');

    console.log(`[${success + failed + 1}/${files.length}] ${displayPath} ...`);

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