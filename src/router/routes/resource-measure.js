/*
 * @Description: 
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:35
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-10 13:43:28
 */
/**
 * 资源计量
 * @author caiyijun
 * @change caiyijun
 */
import Main from '@/pages/main/Main.vue';
import H3cLayout from '@/components/h3c-layout/H3cLayout.vue';

export default {
    name: 'resource-measure',
    path: '/resource-measure',
    component: Main,
    redirect: {
        name: 'lazy-machine-check'
    },
    children: [
        {
            name: 'lazy-machine-check',   // 僵尸机检测
            path: 'lazy-machine-check',
            component: H3cLayout,
            redirect: {
                name: 'lazy-machine-check/index'
            },
            children: [
                {
                    name: 'lazy-machine-check/index',
                    path: 'index',
                    meta: {
                        keepAlive: true // 需要被缓存
                    },
                    component: () => import ( /*webpackChunkName: "lazy-machine-check"*/ '@/pages/app/resource-measure/lazy-machine-check/LazyMachineCheck.vue')
                },
                {
                    name: 'lazy-machine-check/detail',
                    path: ':serverId/:resourceId/:createDate/:type/:time',
                    meta: {
                        breadcrumb: true
                    },
                    component: () => import( /*webpackChunkName: "lazy-machine-check-detail"*/ '@/pages/app/resource-measure/lazy-machine-check/components/BaseInfo/VirtualDetail.vue')
                }
            ]
        }
    ]
}