<template>
    <Modal
        v-model="visible"
        :scrollable="true"
        class-name="vertical-center-modal"
        width="650px"
        :title="title"
        class="project-management-add-members">
        <div class="addMembers-top">
            <AutoComplete
                clearable
                v-model="inputValue"
                placeholder="请输入姓名进行查询"
                style="width: 260px;">
            </AutoComplete>
            <i-button class="cds-btn-search" type="primary" @click="handleSearch">
              <i class="iconfont icon-iconfontsousuo"></i>
            </i-button>
        </div>
        <Table ref="table"
               size="small"
               stripe
               :key="tableConfig.key"
               :loading="tableConfig.loading"
               :columns="tableConfig.columns"
               :data="tableConfig.data"
               @on-selection-change="selectionChange">
        </Table>
        <!-- 分页 -->
        <div class="page-wrapper clearfix">
            <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
            <div class="cds-float-right">
                <Page
                    show-sizer
                    placement="top"
                    :total="page.totalCount"
                    :current="page.currentPage"
                    :page-size="page.pageSize"
                    :page-size-opts="[5,10]"
                    @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                    @on-page-size-change="getTableData({pageSize: $event})">
                </Page>
            </div>
        </div>
        <div slot="footer" style="margin-top: 50px">
            <Button type="primary" @click.native="ok">确认</Button>
            <Button  @click="cancel" style="margin-left: 10px">取消</Button>
        </div>
    </Modal>
