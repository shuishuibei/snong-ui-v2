<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-11-02 18:00:50
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-04 14:15:05
 -->
<template>
  <div>
    <i-table
      stripe
      :key="tableConfig.key"
      :columns="tableConfig.columns"
      :loading="tableConfig.loading"
      :data="tableConfig.data">
    </i-table>
  </div>
</template>

<script>
export default {
  name: 'MyOrderApprovalRecord',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      orderMap: {}, // 表格排序的参数
      tableConfig: {
        loading: false,
        columns: [
          {
            title: '任务名称',
            key: 'taskName',
            ellipsis: true,
            render: (h, params) => {
              let taskName = params.row.taskName;
              return h(
                'span',
                {
                  attrs: {
                    title: taskName
                  }
                },
                taskName
              );
            }
          },
          {
            title: '待审批人',
            key: 'taskHandler',
            ellipsis: true,
            render: (h, params) => {
              let { taskHandler } = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: taskHandler
                  }
                },
                taskHandler
              );
            }
          },
          {
            title: '实际审批人',
            key: 'taskApprovedUser',
            ellipsis: true,
            render: (h, params) => {
              let { taskApprovedUser } = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: taskApprovedUser
                  }
                },
                taskApprovedUser
              );
            }
          },
          {
            title: '审批意见',
            key: 'taskApprovedOpinion',
            ellipsis: true,
            render: (h, params) => {
              let { taskApprovedOpinion } = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: taskApprovedOpinion
                  }
                },
                taskApprovedOpinion
              );
            }
          },
          {
            title: '审批结果',
            key: 'taskApprovedResult',
            ellipsis: true,
            render: (h, params) => {
              let { taskApprovedResult } = params.row;
              let result = taskApprovedResult ? '同意' : taskApprovedResult === false ? '驳回' : '';
              return h(
                'span',
                {
                  attrs: {
                    title: result
                  }
                },
                result
              );
            }
          },
          {
            title: '任务开始时间',
            key: 'startTime',
            ellipsis: true,
            render: (h, params) => {
              let { startTime } = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: startTime
                  }
                },
                startTime
              );
            }
          },
          {
            title: '任务结束时间',
            key: 'endTime',
            ellipsis: true,
            render: (h, params) => {
              let { endTime } = params.row;
              return h(
                'span',
                {
                  attrs: {
                    title: endTime
                  }
                },
                endTime
              );
            }
          }
        ],
        key: new Date().toString(), //表格的属性key
        data: []
      }
    };
  },
  watch: {
    data(newValue) {
      this.tableConfig.data = newValue;
    }
  }
};
</script>
