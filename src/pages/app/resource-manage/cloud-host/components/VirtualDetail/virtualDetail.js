/*
 * @Description: 
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-17 16:53:22
 */

import api from '../../api';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';
import {formatDate} from '@/assets/js/utils';
import {PageParams} from '@/assets/js/page-params.js';
import {ServerStatus, VolumeStatus} from '@/assets/js/status/index.js';

export default {
    components: {
        'h3c-title': H3cTitle
      },
    data() {
        return {
            // 是否显示明文密码
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
            dynamicHeight: 0,

            networkColumns: [
            {
                title: '名称',
                key: 'name',
                ellipsis: true
            }, {
                title: '私网IP地址',
                key: 'ipAddress',
                ellipsis: true
            }, {
                title: '公网IP地址',
                key: 'floatingIpAddress',
                ellipsis: true
            }, {
                title: '网络',
                key: 'networkName',
                ellipsis: true
            }, {
                title: 'MAC',
                key: 'macAddress',
                ellipsis: true
            }],
            networkPageObj: new PageParams({size: 5,pageSizeOpts: [5, 10, 20]}),

            diskColumns: [
            {
                title: '名称',
                key: 'name',
                ellipsis: true
            }, {
                title: '状态',
                key: 'status',
                ellipsis: true,
                render: (h, params) => {
                    let status = params.row.status.toLowerCase();
                    let statusObj = VolumeStatus.filter(val => {
                        return val.value === status;
                    });
                    let text = statusObj.length ? statusObj[0].label : '未知状态',
                        color = statusObj.length ? statusObj[0].color : '#ffa904';
                    return h(
                        'div',
                        {
                            class: 'ivu-table-cell-ellipsis',
                            style: {
                            color: color
                            },
                            attrs: { title: text }
                        },
                        [
                            h('div', {
                            class: 'cds-status-dot ',
                            style: {
                                backgroundColor: color
                            }
                            }),
                            h(
                            'span',
                            {
                                style: {
                                'vertical-align': 'middle'
                                }
                            },
                            text
                            )
                        ]
                    );
                }
            }, {
                title: '容量(GB)',
                key: 'size',
                ellipsis: true
            }, {
                title: '存储类型',
                key: 'storageType',
                ellipsis: true
            }, {
                title: '设备',
                key: 'device',
                ellipsis: true
            }, {
                title: '创建时间',
                key: 'createDate',
                ellipsis: true,
                render: (h, params) => {
                    let date = formatDate(params.row.createDate);
                    //将时间格式化
                    return h('span', {
                        attrs: {
                            title: date
                        }
                    }, date);
                }
            }],
            diskPageObj: new PageParams({size: 5,pageSizeOpts: [5, 10, 20]}),
            //节流函数中的定时器
            timer: null,
            previous: null
        };
    },
    methods: {
        refreshDisk(){
            this.getDisk();
        },
        /**
         * @description: 动态计算硬件配置、操作日志的高度
         * @return: null
         */
        makeDynamicHeight() {
            let height = this.$refs['dynamic-height'].offsetHeight;
            //高度不变的时候直接返回
            if (height === this.dynamicHeight) {
                return;
            }
            //计算租期信息高度
            this.dynamicHeight = height;
            //计算基本信息、租期信息父元素高度
            let allHeight = this.dynamicHeight + 430 + 'px';
            let tabContent = document.querySelectorAll('.ivu-tabs-content');
            //设置硬件配置、操作日志父元素高度
            tabContent[0].style.height = allHeight;
        },
        /**
         * @description: 为了达到页面左边高度与右边高度一致,采用动态计算的方式;并采用函数节流的方式提高性能
         * @param duration {Number} [0: 直接执行;否则采用函数节流]
         * @return: null
         */
        resize(duration) {
            if (this.duration === 0) {
                this.makeDynamicHeight();
            } else {
                let now = +new Date();
                if (!this.previous) {
                    this.previous = now;
                }
                if (now - this.previous > 100) {// 防止一直resize时不调用
                    this.makeDynamicHeight();
                    this.previous = now; // 重置上一次开始时间为本次结束时间
                    clearTimeout(this.timer);
                } else {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.makeDynamicHeight();
                        this.previous = null;
                    }, 20);
                }
            }
        },
        /**
         * @description: 获取基本信息、租期信息
         * @return: Promise对象
         */
        getBaseInfo() {
            let id = this.serverId;
            return new Promise(function (resolve, reject) {
                this.$http.get(`/server/detail/${id}`).then(({data}) => {
                    if (data.status) {
                        let detailData = data.data,
                            osName = data.data.osName,
                            imageName = data.data.imageName,
                            system = osName.match(/aix|asianux|centos|debian|linux|oracle|redhat|suse|ubuntu|windows/i),
                            classes = ['system-bg'];
                        if (system !== null && system[0]) {
                            classes.push('bg-' + system[0].toLowerCase());
                        }
                        detailData.imageName = imageName[0].toLocaleUpperCase() + imageName.slice(1);
                        detailData.classes = classes;
                        detailData.createDate = data.data.createDate;
                        detailData.endDate = data.data.endDate;
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
        },
       /**
         * @description: 从状态数组中获取某个状态的信息
         * @param key {String} 状态字段
         * @param arr {Array} 状态数组
         * @return: null
         */ 
        getStatusInfo(status, arr) {
            return arr.filter(function (item) {
                return item.value === status;
            });
        },
        /*跳转页面*/
        changePage(currentPage, tablePage, callback) {
            tablePage.current = currentPage;
            callback();
        },
        /*更改页数*/
        changePageSize(pageSize, tablePage, callback) {
            tablePage.size = pageSize;
            callback();
        },
        /**
         * @description: 获取网卡
         * @return: Promise对象
         */
        getNetwork() {
            this.networkPageObj.loading = true;
            let serverId = this.serverId;
            return new Promise(function (resolve, reject) {
                this.$http.post(api.networkUrl + serverId, {
                    current: this.networkPageObj.current,
                    pageSize: this.networkPageObj.size
                }).then(({data}) => {
                    if (data.status) {
                        let temp = data.data;
                        this.networkPageObj.loading = false;
                        this.networkPageObj.showData = temp.records;
                        this.networkPageObj.size = temp.size;
                        this.networkPageObj.total = temp.total;
                        this.networkPageObj.current = temp.current;
                        resolve(temp);
                    } else {
                        reject();
                    }
                }).catch((e) => {
                    reject(e);
                });
            }.bind(this));
        },
        /**
         * @description: 获取硬盘
         * @return: Promise对象
         */
        getDisk() {
            this.diskPageObj.loading = true;
            let serverId = this.serverId;
            return new Promise(function (resolve, reject) {
                this.$http.post(api.mountedDiskUrl + serverId, {
                    currentPage: this.diskPageObj.current,
                    pageSize: this.diskPageObj.size
                }).then(({data}) => {
                    if (data.status) {
                        let temp = data.data;
                        this.diskPageObj.loading = false;
                        this.diskPageObj.showData = temp.records;
                        this.diskPageObj.size = temp.size;
                        this.diskPageObj.total = temp.total;
                        this.diskPageObj.current = temp.current;
                        resolve(temp);
                    } else {
                        reject();
                    }
                }).catch((e) => {
                    reject(e);
                });
            }.bind(this));
        }
    },
    computed: {
        serverId() {
          return this.$route.params.id
        }
    },
    created() {
        this.$loading.show();
        let p1 = this.getBaseInfo(),
            p2 = this.getNetwork(),
            p3 = this.getDisk();
        Promise.all([p1, p2, p3]).then(()=>{
            this.$loading.hide();
        }).catch(()=>{
            this.$loading.hide();
        });
    },
    mounted() {
        this.$nextTick(() => {
            this.resize(0);
        });
        //监听resize事件
        window.addEventListener('resize', this.resize);
    },
    beforeRouteLeave(to,from,next){
       if(to.name === 'cloud-host/index'){
            to.meta.keepAlive = true;
       }else {
            to.meta.keepAlive = false;
       }
        next();
    },
    destroyed() {
        //销毁resize事件
        window.removeEventListener('resize', this.resize);
    },
    filters: {
        date(value, split = '-') {
            if(value === null || value === undefined || value.length === 0) {
                return '';
            }
            if(value.indexOf('9999') !== -1){
                return '永久';
            }
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
    }
};
