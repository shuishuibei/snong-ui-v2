<template>
  <div class="edit-container">
    <h3 class="title">
      <B>{{ titleData.title }}</B>
<!--      <div class="cds-float-right">-->
<!--        <Button-->
<!--          type="primary"-->
<!--          size="small"-->
<!--          v-if="switch1"-->
<!--          @click="addData"-->
<!--          class="button-add"-->
<!--        >新增</Button>-->
<!--        <i-switch-->
<!--          v-model="switch1"-->
<!--          size="small"-->
<!--          @on-change="switchChange"-->
<!--          v-if="flag !== 'preview'"-->
<!--        >-->
<!--        </i-switch>-->
<!--      </div>-->
    </h3>
    <div class="progress">
      <div class="title-header">
        <div v-for="(title, key) in titleData.titleHeaders" :key="title">
          <p :style="{width: titleData.titleWidth[key] === null ? '100%' : titleData.titleWidth[key]}">
            {{title}}
          </p>
        </div>
      </div>
      <div class="box-container" v-for="(item, index) in formData" :key="index">
<!--        <div class="cds-float-right delete-project" v-if="flag !== 'preview'">-->
<!--          <i-->
<!--            class="icon-common icon-dynamic iconfont icon-shanchu"-->
<!--            @click="removeProject(index)"-->
<!--            :class="{ deleteBgc: flag == 'preview' }"-->
<!--          ></i>-->
<!--        </div>-->
        <div class="content-container">
          <div v-for="(title, key) in titleData.titleHeaders" :key="key" class="content-box">
            <div
              :style="{width: titleData.titleWidth[key] === null ? '100%' : titleData.titleWidth[key]}"
              v-text="item[key]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "edit-table",
  props: {
    // 传入的表单数据
    formData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 区分不同的可编辑表单名称
    type: {
      type: String,
      default: "",
    },
    // 判断是新增还是预览
    flag: {
      type: String,
      default: "edit",
    },
  },
  data() {
    return {
      switch1: false,
      titleData: {},
    };
  },
  mounted() {
    switch (this.type) {
      case "project":
        this.titleData = {
          title: "运维服务项目交付与支持",
          titleHeaders: {
            workName: "项目名称",
            workContent: "项目类型",
            workProgress: "项目阶段",
            startDate: "项目启动时间",
            endDate: "项目结束时间",
            mainWork: "本周主要工作",
            nextWork: "下周工作计划",
            riskWork: "风险与求助",
          },
          titleWidth: {
            // workName: "100%",
            // workContent: "100%",
            // workProgress: "100%",
            // startDate: "100%",
            // endDate: "100%",
            mainWork: "400px",
            nextWork: "300px",
            riskWork: "200px",
          },
        };
        break;
      case "ability":
        this.titleData = {
          title: "运维体系建设与能力提升",
          titleHeaders: {
            workName: "任务目标",
            workContent: "任务内容",
            workProgress: "总体进展",
            endDate: "计划完成时间",
            mainWork: "本周主要工作",
            nextWork: "下周主要计划",
            riskWork: "风险与求助",
          },
          titleWidth: {
            mainWork: "400px",
            nextWork: "300px",
            riskWork: "200px",
          },
        };
        break;
      case "develop":
        this.titleData = {
          title: "运维平台开发与维护",
          titleHeaders: {
            workName: "模块名称",
            workProgress: "任务进展",
            startDate: "开始时间",
            endDate: "结束时间",
            mainWork: "本周开发内容",
            nextWork: "下周工作计划",
            riskWork: "风险与求助",
          },
          titleWidth: {
            mainWork: "400px",
            nextWork: "300px",
            riskWork: "200px",
          },
        };
        break;
      case "product":
        this.titleData = {
          title: "运维服务产品规划与开发",
          titleHeaders: {
            workName: "服务产品名称",
            workContent: "当前阶段",
            workProgress: "总体进展",
            startDate: "开始时间",
            endDate: "结束时间",
            mainWork: "本周主要工作",
            nextWork: "下周工作计划",
            riskWork: "风险与求助",
          },
          titleWidth: {
            mainWork: "400px",
            nextWork: "300px",
            riskWork: "200px",
          },
        };
        break;
      case "expand":
        this.titleData = {
          title: "云运维服务拓展",
          titleHeaders: {
            workName: "客户名称",
            workContent: "服务机会点",
            budget: "预算金额",
            workProgress: "项目阶段",
            sales: "销售与拓展PM",
            mainWork: "本周主要工作",
            nextWork: "下周工作计划",
            riskWork: "风险与求助",
          },
          titleWidth: {
            mainWork: "400px",
            nextWork: "300px",
            riskWork: "200px",
          },
        };
        break;
    }
  },
  methods: {
    // 添加项目进展汇报项
    addData() {
      let itemData = {
        id: "",
        workName: "", // 任务名称
        workContent: "", // 任务内容
        workProgress: "", // 任务进展
        mainWork: "", // 本周主要工作
        nextWork: "", // 下周工作计划
        riskWork: "", // 风险与求助
        startDate: "", // 开始时间
        endDate: "", // 结束时间
        budget: "", // 预算金额
        sales: "", // 销售与拓展PM
        workType: this.type //周报类型
      };
      this.formData.push(itemData);
      this.$emit("transferData", this.formData);
    },
    // 移除项目进展汇报项
    removeProject(index) {
      this.formData.splice(index, 1);
      this.$emit("transferData", this.formData);
      this.switch1 = this.formData.length !== 0;
    },
    // 开关状态变化
    switchChange(status) {
      if (status) {
        let itemData = {
          id: "",
          workName: "", // 任务名称
          workContent: "", // 任务内容
          workProgress: "", // 任务进展
          mainWork: "", // 本周主要工作
          nextWork: "", // 下周工作计划
          riskWork: "", // 风险与求助
          startDate: "", // 开始时间
          endDate: "", // 结束时间
          budget: "", // 预算金额
          sales: "", // 销售与拓展PM
          workType: this.type //周报类型
        };
        this.formData.push(itemData);
      } else {
        this.formData.splice(0,this.formData.length);
      }
      this.$emit("transferData", this.formData);
    }
  },
};
</script>

