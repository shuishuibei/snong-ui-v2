<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <div>
      <div class="cds-clearfix cds-margin-bottom-14">
                <!-- 下拉框联动搜索 -->
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
                    v-model="inputValue"
                    placeholder="请输入员工姓名"
                    style="width: 160px;margin-right: 0;" />
                <DatePicker type="date" placeholder="选择日报日期" style="width: 160px;margin-right: 6px;" v-model="pickReportDate" format="yyyy-MM-dd" @on-change="reportDateChange"></DatePicker>
                <i-button
                  class="cds-btn-search"
                  type="primary"
                  @click="handleSearch">
                  <i class="iconfont icon-iconfontsousuo"></i>
                </i-button>
        <!-- 按钮操作 -->
        <div class="cds-float-right">
          <i-button
            type="primary"
            @click="handleAdd">
            <i class="iconfont icon-plus">新增</i>
          </i-button>
          <i-button
            type="primary"
            @click="handlePreview">
            <i class="iconfont icon-htmal5icon09">预览</i>
          </i-button>
          <i-button
            class="cds-btn-refresh"
            type="primary"
            @click="handleRefresh">
            <i class="iconfont icon-shuaxin1"></i>
          </i-button>
        </div>
        </div>
        <!-- 表格 -->
        <Table ref="table"
               size="small"
               stripe
               :key="tableConfig.key"
               :loading="tableConfig.loading"
               :columns="tableConfig.columns"
               :data="tableConfig.data"
               @on-sort-change="sortChange">
        </Table>
        <div class="page-wrapper clearfix">
            <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
            <div class="cds-float-right">
                <Page :total="page.totalCount"
                      :current="page.currentPage"
                      :page-size="page.pageSize"
                      show-sizer
                      size="small"
                      placement="top"
                      @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                      @on-page-size-change="getTableData({pageSize: $event})">
                </Page>
            </div>
        </div>
        </div>
        <!-- 新增 -->
        <daily-report-edit v-model="shouldModalShow.shouldDailyReportEditShow" :data="transferData" :title="weeklyReportEditTitle"></daily-report-edit>
        <!-- 删除 -->
        <modal-confirm v-model="shouldModalShow.shouldDailyReportDeleteShow" title="删除日报" :info="'是否确认删除选中的日报？'" @on-ok="submitDelete" :showBackgroudColor="false"></modal-confirm>
    </div>
</template>

<script>
import DailyReportEdit from './DailyReportEdit.vue'; // 引入新增日报弹出框
import DailyReportPreview from './DailyReportPreview.vue'; // 引入预览日报弹出框
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue';

