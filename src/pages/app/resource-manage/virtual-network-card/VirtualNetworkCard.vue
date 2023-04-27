<!--
 * @Description: 虚拟网卡主页面
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-11-04 09:55:54
 -->
<template>
    <div class="cds-wrapper cds-border cds-padding-14">
        <div class="cds-clearfix cds-margin-bottom-14">
            <div class="cds-float-left-btn">
                <i-input
                    clearable
                    class="cds-input-search"
                    v-model="queryName"
                    placeholder="请输入虚拟网卡名称进行查询">
                </i-input>
                <i-button type="primary" class="cds-btn-search" @click="handleSearch">
                    <i class="iconfont icon-iconfontsousuo"></i>
                </i-button>
            </div>
            <div class="cds-float-right-btn">
                <i-button type="primary" @click="handleDelete">
                    <i class="iconfont icon-tuihuozhong">批量退订</i>
                </i-button>
                <i-button class="cds-btn-refresh" @click="refresh">
                    <i class="iconfont icon-shuaxin1 iconfont-normal"></i>
                </i-button>
            </div>
        </div>
        <div>
            <i-table
                    stripe
                    highlight-row
                    :key="tableKey"
                    :data="networkTable.showData"
                    :columns="netWorkColumns"
                    :loading="networkTable.loading"
                    no-data-text="暂无数据"
                    @on-select="handleSelectSingle"
                    @on-select-cancel="handleSelectSingleCancel"
                    @on-select-all="handleSelectAll"
                    @on-select-all-cancel="handleSelectAllCancel"
                    @on-sort-change="sortChange">
            </i-table>
        </div>
        <div class="cds-clearfix cds-margin-top-14">
            <div class="cds-float-left">
                共有{{networkTable.total}}条记录，当前页{{networkTable.current}}/{{networkTable.getPageNum()}}页
            </div>
            <div class="cds-float-right">
                <i-page
                    show-sizer
                    placement="top"
                    :total="networkTable.total"
                    :current="networkTable.current"
                    :page-size="networkTable.size"
                    :page-size-opts="networkTable.pageSizeOpts"
                    @on-page-size-change="changePageSize($event, networkTable)"
                    @on-change="changePage($event, networkTable)">
                </i-page>
            </div>
        </div>

        <h3c-modal-table
            ref="loadHostModal"
            title="挂载虚拟网卡"
            placeholder="请输入X86虚拟机名称进行查询"
            :tips-flag="false"
            query-key="serverName"
            :url="hostUrl"
            :width="800"
            :query-flag="true"
            :table-item="hostItem">
        </h3c-modal-table>

        <h3c-modal-confirm
            title="卸载虚拟网卡"
            :value="flag.deletePort"
            :info="'确认卸载选中的虚拟网卡：' + deleteParam.name"
            warning="注: OpenStack自动新建的虚拟网卡卸载时会被删除。虚拟机卸载网卡之后，如需再加载网卡请重启虚拟机，否则会导致加载失败"
            @on-cancel="flag.deletePort = false"
            @on-ok="makeSure('delete')">
        </h3c-modal-confirm>

        <h3c-modal-confirm
            title="退订虚拟网卡"
            :value="flag.unsubscribePort"
            :info="'确认退订选中的虚拟网卡：' + unsubscribeParam.name"
            @on-cancel="flag.unsubscribePort = false"
            @on-ok="makeSure('unsubscribe')">
        </h3c-modal-confirm>

        <h3c-modal-confirm
            width="580"
            title="退订虚拟网卡"
            :value="flag.batchUnsubscribePort"
            :info="'确认退订选中的虚拟网卡（数量：'+selectAll.length+'）'"
            @on-cancel="flag.batchUnsubscribePort = false"
            @on-ok="doDeleteServer">
        </h3c-modal-confirm>

        <h3c-modal-detail
            v-model="detailsInfo"
            title="虚拟网卡基本信息"
            :data="transferDetailData"
            label-width="140"
            :rows="detailRows">
        </h3c-modal-detail>
    </div>
