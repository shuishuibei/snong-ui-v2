/*
 * @Description 订单状态和订单申请类型
 * @Author caiyijun
 * @Date 2019-08-30 16:04:34
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 16:50:57
 */
export default [{
    value: 'APPROVING',
    color: '#3399fe',
    label: '审批中'
  },
  {
    value: 'APPROVED',
    color: '#0bd871',
    label: '已审批'
  },
  {
    value: 'REJECT',
    color: '#fe7b07',
    label: '已驳回'
  },
  {
    value: 'CANCELLED',
    color: '#6b7a8d',
    label: '已取消'
  },
  {
    value: 'REAPPLY',
    color: '#97abe6',
    label: '重新申请'
  }
];
