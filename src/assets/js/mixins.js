/**
 * 组件混合
 * 由于点击同一路由时,vue-router的钩子函数以及组件的生命周期函数不会调用.而此时想通过点击同一路由
 * 重新获取数据,则通过下面的折中方法实现.
 * 原理:监听$route的变化,在点击菜单的时候添加时间戳
 * 注意事项: (1)组件中需要添加该混合
 *         (2)组件中需要通过init方法动态获取数据,因此每一个菜单组件都需要实现init方法
 */

export default {
  watch: {
    '$route'(to, from) {
      /*
      第一次进入的时候已经加载了数据(init函数是作为ajax请求数据的)
      (1)判断query以及query.time是否存在
      (2)判断init函数是否存在
       */
      if (to.query && to.query.time &&
        this.init && Object.prototype.toString.call(this.init) === '[object Function]') {
        this.init();
        this._deepInit(this.$children);
      }
    }
  },
  methods: {
    // 递归遍历子组件,执行init方法,初始化数据
    _deepInit(children) {
      if (children.length !== 0) {
        for (let i = 0, len = children.length; i < len; ++i) {
          let _init = children[0].init;
          if (_init && Object.prototype.toString.call(_init) === '[object Function]') {
            _init();
          }

          this._deepInit(children[0].$children);
        }
      }
    },
    // 发送请求判断登录是否过期
    checkLoginState() {
      let time = new Date().getTime(); // 解决在ie上同一个ajax请求会直接获取缓存数据问题(304)
      let _this = this;
      return new Promise((resolve) => {
        _this.$http.get('isLogin' + '?time=' + time).then((resp) => {
          if (!resp.data.status) {
            _this.$router.push({
              name: 'login'
            });
          } else {
            resolve();
          }
        })
      });
    }
  }
};
