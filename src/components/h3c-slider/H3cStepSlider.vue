<!--
 * @Description: 传入步长的滑块组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-15 11:52:27
 -->
<template>
  <div>
    <div class="slider-input" ref="H3cStepSlider">
      <div class="slider-bar" :style="{width: maxPosition + '%'}"></div>
      <div :style="{left: maxPosition + '%'}" class="slider-button-wrap" @mousedown="onPointerDown($event)">
        <div class="verticalLine"></div>
        <div class="verticalLine"></div>
      </div>
      <div v-for="(item,index) in stops" :style="{ 'left': item + '%' }" class="slider-stop" :key="index"></div>
      <div class="minText">{{min}}</div>
      <div class="maxText">{{max}}</div>
    </div>
    <div class="input-number">
      <i-input-number
              v-model="currentValue"
              :min="min"
              :max="max"
              :step="step"
              @on-change="handleInputChange">
      </i-input-number>
    </div>
  </div>
</template>

<script>
  import {on, off, getStyle} from './assist.js';
  import Emitter from '@/assets/js/emitter.js';

  export default {
    name: 'H3cStepSlider',
    mixins: [Emitter],
    data() {
      let val = this.value,
          max = this.max,
          min = this.min;
      return {
        currentValue: val < min ? min : (val > max ? max : val),
        dragging: false,
        pointerDown: '',
        startX: 0,
        currentX: 0,
        startPos: 0
      }
    },
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 200
      },
      step: {
        type: Number,
        default: () => {
          return 20;
        }
      },
      value: {
        type: Number,
        default: 0
      }
    },
    methods: {
      handleInputChange(val) {
        let min = this.min,
            max = this.max;
        if (val % this.step === 0) {
          this.currentValue = (val < min ? min : (val > max ? max : val));
        } else {
          this.currentValue = Math.floor(val / this.step) * this.step;
        }
        this.emitChange();
      },
      getPointerX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      },
      onPointerDown(event) {
        event.preventDefault();
        this.onPointerDragStart(event);
        on(window, 'mousemove', this.onPointerDrag);
        on(window, 'touchmove', this.onPointerDrag);
        on(window, 'mouseup', this.onPointerDragEnd);
        on(window, 'touchend', this.onPointerDragEnd);
      },
      onPointerDragStart(event) {
        this.dragging = false;
        this.startX = this.getPointerX(event);//位置点距离最左边距离
        this.startPos = (this.maxPosition * this.valueRange / 100) + this.min;//起始位置点具体数值
      },
      onPointerDrag(event) {
        this.dragging = true;
        this.currentX = this.getPointerX(event);
        const min = this.min,
            max = this.max;
        let diffX = this.currentX - this.startX,
            diff = diffX / this.sliderWidth * this.valueRange,//移动过的距离占的数值
            value = this.startPos + diff;

        if (value > max) {
          this.changeButtonPosition(max);
        } else if (value < min) {
          this.changeButtonPosition(min);
        } else if (value % this.step === 0) {//移动了step的整数倍
          this.changeButtonPosition(value);
        } else {//移动距离是step的非整数倍
          this.changeButtonPosition(Math.floor(value / this.step) * this.step);
        }
      },
      onPointerDragEnd() {
        if (this.dragging) {
          this.dragging = false;
          this.emitChange();
        }
        this.pointerDown = '';
        off(window, 'mousemove', this.onPointerDrag);
        off(window, 'touchmove', this.onPointerDrag);
        off(window, 'mouseup', this.onPointerDragEnd);
        off(window, 'touchend', this.onPointerDragEnd);
      },
      emitChange() {
        let value = this.currentValue;
        this.$emit('on-change', value);
        /*this.dispatch('FormItem', 'on-form-change', value);*/
      },
      changeButtonPosition(newPos) {//传入新的位置点数值
        if (this.dragging) {
          this.currentValue = newPos;
        }
      }
    },
    computed: {
      /*获得ref=H3cStepSlider元素的宽度*/
      sliderWidth() {
        return parseInt(getStyle(this.$refs.H3cStepSlider, 'width'), 10);
      },
      //位置百分比
      maxPosition: function () {
        const val = this.currentValue;
        if (val < this.min) {
          return this.min / this.valueRange * 100;
        } else if (val > this.max) {
          return this.max / this.valueRange * 100;
        } else {
          return (val - this.min) / this.valueRange * 100;
        }
      },
      valueRange() {
        return this.max - this.min;
      },
      stops() {
        let stopCount = this.valueRange / this.step;//步数
        let result = [];
        let stepWidth = 100 * this.step / this.valueRange;//每一步占总长百分比
        for (let i = 0; i <= stopCount; i++) {
          result.push(i * stepWidth);
        }
        return result;
      }
    }
  }
</script>
<style lang="less" scoped>
  div {
    box-sizing: border-box;
  }

  .slider-input {
    position: relative;
    width: auto;
    height: 10px;
    margin-right: 100px;
    border: 1px solid #d2d8e1;
    .slider-bar {
      position: absolute;
      height: 10px;
      background: #eaf0fe;
      border: 1px solid #acbdec;
    }
    .slider-button-wrap {
      position: absolute;
      top: -4px;
      left: 60%;
      width: 15px;
      height: 20px;
      cursor: pointer;
      text-align: center;
      transform: translateX(-50%);
      border-radius: 5px;
      background: #9cb1e7;
      .verticalLine {
        position: absolute;
        display: inline-block;
        width: 1px;
        height: 10px;
        background: #000;
        &:nth-child(1) {
          top: 25%;
          left: 30%;
        }
        &:nth-child(2) {
          top: 25%;
          left: 60%;
        }
      }
    }
    .slider-stop {
      position: absolute;
      top: 15px;
      width: 1px;
      height: 4px;
      background-color: #3d3c3c;
      transform: translateX(-50%);
    }
    .minText {
      position: absolute;
      top: 20px;
      left: -4px;
    }
    .maxText {
      position: absolute;
      top: 20px;
      right: 0;
    }
  }

  .input-number {
    position: relative;
    float: right;
    overflow: hidden;
    display: inline-block;
    margin-top: -14px;
    padding: 0;
    width: 80px;
    height: 100%;
    cursor: text;
    color: #495060;
    font-size: 12px;
    transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
    line-height: 32px;
    vertical-align: middle;
    border-radius: 4px;
  }
</style>
