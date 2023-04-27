/*
 * @Description: power裸金属状态
 * @Author: lys1626
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-12 10:17:06
 */
// power硬盘状态
const power_disk = [
  {
    value: 'available',
    color: '#54CE83',
    label: '可用'
  },
  {
    value: 'in_use',
    color: '#8FA7F8',
    label: '正在使用'
  },
  {
    value: 'error',
    color: '#ED1C24',
    label: '异常'
  },
  {
    value: 'build',
    color: '#40D1FB',
    label: '创建中'
  },
  {
    value: 'resize',
    color: '#FFC90E',
    label: '变更中'
  },
  {
    value: 'delete',
    color: '#6A798C',
    label: '退订中'
  },
  {
    value: 'unknown',
    color: '#ffa904',
    label: '未知状态'
  }
];

// power硬盘 power小机 运行状态

const move_state = [
  {
    value: 'OK',
    label: '正常'
  },
  {
    value: 'WARNING',
    label: '警告'
  },
  {
    value: 'CRITICAL',
    label: '异常'
  },
  {
    value: 'ATTENTION',
    label: '注意'
  },
  {
    value: 'PENDING',
    label: '暂挂'
  }
];

// Power虚拟机状态
const power_host_status = [
  {
    value: 'active',
    color: '#00cc66',
    label: '运行中'
  },
  {
    value: 'reboot',
    color: '#97abe6',
    label: '重启中'
  },
  {
    value: 'build',
    color: '#40D1FB',
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
    value: 'resize',
    color: '#62c5fe',
    label: '变更中'
  },
  {
    value: 'delete',
    color: '#6b7a8d',
    label: '退订中'
  },
  {
    value: 'unknown',
    color: '#ffa904',
    label: '未知状态'
  }
];

// power硬盘挂载虚拟机状态
const mount_power_host_status = [
  {
    value: 'ACTIVE',
    color: '#00cc66',
    label: '运行中'
  },
  {
    value: 'SHUTOFF',
    color: '#919294',
    label: '已停止'
  }
];

// power小机可被挂载的硬盘状态
const power_can_mount_disk = [
  {
    value: 'available',
    color: '#54CE83',
    label: '可用'
  },
  {
    value: 'in_use',
    color: '#8FA7F8',
    label: '正在使用'
  }

];

export {power_disk, move_state, power_host_status, mount_power_host_status, power_can_mount_disk};