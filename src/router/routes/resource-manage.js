/*
 * @Description: 
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-17 15:53:33
 */
import Main from '@/pages/main/Main.vue';
import H3cLayout from '@/components/h3c-layout/H3cLayout.vue';

export default {
  name: 'cloud-resource-manage',
  path: '/cloud-resource-manage',
  component: Main,
  redirect: {
    name: 'cloud-host'
  },
  children: [
    {
      name: 'cloud-host',
      path: 'cloud-host',
      component: H3cLayout,
      redirect: {
        name: 'cloud-host/index'
      },
      children: [
        {
          // 云主机主页面
          name: 'cloud-host/index',
          path: 'index',
          meta: {
            keepAlive: true // 需要被缓存
          },
          component: () => import(/*webpackChunkName: "cloud-host-index"*/'@/pages/app/resource-manage/cloud-host/CloudHost.vue')
        },
        {
          // 云主机详情页面
          name: 'cloud-host/detail',
          path: ':id',
          meta: {
            breadcrumb: true
          },
          component: () => import(/*webpackChunkName: "cloud-host-detail"*/'@/pages/app/resource-manage/cloud-host/components/VirtualDetail/VirtualDetail.vue'),
        }
      ]
    },
    {
      name: 'cloud-disk',
      path: 'cloud-disk',
      component: () => import(/*webpackChunkName: "cloud-disk"*/ '@/pages/app/resource-manage/cloud-disk/CloudDisk.vue')
    },
    {
      name: 'virtual-network-card',
      path: 'virtual-network-card',
      component: () => import(/*webpackChunkName: "virtual-network-card"*/ '@/pages/app/resource-manage/virtual-network-card/VirtualNetworkCard.vue')
    },
    // {
    //   name: 'public-network-ip',
    //   path: 'public-network-ip',
    //   component: () => import(/*webpackChunkName: "public-network-ip"*/ '@/pages/app/resource-manage/public-network-ip/PublicNetworkIp.vue')
    // },
    // {
    //   name: 'firewall',
    //   path: 'firewall',
    //   component: () => import(/*webpackChunkName: "firewall"*/ '@/pages/app/resource-manage/firewall/Firewall.vue')
    // },
    // {
    //   name: 'load-balancing',
    //   path: 'load-balancing',
    //   component: () => import(/*webpackChunkName: "load-balancing"*/ '@/pages/app/resource-manage/load-balancing/LoadBalancing.vue')
    // },
    {
      name: 'power-host',
      path: 'power-host',
      component: H3cLayout,
      redirect: {
        name: 'power-host/index'
      },
      children: [{
        name: 'power-host/index',
        path: 'index',
        meta: {
          keepAlive: true // 需要被缓存
        },
        component: () => import(/*webpackChunkName: "power-host"*/ '@/pages/app/resource-manage/power-host/PowerHost.vue')
      }, {
        name: 'power-host/detail',
        path: ':id',
        meta: {
          breadcrumb: true
        },
        component: () => import(/*webpackChunkName: "power-host-detail"*/'@/pages/app/resource-manage/power-host/components/BaseInfoPowerHost.vue')
      }]
    },
    {
      name: 'power-disk',
      path: 'power-disk',
      component: H3cLayout,
      redirect: {
        name: 'power-disk/index'
      },
      children: [{
        name: 'power-disk/index',
        path: 'index',
        meta: {
          keepAlive: true // 需要被缓存
        },
        component: () => import(/*webpackChunkName: "power-disk"*/ '@/pages/app/resource-manage/power-disk/PowerDisk.vue')
      }, {
        name: 'power-disk/detail',
        path: ':id',
        meta: {
          breadcrumb: true
        },
        component: () => import(/*webpackChunkName: "power-disk-detail"*/'@/pages/app/resource-manage/power-disk/components/BaseInfoPowerDisk.vue')
      }]
    },
    {
      name: 'bare-metal',
      path: 'bare-metal',
      component: H3cLayout,
      redirect: {
        name: 'bare-metal/index'
      },
      children: [{
        name: 'bare-metal/index',
        path: 'index',
        meta: {
          keepAlive: true // 需要被缓存
        },
        component: () => import(/*webpackChunkName: "bare-metal"*/ '@/pages/app/resource-manage/bare-metal/BareMetal.vue')
      }, {
        name: 'bare-metal/detail',
        path: ':id',
        meta: {
          breadcrumb: true
        },
        component: () => import(/*webpackChunkName: "base-info-bare-metal"*/ '@/pages/app/resource-manage/bare-metal/components/BaseInfoBareMetal.vue')
      }]
    },
  ]
};