<style scoped lang="less">
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
.edit-container {
  overflow: auto;
  .title {
    position: relative;
    padding-left: 8px;
    height: 30px;
    line-height: 30px;
    font-weight: normal;
    border-bottom: 2px solid #d4dee6;
    margin: 10px 0;
    &:before {
      position: absolute;
      background-color: #ff0042;
      width: 3px;
      height: 18px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      content: "";
    }
    .button-add {
      width: 44px;
      height: 22px;
    }
  }
  .progress {
    margin-bottom: 10px;
    .title-header {
      display: flex;
      //width: calc(100% - 27px);
      div {
        flex: 1;
        background-color: #e6f1f7;
        border: 1px solid #dadbdf;
        margin: -1px;
        text-align: center;
        line-height: 25px;
        padding: 2px 5px;
      }
      &:first-child {
        border-left: 1px solid #dadbdf;
      }
    }
    .box-container {
      .content-container {
        display: flex;
        //border-right: 1px solid #dcdee2;
        .content-box {
          flex: 1;
          margin: -1px;
          border: 1px solid #dadbdf;
          white-space: pre-wrap;
          line-height: 20px;
          padding: 2px 5px;
          display: flex;
          align-items: center;
        }
        /deep/ .ivu-input {
          border-radius: 0;
          border-right: 0px;
          border-top: 0px;
          min-height: 160px;
        }
      }
      .delete-project {
        line-height: 32px;
        .deleteBgc {
          background-color: #bfc7d2;
          pointer-events: none;
          cursor: default;
        }
      }

    }
  }
}
</style>
