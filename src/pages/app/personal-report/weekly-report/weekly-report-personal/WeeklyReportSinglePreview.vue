<template>
  <div class="weekly-report-single-preview">
    <div class="edit-content">
      <div class="date-center">
        <span>云智运维服务部周报</span>
        <DatePicker type="date" placeholder="选择开始日期" style="width: 200px;margin-left: 6px;" v-model="dateFrom" format="yyyy-MM-dd" :disabled="true" :readonly="true"></DatePicker>
        &nbsp;&nbsp;&nbsp;
        <span>至</span>
        &nbsp;&nbsp;&nbsp;
        <DatePicker type="date" placeholder="选择开始日期" style="width: 200px;margin-right: 6px;" v-model="dateTo" format="yyyy-MM-dd" :disabled="true" :readonly="true"></DatePicker>
      </div>
      <weekly-report :transProgress="data.reportProject" :transStudy="data.reportStudy"></weekly-report>
    </div>
    <div class="footer">
      <div class="footer-button">
        <Button type="primary" @click="close">关闭</Button>
      </div>
    </div>
  </div>
</template>

<script>
import weeklyReport from '@/components/weekly-report/weeklyReport.vue';
export default {
  name: 'weekly-report-single-preview',
  components: {
    'weekly-report': weeklyReport
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      dateFrom: '',
      dateTo: ''
    };
  },
  methods: {
    // 关闭预览，不刷新表格
    close() {
      this.$emit('shouldComponentShow', 'shouldTableShow');
    }
  },
  mounted() {
    this.dateFrom = this.data.dateFrom;
    this.dateTo = this.data.dateTo;
  }
};
</script>

<style scoped lang="less">
.weekly-report-single-preview {
  .edit-content {
    margin-bottom: 77px;
    .date-center {
      span {
        font-size: 14px;
      }
      span:nth-of-type(1) {
        letter-spacing: 2px;
      }
    }
  }
}
</style>

<style lang="less">
.weekly-report-single-preview {
  // 禁用状态下字体颜色
  .ivu-input[disabled] {
    color: #495060;
  }
}
</style>

