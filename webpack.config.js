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
        path: resolve('dist'),
        publicPath: '/'
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: resolve('dist/index.html'),
            template: resolve('public/index.html'),
            favicon:  resolve('public/favicon.ico'),
            inject: true,
        })
    ],
    devServer: {
      contentBase: './public'
    },
};