<!--
 * @Description: 
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-08-30 16:04:34
 -->
<template>
  <div class="loader">
    <i-icon type="ios-loading" :size="40" class="full-icon-load"></i-icon>
    <div>Loading</div>
  </div>
</template>

<style lang="less">

  .ivu-spin-fullscreen {
    &.ivu-spin-fullscreen-wrapper {
      .ivu-spin-fix {
        background-color: rgba(0, 0, 0, .1);
      }
    }
  }

  .full-icon-load {
    animation: ani-full-icon-load 1s linear infinite;
  }

  @keyframes ani-full-icon-load {
    from {
      transform: rotate(0);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
