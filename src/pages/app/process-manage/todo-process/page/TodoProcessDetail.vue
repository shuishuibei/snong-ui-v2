<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-09-06 13:54:17
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-22 18:07:11
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <i-tabs
      style="position: static;"
      :animated="false"
      v-model="tabName">
      <i-tab-pane label="订单详情" name="process-order-details">
        <process-order-details :data="applicant"></process-order-details>
      </i-tab-pane>
      <i-tab-pane label="审批记录" name="process-approval-record">
        <process-approval-record :data="tasks"></process-approval-record>
      </i-tab-pane>
      <i-tab-pane label="流程追踪" name="todo-process-flow-tracing">
        <process-flow-tracing
          v-if="tabName === 'todo-process-flow-tracing'"
          :process-definition-id="processDefinitionId">
        </process-flow-tracing>
      </i-tab-pane>
    </i-tabs>
  </div>
</template>

<script>
import ProcessOrderDetails from '../../components/ProcessOrderDetails.vue'; // 引入订单详情
import ProcessApprovalRecord from '../../components/ProcessApprovalRecord.vue'; // 引入审批记录
import ProcessFlowTracing from '../../components/ProcessFlowTracing.vue'; // 引入流程追
//import ProcessFooter from '../../components/ProcessFooter.vue';
export default {
  name: 'TodoProcessManagementDetail',
  components: {
    'process-order-details': ProcessOrderDetails,
    'process-approval-record': ProcessApprovalRecord,
    'process-flow-tracing': ProcessFlowTracing
    //'process-footer': ProcessFooter
  },
  data() {
    return {
      applicant: {},
      tasks: [],
      processDefinitionId: false,
      tabName: 'process-order-details'
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
          isApprove: true
        }
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          let { applicant, tasks, currentTaskId, processDefinitionId } = data.data;
          applicant.isApprove = true;
          applicant.currentTaskId = currentTaskId;
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
  mounted() {
    this.tabName = 'process-order-details';
  },
  beforeRouteEnter(to, from, next) {
    if (Object.keys(to.params).length > 0) {
      next();
    } else {
      next({ name: 'todo-process/index' });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'todo-process/index') {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  }
};
</script>
