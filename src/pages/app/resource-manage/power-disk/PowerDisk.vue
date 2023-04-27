<!--
 * @Description: power硬盘列表
 * @Author: lys1626
 * @Date: 2019-07-30 10:06:40
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:18:46
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <div class="power-disk-container">
      <!-- 头部搜索和按钮操作 -->
      <div class="cds-margin-bottom-14 cds-clearfix">
        <div class="cds-float-left-btn">
          <i-input
            clearable
            @on-enter="handleSearch"
            class="cds-input-search"
            v-model="inputValue"
            placeholder="请输入power硬盘名称进行查询"></i-input>
          <i-button
            type="primary"
            class="cds-btn-search"
            @click="handleSearch">
            <i class="iconfont icon-iconfontsousuo"></i>
          </i-button>
        </div>
        <div class="cds-float-right-btn">
          <i-button type="primary" @click="ejectConfirmModal('unsubscribe')">
            <i class="iconfont icon-tuihuozhong"></i>
            批量退订
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
        ref="table"
        :key="tableKey"
        :data="powerDiskTable.showData"
        :loading="powerDiskTable.loading"
        :columns="columns"
        @on-select="handleSelectSingle"
        @on-select-cancel="handleSelectSingleCancel"
        @on-select-all="handleSelectAll"
        @on-select-all-cancel="handleSelectAllCancel"
        @on-sort-change="sortChange"></i-table>
      <!-- 分页 -->
      <div class="cds-margin-top-14 cds-clearfix">
        <div class="cds-float-left">
          共有{{powerDiskTable.total}}条记录，当前页{{powerDiskTable.current}}/{{powerDiskTable.getPageNum()}}页
        </div>
        <div class="cds-float-right">
          <i-page
            show-sizer
            placement="top"
            :total="powerDiskTable.total"
            :current="powerDiskTable.current"
            :page-size="powerDiskTable.size"
            :page-size-opts="powerDiskTable.pageSizeOpts"
            @on-page-size-change="changePageSize($event, powerDiskTable)"
            @on-change="changePage($event, powerDiskTable)"></i-page>
        </div>
      </div>
    </div>
    <!--修改容量，原来是只可以增大，现在为修改-->
    <expand-disk-size
      @_getData="handleRefresh"
      :data="transferExpandData"
      title="申请扩容"
      ref="expandDisk"
      v-model="flag.expandDisk"></expand-disk-size>
    <!--挂载虚拟机-->
    <info-table
      v-if="flag.mount"
      :is-batch-mount-table="isBatchMount"
      @show="(bool)=>{this.flag.mount=bool}"
      @_getData="handleRefresh"
      @changeIsBatchMount="changeIsBatchMount"
      :operation-type="operationType"
      :id-disk="idDisk"
      :tips-flag="tipsFlag"
      tips="硬盘挂载完成后还需要在虚拟机操作系统中启用或mount新增的硬盘才能对其正常使用。"
      ref="mountVirtualMachine"
      title="挂载至虚拟机"></info-table>
    <!--卸载虚拟机-->
    <info-table
      v-if="flag.remove"
      :is-batch-mount-table="isBatchMount"
      @show="(bool)=>{this.flag.remove=bool}"
      @changeIsBatchMount="changeIsBatchMount"
      @_getData="handleRefresh"
      :operation-type="operationType"
      :id-disk="idDisk"
      :tips-flag="tipsFlag"
      tips="卸载硬盘前，建议先在操作系统中停用或umount要卸载的硬盘，以免造成虚拟机操作系统异常。"
      ref="removeVirtualMachine"
      title="卸载虚拟机"></info-table>
    <!-- 批量退订-->
    <h3c-modal-confirm
      v-model="powerDiskObj.unsubscribe.flag"
      :title="powerDiskObj.unsubscribe.title"
      :info="powerDiskObj.unsubscribe.info"
      :warning="powerDiskObj.unsubscribe.warning"
      @on-ok="submitUnsubscribeBatch('unsubscribe')"></h3c-modal-confirm>
    <!--退订power虚拟机-->
    <h3c-modal-confirm
      v-model="powerDiskObj.unsubscribeSingle.flag"
      :title="powerDiskObj.unsubscribeSingle.title"
      :info="powerDiskObj.unsubscribeSingle.info"
      :warning="powerDiskObj.unsubscribeSingle.warning"
      @on-ok="submitUnsubscribe('unsubscribeSingle')"></h3c-modal-confirm>
  </div>
