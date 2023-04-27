<template>
  <div class="weekly-report-preview">
    <div style="margin-bottom:70px;">
      <div v-for="(item, index) in data" :key="index" style="margin-bottom:30px; position: relative;">
        <div class="user-box">
          <i class="iconfont icon-username"></i>
          <span>{{item.userName}}</span>
        </div>
        <div style="position: absolute; top: 0; left: 120px; height: 30px; line-height: 30px; font-size: 16px; color: #2d8cf0; font-weight: bold; ">
          {{`[${item.dateFrom}~${item.dateTo}]`}}
        </div>
        <weekly-report :transProgress="item.reportProject" :transStudy="item.reportStudy"></weekly-report>
      </div>
    </div>
    <div class="footer">
      <div class="footer-button">
        <Button type="primary" @click="closeWeeklyReportPreview">关闭</Button>
      </div>
    </div>
  </div>
</template>

<script>
import weeklyReport from '@/components/weekly-report/weeklyReport.vue';
export default {
  props: {
    data: {
      type: Array
    }
  },
  components: {
    'weekly-report': weeklyReport
  },
  data() {
    return {
      progress: [
        {
          id: '',
          projectJSON: '',
          projectId: '', // 项目ID
          projectName: '', // 项目名称
          managerName: '', // 项目经理名称
          managerId: '', // 项目经理ID
          weekProgress: '', // 本周进展
          projectProgress: '', // 整体进度
          projectRisk: '', // 项目风险
          nextWeekPlan: '' // 下周计划
        }
      ],
      study: [
        {
          id: '',
          studyContent: '', // 学习简介
          studyFeelings: '' // 心得体会
        }
      ]
    };
  },
  methods: {
    closeWeeklyReportPreview() {
      this.$emit('shouldComponentShow', 'shouldTableShow');
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
@import url('./WeeklyReportPreview.less');
</style>
