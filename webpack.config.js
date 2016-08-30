module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      }
    ],
  },
  entry: {
    "./dist/bundle": './src/js/main.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname,
  },
  resolve: {
    extensions: ['', '.js'],
  }
}
