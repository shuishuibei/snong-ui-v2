<template>
  <div class="weekly-report-edit weekly-report footer-wrapper">
    <div class="edit-content">
      <div class="date-center">
        <span>云智运维服务部周报</span>
        <DatePicker
          type="date"
          placeholder="选择开始日期"
          style="width: 200px;margin-left: 6px;"
          v-model="pickStartDate"
          format="yyyy-MM-dd"
          @on-change="startDateChange">
        </DatePicker>
        <span>&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;</span>
        <DatePicker
          type="date"
          placeholder="选择开始日期"
          style="width: 200px;margin-right: 6px;"
          v-model="pickEndDate"
          format="yyyy-MM-dd"
          @on-change="endDateChange">
        </DatePicker>
      </div>
      <h3 class="title">
        个人周报汇报
      </h3>
      <div v-for="(item, index) in progress" :key="index">
        <div class="progress center">
          <div class="progress-title center-title">
            <span>部门名称：</span>
            <Select v-model="item.projectJSON" @on-change="projectChange(item.projectJSON,index)" style="width: 230px;" filterable clearable @on-clear="projectClear(item.projectJSON,index)">
              <Option v-for="value in projectList" :value="JSON.stringify(value)" :key="value.id">{{ value.projectName }}</Option>
            </Select>
            <span>&nbsp;&nbsp;部门领导：</span>
            <Input v-model="item.managerName" style="width: 200px;margin-right:10px;" :disabled="true" />
            <i class="icon-common icon-dynamic iconfont icon-plus" :class="{deleteBgc:true}"></i>
                 <!--@click="addProject" 暂时去掉可以增加项目操作，后续需要再增加-->
            <i class="icon-common icon-dynamic iconfont icon-shanchu" @click="removeProject(index)" :class="{deleteBgc:canNotDeleteProgress}"></i>
          </div>
          <div class="progress-bottom">
            <div class="pb-box pb-box-1">
              <div class="pb-box-title">
                <span>本周重点工作</span>
              </div>
              <Input type="textarea" v-model="item.weekProgress" :rows="16" />
            </div>
            <div class="pb-box pb-box-2">
              <div class="pb-box-title">
                <span>工作成果输出</span>
              </div>
              <Input type="textarea" v-model="item.projectProgress" :rows="16" />
            </div>
            <div class="pb-box pb-box-3">
              <div class="pb-box-title">
                <span>问题与求助</span>
              </div>
              <Input type="textarea" v-model="item.projectRisk" :rows="16" />
            </div>
            <div class="pb-box pb-box-4">
              <div class="pb-box-title">
                <span>下周工作计划</span>
              </div>
              <Input type="textarea" v-model="item.nextWeekPlan" :rows="16" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="study.length > 0">
        <h3 class="title">
          能力提升汇报
        </h3>
        <div v-for="(item, index) in study" :key="index">
          <div class="study center">
            <div class="study-title center-title">
              <span>标题：</span>
              <Select v-model="item.studyContent" style="width: 600px;margin-right:10px;">
                <Option v-for="item in studyTitleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
