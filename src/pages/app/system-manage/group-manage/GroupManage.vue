<!--
 * @Description: 组织管理
 * @Author: ys2234
 * @Date: 2019-07-25 11:47:04
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-05 13:36:42
 -->
<template>
  <div class="cds-wrapper group-manage">
    <!-- 顶部 -->
    <div class="header-wrapper cds-padding-14 cds-clearfix">
      <!-- 搜索 -->
      <div class="search-wrapper cds-float-left-btn">
        <i-input
          clearable
          class="cds-input-search"
          placeholder="请输入组织名称进行查询"
          @on-keyup.enter="handleSearch"
          v-model="inputValue"></i-input>
        <i-button
          type="primary"
          class="cds-btn-search"
          @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
      <!-- 按钮 -->
      <div class="cds-float-right-btn">
        <i-button
          type="primary"
          :disabled="createDisabled"
          @click="handleCreate"
          v-if="auths.indexOf('group-manage-create') !== -1">
          <i class="iconfont icon-plus">新增</i>
        </i-button>
        <i-button
          type="primary"
          :disabled="editDisabled"
          @click="handleEdit"
          v-if="auths.indexOf('group-manage-edit') !== -1">
          <i class="iconfont icon-weibiaoti2010104">编辑</i>
        </i-button>
        <i-button
          type="primary"
          :disabled="deleteDisabled"
          @click="handleDelete"
          v-if="auths.indexOf('group-manage-delete') !== -1">
          <i class="iconfont icon-shanchu">删除</i>
        </i-button>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content-wrapper">
      <div class="groupTree-wrapper cds-padding-14">
        <h3c-tree
          empty-text
          ref="groupTree"
          :data="groupTreeArr"
          :search-text="searchValue"
          @on-select-change="groupChange">
        </h3c-tree>
      </div>
      <div class="detail-wrapper cds-padding-14">
        <h3c-grid-info :data="groupInfoData" v-if="isPoolShow"></h3c-grid-info>
        <group-pool-info :data="groupPoolInfoData" v-else></group-pool-info>
        <i-spin
          fix
          size="large"
          v-if="isSpinInfoShow">
        </i-spin>
      </div>
    </div>
    <!-- 组织管理缓冲 -->
    <i-spin
      fix
      size="large"
      v-if="isSpinGroupManageShow">
    </i-spin>
    <group-edit
      title="新增组织"
      :group-list="groupTreeArrChild"
      :default-path="groupPath"
      v-model="flag.create"
      @on-ok="handleRefresh"
      v-if="auths.indexOf('group-manage-create') !== -1">
    </group-edit>
    <group-edit
      title="编辑组织"
      v-model="flag.edit"
      :group-list="groupTreeArrChild"
      :default-path="groupPath"
      :group-info="groupInfo"
      @on-ok="handleRefresh"
      v-if="auths.indexOf('group-manage-edit') !== -1">
    </group-edit>
    <h3c-modal-confirm
      :info="currentSelectedGroup.children && currentSelectedGroup.children.length ? `确认要删除组织：${currentSelectedGroup.name}及其子组织吗？` : `确认要删除组织：${currentSelectedGroup.name}吗？` "
      v-model="flag.delete"
      @on-ok="submitDelete(currentSelectedGroup.id)"
      v-if="auths.indexOf('group-manage-delete') !== -1">
    </h3c-modal-confirm>
  </div>
</template>

