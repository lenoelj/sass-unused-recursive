let path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        style: './src/main.scss'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',

    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                includePaths: [
                                    "./orbit-ui"
                                ]
                            }
                        },
                        {
                            loader: path.resolve('loaders/unused-vars.js')
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css")
    ]
};