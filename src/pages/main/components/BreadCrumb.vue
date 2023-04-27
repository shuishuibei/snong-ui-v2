<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-08-28 17:40:26
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-10 16:49:10
 -->
<template>
  <div class="bread-crumb">
    <div class="bread-crumbs">
      <i-breadcrumb>
        <i-breadcrumb-item
          v-for="(item, index) of breadcrumbs"
          :key="index"
          :to="item.to ? {...$route.matched[index], ...{query: {time: new Date().getTime()}}} : null">
          {{item.title}}
        </i-breadcrumb-item>
      </i-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  methods: {
    /**
     * @function 通过路由匹配的name值，查找菜单数据中与之对应的title
     * @param {Array} menuData     - SideBar数据
     * @param {Array} routeRecords - 路由记录
     * @param {number} matchedIndex - 已匹配的路由记录的位置
     * @param {Array} matchedTitle - 匹配到的标题
     */
    findTitle(menuData, routeRecords, matchedIndex, matchedTitle) {
      outerloop: for (let routeRecordsItem of routeRecords) {
        for (let menuDataItem of Array.from(menuData)) {
          if (routeRecordsItem.name === menuDataItem.name) {
            matchedTitle.push({
              title: menuDataItem.title
            });
            if (menuDataItem.children && matchedIndex < routeRecords.length) {
              this.findTitle(menuDataItem.children, routeRecords, matchedIndex + 1, matchedTitle);
            }
            break outerloop;
          }
        }
      }
    }
  },
  computed: {
    breadcrumbs() {
      let menuData = this.$store.state.menu.menuData; // 获取SideBar数据
      let routeRecords = this.$route.matched; // 获取路由记录
      let matchedTitle = []; // 设置已匹配的标题
      this.findTitle(menuData, routeRecords, 0, matchedTitle);
      /* 设置matchedTitle最后一项链接 */
      matchedTitle[matchedTitle.length - 1].to = true;
      /* 该方法是将面包屑的内容保存在路由中(此种方法不推荐,router和后端数据要统一维护) */
      this.$route.matched.forEach(item => {
        if (item.meta.breadcrumb) {
          if (item.meta.breadcrumb === true) {
            matchedTitle.push({
              title: this.$route.params.id,
              to: true
            });
          } else {
            matchedTitle.push({
              title: item.meta.breadcrumb,
              to: true
            });
          }
        }
      });
      matchedTitle[matchedTitle.length - 1].to = null;
      matchedTitle.length > 2 ? (matchedTitle[0].to = null) : null;
      return matchedTitle;
    }
  }
};
</script>
