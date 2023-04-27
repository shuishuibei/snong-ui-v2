<!--
 * @Description: 角色管理
 * @Author: ys2234
 * @Date: 2019-07-25 11:47:04
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-13 15:02:13
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14 role-manage">
    <div class="cds-clearfix cds-margin-bottom-14">
      <div class="cds-float-right-btn">
        <i-button
          type="primary"
          :disabled="isDev"
          @click="flag.add = true">
          <i class="iconfont icon-plus">新增</i>
        </i-button>
        <i-button
          type="primary"
          :disabled="isDev"
          @click="handleDeleteMult">
          <i class="iconfont icon-shanchu">批量删除</i>
        </i-button>
        <i-button class="cds-btn-refresh" @click="handleRefresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <i-table
      ref="table"
      stripe
      highlight-row
      :key="tableConfig.key"
      :loading="tableConfig.loading"
      :columns="tableConfig.columns"
      :data="tableConfig.data"
      @on-select="selectConfirm"
      @on-select-cancel="selectCancel"
      @on-select-all="selectAll"
      @on-select-all-cancel="selectAllCancel">
    </i-table>
    <div class="cds-clearfix cds-margin-top-14">
      <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
      <div class="cds-float-right">
        <i-page
          show-sizer
          placement="top"
          :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          :page-size-opts="[10, 20, 30, 50]"
          @on-change="getTableData({ currentPage: $event, pageSize: page.pageSize })"
          @on-page-size-change="getTableData({ pageSize: $event })">
        </i-page>
      </div>
    </div>
    <!-- 新建角色弹出框 -->
    <role-edit
      title="新增角色"
      v-model="flag.add"
      @on-ok="submitAdd">
    </role-edit>
    <!-- 修改角色弹出框 -->
    <role-edit
      title="修改角色"
      :node="roleNode"
      v-model="flag.edit"
      @on-ok="submitUpdate">
    </role-edit>
    <!-- 查看用户弹出框 -->
    <h3c-modal-table
      ref="roleViewUser"
      title="角色对应用户列表"
      type="post"
      :url="`role/user-group-granted/list/${roleNode.id}`"
      :table-item="roleViewUserTableConfig.columns">
    </h3c-modal-table>
    <!-- 单条删除 -->
    <h3c-modal-confirm
      title="删除角色"
      :info="`确认删除角色：${roleNode.name}？`"
      v-model="flag.deleteSingle"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
    <!-- 批量删除 -->
    <h3c-modal-confirm
      title="删除角色"
      :info="`确认删除这${selectedIdsList.length}个角色？`"
      v-model="flag.deleteMult"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
    <!-- 授权弹出框 -->
    <role-resource-grant
      :node="roleNode"
      :is-dev="isDev"
      v-model="flag.grantResource">
    </role-resource-grant>
  </div>
</template>

<script>
import RoleEdit from './components/RoleEdit.vue';
import RoleResourceGrant from './components/RoleResourceGrant.vue';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import H3cModalTable from '@/components/h3c-modal-table/H3cModalTable.vue';

/**
 * @function 角色等级对应关系
 * @property {number} roleLevel      - 角色等级
 * @property {string} roleLevelName  - 角色名称
 */
