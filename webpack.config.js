module.exports = {
  entry: [
    './index.js'
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },

  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ['', '.js']
  },
  watchDelay: 0,
  watch: true,
  externals: {},
  devtool: '#inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
};
