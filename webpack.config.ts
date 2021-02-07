import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import type { Configuration } from 'webpack';

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
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: NODE_ENV === 'development',
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer', { grid: true }]]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: NODE_ENV === 'development'
            }
          }
        ]
      },
      {
        test: /\.png$/,
        type: 'asset/inline'
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
    new CopyPlugin({ patterns: ['resources'] }),
    ...(NODE_ENV === 'production'
      ? [
          new WorkboxWebpackPlugin.GenerateSW({
            swDest: resolve(distPath, 'sw.js'),
            skipWaiting: true,
            clientsClaim: true,
            cleanupOutdatedCaches: true
          })
        ]
      : [])
  ],
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : void 0
};
export default config;
