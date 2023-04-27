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
      <DatePicker
        type="date"
        placeholder="选择开始日期"
        style="width: 120px;"
        v-model="pickStartDate"
        format="yyyy-MM-dd"
        @on-change="startDateChange"
      >
      </DatePicker>
      <span>&nbsp;至&nbsp;</span>
      <DatePicker
        type="date"
        placeholder="选择开始日期"
        style="width: 120px;"
        v-model="pickEndDate"
        format="yyyy-MM-dd"
        @on-change="endDateChange"
      >
      </DatePicker>
      <AutoComplete
        clearable
        placeholder="请选择部门分组进行查询"
        :data="projectNamesList"
        v-model="searchValue"
        @on-select="handleSearch">
      </AutoComplete>
      <AutoComplete
        clearable
        v-model="workerName"
        placeholder="请输入员工姓名"
        style="width: 120px"
      >
      </AutoComplete>
      <i-button class="cds-btn-search" type="primary" @click="handleSearch">
        <i class="iconfont icon-iconfontsousuo"></i>
      </i-button>
    </div>
    <people-count type="preview-person" :send-names="sendNames" @clickName="getClickName"></people-count>
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
import WorkPeopleCounting from './WorkPeopleCounting.vue'
import PreviewContent from './PreviewContent.vue'
import { dataFormat } from '@/assets/js/format.js';

export default {
  props: {
    data: {
      type: Array,
    },
  },
  components: {
    'people-count': WorkPeopleCounting,
    'preview-content': PreviewContent,
  },
  data() {
    return {
      workerName: "", // 输入的员工姓名
      searchName: "", // 点击查询实际发送的员工姓名
      pickStartDate: '', // 选择起始日期
      pickEndDate: '', // 选择结束日期
      searchStartDate: '', // 查询起始日期
      searchEndDate: '', // 查询结束日期
      sendNames: [], //发送周报人员名单
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
      },
      projectNamesList: [], // 项目名称列表
      searchValue:'', //选择的项目名称
    };
  },
  methods: {
    // 修改开始日期
    startDateChange(startTime) {
      this.pickStartDate = startTime;
    },
    // 修改结束日期
    endDateChange(endTime) {
      this.pickEndDate = endTime;
    },
    // 默认为上周周报预览
    setDefaultDate() {
      // 新增模式下
      this.$http({
        method: "GET",
        url: `/overview/weekly/date/last`,
      }).then(({ data }) => {
        if (data.status) {
          this.pickStartDate = data.data.startDate.replace(/-/g, "/");
          this.pickEndDate = data.data.endDate.replace(/-/g, "/");
          this.searchStartDate = dataFormat(this.pickStartDate, '-').substr(0, 10);
          this.searchEndDate = dataFormat(this.pickEndDate, '-').substr(0, 10);
          this.getSendUserNames();
          this.getWorkerData();
        }
      });
    },
    // 查询员工姓名
    handleSearch(value) {
      if (typeof value == 'string') {
        this.searchValue = value;
      }
      // 将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchName = this.workerName.trim();
      this.searchStartDate = dataFormat(this.pickStartDate, '-').substr(0, 10);
      this.searchEndDate = dataFormat(this.pickEndDate, '-').substr(0, 10);
      this.getSendUserNames();
      this.getWorkerData();
    },
    // 当前点击的员工姓名
    getClickName(name) {
      let i1 = name.indexOf('['),
        i2 = name.indexOf('~'),
        i3 = name.lastIndexOf(']');
      this.searchName = name.substring(0,i1);
      this.searchStartDate = name.substring(i1+1,i2);
      this.searchEndDate = name.substring(i2+1,i3);
      this.getWorkerData()
    },
    // 获取发送周报人员名单
    getSendUserNames() {
      //发送请求并且做相应处理
      this.$http.get(`work/preview?startDate=${this.searchStartDate}&endDate=${this.searchEndDate}&projectName=${this.searchValue}&userName=${this.searchName}`)
        .then(({data}) => {
          if (data.status) {
            let resp = data.data;
            if (resp.sendUserNames) {
              this.sendNames = resp.sendUserNames;
            } else {
              this.sendNames = [];
            }
            this.currentName = resp.currentName;
          }
        })
    },
    // 请求接口，获取当前员工的周报信息
    getWorkerData() {
      //发送请求并且做相应处理
      this.$http.get(`work/preview?startDate=${this.searchStartDate}&endDate=${this.searchEndDate}&projectName=${this.searchValue}&userName=${this.searchName}`)
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
    getProjectList() {
      this.$http({
        method: 'GET',
        url: '/project/get/inner'
      }).then(({ data }) => {
        if (data.status) {
          this.projectList = data.data;
          this.projectList.forEach(value => {
            this.projectNamesList.push(value.projectName);
          });
        }
      });
    }
  },
  created() {
    // 获取汇报周期
    this.setDefaultDate();
    this.getProjectList();
  },
  mounted() {
    // 获取周报人员名单
    // this.getSendUserNames();
    // 获取默认第一个人的周报内容
    // this.getWorkerData();
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
