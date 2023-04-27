<!--
 * @Description: 退订x86虚拟机弹出框里的表格组件
 * @Author: caiyijun
 * @Date: 2019-10-28 16:24:21
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-11-01 14:38:39
 -->
<template>
    <div>
        <span class="table-title">
            {{title}}
        </span>
        <i-table 
            stripe
            size="small"
            :key="key"
            :height="height"
            :columns="columns"
            @on-selection-change="selectionChange"
            @on-select="handleSelectSingle"
            @on-select-cancel="handleSelectSingleCancel"
            @on-select-all="handleSelectAll"
            @on-select-all-cancel="handleSelectAllCancel"
            :data="tablePage.showData"
            :loading="tablePage.loading">
        </i-table>
        <div class="cds-clearfix cds-margin-top-14">
            <div class="cds-float-left">
                共有{{tablePage.total}}条记录，当前页{{tablePage.current}}/{{tablePage.getPageNum()}}页
            </div>
            <div class="cds-float-right">
                <i-page 
                    show-sizer
                    size="small"
                    placement="top"
                    @on-change="changePage($event, tablePage)"
                    @on-page-size-change="changePageSize($event, tablePage)"
                    :current="1"
                    :total="tablePage.total"
                    :page-size="tablePage.size"
                    :page-size-opts="tablePage.pageSizeOpts">
                </i-page>
            </div>
        </div>
    </div>
</template>

<script>
    import { PageParams } from '@/assets/js/page-params.js';
    import tableSelectAllMixins from '@/assets/js/table-select-all-mixins.js';

    export default {
        mixins: [tableSelectAllMixins],
        props: {
            title: {
                type: String,
                default: ''
            },
            columns: {
                type: Array,
                default: ()=>{
                    return []
                }
            },
            url: {
                type: String,
                default: ''
            },
            selectChangeCallBack: {
                type: Function,
                default: ()=>{
                    return ()=>{}
                }
            },
            disabledAndCheckedField: {
                type: String,
                default: 'true'
            }
        },
        data(){
            return {
                queryFlag: false,
                disableItemArr: [],
                key: '',
                height: 112,
                filterMap: {}, //表格筛选参数
                serverId: '',
                tablePage: new PageParams({size: 2,pageSizeOpts: [2, 5, 10]}),
                defaultCheckedArr: [],
                selectTableConfig: {
                    tableKey: 'id',
                    dataKey: 'tablePage.showData',
                    disabledKey: this.disabledAndCheckedField
                }
            }
        },
        methods: {
            initData(id=''){
                this.selectAll = [];
                this.disableItemArr = [];
                this.height = 112;
                this.serverId = id;
                this.filterMap = {};
                this.defaultCheckedArr = [];
                this.key = new Date() + Math.random();
                this.tablePage = new PageParams({size: 2,pageSizeOpts: [2, 5, 10]});
                this.getTableData();
            },
            getTableData(){
                if(this.queryFlag){
                    return;
                }else {
                    this.queryFlag = true;
                    setTimeout(()=>{
                        this.queryFlag = false;
                    },300);
                }
                let _this = this;
                this.tablePage.loading = true;
                this.$http.post(this.url + this.serverId, {
                        current: this.tablePage.current,
                        pageSize: this.tablePage.size,
                        searchMap: {
                            ...this.filterMap
                        }
                    }).then(({data}) => {
                        if (data.status) {
                            let temp = data.data;
                            _this.tablePage.showData = temp.records;
                            _this.tablePage.size = temp.size;
                            _this.tablePage.total = temp.total;
                            _this.tablePage.current = temp.current;
                            if(_this.disabledAndCheckedField !== 'true'){
                                temp.records.forEach((value)=>{
                                    if(!value[_this.disabledAndCheckedField]){
                                        _this.selectAll.push(value.id);
                                        _this.disableItemArr.push(value.id);
                                    }
                                });
                                _this.disabledSelectSingle();// 根据selectTableConfig里的disableKey，致灰对应数据
                            }
                            _this.defaultSelect();// 根据selectAll，默认选中对应数据
                        } 
                        /* 从所有选中的id数组(不管是否致灰)中剔除 致灰选中的id */
                        let returnArr = _this.selectAll.filter((item)=>{
                            return !_this.disableItemArr.includes(item);
                        })
                        _this.$emit('returnCheckArr',returnArr);
                        _this.tablePage.loading = false;
                })
            },
            /**
             * @description: 全选、单选由混合方法处理,此处只需将选中项变化传递给父组件即可
             * @return: null
             */
            selectionChange(){
                let returnArr = this.selectAll.filter((item)=>{
                    return !this.disableItemArr.includes(item);
                })
                this.selectChangeCallBack(returnArr);
            },
            changePage(currentPage,tablePage) {
                tablePage.current = currentPage;
                this.getTableData();
            },
            changePageSize(pageSize,tablePage) {
                tablePage.size = pageSize;
                if (pageSize >= 5) {
                    this.height = 232;
                }else {
                    this.height = 112;
                }
                setTimeout(()=>{
                    this.getTableData();
                },300);
            }
        }
    }

</script>

<style lang="less" scoped>
    .table-title {
        line-height: 40px;
    }
</style>