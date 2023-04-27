<template>
  <div class="edit-container">
    <h3 class="title">
      <B>{{ titleData.title }}</B>
      <div class="cds-float-right">
        <Button
            type="primary"
            size="small"
            v-if="switch1"
            @click="addData"
            class="button-add"
        >新增</Button>
        <i-switch
            v-model="switch1"
            size="small"
            @on-change="switchChange"
            v-if="flag !== 'preview'"
        >
        </i-switch>
      </div>
    </h3>
    <div class="progress">
      <div class="box-container" v-for="(item, index) in formData" :key="index">
        <div class="cds-float-right delete-project" v-if="flag !== 'preview'">
          <i
            class="icon-common icon-dynamic iconfont icon-shanchu"
            @click="removeProject(index)"
            :class="{ deleteBgc: flag == 'preview' }"
          ></i>
        </div>
        <Form
          ref="formValidate"
          :model="item"
          :label-width="110"
          style="margin-top: 10px"
        >
          <Form-item
            v-if="titleData.titleHeaders && titleData.titleHeaders.workName"
            :label="titleData.titleHeaders.workName"
            prop="workName">
            <AutoComplete
              v-if="type==='project'"
              clearable
              v-model="item.workName"
              style="width: 400px"
              :data="projectList"
              :filter-method="filterMethod"
              @on-select="handlerSearch"
              placeholder="可搜索后选择项目名称，不存在时可直接填入。">
            </AutoComplete>
            <Input
              v-if="type!=='project'"
              v-model="item.workName"
              :readonly="flag == 'preview'"
              style="width: 400px"
            ></Input>
          </Form-item>
          <Row>
            <Col span="12">
              <Form-item
                  v-if="titleData.titleHeaders && titleData.titleHeaders.workContent"
                  :label="titleData.titleHeaders.workContent"
                  prop="workContent"
              >
                <Input
                    v-model="item.workContent"
                    :readonly="flag == 'preview'"
                    style="width: 130px"
                ></Input>
              </Form-item>
            </Col >
            <Col span="12">
              <Form-item
                  v-if="titleData.titleHeaders && titleData.titleHeaders.workProgress"
                  :label="titleData.titleHeaders.workProgress"
                  prop="workProgress">
                <Input
                    v-model="item.workProgress"
                    :readonly="flag == 'preview'"

                  style="width: 130px"
                >
                </Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item
                v-if="titleData.titleHeaders && titleData.titleHeaders.budget"
                :label="titleData.titleHeaders.budget"
                prop="budget"
              >
                <Input
                  v-model="item.budget"
                  :readonly="flag == 'preview'"

                  style="width: 130px"
                ></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item
                v-if="titleData.titleHeaders && titleData.titleHeaders.sales"
                :label="titleData.titleHeaders.sales"
                prop="sales"
              >
                <Input
                  v-model="item.sales"
                  :readonly="flag == 'preview'"

                  style="width: 130px"
                ></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item
                v-if="titleData.titleHeaders && titleData.titleHeaders.startDate"
                :label="titleData.titleHeaders.startDate"
                prop="startDate"
              >
                <Date-picker
                  type="date"
                  :readonly="flag == 'preview'"
                  placeholder="选择启动时间"
                  v-model="item.startDate"
                  style="width: 130px"
                ></Date-picker>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item
                v-if="titleData.titleHeaders && titleData.titleHeaders.endDate"
                :label="titleData.titleHeaders.endDate"
                prop="endDate"
              >
                <Date-picker
                  type="date"
                  :readonly="flag == 'preview'"
                  placeholder="选择结束时间"
                  v-model="item.endDate"
                  style="width: 130px"
                ></Date-picker>
              </Form-item>
            </Col>
          </Row>
          <Form-item
            v-if="titleData.titleHeaders && titleData.titleHeaders.mainWork"
            :label="titleData.titleHeaders.mainWork"
            prop="mainWork"
          >
            <Input
              v-model="item.mainWork"
              :readonly="flag == 'preview'"
              type="textarea"
              :rows="6"
              style="width: 400px"
            ></Input>
          </Form-item>
          <Form-item
            v-if="titleData.titleHeaders && titleData.titleHeaders.nextWork"
            :label="titleData.titleHeaders.nextWork"
            prop="nextWork"
          >
            <Input
              v-model="item.nextWork"
              :readonly="flag == 'preview'"
              type="textarea"
              :rows="4"
              style="width: 400px"
            ></Input>
          </Form-item>
          <Form-item
            v-if="titleData.titleHeaders && titleData.titleHeaders.riskWork"
            :label="titleData.titleHeaders.riskWork"
            prop="riskWork"
          >
            <Input
              v-model="item.riskWork"
              :readonly="flag == 'preview'"
              type="textarea"
              style="width: 400px"
            ></Input>
          </Form-item>
        </Form>
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
      projectList: [],
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
        };
        // 获取项目列表信息
        this.$http
          .get(`/work/project/names`)
          .then(({ data }) => {
            if (data.status) {
              this.projectList = data.data
            }
          });
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
    },
    filterMethod(value, option) {
      return option.indexOf(value) !== -1;
    },
    /**
     * @description 项目下拉框触发的方法
     * @returns {void}
     */
    handlerSearch(projectName) {
      this.$http.get(`/work/project/${projectName}`)
        .then(({ data }) => {
          if (data.status) {
            this.formData.map(value => {
              if (value.workName === projectName) {
                value.workContent = data.data.workContent;
                value.workProgress = data.data.workProgress;
                value.startDate = data.data.startDate;
                value.endDate = data.data.endDate;
              }
              return value;
            });
          }
        });
    },
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
    overflow: auto;
    display: flex;
    margin-top: 10px;
    .box-container {
      max-width: 550px;
      flex: 1;
      margin: 10px 10px 5px 0;
      padding-right: 10px;
      border: 1px solid #dadbdf;
      .delete-project {
        margin-top: -10px;
        margin-right: -20px;
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
