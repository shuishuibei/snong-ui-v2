<!--
 * @Description: 头部导航
 * @Author: ys0985
 * @Date: 2023-083-04 10:15:09
 * @LastEditors: ys0985
 * @LastEditTime: 2023-083-04 10:15:09
 -->
<template>
  <div class="header-menu-content">
    <el-menu
      :default-active="activeName"
      class="el-menu-demo"
      mode="horizontal"
      @select="routerChange"
      background-color="#2B3245"
      text-color="#fff"
      active-text-color="#3399fe"
    >
      <template v-for="item in menuData">
        <el-submenu
          v-if="item.children"
          :index="item.name"
          :key="item.name"
          popper-class="define-menu-content-modal"
        >
          <template slot="title">
            <i class="iconfont" :class="item.icon"></i>
            {{ item.title }}
          </template>
          <template v-for="item1 in item.children">
            <div v-if="item1.children" :key="item1.name" class="second-menu">
              <i class="iconfont" :class="item1.icon"></i>
              {{ item1.title }}
              <el-menu-item
                :index="item2.name"
                :key="item2.name"
                v-for="item2 in item1.children"
                class="third-menu"
              >
                <span class="point"></span>
                <span>{{ item2.title }}</span></el-menu-item
              >
            </div>
            <el-menu-item :index="item1.name" v-else :key="item1.name">{{
              item1.title
            }}</el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item :index="item.name" v-else :key="item.name">
          <i class="iconfont" :class="item.icon"></i>
          {{item.title}}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      activeName: "",
      menuData: [],
    };
  },
  watch: {
    /**
     * @function 监听路由变化，获取路由并异步更新SideBar
     */
    $route(to, from) {
      this.openNames = this.$route.path.split("/").slice(1);
      this.activeName = this.$route.name.match(/^([A-Za-z0-9-]+)\/?/i)[1];
    },
  },
  computed: {},
  created() {
    this.menuData = this.$store.state.menu.menuData;
    this.activeName = this.$route.name.match(/^([A-Za-z0-9-]+)\/?/i)[1];
  },
  mounted() {
  },
  destroyed() {},
  methods: {
    handleSelect(key, keyPath) {
    },
    routerChange(name) {
      this.$router.push({
        name,
        query: {
          time: +new Date(),
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
// @import "../../../assets/css/theme.less";

.header-menu-content {
  margin-left: 20px;
  position: relative;
  z-index: 20;
  color: #ffffff;
}
</style>
<style lang="less">
.define-menu-content-modal {
  // display: block !important;
  background: #ffff !important;
  max-width: 350px;
  color: #fff;
  & > .el-menu--popup-bottom-start {
    display: flex;
    flex-wrap: wrap;
    .second-menu {
      padding: 10px 10px 10px 15px;
      font-size: 14px;
    }
    .third-menu {
      .point {
        display: inline-block;
        margin-right: 5px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #fff;
        color: #fff;
        margin-left: -6px;
      }
    }
  }
}
</style>
