//主页面
import Main from '@/pages/main/Main.vue';

export default {
  path: '/',
  component: Main,
  children: [{
    name: 'home',
    path: 'home',
    meta: {
      title: '云智运维管理系统',
    },
    component: () => import(/*webpackChunkName: "home"*/ '@/pages/app/home/Home.vue')
  }]
};
