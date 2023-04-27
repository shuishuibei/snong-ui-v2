<template>
  <h3c-error-page
    class="error-404"
    message="很抱歉，您访问的页面不存在，您可能输入了错误的网址。"
    @on-ok="handleReturn"></h3c-error-page>
</template>

<script>
import H3cErrorPage from '@/components/h3c-error-page/H3cErrorPage.vue';

export default {
  name: 'Error404',
  components: {
    'h3c-error-page': H3cErrorPage
  },
  methods: {
    handleReturn() {
      this.$router.push({
        name: 'home'
      });
    }
  }
};
</script>

<style lang="less" scoped>
.error-404 {
  background: url(../../assets/imgs/error/404-bg.jpg) top center no-repeat;
  background-size: 100% 100%;
}
</style>
