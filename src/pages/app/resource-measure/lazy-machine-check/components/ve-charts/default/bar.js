/**
 * 柱状图series的默认配置
 * since 2018/1/16
 * author cfw2157
 */

/*渐变样式配置*/
let linearGradient = [
    {
        offset: 0,
        color: '#00feff'
    },
    {
        offset: 0.5,
        color: '#027eff'
    },
    {
        offset: 1,
        color: '#0286ff'
    }
];

let obj = {
    type: 'bar',
    barWidth: '自适应',
    barMaxWidth: '自适应',
    barMinHeight: 0,
    barGap: '30%',
    label: {
        show: false
    },
    emphasis: {
      label: {
          show: false
      }
    },
    linearGradient: linearGradient,
    coordinateSystem: 'cartesian2d',//可选项:'cartesian2d','polar','geo' 详情链接:http://vue-charts.baidu.com/option.html#series-scatter.coordinateSystem
    itemStyle: {
        normal: {
            barBorderRadius: 0
        },
        emphasis: {

        }
    },
    data: []
};

export default obj;
//module.exports = obj;