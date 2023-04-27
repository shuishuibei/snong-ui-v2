<template>
  <h3c-error-page
    class="error-401"
    message="很抱歉，由于凭证无效，访问被拒绝，请输入有效的用户名和密码。"
    @on-ok="handleReturn"></h3c-error-page>
</template>

<script>
import H3cErrorPage from '@/components/h3c-error-page/H3cErrorPage.vue';

export default {
  name: 'Error401',
  components: {
    'h3c-error-page': H3cErrorPage
  },
  methods: {
    handleReturn() {
      this.$router.push({
        name: 'login'
      });
    }
  }
};
</script>

<style lang="less" scoped>
.error-401 {
  background: url(../../assets/imgs/error/401-bg.jpg) top center no-repeat;
  background-size: 100% 100%;
}
</style>
