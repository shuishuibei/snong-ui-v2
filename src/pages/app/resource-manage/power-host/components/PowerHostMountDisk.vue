<!--
 * @Description: power虚拟机挂载硬盘弹窗
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:21:05
 -->
<template>
  <i-modal
    v-model="visible"
    :value="value"
    :scrollable="true"
    :mask-closable="false"
    @on-cancel="closeModal()"
    :width="900">
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
          style="width: 200px;"
          @on-enter="handleSearch"
          v-model="inputValue"
          placeholder="请输入名称进行查询"></i-input>
        <i-button type="primary" class="cds-btn-search" @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
      <div class="cds-float-right-btn" v-show="isBatchDeletion">
        <i-button type="primary" @click="handleMountBatch">
          <i class="iconfont iconfont icon-guazai"></i>
          批量挂载
        </i-button>
      </div>
    </div>
    <div>
      <i-table
        stripe
        highlight-row
        size="small"
        height="233"
        :loading="tableConfig.loading"
        :key="tableConfig.key"
        ref="selection"
        @on-selection-change="chooseChange"
        :columns="tableList"
        :data="tableData">
      </i-table>
      <i-row class="cds-clearfix cds-margin-top-14">
        <div class="cds-float-left">
          共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页
        </div>
        <div class="cds-float-right">
          <i-page
            show-sizer
            size="small"
            :page-size-opts="[5, 10, 20]"
            @on-change="submitMountDisk({currentPage: $event, pageSize: page.pageSize})"
            @on-page-size-change="submitMountDisk({pageSize: $event})"
            placement="top"
            :total="page.totalCount"
            :current="page.currentPage"
            :page-size="page.pageSize">
          </i-page>
        </div>
      </i-row>
    </div>
    <div slot="footer"></div>
  </i-modal>
</template>

<script>
import { powerCanMountDisk } from '@/assets/js/status/index.js';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件

