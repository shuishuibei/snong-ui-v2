<template>
  <div class="home-weekly-project-show">
    <div v-if="Object.keys(projectList).length">
      <weekly-report-project :projectList="projectList"></weekly-report-project>
    </div>
    <div v-else class="data-null">
      暂无数据
    </div>
  </div>
</template>

<script>
import weeklyReportProject from '@/components/weekly-report/weeklyReportProject.vue';
export default {
  name: 'home-weekly-project-show',
  components: {
    'weekly-report-project': weeklyReportProject
  },
  data() {
    return {
      projectList: {}
    };
  },
  methods: {
    getWeeklyReport() {
      this.$http({
        method: 'GET',
        url: `/overview/weekly/project/list`
      }).then(({ data }) => {
        if (data.status) {
          this.projectList = data.data;
        }
      });
    }
  },
  created() {
    this.getWeeklyReport();
  }
};
</script>

<style lang="less" scoped>
.home-weekly-project-show {
  height: calc(~'100% - 155px');
  .data-null {
    margin-top: 5px;
    padding-top: 10px;
    font-size: 14px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #d8dce5;
    height: 100%;
  }
}
</style>