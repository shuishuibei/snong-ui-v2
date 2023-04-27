/*
 * @Description: 饼图series的默认配置
 * @Author: caiyijun
 * @Date: 2019-09-07 15:09:26
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-18 11:07:27
 */

/*位置和大小的默认配置*/
let center = ['50%', '50%'],
    radius = ['50%', '65%'];
//水波涟漪效果的精确度,accuracy越大,位置越精确
let array = [],
    accuracy = 1000;
for (let i = 0; i < accuracy; i++) {
    array.push(i);
}
//水波涟漪效果的默认配置
let effectScatterObj =
    {
        type: 'effectScatter',
        data: [],
        showEffectOn: 'render',
        symbol: 'circle',
        symbolSize: 20,
        tooltip: {
            show: false
        },
        rippleEffect: {
            period: 4,
            brushType: 'fill',
            scale: 12
        },
        label: {
            normal: {
                show: false,
                formatter: '{b}',
                fontSize: 16,
                color: 'white',
                offset: [0, 0]
            }
        },
        itemStyle: {
            normal: {
                color: 'rgba(38,165,236,0.5)',
                shadowBlur: 0,
                shadowColor: '#25fffb'
            }
        }
    };
//series中每一项的基础配置
let basicSerie =
    {
        name: '',
        type: 'pie',
        center: center,
        radius: radius,
        avoidLabelOverlap: false,
        emphasis: {
            label: {
                show: true,
                textStyle: {
                    fontSize: '18',
                    fontWeight: 'bold'
                }
            }
        },
        label: {
            normal: {
                show: true,
                formatter: '{c} %',
                position: 'outside'
            }
        },
        labelLine: {
            normal: {
                show: true
            }
        },
        data: []
    };

//最终导出的option对象
let option = {
    color: ['#01a2fc', '#f9d135', '#01b344', '#05e3fd', '#2a6fd6', '#f6a20a'],
    custom: {//专门存放自定义属性的对象，用来保存series内的一些配置，以便组件vue文件内调用
        accuracy: accuracy,//自定义属性，画水波涟漪效果的精确度
        effectScatterObj: effectScatterObj,//自定义属性，水波涟漪效果的配置
        center: center,//自定义属性,饼图位置
        radius: radius,//自定义属性,饼图大小
        basicSerie: basicSerie
    },
    title: {
        text: '',
        x: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    backgroundColor: '',
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        top: '30%',
        right: '10%',
        itemGap: 20,
        itemWidth: 20,
        textStyle: {
            color: '#657180'
        }
    },
    grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    xAxis: {
        show: false,
        type: 'category',
        data: array
    },
    yAxis: {
        show: false,
        type: 'category',
        data: array
    },
    series: [basicSerie]
};

//module.exports = option;
export default option;