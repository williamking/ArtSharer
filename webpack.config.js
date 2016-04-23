var webpack = require('webpack');

module.exports = {
    watch: true,
    entry: {
        "signin": __dirname + "/public/react_view/signin_v.js",
        "signup": __dirname + "/public/react_view/signup_v.js",
        /*"index": __dirname + "/public/react_view/index_v.js",*/
        "layout": __dirname + "/public/react_view/layout_v.js",
        "personal_center": __dirname + "/public/react_view/personal_center_v.js",
        "icon": __dirname + "/public/icons/editor/iconfont.css"
    },
    output: {
        path: __dirname + '/public/dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ },
            { test: /\.svg$/, loader: 'url-loader', exclude: /node_modules/ },
            { test: /\.eot$/, loader: 'url-loader', exclude: /node_modules/ },
            { test: /\.woff$/, loader: 'url-loader', exclude: /node_modules/ },
            { test: /\.ttf$/, loader: 'url-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
    ]
};