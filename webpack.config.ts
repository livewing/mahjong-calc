import { execFileSync } from 'child_process';
import { resolve } from 'path';
import CopyPlugin from 'copy-webpack-plugin'; // eslint-disable-line import/default
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { DefinePlugin, type Configuration } from 'webpack';
import { GenerateSW } from 'workbox-webpack-plugin';

const NODE_ENV =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const distPath = resolve(__dirname, 'dist');

const config: Configuration = {
  mode: NODE_ENV,
  entry: resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: {
                plugins: [{ removeViewBox: false }]
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {
                    config: './tailwind.config.ts'
                  },
                  autoprefixer: {},
                  ...(NODE_ENV === 'production' ? { cssnano: {} } : {})
                }
              }
            }
          }
        ]
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'src', 'index.html')
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({ patterns: ['resources'] }),
    ...(NODE_ENV === 'production'
      ? [
          new GenerateSW({
            swDest: resolve(distPath, 'sw.js'),
            skipWaiting: true,
            clientsClaim: true,
            cleanupOutdatedCaches: true
          })
        ]
      : []),
    new DefinePlugin({
      COMMIT_HASH: JSON.stringify(
        execFileSync('git', ['rev-parse', 'HEAD'], {
          encoding: 'utf-8'
        }).trim()
      )
    })
  ],
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : void 0,
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true
  }
};
export default config;
