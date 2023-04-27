/*
 * @Description: 二维坐标系组件
 * @Author: caiyijun
 * @Date: 2019-09-07 15:09:26
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-12 10:13:06
 */
/**
 * 直角坐标系默认配置
 * since 2018/1/16
 * author cfw2157
 */

let xdataZoom = false,
    ydataZoom = false;

let option = {
    custom: {//专门存放自定义属性的对象，用来保存一些配置，以便组件vue文件内调用
        xdataZoom: xdataZoom,
        ydataZoom: ydataZoom
    },
    title: {
        text: ''
    },
    backgroundColor: '',
    color: ['#01a2fc', '#f9d135', '#01b344', '#05e3fd', '#2a6fd6', '#f6a20a'],
    legend: {
        data: [],
        show: true,
        padding: [5, 10],
        top: '10%',
        itemGap: 20,
        itemWidth: 20,
        textStyle: {
            color: '#b5d6fc'
        }
    },
    /*legend: {
        padding: [10, 70],
        itemGap: 70,
        itemWidth: 50,
        backgroundColor: 'rgba(9, 23, 42, .7)',
        borderColor: 'rgba(8, 36, 73, .81)',
        borderWidth: 2,
        textStyle: {
            color: '#b5d6fc'
        },
        data: []
    },*/
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            /*animation: false*/
            /*type : 'line'*/
            type: 'shadow'
        }
    },
    xAxis: {
        type: 'category',
        axisTick: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            show: true,
            /*interval: 0,*/
            rotate: 0,
            textStyle: {
                color: '#657180',
                fontSize: '12px'
            }
        },
        axisLine: {
            lineStyle: {
                color: '#ebf1f8',
                width: 1
            }
        }
    },
    yAxis: {
        type: 'value',
        /*分隔线*/
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#ebf1f8']
            }
        },
        /*刻度*/
        axisTick: {
            show: false
        },
        /*刻度标签*/
        axisLabel: {
            show: true,
            textStyle: {
                color: '#657180'
            }
        },
        /*轴线*/
        axisLine: {
            lineStyle: {
                color: '#ebf1f8',
                width: 1
            }
        }
    },
    dataZoom: [
        {
            type: 'slider',
            textStyle: {
                color: '#fff'
            },
            show: xdataZoom,
            xAxisIndex: [0]
            /*start: 1,
            end: 35*/
        },
        {
            type: 'slider',//滑动条型
            textStyle: {
                color: '#fff'
            },
            show: ydataZoom,
            yAxisIndex: [0]
            /*start: 29,
            end: 36*/
        },
        {
            type: 'inside',//内置型
            textStyle: {
                color: '#fff'
            },
            show: xdataZoom,
            xAxisIndex: [0]
            /*start: 1,
            end: 35*/
        },
        {
            type: 'inside',
            textStyle: {
                color: '#fff'
            },
            show: ydataZoom,
            yAxisIndex: [0]
            /*start: 29,
            end: 36*/
        }
    ],
    series: []
};

//module.exports = option;
export default option;