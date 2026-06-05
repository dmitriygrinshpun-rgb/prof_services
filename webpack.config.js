const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    taskpane: './src/taskpane/taskpane.tsx',
    commands: './src/commands/commands.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/taskpane/index.html',
      filename: 'taskpane/index.html',
      chunks: ['taskpane'],
    }),
    new HtmlWebpackPlugin({
      template: './src/commands/commands.html',
      filename: 'commands/commands.html',
      chunks: ['commands'],
    }),
  ],
  devServer: {
    port: 3000,
    https: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
};
