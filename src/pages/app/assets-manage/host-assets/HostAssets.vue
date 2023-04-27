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
              type="primary"
              @click="flag.add = true">
              <i class="iconfont icon-plus">新增</i>
            </i-button>
            <i-button
              type="primary"
              @click="flag.import = true">
              <i class="iconfont icon-zu">导入主机</i>
            </i-button>
            <i-button
              type="primary"
              @click="submitSync">
              <i class="iconfont icon-shuaxin1">同步</i>
            </i-button>
            <i-button
              type="primary" :disabled="deleteIds.length==0"
              @click="batchAuth">
              <i class="iconfont icon-renzheng">批量认证</i>
            </i-button>
            <i-button
              type="primary" :disabled="deleteIds.length==0"
              @click="flag.deleteBatch = true">
              <i class="iconfont icon-shanchu">批量删除</i>
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
                      :page-size-opts="[10,20,50,100]"
                      @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                      @on-page-size-change="getTableData({pageSize: $event})">
                </Page>
            </div>
        </div>
    </div>
      <!-- 认证 -->
      <HostAssetsAuth v-model="flag.auth"
                      :title="title"
                      :ids="deleteIds"
                      :dataList="currentRow">
      </HostAssetsAuth>
      <!-- 新增 -->
      <HostAssetsEdit v-model="flag.add"
                      title="新增主机资产"
                      :dataList="{add: true}">
      </HostAssetsEdit>
      <!-- 修改 -->
      <HostAssetsEdit v-model="flag.update"
                      title="修改主机资产"
                      :dataList="currentRow">
      </HostAssetsEdit>
      <!-- 导入Excel数据 -->
      <HostAssetsImport v-model="flag.import"
                      title="导入主机资产"
                      :dataList="currentRow">
      </HostAssetsImport>
      <!-- 单条删除 -->
      <ModalConfirm ref="deleteSingle"
                    v-model="flag.delete"
                    title="删除主机资产"
                    :info="'确认删除：【' + currentRow.hostName + '[' + currentRow.ip +']' + '】主机吗？'"
                    @on-cancel="deleteIds = []"
                    @on-ok="submitDelete"
                    :showBackgroudColor="false">
      </ModalConfirm>
      <ModalConfirm ref="deleteBatch"
                    v-model="flag.deleteBatch"
                    title="删除主机资产"
                    :info="`确认删除这${deleteIds.length}个主机资产？`"
                    @on-cancel="onCancel"
                    @on-ok="submitDelete"
                    :showBackgroudColor="false">
      </ModalConfirm>
      <!-- 详情信息 -->
      <h3c-modal-detail
        title="主机资产详情"
        label-width="140"
        width="600"
        :data="currentRow"
        :rows="detailRows"
        v-model="flag.info">
      </h3c-modal-detail>
    </div>
</template>

