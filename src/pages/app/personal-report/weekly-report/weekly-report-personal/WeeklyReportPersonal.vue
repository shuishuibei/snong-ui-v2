<template>
  <div class="weekly-report-personal">
    <weekly-report-table v-show="shouldShow.shouldTableShow" @shouldComponentShow="shouldComponentShow" ref="weeklyReportTable"></weekly-report-table>
    <weekly-report-edit v-if="shouldShow.shouldEditShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></weekly-report-edit>
    <weekly-report-preview v-if="shouldShow.shouldPreviewShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></weekly-report-preview>
    <weekly-report-single-preview v-if="shouldShow.shouldSinglePreviewShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></weekly-report-single-preview>
  </div>
</template>

<script>
import WeeklyReportTable from './WeeklyReportTable.vue'; // 引入个人周报表格组件
import WeeklyReportEdit from './WeeklyReportEdit.vue'; // 引入个人周报新增组件
import WeeklyReportSinglePreview from './WeeklyReportSinglePreview.vue'; // 引入个人周报预览组件
import WeeklyReportPreview from './WeeklyReportPreview.vue'; // 引入周报预览组件
export default {
  components: {
    'weekly-report-table': WeeklyReportTable,
    'weekly-report-edit': WeeklyReportEdit,
    'weekly-report-preview': WeeklyReportPreview,
    'weekly-report-single-preview': WeeklyReportSinglePreview
  },
  data() {
    return {
      transferData: {},
      shouldShow: {
        shouldTableShow: false,
        shouldEditShow: false,
        shouldPreviewShow: false,
        shouldSinglePreviewShow: false
      },
      shouldShowDuplicate: {
        shouldTableShow: false,
        shouldEditShow: false,
        shouldPreviewShow: false,
        shouldSinglePreviewShow: false
      }
    };
  },
  methods: {
    shouldComponentShow(componentsName, data) {
      this.transferData = data;
      Object.assign(this.shouldShow, this.shouldShowDuplicate, {
        [componentsName]: true
      });
      if (data === 'refreshTable') {
        this.$refs['weeklyReportTable'].handleRefresh();
      }
    }
  },
  created() {
    this.shouldComponentShow('shouldTableShow');
  }
};
</script>

<style scoped lang="less">
.weekly-report-personal {
  width: 100%;
  height: 100%;
}
.search-wrapper,
.btn-wrapper {
  padding-bottom: 15px;
}

.page-wrapper {
  position: relative;
  margin-top: 12px;
}
</style>
