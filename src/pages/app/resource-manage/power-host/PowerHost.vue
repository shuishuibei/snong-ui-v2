<!--
 * @Description: power虚拟机列表
 * @Author: lys1626
 * @Date: 2019-08-05 10:26:43
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:22:13
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <div class="power-host-container">
      <!-- 头部搜索和按钮操作 -->
      <div class="cds-margin-bottom-14 cds-clearfix">
        <div class="cds-float-left-btn">
          <i-input
            clearable
            class="cds-input-search"
            @on-enter="handleSearch"
            v-model="inputValue"
            placeholder="请输入power虚拟机名称进行查询"></i-input>
          <i-button type="primary" class="cds-btn-search" @click="handleSearch">
            <i class="iconfont icon-iconfontsousuo"></i>
          </i-button>
        </div>
        <div class="cds-float-right-btn">
          <i-button type="primary" @click="ejectConfirmModal('open')"
            key="openKey">
            <i class="iconfont icon-qidong iconfont-normal"></i>
            开启
          </i-button>
          <i-button type="primary" @click="ejectConfirmModal('close')">
            <i class="iconfont icon-icon iconfont-normal"></i>
            关闭
          </i-button>
          <i-button type="primary" @click="reOpenHostBatch">
            <i class="iconfont icon-lvzhou_zhongqi iconfont-normal"></i>
            重启
          </i-button>
          <i-button class="cds-btn-refresh" @click="handleRefresh">
            <i class="iconfont icon-shuaxin1"></i>
          </i-button>
        </div>
      </div>
      <!-- 表格 -->
      <i-table
        stripe
        highlight-row
        :key="tableKey"
        :data="powerHostTable.showData"
        :columns="columns"
        :loading="powerHostTable.loading"
        @on-select="handleSelectSingle"
        @on-select-cancel="handleSelectSingleCancel"
        @on-select-all="handleSelectAll"
        @on-select-all-cancel="handleSelectAllCancel"
        @on-sort-change="sortChange"></i-table>
      <!-- 分页 -->
      <div class="cds-margin-top-14 cds-clearfix">
        <div class="cds-float-left">
          共有{{powerHostTable.total}}条记录，当前页{{powerHostTable.current}}/{{powerHostTable.getPageNum()}}页
        </div>
        <div class="cds-float-right">
          <i-page
            :total="powerHostTable.total"
            :current="powerHostTable.current"
            :page-size="powerHostTable.size"
            :page-size-opts="powerHostTable.pageSizeOpts"
            @on-page-size-change="changePageSize($event, powerHostTable)"
            @on-change="changePage($event, powerHostTable)"
            show-sizer
            placement="top"></i-page>
        </div>
      </div>
      <h3c-modal-confirm
        v-model="powerHostObj.openSingle.flag"
        :title="powerHostObj.openSingle.title"
        :info="powerHostObj.openSingle.info"
        :warning="powerHostObj.openSingle.warning"
        @on-ok="submitOpenPowerHost('openSingle')"></h3c-modal-confirm>
      <h3c-modal-confirm
        v-model="powerHostObj.open.flag"
        :title="powerHostObj.open.title"
        :info="powerHostObj.open.info"
        :warning="powerHostObj.open.warning"
        @on-ok="submitOpenPowerHost('open')"></h3c-modal-confirm>
      <h3c-modal-confirm
        v-model="powerHostObj.close.flag"
        :title="powerHostObj.close.title"
        :info="powerHostObj.close.info"
        :warning="powerHostObj.close.warning"
        @on-ok="submitClosePowerHost('close')"></h3c-modal-confirm>
      <h3c-modal-confirm
        v-model="powerHostObj.closeSingle.flag"
        :title="powerHostObj.closeSingle.title"
        :info="powerHostObj.closeSingle.info"
        :warning="powerHostObj.closeSingle.warning"
        @on-ok="submitClosePowerHost('closeSingle')"></h3c-modal-confirm>
      <!--重启虚拟机-->
      <re-start-comfirm
        title="重启power虚拟机"
        :info="powerHostObj.reStart.info"
        @on-ok="submitReStart"
        v-model="flag.reStart"></re-start-comfirm>
    </div>
  </div>
