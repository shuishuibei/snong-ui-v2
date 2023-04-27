const badRequest400 = {
    name: 'error-400',
    path: '/400',
    component: () =>
        import ( /*webpackChunkName: "400"*/ '@/pages/exception/400.vue'),
    meta: {
        title: '400-请求无效',
        //是否需要通过后台判断页面中的组件权限
        auth: false
    }
};

const unauthorized401 = {
    name: 'error-401',
    path: '/401',
    component: () =>
        import ( /*webpackChunkName: "401"*/ '@/pages/exception/401.vue'),
    meta: {
        title: '401',
        //是否需要通过后台判断页面中的组件权限
        auth: false
    }
};

const forbidden403 = {
    name: 'error-403',
    path: '/403',
    component: () =>
        import ( /*webpackChunkName: "403"*/ '@/pages/exception/403.vue'),
    meta: {
        title: '403',
        //是否需要通过后台判断页面中的组件权限
        auth: false
    }
};

const pageNotFound404 = {
    name: 'error-404',
    path: '/404',
    component: () =>
        import ( /*webpackChunkName: "404"*/ '@/pages/exception/404.vue'),
    meta: {
        title: '404-页面不存在',
        //是否需要通过后台判断页面中的组件权限
        auth: false
    }
};

/*const serverError500 = {
    name: 'error-500',
    path: '/500',
    component: () =>
        import ( /!*webpackChunkName: "500"*!/ '@/pages/exception/500.vue'),
    meta: {
        title: '500-服务端错误',
        //是否需要通过后台判断页面中的组件权限
        auth: false
    }
};*/

export default [
    badRequest400,
    unauthorized401,
    forbidden403,
    pageNotFound404
];