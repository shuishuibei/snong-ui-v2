/*
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:41
 * @LastEditors: cfw2157 yz.caiyijun@h3c.com
 * @LastEditTime: 2023-04-27 17:38:27
 */
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import axios from 'axios';
import Iview from 'iview';
import Element from 'element-ui'
import Cookies from 'js-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/font/iconfont.css';
import '@/assets/font/ops/iconfont.css'

import App from './App.vue';
import Loading from '@/components/h3c-loading/H3cLoading.vue';
import routes from '@/router/index';
import storeConfig from '@/store/index';

import Utils from '@/assets/js/utils';
import {
  buildTree
} from '@/assets/js/utils';
import VueDND from 'awe-dnd';

import '@/assets/css/index.less';

// 导入日期模块
import moment from 'moment';
moment.locale('zh-cn');
Vue.prototype.$moment = moment;

import ElementUI from 'element-ui';             //全局引入element
import 'element-ui/lib/theme-chalk/index.css';    //全局引入element的样式


/*该文件放在上方会报错,原因未知*/
import {
  Base64
} from 'js-base64';

import ZkTable from 'vue-table-with-tree-grid';
Iview.Form.methods.resetField = function (prop) {
  const field = this.fields.find(field => field.prop === prop);
  field && field.resetField();
}
Vue.use(ZkTable);
Vue.use(VueDND);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Iview);
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.use(ElementUI)

//axios多实例,baseUrl是通过webpack配置的全局变量//TODO
//Vue.prototype.$http = axios;
let axiosIns = axios.create({ baseURL: baseUrl});
Vue.prototype.$http = axiosIns;
Vue.prototype.$base64 = Base64;
/* 设置事件中心，替换dispatch和broadcast */
Vue.prototype.$eventHub = new Vue();
/*此处封装一个全局加载动画*/
Vue.prototype.$loading = {
  show() {
    vm.$Spin.show({
      render: h => {
        return h(Loading);
      }
    });
  },
  hide() {
    vm.$Spin.hide();
  }
};

const router = new VueRouter({
  routes
});

axiosIns.defaults.withCredentials = true;

//注册axios后置拦截器，用于处理应用中所有ajax响应的公共逻辑部分，减少ajax响应中的代码
//函数中的返回值会作为ajax回调中的参数传入
axiosIns.interceptors.response.use(
  response => {
    let {
      status,
      code,
      message
    } = response.data;
    //处理在ajax api调用时出现的session过期或者无权访问的情况
    //400：后台配置, 前台无需处理
    //404: 后台tomcat直接处理，非标准的ajaxJson格式
    //401 403：后台返回标准的ajaxJson
    //500：后台返回标准的ajaxJson格式，前台弹窗即可（包括用户名、密码错误、无权访问）
    //成功code: null

    //如果请求后台，后台返回success标志位是失败则判断是哪些错误码做相应处理，否则直接return response
    //因为所有ajax请求，错误的处理逻辑都是一样的
    if (!status) {
      //如果拦截器拦截的是判断用户是否成功登录的ajax请求，则不做路由相关的处理，因为此处处理和判断用户是否登录的逻辑重复了
      //如果是其他api的调用则根据返回码处理
      //由于解决ie上ajax缓存问题,该请求上加了时间戳,因此使用正则表达式来判断,而不用/*response.config.url !== ('isLoginOrNotController.do')*/
      if (!/isLogin/.test(response.config.url)) {
        if (code === 401) {
          //401未登录，登录失效,到登录页
          router.push({
            name: 'login'
          });
        } else if (code === 403) {
          //403没有权限
          //将用户权限清空
          //vm.$store.commit('auth/resetState');
          //将跟菜单相关数据清空
          //vm.$store.commit('menu/resetState');
          //将跟用户信息数据清空
          //vm.$store.commit('login/resetUserName');
          //登录失效,到登录页
          router.push({
            replace: true,
            name: 'error-403'
          });
        } else if (code === 500) {
          //服务器内部会做标准的ajaxJson封装，此处只需在页面弹出相应的提示即可
          vm.$Notice.error({
            desc: message
          });
        } else if (code && code !== 700) {
          vm.$Notice.error({
            desc: message
          });
        }
      }
    }
    return response;
  },
  err => {
    //只有400（无需前台处理）、404是服务器不做控制的，其余均返回标准的ajaxJson
    /*router.push({
        replace: true,
        name: 'error-404'
    });*/
    return Promise.reject(err);
  }
);

