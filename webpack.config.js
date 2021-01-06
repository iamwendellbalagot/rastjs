const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        app: path.resolve(__dirname,'./index.js')
      },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                  {
                    loader: 'style-loader',
                  },
                  {
                    loader: 'css-loader',
                  },
                ],
              },
        ]
    },
    plugins: [
    new HtmlWebPackPlugin({
      template: './index.html',
    }),
  ],
}