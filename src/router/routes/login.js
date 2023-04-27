import Login from '@/pages/login/Login.vue';

const redirectToIndex = {
    path: '/',
    redirect: {
        name: 'login'
    }
};

//登录页
const loginRouter = {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
        title: '登录',
        //是否需要通过后台判断页面中的组件权限
        auth: false
    }
};

export default [
    redirectToIndex,
    loginRouter
];