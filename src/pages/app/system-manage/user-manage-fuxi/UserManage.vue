<!--
 * @Description: 用户管理
 * @Author: ys2234
 * @Date: 2019-07-25 11:47:04
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-14 16:46:27
 -->
<template>
  <div class="cds-wrapper user-manage">
    <div class="user-manage-left cds-border cds-padding-14">
      <h3c-tree
        ref="groupTree"
        :data="groupTreeArr"
        :empty-text="groupEmptyText"
        @on-select-change="groupChange">
      </h3c-tree>
    </div>
    <div class="user-manage-right">
      <div class="user-manage-right-title cds-border">
        <h3c-title
          :is-border-bottom="false"
          :title="'组织名称：' + currentSelectedGroup.name">
        </h3c-title>
      </div>
      <div class="user-manage-right-content cds-border cds-padding-14">
        <div class="cds-clearfix cds-margin-bottom-14">
          <div class="cds-float-left-btn">
            <i-checkbox
              v-model="belowFlag"
              :disabled="!currentSelectedGroup.children"
              @on-change="containSubGroupChange">
              包含子组织
            </i-checkbox>
            <i-input
              class="cds-input-search"
              clearable
              v-model="inputValue"
              placeholder="请输入登录名进行查询"
              @on-keyup.enter="handleSearch">
            </i-input>
            <i-button type="primary" class="cds-btn-search" @click="handleSearch">
              <i class="iconfont icon-iconfontsousuo"></i>
            </i-button>
          </div>
          <div class="cds-float-right-btn">
            <i-button type="primary" @click="handleCreate">
              <i class="iconfont icon-plus">新增</i>
            </i-button>
            <i-button type="primary" @click="handleMultiDelete">
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
          size="small"
          :key="tableConfig.key"
          :loading="tableConfig.loading"
          :columns="tableConfig.columns"
          :data="tableConfig.data"
          @on-select="selectConfirm"
          @on-select-cancel="selectCancel"
          @on-select-all="selectAll"
          @on-select-all-cancel="selectAllCancel">
        </i-table>
        <div class="cds-margin-top-14 cds-clearfix page-wrapper">
          <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
          <div class="cds-float-right">
            <i-page
              show-sizer
              size="small"
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
      </div>
    </div>
    <i-spin
      fix
      size="large"
      v-if="isSpinUserManageShow">
    </i-spin>
    <user-edit
      title="新增用户"
      :default-path="defaultPath"
      :group-list="groupTreeArrChild"
      v-model="flag.add"
      @on-ok="handleRefresh">
    </user-edit>
    <user-edit
      title="修改用户"
      :default-path="defaultPath"
      :group-list="groupTreeArrChild"
      :user-info="userInfo"
      v-model="flag.edit"
      @on-ok="resetTable">
    </user-edit>
    <user-authorize
      title="角色授权"
      :user-info="userInfo"
      v-model="flag.authorize"
      @on-ok="resetTable">
    </user-authorize>
    <h3c-modal-detail
      title="用户详情"
      label-width="140"
      :data="currentRow"
      :rows="detailRows"
      v-model="flag.info">
    </h3c-modal-detail>
    <h3c-modal-confirm
      title="删除用户"
      :info="`确认删除这${selectedIdsList.length}个用户？`"
      v-model="flag.multiDelete"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
    <h3c-modal-confirm
      title="删除用户"
      :info="`确认删除用户：${userInfo.userName}？`"
      v-model="flag.singleDelete"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
    <h3c-modal-confirm
      title="解锁用户"
      :info="`确认解锁用户：${userInfo.userName}？`"
      v-model="flag.unclock"
      @on-ok="handleUnclock">
    </h3c-modal-confirm>
  </div>
</template>

<script>
import FTree from '@/components/h3c-tree/index';
import UserEdit from './components/UserEdit.vue';
import UserAuthorize from './components/UserAuthorize.vue';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';
import H3cModalDetail from '@/components/h3c-modal-detail/H3cModalDetail.vue';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import { buildTree } from '@/assets/js/utils';
import { treePathFormat } from '@/assets/js/format';
import { basicStatus } from '@/assets/js/status/other.js';

