<!--
 * @Description: 进度条组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:35
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-14 10:30:55
 -->
<template>
    <div class="custom-progress-container">
        <div id="progress-container">
            <div class="unit-block" v-for="(item,index) in num" :key="index"></div>
        </div>
        <div class="circle-container">
            <i-circle :percent="previousPercent" :size="60">
                <span style="font-size:12px">{{previousPercent + '%'}}</span>
            </i-circle>
        </div>
    </div>
</template>

<script>
    import {on, off} from '../dom.js';
    export default {
        name: 'CustomProgress',
        props: {
            percent: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                dom: null,
                timer: false,
                width: 0,
                height: 0,
                num: 0,
                previousPercent: 0,
                currentPercent: 0,
                timer1: null,
                timer2: null,
                param1: 2,
                param2: 5+2
            }
        },
        mounted() {
            this.init();
        },
        beforeDestroy() {
            off(window, 'resize', this.handleResize);
        },
        watch: {
            /* 页面从最大化切换到普通时，进度条的width不是一步到位的，而是渐变的*/
            /* 如果没有watch width，unit-block个数会超过实际的长度导致换行展示 */
            /* 需要监听width，在width渐变时不断的去重新计算unit-block的个数，直至width不再变化 */
            width(val){
                if(!this.timer){
                    this.width = val;
                    this.timer = true;
                    let _this = this;
                    setTimeout(()=>{
                        _this.handleResize();
                        _this.timer = false;
                    },0);
                }
            }
        },
        methods: {
            init() {
                this.dom = document.getElementById('progress-container');
                this.width = this.dom.offsetWidth;
                this.height = this.dom.offsetHeight;
                this.num = Math.floor((this.width - this.param1) * this.percent / 100 / this.param2);
                on(window, 'resize', this.handleResize);
            },
            handleResize(){
                this.width = this.dom.offsetWidth;
                this.height = this.dom.offsetHeight;
                this.num = Math.floor((this.width - this.param1) * this.currentPercent / 100 / this.param2);
            },
            stopInterval(){
                if (this.timer1 !== null) clearInterval(this.timer1);
                // if (this.timer2 !== null) clearInterval(this.timer2);
            },
            /*开启进度条
            * 参数：
            * percent: 初始化时进度值
            * end: 结束时进度值
            * */
            initProgress(percent,end){
                this.previousPercent = 0;
                // this.autoGrow(percent,end);
            },
            /*没有指定值，缓慢动画*/
            autoGrow(percent,end) {
                this.currentPercent = percent;
                this.stopInterval();
                this.timer2 = setInterval(() => {
                    this.previousPercent++;
                    if(this.previousPercent >= end){
                        this.stopInterval();
                    }
                    this.num = Math.floor((this.width - this.param1) * this.previousPercent / 100 / this.param2);
                }, 800);
            },
            /*有指定值，快速动画*/
            changeNum(percent) {
                this.currentPercent = percent;
                this.stopInterval();
                let flag = this.currentPercent - this.previousPercent + 1;
                this.timer1 = setInterval(() => {
                    flag--;
                    if(percent === 100 && flag <= 0){
                        clearInterval(this.timer1);
                    }else if(percent !== 100 && flag <= 0){
                        // this.autoGrow();
                    }else {
                        this.previousPercent++;
                        this.num = Math.floor((this.width - this.param1) * this.previousPercent / 100 / this.param2);
                    }
                }, 10);
            }
        }
    }
</script>

<style lang="less" scoped>

    @height: 24px;
    @padding: 1px;
    @unit-width: 5px;
    .custom-progress-container {
        display: flex;
        align-items: center;
        width: 100%;
        height: auto;
        text-align: center;
        #progress-container {
            flex-grow: 1;
            height: @height;
            border: 1px solid #eceff2;
            border-radius: 3px;
            padding: @padding;
            &:after {
                content: '';
                display: block;
                clear: both;
            }
            .unit-block {
                float: left;
                margin: 0 1px;
                width: @unit-width;
                height: @height - @padding * 2;
                background-color: #00cc67;
                border-radius: 4px;
            }
        }
        .circle-container {
            width: 100px;
            height: 60px;
        }
    }
</style>