<script>
import GroupEdit from './components/GroupEdit.vue'; // 引入组织新建和编辑
import GroupPoolInfo from './components/GroupPoolInfo.vue'; // 引入组织详情
import H3cGridInfo from '@/components/h3c-grid-info/H3cGridInfo.vue'; // 引入详情
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import FTree from '@/components/h3c-tree/index'; // 引入树形控件
import { buildTree } from '@/assets/js/utils';
import { treePathFormat } from '@/assets/js/format';
export default {
  name: 'GroupManage',
  components: {
    'h3c-tree': FTree,
    'group-edit': GroupEdit,
    'group-pool-info': GroupPoolInfo,
    'h3c-grid-info': H3cGridInfo,
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    return {
      inputValue: '',
      searchValue: '',
      createDisabled: false,
      editDisabled: false,
      deleteDisabled: false,
      currentGroup: {}, // 当前用户所在组织
      currentSelectedGroup: {}, // 当前组织树高亮选中的组织
      groupPath: [],
      groupInfo: {}, // 已选组织详情
      groupInfoData: [], // 已选组织详情（资源池开，展示）
      groupPoolInfoData: {}, // 已选组织详情（资源池关，展示）
      groupListArr: [], // 组织列表的平行结构数据
      groupTreeArr: [], // 组织列表的树形结构数据
      groupNameArr: [], // 组织名称列表组成的数组
      groupTreeArrChild: [], // 当前用户所在组织以及以下组织的树形结构数据
      isSpinInfoShow: false, // 组织详情区域加载缓冲显示
      isSpinGroupManageShow: false, // 组织管理区域加载缓冲显示
      flag: {
        create: false,
        edit: false,
        delete: false
      },
      isPoolShow: true // 是否显示资源池
    };
  },
  methods: {
    /**
     * @function 获取组织列表信息，且将组织树选中高亮当前用户所在组织，展开至其子组织
     */
    getGroupList() {
      return this.$http({
        method: 'GET',
        url: 'group/list'
      }).then(({ data }) => {
        if (data.status) {
          this.groupListArr = data.data; // 组织列表的平行结构数据
          if (this.groupListArr && this.groupListArr.length) {
            this.groupTreeArr = buildTree(
              this.groupListArr,
              'createDate',
              item => {
                return {
                  id: item.id,
                  name: item.name,
                  parentId: item.parentId,
                  parentName: item.parentName,
                  title: item.name, // 显示的组织名称
                  value: item.id, // 级联选择时的唯一标识，因为id是唯一的，所以取id的值
                  label: item.name, // 级联选择时显示的资源名称
                  show: item.show
                };
              }
            );
            this._setTreeStatus(this.groupTreeArr);
            this._setBtnDisabled(this.currentSelectedGroup);
            this._setGroupNameArr(this.groupListArr);
            this.groupPath = treePathFormat(
              this.groupTreeArrChild,
              this.currentSelectedGroup.id
            ).path;
          }
        }
      });
    },
    /**
     * @function 设置组织树的展开状态和选中状态
     * @description 用户所在组织及其子组织的show字段为true，父组织及其以上组织show字段为false
     * @param {Array} arr - 组织列表（树形结构的数组）
     * @private
     */
    _setTreeStatus(arr) {
      if (arr[0].show) {
        this.$set(arr[0], 'selected', true);
        this.$set(arr[0], 'expand', true);
        this.currentGroup = arr[0]; // 设置当前登录用户所在的组织节点
        this.currentSelectedGroup = this.currentGroup;
        this.groupTreeArrChild = arr; // 设置当前用户所在组织以及以下组织的树形结构数组
      } else {
        this.$set(arr[0], 'expand', true);
        this._setTreeStatus(arr[0].children);
      }
    },
    /**
     * @function 根据组织ID获取组织详情（资源池开）
     * @param {string} id - 组织ID
     * @private
     */
    _getGroupInfo(id) {
      this.isSpinInfoShow = true; // 显示组织详情加载缓冲
      this.$http
        .get(`group/${id}`)
        .then(({ data }) => {
          this.isSpinInfoShow = false; // 关闭组织详情加载缓冲
          if (data.status) {
            this.groupInfo = data.data;
            this.groupInfoData = [
              {
                label: '组织名称',
                value: data.data.name
              },
              {
                label: '父组织名称',
                value: data.data.parentName
              },
              {
                label: '别名',
                value: data.data.label
              },
              {
                label: '资源池',
                value: data.data.poolName
              },
              /* {
              label: '状态',
              value: data.data.active ? '有效' : '无效'
            }, */
              {
                label: '机构负责人',
                value: data.data.principal
              },
              {
                label: '联系人',
                value: data.data.linkman
              },
              {
                label: '电话号码',
                value: data.data.telephone
              },
              {
                label: '地址',
                value: data.data.address
              },
              {
                label: '创建时间',
                value: data.data.createDate
              },
              {
                label: '修改时间',
                value: data.data.modifiedDate
              },
              {
                label: '备注',
                value: data.data.description
              }
            ];
          } else {
            this.$Notice.error({
              title: '获取组织详情失败',
              desc: data.message
            });
          }
        })
        .catch(() => {
          this.isSpinInfoShow = false; // 关闭组织详情加载缓冲
        });
    },
    /**
     * @function 根据组织ID获取组织详情（资源池关）
     * @param {string} id - 组织ID
     * @private
     */
    _getGroupPoolInfo(id) {
      this.$http({
        method: 'GET',
        url: `/quota/group/${id}`
      }).then(({ data }) => {
        if (data.status) {
          this.groupInfo = data.data;
          this.groupPoolInfoData = data.data;
        }
      });
    },
    /**
     * @function 根据当前组织节点show字段设置新建、编辑和删除按钮禁用状态
     * @description: 当选择的组织的show字段为true时，代表当前组织为登录用户所在的组织或其子组织，否则当前组织为登录用户的父组织
     * @param {object} node - 组织节点对象
     * @private
     */
    _setBtnDisabled(node) {
      if (node.show) {
        /* 当前组织为登录用户所在的组织或其子组织 */
        this.createDisabled = false;
        this.editDisabled = false;
        if (node.id == this.currentGroup.id) {
          /* 不可删除当前登录用户所在的组织 */
          this.deleteDisabled = true;
        } else {
          this.deleteDisabled = false;
        }
      } else {
        /* 当前组织为登录用户的父组织，新增、编辑、删除都禁用 */
        this.createDisabled = true;
        this.editDisabled = true;
        this.deleteDisabled = true;
      }
    },
    /**
     * @function 设置组织名称列表组成的数组groupNameArr
     * @param {Array} arr - 组织列表（平行结构的数组）
     * @private
     */
    _setGroupNameArr(arr) {
      this.groupNameArr = [];
      for (let i = 0, len = arr.length; i < len; i++) {
        this.groupNameArr.push(arr[i].name);
      }
    },
    /**
     * @function 设置组织树中某一组织的选中状态
     * @param {Array} arr - 组织列表（树形结构的数组）
     * @param {string} str - 组织名称中的匹配字符
     * @private
     */
    _setTreeNodeSelect(arr, str) {
      if (arr[0].title.indexOf(str) <= -1) {
        this._setTreeNodeSelect(arr[0].children, str);
      } else {
        this.$set(arr[0], 'selected', true);
        this.groupChange(arr);
      }
    },
    /**
     * @function 新增、编辑、删除时，根据权限判断是否可以新建
     * @param {Object} params - 当前组织信息
     * @param {Function} fn - 回调函数，显示弹出框
     * @private
     */
    _checkPermission(params, fn) {
      this.$http.get(`/group/add/can/${params.id}`).then(({ data }) => {
        if (data.status) {
          fn();
        }
      });
    },
    /**
     * @function 设置当前登录用户所在的组织节点currentGroup和所在组织以及以下组织组成的的树形结构数组groupTreeArrChild
     * @param {Array} arr - 组织列表（树形结构的数组）
     * @private
     */
    _setCurrentGroup(arr) {
      if (arr[0].show) {
        this.currentGroup = arr[0];
        this.groupTreeArrChild = arr;
      } else {
        this._setCurrentGroup(arr[0].children);
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
     * @function 获取组织列表信息，且将当前groupName所在组织高亮并展开
     * @description 在新增组织后调用该方法
     * @param {string} groupName - 组织名称
     * @private
     */
    _getGroupListAfterOperate(groupName) {
      return this.$http.get('group/list').then(({ data }) => {
        this.groupListArr = data.data;
        if (this.groupListArr && this.groupListArr.length) {
          this._setListStatus(this.groupListArr, groupName);
          this.groupTreeArr = buildTree(
            this.groupListArr,
            'createDate',
            item => {
              return {
                id: item.id,
                name: item.name,
                parentId: item.parentId,
                parentName: item.parentName,
                title: item.name, // 显示的组织名称
                value: item.id, // 级联选择时的唯一标识，因为id是唯一的，所以取id的值
                label: item.name, // 级联选择时显示的资源名称
                show: item.show,
                expand: item.expand,
                selected: item.selected
              };
            }
          );
          this._setCurrentGroup(this.groupTreeArr);
          this._setBtnDisabled(this.currentSelectedGroup);
          this._setGroupNameArr(this.groupListArr);
          this.groupPath = treePathFormat(
            this.groupTreeArrChild,
            this.currentSelectedGroup.id
          ).path;
        }
      });
    },
    /**
     * @function 根据组织名称name设置组织列表的selected和expand字段，并且根据当前选中组织设置新建、编辑和删除按钮禁用状态
     * @param {Array} arr   - 组织列表（平行结构的数组）
     * @param {String} name - 组织名称
     * @private
     */
    _setListStatus(arr, name) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i].name === name) {
          arr[i].selected = true;
          this.currentSelectedGroup = arr[i];
          this._setBtnDisabled(arr[i]); // 设置新建、编辑和删除按钮禁用状态
          this._setListExpand(arr, arr[i].parentId);
        }
      }
    },
    /**
     * @function 根据组织ID设置组织列表的expand字段
     * @param {Array} arr - 组织列表（平行结构的数组）
     * @param {string} id - 组织ID
     * @private
     */
    _setListExpand(arr, id) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i].id === id) {
          arr[i].expand = true;
          id = arr[i].parentId;
          this._setListExpand(arr, id);
        }
      }
    },
    /**
     * @function 设置当前组织的新建、编辑、删除操作状态，并获取当前节点信息
     * @description 点击树节点时触发
     * @param {Object} node - 当前已选中的节点数组、当前项
     */
    groupChange(node) {
      if (node && node.length) {
        this.currentSelectedGroup = node[0];
        this._setBtnDisabled(node[0]);
        /* 获取选中组织的详情信息 */
        if (this.isPoolShow) {
          this._getGroupInfo(node[0].id);
        } else {
          this._getGroupPoolInfo(node[0].id);
        }
        this.groupPath = treePathFormat(
          this.groupTreeArrChild,
          node[0].id
        ).path;
      }
    },
    /**
     * @function 搜索组织
     */
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      /* 当搜索内容为空时，不进行搜索 */
      if (this.searchValue.length > 0) {
        this.$http({
          method: 'GET',
          url: 'group/list',
          params: {
            groupName: this.searchValue
          }
        }).then(({ data }) => {
          if (data.data && data.data.length) {
            this.groupTreeArr = buildTree(data.data, 'createDate', item => {
              return {
                id: item.id,
                parentId: item.parentId,
                title: item.name, // 显示的组织名称
                value: item.id, // 级联选择时的唯一标识，因为id是唯一的，所以取id的值
                label: item.name, // 级联选择时显示的资源名称
                expand: true,
                selected: false,
                show: item.show,
                name: item.name
              };
            });
            this._setTreeNodeSelect(this.groupTreeArr, this.searchValue);
          } else {
            this.$Notice.warning({
              desc: '查询不到该组织'
            });
          }
        });
      } else {
        this.getGroupList();
      }
    },
    /**
     * @function 创建组织弹出框显示
     */
    handleCreate() {
      if (this.isPoolShow) {
        this._checkPermission(this.groupInfo, () => {
          this.flag.create = true;
        });
      } else {
        this.$router.push({
          name: 'group-manage/edit',
          query: {
            parentId: this.currentSelectedGroup.id
          }
        });
      }
    },
    /**
     * @function 编辑组织弹出框显示
     */
    handleEdit() {
      if (this.isPoolShow) {
        this._checkPermission(this.groupInfo, () => {
          this.flag.edit = true;
        });
      } else {
        this.$router.push({
          name: 'group-manage/edit',
          query: {
            id: this.currentSelectedGroup.id
          }
        });
      }
    },
    /**
     * @function 删除组织弹出框显示
     */
    handleDelete() {
      this._checkPermission(this.groupInfo, () => {
        this.flag.delete = true;
      });
    },
    /**
     * @function 刷新组织树，获取组织详情，并默认选中新增或修改的组织
     * @description: 由于组织过多的情况下，如果刷新组织树后默认选中admin，交互不好
     * @param {string} groupName - 组织名称
     */
    handleRefresh(groupName) {
      this._setInputEmpty();
      this._getGroupListAfterOperate(groupName).then(() => {
        if (this.isPoolShow) {
          this._getGroupInfo(this.currentSelectedGroup.id);
        } else {
          this._getGroupPoolInfo(this.currentSelectedGroup.id);
        }
      });
    },
    /**
     * @function 删除组织并清空搜索框
     */
    submitDelete(id) {
      this.flag.delete = false;
      this.$loading.show();
      this.$http.delete(`/quota/delete/${id}`).then(({ data }) => {
        if (data.status) {
          this._setInputEmpty();
          this.$Notice.success({
            desc: '删除组织成功'
          });
          this.getGroupList().then(() => {
            if (this.isPoolShow) {
              this._getGroupInfo(this.currentSelectedGroup.id);
            } else {
              this._getGroupPoolInfo(this.currentSelectedGroup.id);
            }
          });
        }
        this.$loading.hide();
      });
    }
  },
  computed: {
    auths() {
      return this.$store.state.auth.auths;
    }
  },
  created() {
    Promise.all([this.getGroupList()]).then(() => {
      if (this.isPoolShow) {
        this._getGroupInfo(this.currentSelectedGroup.id);
      } else {
        this._getGroupPoolInfo(this.currentSelectedGroup.id);
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = true;
    next();
  }
};
</script>

<style lang="less" scoped>
.group-manage {
  .header-wrapper {
    width: 100%;
    background-color: #fff;
    border: 1px solid #d8e0eb;
    .search-wrapper,
    .btn-wrapper {
      display: inline-block;
    }
  }
  .content-wrapper {
    position: absolute;
    width: 100%;
    min-width: 1176px;
    top: 74px;
    bottom: 0;
    .groupTree-wrapper,
    .detail-wrapper {
      position: absolute;
      height: 100%;
      background-color: #fff;
      border: 1px solid #d8e0eb;
      overflow: auto;
    }
    .groupTree-wrapper {
      width: 280px;
    }
    .detail-wrapper {
      left: 292px;
      right: 0;
      color: #383f51;
    }
  }
}
</style>
