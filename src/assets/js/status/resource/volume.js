// 云硬盘、power硬盘状态、host详情中的硬盘状态
export default [
  {
    value: 'error_deleting',
    color: '#ED1010',
    label: '删除错误'
  },
  {
    value: 'creating',
    color: '#40D1FB',
    label: '创建中'
  },
  {
    value: 'available',
    color: '#54CE83',
    label: '可用'
  },
  {
    /*
    * x86硬盘，x86虚拟机详情里硬盘列表中运行状态为in-use
    * power硬盘,power虚拟机详情里硬盘列表状态用的in_use
    */
    value: 'in-use',
    color: '#8FA7F8',
    label: '正在使用'
  },
  {
    value: 'error',
    color: '#ED1C24',
    label: '异常'
  },
  {
    value: 'expanding',
    color: '#FFC90E',
    label: '扩容中'
  },
  {
    value: 'attaching',
    color: '#60C5FE',
    label: '挂载中'
  },
  {
    value: 'detaching',
    color: '#BF88D9',
    label: '卸载中'
  },
  {
    value: 'delete',
    color: '#919294',
    label: '退订中'
  }
];