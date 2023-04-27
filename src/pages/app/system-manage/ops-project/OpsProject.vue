<!--
 * @Description: 资源管理
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:09
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 15:59:09
 -->
<template>
  <div class="cds-wrapper resource-manage">
    <!-- 顶部 -->
    <div class="header-wrapper cds-padding-14 cds-clearfix">
      <!-- 搜索 -->
      <div class="cds-float-left-btn">
        <i-input
          clearable
          class="cds-input-search"
          placeholder="请输入资源名称进行查询"
          v-model="inputValue"
          @on-keyup.enter="handleSearch">
        </i-input>
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
          @click="flag.add = true">
          <i class="iconfont icon-plus">新增</i>
        </i-button>
        <i-button
          type="primary"
          @click="flag.modify = true">
          <i class="iconfont icon-weibiaoti2010104">编辑</i>
        </i-button>
        <i-button
          type="primary"
          :disabled="!shouldDelete"
          @click="handleDelete">
          <i class="iconfont icon-shanchu">删除</i>
        </i-button>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="resourceTree-wrapper cds-padding-14">
        <h3c-tree
          empty-text
          ref="resourceTree"
          :data="resourceTreeArr"
          :search-text="searchValue"
          @on-select-change="resourceChange">
        </h3c-tree>
      </div>
      <div class="detail-wrapper cds-padding-14">
        <h3c-grid-info :data="resourceInfoShow"></h3c-grid-info>
        <i-spin
          fix
          size="large"
          v-if="isSpinResourceManageInfoShow">
        </i-spin>
      </div>
    </div>
    <!-- 组织管理缓冲 -->
    <i-spin
      fix
      size="large"
      v-if="isSpinResourceManageShow">
    </i-spin>
    <ops-project-edit
      title="新增运维项目"
      :default-path="resourcePath"
      :resource-list="resourceTreeArr"
      v-model="flag.add"
      @on-ok="getResourceList">
    </ops-project-edit>
    <ops-project-edit
      title="编辑运维项目"
      :default-path="resourcePath"
      :resource-list="resourceTreeArr"
      :resource-info="resourceInfo"
      v-model="flag.modify"
      @on-ok="getResourceList">
    </ops-project-edit>
    <h3c-modal-confirm
      show-background-color
      title="删除资源"
      :info="'确认删除资源：' + resourceInfo.title + '？'"
      v-model="flag.delete"
      @on-ok="submitDelete(resourceInfo.id, shouldForceDelete)">
      <template>
        <div class="forceDelete">
          <i-checkbox v-model="shouldForceDelete">强制删除此资源下的资源</i-checkbox>
        </div>
      </template>
    </h3c-modal-confirm>
  </div>
</template>

