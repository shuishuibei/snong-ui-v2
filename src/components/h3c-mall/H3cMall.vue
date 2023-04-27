<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-25 11:41:42
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-26 14:16:59
 -->
<template functional>
  <div class="mall-Common">
    <div
      class="mall-Common-left"
      :style="{padding:props.padding?props.padding:0}">
      <div class="icon-area">
        <i
          :class="Object.assign({iconfont:true,'iconfont-radius':true},{[props.className]:true})"
          :style="{color:props.styleSet,borderColor:props.styleSet,fontSize:props.fs?props.fs:false}">
        </i>
        <br>
        <span>{{props.title}}</span>
      </div>
    </div>
    <div class="mall-Common-right">
      <slot name="mallContent"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'H3cMall',
  props: {
    /**
     * 图标的class类名
     * 类型: 字符串
     * 必传
     */
    className: {
      type: String,
      required: true
    },
    /**
     * 名称
     * 类型: 字符串
     * 必传
     */
    title: {
      type: String,
      required: true
    },
    /**
     * 图标颜色
     * 类型: 字符串
     * 必传
     */
    styleSet: {
      type: String,
      required: true
    },
    /**
     * 图标样式只支持边距跳转
     * 类型: 字符串
     * 必传
     */
    padding: {
      type: String,
      default: '0'
    },
    /**
     * 图标字体大小
     * 类型: 字符串
     * 必传
     */
    fs: {
      type: String,
      default: '1.5rem'
    }
  }
};
</script>
<style lang="less" scoped>
.mall-Common {
  width: 100%;
  border: 1px solid #ebfbfa;
  box-sizing: border-box;
  margin-top: 14px;
  position: relative;
  min-height: 100px;
  display: flex;
  > .mall-Common-left {
    background-color: #f5f8fd;
    //表示父元素小于120px时，aside不缩小宽度
    //同时父元素大于120px时，aside也不扩大宽度
    flex: 0 0 120px;
    text-align: center;
    position: relative;
    box-sizing: content-box;
    > .icon-area {
      width: 100%;
      font-size: 14px;
      //居中
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -38%);
      .iconfont {
        display: inline;
        font-size: 1.5rem;
        margin-right: 2px;
        &:before {
          font-size: inherit !important;
        }
      }
      span {
        display: inline-block;
        padding: 15px;
      }
    }
  }
  > .mall-Common-right {
    //父元素大于120px时，div占据所有多出的宽度
    flex: 1;
    min-height: 6rem;
    padding: 18px 30px 0 15px;
    position: relative;
    /*width: calc(~"100% - 122px")*/
  }
}

.iconfont-radius {
  &:before {
    padding: 10px 11.5px;
    color: inherit;
    border-radius: 50%;
    border-width: 2px;
    border-style: solid;
    border-color: inherit;
  }
}
</style>
