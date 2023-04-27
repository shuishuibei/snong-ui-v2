<template>
  <h3c-error-page
    class="error-400"
    message="很抱歉，由于语法格式有误，服务器无法理解此请求。"
    @on-ok="handleReturn"></h3c-error-page>
</template>

<script>
import H3cErrorPage from '@/components/h3c-error-page/H3cErrorPage.vue';

export default {
  name: 'Error400',
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
.error-400 {
  background: url(../../assets/imgs/error/400-bg.jpg) top center no-repeat;
  background-size: 100% 100%;
}
</style>
