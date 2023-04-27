<!--
 * @Description: 角色授权
 * @Author: ys2234
 * @Date: 2019-09-05 11:04:17
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-05 09:21:59
 -->
<template>
  <i-modal
    width="550px"
    class-name="user-authorize"
    :scrollable="true"
    :title="title"
    :mask-closable="false"
    v-model="visible"
    @on-cancel="cancel">
    <div class="role-table">
      <h3c-radio-table
        :page="page"
        :page-size="'small'"
        :height="280"
        :columns="tableConfig.columns"
        :data="tableConfig.data"
        :config="tableConfig.loading"
        :get-table-data="getTableData"
        :select="{className: 'role-table', name: 'role'}"
        :on-radio="radioChange"
        :page-size-opts="[5, 10, 20]"
        :checkeded="authorizedRoleId">
      </h3c-radio-table>
    </div>
    <div slot="footer">
      <i-button type="primary" @click.native="ok">确 认</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>
<script>
import H3cRadioTable from '@/components/h3c-radio-table/H3cRadioTable.vue';
export default {
  name: 'UserAuthorize',
  components: {
    'h3c-radio-table': H3cRadioTable
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '角色授权'
    },
    userInfo: {
      type: Object
    }
  },
  data() {
    return {
      visible: false, // 控制弹出框是否显示
      authorizedRoleId: '',
      tableConfig: {
        loading: false,
        columns: [
          {
            title: '角色名',
            key: 'name'
          },
          {
            title: '角色描述',
            key: 'description'
          },
          {
            title: '角色等级',
            key: 'roleLevel',
            render: (h, params) => {
              let roleLevelName = '';
              switch (params.row.roleLevel) {
                case 0:
                  roleLevelName = '云管理员';
                  break;
                case 1:
                  roleLevelName = '组织管理员';
                  break;
                case 2:
                  roleLevelName = '普通用户';
                  break;
              }
              return h('div', roleLevelName);
            }
          }
        ],
        data: []
      },
      /**
       * @property {number} totalCount  - 总条数
       * @property {number} currentPage - 当前页码
       * @property {number} pageSize    - 每页条数
       * @property {number} totalPage   - 总页数
       */
      page: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 5,
        totalPage: 1
      }
    };
  },
  methods: {
    /**
     * @function 发送请求获取表格数据，并且做相应处理
     * @param {boolean} loading     - 表格缓冲，默认值为false
     * @param {number}  currentPage - 分页当前页，默认值为第一页
     * @param {number}  pageSize    - 分页每页条数，默认值为每页10条
     */
    getTableData({ loading = false, currentPage = 1, pageSize = 5 } = {}) {
      if (loading) {
        this.tableConfig.loading = loading;
        this.tableConfig.data = [];
      }
      this.page.pageSize = pageSize;
      this.page.currentPage = currentPage;
      this.$http
        .post(`assignment/role/list/${this.userInfo.id}`, {
          current: this.page.currentPage,
          pageSize: this.page.pageSize
        })
        .then(({ data }) => {
          if (data.status) {
            let resp = data.data;
            this.tableConfig.data = resp.records;
            this.page.totalCount = resp.total;
            this.page.totalPage = resp.pages ? resp.pages : 1;
          }
          loading ? (this.tableConfig.loading = false) : '';
        });
    },
    /**
     * @function: 获取已授权角色列表
     */
    getAuthorizedRoleList() {
      this.$http({
        method: 'GET',
        url: `assignment/role/assigned/${this.userInfo.id}`
      }).then(({ data }) => {
        if (data.status) {
          /**
           * data.data:5dcd7b3a-ec8a-4d80-be8b-8f4d65d71f3a,false;
           * false:表示分授权，暂不使用。
           */
          this.authorizedRoleId = data.data.split(',')[0];
        }
      });
    },
    /**
     * @function 获取已选角色的ID
     * @description: radio改变时触发
     * @param {Object} row - 当前行数据
     */
    radioChange({ row }) {
      this.authorizedRoleId = row.id;
    },
    ok() {
      this.$loading.show();
      this.$http({
        method: 'PUT',
        url: `/assignment/object/role/assign/${this.userInfo.id}&${this.authorizedRoleId}`
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: '授权用户成功'
          });
          this.$emit('on-ok');
          this.visible = false;
        }
      });
    },
    cancel() {
      this.visible = false;
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.authorizedRoleId = '';
        this.getTableData({ loading: true });
        this.getAuthorizedRoleList();
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); // 清楚右上角提示信息
        this.visible = newVal; // 显示对话框
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
