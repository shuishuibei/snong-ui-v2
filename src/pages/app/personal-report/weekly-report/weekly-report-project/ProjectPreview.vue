<template>
  <div class="project-preview">
    <div class="content-wrapper">
      <div v-if="Object.keys(projectList).length">
        <weekly-report-project
          :projectList="projectList"
          :displayTime="true">
        </weekly-report-project>
      </div>
      <div v-else class="data-null">
        暂无数据
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
import weeklyReportProject from '@/components/weekly-report/weeklyReportProject.vue';
export default {
  name: 'project-preview',
  components: {
    'weekly-report-project': weeklyReportProject
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      projectList: {},
      projectNameList: []
    };
  },
  methods: {
    closeWeeklyReportPreview() {
      this.$emit('shouldComponentShow', 'table');
    }
  },
  computed: {
    dataLength: function() {
      this.data.forEach(item => {
        if (
          this.projectList[item.projectName] &&
          this.projectList[item.projectName].length
        ) {
          let arr = [...this.projectList[item.projectName]];
          arr.push(item);
          this.$set(this.projectList, item.projectName, arr);
        } else {
          this.$set(this.projectList, item.projectName, [item]);
        }
      });
      return this.data.length;
    }
  },
  watch: {
    dataLength(value) {}
  }
};
</script>

<style scoped lang="less">
.content-wrapper {
  margin-bottom: 80px;
}
</style>