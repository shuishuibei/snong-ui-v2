<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-10-18 09:39:50
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-26 14:19:58
 -->
<template>
  <div
    class="cloud-resource-selected-config"
    @click="$emit('e-open')">
    <i class="iconfont icon-peizhi"></i>
    <span class="traget-message">已选配置</span>
  </div>
</template>

<script>
export default {
  name: 'CloudResourceSelectedConfig'
};
</script>

<style lang="less" scoped>
.cloud-resource-selected-config {
  position: fixed;
  right: 34px;
  top: 220px;
  width: 48px;
  height: 120px;
  padding: 12px;
  box-sizing: border-box;
  background: #3399fe;
  z-index: 999;
  text-align: center;
  font-size: 0;
  cursor: pointer;
  box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  &:hover {
    color: #fff;
    background: #5cadff;
    text-decoration: none;
  }
  .icon-peizhi {
    display: inline-block;
    margin-top: -4px;
    &::before {
      color: #fff;
      font-size: 22px;
    }
  }
  .traget-message {
    display: inline-block;
    line-height: 1.2;
    color: #fff;
    font-size: 14px;
  }
}
</style>
