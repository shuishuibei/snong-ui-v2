<template>
  <div class="weekly-report-personal">
    <project-table
      ref="table"
      v-show="shouldShow.table"
      @shouldComponentShow="shouldComponentShow">
    </project-table>
    <project-preview
      ref="preview"
      v-if="shouldShow.mulPreview"
      :data="transferData"
      @shouldComponentShow="shouldComponentShow">
    </project-preview>
    <project-single-preview
      ref="singlePreview"
      v-if="shouldShow.singlePreview"
      :data="transferData"
      @shouldComponentShow="shouldComponentShow">
    </project-single-preview>
  </div>
</template>

<script>
import ProjectTable from './ProjectTable.vue';
import ProjectPreview from './ProjectPreview.vue';
import ProjectSinglePreview from './ProjectSinglePreview.vue';
export default {
  components: {
    'project-table': ProjectTable,
    'project-preview': ProjectPreview,
    'project-single-preview': ProjectSinglePreview
  },
  data() {
    return {
      transferData: {},
      shouldShow: {
        table: false,
        singlePreview: false,
        mulPreview: false
      },
      shouldShowDuplicate: {
        table: false,
        singlePreview: false,
        mulPreview: false
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
    this.shouldComponentShow('table');
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
