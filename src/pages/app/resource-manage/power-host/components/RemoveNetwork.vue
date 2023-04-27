<!--
 * @Description: power虚拟机移除网卡
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:23:03
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
    <!--搜索框-->
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix cds-margin-bottom-14">
      <div class="cds-float-left-btn">
        <i-input
          clearable
          class="cds-input-search"
          style="width: 200px;"
          v-model="inputValue"
          @on-enter="handleSearch"
          placeholder="请输入名称进行查询"></i-input>
        <i-button type="primary" class="cds-btn-search" @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
    </div>
    <div id="modal-network-remove">
      <i-table
        class="remove-network-table"
        stripe
        highlight-row
        size="small"
        height="233"
        ref="selection"
        :loading="tableConfig.loading"
        :columns="tableList"
        :data="tableData">
      </i-table>
      <i-row class="cds-margin-top-14 cds-clearfix">
        <div class="cds-float-left">
          共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页
        </div>
        <div class="cds-float-right">
          <i-page
            show-sizer
            size="small"
            :page-size-opts="[5, 10, 20]"
            @on-change="submitRemoveNetwork({currentPage: $event, pageSize: page.pageSize})"
            @on-page-size-change="submitRemoveNetwork({pageSize: $event})"
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
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件

export default {
  name: 'RemoveNetwork',
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
        loading: false // 表格是否加载中
      },
      netIp: '',
      singleNetId: '', // 单个挂载时的硬盘id
      netInfo: [],
      netInfoItem: '',
      isSingleUninstall: false,
      serverIds: [], // 获取选中的硬盘id数组
      isBatchDeletion: false, // 是否支持批量删除
      visible: false,
      /* 挂载表格标题数组 */
      tableList: [
        {
          title: '网络名称',
          key: 'networkName',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.networkName
                }
              },
              params.row.networkName
            );
          }
        },
        {
          title: 'IP地址',
          key: 'ip',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.ip
                }
              },
              params.row.ip
            );
          }
        },
        {
          title: 'IP地址类型',
          key: 'adapterType',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.adapterType
                }
              },
              params.row.adapterType
            );
          }
        },
        {
          title: '卸载',
          key: 'delete',
          width: 60,
          render: (h, params) => {
            return h('span', {
              class: 'iconfont icon-xiezai cell-info-active',
              on: {
                click: () => {
                  this.netInfoItem = params.row.id;
                  this.handleUninstallNet();
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
      inputValue: '',
      searchValue: '' // 真实用于查询的数据
    };
  },
  methods: {
    setEmpty() {
      this.inputValue = '';
      this.searchValue = '';
      this.$refs.selection.selectAll(false);
    },
    showModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
    },
    submitRemoveNetwork({ loading = false, currentPage = 1, pageSize = 5 } = {}) {
      if (loading) {
        this.tableConfig.loading = loading;
        this.tableData = [];
      }
      this.page.pageSize = pageSize;
      this.page.currentPage = currentPage;
      this.$nextTick(() => {
        this.$http
          .post('power/server/detail/' + this.hostId + '/port/page', {
            searchMap: {
              name: this.searchValue
            },
            current: currentPage, // 当前页
            pageSize: pageSize // 每页条数
          })
          .then(({ data }) => {
            if (data.status) {
              let resp = data.data;
              this.tableData = resp.records;
              this.page.totalCount = resp.total;
              this.page.totalPage = resp.pages ? resp.pages : 1;
            }
            loading ? (this.tableConfig.loading = false) : ''; // 如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
          });
      });
    },
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      this.submitRemoveNetwork({
        loading: true,
        pageSize: this.page.pageSize
      });
    },
    handleUninstallNet() {
      this.$loading.show();
      this.netInfo = [this.netInfoItem]; // 判断是否是单个卸载
      this.$http
        .post('power/server/port/delete', {
          portIds: this.netInfo,
          serverId: this.hostId // server用来存储已选中的硬盘id
        })
        .then(({ data }) => {
          if (data.status) {
            this.$Notice.success({
              desc: '网卡卸载成功！'
            });
            this.visible = false;
          }
          this.$loading.hide();
          this.netInfo = [];
        });
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); //清楚右上角提示信息
        this.visible = newVal; //显示对话框
        this.submitRemoveNetwork();
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
/deep/.remove-network-table {
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
  font-size: 16px;
}

i.icon-tixingtishi:before {
  font-size: 18px !important;
}
</style>
