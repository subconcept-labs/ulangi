// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    entry: './app/index.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }]
        },
      ]
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js'
    },
    node: {
      __dirname: false,
      __filename: false
    },
  },
  {
    mode: 'development',
    entry: './app/App.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    module: { 
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }] 
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: false,
              esModule: false
            }
          }
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            }
          ],
        }
      ] 
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      modules: [path.join(__dirname, 'app'), 'node_modules'],
    },
    externals: {
      sqlite3: 'commonjs sqlite3'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'App.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './app/index.html'
      })
    ]
  }
];
