<!--
 * @Description: 资源池管理
 * @Author: ys2234
 * @Date: 2019-07-31 15:01:47
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 15:59:35
 -->
<template>
  <div class="resource-pool-manage cds-wrapper cds-border cds-padding-14">
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix header-wrapper cds-margin-bottom-14">
      <!-- 按钮操作 -->
      <div class="cds-float-right-btn">
        <i-button type="primary" @click="handleAdd">
          <i class="iconfont icon-plus">新 增</i>
        </i-button>
        <i-button class="cds-btn-refresh" @click="handleRefresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <i-table
      stripe
      highlight-row
      :key="tableConfig.key"
      :loading="tableConfig.loading"
      :columns="tableConfig.columns"
      :data="tableConfig.data">
    </i-table>
    <div class="cds-margin-top-14 cds-clearfix">
      <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
      <div class="cds-float-right">
        <i-page
          show-sizer
          placement="top"
          :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
          @on-page-size-change="getTableData({pageSize: $event})">
        </i-page>
      </div>
    </div>
    <h3c-modal-confirm
      title="删除资源池"
      :info="deleteInfo"
      v-model="flag.delete"
      @on-ok="submitDelete(node.id)">
    </h3c-modal-confirm>
  </div>
</template>

<script>
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
export default {
  name: 'ResourcePoolManage',
  components: {
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    return {
      flag: {
        delete: false,
        info: false
      },
      tableConfig: {
        key: new Date().toString(), // 表格的属性key
        loading: false, // 表格是否加载中
        columns: [ // 表格列的配置描述
          {
            title: '资源池名称',
            key: 'name',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h('div', {
                class: 'cell-info-active',
                attrs: {
                  title: row.name
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'resource-pool-manage/detail',
                      query: {
                        id: row.id
                      }
                    });
                  }
                }
              }, row.name);
            }
          },
          {
            title: '备注',
            key: 'otherInfo',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h('span', {
                attrs: {
                  title: row.description
                }
              }, row.description);
            }
          },
          {
            title: '创建时间',
            key: 'createDate',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h('span', {
                attrs: {
                  title: row.createDate
                }
              }, row.createDate);
            }
          },
          {
            title: '修改时间',
            key: 'modifiedDate',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h('span', {
                attrs: {
                  title: row.modifiedDate
                }
              }, row.modifiedDate);
            }
          },
          {
            title: '修改',
            align: 'center',
            width: 64,
            render: (h, params) => {
              return h('i', {
                class: 'iconfont icon-weibiaoti2010104',
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'resource-pool-manage/edit',
                      query: {
                        id: params.row.id
                      }
                    })
                  }
                }
              });
            }
          },
          {
            title: '删除',
            width: 64,
            align: 'center',
            render: (h, params) => {
              let row = params.row;
              return h('i', {
                class: 'iconfont icon-shanchu',
                on: {
                  click: () => {
                    this.deleteInfo = `确认删除资源池：${row.name}吗？`;
                    this.flag.delete = true;
                    this.node = row;
                  }
                }
              });
            }
          }
        ],
        data: []  // 表格中的数据
      },
      page: {
        pageSize: 20,
        totalCount: 0,
        totalPage: 1,
        currentPage: 1
      },
      node: {}, // 当前资源池数据
      deleteInfo: ''
    }
  },
  methods: {
    /**
     * @function 添加资源池数据
     */
    handleAdd() {
      this.$router.push({
        name: 'resource-pool-manage/edit'
      })
    },
    /**
     * @function 重置搜索、排序、筛选并刷新表格数据
     * @description 点击刷新按钮触发
     */
    handleRefresh() {
      this.tableConfig.key = new Date().toString();
      this.tableConfig.data = [];
      this.getTableData({ pageSize: this.page.pageSize });
    },
    /**
     * @function 提交删除资源池请求
     * @param {string} id - 资源池ID
     */
    submitDelete(id) {
      this.$loading.show();
      this.$http.delete(`/quota/pool/delete/${id}`).then(({data}) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: '删除资源池成功'
          });
          this.getTableData({ pageSize: this.page.pageSize });
        }
      })
    },
    /**
     * @function 获取资源池详情，当获取资源池信息后，跳转到详情页面。
     * @param {string} id - 资源池ID
     */
    getPool(id) {
      this.$loading.show();
      this.$http.get(`pool/${id}`).then(({ data }) => {
        if (data.status) {
          this.node = data;
          // this.$emit('on-component-show', { componentName: 'shouldDetailShow', data: this.node });
        }
        this.$loading.hide();
      }).catch(() => {
        this.$loading.hide();
      });
    },
    /**
     * @function 发送请求获取角色列表数据
     * @param {number} currentPage  - 分页当前页，默认值为第一页
     * @param {number} pageSize     - 分页每页条数，默认值为每页10条
     */
    getTableData({currentPage = 1, pageSize = 20} = {}) {
      this.tableConfig.loading = true; // 设置表格缓冲
      this.page.pageSize = pageSize; // 设置分页每页条数
      this.page.currentPage = currentPage; // 设置分页当前页
      this.$http.post('pool/list', {
        current: currentPage,
        orderMap: {},
        pageSize: pageSize,
        searchMap: {}
      }).then(({data}) => {
        if (data.status) {
          let resp = data.data;
          if (resp) {
            this.tableConfig.data = resp.records;
            this.page.totalCount = resp.total; // 设置分页总条数
            this.page.totalPage = resp.pages ? resp.pages : 1; // 设置分页总页数，当总页数为0时显示为1
          }
        }
        this.tableConfig.loading = false; // 关闭表格缓冲
      })
    }
  },
  created() {
      this.getTableData();
  },
  beforeRouteLeave (to, from, next) {
    from.meta.keepAlive = false;
    next();
  }
}
</script>
