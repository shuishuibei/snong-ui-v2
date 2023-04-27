<!--
 * @Description: 退订主机弹出框组件
 * @Author: caiyijun
 * @Date: 2019-09-07 19:55:03
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-11-04 09:57:40
 -->
<!--cfw2157-->
<template>
    <div class="delete-host-model">
        <i-modal 
            scrollable
            title="选择可退订的硬盘和虚拟网卡"
            v-model="visible" 
            :mask-closable="false" 
            @on-cancel="closeModal" 
            :width="width">
            <div class="info-content">
                <i class="iconfont icon-tixingtishi"></i>
                <div class="content-div">注：X86虚拟机删除后，虚拟机系统盘上存储的数据将无法恢复</div>
            </div>
            <div style="text-align: left">
                <delete-table
                    ref="deleteDiskRef"
                    title="已挂载的X86硬盘列表："
                    @returnCheckArr="getDiskCheckArr"
                    :columns="diskColumns"
                    :url="diskUrl"
                    :select-change-call-back="diskSelectChangeCallBack">
                </delete-table>
            </div>
            <div style="text-align: left">
                <delete-table
                    ref="deleteNetWorkRef"
                    title="已挂载的虚拟网卡列表："
                    @returnCheckArr="getNetWorkCheckArr"
                    :columns="networkColumns"
                    :url="networkUrl"
                    :select-change-call-back="networkSelectChangeCallBack"
                    disabled-and-checked-field="createMode">
                </delete-table>
            </div>
            <div slot="footer">
                <i-button type="primary" @click.native="submit">确 认</i-button>
                <i-button @click="closeModal">取 消</i-button>
            </div>
        </i-modal>
    </div>
</template>

<script>
    import api from '../api';
    import emitter from '@/assets/js/emitter.js';
    import DeleteTable from './DeleteTable.vue'; 

    export default {
        mixins: [emitter],
        components: {
            DeleteTable
        },
        props: {
            width: {
                type: Number,
                default: 600
            }
        },
        data() {
            return {
                diskUrl: api.mountedDiskUrl,
                networkUrl: api.networkUrl,
                deleteParam: {
                    serverId: '',
                    portIds: [],
                    volumeIds: []
                },
                visible: false,
                diskColumns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    title: '名称',
                    key: 'name',
                    ellipsis: true,
                    render: this.tableRender('name')
                }, {
                    title: '容量(GB)',
                    key: 'size',
                    ellipsis: true,
                    render: this.tableRender('size')
                },{
                    title: '共享',
                    key: 'multiattach',
                    ellipsis: true,
                    filters: [{value: true, label: '是'},{value: false, label: '否'}], //必须同时配置filterRemote
                    filterMultiple: false, //筛选默认是多选的，需要手动关闭
                    filterRemote: function(value,key){
                        /* tablePage和getTableData都是定义在DeleteTable组件内的，因此需要使用function而非箭头函数 */
                        this.filterMap[key] = value[0];
                        this.tablePage.loading = true;
                        this.getTableData();
                    },
                    render: function(h, params) {
                        let multiattach = params.row.multiattach;
                        return h('span', {}, multiattach ? '是' : '否')
                    }
                }],
                networkColumns: [{
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },{
                    title: '名称',
                    key: 'name',
                    ellipsis: true,
                    render: this.tableRender('name')
                }, {
                    title: '私网IP地址',
                    key: 'ipAddress',
                    ellipsis: true,
                    render: this.tableRender('ipAddress')
                }, {
                    title: '网络',
                    key: 'networkName',
                    ellipsis: true,
                    render: this.tableRender('networkName')
                }]
            }
        },
        methods: {
            getDiskCheckArr(arr){
                this.deleteParam.volumeIds = arr;
            },
            getNetWorkCheckArr(arr){
                this.deleteParam.portIds = arr;
            },
            /**
             * @description: 硬盘多选改变回调
             * @param val {Array} 被选中的硬盘id数组 
             */
            diskSelectChangeCallBack(val){
                this.deleteParam.volumeIds = val;
            },
            /**
             * @description: 网卡多选改变回调
             * @param val {Array} 被选中的网卡id数组 
             */
            networkSelectChangeCallBack(val){
                this.deleteParam.portIds = val;
            },
            /**
             * @description: 提交删除主机请求
             * @return: null 
             */
            submit() {
                this.$loading.show();
                this.$http.post(api.deleteHostUrl,{
                    serverId: this.deleteParam.serverId,
                    portIds: this.deleteParam.portIds,
                    volumeIds: this.deleteParam.volumeIds
                }).then(({data})=>{
                    if(data.status){
                        this.closeModal();
                        this.$Notice.success({desc: data.message});
                        this.dispatch('CloudHost', 'refresh');
                    }
                    this.$loading.hide();
                })
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
             * @description: 展示弹出框初始化方法
             * @param id {String}
             * @return: null
             */
            showModal(id) {
                this.visible = true;
                this.deleteParam.serverId = id;
                this.$refs.deleteDiskRef.initData(id);
                this.$refs.deleteNetWorkRef.initData(id);
            },
            /**
             * @description: 关闭弹出框方法，重置弹出框内表格数据
             * @return: null
             */
            closeModal() {
                this.visible = false;
            }
        }
    }
</script>

<style lang="less" scoped>

    .info-content {
        color: #ff6600;
        padding: 10px;
        background-color: #fff0e1;
        position: relative;
        display: flex;
        align-items: center;
        
        .iconfont {
            align-self: flex-start;
            font-size: 18px;
            &:before {
                font-size: inherit !important;
            }
        }
        .content-div {
             line-height: 22px;
        }
    }

</style>
