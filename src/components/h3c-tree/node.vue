<!--
 * @Description: 树节点组件
 * @Author: ys2234
 * @Date: 2019-07-25 11:47:03
 * @LastEditors: ys2234
 * @LastEditTime: 2019-09-20 11:50:49
 -->
<template>
  <collapse-transition>
    <ul :class="classes">
      <li>
        <span
          :class="arrowClasses"
          @click="handleExpand">
          <i-icon
            v-if="showArrow"
            type="ios-arrow-forward">
          </i-icon>
          <i-icon
            v-if="showLoading"
            type="load-c"
            class="ivu-load-loop">
          </i-icon>
        </span>
        <i-checkbox
          v-if="showCheckbox"
          :value="data.checked"
          :indeterminate="data.indeterminate"
          :disabled="data.disabled || data.disableCheckbox"
          @click.native.prevent="handleCheck">
        </i-checkbox>
        <render
          v-if="data.render"
          :render="data.render"
          :data="data"
          :node="node">
        </render>
        <render
          v-else-if="isParentRender"
          :render="parentRender"
          :data="data"
          :node="node">
        </render>
        <span
          v-else
          :class="titleClasses"
          v-html="nodeName"
          @click="handleSelect">
        </span>
        <template v-if="data.expand">
          <tree-node
            v-for="(item, i) in children"
            :key="i"
            :data="item"
            :multiple="multiple"
            :show-checkbox="showCheckbox"
            :children-key="childrenKey">
          </tree-node>
        </template>
      </li>
    </ul>
  </collapse-transition>
</template>
<script>
import Render from './render';
import CollapseTransition from './collapse-transition';
import Emitter from '@/assets/js/emitter.js';
import { findComponentUpward } from './assist.js';

const prefixCls = 'ivu-tree';

export default {
  name: 'TreeNode',
  mixins: [Emitter],
  components: { CollapseTransition, Render },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls
    };
  },
  computed: {
    /**
     * @function 如果当前节点名称，有文字和搜索内容匹配，就把匹配的文字标红，反之，则正常显示节点名称
     */
    nodeName() {
      if(
        this.data.searchText == undefined ||
        this.data.searchText == '' ||
        this.data.searchText == null
      ) {
        return this.data.title;
      }
      if (this.data.title.indexOf(this.data.searchText) <= -1) {
        return this.data.title;
      }
      return this.replaceAll(
        this.data.title,
        this.data.searchText,
        '<span style="color:red;">' + this.data.searchText + '</span>'
      );
    },
    classes() {
      return [`${prefixCls}-children`];
    },
    selectedCls() {
      return [
        {
          [`${prefixCls}-node-selected`]: this.data.selected
        }
      ];
    },
    arrowClasses() {
      return [
        `${prefixCls}-arrow`,
        {
          [`${prefixCls}-arrow-disabled`]: this.data.disabled,
          [`${prefixCls}-arrow-open`]: this.data.expand
        }
      ];
    },
    titleClasses() {
      return [
        `${prefixCls}-title`,
        {
          [`${prefixCls}-title-selected`]: this.data.selected
        }
      ];
    },
    showArrow() {
      return (
        (
          this.data[this.childrenKey] &&
          this.data[this.childrenKey].length
        ) ||
        ('loading' in this.data && !this.data.loading)
      );
    },
    showLoading() {
      return 'loading' in this.data && this.data.loading;
    },
    isParentRender() {
      const Tree = findComponentUpward(this, 'Tree');
      return Tree && Tree.render;
    },
    parentRender() {
      const Tree = findComponentUpward(this, 'Tree');
      if (Tree && Tree.render) {
        return Tree.render;
      } else {
        return null;
      }
    },
    node() {
      const Tree = findComponentUpward(this, 'Tree');
      if (Tree) {
        // 将所有的 node（即flatState）和当前 node 都传递
        return [
          Tree.flatState,
          Tree.flatState.find(item => item.nodeKey === this.data.nodeKey)
        ];
      } else {
        return [];
      }
    },
    children() {
      return this.data[this.childrenKey];
    }
  },
  methods: {
    /**
     * @function 替换掉原字符串中所有的子字符串。不使用正则表达式的实现。当遇到特殊字符的时候，不用输入适应正则的转义。
     * @param {string} str         - 原字符串
     * @param {string} substr      - 要被替换的子串
     * @param {string} replacement - 新的子串
     */
    replaceAll(str, substr, replacement) {
      if (!str) {
        return '';
      }
      return str.split(substr).join(replacement);
    },
    handleExpand() {
      const item = this.data;
      if (item.disabled) return;

      // async loading
      if (item[this.childrenKey].length === 0) {
        const tree = findComponentUpward(this, 'Tree');
        if (tree && tree.loadData) {
          this.$set(this.data, 'loading', true);
          tree.loadData(item, children => {
            this.$set(this.data, 'loading', false);
            if (children.length) {
              this.$set(this.data, this.childrenKey, children);
              this.$nextTick(() => this.handleExpand());
            }
          });
          return;
        }
      }

      if (item[this.childrenKey] && item[this.childrenKey].length) {
        this.$set(this.data, 'expand', !this.data.expand);
        this.dispatch('Tree', 'toggle-expand', this.data);
      }
    },
    handleSelect() {
      if (this.data.disabled) return;
      this.dispatch('Tree', 'on-selected', this.data.nodeKey);
    },
    handleCheck() {
      if (this.data.disabled) return;
      const changes = {
        checked: !this.data.checked && !this.data.indeterminate,
        nodeKey: this.data.nodeKey
      };
      this.dispatch('Tree', 'on-check', changes);
    }
  }
};
</script>
