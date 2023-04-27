/*
 * @Description: x86虚拟机的混合,放置table的columns项
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-11-04 09:48:04
 */
import api from './api.js';
import { formatDate } from '@/assets/js/utils';
import { SimpleServerStatus } from '@/assets/js/status/index.js';
import VirtualOperation from './components/VirtualOperation.vue';

export default {
  data() {
    return {
      mountDiskItem: [
        {
          title: '名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '容量(GB)',
          key: 'size',
          ellipsis: true
        },
        {
          title: '挂载',
          key: 'mount',
          render: (h, params) => {
            let id = params.row.id;
            return h('i', {
              class: ['iconfont', 'icon-739bianjiqi_qingchuchaolianjie'],
              on: {
                click: () => {
                  this.installVirnetCard(id);
                }
              }
            });
          }
        }
      ],
      mountedDiskItem: [
        {
          title: '名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '容量(GB)',
          key: 'size',
          ellipsis: true
        },
        {
          title: '设备',
          key: 'device',
          ellipsis: true
        },
        {
          title: '卸载',
          key: 'mount',
          render: (h, params) => {
            let diskId = params.row.id;
            return h('i', {
              class: ['iconfont', 'icon-xiezai'],
              on: {
                click: () => {
                  this.uninstallDisk(diskId);
                }
              }
            });
          }
        }
      ],
      networkColumns: [
        {
          title: '名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '私网IP地址',
          key: 'ipAddress',
          ellipsis: true
        },
        {
          title: '断开',
          key: 'break',
          render: (h, params) => {
            let id = params.row.id;
            return h('i', {
              class: ['iconfont', 'icon-739bianjiqi_qingchuchaolianjie'],
              on: {
                click: () => {
                  this.uninstallVirnetCard(id);
                }
              }
            });
          }
        }
      ],
      networkCardItem: [
        {
          title: '名称',
          key: 'name',
          render: (h, params) => {
            let name = params.row.name;
            return h(
              'div',
              {
                class: { tableInfo: true },
                attrs: { title: name }
              },
              name
            );
          }
        },
        {
          title: 'IP地址',
          key: 'ipAddress',
          render: (h, params) => {
            let name = params.row.ipAddress;
            return h(
              'div',
              {
                class: { tableInfo: true },
                attrs: { title: name }
              },
              name
            );
          }
        },
        {
          title: '网络',
          key: 'networkName',
          render: (h, params) => {
            let name = params.row.networkName;
            return h(
              'div',
              {
                class: { tableInfo: true },
                attrs: { title: name }
              },
              name
            );
          }
        },
        {
          title: '连接',
          key: 'connect',
          render: (h, params) => {
            let id = params.row.id;
            return h('i', {
              class: ['iconfont', 'icon-738bianjiqi_chaolianjie'],
              on: {
                click: () => {
                  this.connectVirnet(id);
                }
              }
            });
          }
        }
      ],
      virtualColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'serverName',
          sortable: 'custom',
          ellipsis: true,
          render: (h, params) => {
            let serverName = params.row.serverName;
            return h(
              'span',
              {
                attrs: {
                  title: serverName
                },
                class: ['cell-info-active'],
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'cloud-host/detail',
                      params: {
                        id: params.row.id
                      }
                    });
                  }
                }
              },
              serverName
            );
          }
        },
        {
          title: '状态',
          key: 'status',
          ellipsis: true,
          filterMultiple: false,
          filters: SimpleServerStatus,
          filterRemote: filters => {
            this.cloudHostTable.current = 1;
            this.filterStatusRemote(filters, 'status');
          },
          render: (h, params) => {
            let status = params.row.status.toLowerCase();
            let statusObj = SimpleServerStatus.filter(val => {
              return val.value === status;
            });
            let text = statusObj.length ? statusObj[0].label : '未知状态',
              color = statusObj.length ? statusObj[0].color : '#ffa904';
            return h(
              'div',
              {
                class: 'ivu-table-cell-ellipsis',
                style: {
                  color: color
                },
                attrs: { title: text }
              },
              [
                h('div', {
                  class: 'cds-status-dot ',
                  style: {
                    backgroundColor: color
                  }
                }),
                h(
                  'span',
                  {
                    style: {
                      'vertical-align': 'middle'
                    }
                  },
                  text
                )
              ]
            );
          }
        },
        {
          title: '镜像',
          key: 'imageName',
          ellipsis: true,
          render: (h, params) => {
            let imageName = params.row.imageName,
              osName = params.row.osName;
            if (!imageName) {
              return h('span', imageName);
            }
            let classes = '';
            if(osName !== null){
                classes = ['system-bg'];
                let system = osName.match(/aix|asianux|centos|debian|linux|oracle|redhat|suse|ubuntu|windows/i);
                if (system !== null && system[0]) {
                    classes.push('bg-' + system[0].toLowerCase());
                }
            }
            return h(
              'span',
              {
                attrs: {
                  title: imageName
                }
              },
              [
                h('span', {
                  class: classes
                }),
                h(
                  'span',
                  {
                    style: {
                      'vertical-align': 'middle'
                    }
                  },
                  imageName
                )
              ]
            );
          }
        },
        {
          title: '规格',
          key: 'flavorInfo',
          ellipsis: true,
          render: (h, params) => {
            let flavorInfo = params.row.flavorInfo;
            if (flavorInfo) {
              return h(
                'span',
                {
                  attrs: {
                    title: flavorInfo
                  }
                },
                flavorInfo
              );
            } else {
              let temp =
                params.row.cpu +
                '核' +
                params.row.memory +
                'G' +
                params.row.storage +
                'G' +
                params.row.storageType;
              return h(
                'span',
                {
                  attrs: {
                    title: temp
                  }
                },
                temp
              );
            }
          }
        },
        {
          title: '网络',
          key: 'netName',
          ellipsis: true,
          render: (h, params) => {
            let netName = params.row.netName,
              title = netName ?
                {
                    title: netName
                  } :
                {};
            return h(
              'span',
              {
                attrs: title
              },
              netName || '----'
            );
          }
        },
        {
          title: '公网IP',
          key: 'floatingIp',
          ellipsis: true,
          render: (h, params) => {
            let floatingIp = params.row.floatingIp,
              title = floatingIp ?
                {
                    title: floatingIp
                  } :
                {};
            return h(
              'span',
              {
                attrs: title
              },
              floatingIp || '----'
            );
          }
        },
        {
          title: '所有者',
          key: 'userName',
          sortable: 'custom',
          ellipsis: true,
          render: (h, params) => {
            let userName = params.row.userName,
              title = userName ?
                {
                    title: userName
                  } :
                {};
            return h(
              'span',
              {
                attrs: title
              },
              userName || '----'
            );
          }
        },
        {
          title: '资源区域',
          key: 'zone',
          sortable: 'custom',
          ellipsis: true
        },
        {
          title: '创建时间',
          key: 'createDate',
          sortable: 'custom',
          ellipsis: true,
          render: (h, params) => {
            let date = formatDate(params.row.createDate);
            //将时间格式化
            return h(
              'span',
              {
                attrs: {
                  title: date
                }
              },
              date
            );
          }
        },
        {
          title: '控制台',
          key: 'console',
          width: 70,
          align: 'center',
          render: (h, params) => {
            let serverId = params.row.id;
            return h('i', {
              class: ['iconfont', 'icon-quanju_kongzhi'],
              on: {
                click: () => {
                  this.$http
                    .get(api.openConsole + serverId)
                    .then(({ data }) => {
                      if (data.status) {
                        let url = data.data;
                        if (url !== null && url.length > 0) {
                          window.open(url);
                        }
                      }
                    });
                }
              }
            });
          }
        },
        {
          title: '操作',
          key: 'operation',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h(VirtualOperation, {
              props: {
                params
              }
            });
          }
        }
      ]
    };
  }
};