<script>
import FTree from '@/components/h3c-tree/index';
import { buildTree } from '@/assets/js/utils';
import { treePathFormat } from '@/assets/js/format';
import OpsProjectEdit from './components/OpsProjectEdit.vue';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import H3cGridInfo from '@/components/h3c-grid-info/H3cGridInfo.vue';
export default {
  name: 'ResourceManage',
  components: {
    'h3c-tree': FTree,
    'ops-project-edit': OpsProjectEdit,
    'h3c-modal-confirm': H3cModalConfirm,
    'h3c-grid-info': H3cGridInfo
  },
  data() {
    return {
      inputValue: '',
      searchValue: '',
      findNum: 0,
      flag: {
        add: false,
        modify: false,
        delete: false
      },
      resourceTreeArr: [], // 资源树数据
      shouldDelete: false, // 是否删除
      currentResource: {}, // 当前资源
      resourceInfo: {}, // 当前资源的资源详情（数据）
      resourceInfoShow: [], // 当前资源的资源详情（显示）
      resourcePath: [], // 当前资源路径
      isSpinResourceManageShow: false,
      isSpinResourceManageInfoShow: false,
      shouldForceDelete: false // 强制删除
    }
  },
  methods: {
    /**
     * @function 搜索资源
     */
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      /* 当搜索内容为空时，不进行搜索 */
      if(this.searchValue.length > 0) {
        this._getResourceListWidthSearch();
      }
    },
    /**
     * @function 显示删除弹出框，并将强制删除重置为false。
     */
    handleDelete() {
      this.flag.delete = true;
      this.shouldForceDelete = false;
    },
    /**
     * @function 清空搜索项，刷新组织树，获取资源详情。
     * @param {string} resourceName - 资源名称
     */
    handleRefresh(resourceName) {
      this._setInputEmpty();
      this._getResourceListAfterOperate(resourceName);
    },
    /**
     * @function 获取资源数据，并默认选中根资源。且如果根资源有子项，展开根资源。同时设置当前资源的父资源路径。
     */
    getResourceList() {
      this.isSpinResourceManageShow = true;
      this.$http({
        method: 'GET',
        url: 'project/list'
      }).then(({ data }) => {
        this.isSpinResourceManageShow = false;
        if(data.status) {
          if (data.data && data.data.length) {
            this.resourceTreeArr = buildTree(data.data, 'projectNo',
              item => {
                return {
                  id: item.id,
                  parentId: item.parentId,
                  title: item.projectName,
                  value: item.id,
                  label: item.projectName
                };
              }
            );
            this.currentResource = this.resourceTreeArr[0]; // 设置当前资源为根资源
            this.$set(this.resourceTreeArr[0], 'selected', true); // 选中根资源
            if(
              this.resourceTreeArr[0].children &&
              this.resourceTreeArr[0].children.length > 0
            ) {
              this.$set(this.resourceTreeArr[0], 'expand', true); // 如果根资源有子资源时展开根资源
            }
            this._setBtnDisabled();
            this._getResourceInfo(this.resourceTreeArr[0].id); // 获取根资源详情
            this.resourcePath = treePathFormat(this.resourceTreeArr, this.resourceTreeArr[0].id).path;
          }
        }
      })
    },
    /**
     * @function 根据当前资源是否是根资源，判断是否可以删除
     */
    _setBtnDisabled() {
      if(this.currentResource.id === this.resourceTreeArr[0].id) {
        this.shouldDelete = false;
      } else {
        this.shouldDelete = true;
      }
    },
    /**
     * @function 获取资源信息
     * @private
     */
    _getResourceInfo(id) {
      this.isSpinResourceManageInfoShow = true;
      this.$http({
        method: 'GET',
        url: `project/${id}`
      }).then(({ data }) => {
        this.isSpinResourceManageInfoShow = false;
        if(data.status) {
          this.resourceInfo = data.data;
          this.resourceInfoShow = [
            {
              label: '项目名称',
              value: data.data.projectName
            },
            {
              label: '父资源名称',
              value: data.data.parentName
            },
            {
              label: 'ICON',
              value: data.data.icon
            },
            {
              label: '路由/ID',
              value: data.data.location
            },
            {
              label: '同级菜单序号',
              value: data.data.orderNo
            },
            {
              label: '资源类型',
              value: function() {
                if(data.data.type === 0) {
                  return '菜单';
                } else if(data.data.type === 1) {
                  return '组件';
                } else if(data.data.type === 2) {
                  return '叶子'
                } else {
                  return ''
                }
              }()
            },
            {
              label: '描述',
              value: data.data.description
            },
            {
              label: '创建者',
              value: data.data.owner
            },
            {
              label: '状态',
              value: data.data.isActive === 1 ? '有效' : '无效'
            },
            {
              label: '模块功能分类',
              value: data.data.module === 1 ? '业务模块' : '系统模块'
            },
            {
              label: '创建时间',
              value: data.data.createDate
            },
            {
              label: '修改时间',
              value: data.data.modifiedDate
            }
          ]
        }
      })
    },
    /**
     * @function 获取资源数据，并根据搜索值设置选中项以及展开项
     * @description: 如果存在多次搜索，需要清除上次选中和展开的项。且为保持数据最新，在每次搜索时都获取一遍资源数据。
     * @private
     */
    _getResourceListWidthSearch() {
      this.isSpinResourceManageShow = true;
      this.findNum = 0;
      this.$http({
        method: 'GET',
        url: 'resource/list'
      }).then(({ data }) => {
        this.isSpinResourceManageShow = false;
        if(data.status) {
          if (data.data && data.data.length) {
            this.resourceTreeArr = buildTree(data.data, 'orderNo',
              item => {
                return {
                  id: item.id,
                  parentId: item.parentId,
                  title: item.title,
                  value: item.id,
                  selected: false,
                  label: item.title
                };
              }
            );
            this._setTreeNodeSelected(this.resourceTreeArr, this.searchValue);
          }
        }
      })
    },
    /**
     * @function 将新增及修改的资源高亮显示并展开
     * @description: 新增、修改后获取资源列表
     * @param {string} resourceName - 资源名称
     * @private
     */
    _getResourceListAfterOperate(resourceName) {

    },
    /**
     * @function 设置资源选中状态
     * @param {Array} arr - 资源列表（树形结构的数组）
     * @param {string} str - 组织名称中的匹配字符
     */
    _setTreeNodeSelected(arr, str) {
      for(let item of arr) {
        if(item.title.indexOf(str) === -1) {
          item.children ? this._setTreeNodeSelected(item.children, str) : null;
        } else {
          item.children ? this._setTreeNodeSelected(item.children, str) : null;
          this._setTreeNodeExpanded(this.resourceTreeArr, item.parentId);
          this.findNum++;
          if(this.findNum === 1) {
            this.$set(item, 'selected', true);
            this._getResourceInfo(item.id);
            this.resourcePath = treePathFormat(this.resourceTreeArr, item.id).path;
          }
        }
      }
    },
    /**
     * @function 设置资源展开状态
     * @param {Array} arr - 资源列表（树形结构的数组）
     * @param {string} id - 要展开的资源的ID
     */
    _setTreeNodeExpanded(arr, id) {
      for(let item of arr) {
        if(item.id === id) {
          this.$set(item, 'expand', true);
          item.id !== 'root' ? this._setTreeNodeExpanded(this.resourceTreeArr, item.parentId) : null;
        } else {
          item.children ? this._setTreeNodeExpanded(item.children, id) : null;
        }
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
     * @function 获取当前资源信息，并设置当前资源是否可被删除。同时设置当前资源的父资源路径。
     * @description 改变资源时触发
     * @param {Array} node - 当前选中资源数据
     */
    resourceChange(node) {
      this._getResourceInfo(node[0].id);
      this.currentResource = node[0];
      this._setBtnDisabled();
      this.resourcePath = treePathFormat(this.resourceTreeArr, node[0].id).path;
    },
    /**
     * @function 删除资源
     */
    submitDelete(id, shouldForceDelete) {
      this.$loading.show();
      this.$http({
        method: 'DELETE',
        url: `resource/delete/${id}`,
        params: {
          forceFlag: shouldForceDelete
        }
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
              desc: '删除资源成功'
          });
          this.getResourceList();
        }
      })
    }
  },
  created() {
    this.getResourceList();
  },
}
</script>

<style lang="less" scoped>
.resource-manage {
  width: 100%;
  height: 100%;
  position: relative;
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
    .resourceTree-wrapper,
    .detail-wrapper {
      position: absolute;
      height: 100%;
      background-color: #fff;
      border: 1px solid #d8e0eb;
      overflow: auto;
    }
    .resourceTree-wrapper {
      width: 280px;
    }
    .detail-wrapper {
      left: 292px;
      right: 0;
      color: #383f51;
    }
  }
}
.forceDelete {
  background-color:#fff0e1;
  padding-bottom: 15px;
  font-weight: 500;
}
</style>
