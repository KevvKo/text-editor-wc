const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    devServer: {
      open: true,
      contentBase: './src',
      compress: true,
      port: 3030
    },
    module: {

      rules: [
        { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
        { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' }
      ],
    },
    plugins: [

      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
    ]
  };