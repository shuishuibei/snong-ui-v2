/*
 * @Description: 待办任务、已办任务、流程管理申请状态
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-12 10:16:43
 */
export default [
  {
    label: '新增',
    value: 'OPT_ACT_ADD'
  },
  {
    label: '变更',
    value: 'OPT_ACT_UPDATE'
  },
  {
    label: '退订',
    value: 'OPT_ACT_DELETE'
  },
  {
    value: 'RESUBMIT',
    label: '重新提交',
    color: '#96abe5'
  },
  {
    value: 'UNPROCESS',
    label: '未处理',
    color: '#919294'
  },
  {
    value: 'ERROR',
    label: '异常',
    color: '#ed1c24'
  },
  {
    value: 'APPROVED',
    label: '已审批',
    color: '#00cc64',
    icon: 'ios-checkmark-outline'
  },
  {
    value: 'APPROVING',
    label: '审批中',
    color: '#3498fe',
    icon: 'android-radio-button-on'
  },
  {
    value: 'REJECT',
    label: '驳回',
    color: '#fe6500',
    icon: 'ios-close-outline'
  },
  {
    value: 'PORTALREJECT',
    label: '运营门户驳回',
    color: '#fe6500',
    icon: 'ios-close-outline'
  },
  {
    value: 'CHECKFAIL',
    label: '资源预检失败',
    color: '#ff9802',
    icon: 'ios-close-outline'
  }
];

// 流程筛选状态
export const applicationStatus = [
  {
    label: '新增',
    value: 'ADD'
  },
  {
    label: '变更',
    value: 'CHANGE'
  },
  {
    label: '退订',
    value: 'UNSUBSCRIBE'
  }
];