/* const projectName = [
    {
        value: "zjnx",
        label: "浙江农信"
    },
    {
        value: "rmyh",
        label: "人民银行"
    }
] */
export default {
    components:{
        "daily-report-edit":DailyReportEdit,
        "modal-confirm":ModalConfirm,
        "daily-report-preview":DailyReportPreview
    },
    data(){
        return {
            projectList: [],
            projectNamesList: [],
            projectName: '',
            pickReportDate: '', // 选择结束日期
            inputValue: '', // 搜索框中显示的值
            searchValue: '', // 实际点击查询按钮发送的值
            orderMap: {},   //表格排序参数
            filterMap: {}, //表格筛选参数
            page: {
                pageSize: 10,   //每页条数
                totalCount: 0,  //总数
                totalPage: 1,   //总页数
                currentPage: 1  //当前页码
            },
            tableConfig: {
                key: new Date().toString(), // 表格的属性key
                loading: false, // 表格是否加载中
                // 表格列的配置描述
                columns: [
                    {
                        title: '日报日期',
                        key: 'reportDate',
                        width: 128,
                        ellipsis: true,
                        sortable: 'custom',
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.reportDate
                                }
                            }, params.row.reportDate);
                        }
                    },
                    {
                        title: '姓名',          // 列头显示文字
                        key: 'userName',       // 对应列内容的字段名，需要与表格绑定的data中对象的属性匹配
                        width: 200,
                        ellipsis: true,
                        sortable: 'custom',     // 设置为custom，代表远程排序
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.userName
                                },
                                style: {
                                    color: '#3399ff',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.transferData = {}
                                        this.transferData = params.row;
                                        this.transferData.submit = 'forbidden';
                                        this.weeklyReportEditTitle = '预览日报'
                                        this.shouldModalShow.shouldDailyReportEditShow = true;
                                    }
                                }

                            }, params.row.userName);
                        }
                    },
                    {
                        title: '项目名称',
                        key: 'projectName',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.projectName
                                }
                            }, params.row.projectName);
                        }
                    },
                    {
                        title: '昨天工作内容',
                        key: 'yesterdayWork',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.yesterdayWork
                                }
                            }, params.row.yesterdayWork);
                        }
                    },
                    {
                        title: '今日工作计划',
                        key: 'todayWorkPlan',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.todayWorkPlan
                                }
                            }, params.row.todayWorkPlan);
                        }
                    },
                    {
                        title: '问题及困难',
                        key: 'problem',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    title: params.row.problem
                                }
                            }, params.row.problem);
                        }
                    },
                    {
                        title: '修改',
                        width: 64,
                        align: 'center',
                        render: (h, params) => {
                            let userName = params.row.userName,
                                color = '#c5c8ce',
                                active = false;
                            if(userName === localStorage.getItem('userName')){
                                color = '#3399ff';
                                active = true;
                            }
                            return h('div', [
                                h('i', {
                                    style: {
                                        color: color,
                                    },
                                    class: {
                                        'iconfont': true,
                                        'icon-active': active,
                                        'icon-edit-1-copy': true
                                    },
                                    on: {
                                        click: () => {
                                            if (userName === localStorage.getItem('userName')) {
                                                this.transferData = {}
                                                this.transferData = params.row;
                                                this.transferData.submit = 'modifyData';
                                                this.weeklyReportEditTitle = '修改日报'
                                                this.shouldModalShow.shouldDailyReportEditShow = true;
                                            }
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '删除',
                        width: 64,
                        align: 'center',
                        render: (h, params) => {
                            let userName = params.row.userName,
                                color = '#c5c8ce',
                                active = false;
                            if(userName === localStorage.getItem('userName')){
                                color = '#3399ff';
                                active = true;
                            }
                            return h('div', [
                                h('i', {
                                    style: {
                                        color: color,
                                    },
                                    class: {
                                        'iconfont': true,
                                        'icon-shanchu': true,
                                        'icon-active': active
                                    },
                                    on: {
                                        click: () => {
                                            if (userName === localStorage.getItem('userName')) {
                                                this.transferData = params.row;
                                                this.shouldModalShow.shouldDailyReportDeleteShow = true;
                                            }
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '复制新增',
                        width: 84,
                        align: 'center',
                        render: (h, params) => {
                            let row = params.row;
                            return h('div', [
                                    h('i', {
                                        style: {
                                            color: '#3399ff',
                                        },
                                        class: 'iconfont icon-active icon-ziyuan-xianxing',
                                        on: {
                                            click: () => {
                                                this.transferData = {}
                                                this.transferData = row;
                                                this.weeklyReportEditTitle = '新增日报';
                                                this.transferData.submit = 'copyAddReport';
                                                this.shouldModalShow.shouldDailyReportEditShow = true;
                                            }
                                        }
                                    })
                                ]
                            )
                        }
                    }
                ],
                data:[]
            },
            shouldModalShow: {
                shouldDailyReportEditShow: false,
                shouldDailyReportDeleteShow: false
            },
            transferData:{},
            weeklyReportEditTitle: '新增日报'
        }
    },
    methods: {
        filterMethod(value, option) {
            return option.indexOf(value) !== -1;
        },
        // 修改结束日期
        reportDateChange(reportTime){
            this.pickReportDate = reportTime;
        },
        // 点击查询按钮触发
        handleSearch(value) {
            // 将输入框中的值首尾去空格后赋值给查询字段searchValue
            this.searchValue = this.inputValue.trim();
            if(typeof value == 'string'){
                this.projectName = value;
            }
            // 请求表格数据：不显示缓冲状态，保留每页条数
            this.getTableData({
                loading: true,
                pageSize: this.page.pageSize
            });
        },
        // 点击添加按钮触发
        handleAdd(){
            this.transferData = {};
            this.weeklyReportEditTitle = '新增日报';
            this.transferData.submit = 'addReport';
            this.shouldModalShow.shouldDailyReportEditShow = true;
        },
        // 点击预览按钮触发
        handlePreview(){
            this.$emit('shouldComponentShow','shouldPreviewShow');
        },
        // 点击刷新按钮触发
        handleRefresh() {
            this.projectId = '';
            this.projectName = '';
            this.pickReportDate = '';
            // 清空排序
            this.orderMap = {};
            // 重设Table组件的key，促使Table组件重新渲染
            this.tableConfig.key = new Date().toString();
            // 请求表格数据：显示缓冲状态，保留每页条数
            this.getTableData({
                loading: true,
                pageSize: this.page.pageSize
            });
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
            //清空表格中选中的数据（除了批量删除其他操作都需要清空该值，故在获取数据时清空）
            this.deleteIds = [];
            //发送请求并且做相应处理
            this.$http.post(`daily-report/page/list`, {
                current: currentPage,
                orderMap: this.orderMap,
                pageSize: pageSize,
                searchMap: {
                    userName: this.searchValue,  // 根据用户名进行搜索
                    projectName: this.projectName, // 根据项目ID进行搜索
                    reportDate: this.pickReportDate // 根据日报日期进行搜索
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
                }
                //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
                loading ? this.tableConfig.loading = false : '';
            })
        },
        // 提交删除
        submitDelete(){
            // 提交删除HTTP请求
            this.$http({
                method:'DELETE',
                url:`/daily-report/${this.transferData.id}/delete`
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
        },
        getProjectList(){
            this.$http({
                method:'POST',
                url:'/project-management/GET'
            }).then(({data})=>{
                if(data.status){
                    this.projectList = data.data;
                    this.projectList.forEach(value => {
                        this.projectNamesList.push(value.projectName)
                    });
                }
            })
        }
    },
    created() {
        this.getTableData({loading: true});
        this.getProjectList()
    }
}
</script>

<style scoped lang="less">
    .search-wrapper, .btn-wrapper {
        padding-bottom: 15px;
    }
    .page-wrapper {
        position: relative;
        margin-top: 12px;
    }
</style>
