<!--
 * @Description 订单管理页面
 * @Author ys1983/张睿博
 * @Date 2019-08-06 11:08:20
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-07 13:46:50
 -->
<template>
  <div class="order-manage cds-border cds-padding-14">
    <div class="functional-area cds-clearfix">
      <div class="cds-float-left-btn cds-margin-bottom-14">
        <i-select
          v-model="formValidate.selectType"
          style="width:120px"
          @on-change="changeSelectType">
          <i-option value="orderNo">订单编号</i-option>
          <i-option value="applyUserName">申请人</i-option>
        </i-select>
        <i-input
          clearable
          style="width:240px;"
          v-model="formValidate.search"
          @on-enter="handleSearch"
          @on-clear="search.search = ''"
          :placeholder="inputMessage">
        </i-input>
        <i-button
          type="primary"
          class="cds-btn-search"
          @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
      <div class="cds-float-right-btn">
        <i-button
          class="cds-btn-refresh"
          @click="handleRefresh(true)">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <div class="table-wrap">
      <i-table
        stripe
        highlight-row
        :columns="orderConfig.column"
        :key="orderConfig.key"
        :loading="orderConfig.loading"
        @on-sort-change="changeOrderSort"
        :data="orderConfig.data">
      </i-table>
    </div>
    <div class="cds-clearfix page-wrap cds-margin-top-14">
      <div class="cds-float-left">
        共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页
      </div>
      <div class="cds-float-right">
        <i-page
          show-sizer
          :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
          @on-page-size-change="getTableData({pageSize: $event})">
        </i-page>
      </div>
    </div>
    <h3c-modal-confirm
      v-model="deleteSingle"
      title="删除确认"
      :info="'确认删除订单：'+ orderNo +'吗？'"
      warning="该操作不可恢复"
      @on-ok="handlerDelete">
    </h3c-modal-confirm>
    <h3c-modal-confirm
      v-model="cancelApply"
      title="取消申请确认"
      :info="'确认取消订单：'+ orderNo +'吗？'"
      warning="该操作不可恢复"
      @on-ok="handlerCancelApply">
    </h3c-modal-confirm>
  </div>
</template>