</template>
<script>
export default {
    name: "project-management-add-members",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // 默认选中项
        data: {
            type: Array,
            default:[]
        },
        title: {
            type: String,
            default: "选择成员"
        }
    },
    data() {
        return {
            visible: false, // 控制弹出框是否显示
            inputValue: "", // 搜索框中显示的值
            searchValue: "", // 实际点击查询按钮发送的值
            selectedList: [], // 选中项的ID
            // 表格配置信息
            tableConfig: {
                key: new Date().toString(), //表格的属性key
                loading: false, //表格是否加载中
                //表格列的配置描述
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户登录名',
                        key: 'loginName'
                    },
                    {
                        title: '姓名',
                        key: 'userName'
                    }
                ],
                data: []  //表格中的
            },
            // 分页
            page: {
                pageSize: 5, // 每页条数
                totalCount: 0, // 总数
                totalPage: 1, // 总页数
                currentPage: 1 // 当前页码
            },
        };
    },
    methods: {
        // 点击查询按钮触发
        handleSearch() {
            // 将输入框中的值首尾去空格后赋值给查询字段searchValue
            this.searchValue = this.inputValue.trim();
            this.getTableData({
                loading: true,
                pageSize: this.page.pageSize
            });
        },
        getTableData({loading = false, currentPage = 1, pageSize = 5} = {}) {
            if (loading) {
                //设置表格缓冲
                this.tableConfig.loading = loading;
                //将表格数据data设置为空数组
                this.tableConfig.data = [];
            }
            //设置分页每页条数
            this.page.pageSize = pageSize;
            //设置分页当前页
            this.page.currentPage = currentPage;
            //发送请求并且做相应处理
            this.$http.post(`/user/list/page`, {
                current: currentPage,
                orderMap: this.orderMap,
                pageSize: pageSize,
                searchMap: {
                    userName: this.searchValue
                }
            }).then(({data}) => {
                //请求状态status为true时的处理，为false不需要单独处理（因为在入口文件中已经做了全局处理）
                if (data.status) {
                    let resp = data.data;
                    //将获取的分页数据赋值给表格数据data
                    this.tableConfig.data = resp.records;
                    //设置分页总条数
                    this.page.totalCount = resp.total;
                    //设置分页总页数，当总页数为0时显示为1
                    this.page.totalPage = resp.pages ? resp.pages : 1;
                    // 设置选中
                    this.$nextTick(() => {
                        if(this.data.length > 0) {
                            this.data.forEach((choosedItem,choosedIndex)=>{
                                this.tableConfig.data.forEach((item,index)=>{
                                    if(item.userName == choosedItem.userName){
                                        this.$refs.table.$refs.tbody.objData[index]._isChecked = true;
                                    }
                                })
                            })
                        }
                    });
                }
                //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
                loading ? this.tableConfig.loading = false : '';
            })
        },
        getProjectMembers(){
            this.$http({
                method:'GET',
                url:'/user/list'
            }).then(({data})=>{
                if(data.status){
                    this.tableConfig.data = data.data;
                }
            })
        },
        /**
         * 当表格点击排序时触发
         * @param column {object} 当前列数据
         * @param key {string} 排序依据的指标，即当前列的key值
         * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
         */
        sortChange({column, key, order}) {
            let flag;
            // 将order转换为true或false，true为升序，false为降序
            switch (order) {
                case 'asc':
                    flag = true;
                    break;
                case 'desc':
                    flag = false;
                    break;
                case 'normal':
                default:
                    flag = undefined;
            }
            this.orderMap = {[key]: flag};
            this.getTableData({pageSize: this.page.pageSize});
        },
        // 表格选中时触发
        /* selectChange(selected) {
            selected.forEach((selectedItem) => {
                let index = this.selectedList.findIndex((item) => {
                    return item.id == selectedItem.id
                })
                if(index == -1){
                    this.selectedList.push(selectedItem);
                }
            })
        },
        cancelSelectChange(selected) {
            this.tableConfig.data.forEach((item,index)=>{
                if(this.$refs.table.$refs.tbody.objData[index]._isChecked === false){
                    let existIndex = this.selectedList.findIndex((selectedItem,selectedIndex)=>{
                        return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id
                    })
                    existIndex !== -1 ? this.selectedList.splice(existIndex,1) : null;
                }
            })
        }, */
        // 只要选中项发生变化
        selectionChange(selected){
            this.selectedList = this.data
            this.tableConfig.data.forEach((item,index)=>{
                if(this.$refs.table.$refs.tbody.objData[index]._isChecked === false) {
                    let existIndex = this.selectedList.findIndex((selectedItem,selectedIndex)=>{
                        return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id
                    });
                    existIndex !== -1 ? this.selectedList.splice(existIndex,1) : null;
                } else {
                    let existIndex = this.selectedList.findIndex((selectedItem,selectedIndex)=>{
                        return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id
                    });
                    existIndex == -1 ? this.selectedList.push(this.tableConfig.data[index]) : null;
                }
            })
        },
        ok() {
            this.visible = false;
            this.selectedList = this.data
            this.$emit('getMembersData',this.selectedList)
        },
        cancel() {
            //关闭对话框
            this.visible = false;
            //表单清空
            this.$emit("on-cancel");
        }
    },
    watch: {
        value(newVal) {
            if (newVal) {
                /*=== 可修改 start ===*/
                // this.getProjectMembers();
                this.getTableData();
                /*=== 可修改 end ===*/
                this.$Notice.destroy(); //清楚右上角提示信息
                this.visible = newVal; //显示对话框
            }
        },
        visible(newVal) {
            if (!newVal) {
                this.$emit("input", newVal);
            }
        }
    }
};
</script>

<style lang="less">
.project-management-add-members {
    .ivu-page {
        .ivu-page-item,.ivu-page-prev,.ivu-page-next,.ivu-page-item-jump-prev,.ivu-page-item-jump-next {
            margin: 0;
            min-width: 24px !important;
            height: 24px !important;
            line-height: 24px !important;
            border-radius: 3px;
        }
        .ivu-page-options {
            .ivu-select-selection {
                height: 24px;
                .ivu-select-selected-value {
                    height: 22px;
                    line-height: 22px;
                }
            }

        }
    }
}

</style>


<style lang="less" scoped>
.addMembers-top {
    margin-bottom: 15px;
}
/* 分页 */
.page-wrapper {
    position: relative;
    margin-top: 12px;
}
</style>
