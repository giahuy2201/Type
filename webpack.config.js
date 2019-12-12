const path = require('path')

module.exports = {
    entry: './script.js',
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.js'
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.(s*)css$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }]
    },
}