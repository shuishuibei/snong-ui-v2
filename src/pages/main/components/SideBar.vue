<!--
 * @Description: 侧边栏
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:10
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-26 14:48:19
 -->
<template>
  <div
    class="side-bar"
    :style="{ display: showLeftSider ? 'block' : 'none' }"
  >
    <i-button
      long
      type="text"
      class="menu-btn"
      :class="['menu-btn' + '-' + theme]"
      @click="menuChange"
    >
      <i
        class="iconfont icon-icon01 collapse-icon"
        :class="{ 'collapse-icon-rotate': isCollapse }"
      ></i>
    </i-button>
    <!-- 展开下的菜单 -->
    <side-bar-un-collapsed
      ref="sideBarUnCollapsed"
      :theme="theme"
      :menu-data="currentMenuData"
      :open-names="openNames"
      @on-router-change="routerChange"
      v-show="!isCollapse"
    ></side-bar-un-collapsed>
    <!-- 折叠下的菜单 -->
    <side-bar-collapse
      :menu-data="currentMenuData"
      @on-router-change="routerChange"
      v-show="isCollapse"
    ></side-bar-collapse>
  </div>
</template>

<script>
import { buildTree } from "@/assets/js/utils";
import SideBarUnCollapsed from "./SideBarUnCollapsed.vue";
import SideBarCollapse from "./SideBarCollapse.vue";
export default {
  name: "SideBar",
  components: {
    "side-bar-un-collapsed": SideBarUnCollapsed,
    "side-bar-collapse": SideBarCollapse,
  },
  props: {
    theme: {
      type: String,
      default: "dark",
    },
  },
  data() {
    return {
      openNames: this.$route.path.split("/").slice(1),
      isCollapse: false,
      menuData: [], // 完整菜单
      currentMenuData: [], // 处理过的单层级菜单
      showLeftSider: true, // 侧边菜单显示
    };
  },
  methods: {
    /**
     * @function 获取SideBar数据
     */
    async getMenuData() {
      await this.$http({
        method: "GET",
        url: "resource/menu/list",
      }).then(({ data }) => {
        this.menuData = buildTree(data.data.menuList, "orderNo", (item) => {
          let obj = {
            name: item.location,
            title: item.title,
          };
          return item.icon ? { ...obj, icon: item.icon } : obj;
        })[0].children;
        this.$store.commit("menu/setMenuData", this.menuData);
        // this.$nextTick(() => {
        //   this.$refs["sideBarUnCollapsed"].updateStatus();
        // });
      });
    },
    /**
     * @function 点击切换按钮，切换SideBar为Collapse或UnCollapse
     */
    menuChange() {
      this.isCollapse = !this.isCollapse;
      this.$emit("on-change", this.isCollapse);
    },
    /**
     * @function 改变路由地址
     * @param {string} name: 路由名称
     */
    routerChange(name) {
      this.$router.push({
        name,
        query: {
          time: +new Date(),
        },
      });
    },
    /**
     * @function 判断当前路由，只有一级不显示侧边栏
     * @param
     */
    judgeSiderShow() {
      if (this.openNames && this.openNames.length === 1) {
        this.showLeftSider = false;
      } else {
        this.showLeftSider = true;
      }
      this.$emit("onlyLevel", this.showLeftSider);
    },
    /**
     * @function 判断当前路由，控制只显示当前一级树形结构
     */
    getCurrentMenuTree() {
      this.currentMenuData = [];
      if (this.openNames && this.openNames.length > 0) {
        this.currentMenuData = this.menuData.filter(
          (arr) => arr.name === this.openNames[0]
        );
      }
      this.$nextTick(() => {
        this.$refs["sideBarUnCollapsed"].updateStatus();
      });
    },
  },
  async created() {
    await this.getMenuData();
    this.judgeSiderShow();
    this.getCurrentMenuTree();
  },
  watch: {
    /**
     * @function 监听路由变化，获取路由并异步更新SideBar
     */
    $route(to, from) {
      this.openNames = this.$route.path.split("/").slice(1);
      this.judgeSiderShow();
      this.$refs["sideBarUnCollapsed"].updateStatus();
      this.getCurrentMenuTree();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../assets/css/theme.less";
.side-bar {
  width: 100%;
  height: 100%;
  .menu-btn {
    height: @collapseBtnHeight;
    line-height: 36px;
    border-radius: 0;
    &:focus {
      box-shadow: 0 0 0 0 #fff;
    }
    span {
      display: inline-block !important;
      text-align: center;
      line-height: normal;
      .collapse-icon {
        display: inline-block;
        width: 34px;
        height: 34px;
        vertical-align: middle;
        transition: transform 300ms linear;
        &::before {
          font-size: 34px;
        }
        &.collapse-icon-rotate {
          transform: rotateZ(-90deg);
        }
      }
    }
  }
  .menu-btn-dark {
    color: #fff;
    background-color: @collapseBtnDark;
  }
}
</style>
