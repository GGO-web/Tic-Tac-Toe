import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const config = {
  mode: 'production',
  devtool: 'eval-source-map',
  cache: {
    type: 'filesystem'
  },
  optimization: {
    minimize: true
  },
  performance: {
    hints: false
  },
  entry: './src/js/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'js/bundle.js',
    clean: true
  },
  devServer: {
    static: {
      directory: 'dist'
    },
    hot: true,
    watchFiles: ['./src/*.html', './src/*.scss', './src/*.css', './src/*.js', './**.*'],
    compress: true,
    liveReload: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'string-replace-loader',
            options: {
              search: '@img',
              replace: '../img',
              flags: 'g'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 0,
              sourceMap: false,
              modules: false,
              url: {
                filter: (url) => {
                  if (url.includes('img') || url.includes('fonts')) {
                    return false;
                  }
                  return true;
                }
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'expanded'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/img/**.(png|jpg|jpeg)',
          to: 'img/[name][ext]'
        }
      ]
    }),
    new CleanWebpackPlugin()
  ],
  resolve: {
    alias: {
      '@scss': `./src/scss`,
      '@js': `./src/js`,
      '@img': `./src/img`
    }
  }
};

export default config;
