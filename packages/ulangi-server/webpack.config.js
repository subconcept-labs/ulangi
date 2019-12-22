const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'bundle.min.css': [
      path.resolve(__dirname, 'public/common/css/swiper.min.css'),
      path.resolve(__dirname, 'public/common/css/bootstrap-grid.min.css'),
      path.resolve(__dirname, 'public/common/css/main.css'),
      path.resolve(__dirname, 'public/common/css/responsive.css'),
    ],
    'bundle.min.js': [
      path.resolve(__dirname, "public/common/js/vendor/lazyload.min.js"),
      path.resolve(__dirname, "public/common/js/vendor/swiper.min.js"),
      path.resolve(__dirname, "public/common/js/vendor/smooth-scroll.min.js"),
      path.resolve(__dirname, "public/common/js/vendor/wow.min.js"),
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
      {
        test: /jquery.min.js/,
        use: [
          {
            loader: 'expose-loader',
            options: "jQuery"
          }
        ]
      },
      {
        test: /smooth-scroll.min.js/,
        use: [
          {
            loader: 'expose-loader',
            options: "smoothScroll"
          }
        ]
      },
      {
        test: /wow.min.js/,
        use: [
          {
            loader: 'expose-loader',
            options: "WOW"
          }
        ]
      },
      {
        test: /lazyload.min.js/,
        use: [
          {
            loader: 'expose-loader',
            options: "LazyLoad"
          }
        ]
      },
      {
        test: /swiper.min.js/,
        use: [
          {
            loader: 'expose-loader',
            options: "Swiper"
          }
        ]
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin("bundle.min.css"),
  ]
}; 
