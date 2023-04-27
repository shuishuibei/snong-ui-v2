<!--
 * @Description: 周报预览
 * @Author: y22998
 * @LastEditors: y22998
 * @Date: 2022-08-22 11:07:20
 * @LastEditTime: 2022-08-26 16:02:56
-->
<template>
  <div class="weekly-report-preview">
    <div class="top-container">
      <span>云智运维服务部周报</span>
    </div>
    <div class="user-box" v-if="this.currentName">
      <i class="iconfont icon-username"></i>
      <span>{{currentName}}</span>
    </div>
    <preview-content :content="contentData" flag="preview"></preview-content>
    <div class="footer">
      <div class="footer-button">
        <Button type="primary" @click="closeWeeklyReportPreview">关闭</Button>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewContent from './PreviewContent.vue'

export default {
  props: {
    data: {
      type: Object,
    },
  },
  components: {
    'preview-content': PreviewContent,
  },
  data() {
    return {
      searchName: "", // 点击查询实际发送的员工姓名
      searchStartDate: '', // 查询起始日期
      searchEndDate: '', // 查询结束日期
      currentName: '', //当前周报人员
      contentData: {
        reportData: "",
        projectData: [],
        abilityData: [],
        developData: [],
        productData: [],
        expandData: [],
        other: {
            id: "",
            mainWork: "", // 本周主要工作
            nextWork: "", // 下周工作计划
            riskWork: "", // 风险与求助
          },
      }
    };
  },
  methods: {
    // 请求接口，获取当前员工的周报信息
    getWorkerData() {
      this.searchStartDate = this.data.dateFrom;
      this.searchEndDate = this.data.dateTo;
      this.searchName = this.data.userName;
      this.currentName = this.searchName + '[' + this.searchStartDate + "~" + this.searchEndDate + ']';
      //发送请求并且做相应处理
      this.$http.get(`work/preview?startDate=${this.searchStartDate}&endDate=${this.searchEndDate}&userName=${this.searchName}`)
        .then(({data}) => {
          // 让this.contentData = 返回的数据，需要注意字段的对应
        if (data.status) {
          let resp = data.data;
          let wortData = resp.workReportDTO;
          if (wortData) {
            this.currentName = resp.currentName;
            this.contentData.reportData = wortData.importWork;
            this.contentData.other.mainWork = wortData.otherWork;
            this.contentData.other.nextWork = wortData.nextWeekPlan;
            this.contentData.other.riskWork = wortData.question;
            this.contentData.expandData = wortData.reportExpandList;
            this.contentData.projectData = [];
            this.contentData.abilityData = [];
            this.contentData.developData = [];
            this.contentData.productData = [];
            wortData.reportWorkList.forEach(report => {
              if (report.workType === 'project') {
                this.contentData.projectData.push(report)
              } else if (report.workType === 'ability') {
                this.contentData.abilityData.push(report)
              } else if (report.workType === 'develop') {
                this.contentData.developData.push(report)
              } else if (report.workType === 'product') {
                this.contentData.productData.push(report)
              }
            })
          } else {
            this.contentData = {
              reportData: "",
              projectData: [],
              abilityData: [],
              developData: [],
              productData: [],
              expandData: [],
              other: {
                id: "",
                mainWork: "", // 本周主要工作
                nextWork: "", // 下周工作计划
                riskWork: "", // 风险与求助
              }
            };
          }
        }
      })
    },
    // 关闭
    closeWeeklyReportPreview() {
      this.$emit("shouldComponentShow", "shouldTableShow");
    },
  },
  created() {
    // 获取汇报周期
    this.getWorkerData();
  },
};
</script>

<style scoped lang="less">
.weekly-report-preview {
  .user-box {
    width: 240px;
    height: 30px;
    line-height: 30px;
    background-color: #3399FE;
    padding-left: 15px;
    color: #FFFFFA;
    font-size: 12px;
    i {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-color: #247AD1;
      border-radius: 50%;
      vertical-align: middle;
      position: relative;
      font-size: 12px;
      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    }
    span {
      padding-left: 8px;
      vertical-align: middle;
    }
  }
  .top-container {
    margin-bottom: 10px;
    span {
      font-size: 14px;
    }
    span:nth-of-type(1) {
      letter-spacing: 2px;
    }
  }
  .footer {
    height: 80px;
    background-color: #f5f8fd;
    box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.2);
    border-top: 2px solid rgba(0, 0, 0, 0.2);
    position: fixed;
    bottom: 0;
    right: 10px;
    width: calc(~"100% - 261px");
    .footer-button {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(-50%, -50%);
      .cancel {
        margin-left: 8px;
      }
    }
  }
}
</style>
