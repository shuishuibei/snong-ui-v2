<!--
 * @Description: 传入数组的滑块组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-15 11:58:40
 -->
<template>
  <div class="main">
    <div class="slider-input" ref="H3cArraySlider">
      <!--滑块进度条中被覆盖的长度条-->
      <div class="slider-bar"
           :style="{width: maxPosition*100 + '%',background:disabled?'#f3f3f3':sliderBarStyle.backgroundColor, cursor:disabled?'not-allowed':'default', 'border-color':disabled?'#f3f3f3':'#3399ff'}">
      </div>
      <!--可移动滑块-->
      <div class="slider-button-wrap"
           :style="Object.assign({left: maxPosition*100 + '%',cursor:disabled?'not-allowed':'pointer'},sliderButtonStyle,{background:disabled?'#f3f3f3':sliderButtonStyle.backgroundColor})"
           @mouseover="onPointerOver"
           @mouseleave="onPointerLeave"
           @mousedown="disabled?()=>{}:onPointerDown($event)">
        <!--滑块里面两根竖线-->
        <div class="verticalLine" :style="verticalLineStyle"></div>
        <div class="verticalLine" :style="verticalLineStyle"></div>
        <!--滑块上方的提示信息-->
        <div class="slider-tooltip-top" v-if="tooltipFlag">
          <span class="slider-tooltip" :style="{backgroundColor: sliderTooltipColor, borderColor: sliderTooltipColor}">{{this.currentValue}}</span>
        </div>
      </div>
      <!--分割线，按照传入的数组划分-->
      <div v-for="(item, index) in stops" :style="{ 'left': item.disPercent + '%' }" class="slider-stop"
           :key="'slider'+index">
        <!--第一个和最后一个数据默认在滑块首位两端显示，其他数据不显示-->
        <span class="scale">{{(index === 0 || index === stops.length-1) ? item.value : ''}}</span>
      </div>
    </div>
    <!--隐藏输入框,缓存数据-->
    <input type="hidden" :name="name" :value="exportValue">
    <!--iview数字输入框-->
    <div class="input-number">
      <i-input-number
              :step="0.01"
              v-model="currentValue"
              :min="extremumArr[0]"
              :max="extremumArr[1]"
              :formatter="formatter"
              @on-change="handleInputChange"
              :disabled="disabled">
      </i-input-number>
    </div>
  </div>
</template>

