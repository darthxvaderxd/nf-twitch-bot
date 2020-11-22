const path = require('path');

module.exports = {
    entry: './app.jsx',
    context: path.join(__dirname, 'src/'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.jsx$/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    },
}
