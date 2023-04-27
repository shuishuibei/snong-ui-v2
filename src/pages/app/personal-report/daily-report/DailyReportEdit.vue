<template>
  <Modal
    v-model="visible"
    :scrollable="true"
    class-name="vertical-center-modal"
    width="550px"
    :title="title"
    class="daily-report-edit"
    :class="{'hiddenSelectClose':data.submit == 'forbidden'}"
  >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem prop="reportDate" label="日报日期">
        <DatePicker type="date" placeholder="选择日期" v-model="formValidate.reportDate" format="yyyy-MM-dd" @on-change="reportDateChange" style="width:290px;" :disabled="forbidden" :readonly="forbidden"></DatePicker>
      </FormItem>
      <FormItem label="项目名称" prop="projectId">
        <Select v-model="formValidate.projectId" @on-change="projectChange" :disabled="forbidden" filterable clearable @on-clear="projectClear" ref="selectProject">
          <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="yesterdayWork" label="昨日工作内容">
        <i-input type="textarea" :rows="5" v-model="formValidate.yesterdayWork" :disabled="forbidden"></i-input>
      </FormItem>
      <FormItem prop="todayWorkPlan" label="今天工作计划">
        <i-input type="textarea" :rows="5" v-model="formValidate.todayWorkPlan" :disabled="forbidden"></i-input>
      </FormItem>
      <FormItem prop="problem" label="问题及困难">
        <i-input type="textarea" :rows="5" v-model="formValidate.problem" :disabled="forbidden"></i-input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click.native="ok('formValidate')" v-if="!forbidden">确认</Button>
      <Button @click="cancel" style="margin-left: 30px" v-if="!forbidden">取消</Button>
      <Button type="primary" class="save" @click="close" v-if="forbidden">关闭</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: "daily-report-edit",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    title: {
      type: String,
      default: "新增日报"
    }
  },
  data() {
    return {
      visible: false, // 控制弹出框是否显示
      projectList: [], // 项目列表
      formValidate: {
        reportDate: "", // 日报日期
        projectId: "", // 项目ID
        projectName: "", // 项目名称
        yesterdayWork: "",
        todayWorkPlan: "",
        problem: "",

      }, // 表单参数
      ruleValidate: {
          reportDate:[
              {
                  required: true,
                  message: "请选择日报日期"
              }
          ],
          projectId:[
              {
                  required: true,
                  message: "请选择项目"
              }
          ],
          yesterdayWork:[
              {
                  required: true,
                  message: "昨日工作内容不能为空"
              }
          ],
          todayWorkPlan:[
              {
                  required: true,
                  message: "今日工作计划不能为空"
              }
          ]
      }, // 表单验证规则
      forbidden: false
    };
  },
  methods: {
    reportDateChange(reportDate){
      this.formValidate.reportDate = reportDate;
    },
    getProjectList(){
      this.$http({
        method:'GET',
        url:'/project-management/listAll'
      }).then(({data})=>{
        if(data.status){
          this.projectList = data.data;
          if(this.data.submit !== 'addReport'){
            // 修改或复制新增下或预览模式下
            this.formValidate.projectId = this.data.projectId;
            this.formValidate.projectName = this.data.projectName;
          } else {
            // 新增模式下
            this.formValidate.projectId = this.projectList[0].id;
            this.formValidate.projectName = this.projectList[0].projectName;
          }
        }
      })
    },
    projectChange(label){
      if(label){
        this.formValidate.projectName = label
      }
    },
    projectClear(){
      this.formValidate.projectName = '';
    },
    ok(name) {
      if(typeof this.formValidate.reportDate == 'object'){
        this.formValidate.reportDate = this.formValidate.reportDate.toLocaleDateString().replace(/\//g,'-')
      }
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.$loading.show();
            // 如果是修改
            if(this.data.submit == 'modifyData'){
              // 日报ID
              this.formValidate.id = this.data.id;
              this.$http.put('/daily-report/update',this.formValidate)
              .then(({data}) => {
                this.$loading.hide();
                if (data.status) {
                  //新增成功后的提示信息
                  this.$Notice.success({
                      desc: '修改成功'
                  });
                  this.$parent.getTableData({loading:true});
                  this.visible = false;
                }
              })
            } else {
              // 如果是新增
              this.$http({
                method: 'POST',
                url: 'daily-report/add',
                data:this.formValidate
              })
              .then(({data}) => {
                this.$loading.hide();
                if (data.status) {
                  //新增成功后的提示信息
                  this.$Notice.success({
                      desc: '新增成功'
                  });
                  this.$parent.getTableData({loading:true});
                  this.visible = false;
                }
              })
            }
          }
      })
    },
    cancel() {
      //关闭对话框
      this.visible = false;
      //表单清空
      this.$emit("on-cancel");
    },
    // 关闭该弹出框
    close() {
      this.visible = false;
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        // 重置表单
        this.$refs['formValidate'].resetFields();
        // 手动重置select的清除及输入
        this.$refs.selectProject.clearSingleSelect();
        // 获取项目列表
        this.getProjectList();
        // 修改或复制新增下或预览模式下
        if(this.data.submit !== 'addReport'){
          // 日报日期
          this.formValidate.reportDate = this.data.reportDate;
          // 昨日工作内容
          this.formValidate.yesterdayWork = this.data.yesterdayWork;
          // 今天工作计划
          this.formValidate.todayWorkPlan = this.data.todayWorkPlan;
        } else {
          // 新增模式下
          this.reportDateChange(new Date().toLocaleDateString().replace(/\//g,'-'));
        }
        this.data.submit == 'forbidden' ? this.forbidden = true : this.forbidden = false;
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); //清楚右上角提示信息
        this.visible = newVal; //显示对话框
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>
<style lang="less">
.daily-report-edit {
  .ivu-input[disabled] {
    color: #4a4848;
  }
  .ivu-select-disabled .ivu-select-selection {
    color: #4a4848;
  }
  .ivu-select-input[disabled]{
    color: #4a4848;
  }
}
.hiddenSelectClose {
  .ivu-select-disabled .ivu-select-selection .ivu-select-arrow {
    display: none;
  }
}
</style>
