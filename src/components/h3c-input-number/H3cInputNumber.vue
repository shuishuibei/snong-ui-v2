<!--
 * @Description: InputNumber组件（只可输入数字）
 * @Author: ys2234
 * @Date: 2019-10-26 14:24:42
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 11:48:24
 -->
<template>
  <i-input
    ref="i-input"
    :class="className"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :clearable="clearable"
    :style="styles"
    @on-keypress="keyPress"
    @on-keydown="keyDown"
    v-model="currentValue" />
</template>

<script>
import EventUtil from '@/assets/js/event-util.js';
export default {
  props: {
    className: {
      type: String
    },
    maxlength: {
      type: Number
    },
    placeholder: {
      type: String
    },
    clearable: {
      type: Boolean
    },
    styles: {
      type: [String, Object]
    },
    value: {
      type: String
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  methods: {
    /**
     * @function 过滤键盘输入内容，使其只可输入数字
     */
    keyPress(event) {
      let charCode = EventUtil.getCharCode(event);
      if ((!/\d/.test(String.fromCharCode(charCode)) && charCode > 9 && !event.ctrlKey) || event.code === 'Space' || event.code === 'Shift'){
        EventUtil.preventDefault(event);
      }
    },
    /**
     * @function 过滤Ctrl+V
     */
    keyDown(event) {
      if(event.ctrlKey && event.code === 'KeyV') {
        EventUtil.preventDefault(event);
      }
    },
    /**
     * @function 过滤中文输入法下输入中文和英文
     */
    onInput(event) {
      let target = EventUtil.getTarget(event);
      this.currentValue = target.value = target.value.replace(/[\u0391-\uFFE5A-Za-z]/gi, '');
    },
    /**
     * @function 禁止鼠标右键粘贴
     */
    onCopy(event) {
      return false;
    }
  },
  mounted() {
    EventUtil.addHandler(this.$refs['i-input'].$refs['input'], 'input', this.onInput);
  },
  watch: {
    value: function(newVal) {
      this.currentValue = newVal;
    },
    currentValue: function(newVal) {
      this.$emit('input', newVal);
    }
  }
}
</script>

<style>

</style>