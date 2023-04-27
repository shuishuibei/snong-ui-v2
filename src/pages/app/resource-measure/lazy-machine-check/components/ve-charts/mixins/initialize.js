/**
 * 图表组件的公共mounted方法和计算属性lastOption
 * since 2018/1/25
 * author cfw2157
 */
import {Tool} from '../uitls/util.js';
import {on, off} from '../uitls/dom.js';

export default {
    data: function () {
        return {
            tool: new Tool()
        }
    },
    methods: {
        handleResize() {
            this.chart.resize();
        }
    },
    computed: {
        lastOption: function () {
            let option = this.option,
                newOption = this.tool.extend(true, {}, option),
                basicInfoOption = this.setBasicInfo(newOption),
                dataOption = this.setDataInfo(basicInfoOption),
                coverOption = this.coverOption;
            let result;
            if (coverOption && coverOption.constructor.name === 'Object') {
                result = this.tool.extend(true, {}, option, dataOption, coverOption);//true开启深拷贝
                return result;
            } else {
                result = this.tool.extend(true, {}, option, dataOption);//true开启深拷贝
                return result;
            }
        }
    },
    mounted: function () {
        let _this = this;
        this.$on('changeData', () => {
            this.chart.setOption(this.lastOption);
        });
        this.$nextTick(function () {
            let rendererType = _this.rendererType;
            let myChart = _this.$echarts.getInstanceByDom(document.getElementById(_this.id));
            // 这个dom上已经有echarts图表渲染了，此时不需要再init了
            if(myChart === null || myChart === undefined){
                myChart = _this.$echarts.init(document.getElementById(_this.id), null, {renderer: rendererType});
                _this.chart = myChart;
            }
            myChart.setOption(_this.lastOption);
            myChart.on('click', function (params) {
                if (params.componentType === 'series') {
                    _this.$emit('click-series', params);
                }
                if (params.componentType === 'markPoint') {
                    _this.$emit('click-point', params);
                }
            });

            myChart.on('mouseover', function (params) {
                if (params.componentType === 'series') {
                    _this.$emit('mouseover-series', params);
                }
            });
            on(window, 'resize', this.handleResize);
        });
    },
    beforeDestroy() {
        off(window, 'resize', this.handleResize);
    }
}
