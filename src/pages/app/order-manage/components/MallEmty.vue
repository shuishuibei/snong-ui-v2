<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-10-30 09:34:17
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-30 10:32:58
 -->
<template>
  <div class="mall-emty-wrap">
    <span class="mall-emty-title">暂无数据</span>
    <p
      v-if="isTitle"
      class="mall-emty-info">
      立即前往<span class="mall-emty-active" @click="$emit('e-click')">云资源</span>申请资源
    </p>
  </div>
</template>

<script>
export default {
  name: 'MallEmtyWrap',
  props: {
    isTitle: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less" scoped>
.mall-emty-wrap {
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-70%);
  width: 324px;
  height: 212px;
  background: url('../../../../assets/imgs/cloud-mall/null-img.png') center/100% 100% no-repeat;
  .mall-emty-title {
    position: absolute;
    right: 52px;
    bottom: -36%;
    font-size: 30px;
  }
  .mall-emty-info {
    position: absolute;
    right: 20px;
    bottom: -55%;
    letter-spacing: 1px;
    text-align: center;
    font-size: 16px;
    .mall-emty-active {
      cursor: pointer;
      color: #39f;
    }
  }
}
</style>
