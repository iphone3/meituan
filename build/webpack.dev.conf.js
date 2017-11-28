'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
// 热加载
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

// baseWebpackConfig和当前配置进行合并
module.exports = merge(baseWebpackConfig, {
  module: {
  	// 传入的参数false
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  
  // 插件
  plugins: [
  	
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    
    new HtmlWebpackPlugin({
    	  // 编译生成的html文件名
      filename: 'index.html',
      // 
      template: 'index.html',
      // 表示打包输出过程中，会自动将.css和.js添加到上述文件中
      // css默认路径是head标签中
      // js默认路径是body里面
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
