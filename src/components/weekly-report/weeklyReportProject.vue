<template>
  <div>
    <div v-for="(value, key) in projectList" :key="key">
      <div class="weekly-report-box" :ref="key">
        <h3 class="title">
          <span>
            <i class="iconfont icon-xiangmu"></i>
          </span>
          <p>
            {{key}}
          </p>
        </h3>
        <div v-for="(item, subKey) in value" :key="subKey">
          <weekly-report-progress
            type="项目预览"
            :item="item"
            :displayTime="displayTime">
          </weekly-report-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import weeklyReportProgress from './weeklyReportProgress.vue';
export default {
  props: {
    projectList: {
      type: Object
    },
    displayTime: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'weekly-report-progress': weeklyReportProgress
  }
};
</script>

<style lang="less" scoped>
.weekly-report-box {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  .title {
    position: relative;
    padding-left: 8px;
    height: 40px;
    font-weight: normal;
    border-bottom: 1px solid #e4e8eb;
    margin: 0 0 15px 0;
    color: #2d8cf0;
    span {
      display: inline-block;
      vertical-align: middle;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #2d8cf0;
      text-align: center;
      position: relative;
      i {
        color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    p {
      display: inline-block;
      vertical-align: middle;
      padding-left: 8px;
    }
  }
}
</style>