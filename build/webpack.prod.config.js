const webpackConfig = require('./webpack.common.config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

const proWebpackConfig = merge(webpackConfig, {
  devtool: 'none',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/entry/index.html',
      inject: true,
      // html文件的压缩规则
      minify: {
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 去除空格
        removeAttributeQuotes: true // 删除引号，删除不需要引号的值。
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      'baseUrl': '"/weekly"'
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: 'styles/[name].css',
    }),
    new OptimizeCSSPlugin() // 压缩css
  ]
});

//可视化查看文件打包的依赖
if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  proWebpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
module.exports = proWebpackConfig;
