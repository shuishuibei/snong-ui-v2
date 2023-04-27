export default class OrderProcessList {
  /**
   * @function constructor(类的构造函数))
   * @description 用来合并数组存取值
   * @param {Object} _this Vue组件的实例
   * @param {Array} firstItem column第一项
   * @param {Array} actionItem column最后的操作项
   * @returns {void}
   */
  constructor() {
    this.ADD = {
      serverColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '镜像',
          key: 'action',
          width: 150,
          render(h, {
            row
          }) {
            let {
              imageName
            } = row.resourceContent;
            return h('span', imageName);
          }
        },
        {
          title: '资源区域',
          key: 'action',
          render(h, {
            row
          }) {
            let {
              azoneLabelName
            } = row.resourceContent;
            return h('span', azoneLabelName);
          }
        },
        {
          title: '网络',
          key: 'action',
          render(h, {
            row
          }) {
            let element = row.resourceContent.network.map(item => h('div', item.netName));
            return h(
              'div', {
                class: 'more-text'
              },
              element
            );
          }
        },
        {
          title: '硬盘',
          key: 'action',
          render(h, {
            row
          }) {
            let element = row.resourceContent.storage.map(item =>
              h('div', `${item.diskSize}GB${item.diskNums}块`)
            );
            return h(
              'div', {
                class: 'more-text'
              },
              element
            );
          }
        },
        {
          title: '规格',
          key: 'action',
          width: 250,
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.newNormName);
          }
        },
        {
          title: '物理主机',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.cvk);
          }
        },
        {
          title: '虚拟机版本',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.vmxVersion);
          }
        },
      ],
      volumeColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '硬盘容量',
          key: 'action',
          render(h, params) {
            return h('span', params.row.resourceContent.newVolumeSize);
          }
        },
        {
          title: '资源区域',
          key: 'action',
          render(h, params) {
            return h('span', params.row.resourceContent.azoneLabelName);
          }
        },
        {
          title: '挂载虚拟机',
          key: 'action',
          render(h, {
            row
          }) {
            let serverName = row.resourceContent.serverName ? row.resourceContent.serverName : '无';
            return h('span', serverName);
          }
        },
        {
          title: '共享',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.shared ? '是' : '否');
          }
        },
      ],
      powerVMColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '镜像',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.imageName);
          }
        },
        {
          title: '物理主机',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.displayHostName);
          }
        },
        {
          title: '网络',
          key: 'action',
          render(h, {
            row
          }) {
            let element = row.resourceContent.networks.map(item => h('div', item.name));
            return h(
              'div', {
                class: 'more-text'
              },
              element
            );
          }
        },
        {
          title: '硬盘',
          key: 'action',
          render(h, {
            row
          }) {
            let element = row.resourceContent.volumes.map(item =>
              h('div', `${item.size}GB${item.count}块`)
            );
            return h(
              'div', {
                class: 'more-text'
              },
              element
            );
          }
        },
        {
          title: '规格',
          key: 'action',
          width: 160,
          render(h, {
            row
          }) {
            return h(
              'span',
              `CPU(${row.resourceContent.cpu}核) 内存(${row.resourceContent.memory}GB)`
            );
          }
        },
        {
          title: '连接组',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.scgName);
          }
        },
        {
          title: '主机组',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.groupName);
          }
        }
      ],
      powerVolumeColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '硬盘容量',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', `${row.resourceContent.size}GB`);
          }
        },
        {
          title: '存储模板',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.volumeType.name);
          }
        },
        {
          title: '挂载虚拟机',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.mountVmName);
          }
        },
        {
          title: '共享',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.multiattach ? '是' : '否');
          }
        },
      ],
      portColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '网络',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.netWorkName);
          }
        },
        {
          title: 'IP地址',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.ipAddress);
          }
        },
      ],
      bareMetalColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '镜像',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.imageName);
          }
        },
        {
          title: '资源区域',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.azoneLabelName);
          }
        },
        {
          title: '网络',
          key: 'action',
          render(h, {
            row
          }) {
            let element = row.resourceContent.network.map(item => h('div', item.ip));
            return h(
              'div', {
                class: 'more-text'
              },
              element
            );
          }
        },
        {
          title: '节点',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.ipmiAddress);
          }
        },
        {
          title: '规格',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.bareMetalNormBefore);
          }
        },
      ]
    }
    this.CHANGE = {
      serverColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '镜像',
          key: 'action',
          width: 150,
          render(h, {
            row
          }) {
            let {
              imageName
            } = row.resourceContent;
            return h('span', imageName);
          }
        },
        {
          title: '资源区域',
          key: 'action',
          render(h, {
            row
          }) {
            let {
              azoneLabelName
            } = row.resourceContent;
            return h('span', azoneLabelName);
          }
        },
        {
          title: '网络',
          key: 'action',
          width: 200,
          render(h, {
            row
          }) {
            let element = row.resourceContent.network.map(item => h('div', item.netName));
            return h(
              'div', {
                class: 'more-text'
              },
              element
            );
          }
        },
        {
          title: '变更前规格',
          key: 'action',
          width: 250,
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.oldNormName);
          }
        },
        {
          title: '变更后规格',
          key: 'action',
          width: 250,
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.newNormName);
          }
        },
        {
          title: '物理主机',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.cvk);
          }
        },
        {
          title: '虚拟机版本',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.vmxVersion);
          }
        },
      ],
      volumeColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '变更前容量',
          key: 'action',
          render(h, params) {
            return h('span', params.row.resourceContent.oldVolumeSize);
          }
        },
        {
          title: '变更后容量',
          key: 'action',
          render(h, params) {
            return h('span', params.row.resourceContent.newVolumeSize);
          }
        },
        {
          title: '资源区域',
          key: 'action',
          render(h, params) {
            return h('span', params.row.resourceContent.azoneLabelName);
          }
        },
        {
          title: '挂载虚拟机',
          key: 'action',
          render(h, {
            row
          }) {
            let serverName = row.resourceContent.serverName ? row.resourceContent.serverName : '无';
            return h('span', serverName);
          }
        },
        {
          title: '共享',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.shared ? '是' : '否');
          }
        },
      ],
      powerVMColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '镜像',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.imageName);
          }
        },
        {
          title: '物理主机',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.hostName);
          }
        },
        {
          title: '变更前规格',
          key: 'action',
          width: 260,
          render(h, {
            row
          }) {
            return h(
              'span',
              `处理单元(${row.resourceContent.oldCpu}核) VCPU(${row.resourceContent.oldVcpu}个) 内存(${row.resourceContent.oldMemory}GB)`
            );
          }
        },
        {
          title: '变更后规格',
          key: 'action',
          width: 260,
          render(h, {
            row
          }) {
            return h(
              'span',
              `CPU(${row.resourceContent.cpu}核) VCPU(${row.resourceContent.vcpu}个) 内存(${row.resourceContent.memory}GB)`
            );
          }
        },
      ],
      powerVolumeColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '变更前容量',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', `${row.resourceContent.oldSize}GB`);
          }
        },
        {
          title: '变更后容量',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', `${row.resourceContent.size}GB`);
          }
        },
        {
          title: '存储模板',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.volumeTypeName);
          }
        },
        {
          title: '存储池名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.poolName);
          }
        },
      ]
    }
    this.UNSUBSCRIBE = {
      serverColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '镜像',
          key: 'action',
          render(h, {
            row
          }) {
            let {
              imageName
            } = row.resourceContent;
            return h('span', imageName);
          }
        },
        {
          title: '资源区域',
          key: 'action',
          render(h, {
            row
          }) {
            let {
              azoneLabelName
            } = row.resourceContent;
            return h('span', azoneLabelName);
          }
        },
        {
          title: '规格',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.newNormName);
          }
        },
        {
          title: '网络',
          key: 'action',
          render(h, {
            row
          }) {
            let element = row.resourceContent.network.map(item => h('div', item.netName));
            return h(
              'div', {
                class: 'more-text'
              },
              element
            );
          }
        },
      ],
      volumeColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '硬盘容量',
          key: 'action',
          render(h, params) {
            return h('span', params.row.resourceContent.newVolumeSize);
          }
        },
        {
          title: '资源区域',
          key: 'action',
          render(h, params) {
            return h('span', params.row.resourceContent.azoneLabelName);
          }
        },
        {
          title: '挂载虚拟机',
          key: 'action',
          render(h, {
            row
          }) {
            let serverName = row.resourceContent.serverName ? row.resourceContent.serverName : '无';
            return h('span', serverName);
          }
        },
        {
          title: '共享',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.shared ? '是' : '否');
          }
        },
      ],
      powerVMColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '镜像',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.imageName);
          }
        },
        {
          title: '物理主机',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.hostName);
          }
        },
        {
          title: '规格',
          key: 'action',
          width: 160,
          render(h, {
            row
          }) {
            return h(
              'span',
              `CPU(${row.resourceContent.oldCpu}核) 内存(${row.resourceContent.oldMemory}GB)`
            );
          }
        },
      ],
      powerVolumeColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '硬盘容量',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', `${row.resourceContent.oldSize}GB`);
          }
        },
        {
          title: '存储模板',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.volumeTypeName);
          }
        },
        {
          title: '存储池名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.poolName);
          }
        },
      ],
      portColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '网络',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.netWorkName);
          }
        },
        {
          title: 'IP地址',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.ipAddress);
          }
        },
      ],
      bareMetalColumn: [{
          title: '名称',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '镜像',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.imageName);
          }
        },
        {
          title: '资源区域',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.azoneLabelName);
          }
        },
        {
          title: '规格',
          key: 'action',
          render(h, {
            row
          }) {
            return h('span', row.resourceContent.serverNorm);
          }
        },
      ]
    }
  }
  filterTableColumn(type, key, cloumn) {
    return [cloumn[0], ...this[type][key], ...cloumn.slice(1)];
  }
  filterProcessTableColumn(type, key, cloumn) {
    return [...cloumn, ...this[type][key].slice(1)];
  }
  filterOrderTableColumn(type, key, cloumn) {
    return [...cloumn.slice(0, 3), ...this[type][key].slice(1), cloumn[cloumn.length - 1]];
  }
}
