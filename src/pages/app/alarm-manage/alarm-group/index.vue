<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <!-- 头部搜索和按钮操作 -->
    <div >
      <!-- 搜索 -->
      <div class="cds-clearfix cds-margin-bottom-14">
        <AutoComplete
          clearable
          v-model="inputValue"
          placeholder="请输入告警组名称"
          style="width: 160px;">
        </AutoComplete>
        <Input
          clearable
          v-model="inputUserName"
          style="width: 160px"
          placeholder="请输入通知人员姓名"
        >
        </Input>
        <i-button class="cds-btn-search" type="primary" @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
        <!-- 按钮操作 -->
        <div class="cds-float-right">
          <i-button type="primary"  @click="flag.add = true">
            <i class="iconfont icon-plus">新增</i>
          </i-button>
          <i-button
            type="primary" :disabled="deleteIds.length === 0"
            @click="flag.deleteBatch = true">
            <i class="iconfont icon-shanchu">批量删除</i>
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
    <AlarmGroupEdit v-model="flag.add"
                    title="新增告警组"
                    width="800"
                    operator="add"
                    :data="{add: true}">
    </AlarmGroupEdit>

    <!-- 修改 -->
    <AlarmGroupEdit v-model="flag.update"
                    title="修改告警组"
                    width="800"
                    operator="update"
                    :data="currentRow">
    </AlarmGroupEdit>
    <!-- 单条删除 -->
    <ModalConfirm ref="deleteSingle"
                  v-model="flag.deleteSingle"
                  title="删除告警组"
                  :info="'确认删除告警组：' + currentRow.alarmGroupTitle + '吗？'"
                  @on-cancel="deleteIds = []"
                  @on-ok="submitDelete"
                  :showBackgroudColor="false">
    </ModalConfirm>
    <!-- 批量删除 -->
    <ModalConfirm ref="deleteBatch"
                  v-model="flag.deleteBatch"
                  title="删除告警组"
                  :info="`确认删除这${deleteIds.length}个主机资产？`"
                  @on-cancel="onCancel"
                  @on-ok="submitDelete"
                  :showBackgroudColor="false">
    </ModalConfirm>
    <!-- 详情信息 -->
    <ModalDetail v-model="flag.info"
                 title="告警组详情"
                 width="800"
                 :data="currentRow"
                 label-width="140"
                 :rows="detailRows">
    </ModalDetail>
  </div>
</template>

<script>
import AlarmGroupEdit from './components/AlarmGroupEdit';
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp';
import ModalDetail from '@/components/modal-detail/ModalDetail';
import { ALARM_SEND_LIST } from '@/constants/alarm-group';
export default {
  name: "alarm-group",
  components: {ModalConfirm, AlarmGroupEdit, ModalDetail},
  data() {
    return {

      selectedValue: 'userName',   //下拉框选中的选项值，默认设为下拉框中的第一个选项值
      /**
       * 搜索功能定义两个变量inputValue和searchValue
       * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
       */
      inputValue: '', //搜索框中显示的值
      inputUserName: '', //搜索框中显示的值
      searchMap: {
        alarmGroupTitle: "",// 告警组标题
        userName:'' //通知人员
      },
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
            title: '告警组名称',       // 列头显示文字
            key: 'alarmGroupTitle',    // 对应列内容的字段名，需要与表格绑定的data中对象的属性匹配
            width: 200,
            ellipsis: true,
            sortable: 'custom',     // 设置为custom，代表远程排序
            render: (h, params) => {
              return h('span', {
                style: {
                  color: '#3399ff',
                  cursor: 'pointer'
                },
                attrs: {
                  title: params.row.alarmGroupTitle
                },
                on: {
                  click: () => {
                    this.currentRow = params.row;
                    this.flag.info = true;
                  }
                }
              }, params.row.alarmGroupTitle);
            }
          },
          {
            title: '通知人员',
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
          {
            title: '通知类型',
            key: 'noticeType',
            width: 160,
            ellipsis: true,
            render: (h, params) => {
              let noticeType = params.row.noticeType,
                node = ALARM_SEND_LIST.filter((item) => {
                  return item.value === noticeType
                })[0];
              return h('div',
                {
                  attrs: {
                    title: node.label
                  }
                },
                [
                  h('span', {
                  }, node.label)
                ])
            }
          },
          {
            title: '描述',
            key: 'description',
            ellipsis: true,
            render: (h, params) => {
              return h('span', {
                attrs: {
                  title: params.row.description
                }
              }, params.row.description);
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 180,
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
        deleteBatch: false,  //批量删除
        add: false,  //新增
        update: false,  //更新
        info: false  //详情
      },
      //详情信息的标题配置信息
      detailRows: [
        {
          title: '告警组名称',
          key: 'alarmGroupTitle'
        },
        {
          title: '通知人员',
          key: 'userName'
        },
        {
          title: '通知类型',
          key: 'noticeType',
          render: (h, params) => {
            let noticeType = params.row.noticeType;
            if (noticeType) {
              let node = ALARM_SEND_LIST.filter((item) => {
                return item.value === noticeType
              })[0];
              return h('div', [
                h('span', {
                }, node.label)
              ])
            }
          }
        },
        {
          title: '描述',
          key: 'description'
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
      this.searchMap.alarmGroupTitle = this.inputValue.trim();
      this.searchMap.userName = this.inputUserName.trim();
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
      let len = this.deleteIds.length;
      //如果选中的条数为0，提示请至少选择一条数据
      if (!len) {
        this.$Notice.warning({
          desc: '请至少选择一条数据'
        });
        return;
      }
      //如果选中的条数不为0，则显示批量删除提示框
      this.flag.deleteBatch = true;
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
      this.$http.post(`alarm/group/delete`,
        this.deleteIds
      ).then(({data}) => {
        //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
        if (data.status) {
          //删除成功后的提示信息
          this.$Notice.success({
            desc: '删除告警组成功'
          });
          this.getTableData({loading: true});
        } else {
          this.$Notice.error({
            desc: '删除告警组失败！'
          });
        }
      })
    },
    onCancel(){
      this.deleteIds = []
      this.$refs.table.selectAll(false);
    },
    //清空搜索框
    setInputEmpty() {
      this.searchMap.alarmGroupTitle = this.inputValue = '';
      this.searchMap.userName = this.inputUserName = '';
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
      this.$http.post(`alarm/group/page/list`, {
        current: currentPage,
        orderMap: this.orderMap,
        pageSize: pageSize,
        searchMap: {
          ...this.searchMap,  //包含下拉框联动时的传参方式
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
