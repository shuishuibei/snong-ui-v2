/*
 * @Description: 僵尸机详情页面
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:35
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-17 10:42:36
 */
import Vue from 'vue';
import _ from 'lodash';
import Vechart from '../ve-charts';
import { ServerStatus } from '@/assets/js/status/index.js';


export default {
    data() {
        return {
            /*初始化时传入的数据*/
            baseInfo: {},
            /*是否显示明文密码*/
            showPwd: true,
            statusText: '',
            color: '',
            info: {
                //UUID
                id: '',
                //名称
                serverName: '',
                //别名
                alias: '',
                //状态
                status: '',
                //镜像
                imageName: '',
                //规格
                flavorInfo: '',
                //初始密码
                password: '',
                //虚拟化类型
                virtType: '',
                //所有者
                userName: '',
                //资源区域
                zone: '',
                //主机名称
                compute: '',
                //创建时间
                createDate: '',
                //描述
                description: '',
                //开始时间(和创建时间一样)
                //到期时间
                endDate: ''
            },
            xAxisData: ['02 : 00', '04 : 00', '06 : 00', '08 : 00', '10 : 00', '12 : 00', '14 : 00', '16 : 00'],
            cpuData: [],
            cpuxAxis: [],
            memoryData: [],
            memoryxAxis: [],
            diskReadData: [],
            diskReadxAxis: [],
            diskWriteData: [],
            diskWritexAxis: [],
            networkArr: [],
            coverOption: {
                title: {
                    text: '单位 : %',
                    top: '5%',
                    right: '10%',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 12
                    }
                },
                grid: {
                    top: '22%',
                    left: '15%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765'
                        }
                    },
                    formatter: '时间: {b}<br/>{a}:<br/>{c}'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false
                },
                legend: {
                    show: true,
                    data: ['CPU利用率'],
                    formatter: function (name) {
                        if (name.length > 18) {
                            return name.slice(0, 18) + '...';
                        } else {
                            return name;
                        }
                    },
                    top: '5',
                    left: 'left',
                    textStyle: {
                        color: '#000'
                    }
                },
                series: [{
                    name: 'CPU利用率',
                    type: 'line',
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        label: {
                            show: true,
                            formatter: ['{a}'],
                            width: 10,
                            height: 10,
                            color: '#fff',
                            borderRadius: 5,
                            padding: [3, 8],
                            backgroundColor: '#3375b8'
                        }
                    }
                }]
            }
        };
    },
    methods: {
        /**
         * @description: 从状态数组中获取某个状态的信息
         * @param status {String} 状态名
         * @param arr {Array} 状态数组
         * @return: 被选中状态数组
         */
        getStatusInfo(status, arr) {
            return arr.filter(function (item) {
                return item.value === status;
            });
        },
        /**
         * @description: 获取折线图渐变配置
         * @param rgbaColor1 {String} 渐变初始颜色
         * @param rgbaColor2 {String} 渐变中间颜色
         * @param rgbaColor3 {String} 渐变最终颜色
         * @return: 渐变配置数组
         */
        getLinerGradient(rgbaColor1, rgbaColor2, rgbaColor3) {
            return [
                {offset: 0, color: rgbaColor1},
                {offset: 0.5, color: rgbaColor2},
                {offset: 1, color: rgbaColor3}
            ];
        },
        /**
         * @description: 获取echarts的option对象
         * @param title {String} 标题
         * @param color {String} 颜色
         * @param unit {String} 单位
         * @return: echarts画图所用的option {Object}
         */
        getCoverOption(title, color, unit = '%') {
            let option = _.cloneDeep(this.coverOption);
            option.series[0].name = title;
            option.legend.data = [title];
            option.title.text = `单位: ${unit}`;
            option.series[0].emphasis.label.backgroundColor = color;
            return option;
        },
        /**
         * @description: 初始化数据方法
         * @return: null
         */
        initData() {
            let params = this.$route.params;
            this.baseInfo = params;
            this.getBaseInfo(params.serverId);
            this.getChartData(params);
        },
        /**
         * @description: 改变时间段
         * @param name {String} 时间段：过去八小时/过去一周/过去一月
         * @return: null
         */
        changeTimer(name) {
            this.baseInfo.time = name;
            this.getChartData(this.baseInfo);
        },
        /**
         * @description: 获取x86虚机的x轴时间数据
         * @param arr {Array} 原始数据
         * @return: 返回x86虚机的echarts图上x轴展示数据
         */
        getXAxis(arr) {
            if (arr === undefined) return [];
            return arr.map((currentValue) => {
                let str = this.formatDate(currentValue.timestamp, '/');
                return str.replace(' ', '\n');
            });
        },
        /**
         * @description: 获取power的echarts图x轴时间数据
         * @param arr {Array} 原始数据
         * @return: 返回power虚机的echarts图上x轴展示数据
         */
        getPowerXAxis(arr) {
            if (arr === undefined) return [];
            return arr.map((currentValue) => {
                let str = this.formatDate(Number(currentValue.time), '/');
                return str.replace(' ', '\n');
            });
        },
        /**
         * @description: 获取x86虚机的y轴数据
         * @param arr {Array} 原始数据
         * @return: 返回x86虚机的echarts图上y轴展示数据
         */
        getYAxis(arr) {
            return arr.map(function (currentValue) {
                return currentValue.value.toFixed(2);
            });
        },
         /**
         * @description: 获取power虚机的y轴数据
         * @param arr {Array} 原始数据
         * @return: 返回power虚机的echarts图上y轴展示数据
         */
        getYAxisRate(arr) {
            return arr.map(function (currentValue) {
                return currentValue.rate.toFixed(2);
            });
        },
        /**
         * @description: 日期时间转化函数
         * @param time {Number} 时间毫秒数 
         * @param split {String} 分隔符 
         * @return: 默认“年-月-日 时:分”的格式
         */
        formatDate(time, split = '-') {
            let date = new Date(time);
            let year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hours = date.getHours(),
                minutes = date.getMinutes();
            minutes = minutes === 0 ? ('00') : minutes;
            month = month < 10 ? ('0' + month) : month;
            minutes = minutes === 0 ? ('00') : minutes;
            day = day < 10 ? ('0' + day) : day;
            return year + split + month + split + day + ' ' + hours + ':' + minutes;
        },
        /**
         * @description: 给echarts图表组件变量赋值
         * @param obj {Object} 原始数据对象
         * @param type {String} 图表类型：X86/Power
         * @return: null
         */
        setChartData(obj, type) {
            if (obj === null) return;
            let {cpuValue, memoryValue, diskReadValue, diskWriteValue, macValue} = obj;
            if (type === 'Power') {
                this.cpuxAxis = this.getPowerXAxis(cpuValue.list);
                this.cpuData = this.getYAxisRate(cpuValue.list);
                this.memoryxAxis = this.getPowerXAxis(memoryValue.list);
                this.memoryData = this.getYAxisRate(memoryValue.list);
            } else {
                this.cpuxAxis = this.getXAxis(cpuValue);
                this.cpuData = this.getYAxis(cpuValue);
                this.memoryxAxis = this.getXAxis(memoryValue);
                this.memoryData = this.getYAxis(memoryValue);
                this.diskReadData = this.getYAxis(diskReadValue);
                this.diskWriteData = this.getYAxis(diskWriteValue);
                this.diskReadxAxis = this.getXAxis(diskReadValue);
                this.diskWritexAxis = this.getXAxis(diskWriteValue);
                this.networkArr = macValue.map((currentValue) => {
                    return {
                        macName: currentValue.macName,
                        incomingList: this.getYAxis(currentValue.incomingList),
                        outgoingList: this.getYAxis(currentValue.outgoingList),
                        incomingXAxis: this.getXAxis(currentValue.incomingList),
                        outgoingXAxis: this.getXAxis(currentValue.outgoingList),
                    }
                });
            }
        },
        /**
         * @description: 获取僵尸机图表数据
         * @param param {Object} 发送请求所需参数 
         * @return: null
         */
        getChartData(param) {
            this.$loading.show();
            this.$http.post('/serverCheck/getCheckServerDetail', param).then(({data}) => {
                if (data.status) {
                    if (this.baseInfo.type === 'X86') {
                        this.setChartData(data.data.cloudPerformanceDto, 'X86');
                    } else {
                        this.setChartData(data.data.powerPerformanceDTO, 'Power');
                    }
                }
                this.$loading.hide();
            }).catch(() => {
                this.$loading.hide();
            });
        },
        /**
         * @description: 获取僵尸机基本信息、租期信息
         * @param id {String} 僵尸机的serverId
         * @return: Promise对象
         */
        getBaseInfo(id) {
            let url = '/server/detail/';
            if (this.baseInfo.type === 'POWER') {
                url = '/power/server/detail/';
            }
            return new Promise(function (resolve, reject) {
                this.$http.get(url + id).then(({data}) => {
                    if (data.status) {
                        let detailData = data.data,
                            imageName = data.data.imageName;
                        detailData.imageName = imageName[0].toLocaleUpperCase() + imageName.slice(1);
                        /*Power虚拟机详情里没有endDate*/
                        if (this.baseInfo.type === 'POWER') {
                            detailData.createDate = data.data.createdTime;
                            detailData.endDate = '';
                        } else {
                            detailData.createDate = data.data.createDate;
                            detailData.endDate = data.data.endDate;
                        }
                        detailData.status = data.data.status.toLowerCase();
                        this.info = detailData;
                        let statusArr = this.getStatusInfo(this.info.status.toLowerCase(), ServerStatus);
                        if (statusArr.length > 0) {
                            this.statusText = statusArr[0].label;
                            this.color = statusArr[0].color;
                        } else {
                            this.statusText = '未知状态';
                            this.color = '#ffa904';
                        }
                        resolve(detailData);
                    } else {
                        reject();
                    }
                }).catch((e) => {
                    reject(e);
                });
            }.bind(this));
        }
    },
    filters: {
        date(value, split = '-') {
            let date = new Date(value);
            let year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate(),
                hour = date.getHours(),
                min = date.getMinutes(),
                sec = date.getSeconds();
            month = month < 10 ? ('0' + month) : month;
            day = day < 10 ? ('0' + day) : day;
            hour = hour < 10 ? ('0' + hour) : hour;
            min = min < 10 ? ('0' + min) : min;
            sec = sec < 10 ? ('0' + sec) : sec;
            return year + split + month + split + day + ' ' + hour + ':' + min + ':' + sec;
        }
    },
    created(){
        Vue.use(Vechart);
    },
    mounted(){
        this.initData();
    },
    beforeRouteLeave(to,from,next){
        if(to.name === 'lazy-machine-check/index'){
             to.meta.keepAlive = true;
        }else {
             to.meta.keepAlive = false;
        }
        next();
    }
};