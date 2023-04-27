import Main from '@/pages/main/Main.vue';
//个人汇报
export default {
  name: 'alarm-manage',
  path: '/alarm-manage',
  component: Main,
  redirect: {
    name: 'alarm-list'
  },
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
    }
]
};