const roleLevelType = [
  {
    roleLevel: '0',
    roleLevelName: '全部数据'
  },
  {
    roleLevel: '1',
    roleLevelName: '部门数据'
  },
  {
    roleLevel: '2',
    roleLevelName: '个人数据'
  }
];
const status = [
  {
    label: '云智',
    value: 1,
    color: '#55ce5b'
  },
  {
    label: '非云智',
    value: 0,
    color: '#ffa904'
  }
];
export default {
  name: 'RoleManage',
  components: {
    'role-resource-grant': RoleResourceGrant,
    'role-edit': RoleEdit,
    'h3c-modal-confirm': H3cModalConfirm,
    'h3c-modal-table': H3cModalTable
  },
  data() {
    return {
      roleNode: {}, // 当前选中角色
      /* 表格配置信息 */
      tableConfig: {
        key: new Date().toString(), // 表格的属性key
        loading: false, // 表格是否加载中
        /* 表格列的配置描述 */
        columns: [
          {
            type: 'selection',
            width: 40,
            align: 'center'
          },
          {
            title: '角色名称',
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
            title: '角色描述',
            key: 'description',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.description
                  }
                },
                params.row.description
              );
            }
          },
          {
            title: '数据权限',
            key: 'owner',
            ellipsis: true,
            render: (h, params) => {
              let node = roleLevelType.filter(item => {
                return item.roleLevel === params.row.owner;
              })[0];
              return h(
                'span',
                {
                  attrs: {
                    title: node.roleLevelName
                  }
                },
                node.roleLevelName
              );
            }
          },
          {
            title: '查看用户',
            align: 'center',
            width: 90,
            render: (h, params) => {
              return h('i', {
                class: 'iconfont icon-tuisongxiaoxi',
                on: {
                  click: () => {
                    this.roleNode = params.row;
                    this.$refs['roleViewUser'].showModal();
                  }
                }
              });
            }
          },
          {
            title: '授权',
            align: 'center',
            width: 64,
            render: (h, params) => {
              let obj = this.accessOps(params.row.name, this.isDev);
              return h('i', {
                class: {
                  'iconfont': true,
                  'icon-shouquan': true,
                  'cds-grey-icon': !obj.active
                },
                on: {
                  click: () => {
                    if(obj.active) {
                      this.roleNode = params.row;
                      this.flag.grantResource = true;
                    }
                  }
                }
              });
            }
          },
          {
            title: '修改',
            align: 'center',
            width: 64,
            render: (h, params) => {
              let obj = this.accessOps(params.row.name);
              return h('i', {
                class: {
                  'iconfont': true,
                  'icon-weibiaoti2010104': true,
                  'cds-grey-icon': !obj.active
                },
                on: {
                  click: () => {
                    if(obj.active) {
                      this.roleNode = params.row;
                      this.flag.edit = true;
                    }
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
              let obj = this.accessOps(params.row.name);
              return h('i', {
                  class: {
                    'iconfont': true,
                    'icon-shanchu': true,
                    'cds-grey-icon': !obj.active
                  },
                  on: {
                    click: () => {
                      if(obj.active) {
                        this.roleNode = params.row;
                        this.flag.deleteSingle = true;
                      }
                    }
                  }
              });
            }
          }
        ],
        data: [] // 表格中的数据
      },
      page: {
        pageSize: 20,
        totalCount: 0,
        totalPage: 1,
        currentPage: 1
      },
      /**
       * @property {boolean} grantResource  - 授权
       * @property {boolean} add            - 新建
       * @property {boolean} edit           - 修改
       * @property {boolean} delete         - 删除
       */
      flag: {
        grantResource: false,
        add: false,
        edit: false,
        deleteSingle: false,
        deleteMult: false
      },
      selectedIdsList: [], // 选中项
      roleViewUserTableConfig: {
        columns: [
          {
            title: '姓名',
            key: 'userName',
            ellipsis: true,
            render: (h, params) => {
              let userName = params.row.userName;
              return h(
                'span',
                {
                  attrs: {
                    title: userName
                  }
                },
                userName
              );
            }
          },
          {
            title: '登录名',
            key: 'loginName',
            ellipsis: true,
            render: (h, params) => {
              let loginName = params.row.loginName;
              return h(
                'span',
                {
                  attrs: {
                    title: loginName
                  }
                },
                loginName
              );
            }
          },
          {
            title: '用户类型',
            key: 'active',
            width:84,
            filters: status,   //必须同时配置filterRemote
            filterMultiple: false,   //筛选默认是多选的，需要手动关闭
            /**
             * 远程筛选方法
             * @params value {array} 为当前选中项（filters的value值组成的数组），选中全部时为value为空
             * @params key {string} 为当前当前列的key值
             * @params column {object} 为当前列的配置
             */
            filterRemote(value, key, column) {
              this.filterMap[key] = value[0];
              this.getTableData({loading: true, pageSize: this.page.pageSize});
            },
            render: (h, params) => {
              let active = params.row.active ? 1 : 0,
                node = status.filter((item) => {
                  return item.value == active
                })[0];
              return h('div',
                {
                  attrs: {
                    title: node.label
                  }
                },
                [
                  h('span', {
                    class: 'status-dot',
                    style: {
                      backgroundColor: node.color
                    }
                  }),
                  h('span', {
                    style: {
                      verticalAlign: 'middle',
                      color: node.color
                    }
                  }, node.label)
                ])
            }
          },
          {
            title: '备注',
            key: 'description',
            ellipsis: true,
            render: (h, params) => {
              let description = params.row.description;
              return h(
                'span',
                {
                  attrs: {
                    title: description
                  }
                },
                description
              );
            }
          }
          // {
          //   title: '状态',
          //   key: 'active',
          //   align: 'left',
          //   render: (h, params) => {
          //     let node = basicStatus.filter(item => params.row.active === item.value)[0];
          //     return h('span',
          //       {
          //         style: {
          //           color: node.color
          //         }
          //       },
          //       [
          //         h('div', {
          //           class: 'cds-status-dot',
          //           style: {
          //             background: node.color
          //           }
          //         }),
          //         h('span',{
          //           style: {
          //             'vertical-align': 'middle'
          //           }
          //         }, node.label)
          //       ]
          //     );
          //   }
          // }
        ]
      }
    };
  },
  computed: {
    /**
     * @function 判断登录用户是否是KF01
     * @returns {boolean} - true：是KF01，false：不是KF01
     */
    isDev() {
      return this.$store.state.login.userName === 'KF01';
    }
  },
  methods: {
    /**
     * @function 添加选中项
     * @description 在多选模式下有效，选中某一项时触发
     * @param {Array}  selection - 当前页面已选数据
     * @param {Object} row       - 刚选择的项数据
     */
    selectConfirm(selection, row) {
      this.selectedIdsList.push(row.id);
    },
    /**
     * @function 移除取消选中项
     * @description 在多选模式下有效，取消选中某一项时触发
     * @param {Array}  selection - 当前页面已选数据
     * @param {Object} row       - 取消选择的项数据
     */
    selectCancel(selection, row) {
      for(let [index, item] of this.selectedIdsList.entries()) {
        if(item === row.id) {
          this.selectedIdsList.splice(index, 1);
          break;
        }
      }
    },
    /**
     * @function 添加选中项
     * @description: 在多选模式下有效，点击全选时触发
     * @param {Array} selection - 当前页面已选项数据
     */
    selectAll(selection) {
      selection.forEach(item => {
        if(this.selectedIdsList.length > 0) {
          for(let [subIndex, subItem] of this.selectedIdsList.entries()) {
            if(item.id === subItem) {
              break;
            }
            if(subIndex === this.selectedIdsList.length - 1) {
              this.selectedIdsList.push(item.id);
            }
          }
        } else {
          this.selectedIdsList.push(item.id);
        }
      })
    },
    /**
     * @function 移除取消选中项
     * @description: 在多选模式下有效，点击取消全选时触发
     * @param {Array} selection - 当前页面已选项数据
     */
    selectAllCancel(selection) {
      /* 由于该方法参数未返回取消选中项，所以用当前页面数据替代 */
      this.tableConfig.data.forEach(item => {
        for(let [subIndex, subItem] of this.selectedIdsList.entries()) {
          if(item.id === subItem) {
            this.selectedIdsList.splice(subIndex, 1);
            break;
          }
        }
      })
    },
    /**
     * @function 点击批量删除按钮触发
     */
    handleDeleteMult() {
      if(this.selectedIdsList.length > 0) {
        this.roleNode = {};
        this.flag.deleteMult = true;
      } else {
        this.$Notice.warning({
          desc: '请选择要删除的角色'
        })
      }
    },
    /**
     * @function 刷新
     */
    handleRefresh() {
      this.tableConfig.data = [];
      this.tableConfig.key = new Date().toString();
      this.getTableData({ clearable: true, pageSize: this.page.pageSize });
    },
    /**
     * @function 提交新建角色请求
     */
    submitAdd(data) {
      this.$loading.show();
      this.$http.post('role/add', data).then(({ data }) => {
        if (data.status) {
          this.flag.add = false;
          this.$Notice.success({
            desc: '新增角色成功'
          });
          this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        } else {
          this.$Notice.error({
            desc:
              data.message && data.message !== '' ? data.message : '修改角色信息失败'
          });
        }
        this.$loading.hide();
      });
    },
    /**
     * @function 提交修改角色请求
     */
    submitUpdate(data) {
      this.$loading.show();
      this.$http.put('role/update', data).then(({ data }) => {
        if (data.status) {
          this.flag.edit = false;
          this.$Notice.success({
            desc: '修改角色成功'
          });
          this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        }
        else {
          this.$Notice.error({
            desc:
              data.message && data.message !== '' ? data.message : '修改角色信息失败'
          });
        }
        this.$loading.hide();
      });
    },
    /**
     * @function 删除多个角色
     */
    submitDelete() {
      this.$loading.show();
      this.$http({
        method: 'POST',
        url: 'role/delete/batch',
        data: this.roleNode.id ? [this.roleNode.id] : this.selectedIdsList
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: '删除角色成功'
          });
          this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        }
      });
    },
    /**
     * @function 发送请求获取角色列表数据
     * @description 如果角色名称为 roleLevelType 中的角色，则禁止选择。
     * @param {boolean} clearable   - 是否清空表格数据和选中项
     * @param {number}  currentPage - 分页当前页，默认值为第一页
     * @param {number}  pageSize    - 分页每页条数，默认值为每页10条
     */
    getTableData({ clearable = false, currentPage = 1, pageSize = 20 } = {}) {
      this.tableConfig.loading = true;
      if (clearable) {
        this.tableConfig.data = [];
        this.selectedIdsList = [];
      }
      this.page.pageSize = pageSize;
      this.page.currentPage = currentPage;
      this.$http.post('role/list/page', {
        current: currentPage,
        pageSize: pageSize,
        searchMap: {}
      }).then(({ data }) => {
        if (data.status) {
          /* 如果没有loading，则获取数据成功后需要将选中项设置为空数组 */
          let resp = data.data;
          resp.records.map(item => {
            roleLevelType.map(node => {
              if (item.name === node.roleLevelName) {
                item._disabled = true;
              }
            });
          });
          resp.records.forEach(item => {
            for(let subItem of this.selectedIdsList) {
              if(item.id === subItem) {
                item._checked = true;
                break;
              }
            }
          })
          this.tableConfig.data = resp.records;
          this.page.totalCount = resp.total;
          this.page.totalPage = resp.pages ? resp.pages : 1;
        }
        this.tableConfig.loading = false;
      });
    },
    /**
     * @function 根据角色在等级对应关系roleLevelType中是否存在，以及登录用户是否是开发用户，判断当前角色是否可以授权、修改、删除。
     * @param {string} roleName - 表格中当前行对应的角色名称
     * @param {boolean} isDev - 当前登录用户是否是开发用户
     */
    accessOps(roleName, isDev) {
      let matchRoleArr = roleLevelType.filter( item => item.roleLevelName === roleName );
      let existMatchRole = !!matchRoleArr.length;
      let obj = {
        active: false
      }
      if(isDev || !existMatchRole) {
        obj = {
          active: true
        };
      }
      return obj;
    }
  },
  created() {
    this.getTableData(); // 页面加载时获取角色列表
  }
};
</script>
