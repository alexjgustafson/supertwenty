const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const extractSass = new ExtractTextPlugin({
    filename: "style.css",
});

module.exports = {
    entry: './js/app.js',

    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename: "bundle.js"
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader", options: {
                        sourceMap: true,
                        minimize: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            })
        }]
    },
    plugins: [
        new UglifyJsPlugin(),
        extractSass
    ]    
};