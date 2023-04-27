<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <!-- 头部搜索和按钮操作 -->
    <div >
      <!-- 搜索 -->
      <div class="cds-clearfix cds-margin-bottom-14">
                <AutoComplete
                        clearable
                        v-model="inputValue"
                        placeholder="请输入员工姓名"
                        style="width: 160px;">
                </AutoComplete>
              <i-button class="cds-btn-search" type="primary" @click="handleSearch">
                <i class="iconfont icon-iconfontsousuo"></i>
              </i-button>
        <!-- 按钮操作 -->
        <div class="cds-float-right">
          <i-button type="primary"  @click="flag.add = true">
            <i class="iconfont icon-plus">新增</i>
          </i-button>
          <i-button type="primary"  class="cds-btn-refresh" @click="handleRefresh">
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
        <!-- 新增 -->
        <UserManageEdit v-model="flag.add"
                        title="新增用户"
                        :data="{add: true}">
        </UserManageEdit>
        <!-- 修改 -->
        <UserManageEdit v-model="flag.update"
                        title="修改用户信息"
                        :data="currentRow">
        </UserManageEdit>
        <!-- 单条删除 -->
        <ModalConfirm ref="deleteSingle"
                      v-model="flag.deleteSingle"
                      title="删除用户"
                      :info="'确认删除用户：' + currentRow.userName + '吗？'"
                      @on-cancel="deleteIds = []"
                      @on-ok="submitDelete"
                      :showBackgroudColor="false">
        </ModalConfirm>
        <!-- 详情信息 -->
        <ModalDetail v-model="flag.info"
                     title="用户详情"
                     :data="currentRow"
                     label-width="140"
                     :rows="detailRows">
        </ModalDetail>
    </div>
</template>

