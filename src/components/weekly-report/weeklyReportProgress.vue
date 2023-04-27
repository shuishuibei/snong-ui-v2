<template>
  <div class="progress-preview center-preview">
    <div class="progress-title center-title" v-if="type == '人员预览'">
      <span :title="item.projectName">部门名称：{{ item.projectName }}</span>
      <span>&nbsp;&nbsp;部门领导：{{item.managerName}}</span>
    </div>
    <div class="progress-title center-title" v-else-if="type == '项目预览'">
      <span :title="item.projectName">{{ item.userName }}</span>
      <template v-if="displayTime">
        <span style="margin-left: 20px">
          {{ item.dateFrom }}
          &nbsp;&nbsp;&nbsp;
          <span>至</span>
          &nbsp;&nbsp;&nbsp;
          {{ item.dateTo }}
        </span>
      </template>
    </div>
    <div class="progress-bottom">
      <div class="pb-box pb-box-1">
        <div class="pb-box-title">
          <span>本周重点工作</span>
        </div>
        <Input type="textarea" v-model="item.weekProgress" :rows="16" :disabled="true" />
      </div>
      <div class="pb-box pb-box-2">
        <div class="pb-box-title">
          <span>工作成果输出</span>
        </div>
        <Input type="textarea" v-model="item.projectProgress" :rows="16" :disabled="true" />
      </div>
      <div class="pb-box pb-box-3">
        <div class="pb-box-title">
          <span>问题与求助</span>
        </div>
        <Input type="textarea" v-model="item.projectRisk" :rows="16" :disabled="true" />
      </div>
      <div class="pb-box pb-box-4">
        <div class="pb-box-title">
          <span>下周工作计划</span>
        </div>
        <Input type="textarea" v-model="item.nextWeekPlan" :rows="16" :disabled="true" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'weekly-report-progress',
  props: {
    item: {
      type: Object
    },
    type: {
      type: String,
      default: '人员预览'
    },
    displayTime: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="less">
.progress-preview {
  .progress-title {
    .deleteBgc {
      background-color: #bfc7d2;
    }
  }
  .progress-bottom {
    // height: 230px;
    font-size: 0;
    -webkit-text-size-adjust: none;
    .pb-box:nth-last-of-type(1) {
      margin-right: 1.2%;
    }
    .pb-box {
      font-size: 12px;
      box-sizing: border-box;
      display: inline-block;
      min-height: 300px;
      max-height: 400px;
      border: 1px solid #dadbdf;
      border-radius: 3px;
      // width: 23.70%;
      margin-left: 1%;
      margin-top: 1%;
      margin-bottom: 1%;
      position: relative;
      .pb-box-title {
        width: 25px;
        height: 100%;
        background-color: #e6f1f7;
        position: absolute;
        span {
          display: inline-block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #64707c;
        }
      }
    }
    .pb-box-1 {
      width: 45%;
    }
    .pb-box-2 {
      width: 13.05%;
    }
    .pb-box-3 {
      width: 13.05%;
    }
    .pb-box-4 {
      width: 23.7%;
    }
  }
}
.center-preview {
  border: 1px solid #dadbdf;
  margin-bottom: 10px;
  .center-title {
    height: 50px;
    line-height: 50px;
    background-color: #e6f1f7;
    padding-left: 8px;
    font-size: 14px;
    color: #64707c;
    position: relative;
  }
}
</style>

<style lang="less">
.progress-preview {
  .pb-box {
    .ivu-input-wrapper {
      width: calc(~'100% - 25px');
      margin-left: 25px;
    }
    .ivu-input {
      border: none !important;
      resize: none;
    }
    .ivu-input:hover {
      border: none !important;
    }
    textarea:focus {
      outline: none;
      box-shadow: none;
    }
  }
  .ivu-input-type {
    input {
      outline: none;
      background-color: transparent !important;
      font-family: Microsoft YaHei;
      color: #64707c;
      font-size: 14px;
      vertical-align: top;
      padding-left: 0;
    }
    .ivu-input {
      border: none !important ;
    }
  }
  textarea {
    cursor: default !important;
  }
}
.center-preview {
  .ivu-input[disabled],
  fieldset[disabled] .ivu-input {
    background-color: #ffffff;
  }
  // 禁用状态下字体颜色
  .ivu-input[disabled] {
    color: #495060;
  }
}
</style>
