const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'js/bundle.js',
        path: resolve('docs'),
        publicPath: '/'
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: resolve('docs/index.html'),
            template: resolve('public/index.html'),
            favicon:  resolve('public/favicon.ico'),
            inject: true,
        })
    ],
    devServer: {
      contentBase: './public'
    },
};