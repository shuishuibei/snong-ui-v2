<!--
 * @Description: 首页概览页面
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-15 11:48:52
 -->
<template>
  <div style="width:100%;height:100%">
    <manager-page v-if="auths.includes('manager-page')"></manager-page>
    <ordinary-page v-if="auths.includes('ordinary-page')"></ordinary-page>
  </div>
</template>
<script>
  import ManagerPage from './components/ManagerPage.vue';
  import OrdinaryPage from './components/OrdinaryPage.vue';

  export default {
    components: {
      'manager-page': ManagerPage,
      'ordinary-page': OrdinaryPage
    },
    data() {
      return {
        time: new Date().getTime()
      }
    },
    computed: {
      auths() {
        return this.$store.state.auth.auths
      }
    }
  }
</script>


