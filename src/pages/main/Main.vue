<!--
 * @Description: 整体布局
 * @Author: ys2234
 * @Date: 2019-07-25 11:47:04
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-26 16:23:39
 -->
<template>
  <div class="main">
    <!-- 头部 -->
    <h3c-header>
      <template #header-menu>
        <header-menu></header-menu>
      </template>
      <template #header-function>
        <header-content></header-content>
      </template>
    </h3c-header>
    <!-- 内容 -->
    <div :class="['bottom-container', { 'menu-collapse': isCollapse }]">
      <!-- SideBar -->
      <div class="aside-menu">
        <side-bar
          :theme="theme"
          @on-change="sideBarChange"
          @onlyLevel="checkLevel"
        ></side-bar>
      </div>
      <div
        class="content"
        :style="{
          width: isCollapse
            ? 'calc(100% - 70px)'
            : showLeftSider
            ? 'calc(100% - 240px)'
            : '100%',
          left: isCollapse ? '70px' : showLeftSider ? '240px' : 0,
        }"
      >
        <div class="dynamic-content-container">
          <div class="bread-crumb-container">
            <bread-crumb></bread-crumb>
          </div>
          <div class="dynamic-content">
            <router-view :key="id"></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import H3cHeader from "@/components/h3c-header/H3cHeader.vue";
import HeaderContent from "./components/HeaderContent.vue"; // 引入Header组件
import HeaderMenu from "./components/HeaderMenu.vue"; // 引入HeaderMenu组件
import SideBar from "./components/SideBar.vue"; // 引入SideBar组件
import BreadCrumb from "./components/BreadCrumb.vue"; // 引入Breadcrumb组件
export default {
  name: "Main",
  components: {
    "side-bar": SideBar,
    "bread-crumb": BreadCrumb,
    "h3c-header": H3cHeader,
    "header-content": HeaderContent,
    "header-menu": HeaderMenu,
  },
  data() {
    return {
      id: "",
      isCollapse: false,
      theme: "dark",
      showLeftSider: true, //控制侧边SideBar是否显示
    };
  },
  methods: {
    /**
     * 获取当前SideBar是否Collapse，以便设置样式
     */
    sideBarChange(isCollapse) {
      this.isCollapse = isCollapse;
    },
    /**
     * 判断当前菜单是否是只有一级，控制侧边SideBar是否显示
     */
    checkLevel(val) {
      this.showLeftSider = val;
    },
  },
  watch: {
    $route(to, from) {
      /* 点击相同的导航时，通过更新key值强制刷新组件 */
      if (to.name === from.name) {
        this.id = new Date().toString();
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/css/theme.less";
.main {
  height: 100%;
  width: 100%;
  .bottom-container {
    width: 100%;
    height: calc(~"100% - @{headerHeight}");
    position: absolute;
    .aside-menu {
      width: @menuWidth;
      transition: all 300ms linear;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: @menuBgDark;
    }
    .content {
      width: calc(~"100% - @{menuWidth}");
      height: 100%;
      background-color: #f1f1f1;
      position: absolute;
      left: @menuWidth;
      top: 0;
      transition: all 300ms linear;
      overflow-x: auto;
    }
    &.menu-collapse {
      .aside-menu {
        width: @menuMiniWidth;
      }
      .content {
        left: @menuMiniWidth;
        width: calc(~"100% - @{menuMiniWidth}");
      }
    }
  }
}

.content {
  .dynamic-content-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    .bread-crumb-container {
      height: @breadCrumbHeight;
      line-height: @breadCrumbHeight;
      padding: 0 10px 0 14px;
      border: 1px solid #d8e0eb;
      margin: @contentPadding;
      background-color: #fff;
    }
    .dynamic-content {
      width: calc(~"100% - 2 * @{contentPadding}");
      height: calc(~"100% - 3 * @{contentPadding} - @{breadCrumbHeight}");
      margin: @contentPadding;
      margin-top: 0;
      position: absolute;
      overflow: auto;
    }
  }
}
</style>
