<template>
  <div class="cds-wrapper cds-border cds-padding-14">
      <work-report-table v-show="shouldShow.shouldTableShow" @shouldComponentShow="shouldComponentShow" ref="WorkReportTable"></work-report-table>
      <work-report-edit v-if="shouldShow.shouldEditShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></work-report-edit>
      <work-report-preview v-if="shouldShow.shouldPreviewShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></work-report-preview>
      <work-report-single-preview v-if="shouldShow.shouldSinglePreviewShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></work-report-single-preview>
  </div>
</template>

<script>
import WorkReportTable from './components/WorkReportTable.vue'; // 引入个人周报表格组件
import WorkReportEdit from './components/WorkReportEdit.vue'; // 引入个人周报新增组件
import WorkReportSinglePreview from './components/WorkReportSinglePreview.vue'; // 引入个人周报预览组件
import WorkReportPreview from './components/WorkReportPreview.vue'; // 引入周报预览组件
export default {
  components: {
    'work-report-table': WorkReportTable,
    'work-report-edit': WorkReportEdit,
    'work-report-preview': WorkReportPreview,
    'work-report-single-preview': WorkReportSinglePreview
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
        this.$refs['WorkReportTable'].getPersonnelCount();
        this.$refs['WorkReportTable'].handleRefresh();
      }
    }
  },
  created() {
    this.shouldComponentShow('shouldTableShow');
  }
};
</script>

<style scoped lang="less">
.work-report-personal {
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
