<!--
 * @Description: 选择可同时退订的硬盘
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:19:40
 -->
<template>
  <i-modal
    v-model="visible"
    :value="value"
    :scrollable="true"
    :mask-closable="false"
    :width="width">
    <template #header>
      <h3c-title
        :title="title"
        :is-modal="true"
        :style-set="{'border-bottom': 'none'}">
      </h3c-title>
    </template>
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix cds-margin-bottom-14">
      <div class="cds-float-left-btn">
        <i-input
          clearable
          style="width: 200px;"
          v-model="inputValue"
          @on-enter="handleSearch"
          placeholder="请输入名称进行查询"></i-input>
        <i-button type="primary" class="cds-btn-search" @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
    </div>
    <div>
      <i-table
        stripe
        highlight-row
        size="small"
        height="233"
        ref="table"
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
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
            placement="top"
            :total="page.totalCount"
            :current="page.currentPage"
            :page-size="page.pageSize">
          </i-page>
        </div>
      </i-row>
    </div>
    <div slot="footer">
      <i-button type="primary" class="save" @click="submitBackDisks">确 认</i-button>
      <i-button @click="visible = false">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import { moveState } from '@/assets/js/status/index.js';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件

export default {
  components: {
    'h3c-title': H3cTitle
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 900
    },
    title: {
      type: String,
      default: ''
    },
    hostId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orderMap: {},
      singleDiskId: '', // 单个挂载时的硬盘id
      isSingleMount: false,
      selectedIds: [], // 批量挂载的id
      isBatchDeletion: false, // 是否支持批量删除
      visible: false,
      dataList: [],
      tableItem: [],
      /* 挂载表格标题数组 */
      tableList: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '硬盘名称',
          key: 'name',
          ellipsis: true,
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
          title: '容量（G）',
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
          title: '共享',
          key: 'multiattach',
          render: (h, params) => {
            let multiattach = params.row.multiattach;
            return h('span', {}, multiattach ? '是' : '否');
          }
        },
        {
          title: '运行状态',
          key: 'state',
          width: 90,
          ellipsis: true,
          render: (h, params) => {
            let state = params.row.state,
              node = moveState.filter(item => {
                return item.value === state;
              })[0];
            return h('span', {}, node.label);
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
      privateIp: '',
      selectText: '',
      inputValue: '',
      searchValue: '' // 真实用于查询的数据
    };
  },
  methods: {
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      this.$refs.table.selectAll(false);
      this.selectedIds = [];
      this.getBackDisks();
    },
    setEmpty() {
      this.inputValue = '';
      this.searchValue = '';
      this.$refs.table.selectAll(false);
    },
    chooseChange(selection) {
      this.tableData.forEach((item, index) => {
        if (this.$refs.table.$refs.tbody.objData[index]._isChecked === false) {
          let existIndex = this.selectedIds.findIndex((selectedItem, selectedIndex) => {
            return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id;
          });
          existIndex !== -1 ? this.selectedIds.splice(existIndex, 1) : null;
        } else {
          let existIndex = this.selectedIds.findIndex((selectedItem, selectedIndex) => {
            return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id;
          });
          existIndex == -1 ? this.selectedIds.push(this.tableData[index]) : null;
        }
      });
    },
    setPage(data) {
      this.page.totalCount = data.total;
      this.page.totalPage = data.pages ? data.pages : 1;
      this.page.currentPage = data.current;
      this.page.pageSize = data.size;
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.getBackDisks();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.getBackDisks();
    },
    getBackDisks() {
      this.loading = true;
      this.$nextTick(() => {
        this.$http
          .post('power/server/detail/' + this.hostId + '/volume/page', {
            orderMap: this.orderMap,
            searchMap: Object.assign({ name: this.searchValue }),
            current: this.page.currentPage, // 当前页
            pageSize: this.page.pageSize
          })
          .then(({ data }) => {
            if (data.data) {
              if (data.data.records !== null) {
                this.tableData = data.data.records;
              } else {
                this.tableData = [];
              }
              this.setPage(data.data);
              this.$nextTick(() => {
                // 设置选中
                if (this.selectedIds.length > 0) {
                  this.selectedIds.forEach((choosedItem, choosedIndex) => {
                    this.tableData.forEach((item, index) => {
                      if (item.id == choosedItem.id) {
                        this.$refs.table.$refs.tbody.objData[index]._isChecked = true;
                      }
                    });
                  });
                }
              });
            }
            this.loading = false;
          });
      });
    },
    /**
     * @description:  确认退订power硬盘
     */
    submitBackDisks() {
      this.loading = true;
      let arrD = this.selectedIds.map((item, index) => {
        return item.id;
      });
      this.$http
        .post(`power/server/delete/${this.hostId}`, {
          volumes: arrD
        })
        .then(({ data }) => {
          if (data.status) {
            this.$Notice.success({ desc: '成功加入申请退订清单!' });
            this.closeModal();
            this.$emit('_getData');
          }
          this.loading = false;
        });
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); //清楚右上角提示信息
        this.visible = newVal; //显示对话框
        this.getBackDisks();
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
.iconfont:not(.header-icon):before {
  font-size: 16px;
}

i.icon-tixingtishi:before {
  font-size: 18px !important;
}
</style>
