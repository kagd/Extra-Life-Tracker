const path = require('path');

module.exports = {
  entry: ['./src/single-donation-tracker.ts'],
  devtool: 'inline-source-map',
  externals : {
    jquery: 'jquery',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  }
};
