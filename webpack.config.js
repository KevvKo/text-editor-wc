const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = ({mode}) => {

  return {
    mode,
    entry: './src/main.js',
    devtool: 'inline-source-map',
    devServer: {
      open: true,
      contentBase: './src',
      compress: true,
      port: 3030
    },
    plugins: [

      new HtmlWebpackPlugin({
        title: 'Text-Editor-WC',
      }),
    ],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'src'),
    }
  }
};