</template>

<script>
import reStartComfirm from './components/reStartComfirm.vue';
import PowerMoreOperation from './components/PowerMoreOperation.vue';
import { powerHostStatus, moveState } from '@/assets/js/status/index.js';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import { PageParams } from '@/assets/js/page-params.js';
import table_select_all_minxins from '@/assets/js/table-select-all-mixins.js'; // 引入表格多选保留数据的混合文件

export default {
  name: 'PowerHost',
  mixins: [table_select_all_minxins],
  components: {
    'h3c-modal-confirm': H3cModalConfirm,
    're-start-comfirm': reStartComfirm
  },
  data() {
    const hostKey = 'power虚拟机';
    return {
      selectTableConfig: {
        tableKey: 'id',
        dataKey: 'powerHostTable.showData',
        disableKey: 'true'
      },
      powerHostTable: new PageParams(),
      hostKey: hostKey,
      /* 是否批量操作标志, false为单个操作,true为批量操作 */
      powerHostObj: {
        batchFlag: false,
        open: {
          flag: false,
          title: '开启power虚拟机',
          info: '',
          cacheInfo: '是否确认开启选中的' + hostKey,
          warning: '注: ' + hostKey + '必须在有效租期内，状态为”已停止”且无其他任务。'
        },
        openSingle: {
          flag: false,
          title: '开启power虚拟机',
          info: '',
          cacheInfo: '是否确认开启选中的' + hostKey,
          warning: '注: ' + hostKey + '必须在有效租期内，状态为”已停止”且无其他任务。'
        },
        close: {
          flag: false,
          title: '关闭power虚拟机',
          info: '',
          cacheInfo: '是否确认关闭选中的' + hostKey,
          warning: '注: ' + hostKey + '关闭后，Power虚拟机上运行的应用将无法继续提供服务。'
        },
        closeSingle: {
          flag: false,
          title: '关闭power虚拟机',
          info: '',
          cacheInfo: '是否确认关闭选中的' + hostKey,
          warning: '注: ' + hostKey + '关闭后，Power虚拟机上运行的应用将无法继续提供服务。'
        },
        reStart: {
          info: '是否确认重启选中的虚拟机'
        }
      },
      hostFilter: {
        status: ''
      },
      hostId: '',
      ifSingleReopen: false,
      ifSingleOpen: false,
      ifSingleClose: false,
      selectAll: [],
      serverId: '', // 主机id
      /* 对话框标志位 */
      flag: {
        info: false, // 基本信息
        expandDisk: false, // 扩容
        openPowerConfirm: false, // 确认开启虚拟机
        closePowerConfirm: false, // 确认关闭虚拟机
        reStart: false // 重启操作
      },
      tableKey: 0, // 表格重置设置的键值，控制表格刷新
      orderMap: {}, // 列表排序使用对象
      inputValue: '', // 搜索框中显示的值
      searchValue: '', // 实际点击查询按钮发送的值
      /* 分页 */
      page: {
        pageSize: 10, // 每页条数
        totalCount: 0, // 总数
        totalPage: 1, // 总页数
        currentPage: 1 // 当前页码
      },
      columns: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          sortable: 'custom',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                class: 'cell-info-active',
                domProps: {
                  title: params.row.name
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'power-host/detail',
                      params: {
                        id: params.row.id
                      }
                    });
                  }
                }
              },
              params.row.name
            );
          }
        },
        {
          title: '状态',
          key: 'status',
          ellipsis: true,
          filterMultiple: false,
          filters: powerHostStatus,
          /**
           * 远程筛选方法
           * @params value {array} 为当前选中项（filters的value值组成的数组），选中全部时为value为空
           * @params key {string} 为当前当前列的key值
           * @params column {object} 为当前列的配置
           */
          filterRemote: filters => {
            this.powerHostTable.current = 1;
            this.filterStatusRemote(filters, 'status'); // 远程筛选
          },
          render: (h, params) => {
            let status = params.row.status.toLocaleLowerCase(),
              node = powerHostStatus.filter(item => {
                return item.value === status;
              })[0];
            return h(
              'span',
              {
                style: {
                  class: 'ivu-table-cell-ellipsis',
                  color: node.color
                }
              },
              [
                h('div', {
                  class: 'cds-status-dot',
                  style: {
                    background: node.color
                  }
                }),
                h('span', node.label)
              ]
            );
          }
        },
        {
          title: '运行状态',
          key: 'state',
          maxWidth: 130,
          minWidth: 100,
          ellipsis: true,
          render: (h, params) => {
            let state = params.row.state,
              node = moveState.filter(item => {
                return item.value === state;
              })[0];
            return h('span', {}, node.label);
          }
        },
        {
          title: '所有者',
          key: 'userName',
          width: 100,
          sortable: 'custom',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.userName
                }
              },
              params.row.userName
            );
          }
        },
        {
          title: '所属主机',
          key: 'hostName',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.hostName
                }
              },
              params.row.hostName
            );
          }
        },
        {
          title: '镜像',
          key: 'imageName',
          maxWidth: 150,
          minWidth: 100,
          sortable: 'custom',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.imageName
                }
              },
              params.row.imageName
            );
          }
        },
        {
          title: '网络',
          maxWidth: 120,
          minWidth: 90,
          key: 'networkNames',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.networkNames
                }
              },
              params.row.networkNames
            );
          }
        },
        {
          title: '创建时间',
          key: 'createdTime',
          maxWidth: 150,
          minWidth: 100,
          sortable: 'custom',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.createdTime
                }
              },
              params.row.createdTime
            );
          }
        },
        {
          title: '控制台',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h('i', {
              class: ['iconfont', 'icon-quanju_kongzhi tableIcon cell-info-active'],
              on: {
                click: () => {
                  // 点击控制台按钮获取访问所选虚拟机的控制台URL，打开控制台页面
                  this.serverId = params.row.id;
                  this.openConsole();
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
            return h(PowerMoreOperation, {
              props: {
                params
              },
              nativeOn: {
                _getDataHost: value => {
                  this.$nextTick(() => {
                    this.handleRefresh();
                  });
                }
              }
            });
          }
        }
      ]
    };
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  },
  computed: {
    auths() {
      return this.$store.state.auth.auths;
    }
  },
  methods: {
    changePage(currentPage, tablePage) {
      tablePage.current = currentPage;
      this.getTableData({ currentPage: currentPage, pageSize: this.powerHostTable.size });
    },
    changePageSize(pageSize, tablePage) {
      tablePage.size = pageSize;
      this.getTableData({ pageSize: pageSize });
    },
    sortChange(option) {
      this.orderMap = {};
      this.powerHostTable.current = 1; // 改编页码时跳转到第一页
      let order;
      if (option.order === 'asc') {
        order = true;
      } else if (option.order === 'desc') {
        order = false;
      } else {
        order = undefined;
      }
      this.orderMap[option.key] = order;
      this.selectAll = []; // 清空选中数据
      this.serverId = ''; // 清空选中数据
      this.getTableData({ pageSize: this.powerHostTable.size }); // 重新加载数据
    },
    /**
     * @function handleSelectSingle
     * @description 选中单个时触发的方法
     * @param {Array} selection - 当前页面已选择数据
     * @param {Object} row      - 刚选择的数据行的数据
     * @returns {void}
     */
    handleSelectSingle(selection, row) {
      let index = this.selectAll.findIndex(item => item === row[this.keyList.tableKey]);
      if (index < 0) {
        this.selectAll.push(row[this.keyList.tableKey]);
      }
    },
    /**
     * @function handleSelectSingleCancel
     * @description 取消单个选择是触发的方法
     * @param {Array} selection - 当前页面已选择数据
     * @param {Object} row      - 刚选择的数据行的数据
     * @returns {void}
     */
    handleSelectSingleCancel(selection, row) {
      let index = this.selectAll.findIndex(item => item === row[this.keyList.tableKey]);
      if (index > -1) {
        this.selectAll.splice(index, 1);
      }
    },
    /**
     * @function handleSelectAll
     * @description 点击全选表格全选触发的方法
     * @param {Array} selection  - 当前页所有选中的数据
     * @returns {void}
     */
    handleSelectAll(selection) {
      let currentSelectAll = [];
      selection.forEach(item => {
        currentSelectAll.push(item[this.keyList.tableKey]);
      });
      this.selectAll = [...new Set([...this.selectAll, ...currentSelectAll])];
      this.retFlag();
    },
    /**
     * @function handleSelectAllCancel
     * @description 取消全选触发的方法
     * @param {Array} selection - 当前页已经选中的数据
     * @returns {void}
     */
    handleSelectAllCancel(selection) {
      this.transformString.forEach(item => {
        this.selectAll = this.selectAll.filter(select => item[this.keyList.tableKey] !== select);
      });
      this.selectAll = [...new Set(this.selectAll)];
      this.retFlag();
    },
    /**
     * @function handleSelectAllCancel
     * @description 多选时，将单选弹出框设置为false，将用于判断选中数据是多项还是单项
     * @param {Array} selection - 当前页已经选中的数据
     * @returns {void}
     */
    retFlag() {
      this.ifSingleReopen = false;
      this.ifSingleClose = false;
      this.ifSingleOpen = false;
    },
    ejectConfirmModal(key) {
      // 弹出操作开启、关闭、重启
      if (this.selectAll.length > 0) {
        let obj = this.powerHostObj[key];
        obj.info = obj.cacheInfo + '(数量：' + this.selectAll.length + '个)';
        obj.flag = true;
        obj.batchFlag = true;
      } else {
        this.$Notice.warning({ desc: `请至少选择一个${this.hostKey}！` });
      }
    },
    filterStatusRemote(filters, key) {
      this.hostFilter[key] = filters[0];
      this.selectAll = []; // 清空选中数据
      this.serverId = ''; // 清空选中数据
      this.getTableData({ pageSize: this.powerHostTable.size });
    },
    /**
     * @description: 批量重启
     */
    reOpenHostBatch() {
      if (this.selectAll.length === 0) {
        this.$Notice.warning({ desc: '至少选择一项要重启的Power虚拟机！' });
      } else {
        this.flag.reStart = true;
      }
    },
    getTableData({ currentPage = 1, pageSize = 20 } = {}) {
      this.powerHostTable.loading = true;
      this.powerHostTable.size = pageSize;
      this.powerHostTable.current = currentPage;
      this.$http
        .post('power/server/list/page', {
          orderMap: this.orderMap,
          searchMap: Object.assign({ name: this.searchValue }, this.hostFilter),
          current: this.powerHostTable.current, // 当前页
          pageSize: this.powerHostTable.size // 每页条数
        })
        .then(({ data }) => {
          if (data.status) {
            data.data.records.forEach((item, index) => {
              if (this.selectAll.indexOf(item.id) !== -1) {
                item._checked = true;
              }
            });
            this.powerHostTable.showData = data.data.records;
            this.powerHostTable.size = data.data.size;
            this.powerHostTable.total = data.data.total;
            this.powerHostTable.current = data.data.current;
            this.powerHostTable.pageNum = data.data.pages;
          }
          this.powerHostTable.loading = false;
        })
        .catch(() => {
          this.powerHostTable.loading = false;
        });
    },
    handleSearch() {
      this.selectAll = [];
      this.serverId = '';
      this.searchValue = this.inputValue.trim(); // 将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.getTableData({ pageSize: this.powerHostTable.size }); // 请求表格数据：不显示缓冲状态，保留每页条数
    },
    handleRefresh() {
      this.searchValue = '';
      this.inputValue = '';
      this.tableKey = new Date() + Math.random();
      this.powerHostTable.showData = [];

      this.orderMap = {};
      this.hostFilter = {};

      this.selectAll = []; // 清空选中数据
      this.serverId = ''; // 清空选中数据
      this.getTableData({ pageSize: this.powerHostTable.size });
    },
    /**
     * @description: 打开控制台
     */
    openConsole() {
      this.$http.get('power/server/openConsole/' + this.serverId).then(({ data }) => {
        if (data.data) {
          if (data.data.url !== null && data.data.url.length > 0) {
            window.open(data.data.url);
          }
        }
      });
    },
    /**
     * @description: 确认开启PowerHost,虚拟机状态由关机改为运行 开启虚拟机可以批量也可以单个
     */
    submitOpenPowerHost(type) {
      let url = 'power/server/start',
        data = '';
      let arrCopy = [];
      if (type === 'openSingle') {
        arrCopy = [this.serverId];
      } else {
        arrCopy = this.selectAll;
      }
      data = {
        serverId: arrCopy
      };
      this.$http({
        method: 'post',
        url: url,
        data: data
      }).then(({ data }) => {
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.handleRefresh();
        }
      });
      this.powerHostObj.open.flag = false;
      this.powerHostObj.openSingle.flag = false;
      this.retFlag();
    },
    /**
     * @description: 确认关闭PowerHost,虚拟机关闭
     */
    submitClosePowerHost(type) {
      let url = 'power/server/stop',
        data = '';
      let arrCopy = [];
      if (type === 'closeSingle') {
        arrCopy = [this.serverId];
      } else {
        arrCopy = this.selectAll;
      }
      data = {
        serverId: arrCopy
      };
      this.$http({
        method: 'post',
        url: url,
        data: data
      }).then(({ data }) => {
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.handleRefresh();
        }
      });
      this.powerHostObj.close.flag = false;
      this.powerHostObj.closeSingle.flag = false;
      this.retFlag();
    },
    /**
     * @description: 重启虚拟机，选择软重启与硬重启
     * @param {string} dataType: 重启方式
     */
    submitReStart(dataType) {
      let url = `power/server/reboot/${dataType}`,
        data = '';
      let arrCopy = [];
      if (this.ifSingleReopen) {
        arrCopy = [this.serverId];
      } else {
        arrCopy = this.selectAll;
      }
      data = {
        serverId: arrCopy
      };
      this.$http({
        method: 'post',
        url: url,
        data: data
      }).then(({ data }) => {
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.handleRefresh();
        }
      });
      this.flag.reStart = false;
      this.retFlag();
    }
  },
  beforeMount() {
    let dropdown = document.querySelectorAll('.virtual-dropdown');
    if (dropdown !== null && dropdown !== undefined && dropdown.length > 0) {
      dropdown.forEach(item => {
        item.style.display = 'none';
      });
    }
  },
  mounted() {
    this.tableKey = new Date() + Math.random();
    this.getTableData();
    this.$on('openPowerHost', row => {
      this.ifSingleOpen = true; // 点击按钮，使虚拟机状态由关机改为运行
      this.serverId = row.id;
      this.powerHostObj.openSingle.flag = true;
      this.powerHostObj.openSingle.info = this.powerHostObj.openSingle.cacheInfo + '：' + row.name;
    });
    this.$on('closePowerHost', row => {
      this.serverId = row.id; // 点击按钮，使虚拟机状态由运行改为关闭
      this.ifSingleClose = true;
      this.powerHostObj.closeSingle.flag = true;
      this.powerHostObj.closeSingle.info =
        this.powerHostObj.closeSingle.cacheInfo + '：' + row.name;
    });
    this.$on('restartPowerHost', row => {
      this.ifSingleReopen = true; // 点击按钮，选择重启方式，软重启或硬重启，重启虚拟机
      this.serverId = row.id;
      this.flag.reStart = true;
    });
  }
};
</script>
