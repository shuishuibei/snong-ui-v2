// X86虚拟机状态  Power虚拟机状态 power硬盘挂载虚拟机状态
const detailed_server_status = [
  {
    value: 'volume_or_port_applying',
    label: '硬件配置中',
    color: '#7092BE'
  },
  {
    value: 'expired',
    label: '已到期',
    color: '#99D9EA'
  },
  {
    value: 'volume_or_port_deleting',
    label: '硬件退订中',
    color: '#3F48CC'
  },
  {
    value: 'active',
    color: '#00cc66',
    label: '运行中'
  },
  {
    value: 'build',
    color: '#3399ff',
    label: '创建中'
  },
  {
    value: 'error',
    color: '#ff6600',
    label: '异常'
  },
  {
    value: 'shutoff',
    color: '#919294',
    label: '已停止'
  },
  {
    value: 'suspended',
    color: '#ff9900',
    label: '已挂起'
  },
  {
    value: 'unknown',
    color: '#ffa904',
    label: '未知状态'
  },
  {
    value: 'resize',
    color: '#62c5fe',
    label: '配置中'
  },
  {
    value: 'reboot',
    color: '#97abe6',
    label: '重启中'
  }, {
    value: 'extend',
    color: '#97abe6',
    label: '续租中'
  },
  {
    value: 'delete',
    color: '#6b7a8d',
    label: '退订中'
  },
  {
    value: 'flavor',
    color: '#b97cd5',
    label: '变更中'
  },
  {
    value: 'volume_applying',
    color: '#55ce5b',
    label: '硬盘申请中'
  },
  {
    value: 'nonexistent_server',
    color: '#ED1C24',
    label: '主机不存在'
  },
  {
    value: 'volume_expand_applying',
    color: '#8FA7F8',
    label: '硬盘扩容中'
  },
  {
    value: 'verify_resize',
    color: '#60C5FE',
    label: '规格迁移中'
  }
];

const simple_server_status = [
  {
    value: 'active',
    color: '#00cc66',
    label: '运行中'
  },
  {
    value: 'build',
    color: '#3399ff',
    label: '创建中'
  },
  {
    value: 'error',
    color: '#ff6600',
    label: '异常'
  },
  {
    value: 'shutoff',
    color: '#919294',
    label: '已停止'
  },
  {
    value: 'suspended',
    color: '#ff9900',
    label: '已挂起'
  },
  {
    value: 'unknown',
    color: '#ffa904',
    label: '未知状态'
  },
  {
    value: 'resize',
    color: '#62c5fe',
    label: '配置中'
  },
  {
    value: 'reboot',
    color: '#97abe6',
    label: '重启中'
  }, {
    value: 'extend',
    color: '#97abe6',
    label: '续租中'
  },
  {
    value: 'delete',
    color: '#6b7a8d',
    label: '退订中'
  },
  {
    value: 'flavor',
    color: '#b97cd5',
    label: '变更中'
  },
  {
    value: 'volume_applying',
    color: '#55ce5b',
    label: '硬盘申请中'
  }
]

export {detailed_server_status,simple_server_status};