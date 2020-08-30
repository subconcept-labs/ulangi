// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotEnvPlugin = require('webpack-dotenv-plugin');

module.exports = [
  {
    mode: 'development',
    entry: './app/index.ts',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }]
      }]
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
      new DotEnvPlugin({
        path: './config/.env.prod',
        sample: './config/.env.example',
      }),
      new HtmlWebpackPlugin({
        template: './app/index.html'
      })
    ]
  }
];
