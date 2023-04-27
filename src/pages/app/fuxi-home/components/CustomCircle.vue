<!--
 * @Description: 首页自定义圆形波浪组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-18 11:33:44
 -->
<template>
    <div :style="circleSize" class="wrap-classes">
        <svg viewBox="0 0 100 100" class="svg">
            <!--背景灰环-->
            <path :d="pathString" :stroke="trailColor" :stroke-width="trailWidth" :fill-opacity="0"/>
            <!--上层进度环-->
            <path :d="pathString" :stroke-linecap="strokeLinecap" :stroke="circleColor" :stroke-width="strokeWidth"
                  fill-opacity="0" :style="pathStyle"/>
            <!--小环-->
            <path :d="smallCirclePathString" :stroke="circleColor" :stroke-width="smallCircleRadius" :fill-opacity="0"/>
            <circle :cx="circlePosition[0]" :cy="circlePosition[1]" r="2.5" fill="white"></circle>
        </svg>
        <div class="inner-classes">
            <div class="fensug">
                <div class="wavenum"><b id="denfenjs">{{percent}}%</b></div>
                <div class="waven">
                    <!--<div id="wave-canvas" class="wave"
                         :style="{height: percent +12+ '%', backgroundImage: 'url('+ imgUrl+ ')'}">&nbsp;
                    </div>-->
                    <canvas :id="canvasId" class="wave"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const oneOf = function (value, validList) {
        for (let i = 0; i < validList.length; i++) {
            if (value === validList[i]) {
                return true;
            }
        }
        return false;
    };
    export default {
        name: 'CustomCircle',
        data() {
            return {
                canvasId: '',
                imgUrl: '',
                strokeColor: '',
                trailColor: '#eaeef2',
                centerX: 50,
                centerY: 50,
                smallCircleRadius: 3,
                circlePosition: []
            }
        },
        props: {
            percent: {
                type: [Number,String],
                default: 0
            },
            size: {
                type: Number,
                default: 120
            },
            color: {
                /*validator(value) {
                    return oneOf(value, ['yellow', 'green', 'blue']);
                },*/
                type: String,
                default: '#cde3fa'
            },
            circleColor: {
                type: String,
                default: '#3298fd'
            },
            strokeWidth: {
                type: Number,
                default: 5
            },
            strokeLinecap: {
                validator(value) {
                    return oneOf(value, ['square', 'round']);
                },
                default: 'round'
            },
            trailWidth: {
                type: Number,
                default: 4
            }
        },
        methods: {
            drawWave(id) {
                let canvas = document.getElementById(id),
                    ctx = canvas.getContext('2d');
                let mH = canvas.height = 305;
                let sX = 0,
                    axisLength = 408, //轴长
                    waveWidth = 0.12,  //波浪宽度,数越小越宽
                    waveHeight = 20, //波浪高度,数越大越高
                    xOffset = Math.random() * 120, //波浪x偏移量
                    nowRange = Number(this.percent);
                ctx.save();
                let points = [];  //用于存放绘制Sin曲线的点
                ctx.beginPath();
                //在整个轴长上取点
                for (let x = sX; x < sX + axisLength; x += 20 / axisLength) {
                    //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
                    /*即-Math.sin((sX + x) * waveWidth - xOffset) * 0.8 + 0.1;*/
                    let y = Math.sin((-sX - x) * waveWidth + xOffset) * 0.8 + 0.1;
                    let dY = mH * (1 - nowRange / 100);
                    points.push([x, dY + y * waveHeight]);
                    ctx.lineTo(x, dY + y * waveHeight);
                }
                //封闭路径
                ctx.lineTo(axisLength, mH);
                ctx.lineTo(sX, mH);
                ctx.lineTo(points[0][0], points[0][1]);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            },
            oneOf(value, validList) {
                for (let i = 0; i < validList.length; i++) {
                    if (value === validList[i]) {
                        return true;
                    }
                }
                return false;
            },
            /*
            * percent: 进度值
            * */
            getSmallCirclePosition(percent, x0, y0, r) {
                let angle = 90 - 360 * (percent) / 100;
                let x = x0 + r * Math.cos(angle * Math.PI / 180);
                let y = y0 - r * Math.sin(angle * Math.PI / 180);
                return [x, y];
            }
        },
       /* mounted() {
            this.canvasId = Math.random() + 'wave';
            this.$nextTick(() => {
                this.drawWave(this.canvasId);
            });
        },*/
        watch: {
            percent: {
                immediate: true,
                handler(val){
                    this.circlePosition = this.getSmallCirclePosition(Number(val), this.centerX, this.centerY, this.radius);
                    this.canvasId = Math.random() + 'wave';
                    this.$nextTick(() => {
                        this.drawWave(this.canvasId);
                    });
                }
            }
        },
        computed: {
            circleSize() {
                return {
                    width: `${this.size}px`,
                    height: `${this.size}px`
                };
            },
            /*圆环半径*/
            radius() {
                return 50 - this.strokeWidth / 2 - 4;
            },
            /*大环*/
            pathString() {
                return `M ${this.centerX},${this.centerY} m 0,-${this.radius}
                a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
                a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`;
            },
            /*小环*/
            smallCirclePathString() {
                let radius = 4.5;
                let arr = this.getSmallCirclePosition(Number(this.percent), this.centerX, this.centerY, this.radius);
                return `M ${arr[0]},${arr[1]} m 0,-${radius}
                a ${radius},${radius} 0 1 1 0,${2 * radius}
                a ${radius},${radius} 0 1 1 0,-${2 * radius}`;
            },
            /*周长*/
            len() {
                return Math.PI * 2 * this.radius;
            },
            pathStyle() {
                let actualPercent = Number(this.percent);
                if(actualPercent !== 0){
                    actualPercent -= 2;
                }
                return {
                    'stroke-dasharray': `${this.len}px ${this.len}px`,
                    'stroke-dashoffset': `${((100 - actualPercent) / 100 * this.len)}px`,
                    'transition': 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
                };
            }
        }
    };
