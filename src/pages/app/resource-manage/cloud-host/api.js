/*
 * @Description: x86虚拟机模块所用api文件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-21 11:06:40
 */
export default {
  /*x86虚拟机功能api*/
  url: '/server/list/page',// 分页查询列表
  openConsole: 'server/openConsole/',// 打开控制台
  /*虚拟机电源操作：打开，关闭，重启，挂起，恢复，删除*/
  openHostUrl: '/server/start',
  closeHostUrl: '/server/stop',
  restartHostUrl: '/server/reboot',
  hangupHostUrl: '/server/suspend',
  recoveryHostUrl: '/server/resume',
  deleteHostUrl: '/server/delete',

  /*虚拟网卡功能api*/
  hostBindVirnetUrl: '/port/mount/',// 虚拟机绑定虚拟网卡
  uninstallVirnetCardUrl: '/port/unMount/',// 虚拟机解绑虚拟网卡
  networkCardUrl: '/port/list/page/usable/',// 获取用户下可用的虚拟网卡列表(虚拟机挂载虚拟网卡时用)
  networkUrl: '/port/server/list/page/',// 虚拟网卡列表，虚拟机详情和卸载虚拟网卡中展示

  /*硬盘功能api*/
  diskMountVirnetUrl: '/volume/mount/',// 挂载硬盘
  unmountDiskUrl: '/volume/unmount/',// 卸载硬盘
  mountedDiskUrl: '/volume/list/page/',//虚拟机已挂载的硬盘列表
  availableDiskListUrl: '/volume/listUseableVolumeToServer/page/',// 获取可用的硬盘列表挂载虚拟机

  timeTaskUrl: '/sysTimedTask/startByName/serverStatus',//定时接口
  timeDiskTaskUrl: '/sysTimedTask/startByName/volumeStatus',

  /*虚拟机计费规格api*/
  getSpecRangUrl: '/serverNorm/serverFlavor',// 通过单个类型返回符合此范围的规格数据基于镜像最小规格
  applyChangeUrl: '/server/update/norm',

}