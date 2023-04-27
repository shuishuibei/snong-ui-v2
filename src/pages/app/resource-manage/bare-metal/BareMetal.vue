<!--
 * @Description: 裸金属列表
 * @Author: lys1626
 * @Date: 2019-07-30 10:06:40
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:17:15
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <div class="barematal-container">
      <!-- 头部搜索和按钮操作 -->
      <div class="cds-margin-bottom-14 cds-clearfix">
        <div class="cds-float-left-btn">
          <i-input
            clearable
            class="cds-input-search"
            v-model="inputValue"
            @on-enter="handleSearch"
            placeholder="请输入裸金属名称进行查询"></i-input>
          <i-button type="primary" class="cds-btn-search" @click="handleSearch">
            <i class="iconfont icon-iconfontsousuo"></i>
          </i-button>
        </div>
        <div class="cds-float-right-btn">
          <!-- 批量开启-->
          <i-button type="primary" @click="ejectConfirmModal('open')">
            <i class="iconfont icon-kaiqi"></i>
            开启
          </i-button>

          <i-button type="primary" @click="ejectConfirmModal('close')">
            <i class="iconfont icon-guanbi"></i>
            关闭
          </i-button>
          <i-button type="primary" @click="ejectConfirmModal('delete')">
            <i class="iconfont icon-tuihuozhong"></i>
            退订
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
        :data="bareMetalTable.showData"
        :columns="columns"
        :loading="bareMetalTable.loading"
        @on-select="handleSelectSingle"
        @on-select-cancel="handleSelectSingleCancel"
        @on-select-all="handleSelectAll"
        @on-select-all-cancel="handleSelectAllCancel"
        @on-sort-change="sortChange"></i-table>
      <!-- 分页 -->
      <div class="cds-margin-top-14 cds-clearfix">
        <div class="cds-float-left">
          共有{{bareMetalTable.total}}条记录，当前页{{bareMetalTable.current}}/{{bareMetalTable.getPageNum()}}页
        </div>
        <div class="cds-float-right">
          <i-page
            show-sizer
            placement="top"
            :total="bareMetalTable.total"
            :current="bareMetalTable.current"
            :page-size="bareMetalTable.size"
            :page-size-opts="bareMetalTable.pageSizeOpts"
            @on-page-size-change="changePageSize($event, bareMetalTable)"
            @on-change="changePage($event, bareMetalTable)"></i-page>
        </div>
      </div>
      <!-- 批量开启-->
      <h3c-modal-confirm
        v-model="bareObj.open.flag"
        :title="bareObj.open.title"
        :info="bareObj.open.info"
        :warning="bareObj.open.warning"
        @on-ok="submitOpenBareMetal('open')"></h3c-modal-confirm>
      <!--单个开启-->
      <h3c-modal-confirm
        v-model="bareObj.openSingle.flag"
        :title="bareObj.openSingle.title"
        :info="bareObj.openSingle.info"
        :warning="bareObj.openSingle.warning"
        @on-ok="submitOpenBareMetal('openSingle')"></h3c-modal-confirm>
      <!--批量关闭-->
      <h3c-modal-confirm
        v-model="bareObj.close.flag"
        :title="bareObj.close.title"
        :info="bareObj.close.info"
        :warning="bareObj.close.warning"
        @on-ok="submitCloseBareMetal('close')"></h3c-modal-confirm>
      <!--单个关闭-->
      <h3c-modal-confirm
        v-model="bareObj.closeSingle.flag"
        :title="bareObj.closeSingle.title"
        :info="bareObj.closeSingle.info"
        :warning="bareObj.closeSingle.warning"
        @on-ok="submitCloseBareMetal('closeSingle')"></h3c-modal-confirm>
      <!--批量销毁-->
      <h3c-modal-confirm
        v-model="bareObj.delete.flag"
        :title="bareObj.delete.title"
        :info="bareObj.delete.info"
        :warning="bareObj.delete.warning"
        @on-ok="submitDeleteBareMetal('delete')"></h3c-modal-confirm>
      <!--单个销毁-->
      <h3c-modal-confirm
        v-model="bareObj.deleteSingle.flag"
        :title="bareObj.deleteSingle.title"
        :info="bareObj.deleteSingle.info"
        :warning="bareObj.deleteSingle.warning"
        @on-ok="submitDeleteBareMetal('deleteSingle')"></h3c-modal-confirm>
    </div>
  </div>
</template>

<script>
import { PageParams } from '@/assets/js/page-params.js';
import { bareStatus } from '@/assets/js/status/index.js';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import table_select_all_minxins from '@/assets/js/table-select-all-mixins.js'; // 引入表格多选保留数据的混合文件

