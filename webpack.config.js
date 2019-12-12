const path = require('path')

module.exports = {
    entry: './scripts/main.js',
    output: {
        path: path.resolve(__dirname,'scripts'),
        filename: 'bundle.js'
    },
    mode: 'development',
}