module.exports = {//这个是最新的配置  这样才能加上兼容前缀 
    plugins: [
      require('autoprefixer')({
        browsers:['last 5 versions']
      })
    ]
  }