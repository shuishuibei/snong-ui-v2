<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <div>
      <div class="cds-clearfix cds-margin-bottom-14">
        <i-input
          clearable
          class="cds-input-search"
          v-model="inputValue"
          @on-keyup.enter="handleSearch"
          placeholder="请输入订单号进行查询">
        </i-input>
        <span style="margin-left: 4px">申请时间区间：</span>
        <i-date-picker
          class="cds-input-search"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择时间区间"
          style="width: 200px"
          @on-change="dateChange">
        </i-date-picker>
        <i-button
          class="cds-btn-search"
          type="primary"
          @click="handleSearch()">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
        <div class="cds-float-right">
          <!-- 刷新按钮 -->
          <i-button
            class="cds-btn-refresh"
            type="primary"
            @click="handleRefresh">
            <i class="iconfont icon-shuaxin1"></i>
          </i-button>
        </div>
      </div>
      <div>
        <i-table
          ref="processTable"
          :key="config.key"
          :columns="config.columns"
          :data="config.data"
          :loading="config.loading"
          stripe
          highlight-row
          @on-sort-change="sortChange">
        </i-table>
      </div>
      <!-- 分页 -->
      <div class="cds-clearfix cds-margin-top-14">
        <div class="cds-float-left">
          共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页
        </div>
        <div class="cds-float-right">
          <i-page
            :total="page.totalCount"
            :current="page.currentPage"
            :page-size="page.pageSize"
            show-sizer
            placement="top"
            :page-size-opts="[10,20,30,50]"
            @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
            @on-page-size-change="getTableData({pageSize: $event})"></i-page>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import processMixin from '../process-mixin.js';
import { applicationStatus } from '@/assets/js/status/process/process.js';

export default {
  mixins: [processMixin],
  data() {
    return {
      config: {
        key: new Date().toString(),
        columns: [
          {
            title: '订单号',
            key: 'orderNo',
            ellipsis: true,
            render: (h, params) => {
              let { orderNo, orderId, processInstanceId, applyType } = params.row;
              return h(
                'span',
                {
                  style: {
                    cursor: 'pointer',
                    color: '#2d8cf0'
                  },
                  attrs: {
                    title: orderNo
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'have-done-process/details',
                        params: {
                          id: orderId
                        },
                        query: {
                          procInsId: processInstanceId,
                          applyType,
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
            align: 'left',
            ellipsis: true,
            filterMultiple: true,
            filters: applicationStatus,
            filterRemote: (value, key) => {
              this.filterMap = [];
              if (value.length > 0) {
                this.filterMap.push({
                  left: key,
                  middle: 'in',
                  right: value
                });
              }
              this.queryTripleList = this.searchMap.concat(this.filterMap);
              this.getTableData({ pageSize: this.page.pageSize });
            },
            render: (h, params) => {
              let status = params.row.applyType,
                arr = this.getStatusInfo(status, applicationStatus);
              let text = arr.length > 0 ? arr[0].label : '未知状态';
              return h(
                'div',
                {
                  class: 'ivu-table-cell-ellipsis',
                  attrs: { title: text }
                },
                [h('span', text)]
              );
            }
          },
          {
            title: '流程状态',
            key: 'taskName',
            ellipsis: true,
            render: (h, params) => {
              let text = params.row.taskName;
              return h(
                'div',
                {
                  attrs: { title: text }
                },
                [h('span', text)]
              );
            }
          },
          {
            title: '申请人姓名',
            key: 'applyUserName',
            ellipsis: true,
            render: (h, params) => {
              let text = params.row.applyUserName;
              return h(
                'div',
                {
                  attrs: { title: text }
                },
                [h('span', text)]
              );
            }
          },
          {
            title: '申请组织',
            key: 'applyGroupName',
            render: (h, params) => {
              let text = params.row.applyGroupName;
              return h(
                'div',
                {
                  attrs: { title: text }
                },
                [h('span', text)]
              );
            }
          },
          {
            title: '开始时间',
            key: 'applyTime',
            sortable: 'custom',
            width: 170,
            ellipsis: true,
            render: (h, params) => {
              let text = params.row.applyTime;
              return h(
                'div',
                {
                  attrs: { title: text }
                },
                [h('span', text)]
              );
            }
          },
          {
            title: '结束时间',
            key: 'endTime',
            sortable: 'custom',
            width: 170,
            ellipsis: true,
            render: (h, params) => {
              let text = params.row.endTime;
              return h(
                'div',
                {
                  attrs: { title: text }
                },
                [h('span', text)]
              );
            }
          }
        ]
      },
      httpUrl: {
        urlList: 'act-manage/have-done-process/list/page' //表格列表的请求地址
      }
    };
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  }
};
</script>
