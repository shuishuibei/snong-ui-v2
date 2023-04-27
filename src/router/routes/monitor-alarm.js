//仪表盘
import Main from '@/pages/main/Main.vue';
import H3cLayout from '@/components/h3c-layout/H3cLayout.vue';
export default {
  component: Main,
  name: 'monitor-alarm',
  path: '/monitor-alarm',
  meta: {
    title: '监控告警',
  },
  //输入的路径不完整,跳转到子菜单的第一个资源池管理
  // redirect: {
  //   name: 'dashboard'
  // },
  children: [
    {
      name: 'monitor-manage',
      path: 'monitor-manage',
      redirect: {
        name: 'dashboard'
      },
      component: H3cLayout,
      children: [
        {
          name: 'dashboard',
          path: 'dashboard',
          component: () => import('@/pages/app/monitor-alarm/dash-board/DashBoard.vue')
        }
      ]
    },
    {
      name: 'alarm-manage',  //二级菜单：告警管理
      path: 'alarm-manage',
      redirect: {
        name: 'alarm-list'
      },
      component: H3cLayout,
      children: [
        {
          name: 'alarm-list', //主机资产
          path: 'alarm-list',
          component: () =>
            import('@/pages/app/alarm-manage/alarm-list/AlarmList.vue')
        },
        {
          name: 'policy-list', //告警策略
          path: 'policy-list',
          component: () =>
            import('@/pages/app/alarm-manage/policy-list/AlarmPolicyList.vue')
        },
        {
          name: 'alarm-shield-list', //告警已屏蔽列表
          path: 'alarm-shield-list',
          component: () =>
            import('@/pages/app/alarm-manage/alarm-shield-list/AlarmShieldList.vue')
        },
        {
          name: 'alarm-label', //告警标签配置列表
          path: 'alarm-label',
          component: () =>
            import('@/pages/app/alarm-manage/alarm-label/AlarmLabel.vue')
        },
        {
          name: 'alarm-group', //告警组管理
          path: 'alarm-group',
          component: () =>
            import('@/pages/app/alarm-manage/alarm-group/index.vue')
        }
      ]
    },
    {
      name: 'ping-manage',
      path: 'ping-manage',
      redirect: {
        name: 'probe-manage'
      },
      component: H3cLayout,
      children: [
        {
          name: 'probe-manage',
          path: 'probe-manage',
          component: () => import('@/pages/app/monitor-alarm/ping-manage/probe-manage/ProbeManage.vue')
        }
      ]
    },
  ]
};
