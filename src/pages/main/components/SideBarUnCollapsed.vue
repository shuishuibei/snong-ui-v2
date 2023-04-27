<!--
 * @Description: 侧边栏未收缩状态
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:10
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-26 14:43:02
 -->
<template>
  <i-menu
    accordion
    ref="menu"
    width="auto"
    :theme="theme"
    :active-name="activeName"
    :open-names="openNames"
    @on-select="selectMenu">
    <side-bar-un-collapsed-loop
      :loop-num="loopNum"
      :menu-data="menuData"
      :open-names="openNames"></side-bar-un-collapsed-loop>
  </i-menu>
</template>

<script>
import SideBarUnCollapsedLoop from './SideBarUnCollapsedLoop.vue';
export default {
  name: 'SideBarUnCollapsed',
  components: {
    'side-bar-un-collapsed-loop': SideBarUnCollapsedLoop
  },
  props: {
    openNames: {
      type: Array
    },
    theme: {
      type: String,
      default: 'dark'
    },
    menuData: {
      type: Array
    }
  },
  data() {
    return {
      loopNum: 1, // 循环次数，默认一次
      activeName: ''
    };
  },
  methods: {
    /**
     * @param {string} name: menuData循环时的item中的name，与路由相匹配
     */
    selectMenu(name) {
      this.$emit('on-router-change', name);
    },
    /**
     * @function 使用正则表达式匹配对应的路由并返回对应的数组
     * @return {string}: 路由地址
     */
    getActiveName() {
      this.activeName = this.$route.name.match(/^([A-Za-z0-9-]+)\/?/i)[1];
    },
    /**
     * @function 异步更新菜单状态
     */
    updateStatus() {
      this.$nextTick(() => {
        this.getActiveName();
        this.$refs['menu'].updateOpened();
        this.$refs['menu'].updateActiveName();
      });
    }
  }
};
</script>

<style lang="less">
@import '../../../assets/css/theme.less';
.ivu-menu {
  animation: animation1 0.5s linear;
  /* 在宽度减小的情况下，设置默认不换行 */
  li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* 设置二级、三级菜单与一级菜单对齐 */
  .ivu-menu-submenu {
    .ivu-menu-item {
      padding-left: 24px !important;
    }
  }
  /* 设置二级标题菜单与一级菜单对齐 */
  .ivu-menu-submenu-has-parent-submenu {
    .ivu-menu-submenu-title {
      padding-left: 43px !important;
    }
  }
  /* 隐藏菜单默认Arrow图标 */
  .ivu-menu-submenu-title-icon {
    display: none;
  }
  /* 设置透明背景色 */
  &.ivu-menu-dark {
    background-color: @menuBgDark;
  }
  /* hover时颜色 */
  &.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item {
    &:hover {
      color: #fff;
      background: #3b4560 !important;
    }
  }
  &.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu {
    .ivu-menu-item {
      &:hover {
        background: #3b4560 !important;
      }
    }
  }
  &.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu {
    &:hover {
      & > .ivu-menu-submenu-title {
        color: #fff;
        background: #3b4560;
      }
    }
  }
  /* 展开项背景色 */
  &.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background: #252b3b;
  }
  /* 有子项的标题菜单被选中时的背景色 */
  &.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu {
    &.ivu-menu-opened {
      & > .ivu-menu-submenu-title {
        color: #fff;
        background: #2f374e;
      }
    }
  }
  &.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu {
    .ivu-menu-submenu-has-parent-submenu.ivu-menu-opened {
      .ivu-menu-submenu-title {
        color: #3399fe;
      }
    }
  }
  /* 非标题菜单选中时样式 */
  &.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item {
    &.ivu-menu-item-active.ivu-menu-item-selected {
      border-left-color: #3399fe;
      background: #3b4560 !important;
      color: #3399ff;
    }
  }
  &.ivu-menu-dark.ivu-menu-vertical {
    .ivu-menu-item {
      border-left: 3px solid transparent;
      color: #a3aabc;
    }
    .ivu-menu-submenu {
      .ivu-menu-submenu-title {
        border-left: 3px solid transparent;
        color: #a3aabc;
      }
    }
  }
}
@keyframes animation1 {
  0% {
    width: 0px;
  }

  25% {
    width: 25%;
  }

  50% {
    width: 50%;
  }

  75% {
    width: 75%;
  }

  100% {
    width: 100%;
  }
}
</style>

