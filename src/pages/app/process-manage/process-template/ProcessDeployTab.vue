<template>
  <div class="process-template">
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix">
      <i-input
        class="cds-input-search"
        clearable
        v-model="inputValue"
        @on-keyup.enter="handleSearch"
        placeholder="请输入名称进行查询">
      </i-input>
      <i-button
        class="cds-btn-search"
        type="primary"
        @click="handleSearch">
        <i class="iconfont icon-iconfontsousuo"></i>
      </i-button>
      <div class="cds-float-right">
        <i-button
          type="primary"
          class="btn-long"
          @click="handleDeleteMult">
          <i class="iconfont icon-shanchu">批量删除</i>
        </i-button>
        <i-button
          type="primary"
          class="cds-btn-refresh"
          @click="handleRefresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <!-- 表格 -->
    <i-table
      class="cds-margin-top-14"
      ref="table"
      size="small"
      stripe
      :key="tableConfig.key"
      :loading="tableConfig.loading"
      :columns="tableConfig.columns"
      :data="tableConfig.data"
      @on-select="handleSelectSingle"
      @on-select-cancel="handleSelectSingleCancel"
      @on-select-all="handleSelectAll"
      @on-select-all-cancel="handleSelectAllCancel"
      @on-sort-change="sortChange"></i-table>
    <!-- 分页 -->
    <div class="cds-margin-top-14 cds-clearfix">
      <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
      <div class="cds-float-right">
        <i-page
          :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          show-sizer
          placement="top"
          :page-size-opts="[10,20,30,50]"
          @on-change="getTableData({currentPage: $event, pageSize: page.pageSize, emptySelect: false})"
          @on-page-size-change="getTableData({pageSize: $event, emptySelect: false})"></i-page>
      </div>
    </div>
    <!-- 批量删除 -->
    <h3c-modal-confirm
      ref="deleteMult"
      v-model="flag.deleteMult"
      title="删除确认"
      :info="'确认删除这' + selectAll.length + '个流程模型吗？'"
      warning="该操作不可恢复"
      @on-ok="submitDelete"></h3c-modal-confirm>
    <!-- 单条删除 -->
    <h3c-modal-confirm
      ref="deleteSingle"
      v-model="flag.deleteSingle"
      title="删除确认"
      :info="'确认删除流程模型：' + currentRow.name + '吗？'"
      @on-cancel="selectAll = []"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
    <!-- 部署流程 -->
    <!-- <h3c-modal-confirm
      ref="deploy"
      v-model="flag.deploy"
      title="部署确认"
      :info="'确认部署流程模板：' + currentRow.modelName + '吗？'"
      @on-ok="submitDeploy"
    ></h3c-modal-confirm> -->
  </div>
</template>