export default {
  components: {
    'h3c-tree': FTree,
    'user-edit': UserEdit,
    'user-authorize': UserAuthorize,
    'h3c-title': H3cTitle,
    'h3c-modal-detail': H3cModalDetail,
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    return {
      rootId: '', // 组织树根组织Id
      currentSelectedGroup: {}, // 当前已选组织
      groupTreeArrChild: [], // 当前用户所在组织以及以下组织的树形结构数组
      groupTreeArr: [], // 组织列表
      groupEmptyText: '', // 组织树为空时的显示内容
      inputValue: '',
      searchValue: '',
      belowFlag: false, // 切换是否包含子组织
      defaultPath: [], // 当前组织默认路径
      userInfo: {}, // 当前用户信息
      orderMap: {}, // 表格排序参数
      page: {
        pageSize: 20,
        totalCount: 0,
        totalPage: 1,
        currentPage: 1
      },
      tableConfig: {
        key: new Date().toString(),
        loading: false,
        columns: [
          {
            type: 'selection',
            width: 40,
            align: 'center'
          },
          {
            title: '登录名',
            key: 'loginName',
            render: (h, params) => {
              return h(
                'div',
                {
                  class: 'cell-info-active',
                  attrs: {
                    title: params.row.loginName
                  },
                  on: {
                    click: () => {
                      this._getUserInfo(params.row.id).then(res => {
                        if (res.status) {
                          this.currentRow = params.row;
                          this.flag.info = true;
                        }
                      });
                    }
                  }
                },
                params.row.loginName
              );
            }
          },
          {
            title: '用户名',
            key: 'userName',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.userName
                  }
                },
                row.userName
              );
            }
          },
          {
            title: '组织机构',
            key: 'groupName',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.groupName
                  }
                },
                row.groupName
              );
            }
          },
          {
            title: '角色名',
            key: 'roleName',
            ellipsis: true,
            render: (h, params) => {
              let row = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: row.roleName
                  }
                },
                row.roleName
              );
            }
          },
          {
            title: '状态',
            key: 'active',
            align: 'left',
            width: 81,
            render: (h, params) => {
              let node = basicStatus.filter(item => params.row.active === item.value)[0];
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
                  h(
                    'span',
                    {
                      style: {
                        'vertical-align': 'middle'
                      }
                    },
                    node.label
                  )
                ]
              );
            }
          },
          {
            title: '解锁',
            key: 'action',
            width: 64,
            align: 'center',
            render: (h, params) => {
              return h('i', {
                class: {
                  iconfont: true,
                  'icon-jiesuo': true,
                  'cds-grey-icon': !params.row.locked
                },
                on: {
                  click: () => {
                    if (params.row.locked) {
                      this.userInfo = params.row;
                      this.flag.unclock = true;
                    }
                  }
                }
              });
            }
          },
          {
            title: '修改',
            key: 'action',
            width: 64,
            align: 'center',
            render: (h, params) => {
              let isActive = this._accessTableOps(params.row.loginName);
              return h('i', {
                class: {
                  iconfont: true,
                  'icon-weibiaoti2010104': true,
                  'cds-grey-icon': !isActive
                },
                on: {
                  click: () => {
                    if (isActive) {
                      this._getUserInfo(params.row.id).then(res => {
                        if (res.status) {
                          this.userInfo = res.data;
                          /* 不能根据当前的组织判断用户所在的组织，因为包含子组织时会显示子组织的用户 */
                          this.defaultPath = treePathFormat(
                            this.groupTreeArrChild,
                            this.userInfo.groupId
                          ).path;
                          this.flag.edit = true;
                        }
                      });
                    }
                  }
                }
              });
            }
          },
          {
            title: '授权',
            align: 'center',
            width: 60,
            render: (h, params) => {
              let isActive = this._accessTableOps(params.row.loginName);
              return h('i', {
                class: {
                  iconfont: true,
                  'icon-shouquan': true,
                  'cds-grey-icon': !isActive
                },
                on: {
                  click: () => {
                    if (isActive) {
                      this._getUserInfo(params.row.id).then(res => {
                        if (res.status) {
                          this.userInfo = res.data;
                          this.flag.authorize = true;
                        }
                      });
                    }
                  }
                }
              });
            }
          },
          {
            title: '删除',
            key: 'action',
            width: 64,
            align: 'center',
            render: (h, params) => {
              let isActive = this._accessTableOps(params.row.loginName);
              return h('i', {
                class: {
                  iconfont: true,
                  'icon-shanchu': true,
                  'cds-grey-icon': !isActive
                },
                on: {
                  click: () => {
                    if (isActive) {
                      this.userInfo = params.row;
                      this.flag.singleDelete = true;
                    }
                  }
                }
              });
            }
          }
        ],
        data: []
      },
      isSpinUserManageShow: false,
      currentRow: {}, // 当前行数据
      detailRows: [
        {
          title: '登录名',
          key: 'loginName'
        },
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '组织机构',
          key: 'groupName'
        },
        {
          title: '角色名',
          key: 'roleName'
        },
        {
          title: '状态',
          render: (h, params) => {
            let node = {
              color: ''
            };
            if (params.row.active) {
              node = basicStatus.filter(item => params.row.active === item.value)[0];
            }
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
                h(
                  'span',
                  {
                    style: {
                      'vertical-align': 'middle'
                    }
                  },
                  node.label
                )
              ]
            );
          }
        },
        {
          title: '证件号码',
          key: 'certification'
        },
        {
          title: '电子邮箱',
          key: 'email'
        },
        {
          title: '手机号码',
          key: 'telephone'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '修改时间',
          key: 'modifiedDate'
        },
        {
          title: '备注',
          key: 'description'
        }
      ],
      flag: {
        add: false,
        edit: false,
        info: false,
        authorize: false,
        unclock: false,
        singleDelete: false,
        multiDelete: false
      },
      selectedIdsList: [] // 多选选中项
    };
  },
  methods: {
    /**
     * @function 获取组织列表信息，且将组织树选中高亮当前用户所在组织，展开至其子组织
     */
    getGroupList() {
      this.isSpinUserManageShow = true;
      this.$http({
        method: 'GET',
        url: '/user/group/list'
      }).then(({ data }) => {
        this.isSpinUserManageShow = false;
        if (data.status && (data.data && data.data.length > 0)) {
          this.groupTreeArr = buildTree(data.data, 'createDate', item => {
            return {
              id: item.id,
              name: item.name,
              parentId: item.parentId,
              parentName: item.parentName,
              title: item.name, // 显示的组织名称
              value: item.id, // 级联选择时的唯一标识，因为id是唯一的，所以取id的值
              label: item.name, // 级联选择时显示的资源名称
              show: item.show // 通过该字段判断登录用户所在的组织，用户所在组织及其子组织的show字段为true，父组织及其以上组织show字段为false
            };
          });
          this.rootId = this.groupTreeArr[0].id;
          this._setTreeStatus(this.groupTreeArr);
          this.getTableData({ clearable: true });
        }
      });
    },
    /**
     * @function 设置组织树的展开状态和选中状态，并获取当前选中组织
     * @description 用户所在组织及其子组织的show字段为true，父组织及其以上组织show字段为false
     * @param {Array} arr - 组织列表（树形结构的数组）
     * @private
     */
    _setTreeStatus(arr) {
      if (arr[0].show) {
        this.$set(arr[0], 'selected', true);
        this.$set(arr[0], 'expand', true);
        this.currentSelectedGroup = arr[0];
        /**
         * 登录用户不为admin且在根组织下，则登录用户为普通云管理员，不具备操作根组织下用户的权限，只能在根组织的子组织下操作用户，故将groupTreeArrChild设置为根组织的子组织
         */
        if (this.loginedUserName !== 'admin' && arr[0].id == this.rootId) {
          this.groupTreeArrChild = arr[0].children;
        } else {
          this.groupTreeArrChild = arr; // 设置当前用户所在组织以及以下组织的树形结构数组
        }
      } else {
        this.$set(arr[0], 'expand', true);
        this.$set(arr[0], 'disabled', true);
        this._setTreeStatus(arr[0].children);
      }
    },
    /**
     * @function 清空搜索
     * @private
     */
    _setInputEmpty() {
      this.inputValue = '';
      this.searchValue = '';
    },
    /**
     * @function 判断表格中用户是否是登录用户
     * @private
     */
    _accessTableOps(userName) {
      return userName !== this.loginedUserName;
    },
    /**
     * @function 检查当前登录用户是否可以进行新增、编辑、删除操作
     */
    _checkPermissions(params, fn) {
      this.$http({
        method: 'GET',
        url: `user/access-to-operate-user/${params.id}`
      }).then(({ data }) => {
        if (data.status) {
          fn();
        }
      });
    },
    /**
     * @function 设置当前已选组织数据，同时获取当前组织用户信息。并设置当前组织默认路径
     * @description 改变组织时触发
     * @param {Array} node - 当前选中组织数据
     */
    groupChange(node) {
      if (node && node.length) {
        this.currentSelectedGroup = node[0];
        this._setInputEmpty();
        this.getTableData({ clearable: true, pageSize: this.page.pageSize });
      }
    },
    /**
     * @function 获取用户列表，并重置已选择项。
     * @description 在包含子组织选项状态发生改变时触发
     */
    containSubGroupChange() {
      this.getTableData({ clearable: true, pageSize: this.page.pageSize });
    },
    /**
     * @function 发送请求获取表格数据，并且做相应处理
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
      this.$http
        .post('user/list-group-one/page', {
          paramMap: {
            groupId: this.currentSelectedGroup.id,
            belowFlag: this.belowFlag
          },
          pageModel: {
            current: currentPage,
            orderMap: this.orderMap,
            pageSize: pageSize,
            searchMap: {
              loginName: this.searchValue
            }
          }
        })
        .then(({ data }) => {
          if (data.status) {
            let resp = data.data;
            resp.records.forEach(item => {
              if (item.loginName === this.loginedUserName) {
                item._disabled = true;
              }
            });
            resp.records.forEach(item => {
              for (let subItem of this.selectedIdsList) {
                if (item.id === subItem) {
                  item._checked = true;
                  break;
                }
              }
            });
            this.tableConfig.data = resp.records;
            this.page.totalCount = resp.total;
            this.page.totalPage = resp.pages ? resp.pages : 1;
          }
          this.tableConfig.loading = false;
        });
    },
    /**
     * @function 搜索用户，并重置已选择项
     * @description: 点击查询按钮触发
     */
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      this.getTableData({
        clearable: true,
        pageSize: this.page.pageSize
      });
    },
    /**
     * @function 点击刷新按钮触发
     */
    handleRefresh() {
      this._setInputEmpty();
      this.tableConfig.key = new Date().toString();
      this.getTableData({
        clearable: true,
        pageSize: this.page.pageSize
      });
    },
    /**
     * @function 点击新建按钮触发
     */
    handleCreate() {
      this._checkPermissions(this.currentSelectedGroup, () => {
        if (this.loginedUserName !== 'admin' && this.currentSelectedGroup.id === this.rootId) {
          this.defaultPath = treePathFormat(
            this.groupTreeArrChild,
            this.groupTreeArrChild[0].id
          ).path;
        } else {
          this.defaultPath = treePathFormat(
            this.groupTreeArrChild,
            this.currentSelectedGroup.id
          ).path;
        }
        this.flag.add = true;
      });
    },
    handleMultiDelete() {
      if (this.selectedIdsList.length > 0) {
        this.userInfo = {};
        this.flag.multiDelete = true;
      } else {
        this.$Notice.warning({
          desc: '请选择要删除的用户'
        });
      }
    },
    /**
     * @function 删除用户
     */
    submitDelete() {
      this.$loading.show();
      this.$http({
        method: 'DELETE',
        url: '/user/delete/batch',
        data: this.userInfo.id ? [this.userInfo.id] : this.selectedIdsList
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.handleRefresh();
          this.$Notice.success({
            desc: '删除用户成功'
          });
        }
      });
    },
    /**
     * @function 解锁用户
     */
    handleUnclock() {
      this.$loading.show();
      this.$http({
        method: 'PUT',
        url: `/user/unlock/${this.userInfo.id}`
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: '解锁用户成功'
          });
          this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        }
      });
    },
    /**
     * @function 获取用户信息，并显示详情弹出框
     * @private
     */
    _getUserInfo(id) {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'GET',
          url: `/user/${id}`
        }).then(({ data }) => {
          resolve(data);
        });
      });
    },
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
      for (let [index, item] of this.selectedIdsList.entries()) {
        if (item === row.id) {
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
        if (this.selectedIdsList.length > 0) {
          for (let [subIndex, subItem] of this.selectedIdsList.entries()) {
            if (item.id === subItem) {
              break;
            }
            if (subIndex === this.selectedIdsList.length - 1) {
              this.selectedIdsList.push(item.id);
            }
          }
        } else {
          this.selectedIdsList.push(item.id);
        }
      });
    },
    /**
     * @function 移除取消选中项
     * @description: 在多选模式下有效，点击取消全选时触发
     * @param {Array} selection - 当前页面已选项数据
     */
    selectAllCancel(selection) {
      /* 由于该方法参数未返回取消选中项，所以用当前页面数据替代 */
      this.tableConfig.data.forEach(item => {
        for (let [subIndex, subItem] of this.selectedIdsList.entries()) {
          if (item.id === subItem) {
            this.selectedIdsList.splice(subIndex, 1);
            break;
          }
        }
      });
    },
    /**
     * @function 编辑、授权后，保留表格搜索项，但清除表格数据和选中项
     */
    resetTable() {
      this.getTableData({ clearable: true, pageSize: this.page.pageSize });
    }
  },
  computed: {
    loginedUserName() {
      return this.$store.state.login.userName;
    }
  },
  created() {
    this.getGroupList();
    this.$eventHub.$on('update', this.handleRefresh);
  }
};
</script>

<style lang="less" scoped>
.user-manage {
  width: 100%;
  height: 100%;
  position: relative;
  .user-manage-left {
    width: 280px;
    height: 100%;
    overflow: auto;
  }
  .user-manage-right {
    height: 100%;
    position: absolute;
    left: 292px;
    right: 0;
    top: 0;
    .user-manage-right-title,
    .user-manage-right-content {
      width: 100%;
    }
    .user-manage-right-title {
      padding-left: 14px;
    }
    .user-manage-right-content {
      position: absolute;
      top: 55px;
      bottom: 0;
      overflow: auto;
      .page-wrapper {
        position: relative;
      }
    }
  }
}
</style>
