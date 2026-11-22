# ことだま！ ハングルクエスト

`index.html` をブラウザで開くと遊べます（ビルド不要。外部への通信はありません。フォントも同梱しています）。
ローカルで確認するときは、フォルダで `python3 -m http.server` などを動かして `http://localhost:8000` を開いてください（オフライン用の仕組みは http/https でだけ動きます）。

## フォルダ
- `js/rpg/` … ゲーム本体（ドット絵描画、モンスター・マップ、エンジン、戦闘、会話・メニュー・セーブ・タイトル、設定、法的情報、町の演出、ループと入力）
- `js/korean/` … `vocab-data.js`（韓国語データ：9職×150語）／ `learning-ui.js`（学習システム、ホーム、一問一答、一覧、テスト）
- `js/assets/` … 画像素材（base64埋め込み）
- `js/audio/` … BGM・効果音（WebAudioで生成）
- `js/app-info.js` … **アプリ名・提供者・連絡先と、利用規約・プライバシーポリシーの文面**（公開前に必ず書きかえる）
- `privacy.html` `terms.html` `support.html` `licenses.html` … 公開用ページ（`app-info.js` の内容を表示）
- `fonts/` … DotGothic16（SIL OFL 1.1）。ゲームで使う文字を含む分だけ
- `icons/` `manifest.webmanifest` `sw.js` … ホーム画面に追加・オフライン動作用
- `css/style.css`
- `docs/APP_STORE_CHECKLIST.md` … **App Store に出すまでの手順と確認リスト**

読み込み順は `index.html` の script タグの順です（変更しないでください）。

## 更新するときの注意
- ファイルを更新して公開したら、`sw.js` の `CACHE`（`lumina-v1`）の数字を上げてください。古いキャッシュが入れかわります。
- 利用規約やプライバシーポリシーを変えて、もう一度同意してもらいたいときは、`js/app-info.js` の `legalVersion` を変えてください。