</script>
<style lang="less" scoped>
    @radius: 120px;
    @trailWidth: 5px;
    @padding: 5px;
    @gap: 20px;

    .wrap-classes {
        display: inline-block;
        position: relative;
        .svg {
            position: absolute;
            z-index: 100;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        .inner-classes {
            width: 100%;
            height: 100%;
            text-align: center;
            position: absolute;
            left: 0;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            .fensug {
                width: calc(~'100% - @{gap}');
                height: calc(~'100% - @{gap}');
                background: #f6f7f9;
                border: @trailWidth #fff solid;
                -webkit-border-radius: 25em;
                -moz-border-radius: 25em;
                border-radius: 25em;
                overflow: hidden;
                position: relative;
                .wavenum {
                    width: @radius - 2* @trailWidth - 2*@padding - @gap;
                    height: @radius - 2* @trailWidth - 2*@padding - @gap;
                    overflow: hidden;
                    -webkit-border-radius: 50%;
                    border-radius: 50%;
                    text-align: center;
                    vertical-align: middle;
                    position: absolute;
                    left: 5px;
                    top: 5px;
                    z-index: 5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    b {
                        color: #66707f;
                        font-size: 20px;
                        text-align: center;
                        display: block;
                        position: relative;
                        z-index: 2;
                        line-height: 45px;
                        font-weight: normal;
                    }
                }
                .waven {
                    width: 100%;
                    height: 100%;
                    -webkit-border-radius: 25em;
                    -moz-border-radius: 25em;
                    border-radius: 25em;
                    background: #f6f7f9;
                    overflow: hidden;
                    position: absolute;
                    .wave {
                        background-repeat: no-repeat;
                        width: 408px;
                        /*height: 80%;*/
                        height: 100%;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        animation: move_wave 6s linear infinite;
                        -webkit-animation: move_wave 6s linear infinite;
                    }
                }
            }
        }
    }

    @-webkit-keyframes move_wave {
        0% {
            transform: translateX(0)
        }
        25% {
            -webkit-transform: translateX(-12.5%)
        }
        50% {
            -webkit-transform: translateX(-25%)
        }
        75% {
            -webkit-transform: translateX(-37.5%)
        }
        100% {
            -webkit-transform: translateX(-50%)
        }
    }

    @keyframes move_wave {
        0% {
            transform: translateX(0)
        }
        25% {
            transform: translateX(-12.5%)
        }
        50% {
            transform: translateX(-25%)
        }
        75% {
            transform: translateX(-37.5%)
        }
        100% {
            transform: translateX(-50%)
        }
    }
</style>
