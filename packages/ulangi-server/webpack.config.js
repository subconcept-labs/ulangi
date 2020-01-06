const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'bundle.min.css': [
      path.resolve(__dirname, 'public/common/css/main.css'),
    ],
    'bundle.min.js': [
      path.resolve(__dirname, "public/common/js/main.js")
    ]
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'public/common/bundles'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: { url: false }
          }
        })
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin("bundle.min.css"),
  ]
}; 
