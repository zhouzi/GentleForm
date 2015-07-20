var webpack = require('webpack');

module.exports = {
    entry: './src/GentleForm.js',

    output: {
        path: __dirname + '/dist',
        filename: 'GentleForm.min.js',
        library: 'GentleForm',
        libraryTarget: 'umd'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader']
            }
        ]
    },

    plugins: [new webpack.optimize.UglifyJsPlugin()]
};
