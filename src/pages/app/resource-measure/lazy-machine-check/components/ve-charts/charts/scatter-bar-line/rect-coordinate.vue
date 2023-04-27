<!--
 * @Description: echarts二维坐标系父组件
 * @Author: caiyijun
 * @Date: 2019-09-07 15:09:26
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-18 11:40:18
 -->
<style lang="less" scoped>
    .ve-chart {
        height: 100%;
        width: 100%;
    }
</style>
<template>
    <div :id="id" class="ve-chart">
        <slot></slot>
    </div>
</template>

<script>
    /**
     * 直角坐标轴系列的图表，需要和<VeBar>、<VeLine>、<VeScatter>配合使用来展示柱状图、折线图、散点图
     * 必填属性：id
     * 可选属性：
     * rendererType：渲染器类型，可选svg/canvas
     * title：图表标题
     * backgroundColor: 图表背景颜色
     * color:颜色，数组,对冰山图无效，因为冰山图内置好颜色了
     * showLegend:是否展示legend,布尔值(true/false)
     * dataZoom: 区域缩放组件，传入对象，如{x: true,y: false},显示x轴上的区域缩放，y轴上的区域缩放不显示
     * coverOption：自定义覆盖配置
     * xAxisData：x轴刻度数据
     * xAxisMin: x坐标轴刻度最小值
     * xAxisMax: x坐标轴刻度最大值
     * yAxisData: y轴刻度数据
     *
     * 事件名：
     * click-series，点击到echarts图的series上，返回包含点击图形数据信息的对象params
     * mouseover-series，鼠标移动到echarts图的series上，返回包含点击图形数据信息的对象params
     * 详情见：http://vue-charts.baidu.com/tutorial.html#ECharts%20%E4%B8%AD%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%92%8C%E8%A1%8C%E4%B8%BA
     *
     * */
    import option from '../../default/rect-coordinate.js';
    import lineObj from '../../default/line.js';
    import barObj from '../../default/bar.js';
    import pictorialBarObj from '../../default/pictorialBar.js';
    import scatterObj from '../../default/scatter.js';
    import emitter from '../../mixins/emitter.js';
    import initialize from '../../mixins/initialize.js';

    export default {
        name: 'VeRectCoordinate',
        mixins: [emitter, initialize],
        props: {
            id: {
                type: String,
                required: true,
                default: () => {
                    return new Date().getTime().toString(36);
                }
            },
            rendererType: {
                type: String,
                default: 'canvas'
            },
            title: {
                type: String,
                default: ''
            },
            backgroundColor: {
                type: String,
                default: option.backgroundColor || ''
            },
            color: {
                type: Array,
                default: () => {
                    return option.color || ['#01a2fc', '#f9d135', '#01b344', '#05e3fd', '#2a6fd6', '#f6a20a']
                }
            },
            showLegend: {
                type: Boolean,
                default: true
            },
            dataZoom: {
                type: Object,
                default: () => {
                    return {
                        x: option.custom.xdataZoom || false,
                        y: option.custom.ydataZoom || false
                    }
                }
            },
            xAxisData: {
                type: Array,
                default: () => []
            },
            xAxisMin: {
                type: [Number, String],
                default: () => {
                    return 'dataMin' || option.xAxis.min;
                }
            },
            xAxisMax: {
                type: [Number, String],
                default: () => {
                    return 'dataMax' || option.xAxis.max;
                }
            },
            yAxisData: {
                type: Array,
                default: () => []
            },
            coverOption: {
                type: Object,
                default: () => null
            }
        },
        data() {
            return {
                option: option,
                chart: null
            }
        },
        methods: {
            extractLineObj: function (obj) {
                let result = {
                    name: obj.name,
                    symbol: obj.symbol,
                    symbolSize: obj.symbolSize,
                    step: obj.step,
                    smooth: obj.smooth,
                    data: obj.data
                    /*itemStyle: {
                        normal: {
                            color: obj.lineColor
                        }
                    }*/
                };
                let linearGradient = obj.linearGradient;
                /*开启渐变*/
                if (obj.startGradient) {
                    result.areaStyle = lineObj.areaStyleObj;
                    result.areaStyle.normal.color.colorStops = linearGradient;
                }
                return this.tool.extend(true, {}, lineObj, result);
            },
            extractPictorialBarObj: function (e) {
                let _this = this,
                    obj = this.tool.extend(true, {}, e);
                let result = {
                    name: obj.name,
                    data: obj.data
                };
                return _this.tool.extend(true, {}, pictorialBarObj, result);
            },
            extractBarObj: function (e) {
                let _this = this,
                    obj = this.tool.extend(true, {}, e),
                    linearGradient = obj.linearGradient;
                let result = {
                    name: obj.name,
                    label: {
                        show: obj.showLabel
                    },
                    barWidth: obj.barWidth,
                    barMaxWidth: obj.barMaxWidth,
                    barMinHeight: obj.barMinHeight,
                    barGap: obj.barGap,
                    data: obj.data
                };
                if (obj.gradientDirection) {
                    switch (obj.gradientDirection) {
                        case 'top-bottom':
                            barObj.itemStyle.normal.color = new _this.$echarts.graphic.LinearGradient(
                                0, 1, 0, 0, linearGradient
                            );
                            break;
                        case 'bottom-top':
                            barObj.itemStyle.normal.color = new _this.$echarts.graphic.LinearGradient(
                                0, 0, 0, 1, linearGradient
                            );
                            break;
                        case 'left-right':
                            barObj.itemStyle.normal.color = new _this.$echarts.graphic.LinearGradient(
                                0, 1, 1, 1, linearGradient
                            );
                            break;
                        case 'right-left':
                            barObj.itemStyle.normal.color = new _this.$echarts.graphic.LinearGradient(
                                1, 1, 0, 1, linearGradient
                            );
                            break;
                        default:
                            break;
                    }
                }
                return _this.tool.extend(true, {}, barObj, result);
            },
            extractScatterObj: function (obj) {
                let result = {
                    name: obj.name,
                    symbol: obj.symbol,
                    symbolSize: obj.symbolSize,
                    data: obj.data
                };
                return this.tool.extend(true, {}, scatterObj, result);
            },
            /*
             * 设置了color、legend、title
             * */
            setBasicInfo: function (obj) {
                let option = this.tool.extend(true, {}, obj),
                    xAxis = this.xAxisData,
                    xtype = 'category',
                    ytype = 'value',
                    yAxis = this.yAxisData,
                    dataZoom = this.dataZoom;
                option.color = this.color;
                option.title.text = this.title;
                option.backgroundColor = this.backgroundColor;
                if (!(xAxis instanceof Array)) {
                    throw '传入的x轴数据不是数组格式!';
                } else if (typeof xAxis[0] == 'string' && xAxis[0].constructor.name == 'String') {//根据第一个数据的数据类型判断是否类目数据
                    xtype = 'category'
                } else {
                    xtype = 'value'
                }
                if (!(yAxis instanceof Array)) {
                    throw '传入的y轴数据不是数组格式!';
                } else if (typeof yAxis[0] == 'string' && yAxis[0].constructor.name == 'String') {
                    ytype = 'category'
                } else {
                    ytype = 'value'
                }
                if (dataZoom.x && dataZoom.x === true) {
                    option.dataZoom.map(function (item) {
                        if (item.xAxisIndex) {
                            item.show = true;
                        }
                    })
                }
                if (dataZoom.y && dataZoom.y === true) {
                    option.dataZoom.map(function (item) {
                        if (item.yAxisIndex) {
                            item.show = true;
                        }
                    })
                }
                option.xAxis.data = xAxis;
                option.yAxis.data = yAxis;
                option.xAxis.type = xtype;
                option.yAxis.type = ytype;
                option.xAxis.min = this.xAxisMin;
                option.xAxis.max = this.xAxisMax;
                return option;
            },
            setDataInfo: function (obj) {
                const children = this.$children;
                let flag = false,
                    _this = this,
                    showLegend = _this.showLegend,
                    option = _this.tool.extend(true, {}, obj),
                    legendArr = [],
                    seriesArr = [];

                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    flag = true;
                    switch (child.childType) {
                        case 'bar':
                            seriesArr.push(_this.extractBarObj(child));
                            legendArr.push(child.name);
                            break;
                        case 'pictorialbar':
                            seriesArr.push(_this.extractPictorialBarObj(child));
                            legendArr.push(child.name);
                            break;
                        case 'line':
                            seriesArr.push(_this.extractLineObj(child));
                            legendArr.push(child.name);
                            break;
                        case 'scatter':
                            seriesArr.push(_this.extractScatterObj(child));
                            legendArr.push(child.name);
                            break;
                        default:
                            break;
                    }
                }
                if (flag) {
                    option.series = seriesArr;
                    option.legend.show = showLegend;
                    option.legend.data = legendArr;
                } else {
                    throw '请检查是否有<VeLine>、<VeBar>、<VeScatter>标签及它们的ref属性是否设置正确';
                }
                return option;
            }
        },
        watch: {
            xAxisData: function (val, oldVal) {
                if (val !== oldVal) {
                    this.$nextTick(function () {
                        this.chart.setOption(this.lastOption);
                    });
                }
            },
            yAxisData: function (val, oldVal) {
                if (val !== oldVal) {
                    this.$nextTick(function () {
                        this.chart.setOption(this.lastOption);
                    });
                }
            }
        }
    }
</script>