<!--
 * @Description: power硬盘挂卸载power虚拟机
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:18:36
 -->
<template>
  <div>
    <i-modal
      :value="true"
      :scrollable="true"
      :mask-closable="false"
      @on-visible-change="closeModal"
      width="800">
      <template #header>
        <h3c-title
          :title="title"
          :is-modal="true"
          :style-set="{'border-bottom': 'none'}">
        </h3c-title>
      </template>
      <div class="info-content cds-margin-bottom-14" v-if="tipsFlag">
        <i class="iconfont icon-tixingtishi"></i>
        <div class="content-con">{{tips}}</div>
      </div>
      <div class="cds-clearfix cds-margin-bottom-14">
        <div class="cds-float-left-btn">
          <i-input
            clearable
            class="cds-input-search"
            v-model="inputName"
            @on-enter="handleSearch"
            placeholder="请输入名称进行查询"></i-input>
          <i-button type="primary" class="cds-btn-search" @click="handleSearch">
            <i class="iconfont icon-iconfontsousuo"></i>
          </i-button>
        </div>
        <div class="cds-float-right-btn">
          <i-button type="primary" @click="uninstallerHostBatch" v-if="isBatchUninstall">
            <i class="iconfont icon-xiezai"></i>
            批量卸载
          </i-button>
          <i-button type="primary" @click="installerHostBatch" v-if="isBatchMount">
            <i class="iconfont icon-guazai"></i>
            批量挂载
          </i-button>
        </div>
      </div>
      <div>
        <i-table
          stripe
          highlight-row
          class="disk-info-table"
          size="small"
          height="233"
          ref="selection"
          :key="tableKey"
          :data="infoTable.showData"
          :loading="infoTable.loading"
          :columns="tableItem"
          @on-selection-change="rowSelect"
          @on-sort-change="sortChange">
        </i-table>
        <i-row class="cds-margin-top-14 cds-clearfix">
          <div class="cds-float-left">
            共有{{infoTable.total}}条记录，当前页{{infoTable.current}}/{{infoTable.getPageNum()}}页
          </div>
          <div class="cds-float-right">
            <i-page
              show-sizer
              placement="top"
              size="small"
              :total="infoTable.total"
              :current="infoTable.current"
              :page-size="infoTable.size"
              :page-size-opts="infoTable.pageSizeOpts"
              @on-page-size-change="changePageSize($event, infoTable)"
              @on-change="changePage($event, infoTable)">
            </i-page>
          </div>
        </i-row>
      </div>
      <div slot="footer"></div>
    </i-modal>
  </div>
</template>

<script>
import { PageParams } from '@/assets/js/page-params.js';
import { powerHostStatus } from '@/assets/js/status/index.js';
import { mountPowerHostStatus } from '@/assets/js/status/index.js';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件