<script>
  import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
  import tableSelectAllMixin from '@/assets/js/table-select-all-mixins.js';

  export default {
    name: 'ProcessDeployTab',
    mixins: [tableSelectAllMixin],
    components: {
      'h3c-modal-confirm': H3cModalConfirm // 删除确认弹出框
    },
    data() {
      return {
        selectedValue: 'modelName', //下拉框选中的选项值，默认设为下拉框中的第一个选项值
        /**
         * 搜索功能定义两个变量inputValue和searchValue
         * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
         */
        inputValue: '', //搜索框中显示的值
        searchValue: '', //实际点击查询按钮发送的值
        //分页
        page: {
          pageSize: 20, //每页条数
          totalCount: 0, //总数
          totalPage: 1, //总页数
          currentPage: 1 //当前页码
        },
        //表格配置信息
        tableConfig: {
          key: new Date().toString(), //表格的属性key
          loading: false, //表格是否加载中
          //表格列的配置描述
          columns: [
            {
              type: 'selection', //多选功能
              width: 40,
              align: 'center'
            },
            {
              title: '流程定义名称', //列头显示文字
              key: 'name', //对应列内容的字段名，需要与表格绑定的data中对象的属性匹配
              ellipsis: true,
              render: (h, params) => {
                return h(
                  'span',
                  {
                    attrs: {
                      title: params.row.name
                    }
                  },
                  params.row.name
                );
              }
            },
            /* {
              title: '组织机构名称',
              key: 'category',
              filters: status, //必须同时配置filterMethod或者filterRemote
              filterMultiple: false, //筛选默认是多选的，需要手动关闭
              //  *
              //  * 远程筛选方法
              //  * @params value {array} 为当前选中项（filters的value值组成的数组），选中全部时为value为空
              //  * @params key {string} 为当前当前列的key值
              //  * @params column {object} 为当前列的配置
              //  *
              filterRemote(value, key, column) {
                this.filterMap[key] = value[0];
                this.getTableData({
                  loading: true,
                  pageSize: this.page.pageSize
                });
              },
              render: (h, params) => {
                return h(
                  'div',
                  {
                    attrs: {
                      title: params.row.category
                    }
                  },
                  [
                    h(
                      'span',
                      {
                        style: {
                          verticalAlign: 'middle'
                        }
                      },
                      params.row.category
                    )
                  ]
                );
              }
            }, */
            {
              title: '模型标识',
              key: 'key',
              ellipsis: true,
              render: (h, params) => {
                return h(
                  'span',
                  {
                    attrs: {
                      title: params.row.key
                    }
                  },
                  params.row.key
                );
              }
            },
            {
              title: '版本',
              key: 'version',
              ellipsis: true,
              sortable: 'custom',
              render: (h, params) => {
                return h(
                  'span',
                  {
                    attrs: {
                      title: params.row.version
                    }
                  },
                  params.row.version
                );
              }
            },
            {
              title: '描述',
              key: 'description',
              ellipsis: true,
              render: (h, params) => {
                return h(
                  'span',
                  {
                    attrs: {
                      title: params.row.description
                    }
                  },
                  params.row.description
                );
              }
            },
            {
              title: '流程图片',
              key: 'diagramResourceName',
              ellipsis: true,
              render: (h, params) => {
                return h(
                  'span',
                  {
                    attrs: {
                      title: params.row.diagramResourceName
                    },
                    style: {
                      color: '#3399ff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        this.toViewProcessImg(params.row.id);
                      }
                    }
                  },
                  params.row.diagramResourceName
                );
              }
            },
            {
              title: '流程定义XML',
              key: 'resourceName',
              ellipsis: true,
              render: (h, params) => {
                return h(
                  'span',
                  {
                    attrs: {
                      title: params.row.resourceName,
                    },
                    style: {
                      color: '#3399ff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        window.open('/act-define/processXml/' + params.row.id);
                      }
                    }
                  },
                  params.row.resourceName
                );
              }
            },
            {
              title: '部署时间',
              key: 'deploymentTime',
              ellipsis: true,
              sortable: 'custom',
              render: (h, params) => {
                return h(
                  'span',
                  {
                    attrs: {
                      title: params.row.deploymentTime
                    }
                  },
                  params.row.deploymentTime
                );
              }
            },
            {
              title: '删除',
              width: 64,
              align: 'center',
              render: (h, params) => {
                let row = params.row;
                if (row.deletable) {
                  return h('div', [
                    h('i', {
                      style: {
                        color: '#3399ff'
                      },
                      class: 'iconfont icon-shanchu icon-active',
                      on: {
                        click: () => {
                          this.$nextTick(() => {
                            //取消表格全选状态
                            this.$refs.table.selectAll(false);
                            //设置当前操作行
                            this.currentRow = row;
                            this.selectAll = [row.deploymentId];
                            this.flag.deleteSingle = true;
                          });
                        }
                      }
                    })
                  ]);
                } else {
                  return h('div', [
                    h('i', {
                      style: {
                        color: 'rgb(187, 190, 196)'
                      },
                      class: 'iconfont icon-shanchu icon-active',
                      on: {
                        click: () => {
                          this.$nextTick(() => {
                            //取消表格全选状态
                            this.$refs.table.selectAll(false);
                            //设置当前操作行
                            this.currentRow = row;
                            this.selectAll = [row.deploymentId];
                            this.flag.deleteSingle = false;
                          });
                        }
                      }
                    })
                  ]);
                }
              }
            }
          ],
          data: [] //表格中的数据
        },
        filterMap: {}, //表格筛选参数
        orderMap: {}, //表格排序参数
        currentRow: {}, //表格中当前操作行
        //对话框标志位
        flag: {
          deleteSingle: false, //单条删除
          deleteMult: false, //批量删除
          add: false, //新增
          update: false, //更新
          deploy: false, //部署
          info: false //详情
        },
        selectTableConfig: {
          tableKey: 'deploymentId',
          dataKey: 'tableConfig.data',
          disabledKey: 'true'
        }
      };
    },
    methods: {
      //点击查询按钮触发
      handleSearch() {
        //将输入框中的值首尾去空格后赋值给查询字段searchValue
        this.searchValue = this.inputValue.trim();
        this.selectedValue = 'modelName';
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
      //点击批量删除按钮触发
      handleDeleteMult() {
        let len = this.selectAll.length;
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
      //提交新增
      submitAdd(data) {
        this.$http.post('act-template/create', data).then(({data}) => {
          //新增成功后重新请求表格数据，表格缓冲且保留原每页条数
          if (data.status) {
            //新增成功后的提示信息
            this.$Notice.success({
              desc: '新增流程模型成功'
            });
            this.getTableData({loading: true, pageSize: this.page.pageSize});
            window.open(
              '/act/process-editor/modeler.html?modelId=' + data.data.id
            );
          }
        });
      },
      //提交更新
      submitUpdate(data) {
        data.resourceId = this.resourceId;
        data.createDate = undefined;
        data.modifiedDate = undefined;
        this.$http.put('api/update', data).then(({data}) => {
          //更新成功后重新请求表格数据，保留原每页条数
          if (data.status) {
            this.getTableData({loading: true, pageSize: this.page.pageSize});
          }
        });
      },
      //提交删除
      submitDelete() {
        this.$http
          .delete('act-define/delete', {
            data: this.selectAll
          })
          .then(({data}) => {
            //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页
            if (data.status) {
              //删除成功后的提示信息
              this.$Notice.success({
                desc: '删除流程模型成功'
              });
              this.getTableData({loading: true, pageSize: this.page.pageSize});
            }
          });
      },
      //提交部署
      submitDeploy() {
        this.$http
          .get(`act-template/deploy/${this.currentRow.id}`)
          .then(({data}) => {
            //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页
            if (data.status) {
              this.getTableData({loading: true, pageSize: this.page.pageSize});
            }
          });
      },
      //清空搜索框
      setInputEmpty() {
        this.inputValue = '';
        this.searchValue = '';
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
       * @param emptySelect {boolean} 是否清空选中项，默认值为false
       */
      getTableData({loading = false, currentPage = 1, pageSize = 20, emptySelect = true} = {}) {
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
        this.$http
          .post('act-define/list/page', {
            current: currentPage,
            orderMap: this.orderMap,
            pageSize: pageSize,
            searchMap: {
              // url: this.searchValue,     //不包含下拉框联动时的传参方式
              name: this.searchValue, //包含下拉框联动时的传参方式
              // ...this.filterMap
            }
          })
          .then(({data}) => {
            //请求状态status为true时的处理，为false不需要单独处理（因为在入口文件中已经做了全局处理）
            if (data.status) {
              let resp = data.data;
              //将获取的分页数据赋值给表格数据data
              this.tableConfig.data = resp.records;
              // 分页保持选中
              if (emptySelect) {
                this.selectAll = [];
              } else {
                this.tableConfig.data.forEach((v, i) => {
                  this.selectAll.forEach((k) => {
                    if (v.deploymentId == k) {
                      this.tableConfig.data[i]._checked = true
                    }
                  })
                })
              }
              //设置分页总条数
              this.page.totalCount = resp.total;
              //设置分页总页数，当总页数为0时显示为1
              this.page.totalPage = resp.pages ? resp.pages : 1;
            }
            //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
            loading ? (this.tableConfig.loading = false) : '';
          });
      },
      //发送请求获取流程图片链接
      toViewProcessImg(procDefId) {
        this.$http({
          url: 'act-define/processImage/' + procDefId,
          method: 'GET',
          responseType: 'blob'
        }).then(res => {
          const qrUrl = window.URL.createObjectURL(res.data);
          this.$Modal.info({
            render: (h) => {
              return h('img', {
                attrs: {
                  src: qrUrl
                },
                style: {
                  width: '100%',
                  height: '100%'
                },
                on: {
                  load: (e) => {
                    window.URL.revokeObjectURL(qrUrl);
                  }
                },
              })
            },
            title: '流程图',
            width: 878,
            scrollable: true
          })
        });
      }
    },
    //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
    created() {
      this.getTableData({loading: true});
      this.$emit('handleRefresh', this.handleRefresh);
    }
  };
</script>