<script>
  import {on, off, getStyle} from './assist.js';
  import Emitter from '@/assets/js/emitter.js';

  export default {
    name: 'H3cArraySlider',
    mixins: [Emitter],
    data() {
      /*InputNumber中需要使用props中的value,但子组件中不能修改props中的值,因此需要通过中间变量赋值*/
      let val = this.value;
      return {
        currentValue: val,// currentValue的初始值是父组件传入的, 但是在使用时会动态修改, 需要监视它的改变
        tooltipFlag: false,// 是否显示数据提示，鼠标放在滑块上时显示，否则隐藏
        dragging: false,
        pointerDown: '',
        startX: 0,// 鼠标刚按下滑块时的位置（横向）
        currentX: 0,
        startPos: 0
      }
    },
    props: {
      name: {type: String},
      /*使用时v-model绑定值*/
      value: {
        type: Number,
        default: 0
      },
      /*滑块上可选值数组*/
      data: {
        type: Array,
        default: () => {
          return [];
        }
      },
      /*滑块上数字提示框的背景和边框颜色*/
      sliderTooltipColor: {
        type: String,
        default: '#78ceff'
      },
      /*滑块里面两条竖线的样式*/
      verticalLineStyle: {
        type: Object,
        default: () => {
          return {};
        }
      },
      sliderBarStyle: {
        type: Object,
        default: () => {
          return {
            backgroundColor: '#D8EFFD'
          };
        }
      },
      /*可移动滑块的样式*/
      sliderButtonStyle: {
        type: Object,
        default: () => {
          return {};
        }
      },

      /*数字输入框是否可修改*/
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /*根据位置百分比来获取最接近的值*/
      getValueFromPositon(position, arr) {
        let length = arr.length,
            index = length * position,
            num = Math.floor(index);
        if (position === 1) {
          return arr[length - 1]
        } else {
          return arr[num];
        }
      },
      /*对父组件传入数组data进行去重*/
      noRepeatArray(array) {
        let arr = [];
        if (array === undefined || array === null) return arr;
        array.forEach((item) => {
          if (!arr.includes(item)) {
            arr.push(item);
          }
        });
        return arr
      },
      /*根据数值来获取位置百分比*/
      getIndexFromValue(value, arr) {
        let target = this.getNearestVal(value, arr),
            index = arr.indexOf(target);
        return index / (arr.length - 1);
      },
      /*获取val值在数组中最接近的值,*/
      getNearestVal(val, array) {
        if (array.includes(val)) return val;// 若存在数组中，则返回它本身
        if (array === null || array === undefined || array.length === 0) return null;
        /*若给定的值在数组中不存在，则在数组中找出与它最接近的值*/
        let disArr = [],
            index = 0;
        for (let i = 0; i < array.length; i++) {
          let distance = Math.abs(array[i] - val);
          disArr.push(distance);
        }
        let min = disArr[0];
        /*筛选出绝对值最小的,并获得它的index*/
        for (let j = 0; j < disArr.length; j++) {
          if (min > disArr[j]) {
            min = disArr[j];
            index = j;
          }
        }
        return array[index];
      },
      getPointerX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      },
      onPointerDown(event) {
        event.preventDefault();
        this.onPointerDragStart(event);
        on(window, 'mousemove', this.onPointerDrag);
        on(window, 'mouseup', this.onPointerDragEnd);
        on(window, 'touchmove', this.onPointerDrag);
        on(window, 'touchend', this.onPointerDragEnd);
      },
      /*记录下鼠标按下时组件可移动按钮的位置和代表数据*/
      onPointerDragStart(event) {
        this.dragging = false;
        this.startX = this.getPointerX(event);//位置点距离最左边距离
        this.startPos = this.getValueFromPositon(this.maxPosition, this.pureArray);//位置点代表的数值
      },
      onPointerOver() {
        this.tooltipFlag = true;
      },
      onPointerLeave() {
        this.tooltipFlag = false;
      },
      /*记录下鼠标移动过程中组件可移动按钮的位置和代表数据*/
      onPointerDrag(event) {
        this.tooltipFlag = true;
        this.dragging = true;
        this.currentX = this.getPointerX(event);// 当前鼠标物理位置
        let indexDistance = 0,
            noRepeatArr = this.pureArray,
            length = noRepeatArr.length,
            diffX = this.currentX - this.startX,// 当前鼠标物理位置距离鼠标按下时刻的位置
            diff = (diffX / this.sliderWidth) * length;// 移动之后的位置距离鼠标按下去位置相距多少个刻度,可能为小数
        indexDistance = Math.floor(diff);
        let startIndex = noRepeatArr.indexOf(this.startPos),// 鼠标按下位置在data中的index
            endIndex = startIndex + indexDistance,// 鼠标移动后位置在data中的index
            value = noRepeatArr[endIndex];
        if (endIndex >= length - 1 && indexDistance >= 0) {// 已经拉到最右侧
          value = noRepeatArr[length - 1];
          this.changeButtonPosition(value);
        } else {
          let newPositionVal = this.getNearestVal(value, noRepeatArr);
          this.changeButtonPosition(newPositionVal);
        }
      },
      onPointerDragEnd() {
        this.tooltipFlag = false;
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
        this.dispatch('FormItem', 'on-form-change', value);
      },
      changeButtonPosition(newPos) {// 传入新的位置点数值
        if (this.dragging) {
          this.currentValue = newPos;
        }
      },
      handleInputChange(val) {
        let nearestVal = 0,
            data = this.pureArray,
            length = data.length;
        if (data.includes(val)) {
          this.currentValue = val;
        } else {
          nearestVal = this.getNearestVal(val, data);
          let index = data.indexOf(nearestVal);
          if (val < nearestVal) {//减小
            if (index > 0) {
              this.currentValue = data[index - 1];
            } else {
              this.currentValue = data[0];
            }
          } else {// 增大
            /*已经最大*/
            if (index < length - 1) {
              this.currentValue = data[index + 1];
            } else {
              this.currentValue = data[length - 1];
            }
          }
        }
        this.$nextTick(() => {
          this.emitChange();
        });
      },
      /*数字输入框展示值的格式*/
      formatter(val) {
        let nearestVal = 0,
            data = this.pureArray,
            length = data.length;
        if (data.includes(val)) {
          this.currentValue = val;
          return val;
        } else {
          nearestVal = this.getNearestVal(val, data);
          let index = data.indexOf(nearestVal);
          if (val < nearestVal) {//减小
            if (index > 0) {
              this.currentValue = data[index - 1];
              return data[index - 1];
            } else {
              this.currentValue = data[0];
              return data[0];
            }
          } else {// 增大
            /*已经最大*/
            if (index < length - 1) {
              this.currentValue = data[index + 1];
              return data[index + 1];
            } else {
              this.currentValue = data[length - 1];
              return data[length - 1];
            }
          }
        }
      }
    },
    watch: {
      /*滑块改动后，将值传回父组件*/
      exportValue(value) {
        this.$emit('input', value);
        this.$emit('on-input', value);
      },
      /*监视父组件传入的value值，一旦改变立刻赋值给currentValue*/
      value(val) {
        this.currentValue = val;
      }
    },
    computed: {
      /*对父组件传入的数组进行去重，排序(从大到小)*/
      pureArray() {
        if (this.data === undefined || this.data === null) {
          return [];
        }
        let arr = this.noRepeatArray(this.data);
        return arr.sort((a, b) => {
          return a - b;
        });
      },
      /*exportValue即为currentValue的监视值*/
      exportValue() {
        return this.currentValue;
      },
      /*获得ref=H3cArraySlider元素的宽度*/
      sliderWidth() {
        return parseInt(getStyle(this.$refs.H3cArraySlider, 'width'), 10);
      },
      /*根据数值得到位置百分比*/
      maxPosition() {
        let val = this.currentValue;
        return this.getIndexFromValue(val, this.pureArray);
      },
      /*获取父组件传入数组中最大值*/
      extremumArr() {
        let sortArr = this.pureArray;
        let length = sortArr.length;
        if(length > 1){
          return [sortArr[0], sortArr[length - 1]];
        }else if(length === 1){
          return [sortArr[0], sortArr[0]];
        }else {
          return [0, 0];
        }
      },
      /*获得分割线数组*/
      stops() {
        let result = [],
            stopCount = this.pureArray.length;// 步数
        if (stopCount === 0) return result;
        if (stopCount === 1) {
          return {
            disPercent: 100,
            value: this.pureArray[0]
          }
        }
        let stepWidth = 100 / (stopCount - 1);// 每一步占总长百分比
        for (let i = 0; i <= stopCount - 1; i++) {
          let obj = {};
          obj.disPercent = i * stepWidth;
          obj.value = this.pureArray[i];
          result.push(obj);
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

  .main {
    display: inline-block;
    line-height: normal;

    .slider-input {
      position: relative;
      width: auto;
      height: 20px;
      margin-right: 100px;
      border: 1px solid #d2d8e1;

      .slider-bar {
        position: absolute;
        height: 20px;
        border: 1px solid #3399ff;
        background: #d8f0fe;
      }

      .slider-button-wrap {
        position: absolute;
        top: -5px;
        left: 60%;
        width: 16px;
        height: 31px;
        cursor: pointer;
        text-align: center;
        border-radius: 3px;
        transform: translateX(-50%);
        background-color: #d8f0fe;

        .verticalLine {
          position: absolute;
          display: inline-block;
          width: 1px;
          height: 15px;
          background-color: #408286;

          &:nth-child(1) {
            top: 25%;
            left: 30%;
          }

          &:nth-child(2) {
            top: 25%;
            left: 60%;
          }
        }

        .slider-tooltip-top {
          position: absolute;
          top: -6px;
          left: 50%;
          z-index: 10;
          transform: translate(-50%, -100%);

          .slider-tooltip {
            display: block;
            padding: 2px 5px;
            min-width: 20px;
            color: #fff;
            font-size: 0.75rem;
            text-align: center;
            white-space: nowrap;
            border-radius: 5px;
            border-color: #78ceff;
            background-color: #78ceff;

            &:after {
              content: '';
              position: absolute;
              left: 50%;
              bottom: -10px;
              width: 0;
              height: 0;
              border: 5px solid transparent;
              border-top-color: inherit;
              transform: translate(-50%, 0);
            }
          }
        }
      }

      .slider-stop {
        position: absolute;
        top: 27px;
        width: 1px;
        height: 5px;
        background-color: #3d3c3c;
        transform: translateX(-50%);

        .scale {
          display: block;
          position: absolute;
          top: 15px;
          left: -6px;
        }
      }
    }
    .input-number {
      position: relative;
      display: inline-block;
      overflow: hidden;
      float: right;
      width: 80px;
      height: 100%;
      margin-top: -22px;
      padding: 0;
      color: #495060;
      cursor: text;
      font-size: 12px;
      line-height: 32px;
      vertical-align: middle;
      transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
      border-radius: 4px;
    }
  }


</style>
