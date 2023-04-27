<template>
    <div class="cds-wrapper cds-border cds-padding-14">
        <!-- 头部搜索和按钮操作 -->
        <div >
            <!-- 搜索 -->
            <div class="cds-clearfix cds-margin-bottom-14">
              <Input
                  clearable
                  v-model="inputProjectName"
                  style="width: 160px"
                  placeholder="请输入项目名称"
              >
              </Input>
              <Input
                  clearable
                  v-model="inputHostName"
                  style="width: 160px"
                  placeholder="请输入主机名称"
              >
              </Input>
              <Input
                clearable
                v-model="inputIp"
                style="width: 160px"
                placeholder="请输入IP地址"
              >
              </Input>
              <i-button
                class="cds-btn-search"
                type="primary"
                @click="handleSearch">
                <i class="iconfont icon-iconfontsousuo"></i>
              </i-button>
            <!-- 按钮操作 -->
          <div class="cds-float-right">
            <i-button
              type="primary" :disabled="selectIds.length==0"
              @click="handleBitchAssign">
              <i class="iconfont icon-jiesuo">批量授权</i>
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
               @on-selection-change="selectionChange"
               @on-sort-change="sortChange">
        </Table>
        <!-- 分页 -->
        <div class="page-wrapper clearfix cds-margin-bottom-14">
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
      <assign-permissions v-model="flag.update" :data="currentRow" :bitch-ids="selectIds"></assign-permissions>
      <delete-permissions v-model="flag.delete" :data="currentRow" :title="flag.deleteTitle"></delete-permissions>
      <delete-permissions v-model="flag.select" :data="currentRow" :title="flag.selectTitle" :selected="flag.select"></delete-permissions>
    </div>
</template>

