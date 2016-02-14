var webpack = require('webpack');

module.exports = {
    watch: true,
    entry: [
        "./controller/entry.js"
    ],
    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.jsx?$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
    ]
};