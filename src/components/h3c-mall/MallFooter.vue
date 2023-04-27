<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-26 17:08:07
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:06:22
 -->
<template>
  <div class="cds-fixed-footer">
    <div class="cds-fixed-footer-left">
      <slot name="right"></slot>
    </div>
    <div class="cds-fixed-footer-right">
      <!-- 加入申请清单按钮 -->
      <i-button
        type="primary"
        :disabled="disabled"
        @click="handlerSubmit">
        {{submitTitle}}
      </i-button>
      <slot name="cancel">
        <i-button @click="handlerCancel">
          取消
        </i-button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MallFooter',
  props: {
    handlerSubmit: {
      type: Function,
      required: true
    },
    handlerCancel: {
      type: Function,
      required: true
    },
    submitTitle: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>
