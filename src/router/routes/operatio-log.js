import Main from '@/pages/main/Main.vue';

export default {
    path: '/',
    component: Main,
    children: [{
        name: 'operation-log',
        path: 'operation-log',
        component: () => import(/*webpackChunkName: "operation-log"*/ '@/pages/app/operation-log/OperationLog.vue')
    }]
};