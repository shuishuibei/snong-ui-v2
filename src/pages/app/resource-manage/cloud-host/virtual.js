/*
 * @Description: 主机页面js文件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-11-01 14:42:01
 */
import api from './api.js';
import emitter from '@/assets/js/emitter.js';
import hostMixin from './host-mixin.js';
import H3cModalTable from '@/components/h3c-modal-table/H3cModalTable.vue';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import {PageParams} from '@/assets/js/page-params.js';
import ChangeSpec from './components/ChangeSpec.vue';
import VirtualDetail from './components/VirtualDetail/VirtualDetail.vue';
import DeleteHost from './components/DeleteHost.vue';
import tableSelectAllMixins from '@/assets/js/table-select-all-mixins.js';

export default {
  name: 'CloudHost',
  mixins: [emitter, hostMixin,tableSelectAllMixins],
  components: {
    'virtual-detail': VirtualDetail,
    'h3c-modal-table': H3cModalTable,
    'change-spec': ChangeSpec,
    'delete-host': DeleteHost,
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    const hostKey = 'x86虚拟机';
    return {
      queryFlag: false,
      hostKey: hostKey,
      modalObj: {
        open: {
          flag: false,
          batchFlag: false,// 是否批量操作标志, false为单个操作,true为批量操作
          title: `开启${hostKey}`,
          info: `确认开启选中的${hostKey}`,
          cacheInfo: `确认开启选中的${hostKey}`,
          warning: `注: ${hostKey}必须在有效租期内，状态为”已停止”且无其他任务。`
        },
        close: {
          flag: false,
          batchFlag: false,
          title: `关闭${hostKey}`,
          info: `确认关闭选中的${hostKey}`,
          cacheInfo: `确认关闭选中的${hostKey}`,
          warning: `注: 关闭${hostKey}后，虚拟机上运行的应用将无法继续提供服务`
        },
        restart: {
          flag: false,
          batchFlag: false,
          title: `重启${hostKey}`,
          info: `确认重启选中的${hostKey}`,
          cacheInfo: `确认重启选中的${hostKey}`,
          warning: `注: ${hostKey}重启期间，${hostKey}上运行的应用将无法继续提供服务`
        },
        hangup: {
          flag: false,
          batchFlag: false,
          title: `挂起${hostKey}`,
          info: `确认挂起选中的${hostKey}`,
          cacheInfo: `确认挂起选中的${hostKey}`,
          warning: `注: ${hostKey}挂起期间，${hostKey}上运行的应用将无法继续提供服务`
        },
        recovery: {
          flag: false,
          batchFlag: false,
          title: `恢复${hostKey}`,
          info: `确认恢复选中的${hostKey}`,
          cacheInfo: `确认恢复选中的${hostKey}`,
          warning: `注: ${hostKey}将恢复至挂起前的状态`
        },
        delete: {
          flag: false,
          batchFlag: false,
          title: `删除${hostKey}`,
          info: `确认删除选中的${hostKey}`,
          cacheInfo: `确认删除选中的${hostKey}`,
          warning: `注: ${hostKey}删除后，${hostKey}系统盘上存储的数据将无法恢复`
        }
      },
      tableKey: '',
      cloudHostTable: new PageParams(),
      selectTableConfig: {
        tableKey: 'id',
        dataKey: 'cloudHostTable.showData',
        disableKey: 'true'
      },
      tableStatusObj: {
        /*开启、关闭、重启、挂起、恢复*/
        open: '开启',
        close: '关闭',
        restart: '重启',
        hangup: '挂起',
        recovery: '恢复',
        delete: '删除'
      },
      url: api.url,
      networkCardUrl: api.networkCardUrl,
      publicNetIpUrl: api.publicNetIpUrl,
      recoveryPublicIpUrl: api.recoveryPublicIpUrl,
      networkUrl: api.networkUrl,
      availableDiskListUrl: api.availableDiskListUrl,
      mountedDiskUrl: api.mountedDiskUrl,
      /*模糊查询输入内容*/
      queryName: '',
      searchValue: '',
      orderMap: {},
      hostFilter: {},
      /*保存进行操作的虚拟机的信息*/
      operVirMachineObj: {}
    };
  },
  methods: {
    /**
     * @description: 状态远程过滤方法
     * @param filters {Array} x86虚拟机状态数组
     * @param key {String} 状态字段:'status'
     */
    filterStatusRemote(filters, key) {
      this.hostFilter[key] = filters[0];
      this.selectAll = [];
      this.getServerlist();
    },
     /**
     * @description:点击排序时触发
     * @param option {Object} 排序信息对象
     * @return: null
     */
    sortChange(option) {
      this.orderMap = {};
      this.cloudHostTable.current = 1;  //改编页码时跳转到第一页
      let order;
      if (option.order === 'asc') {
        order = true;
      } else if (option.order === 'desc') {
        order = false;
      } else {
        order = undefined;
      }
      this.$set(this.orderMap, option.key, order);
      this.selectAll = [];
      //重新加载数据
      this.getServerlist();
    },
    /**
     * @description: 跳转页面
     * @param currentPage {Number} 当前页码 
     * @param tablePage {Object} 分页对象 
     * @return: null
     */
    changePage(currentPage, tablePage) {
      tablePage.current = currentPage;
      this.getServerlist();
    },
    /**
     * @description: 更改每页分页数
     * @param pageSize {Number} 每页分页数 
     * @param tablePage {Object} 分页对象 
     * @return: null
     */
    changePageSize(pageSize, tablePage) {
      tablePage.size = pageSize;
      this.$nextTick(()=>{
        this.getServerlist();
      });
    },
    /**
     * @description: 表格选中项发生变化
     * @param selection {Array} 已选项数据
     * @return: null
     */
    // selectionChange(selection) {
    //   this.selectIds = [];
    //   selection.forEach((value) => {
    //     this.selectIds.push(value.id);
    //   });
    // },
    /**
     * @description: 确认执行电源操作
     * @param key {String} 电源操作种类
     * @return: null
     */
    batchOperHost(key) {
      let param = null;
      param = this.modalObj[key].batchFlag ? this.selectAll : [this.operVirMachineObj.id];
      
      this.$loading.show();
      this.$http.post(api[key + 'HostUrl'], param).then((data) => {
        if (data.data.status) {
          this.$Notice.success({desc: `已发送${this.tableStatusObj[key]}${this.hostKey}请求，请稍后刷新确认结果。`});
          this.$http.put(api.timeTaskUrl).then();
          this.refresh();
        }
        this.$loading.hide();
      });
      this.modalObj[key].flag = false;
    },
    /**
     * @description: 关闭h3c-modal-confirm弹出框
     * @param key {String}  电源操作：open/close/restart/hangup/recovery
     * @return: null
     */
    cancelModal(key) {
      this.modalObj[key].flag = false;
    },
    
    // add() {
    //   this.$router.push({
    //     name: 'cloud-host/add'
    //   });
    // },
    /**
     * @description: 模糊查询
     * @return: null
     */
    handleSearch(){
      this.searchValue = this.queryName.trim();
      this.selectAll = [];
      this.getServerlist();
    },
    /**
     * @description: 获取x86虚机分页信息
     * @return: null
     */
    getServerlist() {
      /* 防止触发changePageSize时同时触发changePage事件，短时间内同时调用两次请求 */
      if(this.queryFlag){
        return;
      }else {
          this.queryFlag = true;
          setTimeout(()=>{
              this.queryFlag = false;
          },300);
      }
      this.cloudHostTable.loading = true;
      this.$http.post(api.url, {
        searchMap: Object.assign({serverName: this.searchValue}, this.hostFilter),
        orderMap: this.orderMap,
        current: this.cloudHostTable.current,
        pageSize: this.cloudHostTable.size
      }).then(({data}) => {
        if (data.status) {
          data.data.records.forEach((item)=>{
              if(this.selectAll.includes(item.id)){
                item._checked = true;
              }
          });
          this.cloudHostTable.showData = data.data.records;
          this.cloudHostTable.size = data.data.size;
          this.cloudHostTable.total = data.data.total;
          this.cloudHostTable.current = data.data.current;
        }
        this.cloudHostTable.loading = false;
      }).catch(() => {
        this.cloudHostTable.loading = false;
      });
    },
    /**
     * @description: 点击刷新
     * @return: null
     */
    refresh() {
      this.tableKey = new Date() + Math.random();// 重设Table组件的key，促使Table组件重新渲染
      this.queryName = '';// 清空搜索输入框
      this.searchValue = '';
      this.orderMap = {};// 清空排序
      this.hostFilter = {};
      this.selectAll = [];
      this.cloudHostTable.current = 1;
      this.cloudHostTable.showData = [];
      this.getServerlist();
    },
    /**
     * @description: 弹出操作开启、关闭、重启、挂起、恢复、删除提示框
     * @param key {String} restart/hangup/recovery 
     * @return: null
     */
    ejectConfirmModal(key) {
      if (this.selectAll.length > 0) {
        let obj = this.modalObj[key];
        obj.info = obj.cacheInfo + '(数量：' + this.selectAll.length + '个)';
        obj.flag = true;
        obj.batchFlag = true;
      } else {
        this.$Notice.warning({desc: `请至少选择一个${this.hostKey}！`});
      }
    },
    /**
     * @description: 挂载硬盘
     * @param id {String} 硬盘id 
     * @return: null
     */
    installVirnetCard(id) {
      this.$loading.show();
      let serverId = this.operVirMachineObj.id;
      this.$http.post(api.diskMountVirnetUrl + id + '/' + serverId).then((data) => {
        this.$loading.hide();
        if (data.data.status) {
          this.$refs.mountDiskModal.closeModal();
          this.$Notice.success({desc: '已发送挂载硬盘请求,请稍后确认！'});
          this.$http.put(api.timeDiskTaskUrl).then();
          this.getServerlist();
        }
      })
    },
    /**
     * @description: 卸载硬盘
     * @param id {String} 硬盘id 
     * @return: null
     */
    uninstallDisk(diskId) {
      this.$loading.show();
      let serverId = this.operVirMachineObj.id;
      this.$http.delete(api.unmountDiskUrl + diskId + '/' + serverId).then((data) => {
        this.$loading.hide();
        if (data.data.status){
          this.$refs.unloadDiskModal.closeModal();
          this.$Notice.success({desc: '已发送卸载硬盘请求,请稍后确认！'});
          this.$http.put(api.timeDiskTaskUrl).then();
          this.getServerlist();
        }
      });
    },
    /**
     * @description: 加载虚拟网卡
     * @param id {String} 虚拟网卡id
     * @return: null
     */
    connectVirnet(id) {
      let portId = id,
          serverId = this.operVirMachineObj.id;
      this.$loading.show();
      this.$http.post(api.hostBindVirnetUrl + serverId + '/' + portId).then((data) => {
        this.$loading.hide();
        if (data.data.status) {
          this.$refs.loadNetworkCardModal.closeModal();
          this.$Notice.success({desc: '已发送加载虚拟网卡请求,请稍后确认！'});
        }
      });
    },
     /**
     * @description: 卸载虚拟网卡
     * @param id {String} 虚拟网卡id
     * @return: 
     */
    uninstallVirnetCard(id) {
      let portId = id,
          serverId = this.operVirMachineObj.id;
      this.$loading.show();
      this.$http.delete(api.uninstallVirnetCardUrl + serverId + '/' + portId).then((data) => {
        this.$loading.hide();
        if (data.data.status) {
          this.$refs.unloadNetworkCardModal.closeModal();
          this.$Notice.success({desc: '已发送卸载虚拟网卡请求,请稍后确认！'});
        }
      });
    },
    /**
     * @description: 对事件添加监听,用于弹出确认框
     * @param eventName {String} 事件名称
     * @param callback {Function} 监听事件回调函数
     * @return: null
     */
    setOnEvent(eventName, callback, param = null) {
      this.$on(eventName, (row) => {
        callback(row);
        this.$refs[eventName + 'Modal'].showModal(param);
      })
    }
  },
  created() {
    this.getServerlist();
  },
  beforeMount (to, from, next) {
    let dropdown = document.querySelectorAll('.power-host-dropdown');
    if(dropdown !== null && dropdown !== undefined && dropdown.length > 0) {
      dropdown.forEach((item)=>{
        item.style.display = 'none';
      })
    }
  },
  mounted() {
    this.$on('refresh',()=>{
      this.refresh();
    })

    /* 弹出单个操作开启、关闭、重启、挂起、恢复、删除提示框 */
    let arr = ['open', 'close', 'restart', 'hangup', 'recovery'];
    arr.forEach((item) => {
      this.$on(item, (row) => {
        let obj = this.modalObj[item];
        obj.flag = true;
        obj.batchFlag = false;// 单个操作
        obj.info = obj.cacheInfo + ' : ' + row.serverName;
        this.operVirMachineObj.id = row.id;
      })
    });

    /*退订*/
    this.$on('delete', (row) => {
      this.$refs.deleteHostComponent.showModal(row.id);
    });

    /* 挂载硬盘 */
    this.setOnEvent('mountDisk', (row) => {
      let {userId, virtType, host, id} = row;
      this.operVirMachineObj.id = id;
      this.availableDiskListUrl = api.availableDiskListUrl + host + '/' + virtType + '/' + userId;
    });

    /* 卸载硬盘timeTaskUrl */
    this.setOnEvent('unloadDisk', (row) => {
      let serverId = row.id;
      this.operVirMachineObj.id = serverId;
      this.mountedDiskUrl = api.mountedDiskUrl + serverId;
    });

    /* 加载虚拟网卡 */
    this.setOnEvent('loadNetworkCard', (row) => {
      let azoneId = row.azoneId,
          serverId = row.id;
      this.operVirMachineObj.id = serverId;
      this.networkCardUrl = api.networkCardUrl + azoneId;
    });

    /* 卸载虚拟网卡 */
    this.setOnEvent('unloadNetworkCard', (row) => {
      let id = row.id;
      this.operVirMachineObj.id = id;
      this.networkUrl = api.networkUrl + id;
    });

    /* 修改规格 */
    this.$on('changeSpec', (row) => {
      let {id, cpu, memory, storage, storageType, minCpu, minRam, minDisk} = row;
      this.operVirMachineObj.id = id;
      this.$refs.changeSpecModal.showModal({id, cpu, memory, storage, storageType, minCpu, minRam, minDisk});
    });
    
  },
  beforeRouteLeave(to,from,next){
    from.meta.keepAlive = false;
    next();
  }
};
