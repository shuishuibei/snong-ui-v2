<!--
 * @Author: cfw2157 yz.caiyijun@h3c.com
 * @Date: 2023-05-08 13:41:23
 * @LastEditors: cfw2157 yz.caiyijun@h3c.com
 * @LastEditTime: 2023-05-08 14:23:06
 * @FilePath: \snong-ui-v2\src\pages\app\personal-report\project-work\components\TableOperation.vue
 * @Description: 表格操作-更多选项下拉框
 * 
-->
<template>
  <div class="table-operation">
    <Dropdown
      trigger="click"
      :transfer="true"
      class="table-dropdown"
      @on-click="operate"
    >
      <a href="javascript:void(0)">
        <i class="iconfont icon-gengduo"></i>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="upload">
          <span class="table-op-title">上 传</span>
        </DropdownItem>
        <DropdownItem name="download">
          <span class="table-op-title">模板下载</span>
        </DropdownItem>
        <DropdownItem name="check">
          <span class="table-op-title">复 核</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: "TableOperation",
  props: {
    params: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    operate(name) {
        this.dispatch("WorkList", name, this.params.row);
    },
  },
};
</script>

<style lang="less">
.ivu-dropdown-item {
  text-align: center;
}
.ivu-dropdown-item:not(.ivu-dropdown-item-disabled):hover {
  background: #6299fe !important;
  color: #fff;
}

.table-dropdown {
  z-index: 1000;
}

.table-op-iconfont-normal {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  letter-spacing: 0;
}

.table-op-title {
  display: inline-block;
  vertical-align: middle;
}
</style>
