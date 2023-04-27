<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-26 17:08:07
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-22 17:26:14
 -->
<template>
  <div class="cds-fixed-footer">
    <div class="cds-fixed-footer-right">
      <i-button
        type="primary"
        :disabled="disabled"
        @click="$emit('e-ok', true)">
        {{leftTitle}}
      </i-button>
      <i-button
        @click="$emit('e-cancel', false)">
        {{rightTitle}}
      </i-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessFooter',
  props: {
    leftTitle: {
      type: String,
      required: true
    },
    rightTitle: {
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
