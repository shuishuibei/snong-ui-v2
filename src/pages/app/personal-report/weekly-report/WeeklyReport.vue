<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <Tabs :animated="false">
      <TabPane label="个人周报">
        <weekly-report-personal></weekly-report-personal>
      </TabPane>
      <TabPane label="项目周报">
        <weekly-report-project></weekly-report-project>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import WeeklyReportPersonal from './weekly-report-personal/WeeklyReportPersonal.vue';
import WeeklyReportProject from './weekly-report-project/Index.vue';
export default {
  name: 'weekly-report',
  components: {
    'weekly-report-personal': WeeklyReportPersonal,
    'weekly-report-project': WeeklyReportProject
  }
};
</script>

<style scoped lang="less">
.weekly-report {
  padding: 0 15px 15px 15px;
}
/deep/.ivu-tabs .ivu-tabs-content-animated {
  will-change: auto;
  transform: none !important;
}
/deep/.ivu-tabs-bar {
  margin-bottom: 15px;
}
</style>
