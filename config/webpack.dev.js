const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');

function resolve(dir) {
    return path.join(__dirname,"..", dir)
}

module.exports = merge(common, {
    mode: 'development',
    entry: {
        'demo':'./demo/index.js',
    },
    output: {
        filename: 'js/[name].min.js',
        path: resolve('docs'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: resolve('docs/index.html'),
            template: resolve('public/index.html'),
            favicon:  resolve('public/favicon.ico'),
            inject: false,
        }),
        new CopyPlugin([
            { from: 'public/assets', to: 'assets' },
        ]),
    ],
    devServer: {
        contentBase: './public'
    },
});
