const path = require('path')
const { HotModuleReplacementPlugin } = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const entryfile = path.resolve('src/app.js')
const outputpath = path.resolve('public/assets')

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: [
    entryfile
  ],
  output: {
    filename: 'app.js',
    path: outputpath,
    publicPath: '/assets/'
  },
  resolve: {
    alias: {
      lib: path.resolve('src/components/lib'),
      shared: path.resolve('src/components/shared'),
      screens: path.resolve('src/components/screens'),
      styles: path.resolve('src/styles'),
      helpers: path.resolve('src/helpers')
    },
    extensions: ['.js', '.jsx', '.css', '.png', '.jpg', '.gif', '.jpeg']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/assets/',
              hmr: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
              browsers: ['> 0.25%', 'ie >= 11'],
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.resolve('src/styles/variables/*.scss')
              ]
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|svg)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'app.css'
    })
  ],
  devServer: {
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 7800,
    contentBase: path.resolve('public'),
    historyApiFallback: true,
    proxy: {
      '/': {
        target: 'http://localhost:7000',
        // pathRewrite: { '^/api': '' }
      }
    }
  }
}