<script>
import DeletePermissions from "./components/DeletePermissions.vue";
import AssignPermissions from './components/AssignPermissions.vue'

    export default {
      name: "resource-assign",
      components:{
		'delete-permissions':DeletePermissions,
		'assign-permissions': AssignPermissions,
      },
        data() {
            return {
                /**
                 * 搜索功能定义两个变量inputValue和searchValue
                 * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
                 */
                inputProjectName: '', //搜索框中显示的值
                inputHostName: '', //搜索框中显示的值
                inputIp: '', //搜索框中显示的值
                // searchValue: '', //实际点击查询按钮发送的值
                searchMap: {
                  projectName: "", // 技术任务标题
                  hostName: "",  // 技术任务内容
                  ip: "",
                  authStatus: 1 // 已认证主机
                },
                showUserMembers: false, // 删除权限弹框
                membersList:[], // 项目成员数据
                //分页
                page: {
                    pageSize: 10,   //每页条数
                    totalCount: 0,  //总数
                    totalPage: 1,   //总页数
                    currentPage: 1  //当前页码
                },
                //表格配置信息
                tableConfig: {
                    key: new Date().toString(), //表格的属性key
                    loading: false, //表格是否加载中
                    //表格列的配置描述
                    columns: [
                      {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                      },
                      {
                        title: '主机名称',       // 列头显示文字
                        key: 'hostName',    // 对应列内容的字段名，需要与表格绑定的data中对象的属性匹配
                        ellipsis: true,
                        sortable: 'custom',     // 设置为custom，代表远程排序
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.hostName
                            },
                          }, params.row.hostName);
                        }
                      },
                      {
                        title: 'IP地址',
                        key: 'ip',
                        ellipsis: true,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.ip
                            }
                          }, params.row.ip);
                        }
                      },
                      {
                        title: '所属项目',
                        key: 'projectName',
                        sortable: 'custom',
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
                        title: '权限人员',
                        key: 'userCount',
                        width: 100,
                        align: 'center',
                        ellipsis: true,
                        render: (h, params) => {
                          return h('i', {
                            class: 'iconfont',
                            on: {
                              click: () => {
                                // 设置当前操作行
                                this.currentRow = params.row;
                                this.flag.select = true;
                              }
                            },
                            attrs: {
                              title: params.row.userCount
                            }
                          }, params.row.userCount);
                        }
                      },
                        // {
                        //     title: '创建时间',
                        //     key: 'createTime',
                        //     ellipsis: true,
                        //     align: 'center',
                        //     sortable: 'custom',
                        //     render: (h, params) => {
                        //       let time = params.row.createTime
                        //       time = time.replace(/T/g, ' ')
                        //         return h('span', {
                        //             attrs: {
                        //                 title:time
                        //             }
                        //         }, time);
                        //     }
                        // },
                         {
                            title: '分配权限',
                            width: 128,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                        h('i', {
                                            class: {
                                                'iconfont': true,
                                                'icon-jiesuo': true
                                            },
                                            on: {
                                                click: () => {
                                                    // 设置当前操作行
                                                    this.currentRow = params.row;
                                                    this.flag.update = true;
                                                }
                                            }
                                        })
                                    ]
                                )
                            }
                        },
                        {
                            title: '删除权限',
                            width: 128,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('i', {
                                        class: {
                                            'iconfont': true,
                                            'icon-jurassic_delete-users': true
                                        },
                                        on: {
                                            click: () => {
                                                //设置当前操作行
                                                this.currentRow = params.row;
                                                this.flag.delete = true;
                                            }
                                        }
                                    })
                                ])
                            }
                        }
                    ],
                    data: []  //表格中的数据
                },
                filterMap: {},  //表格筛选参数
                orderMap: {},   //表格排序参数
                selectIds: [], //表格中选中的数据
                currentRow: {}, //表格中当前操作行
                //对话框标志位
                flag: {
                    delete: false,  //单条删除
                    update: false, // 分配权限
                    select: false, // 权限人员
                    deleteTitle: "删除权限",
                    selectTitle: "查看权限人员"
                }
            }
        },
        computed: {},
        methods: {
            //点击查询按钮触发
            handleSearch() {
              //将输入框中的值首尾去空格后赋值给查询字段searchValue
              this.searchMap.projectName = this.inputProjectName.trim()
              this.searchMap.hostName = this.inputHostName.trim()
              this.searchMap.ip = this.inputIp.trim()
                //请求表格数据：不显示缓冲状态，保留每页条数
                this.getTableData({
                    loading: true,
                    pageSize: this.page.pageSize
                });
            },
            // 批量分配权限
          handleBitchAssign() {
              this.flag.update = true
              this.currentRow = {}
          },
            //点击刷新按钮触发
            handleRefresh() {
                //清空搜索输入框
                this.setInputEmpty();
                //清空筛选
                this.filterMap = {};
                //清空排序
                this.orderMap = {};
                //重设Table组件的key，促使Table组件重新渲染
                this.tableConfig.key = new Date().toString();
                //请求表格数据：显示缓冲状态，保留每页条数
                this.getTableData({
                    loading: true,
                    pageSize: this.page.pageSize
                });
            },
            //清空搜索框
            setInputEmpty() {
              this.searchMap.projectName = this.inputProjectName = '';
              this.searchMap.hostName = this.inputHostName = '';
              this.searchMap.ip = this.inputIp = '';
            },
            //表格选中项发生变化时触发
            selectionChange(selection) {
                //清空表格中选中的数据
                this.selectIds = [];
                //重置选中项
                selection.forEach((item) => {
                    this.selectIds.push(item.id);
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
                //将order转换为true或false，true为升序，false为降序
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
                this.selectIds = [];
                //发送请求并且做相应处理
                this.$http.post(`host/page/list`, {
                    current: currentPage,
                    orderMap: this.orderMap,
                    pageSize: pageSize,
                    searchMap: {
                        // url: this.searchValue,     //不包含下拉框联动时的传参方式
                        ...this.searchMap, //包含下拉框联动时的传参方式
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
                    }
                    //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
                    loading ? this.tableConfig.loading = false : '';
                })
            }
        },
        //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
        created() {
            this.getTableData({loading: true});
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