export default {
  name: 'PowerHostMountDisk',
  components: {
    'h3c-title': H3cTitle
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    tipsFlag: {
      type: Boolean,
      default: false
    },
    hostId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableConfig: {
        key: 0,
        loading: false // 表格是否加载中
      },
      hostFilter: {
        status: ''
      },
      orderMap: {},
      singleDiskId: '', // 单个挂载时的硬盘id
      isSingleMount: false,
      serverIds: [], // 获取选中的硬盘id数组,输出参数
      selectedIds: [], // 批量挂载的id
      isBatchDeletion: false, // 是否支持批量删除
      visible: false,
      /* 挂载表格标题数组 */
      tableList: [
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
          title: '状态',
          key: 'status',
          ellipsis: true,
          filterMultiple: false,
          filters: powerCanMountDisk,
          filterRemote: filters => {
            this.page.currentPage = 1;
            this.filterStatusRemote(filters, 'status'); // 远程筛选
          },
          render: (h, params) => {
            let status = params.row.status.toLocaleLowerCase(),
              node = powerCanMountDisk.filter(item => {
                return item.value === status;
              })[0];
            return h(
              'span',
              {
                style: {
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
          title: '容量(G)',
          key: 'size',
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
          title: '存储模板',
          key: 'volumeTypeName',
          minWidth: 60,
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
          title: '共享',
          key: 'multiattach',
          render: (h, params) => {
            let multiattach = params.row.multiattach;
            return h('span', {}, multiattach ? '是' : '否');
          }
        },
        {
          title: '挂载',
          key: 'delete',
          render: (h, params) => {
            return h('span', {
              class: 'iconfont icon-guazai cell-info-active',
              on: {
                click: () => {
                  this.isSingleMount = true;
                  this.singleDiskId = params.row.id;
                  this.handleMount();
                }
              }
            });
          }
        }
      ],
      tableData: [], // 挂载表格数据数组
      /* 分页 */
      page: {
        pageSize: 5, // 每页条数
        totalCount: 0, // 总数
        totalPage: 1, // 总页数
        currentPage: 1 // 当前页码
      },
      privateIpArr: [
        {
          ipAddress: '',
          id: ''
        }
      ],
      inputValue: '',
      searchValue: '' // 真实用于查询的数据
    };
  },
  methods: {
    filterStatusRemote(filters, key) {
      this.hostFilter[key] = filters[0];
      this.clearChoosed();
      this.submitMountDisk({ loading: true, pageSize: this.page.pageSize });
    },
    clearChoosed() {
      this.selectedIds = [];
      this.singleDiskId = '';
      this.serverIds = [];
    },
    /**
     * @function setEmpty
     * @description 清空搜索框,跟已勾选项
     * @returns {String}
     */
    setEmpty() {
      this.inputValue = '';
      this.searchValue = '';
      this.clearChoosed();
      this.tableConfig.key = new Date() + Math.random();
      this.$refs.selection.selectAll(false);
    },
    chooseChange(selection) {
      this.selectedIds = selection.map((item, index, arr) => {
        return item.id;
      });
    },
    setPage(data) {
      this.page.totalCount = data.total;
      this.page.totalPage = data.pages ? data.pages : 1;
      this.page.currentPage = data.current;
      this.page.pageSize = data.size;
    },
    showModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.submitMountDisk();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.submitMountDisk();
    },
    submitMountDisk({ loading = false, currentPage = 1, pageSize = 5 } = {}) {
      if (loading) {
        this.tableConfig.loading = loading;
        this.tableData = [];
      }
      this.page.pageSize = pageSize;
      this.page.currentPage = currentPage;
      this.$nextTick(() => {
        this.$http
          .post('power/server/' + this.hostId + '/list/volume/page', {
            orderMap: this.orderMap,
            searchMap: Object.assign({ name: this.searchValue }, this.hostFilter),
            current: currentPage, // 当前页
            pageSize: pageSize // 每页条数
          })
          .then(({ data }) => {
            if (data.status) {
              data.data.records.forEach((item, index) => {
                if (this.selectedIds.indexOf(item.id) !== -1) {
                  item._checked = true;
                }
              });
              let resp = data.data;
              this.tableData = resp.records;
              this.page.totalCount = resp.total;
              this.page.totalPage = resp.pages ? resp.pages : 1;

              if (
                !this.tableList[0].type &&
                Object.prototype.toString.call(this.tableData) === '[object Array]'
              ) {
                if (this.tableData.length > 1) {
                  /* 数据多于一条时，显示批量挂载按钮与复选框，进行批量挂载 */
                  this.isBatchDeletion = true;
                  this.setPage(data.data);

                  this.tableList.unshift({
                    type: 'selection',
                    width: 40,
                    align: 'center'
                  });
                }
              } else if (this.tableList[0].type && this.tableData.length == 1) {
                this.isBatchDeletion = false;
                this.tableList.shift();
              }
            }
            /* 如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要 */
            loading ? (this.tableConfig.loading = false) : '';
          });
      });
    },
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      this.clearChoosed();
      this.submitMountDisk({
        loading: true,
        pageSize: this.page.pageSize
      });
    },
    /**
     * @function handleMountBatch
     * @description 批量挂载操作
     * @returns {String}
     */
    handleMountBatch() {
      this.isSingleMount = false;
      this.serverIds = this.selectedIds;
      this.handleMount();
    },
    /**
     * @function handleMount
     * @description 处理挂载操作
     * @returns {String}
     */
    handleMount() {
      if (this.isSingleMount) {
        // 判断是否是单个挂载
        this.serverIds = [this.singleDiskId];
      }

      if (this.hostId == '' || this.serverIds.length == 0) {
        this.$Notice.warning({
          desc: '至少选择一项要挂载的硬盘！'
        });
      } else {
        this.$loading.show();
        this.$http
          .post('power/server/volume', {
            type: 'ATTACH',
            serverId: this.hostId,
            powerVolumeIds: this.serverIds // server用来存储已选中的硬盘id
          })
          .then(({ data }) => {
            if (data.data) {
              this.$Notice.success({
                desc: '挂载硬盘成功！'
              });
              this.visible = false;
            }
            this.$loading.hide();
          });
      }
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); //清楚右上角提示信息
        this.visible = newVal; //显示对话框
        this.submitMountDisk();
        this.setEmpty();
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('input', newVal);
      }
    }
  }
};
</script>

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
  font-size: 16px;
}

i.icon-tixingtishi:before {
  font-size: 18px !important;
}
</style>
