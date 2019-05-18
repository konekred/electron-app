const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const entryfile = path.resolve('src/app.js')
const outputpath = path.resolve('public/assets')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
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
      '@lib': path.resolve('src/components/lib'),
      '@shared': path.resolve('src/components/shared'),
      '@screens': path.resolve('src/components/screens'),
      '@styles': path.resolve('src/styles'),
      '@graphql': path.resolve('src/graphql'),
      '@helpers': path.resolve('src/helpers')
    },
    extensions: ['*', '.js', '.jsx']
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
            loader: MiniCssExtractPlugin.loader
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
        test: /\.(graphql|gql)$/i,
        exclude: /node_modules/,
        use: ['graphql-tag/loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|svg)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'app.css'
    }),
    new MonacoWebpackPlugin({ languages: ['sql'] }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({ sourceMap: true, cache: true }),
      new OptimizeCSSAssetsPlugin({})
    ],
    // splitChunks: {
    //   // chunks: "all",
    //   // cacheGroups: {
    //   //   styles: {
    //   //     name: "styles",
    //   //     test: /\.css$/,
    //   //     chunks: "all",
    //   //     enforce: true
    //   //   }
    //   // }
    // }
  }
}