<!--              <Input v-model="item.studyContent" style="width: 600px;margin-right:10px;"placeholder="请输入培训工作/资料开发/经验分享或其他，可点击右侧[+]添加多项"/>-->
              <i class="icon-common icon-dynamic iconfont icon-plus" @click="addStudy"></i>
              <i class="icon-common icon-dynamic iconfont icon-shanchu" @click="removeStudy(index)" :class="{deleteBgc:canNotDeleteStudy}"></i>
            </div>
            <div class="study-bottom">
              <span>内容：</span>
              <Input type="textarea" v-model="item.studyFeelings" :rows="4" placeholder="请输入对应标题的具体内容"/>
            </div>
          </div>
        </div>
      </div>
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
import { dataFormat } from '@/assets/js/format.js';
export default {
  name: 'weekly-report-edit',
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      id: '', // 当前id，修改模式下有值
      pickStartDate: '', // 选择起始日期
      pickEndDate: '', // 选择结束日期
      projectList: [], // 项目列表
      canNotDeleteProgress: true,
      canNotDeleteStudy: true,
      progress: [
        {
          id: '',
          projectJSON: '',
          projectId: '', // 项目ID
          projectName: '', // 项目名称
          managerName: '', // 项目经理名称
          managerId: '', // 项目经理ID
          weekProgress: '', // 本周进展
          projectProgress: '', // 整体进度
          projectRisk: '', // 项目风险
          nextWeekPlan: '' // 下周计划
        }
      ],
      study: [
        {
          id: '',
          studyContent: '', // 学习简介
          studyFeelings: '' // 心得体会
        }
      ],
      studyTitleList: [
        {
          value: '培训工作',
          label: '培训工作'
        },
        {
          value: '资料开发',
          label: '资料开发'
        },
        {
          value: '其它',
          label: '其它'
        },
        {
          value: '经验分享',
          label: '经验分享'
        }
      ],
      textRows: 7 // 设置textarea高度
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
    // 获取项目列表
    getProjectList() {
      this.$http({
        // method: 'POST',
        // url: '/project-management/listAll'
        // 运维定制修改
        method: 'GET',
        url: '/project-management/get/project'
      }).then(({ data }) => {
        if (data.status) {
          this.projectList = data.data;
          if (!this.data) {
            // 新增状态
            this.progress[0].projectJSON = JSON.stringify(this.projectList[0]);
            this.progress[0].projectId = this.projectList[0].id;
            this.progress[0].projectName = this.projectList[0].projectName;
            this.progress[0].managerId = this.projectList[0].managerId;
            this.progress[0].managerName = this.projectList[0].managerName;
            this.setDefaultDate();
          } else if (this.data.mode == 'modify') {
            // 修改模式下
            this.pickStartDate = this.data.dateFrom; // 设置开始日期
            this.pickEndDate = this.data.dateTo; // 设置结束日期
            this.id = this.data.id; // 设置ID
            this.progress = this.data.reportProject;
            this.chooseProject(); // 设置项目名称
            this.setReportStudy();
          } else if (this.data.mode == 'copyAdd') {
            // 复制新增模式下
            this.setDefaultDate();
            this.progress = this.data.reportProject;
            this.chooseProject(); // 设置项目名称
            this.setReportStudy();
          }
        }
      });
    },
    // 选择项目时
    projectChange(label, index) {
      if (label) {
        this.progress[index].projectId = JSON.parse(label).id;
        this.progress[index].projectName = JSON.parse(label).projectName;
        this.progress[index].managerId = JSON.parse(label).managerId;
        this.progress[index].managerName = JSON.parse(label).managerName;
      }
    },
    // 清除选择的项目时
    projectClear(label, index) {
      this.progress[index].projectId = '';
      this.progress[index].projectName = '';
      this.progress[index].managerId = '';
      this.progress[index].managerName = '';
    },
    // 设置项目名称为已选项目
    chooseProject() {
      this.progress.forEach((progressItem, progressIndex) => {
        this.progress[progressIndex].projectJSON = JSON.stringify(
          this.projectList.filter((projectItem, projectIndex) => {
            if (progressItem.projectId == projectItem.id) {
              return (progressItem.projectId = projectItem.id);
            }
          })[0]
        );
      });
    },
    // 设置默认日期
    setDefaultDate() {
      // 新增模式下
      this.$http({
        method: 'GET',
        url: `/overview/weekly/date/last`
      }).then(({data})=>{
        if(data.status){
          this.pickStartDate = data.data.startDate.replace(/-/g,'/');
          this.pickEndDate = data.data.endDate.replace(/-/g,'/');
        }
      })
    },
    // 在预览、修改、复制新增时，自我学习汇报如果为空，则手动设置一项
    setReportStudy() {
      if (this.data.reportStudy.length > 0) {
        this.study = this.data.reportStudy;
      } else {
        this.study = [
          {
            id: '',
            studyContent: '', // 学习简介
            studyFeelings: '' // 心得体会
          }
        ];
      }
    },
    // 添加项目进展汇报项
    addProject() {
      this.progress.push({
        id: '',
        projectJSON: '',
        projectId: '', // 项目ID
        projectName: '', // 项目名称
        managerName: '', // 项目经理名称
        managerId: '', // 项目经理ID
        weekProgress: '', // 本周进展
        projectProgress: '', // 整体进度
        projectRisk: '', // 项目风险
        nextWeekPlan: '' // 下周计划
      });
      this.progress[this.progress.length - 1].projectJSON = JSON.stringify(
        this.projectList[0]
      );
      this.progress[
        this.progress.length - 1
      ].projectId = this.projectList[0].id;
      this.progress[
        this.progress.length - 1
      ].projectName = this.projectList[0].projectName;
      this.progress[
        this.progress.length - 1
      ].managerId = this.projectList[0].managerId;
      this.progress[
        this.progress.length - 1
      ].managerName = this.projectList[0].managerName;
    },
    // 移除项目进展汇报项
    removeProject(index) {
      if (this.progress.length > 1) {
        this.progress.splice(index, 1);
      }
    },
    // 添加自我学习汇报
    addStudy() {
      this.study.push({
        studyContent: '', // 学习简介
        studyFeelings: '' // 心得体会
      });
    },
    // 移除自我学习汇报
    removeStudy(index) {
      if (this.study.length > 1) {
        this.study.splice(index, 1);
      }
    },
    // 保存新增
    saveAddReport() {
      let shouldSubmit = this.progress.every((item, index) => {
        if (item.projectJSON == undefined) {
          this.$Notice.warning({
            desc: `第${index + 1}项项目进展汇报未选择项目`
          });
        }
        return item.projectJSON !== undefined;
      });
      if (shouldSubmit) {
        this.pickStartDate = dataFormat(this.pickStartDate, '-').substr(0, 10);
        this.pickEndDate = dataFormat(this.pickEndDate, '-').substr(0, 10);
        this.$loading.show();
        if (this.data && this.data.mode == 'modify') {
          this.$http({
            method: 'PUT',
            url: `/weekly-report/update`,
            data: {
              dateFrom: this.pickStartDate,
              dateTo: this.pickEndDate,
              id: this.id,
              reportProject: this.progress,
              reportStudy: this.study,
              userId: this.$store.state.login.userId,
              userName: this.$store.state.login.userName
            }
          }).then(({ data }) => {
            if (data.status) {
              this.$Notice.success({
                desc: '修改成功'
              });
              this.$emit(
                'shouldComponentShow',
                'shouldTableShow',
                'refreshTable'
              );
            }
            this.$loading.hide();
          });
        } else {
          this.$http({
            method: 'POST',
            url: `/weekly-report/add`,
            data: {
              dateFrom: this.pickStartDate,
              dateTo: this.pickEndDate,
              id: this.id,
              reportProject: this.progress,
              reportStudy: this.study,
              userId: this.$store.state.login.userId,
              userName: this.$store.state.login.userName
            }
          }).then(({ data }) => {
            if (data.status) {
              this.$Notice.success({
                desc: '保存成功'
              });
              this.$emit(
                'shouldComponentShow',
                'shouldTableShow',
                'refreshTable'
              );
            }
            this.$loading.hide();
          });
        }
      }
    },
    // 取消新增
    cancelAddReport() {
      this.$emit('shouldComponentShow', 'shouldTableShow');
    }
  },
  mounted() {
    // 获取项目列表
    this.getProjectList();
  },
  watch: {
    progress(curVal, oldVal) {
      if (curVal.length > 1) {
        this.canNotDeleteProgress = false;
      } else {
        this.canNotDeleteProgress = true;
      }
    },
    study(curVal, oldVal) {
      if (curVal.length > 1) {
        this.canNotDeleteStudy = false;
      } else {
        this.canNotDeleteStudy = true;
      }
    }
  }
};
</script>

