<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-26 09:47:00
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-24 15:54:57
 -->
<template>
  <h3
    class="h3c-title h3c-scroll-title"
    :style="style">
    {{title}}
    <slot name="other"></slot>
  </h3>
</template>
<script>
export default {
  name: 'H3cTitle',
  props: {
    /**
     * 标题的文字
     * 类型: 字符串
     * 必传
     */
    title: {
      type: String,
      required: true
    },
    /**
     * 标题盒子的样式
     * 类型: 对象
     * 非必传
     */
    styleSet: {
      type: Object,
      default: () => ({})
    },
    /**
     * 是否是modal框
     * 类型：布尔值
     * 非必传
     */
    isBorderBottom: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    style() {
      let isBorderBottom = !this.isBorderBottom ?
        { 'line-height': '16px', 'border-bottom': 'none' } :
        {};
      return { ...isBorderBottom, ...this.styleSet };
    }
  }
};
</script>
<style lang="less" scoped>
.h3c-title {
  position: relative;
  width: 100%;
  padding: 14px 0 14px 10px;
  line-height: 15px;
  height: 43px;
  box-sizing: border-box;
  border-bottom: 1px solid #d5d8db;
  background: #fff;
  &:before {
    position: absolute;
    background-color: #ff0042;
    content: '';
    width: 3px;
    height: 15px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
