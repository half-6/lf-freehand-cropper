const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname,"..", dir)
}

module.exports = {
    devServer: {
        host: '0.0.0.0'
    },
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
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }]
    }
};