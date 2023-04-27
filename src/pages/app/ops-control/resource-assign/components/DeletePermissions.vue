<template>
    <Modal
        v-model="visible"
        :scrollable="true"
        class-name="vertical-center-modal"
        width="800px"
        :title="title"
        class="assign-permissions">
      <div class="model-high">
            <div class="permissions-top">
                <AutoComplete
                    clearable
                    v-model="inputValue"
                    placeholder="请输入姓名进行查询"
                    style="width: 220px;">
                </AutoComplete>
                <Button type="primary" @click="handleSearch" style="width: 40px;">
                    <i class="iconfont icon-iconfontsousuo"></i>
                </Button>
            </div>
            <Table ref="table"
                size="small"
                stripe
                :key="tableConfig.key"
                :loading="tableConfig.loading"
                :columns="getColumns"
                :data="tableConfig.data"
                @on-selection-change="selectionChange"
                   @on-sort-change="sortChange">
            </Table>
            <!-- 分页 -->
            <div class="page-wrapper clearfix">
                    <div class="float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
                    <div class="float-right">
                        <Page
                            show-sizer
                            placement="top"
                            :total="page.totalCount"
                            :current="page.currentPage"
                            :page-size="page.pageSize"
                            :page-size-opts="[5,10,20,50]"
                            @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                            @on-page-size-change="getTableData({pageSize: $event})">
                        </Page>
                    </div>
                </div>
          </div>
        <div slot="footer" v-show="!selected">
            <Button type="primary" @click.native="ok">确认</Button>
            <Button @click="cancel" style="margin-left: 30px">取消</Button>
        </div>
    </Modal>
</template>
<script>
const AuthType = [
  {
    value: 0,
    label: '非root权限'
  },
  {
    value: 1,
    label: 'root权限'
  }]
export default {
    name: "delete-permissions",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        data: {
          type: Object
        },
        selected: {
          type: Boolean,
        },
        title: {
            type: String,
            default: "删除权限"
        }
    },
    data() {
        return {
            visible: false, // 控制弹出框是否显示
            inputValue: "", // 搜索框中显示的值
            searchValue: "", // 实际点击查询按钮发送的值
            selectedList: [], // 选中项的信息
            selectedIdList: [], // 选中项的ID信息
            // 表格配置信息
            tableConfig: {
                key: new Date().toString(), //表格的属性key
                loading: false, //表格是否加载中
                //表格列的配置描述
                // columns: getColumns(),
                data: []  //表格中的
            },
          filterMap: {},  //表格筛选参数
            // 分页
            page: {
                pageSize: 5, // 每页条数
                totalCount: 0, // 总数
                totalPage: 1, // 总页数
                currentPage: 1 // 当前页码
            },
            startTimeOptions: {}, // 生效时间可选项
            endTimeOptions: {},   // 失效时间可选项
        };
    },
  computed: {
     getColumns(){
       let columns = [
         {
           type: 'selection',
           width: 60,
           align: 'center'
         },
         // {
         //     title: '账号',
         //     key: 'userId'
         // },
         {
           title: '姓名',
           key: 'userName'
         },
         {
           title: '权限级别',
           key: "authType",
           width: 120,
           resizable: true,
           ellipsis: true,
           filters: AuthType,
           filterMultiple: false,
           filterRemote: ([value], key) => {
             this.filterMap[key] = value;
             this.handlerChangePage({ pageSize: this.page.pageSize });
           },
           render: (h, { row: { authType } }) => {
             let tmp = AuthType.filter((item) => item.value === authType), text = '';
             if (tmp.length > 0) {
               text = tmp[0].label
             }
             return h(
               "span",
               {
                 attrs: {
                   title: text,
                 }
               },
               text
             );
           },
         },
         {
           title: '生效时间',
           key: 'effectiveTime'
         }
         ,
         {
           title: '失效时间',
           key: 'invalidTime'
         }
       ]
       if (this.selected) {
         columns.shift();
       }
       return columns;
     }
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
      /**
       * @description 分页切换时触发的方法
       * @param {object} option
       * @param {number} option.current
       * @param {number} option.pageSize
       * @returns {void}
       */
      handlerChangePage({ current = 1, pageSize = 10 } = {}) {
        this.page.current = current;
        this.page.pageSize = pageSize;
        this.getTableData({pageSize: this.page.pageSize});
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
            this.$http.post(`host/grant/${this.data.id}/user/list`, {
                current: currentPage,
                orderMap: this.orderMap,
                pageSize: pageSize,
                searchMap: {
                    userName: this.searchValue,
                    ...this.filterMap
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
                        if(this.selectedIdList.length > 0) {
                            this.selectedIdList.forEach((choosedItem,choosedIndex)=>{
                                this.tableConfig.data.forEach((item,index)=>{
                                    if(item.userId == choosedItem){
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
        // 只要选中项发生变化
        selectionChange(){
            this.tableConfig.data.forEach((item,index)=>{
                if(this.$refs.table.$refs.tbody.objData[index]._isChecked === false) {
                    let existIndex = this.selectedList.findIndex((selectedItem,selectedIndex)=>{
                        return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id
                    });
                    if(existIndex !== -1) {
                        this.selectedList.splice(existIndex,1)
                        this.selectedIdList.splice(existIndex,1)
                    }
                } else {
                    let existIndex = this.selectedList.findIndex((selectedItem,selectedIndex)=>{
                        return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id
                    });
                    if(existIndex == -1) {
                        this.selectedList.push(this.tableConfig.data[index])
                        this.selectedIdList.push(this.tableConfig.data[index].userId)
                    }
                }
            })
        },
        ok() {
          // 发送请求，this.formObject是账户权限，生效时间，失效时间，权限说明的数据
          // this.selectedIdList是表格所选项的id数据,如果不想传id可以把这个文件中的所有id改为想传的字段名，例如userName
          // 左侧的selected等是 后端定义传的字段名，右侧是用户填写的值
          // 账户权限是 设置的选择Root权限传1，非Root权限传0，这个值可在<Radio :label="1">中，改变label的值
          if (this.selectedIdList.length === 0) {
            this.$Notice.error({
              desc: '请选择用户'
            });
          } else {
            this.$http.post(`host/cancel/${this.data.id}/user`, this.selectedIdList)
              .then(({data}) => {
                if (data.status) {
                  // 分配权限成功后的提示信息
                  this.$Notice.success({
                    desc: '取消权限成功'
                  });
                  this.$parent.getTableData({loading: true}); // 更新父组件的最新数据
                  this.visible = false; // 关闭对话框
                } else {
                  // 分配权限失败后的提示信息
                  this.$Notice.error({
                    desc: '取消权限失败'
                  });
                }
              })
          }
        },
        cancel() {
            // 关闭对话框
            this.visible = false;
            // 表单清空
            // this.$refs['form'].resetFields();
            this.$emit("on-cancel");
          this.selectedList = [];
          this.selectedIdList = [];
        }
    },
  watch: {
        value(newVal) {
          this.selectedList = [];
          this.selectedIdList = [];
          this.searchValue = this.inputValue = '';
            if (newVal) {
                /*=== 可修改 start ===*/
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

<style lang="less" scoped>
.permissions-top {
    margin-bottom: 15px;
}
.model-high {
  max-height:660px;
  overflow-y:auto;
  overflow-x:hidden;
}
.user-table {
  border: 1px solid #dcdee2;
  border-radius: 5px;
  padding: 10px
}
/* 分页 */
.page-wrapper {
    position: relative;
    margin-top: 12px;
}
</style>
