<!--
 * @Description: 连接配置
 * @Author: ys2234
 * @Date: 2019-07-25 11:47:04
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-05 13:31:34
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <div class="cds-margin-bottom-14 cds-clearfix">
      <!-- 按钮操作 -->
      <div class="cds-float-right-btn">
        <i-button type="primary" @click="flag.add = true">
          <i class="iconfont icon-plus operate-icon">新增</i>
        </i-button>
        <i-button class="cds-btn-refresh" @click="handleRefresh">
          <i class="iconfont icon-shuaxin1 operate-icon"></i>
        </i-button>
      </div>
    </div>
    <i-table
      stripe
      ref="table"
      highlight-row
      :key="tableConfig.key"
      :loading="tableConfig.loading"
      :columns="tableConfig.columns"
      :data="tableConfig.data">
    </i-table>
    <connection-config-edit
      title="新增连接配置"
      v-model="flag.add"
      @on-refresh="handleRefresh">
    </connection-config-edit>
    <connection-config-edit
      title="修改连接配置"
      :data="currentRow"
      v-model="flag.modify"
      @on-refresh="handleRefresh">
    </connection-config-edit>
    <h3c-modal-confirm
      title="删除连接配置"
      :info="'是否删除平台信息：' + currentRow.platformName + '？'"
      v-model="flag.delete"
      @on-ok="submitDelete(currentRow.id)">
    </h3c-modal-confirm>
  </div>
</template>

<script>
import ConnectionConfigEdit from './components/ConnectionConfigEdit.vue';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';

export default {
  name: 'ConnectionConfig',
  components: {
    'connection-config-edit': ConnectionConfigEdit,
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    return {
      tableConfig: {
        key: new Date().toString(), // 表格的属性key
        loading: false, // 表格是否加载中
        columns: [
          {
            title: '平台名称',
            key: 'platformName',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.platformName
                  }
                },
                row.platformName
              );
            }
          },
          {
            title: '登录名',
            key: 'loginName',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.loginName
                  }
                },
                row.loginName
              );
            }
          },
          {
            title: '登录密码',
            key: 'passWord',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.passWord
                  }
                },
                row.passWord
              );
            }
          },
          {
            title: 'ip地址',
            key: 'ip',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.ip
                  }
                },
                row.ip
              );
            }
          },
          {
            title: '端口',
            key: 'port',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.port
                  }
                },
                row.port
              );
            }
          },
          {
            title: '平台类型',
            key: 'platformType',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.platformType
                  }
                },
                row.platformType
              );
            }
          },
          {
            title: '认证方式',
            key: 'authType',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.authType
                  }
                },
                row.authType
              );
            }
          },
          {
            title: '描述',
            key: 'remark',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.remark
                  }
                },
                row.remark
              );
            }
          },
          {
            title: '修改',
            align: 'center',
            width: 64,
            render: (h, params) => {
              return h('i', {
                style: {
                  color: '#27b9f9'
                },
                class: 'iconfont icon-weibiaoti2010104 icon-active',
                on: {
                  click: () => {
                    this.currentRow = params.row;
                    this.flag.modify = true;
                  }
                }
              });
            }
          },
          {
            title: '删除',
            align: 'center',
            width: 64,
            render: (h, params) => {
              return h('i', {
                style: {
                  color: '#27b9f9'
                },
                class: 'iconfont icon-shanchu icon-active',
                on: {
                  click: () => {
                    this.currentRow = params.row;
                    this.flag.delete = true;
                  }
                }
              });
            }
          }
        ],
        data: []
      },
      flag: {
        add: false,
        modify: false,
        delete: false
      },
      currentRow: {}
    };
  },
  methods: {
    /**
     * @function 刷新表格
     */
    handleRefresh() {
      this.getTableData();
    },
    /**
     * @function 获取表格数据
     */
    getTableData() {
      this.tableConfig.loading = true;
      this.tableConfig.data = [];
      this.$http({
        method: 'GET',
        url: 'sysConfig/list'
      })
        .then(({ data }) => {
          if (data.status) {
            this.tableConfig.data = data.data;
          }
          this.tableConfig.loading = false;
        })
        .catch(() => {
          this.tableConfig.loading = false;
        });
    },
    submitDelete(id) {
      this.$loading.show();
      this.$http({
        method: 'DELETE',
        url: `sysConfig/delete/${id}`
      })
        .then(({ data }) => {
          this.$loading.hide();
          if (data.status) {
            this.$Notice.success({
              desc: '删除成功'
            });
            this.handleRefresh();
          }
        })
        .catch(() => {
          this.$loading.hide();
        });
    }
  },
  created() {
    this.getTableData();
  }
};
</script>
