# mahjong-calc

[![CI](https://github.com/livewing/mahjong-calc/workflows/CI/badge.svg)](https://github.com/livewing/mahjong-calc/actions?query=workflow%3ACI)
[![LICENSE](https://img.shields.io/github/license/livewing/mahjong-calc)](./LICENSE)

![Screenshot](https://user-images.githubusercontent.com/7447366/167593547-c88f910a-65f5-48ec-853b-668efe03c900.png)

麻雀の手牌を入力すると、待ち牌・得点や牌効率の計算をすることができる Web アプリケーション (PWA) です。

スマートフォンと PC の Web ブラウザ上で動作します。

## 実行

[麻雀得点計算機](https://mahjong-calc.livewing.net/)

<img src="https://user-images.githubusercontent.com/7447366/107044000-11f10500-6807-11eb-99c9-198b481f0f3e.png" width="185" alt="QR Code" />

## 使用方法

[使用方法](./doc/how-to-use.md)

## 開発

### 環境

- Node.js 最新版
- Rust 最新版 (stable)
- wasm-pack 最新版

開発コンテナが利用可能です。

### clone と実行

```
$ git clone https://github.com/livewing/mahjong-calc.git
$ cd mahjong-calc
$ npm i
$ npm run build:wasm
$ npm run dev
```

`PORT=8080` で `webpack-dev-server` が動きます。

### ビルド

```
$ npm run build:wasm
$ npm run build
```

`dist/` ディレクトリにバンドルが書き出されます。

## ライセンス

[The MIT License](./LICENSE) でライセンスされています。

## クレジット

麻雀牌の画像は [FluffyStuff/riichi-mahjong-tiles](https://github.com/FluffyStuff/riichi-mahjong-tiles) のものを使用しています ([CC BY](https://github.com/FluffyStuff/riichi-mahjong-tiles/blob/master/LICENSE.md)) 。