<script>
import orderStatus from '@/assets/js/status/order/order';
import typeStatus from '@/assets/js/status/order/type';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import { required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'OrderManage',
  components: {
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    return {
      formValidate: {
        selectType: 'orderNo', // 选择搜索类型 默认是订单编号
        search: '', // 搜索的值
        orderNo: '', // 通知maximo显示的订单编号
        userName: '', // 通知maximo显示的申请人名称
        orderStatus: '', // 通知maximo显示的订单状态
        maximoText: '' // 通知maximo显示的通知信息
      },
      ruleValidate: {
        maximoText: required('Maximo 通知信息不能为空')
      },
      inputMessage: '请输入订单编号进行查询',
      orderConfig: {
        column: [
          {
            title: '订单编号',
            key: 'orderNo',
            align: 'left',
            ellipsis: true,
            sortable: 'custom',
            render: (h, { row }) => {
              let orderNo = row.orderNo;
              return h(
                'span',
                {
                  attrs: {
                    title: orderNo
                  },
                  class: 'cell-info-active',
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'my-order/my-order-details',
                        params: { id: row.orderId },
                        query: {
                          procInsId: row.processInstanceId,
                          applyType: row.applyType,
                          time: new Date().getTime()
                        }
                      });
                    }
                  }
                },
                orderNo
              );
            }
          },
          {
            title: '申请类型',
            key: 'applyType',
            ellipsis: true,
            filters: typeStatus,
            filterMultiple: false,
            filterRemote: (value, key) => {
              this.filter = {
                ...this.filter,
                ...{
                  typeFilter: key,
                  typeMap: value[0]
                }
              };
              this.page.currentPage = 1;
              this.getOrderHttp({ ...this.search, ...this.filter, ...this.orderSort });
            },
            render: (h, { row }) => {
              let { applyType } = row;
              let { label } = typeStatus.find(item => item.value === applyType);
              return h(
                'span',
                {
                  attrs: {
                    title: label
                  }
                },
                label
              );
            }
          },
          {
            title: '申请人',
            key: 'applyUserName',
            width: 148,
            render: (h, { row }) => {
              let { applyUserName } = row;
              return h(
                'span',
                {
                  attrs: {
                    title: applyUserName
                  }
                },
                applyUserName
              );
            }
          },
          {
            title: '申请组织',
            key: 'applyGroupName',
            render: (h, { row }) => {
              let { applyGroupName } = row;
              return h(
                'span',
                {
                  attrs: {
                    title: applyGroupName
                  }
                },
                applyGroupName
              );
            }
          },
          {
            title: '订单状态',
            key: 'orderStatus',
            align: 'center',
            ellipsis: true,
            filters: orderStatus,
            filterMultiple: false,
            filterRemote: (value, key) => {
              this.filter = {
                ...this.filter,
                ...{ statusFilter: key, statusMap: value[0] }
              };
              this.page.currentPage = 1;
              this.getOrderHttp({ ...this.search, ...this.filter, ...this.orderSort });
            },
            render: (h, { row }) => {
              let status = row.orderStatus;
              let { label, color } = this.getStatusInfo(status, orderStatus);
              let text = label ? label : '位置状态',
                textColor = color ? color : '#ffa904';
              return h(
                'div',
                {
                  class: 'ivu-table-cell-ellipsis',
                  style: {
                    color: textColor
                  },
                  attrs: {
                    title: text
                  }
                },
                [
                  h('div', {
                    style: {
                      backgroundColor: textColor,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }
                  }),
                  h(
                    'span',
                    {
                      style: {
                        'margin-left': '6px'
                      }
                    },
                    text
                  )
                ]
              );
            }
          },
          {
            title: '资源下发状况',
            key: 'resourceChangeResult',
            align: 'left',
            ellipsis: true,
            render: (h, { row }) => {
              let { resourceChangeResult } = row;
              return h(
                'span',
                {
                  attrs: {
                    title: resourceChangeResult
                  }
                },
                resourceChangeResult
              );
            }
          },
          {
            title: '申请时间',
            key: 'applyTime',
            align: 'left',
            ellipsis: true,
            sortable: 'custom',
            render: (h, { row }) => {
              let { applyTime } = row;
              return h(
                'span',
                {
                  attrs: {
                    title: applyTime
                  }
                },
                applyTime
              );
            }
          },
          {
            title: '资源下发时间',
            key: 'resourceChangeTime',
            align: 'left',
            ellipsis: true,
            sortable: 'custom',
            render: (h, { row }) => {
              let { resourceChangeTime } = row;
              return h(
                'span',
                {
                  attrs: {
                    title: resourceChangeTime
                  }
                },
                resourceChangeTime
              );
            }
          },
          {
            title: '重新申请',
            key: 'action',
            align: 'center',
            width: 70,
            render: (h, { row }) => {
              return h('div', [
                h('i', {
                  class: 'iconfont icon-shenqing',
                  attrs: {
                    disabled: !row.reApply
                  },
                  on: {
                    click: () => {
                      row.reApply && this.handlerAgainApply(row.orderNo, row.applyType);
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '取消订单',
            key: 'action',
            align: 'center',
            width: 70,
            render: (h, { row }) => {
              return h('div', [
                h('i', {
                  class: 'iconfont icon-quxiaodingdan',
                  attrs: {
                    disabled: !row.reApply
                  },
                  on: {
                    click: () => {
                      if (row.reApply) {
                        this.cancelApply = true;
                        this.orderNo = row.orderNo;
                        this.procInsId = row.processInstanceId;
                      }
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '删除',
            key: 'action',
            width: 70,
            align: 'center',
            render: (h, { row }) => {
              return h('div', [
                h('i', {
                  class: 'iconfont icon-shanchu', // 添加类名，字体图标删除
                  attrs: {
                    disabled: !row.deletable
                  },
                  on: {
                    click: () => {
                      if (row.deletable) {
                        this.deleteSingle = true;
                        let { orderId, orderNo } = row;
                        this.orderNo = orderNo;
                        this.orderId = orderId;
                      }
                    }
                  }
                })
              ]);
            }
          }
        ],
        data: [],
        loading: true,
        key: new Date().getTime()
      },
      page: {
        totalCount: 0,
        currentPage: 1,
        totalPage: 1,
        pageSize: 20
      },
      orderSort: {
        key: '',
        sort: ''
      },
      filter: {},
      search: {
        selectType: 'orderNo',
        search: ''
      },
      deleteSingle: false, // 控制是否删除确认框的显示
      orderNo: '', // 删除对象的提示信息
      orderId: '', // 删除对的id
      cancelApply: false, // 取消申请确认框
      procInsId: ''
    };
  },
  methods: {
    /**
     * @function changeSelectType
     * @description 当搜索类型发生变化时触发的方法
     * @param {String} type
     * @returns {void}
     */
    changeSelectType(type) {
      this.search.selectType = type;
      this.formValidate.search = '';
      switch (type) {
        case 'orderNo': {
          this.inputMessage = '请输入订单编号进行查询';
          break;
        }
        default:
          this.inputMessage = '请输入申请人进行查询';
          break;
      }
    },
    /**
     * @function handleSearch
     * @description 点击搜索触发的方法
     * @returns {void}
     */
    handleSearch() {
      this.page.currentPage = 1;
      let { selectType, search } = this.formValidate;
      this.search = { selectType, search };
      this.getOrderHttp({ ...this.search, ...this.orderSort, ...this.filter });
    },
    /**
     * @function handleRefresh
     * @description 点击刷新触发的方法
     * @returns {void}
     */
    handleRefresh() {
      this.orderConfig.key = Math.random() * 100;
      this.resetPageAndTable(true);
      this.getOrderHttp();
    },
    /**
     * @function getStatusInfo
     * @description 获取状态库中某个状态的信息
     * @param {String} status
     * @param {Array} list
     * @returns {void}
     */
    getStatusInfo(status, list) {
      let target = list.find(item => item.value === status);
      return target;
    },
    /**
     * @function getTableData
     * @description 点击分页，切换条数等触发的方法
     * @param {Object} option
     * @param {Boolean} option.loading
     * @param {Number} option.currentPage
     * @param {Number} option.pageSize
     * @returns {void}
     */
    getTableData({ loading = false, currentPage = 1, pageSize = 20 } = {}) {
      if (loading) {
        this.orderConfig.loading = loading;
        this.orderConfig.data = [];
      }
      this.page.pageSize = pageSize;
      this.page.currentPage = currentPage;
      this.getOrderHttp({ ...this.search, ...this.orderSort, ...this.filter });
    },
    /**
     * @function getOrderHttp
     * @description 获取表格列表的数据
     * @param {Object} option
     * @param {String} option.selectType
     * @param {String} option.search
     * @param {String} option.key
     * @param {Boolean} option.sort      - 为排序的标示 true标示升序，false表示降序
     * @param {String} option.filter     - 筛选的字段
     * @param {String} option.map        - 筛选的值
     * @returns {void}
     */
    getOrderHttp({
      selectType = 'orderNo',
      search = '',
      key = '',
      sort = '',
      typeFilter = '',
      typeMap = '',
      statusFilter = '',
      statusMap = ''
    } = {}) {
      this.orderConfig.loading = true;
      let { currentPage, pageSize } = this.page;
      let orderMap = key === '' ? {} : { [key]: sort };
      let statusfilterMap = statusFilter === '' ? {} : { [statusFilter]: statusMap };
      let typeFilterMap = typeFilter === '' ? {} : { [typeFilter]: typeMap };
      this.$http({
        url: 'order/list/page',
        method: 'POST',
        data: {
          current: currentPage,
          pageSize: pageSize,
          orderMap: orderMap,
          queryTripleList: [],
          searchMap: {
            [selectType]: search,
            ...statusfilterMap,
            ...typeFilterMap
          }
        }
      }).then(({ data }) => {
        this.orderConfig.loading = false;
        let { records, total, pages } = data.data;
        if (data.status) {
          this.orderConfig.data = records;
          this.page.totalCount = total;
          this.page.totalPage = pages ? pages : 1;
        } else {
          !data.status && this.resetPageAndTable();
        }
      });
    },
    /**
     * @function resetPageAndTable
     * @description 重置分页和表格数据
     * @returns {void}
     */
    resetPageAndTable(isClear = false) {
      this.orderConfig.data = [];
      if (isClear) {
        this.formValidate.search = '';
        this.formValidate.selectType = 'orderNo';
        this.inputMessage = '请输入订单编号进行查询';
        this.search = {
          selectType: 'orderNo',
          search: ''
        };
      } else {
        this.page = { totalCount: 0, currentPage: 1, totalPage: 1, pageSize: 20 };
      }
      this.orderSort = { key: '', sort: '' };
      this.filter = {};
      this.page = { ...this.page, ...{ totalCount: 0, currentPage: 1, totalPage: 1 } };
    },
    /**
     * @function noticeMaximo
     * @description 通知Maximo的通知信息确认时触发的方法
     * @param {Function} callback
     * @returns {void}
     */
    noticeMaximo(callback) {
      this.$refs.formValidate.validate(valida => {});
    },
    /**
     * @function changeOrderSort
     * @description 表格点击排序时触发
     * @param {Object} option
     * @param {Array} option.column
     * @param {String} option.key
     * @param {String} option.order
     * @returns {void}
     */
    changeOrderSort({ column, key, order }) {
      let sort = order === 'asc' ? true : false;
      this.orderSort = { key, sort };
      this.page.currentPage = 1;
      this.getOrderHttp({ ...this.search, key, sort, ...this.filter });
    },
    /**
     * @function handlerDelete
     * @description 删除确认后触发的方法
     * @returns {void}
     */
    handlerDelete() {
      this.$loading.show();
      this.$http({
        url: 'order/deleteOrder',
        method: 'delete',
        data: [this.orderId]
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.getOrderHttp({ ...this.search, ...this.orderSort, ...this.filter });
          this.$Notice.success({ desc: data.message });
        }
      });
    },
    /**
     * @function handlerAgainApply
     * @description 点击重新申请触发的方法
     * @param {String} orderNo
     * @param {String} type
     * @returns {void}
     */
    handlerAgainApply(orderNo, type) {
      this.$loading.show();
      this.$http({
        url: `order/reapply/${this.$store.state.login.userId}&${orderNo}`,
        method: 'GET'
      })
        .then(({ data }) => {
          this.$loading.hide();
          if (data.status) {
            this.$Notice.success({
              desc: data.message
            });
            switch (type) {
              case 'ADD':
                this.$router.push({
                  name: 'application-list',
                  query: { time: new Date().getTime() }
                });
                break;
              case 'CHANGE':
                this.$router.push({ name: 'change-list', query: { time: new Date().getTime() } });
                break;
              case 'UNSUBSCRIBE':
                this.$router.push({
                  name: 'unsubscribe-list',
                  query: { time: new Date().getTime() }
                });
                break;
              default:
                return false;
            }
          } else {
            this.$Notice.error({
              desc: data.message
            });
          }
        })
        .catch(err => {
          this.$loading.hide();
        });
    },
    /**
     * @function handlerCancelApply
     * @description 取消重新申请
     * @param {type}
     * @returns {void}
     */
    handlerCancelApply() {
      this.$loading.show();
      this.$http({
        url: `act-manage/cancel/${this.procInsId}`,
        method: 'PUT'
      })
        .then(({ data }) => {
          this.$loading.hide();
          if (data.status) {
            this.getOrderHttp({ ...this.search, ...this.orderSort, ...this.filter });
            this.$Notice.success({
              desc: data.message
            });
          }
        })
        .catch(err => {
          this.$loading.hide();
        });
    }
  },
  mounted() {
    this.getOrderHttp();
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  }
};
</script>

<style lang="less" scoped>
.order-manage {
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  /deep/.icon-shenqing {
    &::before {
      font-size: 20px;
    }
    &:hover {
      &::before {
        font-size: 24px;
      }
    }
  }
}
</style>
