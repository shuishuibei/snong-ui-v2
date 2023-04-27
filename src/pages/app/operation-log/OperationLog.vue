<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <!-- 头部搜索和按钮操作 -->
    <div >
      <!-- 搜索 -->
      <div class="cds-clearfix cds-margin-bottom-14">
                <DatePicker
                        type="date"
                        placeholder="选择开始日期"
                        style="width: 160px"
                        @on-change="dateChange"
                        v-model="startTime">
                </DatePicker>
                <AutoComplete
                        v-model="inputValue"
                        clearable
                        placeholder="请输入操作用户名"
                        style="width:140px; margin-left: 6px;">
                </AutoComplete>
                <Input
                  clearable
                  v-model="inputDesc"
                  style="width: 220px"
                  placeholder="请输入操作描述"
                />
                <i-button class="cds-btn-search" type="primary" @click="handleSearch">
                  <i class="iconfont icon-iconfontsousuo"></i>
                </i-button>
          <div class="cds-float-right">
            <i-button
              class="cds-btn-refresh"
              type="primary"
              @click="handleRefresh">
              <i class="iconfont icon-shuaxin1"></i>
            </i-button>
          </div>
      </div>
        <Table size="small"
               class="cds-margin-bottom-14"
               stripe
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
    </div>
</template>

<script>
    // import {dataFormat} from '@/assets/js/format';
    const logResult = [
        {
            value: 1,
            label: '成功',
            color: '#0AD96F'
        },
        {
            value: 0,
            label: '失败',
            color: '#cc0001'
        }
    ];
    export default {
        name: "operatio-log",
        data() {
            return {
                startTime: '', // 开始时间
                inputValue: '',  // 操作用户
                inputDesc: '', // 操作描述
                searchValue: '', // 实际点击查询按钮发送的值
                searchDesc: '', // 实际点击查询按钮发送的值
                tableConfig: {
                    key: new Date().toString(), //表格的属性key
                    loading: false, //表格是否加载中
                    columns: [
                        {
                            title: "开始时间",
                            key: "startTime",
                            width: 160,
                            sortable: true,
                            render: (h, params) => {
                                return h('span', {
                                    attrs: {
                                        title: params.row.startTime
                                    }
                                }, params.row.startTime);
                            }
                        },
                        // {
                        //     title: "完成时间",
                        //     key: "endTime",
                        //     sortable: true,
                        //     render: (h, params) => {
                        //         return h('span', {
                        //             attrs: {
                        //                 title: params.row.endTime
                        //             }
                        //         }, params.row.endTime);
                        //     }
                        // },
                        {
                            title: "操作用户",
                            key: "operatorName",
                            width: 100,
                            sortable: true,
                            render: (h, params) => {
                                return h('span', {
                                    attrs: {
                                        title: params.row.operatorName
                                    }
                                }, params.row.operatorName);
                            }
                        },
                        {
                            title: "登录IP",
                            key: "operatorIp",
                            width: 160,
                            sortable: true,
                            render: (h, params) => {
                                return h('span', {
                                    attrs: {
                                        title: params.row.operatorIp
                                    }
                                }, params.row.operatorIp);
                            }
                        },
                        {
                            title: "操作描述",
                            key: "description",
                            render: (h, params) => {
                                return h('span', {
                                    attrs: {
                                        title: params.row.description
                                    }
                                }, params.row.description);
                            }
                        },
                        {
                            title: "操作耗时（毫秒）",
                            key: "cost",
                            width: 160,
                            sortable: true,
                            render: (h, params) => {
                                return h('span', {
                                    attrs: {
                                        title: params.row.cost
                                    }
                                }, params.row.cost);
                            }
                        },
                        {
                            title: "操作结果",
                            key: "result",
                            width: 160,
                            sortable: true,
                            render: (h, params) => {
                                let result = params.row.result
                                let arr = this.getResultInfo(result, logResult);
                                let text = arr.length > 0 ? arr[0].label : "未知状态",
                                    color = arr.length > 0 ? arr[0].color : "#ffa904";
                                return h(
                                    "div",
                                    {
                                        class: "ivu-table-cell-ellipsis",
                                        style: {
                                            color: color
                                        },
                                        attrs: { title: text }
                                    },
                                    [
                                        h("div", {
                                            class: "statusCircle",
                                            style: {
                                                backgroundColor: color
                                            }
                                        }),
                                        h(
                                            "span",
                                            {
                                                style: {
                                                    "margin-left": "6px"
                                                }
                                            },
                                            text
                                        )
                                    ]
                                );
                            }
                        }
                    ],
                    data: []
                },
                page: {
                    pageSize: 10,
                    totalCount: 0,
                    totalPage: 1,
                    currentPage: 1
                }
            }
        },
        methods: {
            //日期选择器日期发生变化时触发
            dateChange(date) {
                this.startTime = date;
            },
            //点击查询按钮触发，发送
            handleSearch() {
                // 将输入框中的值首尾去空格后赋值给查询字段searchValue
                this.searchValue = this.inputValue.trim();
                this.searchDesc = this.inputDesc.trim();
                this.getTableData({
                    loading: true,
                    pageSize: this.page.pageSize
                });
            },
            // 刷新
            handleRefresh() {
                this.startTime = '';
                this.inputValue = '';
                this.searchValue = '';
              this.inputDesc = '';
              this.searchDesc = '';
                this.getTableData({loading:true})
            },
            /**
             * 从状态数组中获取某个状态的信息
             * @param status 状态英文
             * @param arr 状态数组
             */
            getResultInfo(status, arr) {
                return arr.filter(function(item) {
                    return item.value === status;
                });
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
                this.$http.post(`logger/page/list`, {
                    current: currentPage,
                    orderMap: this.orderMap,
                    pageSize: pageSize,
                    searchMap: {
                        start_time: this.startTime,
                        operator_name: this.searchValue,
                        description: this.searchDesc
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
        },
        created() {
            this.getTableData({loading:true})
        }
    }
</script>

<style lang="less" scoped>
    .operation-log {
        .operate-box {
            margin-bottom: 15px;
        }
        .page-wrapper {
            position: relative;
            margin-top: 12px;
        }
    }
    .statusCircle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
    }
</style>
