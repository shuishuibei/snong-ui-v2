<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <!-- 头部搜索和按钮操作 -->
    <div >
      <!-- 搜索 -->
      <div class="cds-clearfix cds-margin-bottom-14">
                <!-- 项目名称自动补全搜索 -->
                <AutoComplete
                    clearable
                    v-model="projectName"
                    :data="projectNamesList"
                    :filter-method="filterMethod"
                    @on-select="handleSearch"
                    placeholder="请输入项目名称进行查询"
                    style="width:230px">
                </AutoComplete>
                <Input
                    clearable
                    v-model="managerName"
                    placeholder="请输入项目经理名称"
                    style="width: 160px;margin-right: 0;" />
              <i-button
                class="cds-btn-search"
                type="primary"
                @click="handleSearch">
                <i class="iconfont icon-iconfontsousuo"></i>
              </i-button>
            <!-- 按钮操作 -->
            <div class="cds-float-right">
              <i-button type="primary"  @click="handleAdd">
                <i class="iconfont icon-plus">新增</i>
              </i-button>
            <!--  <i-button type="primary"  @click="handleAllExport">
                <i class="iconfont icon-daochu">全部导出</i>
              </i-button>-->
              <i-button type="primary"  class="cds-btn-refresh" @click="handleRefresh">
                <i class="iconfont icon-shuaxin1"></i>
              </i-button>
            </div>
        </div>
        <!-- 表格 -->
        <Table ref="table"
               size="small"
               class="cds-margin-bottom-14"
               stripe
               :key="tableConfig.key"
               :loading="tableConfig.loading"
               :columns="tableConfig.columns"
               :data="tableConfig.data"
               @on-sort-change="sortChange"
               @on-selection-change="selectionChange">
        </Table>
        <!-- 分页 -->
        <div class="page-wrapper clearfix">
            <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
            <div class="cds-float-right">
                <Page :total="page.totalCount"
                      :current="page.currentPage"
                      :page-size="page.pageSize"
                      :page-size-opts="[10, 50, 100, 200]"
                      show-sizer
                      size="small"
                      placement="top"
                      @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                      @on-page-size-change="getTableData({pageSize: $event})">
                </Page>
            </div>
        </div>
    </div>
        <!-- 添加及修改计划 -->
        <project-management-edit-plan v-model="flag.addPlan" :title="transferTitle" :data="transferData"></project-management-edit-plan>
    </div>
</template>