export default {
  name: 'BareMetal',
  mixins: [table_select_all_minxins],
  components: {
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    const hostKey = '裸金属';
    return {
      selectTableConfig: {
        tableKey: 'id',
        dataKey: 'bareMetalTable.showData',
        disableKey: 'true'
      },
      bareMetalTable: new PageParams(),
      selectAll: [], // 保存选择的ids
      selectIdSingle: [], // 保存单个选中id
      hostKey: hostKey,
      bareObj: {
        // 是否批量操作标志, false为单个操作,true为批量操作
        batchFlag: false,
        open: {
          flag: false,
          title: '开启' + hostKey,
          info: '',
          cacheInfo: '是否确认开启选中的' + hostKey,
          warning: '注: ' + hostKey + '必须在有效租期内，状态为”已停止”且无其他任务。'
        },
        openSingle: {
          flag: false,
          title: '开启' + hostKey,
          info: '',
          cacheInfo: '是否确认开启选中的' + hostKey,
          warning: '注: ' + hostKey + '必须在有效租期内，状态为”已停止”且无其他任务。'
        },
        close: {
          flag: false,
          title: '关闭' + hostKey,
          info: '',
          cacheInfo: '是否确认关闭选中的' + hostKey,
          warning: '注: ' + hostKey + '关闭后，' + hostKey + '上运行的应用将无法继续提供服务。'
        },
        closeSingle: {
          flag: false,
          title: '关闭' + hostKey,
          info: '',
          cacheInfo: '是否确认关闭选中的' + hostKey,
          warning: '注: ' + hostKey + '关闭后，' + hostKey + '上运行的应用将无法继续提供服务。'
        },
        delete: {
          flag: false,
          title: '退订' + hostKey,
          info: '',
          cacheInfo: '是否确认退订选中的' + hostKey,
          warning: '注: ' + hostKey + '退订后，' + hostKey + '上运行的应用将无法继续提供服务。'
        },
        deleteSingle: {
          flag: false,
          title: '退订' + hostKey,
          info: '',
          cacheInfo: '是否确认退订选中的' + hostKey,
          warning: '注: ' + hostKey + '退订后，' + hostKey + '上运行的应用将无法继续提供服务。'
        }
      },
      hostFilter: {
        status: ''
      },
      orderMap: {}, // 表格排序参数
      selectIdsSingle: [],
      tableKey: 0,
      inputValue: '', // 搜索框中显示的值
      searchValue: '', // 实际点击查询按钮发送的值
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
                attrs: {
                  title: params.row.name
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'bare-metal/detail',
                      params: {
                        id: params.row.resourceId
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
          title: '别名',
          key: 'alias',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.alias
                }
              },
              params.row.alias
            );
          }
        },
        {
          title: '所有者',
          key: 'userName',
          sortable: 'custom',
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.userName
                }
              },
              params.row.userName
            );
          }
        },
        {
          title: '状态',
          key: 'status',
          ellipsis: true,
          filterMultiple: false,
          filters: bareStatus,
          /**
           * 远程筛选方法
           * @params value {Array} 为当前选中项（filters的value值组成的数组），选中全部时为value为空
           * @params key {string} 为当前当前列的key值
           * @params column {object} 为当前列的配置
           */
          filterRemote: filters => {
            this.bareMetalTable.current = 1;
            // 远程筛选
            this.filterStatusRemote(filters, 'status');
          },
          render: (h, params) => {
            let status = params.row.status,
              node = bareStatus.filter(item => {
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
          title: '规格',
          ellipsis: true,
          render: (h, params) => {
            let cpu = params.row.cpu,
              memory = params.row.memory,
              storage = params.row.storage;
            return h(
              'span',
              {
                attrs: {
                  title: cpu + '核' + memory + 'G' + storage + 'G'
                }
              },
              cpu + '核' + memory + 'G' + storage + 'G'
            );
          }
        },
        {
          title: '资源区域',
          key: 'zone',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.zone
                }
              },
              params.row.zone
            );
          }
        },
        {
          title: '创建时间',
          key: 'createDate',
          sortable: 'custom',
          width: 120,
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.createDate
                }
              },
              params.row.createDate
            );
          }
        },
        {
          title: '开启',
          width: 50,
          align: 'center',
          render: (h, params) => {
            return h('i', {
              class: ['iconfont', 'icon-kaiqi tableIcon cell-info-active'],
              on: {
                click: () => {
                  this.handleClick(params, 'openSingle');
                }
              }
            });
          }
        },
        {
          title: '关闭',
          width: 50,
          align: 'center',
          render: (h, params) => {
            return h('i', {
              class: ['iconfont', 'icon-iconfont icon-guanbi tableIcon cell-info-active'],
              on: {
                click: () => {
                  this.handleClick(params, 'closeSingle');
                }
              }
            });
          }
        },
        {
          title: '退订',
          width: 50,
          align: 'center',
          render: (h, params) => {
            return h('i', {
              class: ['iconfont', 'icon-tuihuozhong tableIcon cell-info-active'],
              on: {
                click: () => {
                  this.handleClick(params, 'deleteSingle');
                }
              }
            });
          }
        }
      ]
    };
  },
  methods: {
    handleClick(params, singleName) {
      this.selectIdSingle = [];
      this.selectIdSingle.push(params.row.id);
      this.bareObj[singleName].flag = true;
      this.bareObj[singleName].info = this.bareObj[singleName].cacheInfo + '：' + params.row.name;
    },
    /**
     * @description: 开启裸金属
     * @param {string} key: 弹出框key值，用于开启or关闭
     */
    submitOpenBareMetal(key) {
      this.$loading.show();
      let ids = key === 'openSingle' ? this.selectIdSingle : this.selectAll;
      this.$http.post('bareMetal/start', ids).then(({ data }) => {
        if (data.status) {
          // 做数据处理
          this.$Notice.success({
            desc: data.message
          });
          this.bareObj[key].flag = false;
          this.handleRefresh();
        }
        this.$loading.hide();
      });
    },
    /**
     * @description: 关闭裸金属
     * @param {string} key: 弹出框key值，用于开启or关闭
     */
    submitCloseBareMetal(key) {
      this.$loading.show();
      let ids = key === 'closeSingle' ? this.selectIdSingle : this.selectAll;
      this.$http.post('bareMetal/stop', ids).then(({ data }) => {
        if (data.status) {
          /* 做数据处理 */
          this.$Notice.success({
            desc: data.message
          });
          this.bareObj[key].flag = false;
          this.handleRefresh();
        }
        this.$loading.hide();
      });
    },
    /**
     * @description: 退订裸金属
     */
    submitDeleteBareMetal(key) {
      this.$loading.show();
      let ids = key === 'deleteSingle' ? this.selectIdSingle : this.selectAll;
      this.$http.post('bareMetal/delete', ids).then(({ data }) => {
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.bareObj[key].flag = false;
          this.handleRefresh();
        }
        this.$loading.hide();
      });
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
    },
    /**
     * @description: 弹出操作开启、关闭、退订
     */
    ejectConfirmModal(key) {
      if (this.selectAll.length > 0) {
        let obj = this.bareObj[key];
        obj.info = obj.cacheInfo + '(数量：' + this.selectAll.length + '个)';
        obj.flag = true;
        obj.batchFlag = true;
      } else {
        this.$Notice.warning({ desc: `请至少选择一个${this.hostKey}！` });
      }
    },
    filterStatusRemote(filters, key) {
      this.hostFilter[key] = filters[0];
      this.clearChoosed();
      this.getData({ pageSize: this.bareMetalTable.size });
    },
    getData({ currentPage = 1, pageSize = 20 } = {}) {
      this.bareMetalTable.loading = true;
      this.bareMetalTable.size = pageSize;
      this.bareMetalTable.current = currentPage;

      this.$http
        .post('bareMetal/listBareMetal', {
          orderMap: this.orderMap,
          searchMap: Object.assign({ name: this.searchValue }, this.hostFilter),
          current: this.bareMetalTable.current, // 当前页
          pageSize: this.bareMetalTable.size // 每页条数
        })
        .then(({ data }) => {
          if (data.data) {
            data.data.records.forEach(item => {
              if (this.selectAll.indexOf(item.id) !== -1) {
                item._checked = true;
              }
            });

            this.bareMetalTable.showData = data.data.records;
            this.bareMetalTable.total = data.data.total;
            this.bareMetalTable.size = data.data.size;
            this.bareMetalTable.current = data.data.current;
          }
          this.bareMetalTable.loading = false;
        })
        .catch(() => {
          this.bareMetalTable.loading = false;
        });
    },
    changePage(currentPage, tablePage) {
      tablePage.current = currentPage;
      this.getData({ currentPage: currentPage, pageSize: this.bareMetalTable.size });
    },
    changePageSize(pageSize, tablePage) {
      tablePage.size = pageSize;
      this.getData({ pageSize: pageSize });
    },
    sortChange(option) {
      this.orderMap = {};
      this.bareMetalTable.current = 1;
      let order;
      if (option.order === 'asc') {
        order = true;
      } else if (option.order === 'desc') {
        order = false;
      } else {
        order = undefined;
      }
      this.orderMap[option.key] = order;
      this.clearChoosed();
      this.getData(); // 重新加载数据
    },
    handleSearch() {
      this.searchValue = this.inputValue.trim(); // 将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.clearChoosed();
      this.getData({ pageSize: this.bareMetalTable.size });
    },
    clearChoosed() {
      this.selectAll = [];
      this.selectIdsSingle = [];
    },
    handleRefresh() {
      this.tableKey = new Date() + Math.random();
      this.bareMetalTable.showData = [];
      this.searchValue = '';
      this.inputValue = '';
      this.orderMap = {};
      this.hostFilter = {};
      this.clearChoosed();
      this.getData({ pageSize: this.bareMetalTable.size });
    },
    deleteTableColumn(title) {
      let index = 0;
      this.columns.map((value, key) => {
        if (value.title === title) {
          index = key;
        }
      });
      if (index !== 0) {
        this.columns.splice(index, 1);
      }
    }
  },
  computed: {
    auths() {
      return this.$store.state.auth.auths;
    }
  },
  mounted() {
    this.getData();
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  }
};
</script>
