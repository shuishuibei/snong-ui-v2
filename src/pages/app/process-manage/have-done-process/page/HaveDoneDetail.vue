<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:42
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-12 15:11:49
 -->
<template>
  <i-tabs class="cds-wrapper cds-border cds-padding-14">
    <i-tab-pane label="订单详情">
      <process-order-details :data="applicant" name="process-order-details"></process-order-details>
    </i-tab-pane>
    <i-tab-pane label="审批记录">
      <process-approval-record :data="tasks" name="process-approval-record"></process-approval-record>
    </i-tab-pane>
    <i-tab-pane label="流程追踪" name="todo-process-flow-tracing">
      <process-flow-tracing
        v-if="processDefinitionId"
        :process-definition-id="processDefinitionId">
      </process-flow-tracing>
    </i-tab-pane>
  </i-tabs>
</template>

<script>
import ProcessOrderDetails from '../../components/ProcessOrderDetails.vue'; // 引入订单详情
import ProcessApprovalRecord from '../../components/ProcessApprovalRecord.vue'; // 引入审批记录
import ProcessFlowTracing from '../../components/ProcessFlowTracing.vue'; // 引入流程追
export default {
  name: 'HaveDoneDetail',
  components: {
    'process-order-details': ProcessOrderDetails,
    'process-approval-record': ProcessApprovalRecord,
    'process-flow-tracing': ProcessFlowTracing
  },
  data() {
    return {
      applicant: {},
      tasks: [],
      processDefinitionId: false
    };
  },
  methods: {
    /**
     * @function getOrderBaseInfo
     * @description 获取订单的基本信息
     * @returns {void}
     */
    getOrderBaseInfo() {
      this.$loading.show();
      this.$http({
        url: `act-manage/processDetail/${this.$route.query.procInsId}`,
        method: 'GET',
        params: {
          isApprove: false
        }
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          let { applicant, tasks, processDefinitionId } = data.data;
          applicant.isApprove = false;
          this.applicant = applicant;
          this.tasks = tasks;
          this.processDefinitionId = processDefinitionId;
        } else {
          this.applicant = {};
          this.tasks = [];
          this.processDefinitionId = false;
        }
      });
    }
  },
  created() {
    this.getOrderBaseInfo();
  },
  beforeRouteEnter(to, from, next) {
    if (Object.keys(to.params).length > 0) {
      next();
    } else {
      next({ name: 'have-done-process/index' });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'have-done-process/index') {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  }
};
</script>