</template>

<script>
    import emitter from '@/assets/js/emitter.js';
    import { formatDate } from '@/assets/js/utils';
    import {PageParams} from '@/assets/js/page-params.js';
    import {VirtualNetworkStatus} from '@/assets/js/status/index.js';
    import H3cModalDetail from '@/components/h3c-modal-detail/H3cModalDetail.vue';
    import H3cModalTable from '@/components/h3c-modal-table/H3cModalTable.vue';
    import PwdInput from './components/PwdInput.vue';
    import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
    import tableSelectAllMixins from '@/assets/js/table-select-all-mixins.js';

    export default {
        name: 'VirtualNetworkCard',
        mixins: [emitter,tableSelectAllMixins],
        components: {
            'h3c-modal-table': H3cModalTable,
            'h3c-modal-confirm': H3cModalConfirm,
            'h3c-modal-detail': H3cModalDetail
        },
        data() {
            return {
                queryFlag: false,
                flag: {
                    mount: false,
                    deletePort: false,
                    unsubscribePort: false,
                    batchUnsubscribePort: false,
                },
                searchValue: '',
                // 输入的密码
                vmWarePassword: '',
                // 被操作主机的virtType
                virtType: '',
                /*排序对象*/
                orderMap: {},
                hostFilter: {},
                /*挂载参数*/
                mountParam: {
                    serverId: '',
                    portId: '',
                    serverName: ''
                },
                /*卸载参数*/
                deleteParam: {
                    serverId: '',
                    portId: '',
                    name: ''
                },
                /*退订参数*/
                unsubscribeParam: {
                    name: ''
                },
                transferDetailData: {},
                detailRows: [
                    {
                        title: '虚拟网卡名称',
                        key: 'name'
                    },
                    {
                        title: 'IP地址',
                        key: 'ipAddress'
                    },
                    {
                        title: '网络',
                        key: 'networkName'
                    },
                    {
                        title: '网络地址',
                        key: 'cidr'
                    },
                    {
                        title: 'MAC地址',
                        key: 'macAddress'
                    },
                    {
                        title: '关联X86虚拟机',
                        key: 'serverName'
                    }
                ],
                queryName: '',
                /*单个退订的id*/
                selectId: '',
                tableKey: '',
                detailsInfo: false,
                hostUrl: '/server/list/port/page',
                networkTable: new PageParams(),
                selectTableConfig: {
                    tableKey: 'id',
                    dataKey: 'networkTable.showData',
                    disableKey: 'true'
                },
                hostItem: [
                {
                    title: 'X86虚拟机名称',
                    key: 'serverName',
                    ellipsis: true,
                    render: this.tableRender('serverName')
                },{
                    title: '网络',
                    key: 'netName',
                    ellipsis: true,
                    render: this.tableRender('netName')
                }, {
                    title: '挂载',
                    width: 80,
                    render: (h, params) => {
                        return h('i', {
                            'class': ['iconfont', 'icon-738bianjiqi_chaolianjie'],
                            on: {
                                click: () => {
                                    this.vmWarePassword = params.row.vmWarePassword;
                                    this.mountParam.serverId = params.row.id;
                                    this.mountParam.serverName = params.row.serverName;
                                    this.makeSure('mount');
                                }
                            }
                        });
                    }
                }],
                netWorkColumns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    }, {
                        title: '名称',
                        key: 'name',
                        sortable: 'custom', //设置为custom，代表远程排序
                        minWidth: 120,
                        ellipsis: true,
                        render: (h, params) => {
                            let {id, name} = params.row;
                            return h('span', {
                                class: ['cell-info-active'],
                                attrs: {title: name},
                                on: {
                                    click: () => {
                                        this.$loading.show();
                                        this.$http.get(`/port/${id}`).then(({data})=>{
                                            if(data.status){
                                                this.transferDetailData = data.data;
                                                this.detailsInfo = true;
                                            }
                                            this.$loading.hide();
                                        });
                                        
                                    }
                                }
                            }, name)
                        }
                    }, {
                        title: '状态',
                        key: 'status',
                        ellipsis: true,
                        filterMultiple: false,
                        filters: VirtualNetworkStatus,
                        filterRemote: (filters) => {
                            this.networkTable.current = 1;
                            this.filterStatusRemote(filters, 'status');
                        },
                        render: (h, params) => {
                            if(!params.row.status){
                                return '';
                            }
                            let status = params.row.status.toLowerCase(),
                                arr = this.getStatusInfo(status,VirtualNetworkStatus);
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
                                            'vertical-align': 'middle'
                                        }
                                    }, text)
                                ]
                            );
                        }
                    },
                    {
                        title: 'IP地址',
                        key: 'ipAddress ',
                        ellipsis: true,
                        render: this.tableRender('ipAddress')
                    },
                    {
                        title: '网络',
                        key: 'networkName',
                        ellipsis: true,
                        render: this.tableRender('networkName')
                    },
                    {
                        title: '关联虚拟机',
                        key: 'serverName',
                        ellipsis: true,
                        render: this.tableRender('serverName')
                    },
                    {
                        title: '关联虚拟机',
                        key: 'serverName',
                        ellipsis: true,
                        render: this.tableRender('serverName')
                    },
                    {
                        title: '创建时间',
                        ellipsis: true,
                        key: 'createDate',
                        sortable: 'custom', //设置为custom，代表远程排序
                        render: (h, params) => {
                            let date = formatDate(params.row.createDate);
                            //将时间格式化
                            return h(
                            'span',
                            {
                                attrs: {
                                title: date
                                }
                            },
                            date
                            );
                        }
                    },
                    {
                        title: '挂载',
                        width: 50,
                        align: 'center',
                        render: (h, params) => {
                            let {networkId, status} = params.row;
                            if (status === 'UNMOUNT') {
                                return h('i', {
                                    'class': ['iconfont', 'icon-738bianjiqi_chaolianjie'],
                                    on: {
                                        click: () => {
                                            this.hostUrl = `/server/list/port/page/${networkId}/`;
                                            this.mountParam.portId = params.row.id;
                                            this.$refs.loadHostModal.showModal();
                                            let tableItem = {
                                                title: '虚拟机密码',
                                                key: 'password',
                                                width: 150,
                                                render: (h, params) => {
                                                    return h('div', {}, [
                                                        h(PwdInput,{
                                                            on: {
                                                                'inputPwd': (event)=>{
                                                                    params.row.vmWarePassword = event;
                                                                }
                                                            }
                                                        })
                                                    ])
                                                }
                                            };
                                            let arr = this.hostItem.filter(function (value) {
                                                return value.key === 'password';
                                            });
                                            this.virtType = params.row.virtType;
                                            if (this.virtType === 'VMware') {
                                                /*需要有密码但是没有密码时需要添加*/
                                                if (arr.length === 0) {
                                                    this.hostItem.splice(2, 0, tableItem);
                                                }
                                            } else {
                                                /*不需要密码但是有虚拟机密码要删除*/
                                                if (arr.length !== 0) {
                                                    this.hostItem.splice(2, 1);
                                                }
                                            }
                                        }
                                    }
                                });
                            } else {
                                return h('i', {
                                    'class': ['iconfont', 'icon-738bianjiqi_chaolianjie cds-grey-icon']
                                });
                            }
                        }
                    },
                    {
                        title: '卸载',
                        width: 50,
                        align: 'center',
                        render: (h, params) => {
                            let {status, name} = params.row;
                            if (status === 'MOUNTED') {
                                return h('i', {
                                    'class': ['iconfont', 'icon-739bianjiqi_qingchuchaolianjie'],
                                    on: {
                                        click: () => {
                                            this.deleteParam.name = name;
                                            this.deleteParam.serverId = params.row.serverId;
                                            this.deleteParam.portId = params.row.id;
                                            this.flag.deletePort = true;
                                        }
                                    }
                                })
                            } else {
                                    return h('i', {
                                        'class': ['iconfont', 'icon-739bianjiqi_qingchuchaolianjie cds-grey-icon']
                                    });
                            }
                        }
                    },
                    {
                        title: '退订',
                        width: 50,
                        align: 'center',
                        render: (h, params) => {
                            let serverName = params.row.serverName,
                                name = params.row.name;
                            if (serverName === null || serverName === '') {
                                return h('i', {
                                    'class': ['iconfont', 'icon-tuihuozhong'],
                                    on: {
                                        click: () => {
                                            this.unsubscribeParam.name = name;
                                            this.selectId = params.row.id;
                                            this.flag.unsubscribePort = true;
                                        }
                                    }
                                });
                            } else {
                                return h('i', {
                                    'class': ['iconfont', 'icon-tuihuozhong cds-grey-icon']
                                });
                            }
                        }
                    }
                ]
            }
        },
        methods: {
             /**
             * @description: 状态远程过滤方法
             * @param filters {Array} 状态数组
             * @param key {String} 状态字段
             */
            filterStatusRemote(filters, key) {
                this.hostFilter[key] = filters[0];
                this.selectAll = [];
                this.getNetWork();
            },
            /**
             * @description:点击排序时触发
             * @param option {Object} 排序信息对象
             * @return: null
             */
            sortChange(option) {
                this.orderMap = {};
                this.networkTable.current = 1;  //改编页码时跳转到第一页
                let order;
                if (option.order === 'asc') {
                    order = true;
                } else if (option.order === 'desc') {
                    order = false;
                } else {
                    order = undefined;
                }
                this.$set(this.orderMap, option.key, order);
                this.selectAll = [];
                //重新加载数据
                this.getNetWork();
            },
            /**
             * @description: 跳转页面
             * @param currentPage {Number} 当前页码
             * @param tablePage {Object} 分页对象
             * @return: null
             */
            changePage(currentPage, tablePage) {
                tablePage.current = currentPage;
                this.getNetWork();
            },
            /**
             * @description: 更改每页分页数
             * @param pageSize {Number} 每页分页数
             * @param tablePage {Object} 分页对象
             * @return: null
             */
            changePageSize(pageSize, tablePage) {
                tablePage.size = pageSize;
                this.$nextTick(()=>{
                    this.getNetWork();
                });
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
            /**
             * @description: 给表格内数据添加title属性
             * @param paramName {String} 参数名
             * @return: render回调函数
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
             * @description: 确认执行挂载到x86虚拟机|退订虚拟网卡|卸载虚拟网卡
             * @param {String} mount|unsubscribe|delete
             * @return: null
             */
            makeSure(key) {
                this.$loading.show();
                /*卸载*/
                if (key === 'delete') {
                    this.$http.delete(`/port/unMount/${this.deleteParam.serverId}/${this.deleteParam.portId}`).then(({data}) => {
                        this.flag.deletePort = false;
                        if (data.status) {
                            this.$Notice.success({desc: '卸载成功！'});
                            this.getNetWork();
                        }
                        this.$loading.hide();
                    })
                /*退订单个*/
                } else if (key === 'unsubscribe') {
                    this.$http.post('/port/delete/batch', [this.selectId]).then(({data}) => {
                        this.flag.unsubscribePort = false;
                        if (data.status) {
                            this.$Notice.success({desc:  data.message});
                            this.getNetWork();
                        }
                        this.$loading.hide();
                    })
                } else if (key === 'mount') {
                    this.$http.post(`/port/mount/${this.mountParam.serverId}/${this.mountParam.portId}?password=${this.vmWarePassword}`).then(({data}) => {
                        if (data.status) {
                            this.$Notice.success({desc: '挂载成功！'});
                            this.$refs.loadHostModal.closeModal();
                            this.getNetWork();
                        }
                        this.$loading.hide();
                    })
                } else {
                    return;
                }
            },
            /**
             * @description: 批量退订虚拟网卡
             * @return: null
             */
            doDeleteServer() {
                this.$http.post('/port/delete/batch', this.selectAll).then(({data}) => {
                    if (data.status) {
                        if(data.message.length > 0){
                            this.$Notice.success({desc: data.message});
                        }else {
                            this.$Notice.success({desc: '批量退订成功！'});
                        }
                    }
                    this.$loading.hide();
                    this.flag.batchUnsubscribePort = false;
                    this.refresh();
                }).catch(() => {
                    this.$loading.hide();
                    this.flag.batchUnsubscribePort = false;
                });
            },
            /**
             * @description: 批量退订弹出框
             * @return: null
             */
            handleDelete() {
                if(this.selectAll.length ===0){
                    this.$Notice.warning({desc: '请至少选择一个虚拟网卡！'});
                }else{
                    this.flag.batchUnsubscribePort = true;
                }
            },
            /**
             * @description: 刷新页面
             * @return: null
             */
            refresh() {
                this.tableKey = new Date() + Math.random();
                this.searchValue = '';
                this.queryName = '';
                this.orderMap = {};
                this.selectAll = [];
                this.hostFilter = {};
                this.networkTable.current = 1;
                this.networkTable.showData = [];
                this.getNetWork();
            },

            /**
             * @description: 模糊查询
             * @return: null
             */
            handleSearch(){
                this.searchValue = this.queryName.trim();
                this.selectAll = [];
                this.getNetWork();
            },
            /**
             * @description: 查询虚拟网卡列表数据
             * @return: null
             */
            getNetWork() {
                /* 防止触发changePageSize时同时触发changePage事件，短时间内同时调用两次请求 */
                if(this.queryFlag){
                    return;
                }else {
                    this.queryFlag = true;
                    setTimeout(()=>{
                        this.queryFlag = false;
                    },300);
                }
                // this.$Notice.destroy();
                this.networkTable.loading = true;
                this.$http.post('port/list/page', {
                    searchMap: Object.assign({name: this.searchValue}, this.hostFilter),
                    orderMap: this.orderMap,
                    current: this.networkTable.current,
                    pageSize: this.networkTable.size
                }).then(({data}) => {
                    if (data.status) {
                        let records = data.data.records;
                        records.forEach((value) => {
                            if(this.selectAll.includes(value.id)){
                                value._checked = true;
                            }
                        });
                        this.networkTable.showData = records;
                        this.networkTable.size = data.data.size;
                        this.networkTable.total = data.data.total;
                        this.networkTable.current = data.data.current;
                    }
                    this.selectId = '';
                    this.networkTable.loading = false;
                }).catch(() => {
                    this.networkTable.loading = false;
                })
            },
            /**
             * @description: 根据表格头删除列，给挂载、卸载、退订设置权限时使用
             * @param title {String} 列表头字段
             * @return: null
             */
            deleteTableColumn(title) {
                let index = 0;
                this.netWorkColumns.map((value, key) => {
                    if (value.title === title) {
                        index = key;
                    }
                });
                if (index !== 0) {
                    this.netWorkColumns.splice(index, 1);
                }
            }
        },
        computed: {
            auths() {
                return this.$store.state.auth.auths
            }
        },
        created() {
            this.getNetWork();
        }
    }
</script>

<style lang="less" scoped>

    .cds-wrapper {
        /deep/.ivu-table .cds-grey-icon:hover:before {
            font-size: 18px;
        }
    }

    .virtual-refresh span {
        padding-left: 5px;
    }

    .iconfont-normal {
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        letter-spacing: 0;
    }

</style>
