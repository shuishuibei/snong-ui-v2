<template>
  <div class="weekly-report-edit">
    <div class="edit-content">
      <div class="date-center">
        <span>云智运维服务部周报</span>
        <DatePicker
          type="date"
          placeholder="选择开始日期"
          style="width: 200px; margin-left: 6px"
          v-model="pickStartDate"
          format="yyyy-MM-dd"
          @on-change="startDateChange"
        >
        </DatePicker>
        <span>&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;</span>
        <DatePicker
          type="date"
          placeholder="选择开始日期"
          style="width: 200px; margin-right: 6px"
          v-model="pickEndDate"
          format="yyyy-MM-dd"
          @on-change="endDateChange"
        >
        </DatePicker>
      </div>
      <edit-content :content="contentData" @transferContent="getContentData" flag="edit"></edit-content>
    </div>
    <div class="footer">
      <div class="footer-button">
        <Button type="primary" @click="saveAddReport">保存</Button>
        <Button class="cancel" @click="cancelAddReport">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { dataFormat } from "@/assets/js/format.js";
import EditContent from './EditContent.vue'

export default {
  name: "work-report-edit",
  props: {
    data: {
      type: Object,
    },
  },
  components: {
    'edit-content': EditContent,
  },
  data() {
    return {
      id: "", // 当前id，修改模式下有值
      pickStartDate: "", // 选择起始日期
      pickEndDate: "", // 选择结束日期
      contentData: {
        reportData: "",
        projectData: [
          // {
          //   id: "",
          //   workName: "", // 任务名称
          //   workContent: "", // 任务内容
          //   workProgress: "", // 任务进展
          //   mainWork: "", // 本周主要工作
          //   nextWork: "", // 下周工作计划
          //   riskWork: "", // 风险与求助
          //   startDate: "", // 开始时间
          //   endDate: "", // 结束时间
          // },
        ],
        abilityData: [
          // {
          //   id: "",
          //   workName: "", // 任务名称
          //   workContent: "", // 任务内容
          //   workProgress: "", // 任务进展
          //   mainWork: "", // 本周主要工作
          //   nextWork: "", // 下周工作计划
          //   riskWork: "", // 风险与求助
          //   endDate: "", // 结束时间
          // },
        ],
        developData: [
          // {
          //   id: "",
          //   workName: "", // 任务名称
          //   workProgress: "", // 任务进展
          //   mainWork: "", // 本周主要工作
          //   nextWork: "", // 下周工作计划
          //   riskWork: "", // 风险与求助
          //   startDate: "", // 开始时间
          //   endDate: "", // 结束时间
          // },
        ],
        productData: [
          // {
          //   id: "",
          //   workName: "", // 任务名称
          //   workContent: "", // 任务内容
          //   workProgress: "", // 任务进展
          //   mainWork: "", // 本周主要工作
          //   nextWork: "", // 下周工作计划
          //   riskWork: "", // 风险与求助
          //   startDate: "", // 开始时间
          //   endDate: "", // 结束时间
          // },
        ],
        expandData: [
          // {
          //   id: "",
          //   workName: "", // 客户名称
          //   workContent: "", // 服务机会点
          //   budget: "", // 预算金额
          //   workProgress: "", // 项目阶段
          //   mainWork: "", // 本周主要工作
          //   nextWork: "", // 下周工作计划
          //   riskWork: "", // 风险与求助
          //   sales: "", // 销售与拓展PM
          // },
        ],
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
    // 获取到组件中传递过来的数据
    getContentData(content) {
      this.contentData = content
    },
    // 修改开始日期
    startDateChange(startTime) {
      this.pickStartDate = startTime;
    },
    // 修改结束日期
    endDateChange(endTime) {
      this.pickEndDate = endTime;
    },
    setDefaultDate() {
      // 新增模式下
      this.$http({
        method: "GET",
        url: `/overview/weekly/date/last`,
      }).then(({ data }) => {
        if (data.status) {
          // 新增模式下
          if (!this.data) {
            this.pickStartDate = data.data.startDate.replace(/-/g, "/");
            this.pickEndDate = data.data.endDate.replace(/-/g, "/");
          } else if (this.data.mode == 'modify'){
            // 修改模式下
            this.pickStartDate = this.data.dateFrom; // 设置开始日期
            this.pickEndDate = this.data.dateTo; // 设置结束日期
            this.getWorkById();
          } else if (this.data.mode == 'copyAdd') {
            // 复制新增
            this.pickStartDate = data.data.startDate.replace(/-/g, "/");
            this.pickEndDate = data.data.endDate.replace(/-/g, "/");
            this.getWorkById();
          }
        }
      });
    },
    //根据ID获取工作周报
    getWorkById() {
      this.$http({
        method: "GET",
        url: `/work/${this.data.id}`,
      }).then(({ data }) => {
        if (data.status) {
          this.contentData.reportData = this.data.importWork;
          this.contentData.other.mainWork = this.data.otherWork;
          this.contentData.other.nextWork = this.data.nextWeekPlan;
          this.contentData.other.riskWork = this.data.question;
          data.data.reportWorkList.forEach(report => {
            if (report.workType === 'project') {
              this.contentData.projectData.push(report)
            } else if (report.workType === 'ability') {
              this.contentData.abilityData.push(report)
            } else if (report.workType === 'develop') {
              this.contentData.developData.push(report)
            } else if (report.workType === 'product') {
              this.contentData.productData.push(report)
            }
          });
          this.contentData.expandData= data.data.reportExpandList;
        }
      });
    },
    // 保存新增
    saveAddReport() {
      this.pickStartDate = dataFormat(this.pickStartDate, "-").substr(0, 10);
      this.pickEndDate = dataFormat(this.pickEndDate, "-").substr(0, 10);
      this.$loading.show();
      if (this.data && this.data.mode == "modify") {
        debugger;
        this.$http({
          method: "PUT",
          url: `/work/update`,
          data: {
            dateFrom: this.pickStartDate,
            dateTo: this.pickEndDate,
            id: this.data.id,
            importWork: this.contentData.reportData,
            otherWork: this.contentData.other.mainWork,
            nextWeekPlan: this.contentData.other.nextWork,
            question: this.contentData.other.riskWork,
            reportWorkList: this.contentData.projectData.concat(this.contentData.abilityData)
              .concat(this.contentData.developData).concat(this.contentData.productData),
            reportExpandList: this.contentData.expandData,
            userId: this.$store.state.login.userId,
            userName: this.$store.state.login.userName,
          },
        }).then(({ data }) => {
          if (data.status) {
            this.$Notice.success({
              desc: "修改成功",
            });
            this.$emit(
              "shouldComponentShow",
              "shouldTableShow",
              "refreshTable"
            );
          }
          this.$loading.hide();
        });
      } else {
        this.$http({
          method: "POST",
          url: `/work/add`,
          data: {
            dateFrom: this.pickStartDate,
            dateTo: this.pickEndDate,
            importWork: this.contentData.reportData,
            otherWork: this.contentData.other.mainWork,
            nextWeekPlan: this.contentData.other.nextWork,
            question: this.contentData.other.riskWork,
            reportWorkList: this.contentData.projectData.concat(this.contentData.abilityData)
                          .concat(this.contentData.developData).concat(this.contentData.productData),
            reportExpandList: this.contentData.expandData,
            userId: this.$store.state.login.userId,
            userName: this.$store.state.login.userName,
          },
        }).then(({ data }) => {
          if (data.status) {
            this.$Notice.success({
              desc: "个人周报保存成功",
            });
            this.$emit(
              "shouldComponentShow",
              "shouldTableShow",
              "refreshTable"
            );
          }
          this.$loading.hide();
        });
      }
    },
    // 取消新增
    cancelAddReport() {
      this.$emit("shouldComponentShow", "shouldTableShow");
    },
  },
  mounted() {
    // 获取汇报周期
    this.setDefaultDate();
    // 获取项目列表
    // this.getProjectList();
  },
  watch: {
  },
};
</script>

<style scoped lang="less">
.weekly-report-edit {
  .edit-content {
    margin-bottom: 80px;
    .date-center {
      span {
        font-size: 14px;
      }
      span:nth-of-type(1) {
        letter-spacing: 2px;
      }
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
      .ivu-btn span {
        letter-spacing: 0;
        padding-left: 0;
      }
    }
  }
}
</style>
