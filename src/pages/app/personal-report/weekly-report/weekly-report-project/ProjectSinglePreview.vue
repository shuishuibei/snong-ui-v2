<template>
  <div class="project-single-preview">
    <div class="content-wrapper">
      <div class="date-center">
        <span>{{ data.projectName }}</span>
        <DatePicker
          type="date"
          format="yyyy-MM-dd"
          style="width: 200px;margin-left: 6px;"
          :value="data.dateFrom"
          :disabled="true"
          :readonly="true">
        </DatePicker>
        &nbsp;&nbsp;&nbsp;
        <span>至</span>
        &nbsp;&nbsp;&nbsp;
        <DatePicker
          type="date"
          format="yyyy-MM-dd"
          style="width: 200px;margin-left: 6px;"
          :value="data.dateTo"
          :disabled="true"
          :readonly="true">
        </DatePicker>
      </div>
      <weekly-report-progress :item="data" type="项目预览"></weekly-report-progress>
    </div>
    <div class="footer">
      <div class="footer-button">
        <Button type="primary" @click="close">关闭</Button>
      </div>
    </div>
  </div>
</template>

<script>
import weeklyReportProgress from '@/components/weekly-report/weeklyReportProgress.vue';
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    'weekly-report-progress': weeklyReportProgress
  },
  methods: {
    close() {
      this.$emit('shouldComponentShow', 'table');
    }
  }
};
</script>

<style scoped lang="less">
/deep/.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  color: #495060;
}
.content-wrapper {
  margin-bottom: 80px;
  .date-center {
    margin-bottom: 15px;
    span {
      font-size: 14px;
    }
    span:nth-of-type(1) {
      letter-spacing: 2px;
    }
  }
}
</style>