//在用户处于成功登录的状态下，向后台请求获取用户权限（到底用户能够看到哪些路由）
//该验证在每次路由更改或者页面刷新的时候都要去后台验证，防止后台已经改变用户的权限，而前台还用旧的权限信息
const authCheck = (routerToName, next) => {
  //在数据库中保存的只有左侧菜单对应的路由名称，home、login、main等路由只是前端路由表中存在;
  let time = new Date().getTime(); //解决在ie上同一个ajax请求会直接获取缓存数据问题(304)
  axiosIns.get('resource/menu/list?time=' + time).then(({
    data
  }) => {
    if (data.status) {
      let hasAuth = false,
        _menuList = data.data.menuList;
      //该用户可以访问的组件id存入store,用于后面判断是否为该用户显示某些组件
      vm.$store.commit('auth/setAuths', data.data.componentIDList);
      //判断用户要访问的菜单在不在菜单权限列表中
      for (let index in _menuList) {
        if (_menuList[index].location === routerToName.split('/')[0]) {
          //如果在路由列表中,则直接放过
          hasAuth = true;
          next();
          break;
        }
      }
      if (!hasAuth) {
        next({
          replace: true,
          name: 'error-403'
        });
      }
      //将数组形式的菜单转换为树形格式的菜单数据，用于左侧树形菜单的渲染
      let _menuData = buildTree(_menuList, 'orderNo', item => {
        let obj = {
          name: item.location,
          title: item.title
        };
        return item.icon ?
          Object.assign(obj, {
            icon: item.icon
          }) :
          obj;
      })[0].children; //由于后台有一个root节点,此处剔除

      vm.$store.commit('menu/setMenuData', _menuData);
    }
  });
};

// 每次刷新或者路由的改变，都涉及到用户可能要去请求数据，所以都要去验证用户的合法性
router.beforeEach((to, from, next) => {
  to.meta.title && Utils.title(to.meta.title);
  //如果路由是到401或者404页面的，不涉及到用户获取数据，那么无需去后台验证，直接跳转即可，走else逻辑
  //如果不是401或404，那么就要去验证用户请求的合法性
  if (
    to.name !== 'join' &&
    to.name !== 'error-400' &&
    to.name !== 'error-401' &&
    to.name !== 'error-403' &&
    to.name !== 'error-404'
  ) {
    //向后台询问，判断用户是否仍然是登录状态
    let time = new Date().getTime(); //解决在ie上同一个ajax请求会直接获取缓存数据问题(304)
    axiosIns.get('user/isLogin' + '?time=' + time).then(({
      data
    }) => {
      if (data.status) {
        // vm.$store.commit('login/setUserName', data.message);
        //如果路由存在，则去判断路由是否为登录页面
        if (to.name !== null) {
          //用户在登录状态时，不允许回到登录界面
          //用户如果在登录页面就代表用户session退出，保持状态的一致性，防止出现安全问题
          //如果不是登录界面，则判断该用户是否有权限访问该路由
          if (to.name === 'login') {
            router.push({
              name: 'home'
            });
          } else {
            //判断用户是否有该路由权限
            authCheck(to.name, next);
          }
        } else {
          //如果路由不存在
          next({
            replace: true,
            name: 'error-404'
          });
        }
      } else {
        //如果是未登录状态，则跳转到登录页面
        //防止路由死循环
        //路由到显示调用路由到login后，又触发路由守卫，又会执行此处到login的逻辑，陷入死循环
        if (to.name !== 'login') {
          //todo 做了判断，执行该段代码next({name: 'login'})后，不会再次触发路由守卫，非常奇怪？？？
          //todo 猜测：当你事先已经执行过一遍next()到login,之后再次执行next({name: 'login'})就不会再次触发守卫
          next({
            name: 'login'
          });
        } else {
          next();
        }
        //todo 如果不作如上判断，会陷入死循环next({name: 'login'})会再次触发守卫
        // next({name: 'login'});
      }
    });
  } else {
    next();
  }
});

// const isSpecialRoute = (name) => {
//   const specialRoutes = ['join', 'error-400', 'error-401', 'error-403', 'error-404'];
//   return specialRoutes.includes(name);
// };

// const isAuthenticated = async () => {
//   let time = new Date().getTime();
//   const response = await axiosIns.get('user/isLogin' + '?time=' + time);
//   return response.data.status;
// };

// router.beforeEach(async (to, from, next) => {
//   to.meta.title && Utils.title(to.meta.title);

//   if (isSpecialRoute(to.name)) {
//     next();
//   } else {
//     if (true) {
//       if (to.name !== null) {
//         if (to.name === 'login') {
//           next({ name: 'home' });
//         } else {
//           authCheck(to.name, next);
//         }
//       } else {
//         next({
//           replace: true,
//           name: 'error-404'
//         });
//       }
//     } else {
//       if (to.name !== 'login') {
//         next({ name: 'login' });
//       } else {
//         next();
//       }
//     }
//   }
// });

//开发模式下启用严格模式,生产环境关闭严格模式(影响性能)
storeConfig.strict = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store(storeConfig);

const vm = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
