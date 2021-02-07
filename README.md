# mahjong-calc

[![CI](https://github.com/gssequence/mahjong-calc/workflows/CI/badge.svg)](https://github.com/gssequence/mahjong-calc/actions?query=workflow%3ACI)
[![LICENSE](https://img.shields.io/github/license/gssequence/mahjong-calc)](./LICENSE)

![Screenshot](https://user-images.githubusercontent.com/7447366/106877032-af6f0a80-671b-11eb-89b7-83ba04d9a82b.png)

麻雀の手牌を入力すると、待ち牌と得点を計算することができる Web アプリケーション (PWA) です。

スマートフォン上の Web ブラウザでの動作を想定していますが、タブレットやデスクトップでも利用できます。

## 実行

[麻雀得点計算機](https://mahjong-calc.livewing.net/)

<img src="https://user-images.githubusercontent.com/7447366/107044000-11f10500-6807-11eb-99c9-198b481f0f3e.png" width="185" alt="QR Code" />

## 使用方法

[使用方法](./doc/how-to-use.md)

## 開発

### clone と実行

```
$ git clone https://github.com/gssequence/mahjong-calc.git
$ cd mahjong-calc
$ npm i
$ npm start
```

`PORT=8080` で `webpack-dev-server` が動きます。

### ビルド

```
$ npm run build
```

`dist/` ディレクトリにバンドルが書き出されます。

## ライセンス

[The MIT License](./LICENSE) でライセンスされています。

## クレジット

麻雀牌の画像は [無料素材倶楽部](http://sozai.7gates.net/docs/mahjong01/) のものを使用しています。
