const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname,"..", dir)
}

module.exports = {
    entry: {
        'lf-cropper':'./src/cropper.js',
    },
    output: {
        filename: '[name].min.js',
        path: resolve('lib'),
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
    ],
};