# Contributing to mahjong-calc

## Environment

- Node.js (latest)
- Rust (latest, stable)
- wasm-pack (latest)

Dev Container is available.

## Clone and run

```
$ git clone https://github.com/livewing/mahjong-calc.git
$ cd mahjong-calc
$ npm i
$ npm run build:wasm
$ npm run dev
```

`webpack-dev-server` runs on `PORT=8080`.

## Lint

```
$ npm run lint
```

## Build

```
$ npm run build:wasm
$ npm run build
```

Bundle output directory is `dist/`.

## Translating

See [#153](https://github.com/livewing/mahjong-calc/issues/153) for discussion on localization.

### New languages

To translate mahjong-calc to a new language, copy the `locales/ja.yml` file to the locale you are translating to. For example, to translate mahjong-calc to Esperanto you would do:

```
$ cp locales/ja.yml locales/eo.yml
```

Then edit the file with your translation.

```yaml
# locales/eo.yml

locale:
  name: Esperanto  # Language name
translation:
  header:
    title: Mahjong Poentaro Kalkulilo
    update: Ĝisdatigo
# --snip--
```

mahjong-calc uses i18next, so please refer to the [i18next documentation](https://www.i18next.com/) for translation. In the language with plurals, you will see [Plurals - i18next documentation](https://www.i18next.com/translation-function/plurals).

### Updating existing translations

To update existing translations, just update the yml file with new strings.