<script>
import ProjectManagementEditPlan from './ProjectManagementEditPlan.vue' // 添加及修改计划
import * as CONST from './components/ProjectConst';
export default {
    components:{
        'project-management-edit-plan': ProjectManagementEditPlan,
    },
    data(){
        return {
            flag:{
                addPlan: false // 添加计划
            },
            // projectList: [],
            projectNamesList: [],
            managerName: '', // 搜索框中显示的值
            projectId: '', // 项目ID
            projectName: '', // 项目名称
            filterMap: {}, //表格筛选参数
            orderMap: {}, //表格排序参数
            // 分页
            page: {
                pageSize: 10,   // 每页条数
                totalCount: 0,  // 总数
                totalPage: 1,   // 总页数
                currentPage: 1  // 当前页码
            },
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
                        title: '项目名称',
                        key: 'projectName',
                        width: 250,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.projectName
                                },
                                style: {
                                    color: '#3399ff',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.$emit('shouldComponentShow','shouldBasicInfoShow',params.row);
                                    }
                                }
                            }, params.row.projectName);
                        }
                    },
                    {
                      title: '项目编号',
                      key: 'projectNo',
                      ellipsis: true,
                      sortable: 'custom',
                      render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.projectNo
                          },
                        }, params.row.projectNo);
                      }
                    },
                    {
                        title: '项目经理',
                        key: 'managerName',
                        // align: 'center',
                        ellipsis: true,
                        sortable: 'custom',
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.managerName
                                },
                            }, params.row.managerName);
                        }
                    },
                    {
                        title: '项目类型',
                        key: 'projectType',
                        filters: CONST.projectTypeList,
                        filterMultiple: false,
                        filterRemote: ([value], key) => {
                          this.filterMap[key] = value;
                          this.handlerChangePage({ pageSize: this.page.pageSize });
                        },
                        render: (h, params) => {
                            let projectType = params.row.projectType,
                                arr = CONST.projectTypeList.filter((item)=>{
                                    return item.value === projectType;
                                })[0]
                          if (!arr) arr = {value:'',label:''}
                            return h('span', {
                                attrs: {
                                    title: arr.label
                                },
                            }, arr.label);
                        }
                    },
                    {
                        title: '项目阶段',
                        key: 'projectProgress',
                        filters: CONST.projectProgressList,
                        filterMultiple: false,
                        filterRemote: ([value], key) => {
                          this.filterMap[key] = value;
                          this.handlerChangePage({ pageSize: this.page.pageSize });
                        },
                        render: (h,  { row: { projectProgress } }) => {
                          let node = CONST.projectProgressList.filter((item) => item.value === projectProgress)[0];
                          if (!node) node = { value: '0', label: '待启动',color: '#18ccc3'}
                            return h(
                                "div",
                                {
                                    class: "ivu-table-cell-ellipsis",
                                    style: {
                                        color: node.color
                                    },
                                    attrs: { title: node.label }
                                },
                                [ h("div", {
                                        class: "statusCircle",
                                        style: {
                                            backgroundColor: node.color
                                        }
                                    }),
                                    h(
                                        "span",
                                        {
                                            style: {
                                                "margin-left": "6px"
                                            }
                                        },
                                      node.label
                                    )
                                ]
                            );
                        }
                    },
                  {
                    title: '区域',
                    key: 'area',
                    ellipsis: true,
                    render: (h, params) => {
                      return h('span', {
                        attrs: {
                          title: params.row.area
                        },
                      }, params.row.area);
                    }
                  },
                  {
                    title: '行业',
                    key: 'projectTrade',
                    ellipsis: true,
                    render: (h, params) => {
                      return h('span', {
                        attrs: {
                          title: params.row.projectTrade
                        },
                      }, params.row.projectTrade);
                    }
                  },
                  {
                    title: '数据中心',
                    key: 'zoneNum',
                    ellipsis: true,
                    render: (h, params) => {
                      return h('span', {
                        attrs: {
                          title: params.row.zoneNum
                        },
                      }, params.row.zoneNum);
                    }
                  },
                    {
                        title: '创建日期',
                        key: 'createTime',
                        sortable: 'custom',
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.createTime
                                },
                            }, params.row.createTime);
                        }
                    },
                    {
                        title: '修改',
                        width: 64,
                        align: 'center',
                        render: (h, params) => {
                            let projectStyle = this.showOperator(params)
                            return h('div', [
                                    h('i', {
                                        style: {
                                            color: projectStyle.color,
                                        },
                                        class: projectStyle.classStyle,
                                        on: {
                                            click: () => {
                                                if (projectStyle.edit) {
                                                    this.$emit('shouldComponentShow','shouldEditShow',params.row);
                                                }
                                            }
                                        }
                                    })
                                ]
                            )
                        }
                    },

                    // {
                    //     title: '数据中心',
                    //     width: 84,
                    //     align: 'center',
                    //     render: (h, params) => {
                    //         let projectStyle = this.showOperator(params);
                    //         return h('div', [
                    //             h('i', {
                    //                 style: {
                    //                     color: projectStyle.color,
                    //                 },
                    //                 class: projectStyle.classStyle,
                    //                 on: {
                    //                     click: () => {
                    //                         if (projectStyle.edit) {
                    //                             this.transferData = params.row;
                    //                             this.transferData.mode = 'addPlan';
                    //                             this.transferTitle = '添加计划';
                    //                             this.flag.addPlan = true;
                    //                         }
                    //                     }
                    //                 }
                    //             })
                    //         ])
                    //     }
                    // },
                    // {
                    //     title: '修改计划',
                    //     width: 84,
                    //     align: 'center',
                    //     render: (h, params) => {
                    //         let projectStyle = this.showOperator(params);
                    //         return h('div', [
                    //                 h('i', {
                    //                     style: {
                    //                         color: projectStyle.color,
                    //                     },
                    //                     class: projectStyle.classStyle,
                    //                     on: {
                    //                         click: () => {
                    //                             if (projectStyle.edit) {
                    //                                 this.transferData = params.row;
                    //                                 this.transferData.mode = 'editPlan';
                    //                                 this.transferTitle = '修改计划';
                    //                                 this.flag.addPlan = true;
                    //                             }
                    //                         }
                    //                     }
                    //                 })
                    //             ]
                    //         )
                    //     }
                    // },
                ],
                data: []  //表格中的
            },
            selectedList: [], // 选中项的ID List
            transferData: {}, // 向其他页面传的数据
            transferTitle: ''
        }
    },
    methods:{
        // 获取项目列表
        getProjectList(){
            this.$http({
                method:'POST',
                url:'/project/all/list'
            }).then(({data})=>{
                if(data.status){
                    this.projectList = data.data;
                    this.projectList.forEach(value => {
                        this.projectNamesList.push(value.projectName)
                    });
                }
            })
        },
        // AutoComplete
        filterMethod(value, option) {
            return option.indexOf(value) !== -1;
        },
        // 项目切换
        projectChange(label){
            this.projectName = label
        },
        // 操作显示
        showOperator(params) {
            let managerName = params.row.managerName,
                projectStyle = {
                    color : '#c5c8ce',
                    classStyle : 'iconfont icon-edit-1-copy',
                    edit : false
                };
            projectStyle.edit = (managerName === localStorage.getItem('userName')) ||
                ('admin' === localStorage.getItem('userName'));
            if(projectStyle.edit){
                projectStyle.color = '#3399ff';
                projectStyle.classStyle = 'iconfont icon-active icon-edit-1-copy';
            }
            return projectStyle;
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
        // 点击查询按钮触发
        handleSearch(value) {
            // 将输入框中的值首尾去空格后赋值给查询字段searchValue
            // 请求表格数据：不显示缓冲状态，保留每页条数
            this.managerName = this.managerName.trim();
            if(typeof value == 'string'){
                this.projectName = value;
            }
            this.getTableData({
                loading: true,
                pageSize: this.page.pageSize
            });
        },
        // 点击新增按钮触发
        handleAdd(){
            this.$emit('shouldComponentShow','shouldEditShow');
        },
        // 点击导出按钮触发
        handleExport(){
            if(this.selectedList.length > 0){
                let selectedIds = [];
                this.selectedList.forEach((item,index)=>{
                    selectedIds.push(item.id);
                });
                this.$http({
                    method: 'POST',
                    url: `/plan-management/exportExcel`,
                    responseType: 'arraybuffer',
                    data: {
                        idList: selectedIds
                    }
                }).then(({data})=>{
                    let blob = new Blob([data], {type: "application/vnd.ms-excel"});
                    let downloadUrl = window.URL.createObjectURL(blob);
                    window.open(downloadUrl);
                })
            } else {
                this.$Notice.warning({
                    desc: '请选择要导出的项目'
                })
            }

        },
        // 点击导出按钮触发
        handleAllExport(){
                this.$http({
                    method: 'POST',
                    url: `/plan-management/exportAllExcel`,
                    responseType: 'arraybuffer'
                }).then(({data})=>{
                    let blob = new Blob([data], {type: "application/vnd.ms-excel"});
                    let downloadUrl = window.URL.createObjectURL(blob);
                    window.open(downloadUrl);
                })
        },
        // 点击刷新按钮触发
        handleRefresh(){
            // 重设Table组件的key，促使Table组件重新渲染
            this.projectId = '';
            this.projectName = '';
            this.userName = '';
            this.orderMap = {};
            this.filterMap = {};
            this.selectedList = [];
            this.tableConfig.key = new Date().toString();
            this.getTableData({loading:true})
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
        selectionChange(selected){
            this.tableConfig.data.forEach((item,index)=>{
                if(this.$refs.table.$refs.tbody.objData[index]._isChecked){ // true时
                    let existIndex = this.selectedList.findIndex((selectedItem,selectedIndex)=>{
                        return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id
                    });
                    existIndex == -1 ? this.selectedList.push(this.tableConfig.data[index]) : null;
                } else { // false时
                    let existIndex = this.selectedList.findIndex((selectedItem,selectedIndex)=>{
                        return this.$refs.table.$refs.tbody.objData[index].id == selectedItem.id
                    });
                    existIndex !== -1 ? this.selectedList.splice(existIndex,1) : null;
                }
            })
        },
        /**
         * 发送请求获取表格数据，并且做相应处理
         * @param loading {boolean} 表格缓冲，默认值为false
         * @param currentPage {number} 分页当前页，默认值为第一页
         * @param pageSize {number} 分页每页条数，默认值为每页10条
         */
        getTableData({loading = false, currentPage = 1, pageSize = 10} = {}) {
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
            this.$http.post(`/project/page/list`, {
                current: currentPage,
                orderMap: this.orderMap,
                pageSize: pageSize,
                searchMap: {
                    projectId: this.projectId,
                    projectName: this.projectName,
                    managerName: this.managerName,
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
                        if(this.selectedList.length > 0) {
                            this.selectedList.forEach((choosedItem,choosedIndex)=>{
                                this.tableConfig.data.forEach((item,index)=>{
                                    if(item.id == choosedItem.id){
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
         * 从状态数组中获取某个状态的信息
         * @param status 状态英文
         * @param arr 状态数组
         */
        getStatusInfo(status, arr) {
            return arr.filter(function(item) {
                return item.value === status;
            });
        },
        // 提交删除
        submitDelete(){
            // 提交删除HTTP请求
            this.$http({
                method:'DELETE',
                url:`/weekly-report/delete/${this.transferData.id}`
            }).then(({data}) => {
                // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                if (data.status) {
                    // 新增成功后的提示信息
                    this.$Notice.success({
                        desc: '删除成功'
                    });
                    this.getTableData({loading:false});
                }
            })
        }
    },
    created(){
        this.getProjectList();
        this.getTableData({loading:true});
    }
}
</script>

<style scoped lang="less">

</style>

<style>
.statusCircle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}
</style>
