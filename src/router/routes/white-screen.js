import Main from '@/pages/main/Main.vue';
// import H3cLayout from '@/components/h3c-layout/H3cLayout.vue';
export default {
  path: '/',
  component: Main,
  children: [{
    name: 'white-screen',   //一级菜单：项目巡检
    path: '/white-screen',
    component: () => import(/*webpackChunkName: "white-screen-home"*/ '@/pages/app/white-screen/WhiteScreenHome.vue')
  }]
};
