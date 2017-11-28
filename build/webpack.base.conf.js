'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 表示webapck编译js的入口文件
  entry: {
  	// key: value
    app: './src/main.js'
  },
  // 输出配置
  output: {
  	// 输出文件的路径
    path: config.build.assetsRoot,
    // 文件名称  name ==> app  ===> app.js
    filename: '[name].js',
    // 请求静态资源的绝对路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  // 导入时的配置
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      // 路径的配置
      'components': resolve('./src/components')
    },
  },
  // 对某种类型的文件，通过某个loader出做处理
  module: {
    rules: [
    	  // .vue类型的文件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // .js类型的文件
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      // 图片文件
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
        	  // 文件大小
          limit: 10000,	
          // 文件名生成
          // static/img/文件名.hash串.文件后缀
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      // 音频视频的处理
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      // 字体图标的处理
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
