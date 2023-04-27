<!--
 * @Description: 僵尸机监测页面
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:35
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-14 15:54:30
 -->
<template>
    <div class="virtual-machine-container">
        <div class="virtual-machine-main">
            <div class="test-index">
                <h3c-title title="检测指标">
                    <template #other>
                        <a class="cds-float-right reset-button" @click="resetFormData">重置指标</a>
                    </template>
                </h3c-title>
                <div class="home-content">
                    <i-form 
                        ref="formValidate" 
                        :model="machineFormItem" 
                        :rules="ruleValidate" 
                        :label-width="150">
                        <div style="margin-top: 15px">
                            <i-row 
                                type="flex" 
                                justify="space-around" 
                                class="code-row-bg">
                                <i-col span="8">
                                    <div class="index-item">
                                        <i-form-item prop="cpu" label="CPU使用率低于(%)">
                                            <i-input v-model="machineFormItem.cpu" class="index-param"></i-input>
                                        </i-form-item>
                                    </div>
                                </i-col>
                                <i-col span="8">
                                    <div class="index-item">
                                        <i-form-item prop="memory" label="内存使用率低于(%)">
                                            <i-input v-model="machineFormItem.memory" class="index-param"></i-input>
                                        </i-form-item>
                                    </div>
                                </i-col>
                                <i-col span="8">
                                    <div class="index-item">
                                        <i-form-item prop="diskWrite" label="磁盘写入速率低于(b/s)">
                                            <i-input v-model="machineFormItem.diskWrite" class="index-param"></i-input>
                                        </i-form-item>
                                    </div>
                                </i-col>
                            </i-row>
                        </div>
                        <div style="margin-top: 15px">
                            <i-row 
                                type="flex" 
                                justify="space-around" 
                                class="code-row-bg">
                                <i-col span="8">
                                    <div class="index-item">
                                        <i-form-item prop="diskRead" label="磁盘读取速率低于(b/s)">
                                            <i-input v-model="machineFormItem.diskRead" class="index-param"></i-input>
                                        </i-form-item>
                                    </div>
                                </i-col>
                                <i-col span="8">
                                    <div class="index-item">
                                        <i-form-item prop="netIncome" label="传送速率低于(b/s)">
                                            <i-input v-model="machineFormItem.netIncome" class="index-param"></i-input>
                                        </i-form-item>
                                    </div>
                                </i-col>
                                <i-col span="8">
                                    <div class="index-item">
                                        <i-form-item prop="netOutcome" label="接受速率低于(b/s)">
                                            <i-input v-model="machineFormItem.netOutcome" class="index-param"></i-input>
                                        </i-form-item>
                                    </div>
                                </i-col>
                            </i-row>
                        </div>
                    </i-form>
                </div>
            </div>
            <div class="test-period">
                <h3c-title title="检测时间段"></h3c-title>
                <div class="home-content cds-clearfix check-time-container">
                    <div class="cds-float-left check-time-select">
                        <label>请选择检测时间段</label>
                        <i-select style="width: 240px; margin-right: 8px" v-model="machineFormItem.info">
                            <i-option value="过去八小时">过去8小时</i-option>
                            <i-option value="过去一周">过去一周</i-option>
                            <i-option value="过去一月">过去一月</i-option>
                        </i-select>
                        <i-button type="primary" @click="startCheck">开始检测</i-button>
                    </div>
                    <div class="cds-float-left progress-container" v-if="showProgress">
                        <custom-progress :percent="percent" ref="progressComponent"></custom-progress>
                    </div>
                </div>
            </div>
            <div class="zombie-list">
                <h3c-title title="僵尸机列表"></h3c-title>
                <div class="home-content">
                    <i-tabs @on-click="changeType">
                        <i-tab-pane label="X86虚拟机" name="X86">
                            <div class="table-contain" v-if="showTableFlag">
                                <i-table 
                                    stripe
                                    highlight-row
                                    size="small"
                                    :height="height1"
                                    :key="tableKey1"
                                    :data="x86HostTable.showData"
                                    :columns="hostColumnExample"
                                    :loading="x86HostTable.loading">
                                </i-table>
                            </div>
                            <div class="table-page cds-clearfix" v-if="showTableFlag">
                                <div class="cds-float-left">
                                    共有{{x86HostTable.total}}条记录，当前页{{x86HostTable.current}}/{{x86HostTable.getPageNum()}}页
                                </div>
                                <div class="cds-float-right">
                                    <i-page
                                            show-sizer
                                            size="small"
                                            placement="top"
                                            :total="x86HostTable.total"
                                            :current="x86HostTable.current"
                                            :page-size="x86HostTable.size"
                                            :page-size-opts="x86HostTable.pageSizeOpts"
                                            @on-page-size-change="changePageSize($event, x86HostTable)"
                                            @on-change="changePage($event, x86HostTable)">
                                    </i-page>
                                </div>
                            </div>
                        </i-tab-pane>
                        <i-tab-pane label="Power虚拟机" name="POWER">
                            <div class="table-contain" v-if="showTableFlag">
                                <i-table highlight-row
                                       stripe
                                       size="small"
                                       :height="height2"
                                       :key="tableKey2"
                                       :data="powerHostTable.showData"
                                       :columns="hostColumnExample"
                                       :loading="powerHostTable.loading">
                                </i-table>
                            </div>
                            <div class="table-page cds-clearfix" v-if="showTableFlag">
                                <div class="cds-float-left">
                                    共有{{powerHostTable.total}}条记录，当前页{{powerHostTable.current}}/{{powerHostTable.getPageNum()}}页
                                </div>
                                <div class="cds-float-right">
                                    <i-page
                                            show-sizer
                                            size="small"
                                            placement="top"
                                            :total="powerHostTable.total"
                                            :current="powerHostTable.current"
                                            :page-size="powerHostTable.size"
                                            :page-size-opts="powerHostTable.pageSizeOpts"
                                            @on-page-size-change="changePageSize($event, powerHostTable)"
                                            @on-change="changePage($event, powerHostTable)">
                                    </i-page>
                                </div>
                            </div>
                        </i-tab-pane>
                    </i-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {on, off} from './dom.js';
    import CustomProgress from './components/CustomProgress.vue';
    import H3cTitle from '@/components/h3c-title/H3cTitle.vue';
    import {ServerStatus} from '@/assets/js/status/index.js';
    import {PageParams} from '@/assets/js/page-params.js';
    import {int, max} from '@/assets/js/rule-validate.js';

    export default {
        name: 'LazyMachineCheck',
        components: {
            'h3c-title': H3cTitle,
            'custom-progress': CustomProgress,
        },
        data() {
            return {
                /*两张表格的高度*/
                height1: 200,
                height2: 200,
                /*定时器*/
                interval: null,
                /*僵尸机列表类型*/
                hostType: 'X86',
                /*进度条进度*/
                percent: 0,
                /*两张表格的key*/
                tableKey1: '',
                tableKey2: '',
                /*表格显示*/
                showTableFlag: false,
                /*两张表格对象*/
                x86HostTable: new PageParams({
                    size: 5,
                    pageSizeOpts: [5,10,20]
                }),
                powerHostTable: new PageParams({
                    size: 5,
                    pageSizeOpts: [5,10,20]
                }),
                checkProgressFlag: false,
                checkServerFlag: false,
                showProgress: false,// 是否显示进度条
                x86Arr: [],
                powerArr: [],
                hostColumnExample: [
                    {
                        title: '虚拟机名称',
                        key: 'serverName',
                        ellipsis: true,
                        width: 180,
                        render: (h, params) => {
                            let serverName = params.row.serverName;
                            return h('span', {
                                attrs: {
                                    title: serverName
                                },
                                class: ['cell-info-active'],
                                on: {
                                    click: () => {
                                        let {serverId, resourceId, createDate,type} = params.row;
                                        let obj = {
                                            time: '过去八小时',//这个时间是进入详细页面之后，图表的展示时间段，不管选了哪个时间段，进入都默认先展示8小时
                                            type: type,
                                            createDate,
                                            serverId,
                                            resourceId
                                        };
                                        this.getHostDetailInfo(obj);
                                    }
                                }
                            }, serverName);
                        }
                    },
                    {
                        title: '用户',
                        key: 'username',
                        ellipsis: true,
                        width: 80,
                        render: this.tableRender('username')
                    },
                    {
                        title: '创建时间',
                        key: 'createDate',
                        ellipsis: true,
                        width: 140,
                        render: this.tableRender('createDate')
                    },
                    {
                        title: '状态',
                        key: 'status',
                        ellipsis: true,
                        width: 100,
                        render: (h, params) => {
                            let status = params.row.status.toLowerCase(),
                                arr = this.getStatusInfo(status, ServerStatus);
                            let text = arr.length > 0 ? arr[0].label : '未知状态',
                                color = arr.length > 0 ? arr[0].color : '#ffa904';
                            return h('div',
                                {
                                    class: 'ivu-table-cell-ellipsis',
                                    style: {
                                        color: color
                                    },
                                    attrs: {title: text}
                                },
                                [
                                    h('div', {
                                        class: 'cds-status-dot',
                                        style: {
                                            backgroundColor: color
                                        }
                                    }),
                                    h('span', {
                                        style: {
                                            'margin-left': '6px'
                                        }
                                    }, text)
                                ]
                            );
                        }
                    },
                    {
                        title: 'CPU使用率',
                        key: 'cpu',
                        ellipsis: true,
                        render: (h, param) => {
                            if (param.row.cpu === null || param.row.cpu === undefined) return '';
                            let cpu = (param.row.cpu).toFixed(2) + '%';
                            return h('div', {
                                'class': {tableInfo: true},
                                attrs: {title: cpu},
                            }, cpu)
                        }
                    },
                    {
                        title: '内存使用率',
                        key: 'memory',
                        ellipsis: true,
                        render: (h, param) => {
                            if (param.row.memory === null || param.row.memory === undefined) return '';
                            let memory = (param.row.memory).toFixed(2) + '%';
                            return h('div', {
                                'class': {tableInfo: true},
                                attrs: {title: memory},
                            }, memory)
                        }
                    },
                    {
                        title: '磁盘写入速率',
                        key: 'diskWrite',
                        ellipsis: true,
                        render: (h, param) => {
                            if (param.row.diskWrite === null || param.row.diskWrite === undefined) return '';
                            let diskWrite = param.row.diskWrite.toFixed(2) + 'b/s';
                            return h('div', {
                                'class': {tableInfo: true},
                                attrs: {title: diskWrite},
                            }, diskWrite)
                        }
                    },
                    {
                        title: '磁盘读取速率',
                        key: 'diskRead',
                        ellipsis: true,
                        render: (h, param) => {
                            if (param.row.diskRead === null || param.row.diskRead === undefined) return '';
                            let diskRead = param.row.diskRead.toFixed(2) + 'b/s';
                            return h('div', {
                                'class': {tableInfo: true},
                                attrs: {title: diskRead},
                            }, diskRead)
                        }
                    },
                    {
                            title: '网卡传送速率',
                            key: 'netOutcome',
                            ellipsis: true,
                            render: (h, param) => {
                                let outgoing = param.row['netOutcome'];
                                if (outgoing !== null) {
                                    outgoing = outgoing.toFixed(2) + 'b/s';
                                }
                                return h('div', {
                                    'class': {tableInfo: true},
                                    attrs: {title: outgoing},
                                }, outgoing)
                            }
                        }, {
                            title: '网卡接收速率',
                            key: 'netIncome',
                            ellipsis: true,
                            render: (h, param) => {
                                let incoming = param.row['netIncome'];
                                if (incoming !== null) {
                                    incoming = incoming.toFixed(2) + 'b/s';
                                }
                                return h('div', {
                                    'class': {tableInfo: true},
                                    attrs: {title: incoming},
                                }, incoming)
                            }
                        }
                ],
                machineFormItem: {
                    cpu: 30,
                    memory: 30,
                    diskRead: 10000,
                    diskWrite: 10000,
                    netIncome: 10000,
                    netOutcome: 10000,
                    info: '过去八小时'
                },
                ruleValidate: {
                    cpu: [
                        int({
                            message: '请输入大于0的值'
                        }),
                        max({
                            message: '最大值',
                            max: 100
                        })
                    ],
                    memory: [
                        int({
                            message: '请输入大于0的值'
                        }),
                        max({
                            message: '最大值',
                            max: 100
                        })
                    ],
                    diskRead: [
                        int({
                            message: '请输入大于0的值'
                        }),
                    ],
                    diskWrite: [
                        int({
                            message: '请输入大于0的值'
                        }),
                    ],
                    netIncome: [
                        int({
                            message: '请输入大于0的值'
                        }),
                    ],
                    netOutcome: [
                        int({
                            message: '请输入大于0的值'
                        }),
                    ]
                }
            }
        },
        methods: {
            /**
             * @description: 重置检测指标到默认值
             * @return: null
             */
            resetFormData(){
                this.$refs.formValidate.resetFields();
                this.machineFormItem.cpu = 30;
                this.machineFormItem.memory = 30;
                this.machineFormItem.diskRead = 10000;
                this.machineFormItem.diskWrite = 10000;
                this.machineFormItem.netIncome = 10000;
                this.machineFormItem.netOutcome = 10000;
            },
            /**
             * @description: 表格内容通用渲染函数,用来添加title
             * @param paramName {String} 字段名 
             * @return: VNode
             */
            tableRender(paramName) {
                return (h, params) => {
                    let param = params.row[paramName];
                    return h('span', {
                            attrs: {title: param}
                        },
                        param
                    );
                }
            },
            /**
             * @description: 切换X86虚拟机/Power虚拟机列表
             * @param name {String} 列表类别
             * @return: null
             */
            changeType(name) {
                this.hostType = name;
                this.handleResize();
            },
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
             * @description: 跳转页面
             * @param currentPage {Number} 当前页的页码
             * @param tablePage {Object} 分页对象
             * @return: null
             */
            changePage(currentPage, tablePage) {
                tablePage.current = currentPage;
                let pageSize = tablePage.size,
                    data = tablePage.getData();
                tablePage.showData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
            },
            /**
             * @description: 更改页数
             * @param pageSize {Number} 总页数
             * @param tablePage {Object} 分页对象
             * @return: null
             */
            changePageSize(pageSize, tablePage) {
                tablePage.size = pageSize;
                let currentPage = tablePage.current,
                    data = tablePage.data;
                tablePage.showData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
            },
            /**
             * @description: 切换到僵尸机详情页
             * @param param {Object} 查询僵尸机详情所需参数对象 
             * @return: null
             */
            getHostDetailInfo(param) {
                this.$nextTick(() => {
                    this.$router.push({
                        name: 'lazy-machine-check/detail',
                        params: param
                    });
                });
            },
           /**
             * @description: 根据table类型塞入数据并展示
             * @param type {String} 'x86'或'power'
             * @param dataArr {Array} 数据数组
             * @return: null
             */
            showHostByType(type, dataArr) {
                let hostTable = (type === 'X86' ? this.x86HostTable : this.powerHostTable);
                this.setTableData(hostTable, dataArr);
                this.showTableFlag = true;
            },
            /**
             * @description: 开始检测僵尸机
             * @return: null
             */
            startCheck() {
                this.showProgress = true;
                this.$loading.show();
                let validFlag = true;
                this.$refs.formValidate.validate((valid) => {
                    if (!valid) {
                        this.$Notice.error({desc: '参数填写错误！'});
                        this.$loading.hide();
                        validFlag = false;
                    }
                });
                if(!validFlag){
                    return;
                }
                this.checkProgressFlag = false;
                this.$nextTick(()=>{
                    this.$refs.progressComponent.initProgress(0, 0);
                    /*该定时器只是为了进度条的动画显示用*/
                    this.interval = setInterval(() => {
                        this.$http.get('/serverCheck/getProgress').then(({data}) => {
                            if(data.status){
                                if (data.data * 100 >= 100) {
                                    this.$refs.progressComponent.changeNum(100);
                                    this.checkProgressFlag = true;
                                    clearInterval(this.interval);
                                } else {
                                    this.$refs.progressComponent.changeNum(data.data * 100);
                                }
                            }else {
                                this.$loading.hide();
                                this.$refs.progressComponent.initProgress(0, 0);
                                clearInterval(this.interval);
                            }
                        })
                    }, 5000);
                    /*实际返回数据时成功提示需要按照该方法来*/
                    this.getData();
                });
            },
            /**
             * @description: 获取僵尸机数据
             * @return: null
             */
            getData() {
                this.checkServerFlag = false;
                this.$http.post('/serverCheck/listCheckServer', this.machineFormItem).then(({data}) => {
                    this.x86Arr = [];
                    this.powerArr = [];
                    if (data.status) {
                        if (data.data !== null && data.data.length > 0) {
                            data.data.forEach((value) => {
                                value.type === 'X86' ? (this.x86Arr.push(value)) : (this.powerArr.push(value));
                                this.x86HostTable.loading = false;
                                this.powerHostTable.loading = false;
                            });
                        }
                        this.checkServerFlag = true;
                    } else {
                        this.$refs.progressComponent.stopInterval();
                        clearInterval(this.interval);
                    }
                }).catch(() => {
                    this.$loading.hide();
                    clearInterval(this.interval);
                });
            },
            /**
             * @description: 给分页对象设置展示数据
             * @param tableObj {Object} 分页对象
             * @param dataArr {Array} 数据数组 
             * @return: null
             */
            setTableData(tableObj, dataArr){
                tableObj.data = dataArr;
                tableObj.total = dataArr.length;
                let pageSize = tableObj.size,
                    currentPage = tableObj.current;
                tableObj.showData = dataArr.slice((currentPage - 1) * pageSize, currentPage * pageSize);
            },
            /**
             * @description: 页面布局自适应函数
             * @return: null
             */
            handleResize() {
                let height = 200;
                let dom = document.getElementsByClassName('zombie-list')[0];
                if (dom !== null) {
                    height = dom.offsetHeight - 122;
                }
                if (this.hostType === 'X86') {
                    this.height1 = height;
                    this.height2 = 200;
                } else {
                    this.height2 = height;
                    this.height1 = 200;
                }
            }
        },
        watch: {
            checkProgressFlag(val) {
                if (val === true && this.checkServerFlag === true) {
                    this.$Notice.success({desc: '检测完毕！'});
                    this.showHostByType('X86', this.x86Arr);
                    this.showHostByType('POWER', this.powerArr);
                    this.$loading.hide();
                } else {
                    this.showHostByType('X86', []);
                    this.showHostByType('POWER', []);
                }
            },
            checkServerFlag(val) {
                if (val === true && this.checkProgressFlag === true) {
                    this.$Notice.success({desc: '检测完毕！'});
                    this.showHostByType('X86', this.x86Arr);
                    this.showHostByType('POWER', this.powerArr);
                    this.$loading.hide();
                } else {
                    this.showHostByType('X86', []);
                    this.showHostByType('POWER', []);
                }
            }
        },
        mounted() {
            on(window, 'resize', this.handleResize);
        },
        beforeRouteLeave(to,from,next){
            from.meta.keepAlive = false;
            next();
        },
        beforeDestory() {
            off(window, 'resize', this.handleResize);
        }
    }