</template>

<script>
import InfoTable from './components/InfoTable.vue';
import ExpandDiskSize from './components/ExpandDiskSize.vue';
import { powerDisk, moveState } from '@/assets/js/status/index.js';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import { PageParams } from '@/assets/js/page-params.js';
import table_select_all_minxins from '@/assets/js/table-select-all-mixins.js'; // 引入表格多选保留数据的混合文件

export default {
  name: 'PowerDisk',
  mixins: [table_select_all_minxins],
  components: {
    'expand-disk-size': ExpandDiskSize,
    'info-table': InfoTable,
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    const hostKey = 'power硬盘';
    return {
      selectTableConfig: {
        tableKey: 'id',
        dataKey: 'powerDiskTable.showData',
        disableKey: 'true'
      },
      hostKey: hostKey,
      selectIdSingle: [],
      selectAll: [], // 保存选择的ids
      powerDiskObj: {
        batchFlag: false, // 是否批量操作标志, false为单个操作,true为批量操作
        unsubscribe: {
          flag: false,
          title: '退订' + hostKey,
          info: '',
          cacheInfo: '是否确认退订选中的' + hostKey,
          warning: '注: ' + hostKey + '退订后，硬盘上存储的数据将无法恢复。'
        },
        unsubscribeSingle: {
          flag: false,
          title: '退订' + hostKey,
          info: '',
          cacheInfo: '是否确认退订选中的' + hostKey,
          warning: '注: ' + hostKey + '退订后，硬盘上存储的数据将无法恢复。'
        }
      },
      tableKey: 0,
      powerDiskTable: new PageParams(),
      hostFilter: {
        status: ''
      },
      operationType: 0, // 操作类型，挂载还是卸载.1为挂载，2为卸载
      idDisk: '', // 硬盘id
      isBatchMount: false, // 是否批量挂载
      tipsFlag: true,
      transferExpandData: {},
      /* 对话框标志位 */
      flag: {
        remove: false,
        mount: false,
        info: false, // 基本信息
        expandDisk: false // 扩容
      },
      /* 基本信息的标题配置信息 */
      detailRows: [
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '日期',
          key: 'date'
        },
        {
          title: '名称',
          key: 'name'
        }
      ],
      filterMap: {}, // 表格筛选参数
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
          maxWidth: 250,
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
                      name: 'power-disk/detail',
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
          width: 130,
          ellipsis: true,
          filterMultiple: false,
          filters: powerDisk,
          filterRemote: filters => {
            this.powerDiskTable.current = 1;
            this.filterStatusRemote(filters, 'status');
          },
          render: (h, params) => {
            let status = params.row.status.toLocaleLowerCase(),
              node = powerDisk.filter(item => {
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
          maxWidth: 180,
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
          title: '存储模板列',
          maxWidth: 200,
          key: 'volumeTypeName',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.volumeTypeName
                }
              },
              params.row.volumeTypeName
            );
          }
        },
        {
          title: '容量(GB)',
          key: 'size',
          maxWidth: 180,
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.size
                }
              },
              params.row.size
            );
          }
        },
        {
          title: '所有者',
          key: 'userName',
          maxWidth: 180,
          sortable: 'custom',
          ellipsis: true,
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
          title: '创建时间',
          key: 'createdTime',
          maxWidth: 200,
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
          title: '挂载',
          width: 50,
          /*  mount 存在，可以卸载
                mount 不存在，可以挂载
                mount 存在，但是可共享 还是可以挂载
                可用状态的非共享硬盘，可用/正在使用状态的共享硬盘可执行挂载至主机操作。挂载至虚拟机图标为可点击状态。 */
          render: (h, params) => {
            let state = params.row.status;
            if (state != 'AVAILABLE' && state != 'IN_USE') {
              return h('i', {
                class: 'iconfont icon-guazai cds-grey-icon'
              });
            } else {
              if (params.row.status == 'AVAILABLE' && !params.row.multiattach) {
                return h('i', {
                  class: 'iconfont icon-guazai cell-info-active',
                  on: {
                    click: () => {
                      this.idDisk = params.row.id; // 当要挂载硬盘的时候，power硬盘能共享的支持批量操作
                      if (params.row.multiattach) {
                        // 判断是否支持批量挂载跟卸载操作
                        this.isBatchMount = true;
                      }
                      this.submitMountDisk();
                    }
                  }
                });
              } else if (
                (params.row.status == 'IN_USE' || params.row.status == 'AVAILABLE') &&
                params.row.multiattach
              ) {
                return h('i', {
                  class: 'iconfont icon-guazai cell-info-active',
                  on: {
                    click: () => {
                      this.idDisk = params.row.id; // 当要挂载硬盘的时候，power硬盘能共享的支持批量操作
                      if (params.row.multiattach) {
                        // 判断是否支持批量挂载跟卸载操作
                        this.isBatchMount = true;
                      }
                      this.submitMountDisk();
                    }
                  }
                });
              } else {
                return h('i', {
                  class: 'iconfont icon-guazai cds-grey-icon'
                });
              }
            }
          }
        },
        {
          title: '卸载',
          width: 50,
          render: (h, params) => {
            let state = params.row.status;
            if (state != 'AVAILABLE' && state != 'IN_USE') {
              return h('i', {
                class: 'iconfont icon-xiezai cds-grey-icon'
              });
            } else {
              return h('i', {
                style: {
                  cursor: params.row.mount.length > 0 ? 'pointer' : 'default',
                  color: params.row.mount.length > 0 ? '#3399ff' : '#7f7f7f'
                },
                class:
                  params.row.mount.length > 0
                    ? 'iconfont icon-xiezai'
                    : 'iconfont icon-xiezai cds-grey-icon',
                on: {
                  click: () => {
                    if (params.row.mount.length > 0) {
                      this.idDisk = params.row.id; // 当要卸载硬盘的时候，power硬盘能共享的支持批量操作
                      if (params.row.multiattach) {
                        // 判断是否支持批量挂载跟卸载操作
                        this.isBatchMount = true;
                      }
                      this.submitMRemoveDisk();
                    }
                  }
                }
              });
            }
          }
        },
        {
          title: '扩容',
          width: 50,
          render: (h, params) => {
            let id = params.row.id,
              name = params.row.name,
              storageType = params.row.type,
              originSize = params.row.size,
              state = params.row.status;
            /* 当在创建/配置/退订中时，列表操作全禁
              当异常时，可以退订 */
            if (state != 'AVAILABLE' && state != 'IN_USE') {
              return h('span', {
                class: 'iconfont icon-kuozhan cds-grey-icon'
              });
            } else {
              return h('span', {
                class: 'iconfont icon-kuozhan cell-info-active',
                on: {
                  click: () => {
                    this.transferExpandData = {
                      id,
                      name,
                      storageType,
                      originSize
                    };
                    this.flag.expandDisk = true;
                  }
                }
              });
            }
          }
        },
        {
          title: '退订',
          width: 50,
          render: (h, params) => {
            let state = params.row.status;
            if (state == 'CREATING' || state == 'RESIZE' || state == 'DELETE') {
              return h('span', {
                class: 'iconfont icon-tuihuozhong cds-grey-icon'
              });
            } else {
              return h('span', {
                class: 'iconfont icon-tuihuozhong cell-info-active',
                on: {
                  click: () => {
                    this.selectIdSingle = [];
                    this.selectIdSingle.push(params.row.id);
                    this.powerDiskObj.unsubscribeSingle.flag = true;
                    this.powerDiskObj.unsubscribeSingle.info =
                      this.powerDiskObj.unsubscribeSingle.cacheInfo + '：' + params.row.name;
                  }
                }
              });
            }
          }
        }
      ]
    };
  },
  methods: {
    changeIsBatchMount() {
      this.isBatchMount = false;
    },
    /**
     * @description: 退订操作
     * @param {string} key: 判断是什么弹出框
     */
    ejectConfirmModal(key) {
      if (this.selectAll.length > 0) {
        let obj = this.powerDiskObj[key];
        obj.info = obj.cacheInfo + '(数量：' + this.selectAll.length + '个)';
        obj.flag = true;
        obj.batchFlag = true;
      } else {
        this.$Notice.warning({ desc: `请至少选择一个${this.hostKey}！` });
      }
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
    filterStatusRemote(filters, key) {
      this.hostFilter[key] = filters[0];
      this.clearChoosed();
      this.getTableData({ pageSize: this.powerDiskTable.size });
    },
    /**
     * @description: 挂载虚拟机操作
     */
    submitMountDisk() {
      this.operationType = 1; // 表示是挂载操作
      this.flag.mount = true;
    },
    /**
     * @description: 卸载虚拟机操作
     */
    submitMRemoveDisk() {
      this.operationType = 2; // 表示是卸载操作
      this.flag.remove = true;
    },
    /**
     * @description: 发送批量退订请求
     */
    submitUnsubscribeBatch() {
      this.$loading.show();
      this.$http
        .post('power/volume/batch', {
          powerVolumeId: this.selectAll
        })
        .then(({ data }) => {
          if (data.status) {
            this.$Notice.success({
              desc: data.message
            });
            this.handleRefresh();
          }
          this.$loading.hide();
        });
    },
    /**
     * @description: 发送退订请求
     */
    submitUnsubscribe() {
      this.$loading.show();
      this.$http.delete('power/volume/' + this.selectIdSingle).then(({ data }) => {
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.handleRefresh();
        }
        this.$loading.hide();
      });
    },
    getTableData({ currentPage = 1, pageSize = 20 } = {}) {
      this.powerDiskTable.loading = true;
      this.powerDiskTable.size = pageSize;
      this.powerDiskTable.current = currentPage;
      this.$http
        .post('power/volume/list/page', {
          orderMap: this.orderMap,
          searchMap: Object.assign({ name: this.searchValue }, this.hostFilter),
          current: this.powerDiskTable.current, // 当前页
          pageSize: this.powerDiskTable.size // 每页条数
        })
        .then(({ data }) => {
          if (data.status) {
            data.data.records.forEach((item, index) => {
              if (this.selectAll.indexOf(item.id) !== -1) {
                item._checked = true;
              }
            });
            this.powerDiskTable.showData = data.data.records;
            this.powerDiskTable.total = data.data.total;
            this.powerDiskTable.size = data.data.size;
            this.powerDiskTable.current = data.data.current;
            this.powerDiskTable.pageNum = data.data.pages;
          }
          this.powerDiskTable.loading = false;
        })
        .catch(() => {
          this.powerDiskTable.loading = false;
        });
    },
    clearChoosed() {
      this.selectAll = [];
      this.selectIdSingle = [];
    },
    /**
     * @description: 点击查询按钮触发
     */
    handleSearch() {
      this.searchValue = this.inputValue.trim(); // 将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.clearChoosed();
      this.getTableData({ pageSize: this.powerDiskTable.size }); //请求表格数据：不显示缓冲状态，保留每页条数
    },
    handleRefresh() {
      this.inputValue = ''; // 清空搜索输入框
      this.searchValue = ''; // 清空搜索输入框
      this.tableKey = new Date() + Math.random(); // 对表格的已置数据进行清空
      this.powerDiskTable.showData = [];
      this.orderMap = {};
      this.hostFilter = {};
      this.clearChoosed(); // 清空选中数据
      this.getTableData({ pageSize: this.powerDiskTable.size });
    },
    sortChange(option) {
      this.orderMap = {};
      this.powerDiskTable.current = 1; // 改编页码时跳转到第一页
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
      this.getTableData({ pageSize: this.powerDiskTable.size }); // 重新加载数据
    },
    changePage(currentPage, tablePage) {
      tablePage.current = currentPage;
      this.getTableData({ currentPage: currentPage, pageSize: this.powerDiskTable.size });
    },
    changePageSize(pageSize, tablePage) {
      tablePage.size = pageSize;
      this.getTableData({ pageSize: pageSize });
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
    this.getTableData();
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  }
};
</script>
