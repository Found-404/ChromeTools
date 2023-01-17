const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    background: './src/background.js',
    injectBridge: './src/injectBridge',
    pageBridge: './src/pageBridge',
    'download-walmart-fee': './src/download-walmart-fee.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        "src/manifest.json"
      ],
    }),
  ]
};