<template>
  <h3c-error-page
    class="error-403"
    message="很抱歉，您暂时没有权限访问该页面。"
    @on-ok="handleReturn"></h3c-error-page>
</template>

<script>
import H3cErrorPage from '@/components/h3c-error-page/H3cErrorPage.vue';

export default {
  name: 'Error403',
  components: {
    'h3c-error-page': H3cErrorPage
  },
  methods: {
    handleReturn() {
      this.$http.get('user/logout').then(({ data }) => {
        this.$loading.hide();
        if(data.status) {
          /**
           * 此处不能清空用户数据(否则会导致Error in nextTick: "NotFoundError)
           */
          //将用户权限清空
          //this.$store.commit('auth/resetState');
          //将跟菜单相关数据
          //this.$store.commit('menu/resetState');
          //this.$store.state.login.needAskIsLogin = true;
          localStorage.removeItem('userName');
          localStorage.removeItem('userId');
          /* 跳转到登录页面 */
          this.$router.push({
            name: 'login'
          });
        }
      });
      // this.$router.push({
      //   name: 'login'
      // });
    }
  }
};
</script>

<style lang="less" scoped>
.error-403 {
  background: url(../../assets/imgs/error/403-bg.jpg) top center no-repeat;
  background-size: 100% 100%;
}
</style>
