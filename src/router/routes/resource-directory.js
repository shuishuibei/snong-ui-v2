/*
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:43
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 12:06:23
 */
import Main from '@/pages/main/Main.vue';
import PowerSmallMachine from '@/pages/app/resource-directory/power-small-machine/PowerSmallMachine.vue'

export default {
  name: 'resource-directory', // 一级目录：服务目录
  path: '/resource-directory',
  component: Main,
  redirect: {
    name: 'resource-directory/index'
  },
  children: [{
      name: 'resource-directory/index',
      path: 'index',
      component: () =>
        import(
          /*webpackChunkName: "cloud-home"*/
          '@/pages/app/resource-directory/CloudHome.vue'
        )
    },
    {
      name: 'resource-directory/x86',
      path: 'x86',
      meta: {
        breadcrumb: 'x86虚拟机'
      },
      component: () =>
        import(
          /*webpackChunkName: "cloud-x86"*/
          '@/pages/app/resource-directory/cloud-host/CloudHost.vue'
        )
    },
    {
      name: 'resource-directory/disk',
      path: 'disk',
      meta: {
        breadcrumb: 'x86硬盘'
      },
      component: () =>
        import(
          /*webpackChunkName: "cloud-disk"*/
          '@/pages/app/resource-directory/cloud-disk/CloudDisk.vue'
        )
    },
    {
      name: 'resource-directory/bare-metal',
      path: 'bare-metal',
      meta: {
        breadcrumb: '裸金属'
      },
      component: () =>
        import(
          /*webpackChunkName: "bare-metal"*/
          '@/pages/app/resource-directory/bare-metal/BareMetal.vue'
        )
    },
    {
      name: 'resource-directory/power-disk',
      path: 'power-disk',
      meta: {
        breadcrumb: 'Power硬盘'
      },
      component: () =>
        import(
          /*webpackChunkName: "power-disk"*/
          '@/pages/app/resource-directory/power-disk/PowerDisk.vue'
        )
    },
    {
      name: 'resource-directory/power-small-machine',
      path: 'power-small-machine',
      meta: {
        breadcrumb: 'Power虚拟机'
      },
      component: PowerSmallMachine,
      redirect: {
        name: 'resource-directory/power-small-machine/base'
      },
      children: [{
          name: 'resource-directory/power-small-machine/base',
          path: 'base',
          meta: {
            breadcrumb: '基本',
          },
          component: () =>
            import(
              /*webpackChunkName: "power-small-machine-base"*/
              '@/pages/app/resource-directory/power-small-machine/page/SinglePowerSmallMachine.vue'
            ),
          children: [{
            name: 'resource-directory/power-small-machine/base/select-host',
            path: 'select-host',
            meta: {
              breadcrumb: '物理主机'
            },
            props: ({
              query
            }) => ({
              physicalHostInfo: {
                id: query.hostId,
                name: query.name,
                groupName: query.groupName
              },
              hostPageInfo: {
                page: +query.page,
                pageSize: +query.pageSize
              }
            }),
            component: () =>
              import(
                /*webpackChunkName: "power-small-machine-base-select-host"*/
                '@/pages/app/resource-directory/power-small-machine/page/SinglePowerSelectHost.vue'
              ),
          }]
        },
        {
          name: 'resource-directory/power-small-machine/template',
          path: 'template',
          meta: {
            breadcrumb: '模板'
          },
          component: () =>
            import(
              /*webpackChunkName: "power-small-machine-template"*/
              '@/pages/app/resource-directory/power-small-machine/page/MorePowerSmallMachine.vue'
            ),
          children: [{
            name: 'resource-directory/power-small-machine/template/config',
            path: 'config',
            meta: {
              breadcrumb: '个性配置'
            },
            component: () =>
              import(
                /*webpackChunkName: "power-small-machine-template-config"*/
                '@/pages/app/resource-directory/power-small-machine/page/MorePowerCollapse.vue'
              ),
          }]
        }
      ]
    },
    {
      name: 'resource-directory/virtual-network-card',
      path: 'virtual-network-card',
      meta: {
        breadcrumb: '虚拟网卡'
      },
      component: () =>
        import(
          /*webpackChunkName: "virtual-network-card"*/
          '@/pages/app/resource-directory/virtual-network-card/VirtualNetworkCard.vue'
        )
    }
  ]
};
