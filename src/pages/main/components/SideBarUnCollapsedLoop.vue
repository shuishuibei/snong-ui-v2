<!--
 * @Description: 侧边栏组件（未收缩状态）
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:10
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-26 14:59:01
 -->
<template>
  <div class="side-bar-un-collapsed-loop">
    <template v-for="item in menuData">
      <i-submenu v-if="item.children && item.children.length !== 0" :key="item.name" :name="item.name" :loop-num="loopNum">
        <template slot="title">
          <i class="iconfont" :class="item.icon"></i>
          <span class="menu-title">{{item.title}}</span>
          <span>
            <span class="submenu-icon submenu-icon-collapse">-</span>
            <span class="submenu-icon submenu-icon-expand">+</span>
          </span>
        </template>
        <side-bar-un-collapsed-loop :menu-data="item.children" :open-names="openNames" :loop-num="loopNum + 1"></side-bar-un-collapsed-loop>
      </i-submenu>
      <i-menu-item v-else :name="item.name" :key="item.name">
        <template v-if="item.icon">
          <i class="iconfont" :class="item.icon"></i>
        </template>
        <template v-else>
          <span class="placeholder-box"></span>
        </template>
        <span v-if="loopNum === 3" class="cycle-point"></span>
        <span :class="'menu-title' + '-' + loopNum">{{item.title}}</span>
      </i-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SideBarUnCollapsedLoop',
  props: {
    menuData: {
      type: Array
    },
    openNames: {
      type: Array
    },
    loopNum: {
      type: Number
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/css/theme.less';
@submenuIconSize: 22px;
.ivu-menu {
  /* 默认样式 */
  .menu-title-1 {
    padding-left: 8px;
  }
  .menu-title-3 {
    display: inline-block;
    vertical-align: middle;
  }
  .menu-title {
    display: inline-block;
    vertical-align: middle;
    margin-left: 6px;
  }
  .placeholder-box {
    display: inline-block;
    vertical-align: middle;
    width: @submenuIconSize;
    height: @submenuIconSize;
    margin-right: 6px;
  }
  .cycle-point {
    display: inline-block;
    vertical-align: middle;
    width: 5px;
    height: 5px;
    background: #A2AABF;
    margin-right: 6px;
    border-radius: 50%;
  }
  .submenu-icon {
    display: inline-block;
    width: @submenuIconSize;
    height: @submenuIconSize;
    text-align: center;
    line-height: @submenuIconSize;
    border-radius: 50%;
    position: absolute;
    right: 20px;
    &.submenu-icon-collapse {
      display: none;
    }
    &.submenu-icon-expand {
      display: inline-block;
    }
    &.submenu-icon-one-level-add {
      display: inline-block;
    }
  }
  /* 展开时的样式 */
  .ivu-menu-opened {
    & > .ivu-menu-submenu-title {
      & > span {
        & > .submenu-icon-collapse {
          display: inline-block;
        }
        & > .submenu-icon-expand {
          display: none;
        }
        & > .submenu-icon-one-level-add {
          display: none;
        }
      }
    }
  }
}



.ivu-menu {
  /* 主题样式 */
  &.ivu-menu-dark {
    .submenu-icon {
      background-color: @darkSubmenuIconBgColor;
      &.submenu-icon-expand {
        color: #A3AABC;
      }
      &.submenu-icon-collapse {
        color: #FFFFFF;
      }
    }
  }
}
</style>