<script>
const HostType = [
  {
    value: 0,
    label: '物理主机'
  },
  {
    value: 1,
    label: '云主机'
  }
],
AuthType = [
  {
    value: 0,
    label: '未认证',
    color: '#ffa904'
  },
  {
    value: 1,
    label: '已认证',
    color: '#55ce5b'
  }
]
import HostAssetsAuth from './components/HostAssetsAuth.vue';
import HostAssetsEdit from './components/HostAssetsEdit.vue';
import HostAssetsImport from './components/HostAssetsImport.vue';
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue';
import H3cModalDetail from '@/components/h3c-modal-detail/H3cModalDetail.vue';
    export default {
      name: "host-manage",
      components: {ModalConfirm, H3cModalDetail, HostAssetsEdit,HostAssetsAuth, HostAssetsImport},
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
                  ip: ""
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
                        width: 180,
                        sortable: 'custom',     // 设置为custom，代表远程排序
                        render: (h, params) => {
                          return h('span', {
                            style: {
                              color: '#3399ff',
                              cursor: 'pointer'
                            },
                            attrs: {
                              title: params.row.hostName
                            },
                            on: {
                              click: () => {
                                this.currentRow = params.row;
                                this.flag.info = true;
                              }
                            }
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
                        title: '主机型号',
                        key: 'deviceType',
                        ellipsis: true,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.deviceType
                            }
                          }, params.row.deviceType);
                        }
                      },
                      {
                        title: '认证状态',
                        key: 'authStatus',
                        resizable: true,
                        ellipsis: true,
                        filters: AuthType,
                        filterMultiple: false,
                        filterRemote: ([value], key) => {
                          this.filterMap[key] = value;
                          this.handlerChangePage({ pageSize: this.page.pageSize });
                        },
                        render: (h, { row: { authStatus } }) => {
                          let node = AuthType.filter((item) => item.value === authStatus)[0];
                          return h('div',
                            {
                              attrs: {
                                title: node.label
                              }
                            },
                            [
                              h('span', {
                                class: 'cds-status-dot',
                                style: {
                                  backgroundColor: node.color
                                }
                              }),
                              h('span', {
                                style: {
                                  verticalAlign: 'middle',
                                  color: node.color
                                }
                              }, node.label)
                            ])
                        },
                      },
                      {
                        title: 'CPU(核)',
                        key: 'cpu',
                        ellipsis: true,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.cpu
                            }
                          }, params.row.cpu);
                        }
                      },
                      {
                        title: '内存(G)',
                        key: 'memory',
                        ellipsis: true,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.memory
                            }
                          }, params.row.memory);
                        }
                      },
                      // {
                      //   title: '系统类型',
                      //   key: 'systemType',
                      //   sortable: 'custom',
                      //   ellipsis: true,
                      //   render: (h, params) => {
                      //     return h('span', {
                      //       attrs: {
                      //         title: params.row.systemType
                      //       }
                      //     }, params.row.systemType);
                      //   }
                      // },
                        {
                            title: '创建时间',
                            key: 'createTime',
                            ellipsis: true,
                          width: 160,
                            align: 'center',
                            sortable: 'custom',
                            render: (h, params) => {
                              let time = params.row.createTime
                              time = time.replace(/T/g, ' ')
                                return h('span', {
                                    attrs: {
                                        title:time
                                    }
                                }, time);
                            }
                        },
                      {
                        title: '认证',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                          let color = '#c5c8ce',
                            active = false;
                          if(0 === params.row.authStatus){
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
                                  'icon-renzheng': true,
                                  'icon-active': active
                                },
                                on: {
                                  click: () => {
                                    if (active) {
                                      // 设置当前操作行
                                      this.currentRow = params.row;
                                      this.onCancel();
                                      this.title = '主机认证[' + params.row.ip + ']'
                                      this.flag.auth = true;
                                    }
                                  }
                                }
                              })
                            ]
                          )
                        }
                      },
                         {
                            title: '修改',
                            width: 60,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                        h('i', {
                                            class: {
                                                'iconfont': true,
                                                'icon-edit-1-copy': true
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
                            title: '删除',
                            width: 60,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('i', {
                                        class: {
                                            'iconfont': true,
                                            'icon-shanchu': true
                                        },
                                        on: {
                                            click: () => {
                                                //设置当前操作行
                                                this.currentRow = params.row;
                                                this.deleteIds = [params.row.id];
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
                deleteIds: [], //表格中选中的数据
                currentRow: {}, //表格中当前操作行
                //对话框标志位
                flag: {
                    add: false, //新增
                    delete: false,  //删除
                    deleteBatch: false, // 批量删除
                    update: false, // 修改
                    auth: false, //认证
                    authBatch: false, // 批量认证
                    info: false, //详情
                    import: false //导入
                },
              title: '',
              //详情信息的标题配置信息
              detailRows: [
                {
                  title: '主机名称',
                  key: 'hostName'
                },
                {
                  title: 'IP地址',
                  key: 'ip'
                },
                {
                  title: '所属项目',
                  key: 'projectName'
                },
                {
                  title: 'CPU(核)',
                  key: 'cpu'
                },
                {
                  title: '内存(G)',
                  key: 'memory'
                },
                {
                  title: '主机状态',
                  key: 'status'
                },
                {
                  title: '主机型号',
                  key: 'deviceType'
                },
                {
                  title: '平台ID',
                  key: 'bkInstId'
                },
                {
                  title: '创建时间',
                  key: 'createTime',
                  render: (h, params) => {
                    let time = params.row.createTime
                    if (time) {
                      time = time.replace(/T/g, ' ')
                    }
                    return h('span', {
                      attrs: {
                        title:time
                      }
                    }, time);
                  }
                },
                {
                  title: '序列号',
                  key: 'sn'
                },
                {
                  title: '制造商',
                  key: 'company'
                }
              ]
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
          batchAuth() {
            this.title = '主机批量认证';
            this.flag.auth = true;
          },
          onCancel(){
            this.deleteIds = []
            this.$refs.table.selectAll(false);
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
                this.deleteIds = [];
                //重置选中项
                selection.forEach((item) => {
                    this.deleteIds.push(item.id);
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
                this.deleteIds = [];
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
            },
          submitSync(){
            this.$loading.show();
            this.$http.get(`host/sync`).then(({data}) => {
              //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
              if (data.status) {
                //删除成功后的提示信息
                this.$Notice.success({
                  desc: '同步主机资产成功'
                });
                this.getTableData({loading: true});
              } else {
                // 分配权限失败后的提示信息
                this.$Notice.error({
                  desc: data.message && data.message !== '' ? data.message : '导入主机资产数据失败。'
                });
              }
              this.$loading.hide();
            })
          },
          //提交删除
          submitDelete() {
            this.$http.post(`host/delete`,
              this.deleteIds
            ).then(({data}) => {
              //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
              if (data.status) {
                //删除成功后的提示信息
                this.$Notice.success({
                  desc: '删除主机资产成功'
                });
                this.getTableData({loading: true});
              } else {
                this.$Notice.error({
                  desc: '删除主机资产失败！'
                });
              }
            })
          },
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
