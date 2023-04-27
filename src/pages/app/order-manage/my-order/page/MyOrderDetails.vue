<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-09-12 09:50:09
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-12 15:11:31
 -->
<template>
  <div class="order-details cds-padding-14 cds-border cds-wrapper">
    <i-tabs>
      <i-tab-pane label="订单详情">
        <my-order-details-info :applicant="applicant"></my-order-details-info>
      </i-tab-pane>
      <i-tab-pane label="审批记录">
        <my-order-approval-record :data="tasks"></my-order-approval-record>
      </i-tab-pane>
      <i-tab-pane
        label="流程追踪"
        name="my-order-flow-tracing">
        <my-order-flow-tracing
          v-if="processDefinitionId"
          :process-definition-id="processDefinitionId">
        </my-order-flow-tracing>
      </i-tab-pane>
    </i-tabs>
  </div>
</template>

<script>
import MyOrderApprovalRecord from '../components/MyOrderApprovalRecord.vue';
import MyOrderFlowTracing from '../components/MyOrderFlowTracing.vue';
import MyOrderDetailsInfo from '../components/MyOrderDetailsInfo.vue';
export default {
  name: 'OrderDetails',
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  components: {
    'my-order-approval-record': MyOrderApprovalRecord,
    'my-order-flow-tracing': MyOrderFlowTracing,
    'my-order-details-info': MyOrderDetailsInfo
  },
  data() {
    return {
      applicant: {},
      tasks: [],
      processDefinitionId: ''
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
        method: 'GET'
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          let { applicant, tasks, processDefinitionId } = data.data;
          this.applicant = applicant;
          this.tasks = tasks;
          this.processDefinitionId = processDefinitionId;
        } else {
          this.applicant = {};
          this.tasks = [];
        }
      });
    }
  },
  mounted() {
    this.getOrderBaseInfo();
  },
  beforeRouteEnter(to, from, next) {
    if (Object.keys(to.params).length > 0) {
      next();
    } else {
      next({ name: 'my-order/index', query: { time: new Date().getTime() } });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'my-order/index') {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  }
};
</script>

<style lang="less" scoped>
.details-content {
  width: 100%;
  min-height: 100%;
  .list-config {
    margin-top: 10px;
    .item-height {
      padding: 16px 0;
      min-height: 46px;
      box-sizing: border-box;

      &:nth-of-type(2n-1) {
        background-color: #f5f8fd;
      }

      &:nth-of-type(2n) {
        background-color: #fff;
      }
    }
  }
}
.order-width-100 {
  width: 100px;
}

.order-text-right {
  text-align: right;
}

.order-display-inline-block {
  display: inline-block;
  vertical-align: top;
}

.order-display-block {
  display: block;
}
.ressiue-action {
  .iconfont {
    position: relative;
    display: inline-block;
    width: 26px;
    height: 26px;
    font-size: 1rem;
    border: 1px solid #02a6fb;
    color: #02a6fb;
    padding: 4px;
    border-radius: 50%;
    cursor: pointer;
    &:before {
      position: absolute;
      left: 48%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding-right: 0;
    }
    &:hover {
      background: #02a6fb;
      color: #fff;
    }
  }
}
.list-common {
  margin: 0 40px 15px 40px;
}
.list-common:nth-of-type(1) {
  margin-top: 0;
}
.order-details {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
}
</style>
