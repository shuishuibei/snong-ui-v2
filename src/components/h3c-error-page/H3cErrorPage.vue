<!--@auther xys2234 on 2019.08.26-->
<!--@change xys2234 on 2019.08.26-->
<template>
  <div class="h3c-error-page">
    <div class="error-content">
      <div class="error-msg">{{ message }}</div>
      <div class="error-btn" @click="returnHome">返回首页</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'H3cErrorPage',
    props: {
      message: {
        type: String,
        default: '错误信息提示'
      }
    },
    methods: {
      returnHome() {
        this.$emit('on-ok')
      }
    }
  }
</script>

<style lang="less" scoped>
  .h3c-error-page {
    height: 100%;
    width: 100%;
    .error-content {
      position: relative;
      top: 50%;
      text-align: center;
      .error-msg {
        color: #cac8c8;
        font-size: 16px;
      }
      .error-btn {
        position: relative;
        display: inline-block;
        width: 120px;
        height: 35px;
        margin-top: 30px;
        font-size: 16px;
        line-height: 35px;
        color: #fff;
        border-radius: 3px;
        background-color: #ff6a5b;
        cursor: pointer;
      }
    }
  }
</style>