/*
 * @Description: power裸金属状态
 * @Author: lys1626
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-12 10:17:06
 */

export default [
  {
    value: 'SHUTOFF',
    color: '#919294',
    label: '关机'
  },
  {
    value: 'ACTIVE',
    color: '#00cc66',
    label: '运行中'
  },
  {
    value: 'BUILD',
    color: '#40d1fb',
    label: '新建中'
  },
  {
    value: 'DELETE',
    color: '#6b7a8d',
    label: '销毁中'
  },
  {
    value: 'ERROR',
    label: '异常',
    color: '#ed1c24'
  }
];