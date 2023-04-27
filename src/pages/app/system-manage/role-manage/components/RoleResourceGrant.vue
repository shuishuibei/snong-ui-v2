<!--
 * @Description: 角色授权
 * @Author: ys2234
 * @Date: 2019-09-09 16:08:11
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-13 14:59:43
 -->
<template>
  <i-modal
    width="460px"
    title="角色授权"
    :value="value"
    :mask-closable="false"
    @on-cancel="$emit('input', false)">
    <div class="tree-wrapper">
      <i-tree
        show-checkbox
        ref="resourceTree"
        :data="treeData">
      </i-tree>
    </div>
    <div slot="footer">
      <i-button type="primary" @click="submit">确 认</i-button>
      <i-button @click="$emit('input', false)">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import { buildTree } from '@/assets/js/utils';

export default {
  name: 'GrantResourcesModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      default() {
        return {};
      }
    },
    isDev: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resourceList: [], // 角色可授予的资源（根据角色等级获取的可授予资源总集）
      resourceListGranted: [], // 角色已经授权的资源
      treeData: [] // 树形图数据
    };
  },
  methods: {
    /**
     * @function getResource
     * @description 获取角色所在角色级别可授权的资源
     * @param {string} roleId  角色ID
     * @returns {promise}
     */
    getResource(roleId) {
      return this.$http.get(`role/resource/list/${roleId}`).then(({ data }) => {
        if (data.status) {
          this.resourceList = data.data;
        }
      });
    },
    /**
     * @function getAllResource
     * @description 获取所有资源（KF01登录时获取）
     * @returns {promise}
     */
    getAllResource() {
      return this.$http.get('role/resource/list').then(({ data }) => {
        if (data.status) {
          this.resourceList = data.data;
        }
      });
    },
    /**
     * @function getResourceGranted
     * @description 获取角色已经授予的资源
     * @param {string} roleId 角色ID
     * @returns {promise}
     */
    getResourceGranted(roleId) {
      return this.$http
        .get(`role/resource-granted/${roleId}`)
        .then(({ data }) => {
          if (data.status) {
            this.resourceListGranted = data.data;
          }
        });
    },
    /**
     * @function _treePath
     * @private
     */
    _treePath(id, arr, path = []) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (id === arr[i].id) {
          path.push(arr[i].id);
          this._treePath(arr[i].parentId, arr, path);
        }
      }
      return path;
    },
    init() {
      let roleId = this.node.id; // 当前角色ID
      /* 如果是KF01，则发送获取所有资源请求getAllResource，如果不是则发送可授予资源请求getResource */
      Promise.all([
        this.isDev ? this.getAllResource() : this.getResource(roleId),
        this.getResourceGranted(roleId)
      ]).then(() => {
        let allResourceLen = this.resourceList.length, // 可授予资源的数量
          grantedResourceLen = this.resourceListGranted.length; // 已授予资源的数量
        /* 由于iview的树形控件Tree的checked属性是只要设置为true，则其子元素全部选中，所以只能设置路径的最后一级元素选中 */
        for (let i = 0; i < allResourceLen; i++) {
          for (let j = 0; j < grantedResourceLen; j++) {
            /* 如果ID相等，说明其是已授予的资源，将checked属性设置为true */
            if (this.resourceList[i].id === this.resourceListGranted[j].id) {
              this.resourceList[i].checked = true;
            }
            /**
             * 如果ID等于已授予资源的parentId，说明其在已授予的资源构成的树形结构中不是叶子，而是节点，需要展开
             * 将其checked属性设置为false，expand属性设置为true
             */
            if (
              this.resourceList[i].id === this.resourceListGranted[j].parentId
            ) {
              this.resourceList[i].checked = false;
              this.resourceList[i].expand = true;
              break;
            }
          }
        }
        /* 根据菜单序号orderNo排序生成树结构数组 */
        this.treeData = buildTree(this.resourceList, 'orderNo', item => {
          return {
            id: item.id, // 资源ID
            title: item.title, // 显示的资源名称
            expand: item.expand, // 默认全部展开
            checked: item.checked // 设置其勾选状态
          };
        });
      });
    },
    /**
     * @function 提交授权请求
     */
    submit() {
      this.$loading.show();
      let checkedResource = this.$refs['resourceTree'].getCheckedNodes(), // 被勾选的叶子资源ID组成的数组
        checkedLength = checkedResource.length;
      /* 当勾选的资源为空时提示 */
      if (checkedLength === 0) {
        this.$loading.hide();
        this.$Notice.warning({
          desc: '请至少选择一个资源'
        });
        return;
      }
      this.$emit('input', false);
      let resources = [];
      for (let i = 0; i < checkedLength; i++) {
        let arr = this._treePath(checkedResource[i].id, this.resourceList);
        resources = [...resources, ...arr];
      }
      resources = Array.from(new Set(resources));
      let params = [];
      for (let i = 0, len = this.resourceList.length; i < len; i++) {
        if (resources.indexOf(this.resourceList[i].id) !== -1) {
          params.push(this.resourceList[i].id);
        }
      }
      this.$http({
        method: 'PUT',
        url: `/role/resource-grant/${this.node.id}`,
        data: params
      }).then(({ data }) => {
        if (data.status) {
          this.$Notice.success({
            desc: '角色授权成功'
          });
        }
        this.$loading.hide();
      });
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.init();
      } else {
        this.resourceList = [];
        this.resourceListGranted = [];
        this.treeData = [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tree-wrapper {
  max-height: 400px;
  padding: 10px 25px;
  border: 1px solid #c8d0da;
  overflow: auto;
}
</style>