</script>

<style scoped lang="less">
    @height1: 170px;
    @height2: 120px;
    .virtual-machine-container {
        position: relative;
        background-color: #fff;
        height: 100%;
        width: 100%;
        min-width: 960px;
        min-height: 514px;
        overflow: hidden;

        .virtual-machine-main {
            position: relative;
            height: 100%;
            width: 100%;
            border: 1px solid #d8e0eb;
            padding: 10px 15px;
            .reset-button {
                color: #2D8cF0;
                font-weight: normal;
                font-size: 12px;
                background: transparent;
                text-decoration: none;
                outline: none;
                cursor: pointer;
                &:hover {
                    color: #57a3f3;
                }
            }
        }

        .test-index {
            height: @height1;
            width: 100%;
            .group-text {
                position: absolute;
                right: 10px;
                display: inline-block;
                cursor: pointer;
            }
            .home-content {
                & > div {
                    width: 100%;
                    height: calc(~'100% / 2');
                    padding: 10px 0;
                }
                .index-item {
                    text-align: right;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span {
                        width: 120px;
                    }
                    /deep/ .ivu-form-item {
                        width: 100%;
                    }
                }
                .index-param {
                    display: block;
                    left: 0;
                    // width: 70%;
                    width: 240px;
                }
            }
        }
        .test-period {
            height: @height2;
            width: 100%;
            .check-time-container {
                display: flex;
                align-items: center;
                .check-time-select {
                    display: flex;
                    width: 500px;
                    label {
                        line-height: 32px;
                        width: 150px;
                        padding-right: 16px;
                        text-align: right;
                    }
                }
                .progress-container {
                    flex-grow:1;
                }
            }
        }
        .zombie-list {
            height: calc(~'100% - @{height1} - @{height2}');
            width: 100%;
            .table-contain {
                overflow: auto;
                padding: 7px 0;
            }
        }
    }

    .vertical-line {
        width: 1px;
        height: 10px;
        border: 1.5px solid red;
        margin-right: 10px;
    }

    .home-title {
        width: 100%;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #f3f6f8;
    }

    .home-content {
        width: 100%;
        height: calc(~'100% - 30px');
        padding-top: 10px;
    }


</style>