export default {
  components: {
    'h3c-title': H3cTitle
  },
  props: {
    idDisk: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    tipsFlag: {
      type: Boolean,
      default: false
    },
    tips: {
      type: String,
      default: ''
    },
    /* 判断是挂载还是卸载 */
    operationType: {
      type: Number,
      required: true
    },
    /* 是否显示批量挂载 */
    isBatchMountTable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      styleSet: {
        borderBottom: 0
      },
      tableKey: new Date().toString(), // 表格的属性key,
      infoTable: new PageParams({ size: 5, pageSizeOpts: [5, 10, 20] }),
      // 远程筛选
      hostFilter: {
        status: ''
      },
      hostId: '', // 被挂载的主机（虚拟机）
      isSingleMount: false,
      isSingleUninstall: false,
      isBatchMount: false, // 是否支持批量操作标志
      isBatchUninstall: false, // 是否支持批量操作标志
      selectIds: [], // 存储虚拟机id
      loading: false,
      queryName: '', // 真实查询数据
      inputName: '', // 查询框输入数据
      searchName: '',
      visible: false,
      tableData: [],
      /* 这是挂载虚拟机所要传入的数据 */
      tableItem: [
        {
          title: '名称',
          key: 'name',
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.name
                }
              },
              params.row.name
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
          title: '状态',
          key: 'status',
          ellipsis: true,
          filters: this.operationType == 1 ? mountPowerHostStatus : powerHostStatus,
          filterMultiple: false,
          filterRemote: filters => {
            this.infoTable.setCurrentPage(1);
            this.filterStatusRemote(filters, 'status');
          },
          render: (h, params) => {
            if (this.operationType == 1) {
              /* 挂载  SHUTOFF("已停止"),ACTIVE("运行中") */
              let status = params.row.status,
                node = mountPowerHostStatus.filter(item => {
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
            } else if (this.operationType == 2) {
              /* 卸载显示全部状态
                只有这三种情况下ERROR("异常"),SHUTOFF("已停止"),ACTIVE("运行中")的虚拟机可以点击卸载按钮 */
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
          }
        },
        {
          title: '镜像',
          key: 'imageName',
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
          title: '',
          width: 60,
          render: (h, params) => {
            /* 只有这三种情况下ERROR("异常"),SHUTOFF("已停止"),ACTIVE("运行中")的虚拟机可以点击卸载按钮 */
            if (
              params.row.status == 'ERROR' ||
              params.row.status == 'SHUTOFF' ||
              params.row.status == 'ACTIVE'
            ) {
              return h('span', {
                class:
                  this.operationType == 1
                    ? 'iconfont icon-guazai cell-info-active'
                    : 'iconfont icon-xiezai cell-info-active',
                on: {
                  click: () => {
                    if (this.operationType == 1) {
                      // 单项挂载
                      this.isSingleMount = true;
                      this.hostId = params.row.id;
                      this.installerHostBatch();
                    } else if (this.operationType == 2) {
                      // 单项卸载
                      this.isSingleUninstall = true;
                      this.hostId = params.row.id;
                      this.uninstallerHostBatch();
                    }
                  }
                }
              });
            } else {
              return h('span', {
                class:
                  this.operationType == 1
                    ? 'iconfont icon-guazai cds-grey-icon'
                    : 'iconfont icon-xiezai cds-grey-icon'
              });
            }
          }
        }
      ]
    };
  },
  methods: {
    rowSelect(selection) {
      this.selectIds = [];
      selection.forEach(value => {
        this.selectIds.push(value.id);
      });
    },
    sortChange(option) {
      this.orderMap = {};
      this.infoTable.current = 1; // 改编页码时跳转到第一页
      let order;
      if (option.order === 'asc') {
        order = true;
      } else if (option.order === 'desc') {
        order = false;
      } else {
        order = undefined;
      }
      // this.$set(this.orderMap, option.key, order);
      this.orderMap[option.key] = order;
      this.selectIds = [];
      this.hostId = '';
      this._getTableData({ pageSize: this.infoTable.size }); // 重新加载数据
    },
    filterStatusRemote(filters, key) {
      this.hostFilter[key] = filters[0];
      this.selectIds = [];
      this.hostId = '';
      this._getTableData({ pageSize: this.infoTable.size });
    },
    setEmpty() {
      this.inputName = '';
      this.searchName = '';
      this.$refs.selection.selectAll(false);
    },
    handleSearch() {
      this.searchName = this.inputName;
      this.selectIds = [];
      this.hostId = '';
      this._getTableData({ pageSize: this.infoTable.size });
    },
    /**
     * @description: 卸载主机
     */
    uninstallerHostBatch() {
      if (this.isSingleUninstall) {
        this.selectIds = [this.hostId];
      }
      if (this.idDisk == '' || this.selectIds.length == 0) {
        this.$Notice.warning({
          desc: '至少选择一项要卸载的虚拟机！'
        });
      } else {
        this.$loading.show();
        this.$http
          .post('power/volume/volume/option', {
            action: 'DETACH',
            id: this.idDisk,
            server: this.selectIds
          })
          .then(({ data }) => {
            if (data.status) {
              this.$Notice.success({
                desc: '卸载虚拟机成功！'
              });
              this.closeModal(false);
              this.$emit('_getData');
            }
            this.$loading.hide();
          });
      }
    },
    /**
     * @description: 挂载主机
     */
    installerHostBatch() {
      if (this.isSingleMount) {
        this.selectIds = [this.hostId];
      }
      if (this.idDisk == '' || this.selectIds.length == 0) {
        this.$Notice.warning({
          desc: '至少选择一项要挂载的虚拟机！'
        });
      } else {
        this.$loading.show();
        this.$http
          .post('power/volume/volume/option', {
            action: 'ATTACH',
            id: this.idDisk,
            server: this.selectIds
          })
          .then(({ data }) => {
            if (data.status) {
              this.$Notice.success({
                desc: '挂载虚拟机成功！'
              });
              this.closeModal(false);
              this.$emit('_getData');
            }
            this.$loading.hide();
          });
      }
    },
    showModal() {
      this.visible = true;
      this.setEmpty();
    },
    closeModal(Bool) {
      this.$emit('changeIsBatchMount');
      !Bool ? this.$emit('show', false) : this.$emit('show', true);
    },
    _getTableData({ isFirstIn = false, currentPage = 1, pageSize = 5 } = {}) {
      this.infoTable.loading = true;
      this.infoTable.size = pageSize;
      this.infoTable.current = currentPage;
      if (this.operationType === 1) {
        /* 挂载虚拟机 */
        this.$http
          .post('power/server/list/page', {
            searchMap: Object.assign(
              { name: this.searchName, volumeId: this.idDisk },
              this.hostFilter
            ),
            current: this.infoTable.current, // 当前页
            pageSize: this.infoTable.size // 每页条数
          })
          .then(({ data }) => {
            if (data.status && data.data) {
              data.data.records.forEach((item, index) => {
                if (this.selectIds.indexOf(item.id) !== -1) {
                  item._checked = true;
                }
              });
              this.infoTable.showData = data.data.records;
              this.infoTable.size = data.data.size;
              this.infoTable.total = data.data.total;
              this.infoTable.current = data.data.current;
              this.infoTable.pageNum = data.data.pages;
              if (isFirstIn) {
                if (this.tableItem[0].type === 'selection') {
                  this.tableItem.shift();
                }
                if (
                  this.isBatchMount &&
                  Object.prototype.toString.call(this.tableData) === '[object Array]'
                ) {
                  if (!this.tableItem[0].type) {
                    this.tableItem.unshift({
                      type: 'selection',
                      width: 40,
                      align: 'center'
                    });
                  }
                }
              }
            }
            this.infoTable.loading = false;
          });
      } else if (this.operationType === 2) {
        /* 卸载虚拟机 */
        this.$http
          .post('power/server/list/using/volume/' + this.idDisk + '/page', {
            searchMap: Object.assign({ name: this.searchName }, this.hostFilter),
            current: this.infoTable.current, // 当前页
            pageSize: this.infoTable.size // 每页条数
          })
          .then(({ data }) => {
            if (data.data) {
              data.data.records.forEach((item, index) => {
                if (this.selectIds.indexOf(item.id) !== -1) {
                  item._checked = true;
                }
              });
              this.infoTable.showData = data.data.records;
              this.infoTable.size = data.data.size;
              this.infoTable.total = data.data.total;
              this.infoTable.current = data.data.current;
              this.infoTable.pageNum = data.data.pages;

              if (isFirstIn) {
                // 卸载不需要判断批量操作
                if (this.tableItem[0].type === 'selection') {
                  this.tableItem.shift();
                }
                if (
                  this.isBatchUninstall &&
                  Object.prototype.toString.call(this.tableData) === '[object Array]'
                ) {
                  if (!this.tableItem[0].type) {
                    this.tableItem.unshift({
                      type: 'selection',
                      width: 40,
                      align: 'center'
                    });
                  }
                }
              }
            }
            this.infoTable.loading = false;
          });
      }
    },
    changePage(currentPage, tablePage) {
      tablePage.current = currentPage;
      this._getTableData({ currentPage: currentPage, pageSize: this.infoTable.size });
    },
    changePageSize(pageSize, tablePage) {
      tablePage.size = pageSize;
      this._getTableData({ pageSize: pageSize });
    },
    changeStatus(newVal) {
      /* 是否显示批量操作按钮 */
      if (this.isBatchMountTable && this.operationType == 1) {
        this.isBatchMount = true;
      } else if (this.isBatchMountTable && this.operationType == 2) {
        this.isBatchUninstall = true;
      } else {
        this.isBatchMount = false;
        this.isBatchUninstall = false;
      }
      if (this.tableItem.length > 0) {
        // 更改table标题的title的Status
        if (newVal == 1) {
          /* 挂载页面 */
          if (this.tableItem[0].type === 'selection') {
            this.tableItem[3].filters = mountPowerHostStatus;
          } else {
            this.tableItem[2].filters = mountPowerHostStatus;
          }
          this.tableItem[5].title = '挂载';
        } else if (newVal == 2) {
          /* 卸载页面
            只有这三种情况下ERROR("异常"),SHUTOFF("已停止"),ACTIVE("运行中")的虚拟机可以点击卸载按钮 */
          if (this.tableItem[0].type === 'selection') {
            this.tableItem[3].filters = powerHostStatus;
          } else {
            this.tableItem[2].filters = powerHostStatus;
          }
          this.tableItem[5].title = '卸载';
        }
      }
    }
  },
  mounted() {
    this.changeStatus(this.operationType); // 给弹出框状态赋值
    this.setEmpty();
    this._getTableData({ isFirstIn: true });
  }
};
</script>

<style lang="less" scoped>
/deep/.disk-info-table {
  .ivu-table-row td:last-child .ivu-table-cell {
    overflow: visible;
  }
}
</style>

<style lang="less" scoped>
.info-content {
  color: #ff6600;
  padding: 10px 10px;
  background-color: #feefe6;
  position: relative;

  .icon-tixingtishi {
    position: absolute;
    top: 45%;
    transform: translate(0, -50%);
    color: #ff6600;
    font-size: 18px;
  }

  .content-con {
    padding-left: 25px;
  }
}

.iconfont:not(.header-icon):before {
  font-size: 18px;
}
</style>
