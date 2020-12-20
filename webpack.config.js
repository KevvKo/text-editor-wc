const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devServer: {
      open: true,
      contentBase: './src',
      compress: true,
      port: 3030
    },
    plugins: [

      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
    ],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'src'),
    },
  };