<style lang="less">
.weekly-report {
  // 禁用状态下背景颜色
  .ivu-input[disabled],
  fieldset[disabled] .ivu-input {
    background-color: #ffffff;
  }
  // 禁用状态下select背景颜色
  .ivu-select-disabled .ivu-select-selection {
    background-color: #ffffff;
  }
  // 禁用状态下字体颜色
  .ivu-input[disabled] {
    color: #495060;
  }
  .ivu-select-disabled .ivu-select-selection {
    color: #495060;
  }
  .progress {
    .pb-box {
      .ivu-input-wrapper {
        // width: 90%;
        margin-left: 10%;
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
  }
  .study {
    .ivu-input-wrapper {
      width: 93%;
    }
    .study-bottom {
      .ivu-input {
        resize: none;
      }
    }
  }
}
</style>

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
}

.weekly-report-edit {
  .title {
    position: relative;
    padding-left: 8px;
    height: 30px;
    line-height: 30px;
    font-weight: normal;
    border-bottom: 1px solid #e4e8eb;
    margin: 20px 0;
    &:before {
      position: absolute;
      background-color: #ff0042;
      width: 3px;
      height: 18px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      content: '';
    }
  }
  .center {
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
      .icon-common {
        display: inline-block;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        vertical-align: middle;
        margin: 0 2px;
        position: relative;
        background-color: #2b99ff;
        cursor: pointer;
        &::before {
          color: #fffcf6;
          font-size: 12px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .progress {
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
          // width: 10%;
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
  .study {
    .study-title {
      .deleteBgc {
        background-color: #bfc7d2;
      }
    }
    .study-bottom {
      height: 120px;
      padding-top: 10px;
      span {
        padding-left: 8px;
        font-size: 14px;
        color: #64707c;
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}
.footer-wrapper {
  .footer {
    height: 80px;
    background-color: #f5f8fd;
    box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.2);
    border-top: 2px solid rgba(0, 0, 0, 0.2);
    position: fixed;
    bottom: 0;
    right: 10px;
    width: calc(~'100% - 261px');
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
