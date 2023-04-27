/*
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-22 10:46:09
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-09-19 16:02:49
 */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 配和happypack插件来用 npm install os -D 来安装
const os = require('os');
// webpack默认在node上面是单进程 所以我们打包时间比较慢
// 我们可以用这个文件来配置多进程 提高效率 优化webpack  npm install happypack -D 来安装
const HappyPack = require('happypack');
// 获取cpu的数量
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});
// 抽离css的插件 npm install mini-css-extract-plugin -D 来安装
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackCommon = {
  context: path.resolve(__dirname, '../'),
  entry: {
    es6: ['@babel/polyfill'],
    app: ['@/entry/index.js'], // 主入口文件
    iview: ['iview'], // UI插件
    vue: ['vue', 'vue-router', 'vuex', 'axios'], // vue全家桶
    compatible: ['@/assets/js/compatible'], // @/assets/js/compatible兼容iview在IE9以及以上版本
    other: ['qs', 'js-base64'] // qs序列化插件
  },
  output: {
    filename: 'js/[name].js', // 出口文件地址的目录
    path: path.resolve(__dirname, '../dist'), // 出口路径
    chunkFilename: 'js/[name].js', // 分成块的打包地址会打包在static/js/文件下面
    publicPath: process.env.NODE_ENV ? '/' : './' // 公共路径
  },
  // 4.0新增的配置项
  optimization: {
    splitChunks: {
      chunks: 'all', // 插件作用的范围 all全部, async按需加载, initial入口文件 三选一
      minSize: 30000, // 最小打包的尺寸  超过30kb才会打包
      minChunks: 1, // 最小引入的第三方库
      maxAsyncRequests: 5, // 最大异步请求chunks
      maxInitialRequests: 3, // 最大初始化chunks
      automaticNameDelimiter: '~', // 如果不指定name，自动生成name的分隔符（‘runtime~[name]’）
      name: true, // split 的 chunks name
      // 缓存组
      cacheGroups: {
        // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。
        vendors: {
          chunks: 'initial', // 左右是入口文件
          test: /[\\/]node_modules[\\/]/, // 过滤 打包node_modules文件下的引用的库
          name: 'common/vender', // 打包最后的路径 common/vender.js
          minChunks: 1, // 最小引入数1
          priority: -10, // 优先级
          enforce: true
        }
      }
    },
    // 运行是需要打包的js文件
    runtimeChunk: {
      name: 'common/manifest' // 打包最后的路径 page/manifest.js
    },
    minimizer: [new UglifyJsPlugin({
      parallel: os.cpus().length,
      uglifyOptions: {
        ie8: true,
      }
    })]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve('src') // 路径别名
    }
  },
  //模块配置项
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   exclude: /node_modules/,
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        use: [
          'vue-loader', // npm install vue-loader vue-template-compiler -D 都需要安装 解析vue文件模板的加载器
          {
            loader: 'iview-loader',
            options: {
              prefix: true
            }
          }
        ]
      },
      {
        test: /\.js$/, // es6语法转换加载器 配合happypack用多进程处理 效率更高
        exclude: '/(node_modules)/', // 排除node_modules文件
        loader: 'happypack/loader?id=happyBabel' // 配置项 需要安装 npm intsall babel-loader babel-core babel-eslint babel-preset-env babel-preset-stage-3 -D 这些都需要安装 还需要在.babelrc里面配置
      },
      {
        test: /\.less$/, // 我们可以使用css预编译工具   这里我用sass举例
        use: [
          process.env.NODE_ENV ? // MiniCssExtractPlugin.loader 用来抽离css文件的 不用打包到js文件里
          'vue-style-loader' :
          MiniCssExtractPlugin.loader, // 可以再vue模板中的<style lang='scss'>使用sass
          'css-loader',
          'postcss-loader', // css自动加上兼容性前缀
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.css$/, // 同上
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader 用来抽离css文件的 不用打包到js文件里
          process.env.NODE_ENV ?
          'vue-style-loader' :
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/, // 图片加载器  我们url-loader内部封装了file-loader所以我们安装一个就行了
        use: [{
          loader: 'url-loader',
          options: {
            limit: 2048, // 2048以内的文件我们打包进js
            context: './src/assets/imgs',
            name: '[path][name].[ext]', // 2048之外的图片我们直接放到这个目录下 不打包
            outputPath: 'images/',
            publicPath: '../images'
          }
        }]
      },
      {
        test: /\^element-icons/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 2048, // 2048以内的文件我们打包进js
            name: '[name].[hash:7].[ext]',
            outputPath: 'fonts/',   // 打包目录
            publicPath: '../../fonts'  // 访问目录
          }
        }]
      },
      {
        test: /\.(woff|eot|ttf|otf|woff2|svg)(\?.*)?$/, // 同上
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: '[name].[hash:7].[ext]',
          outputPath: 'fonts/',   // 打包目录
          publicPath: '../fonts'  // 访问目录
        },
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // 拷贝文件到打包文件目录下的插件
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../public/images'),
        to: path.resolve(__dirname, '../dist/images/public'),
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../public/js'),
        to: path.resolve(__dirname, '../dist/js/public'),
        ignore: ['.*']
      }
    ]),
    new HappyPack({
      id: 'happyBabel', // 用id来标识 happypack处理那里类文件
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }],
      threadPool: happyThreadPool, // 共享进程池
      verbose: true //允许 HappyPack 输出日志
    })
  ]
};

module.exports = webpackCommon;