<script>
    import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue';
    import UserManageEdit from './UserManageEdit.vue';
    import ModalDetail from '@/components/modal-detail/ModalDetail.vue';
    import * as Const from './components/UserConst';

    //todo 将所有关于状态的内容提取到单独的文件，以便所有页面共用
    const status = [
        {
            label: '在职',
            value: 1,
            color: '#55ce5b'
        },
        {
            label: '离职',
            value: 0,
            color: '#acacac'
        }
    ];

    export default {
        name: "user-manage",
        components: {ModalConfirm, UserManageEdit, ModalDetail},
        data() {
            return {

                selectedValue: 'userName',   //下拉框选中的选项值，默认设为下拉框中的第一个选项值
                /**
                 * 搜索功能定义两个变量inputValue和searchValue
                 * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
                 */
                inputValue: '', //搜索框中显示的值
                searchValue: '', //实际点击查询按钮发送的值
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
                        align: 'center'
                      },
                      {
                        title: '登录名',       // 列头显示文字
                        key: 'loginName',    // 对应列内容的字段名，需要与表格绑定的data中对象的属性匹配
                        ellipsis: true,
                        sortable: 'custom',     // 设置为custom，代表远程排序
                        render: (h, params) => {
                          return h('span', {
                            style: {
                              color: '#3399ff',
                              cursor: 'pointer'
                            },
                            attrs: {
                              title: params.row.loginName
                            },
                            on: {
                              click: () => {
                                this.currentRow = params.row;
                                this.flag.info = true;
                              }
                            }
                          }, params.row.loginName);
                        }
                      },
                        {
                            title: '姓名',
                            key: 'userName',
                            ellipsis: true,
                            render: (h, params) => {
                                return h('span', {
                                    attrs: {
                                        title: params.row.userName
                                    }
                                }, params.row.userName);
                            }
                        },
                      // {
                      //   title: '所属项目',
                      //   key: 'projectName',
                      //   width: 120,
                      //   ellipsis: true,
                      //   render: (h, params) => {
                      //     return h('span', {
                      //       attrs: {
                      //         title: params.row.projectName
                      //       }
                      //     }, params.row.projectName);
                      //   }
                      // },
                      {
                        title: '角色名称',
                        key: 'roleName',
                        ellipsis: true,
                        width: 120,
                        render: (h, params) => {
                          let row = params.row;
                          return h(
                            'span',
                            {
                              attrs: {
                                title: row.roleName
                              }
                            },
                            row.roleName
                          );
                        }
                      },
                      {
                        title: '驻场类型',
                        key: 'userType',
                        width: 100,
                        filters: Const.UserTypeList,
                        filterMultiple: false,
                        filterRemote: ([value], key) => {
                          this.filterMap[key] = value;
                          this.handlerChangePage({ pageSize: this.page.pageSize });
                        },
                        render: (h, params) => {
                          let userType = params.row.userType,
                            arr = Const.UserTypeList.filter((item)=>{
                              return item.value === userType;
                            })[0]
                          if (!arr) arr = { value: '', label: ''}
                          return h('span', {
                            attrs: {
                              title: arr.label
                            },
                          }, arr.label);
                        }
                      },
                      {
                        title: '技术级别',
                        key: 'level',
                        width: 100,
                        filters: Const.LevelList,
                        filterMultiple: false,
                        filterRemote: ([value], key) => {
                          this.filterMap[key] = value;
                          this.handlerChangePage({ pageSize: this.page.pageSize });
                        },
                        render: (h, params) => {
                          let level = params.row.level,
                            arr = Const.LevelList.filter((item)=>{
                              return item.value === level;
                            })[0]
                          if (!arr) arr = { value: '', label: ''}
                          return h('span', {
                            attrs: {
                              title: arr.label
                            },
                          }, arr.label);
                        }
                      },
                      {
                        title: '企业微信号',
                        key: 'wxName',
                        width:120,
                        ellipsis: true,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.wxName
                            }
                          }, params.row.wxName);
                        }
                      },
                      {
                        title: '用户状态',
                        key: 'active',
                        width:84,
                        filters: status,   //必须同时配置filterRemote
                        filterMultiple: false,   //筛选默认是多选的，需要手动关闭
                        /**
                         * 远程筛选方法
                         * @params value {array} 为当前选中项（filters的value值组成的数组），选中全部时为value为空
                         * @params key {string} 为当前当前列的key值
                         * @params column {object} 为当前列的配置
                         */
                        filterRemote(value, key, column) {
                          this.filterMap[key] = value[0];
                          this.getTableData({loading: true, pageSize: this.page.pageSize});
                        },
                        render: (h, params) => {
                          let active = params.row.active ? 1 : 0,
                            node = status.filter((item) => {
                              return item.value == active
                            })[0];
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
                        }
                      },
                      {
                          title: '创建时间',
                          key: 'createTime',
                          ellipsis: true,
                          sortable: 'custom',
                          render: (h, params) => {
                              return h('span', {
                                  attrs: {
                                      title: params.row.createTime
                                  }
                              }, params.row.createTime);
                          }
                      },
                        {
                            title: '修改',
                            width: 64,
                            align: 'center',
                            render: (h, params) => {
                                let color = '#c5c8ce',
                                    active = false;
                              if('admin' === localStorage.getItem('owner')){
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
                                                    if(active) {
                                                        // 设置当前操作行
                                                        this.currentRow = params.row;
                                                        this.flag.update = true;
                                                    }
                                                }
                                            }
                                        })
                                    ]
                                )
                            }
                        },
                        {
                            title: '删除',
                            width: 64,
                            align: 'center',
                            render: (h, params) => {
                                   let color = '#c5c8ce',
                                    active = false;
                                if('admin' === localStorage.getItem('owner')){
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
                                                if(active){
                                                    //设置当前操作行
                                                    this.currentRow = params.row;
                                                    this.deleteIds = [params.row.id];
                                                    this.flag.deleteSingle = true;
                                                }
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
                    deleteSingle: false,  //单条删除
                    deleteMult: false,  //批量删除
                    add: false,  //新增
                    update: false,  //更新
                    info: false  //详情
                },
                //详情信息的标题配置信息
                detailRows: [
                  {
                    title: '登录名',
                    key: 'loginName'
                  },
                  {
                      title: '姓名',
                      key: 'userName'
                  },
                  // {
                  //   title: '所属项目',
                  //   key: 'projectName'
                  // },
                  {
                    title: '角色名称',
                    key: 'roleName'
                  },
                  {
                    title: '用户编号',
                    key: 'userNo'
                  },
                  {
                    title: '驻场类型',
                    key: 'userType',
                    render: (h, params) => {
                      let userType = params.row.userType;
                      if (userType) {
                        let node = Const.UserTypeList.filter((item) => {
                          return item.value === userType
                        })[0];
                        return h('div', [
                          h('span', {
                          }, node.label)
                        ])
                      }
                    }
                  },
                  {
                    title: '技术级别',
                    key: 'level',
                    render: (h, params) => {
                      let level = params.row.level;
                      if (level) {
                        let node = Const.LevelList.filter((item) => {
                          return item.value === level
                        })[0];
                        return h('div', [
                          h('span', {
                          }, node.label)
                        ])
                      }
                    }
                  },
                  {
                    title: '邮箱',
                    key: 'email'
                  },
                  {
                    title: '手机号',
                    key: 'phone'
                  },
                  {
                    title: '企业微信',
                    key: 'wxName'
                  },
                  {
                    title: '所属公司',
                    key: 'company'
                  },
                  {
                      title: '技能描述',
                      key: 'skillDesc'
                  },
                  {
                    title: '用户状态',
                    key: 'active',
                    //params {Object} 只有一个属性row，row也是一个对象，对应ModalDetail传入的data
                    render: (h, params) => {
                      let active = params.row.active ? 1 : 0,
                        node = status.filter((item) => {
                          return item.value === active
                        })[0];
                      return h('div', [
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
                    }
                  },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '修改时间',
                        key: 'modifyTime'
                    }
                ]
            }
        },
        computed: {},
        methods: {
            //点击查询按钮触发
            handleSearch() {
                //将输入框中的值首尾去空格后赋值给查询字段searchValue
                this.searchValue = this.inputValue.trim();
                //请求表格数据：不显示缓冲状态，保留每页条数
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
            //点击批量删除按钮触发
            handleDeleteMult() {
                let len = this.deleteIds.length;
                //如果选中的条数为0，提示请至少选择一条数据
                if (!len) {
                    this.$Notice.warning({
                        desc: '请至少选择一条数据'
                    });
                    return;
                }
                //如果选中的条数不为0，则显示批量删除提示框
                this.flag.deleteMult = true;
            },
            //提交更新
            submitUpdate(data) {
                data.createDate = undefined;
                data.modifiedDate = undefined;
                this.$http.put('api/update', data)
                    .then(({data}) => {
                        //更新成功后重新请求表格数据，保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                        if (data.status) {
                            //更新成功后的提示信息
                            this.$Notice.success({
                                desc: '更新成功'
                            });
                            this.getTableData({loading: true, pageSize: this.page.pageSize});
                        }
                    })
            },
            //提交删除
            submitDelete() {
                this.$http.delete(`user/${this.currentRow.id}/delete`).then(({data}) => {
                    //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
                    if (data.status) {
                        //删除成功后的提示信息
                        this.$Notice.success({
                            desc: '删除成功'
                        });
                        this.getTableData({loading: true});
                    }
                })
            },
            //清空搜索框
            setInputEmpty() {
                this.inputValue = '';
                this.searchValue = '';
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
                this.$http.post(`user/list/page`, {
                    current: currentPage,
                    orderMap: this.orderMap,
                    pageSize: pageSize,
                    searchMap: {
                        // url: this.searchValue,     //不包含下拉框联动时的传参方式
                        [this.selectedValue]: this.searchValue,  //包含下拉框联动时的传参方式
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
