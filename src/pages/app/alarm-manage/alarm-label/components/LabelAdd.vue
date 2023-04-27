<template>
  <Modal
    v-model="visible"
    :title="title"
    :scrollable="true"
    :mask-closable="false"
    class="vertical-center-modal"
    width="650"
    @on-cancel="cancel"
  >
    <!--修改该区域 start -->
    <Form ref="formOrder" :model="formObject" :label-width="120">
      <i-input
        type="text"
        v-model="formObject.id"
        style="display: none"
      ></i-input>
      <i-input
        type="text"
        v-model="formObject.alarmId"
        style="display: none"
      ></i-input>
      <FormItem prop="projectName" label="项目名称">
        <i-input
          style="width: 80% !important"
          type="text"
          v-model="formObject.projectName"
          placeholder="请填写需要屏蔽告警的项目名称"
        ></i-input>
        <div
          style="display: inline-block; width: 17% !important; margin-left: 4px"
        >
          <!--<Checkbox-->
            <!--type="checkbox"-->
            <!--@on-change="setAlarmType('projectName')"-->
            <!--value="正则"-->
            <!--checked="true"-->
            <!--&gt;<span>正则</span></Checkbox-->
          <!--&gt;-->
        </div>
      </FormItem>

      <FormItem label="搜索类别">
        <el-select v-model="formObject.labelType" placeholder="请选择搜索类别">
          <el-option label="普通搜索标签" :value="1"></el-option>
          <el-option label="固定项目查询标签" :value="2"></el-option>
        </el-select>
      </FormItem>

      <FormItem
        prop="keywords"
        label="资源"
        v-if="formObject.labelType === 1"
        :rules="
          formObject.labelType === 1
            ? ruleValidate.keywords
            : [{ required: false }]
        "
      >
        <i-input
          type="text"
          v-model="formObject.keywords"
          placeholder="资源/告警等级/告警类型/告警概要/告警详情"
        ></i-input>
      </FormItem>
    </Form>
    <!-- 修改区域 end -->
    <div slot="footer">
      <Button type="primary" @click.native="ok">确认</Button>
      <Button @click="cancel" style="margin-left: 30px">取消</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "alarm-label-add",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      //标题
      type: String,
      default: "告警屏蔽策略新增",
    },
    dataList: {
      type: Object,
    },
  },
  data() {
    return {
      visible: false,
      foreverTime: true,
      projectNameShow: false,
      alarmObjectShow: false,
      alarmOutlineShow: false,
      alarmMessageShow: false,

      projectNameText: "",

      // 表单绑定的数据对象，FormItem的prop对应该对象的字段
      formObject: {
        alarmId: "",
        projectName: "",
        keywords: "",
        userName: "",
        times: "",
        coverNumber: "",
        labelType: 1,
        collectNumber: 0,
        id: "",
      },
      ruleValidate: {
        keywords: [
          {
            required: true,
            message: "资源/告警等级/告警类型/告警概要/告警详情不能为空",
          },
        ],
      }, // 将表单校验挂载到组件data
      projectTreeData: {},
      indeterminate: true,
      checkAll: false,
      checkId: [], // 选中的项目id
      ids: [], // 所有项目id
      checkAllDisabled: false, // 全选禁止
      getCheckId: [], // 接口获取到的选中项目id
      fileSuccess: false,
      forbidden: false,
      confirmPersonId: "", //获取当前用户id
      confirmPersonName: "",
    };
  },
  methods: {
    opsUserChange(value) {
      if (value) {
        this.formObject.dealPerson = value.label;
      }
    },
    opsUserClear() {
      this.formObject.dealPerson = "";
    },
    ok() {
      if (
        this.formObject.projectName == "" &&
        this.formObject.alarmObject == "" &&
        this.formObject.alarmOutline == "" &&
        this.formObject.alarmMessage == ""
      ) {
        this.$Notice.warning({
          desc: "项目名称/告警对象/告警概要/告警详情模版，不能全部为空！",
        });
        return;
      }

      // 表单验证，当valid为true时关闭对话框
      this.$refs["formOrder"].validate((valid) => {
        // 表单验证通过
        if (valid) {
          this.loading = true;
          if (this.formObject.labelType === 2) {
            this.formObject.keywords = "";
          }
          this.$http
            .post("alarm/label/add", this.formObject)
            .then(({ data }) => {
              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
              if (data.status) {
                // 新增成功后的提示信息
                this.$Notice.success({
                  desc: this.formObject.id ? "新增标签成功" : "新增标签成功",
                });
                this.$parent.getTableData({ loading: true });

                this.visible = false;
              }
              this.loading = false;
            });
        }
      });
    },

    cancel() {
      // 关闭对话框
      this.visible = false;
      //表单清空
      this.$refs["formOrder"].resetFields();
      this.$emit("on-cancel");
    },
    handleCheckAll() {
      if (!this.checkAllDisabled) {
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;
        if (this.checkAll) {
          this.checkId = this.ids;
        } else {
          this.checkId = this.getCheckId;
        }
      }
    },
    getNowFormatDateBefore() {
      let date = new Date(),
        seperator1 = "-", //格式分隔符
        seperator2 = ":",
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate(), // 获取当前日(1-31)
        hours = date.getHours(),
        menutes = date.getMinutes(),
        seconds = date.getSeconds();
      if (month >= 1 && month <= 9) month = "0" + month; // 如果月份是个位数，在前面补0
      if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate; // 如果日是个位数，在前面补0
      let currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hours +
        seperator2 +
        menutes +
        seperator2 +
        seconds;
      return currentdate;
    },
    getNowFormatDate() {
      let date = new Date(),
        seperator1 = "-", //格式分隔符
        seperator2 = ":",
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate() + 1, // 获取当前日(1-31)
        hours = date.getHours(),
        menutes = date.getMinutes(),
        seconds = date.getSeconds();
      if (month >= 1 && month <= 9) month = "0" + month; // 如果月份是个位数，在前面补0
      if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate; // 如果日是个位数，在前面补0
      let currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hours +
        seperator2 +
        menutes +
        seperator2 +
        seconds;
      return currentdate;
    },
    setEndTime() {
      let currentdate;
      if (this.foreverTime) {
        let date = new Date(),
          seperator1 = "-", //格式分隔符
          seperator2 = ":",
          year = 2099, //获取完整的年份(4位)
          month = 12, //获取当前月份(0-11,0代表1月)
          strDate = 31, // 获取当前日(1-31)
          hours = 23,
          menutes = 59,
          seconds = 59;
        currentdate =
          year +
          seperator1 +
          month +
          seperator1 +
          strDate +
          " " +
          hours +
          seperator2 +
          menutes +
          seperator2 +
          seconds;
      } else {
        let date = new Date(),
          seperator1 = "-", //格式分隔符
          seperator2 = ":",
          year = date.getFullYear(), //获取完整的年份(4位)
          month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
          strDate = date.getDate() + 1, // 获取当前日(1-31)
          hours = date.getHours(),
          menutes = date.getMinutes(),
          seconds = date.getSeconds();
        if (month >= 1 && month <= 9) month = "0" + month; // 如果月份是个位数，在前面补0
        if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate; // 如果日是个位数，在前面补0
        currentdate =
          year +
          seperator1 +
          month +
          seperator1 +
          strDate +
          " " +
          hours +
          seperator2 +
          menutes +
          seperator2 +
          seconds;
      }
      this.effectEnddate = currentdate;
      this.foreverTime = !this.foreverTime;
    },
    setAlarmType(type) {
      if (type == "projectName") {
        if (this.formObject.projectNameType == "cover") {
          this.formObject.projectNameType = "regular";
          this.projectNameShow = true;
        } else {
          this.formObject.projectNameType = "cover";
          this.projectNameShow = false;
        }
      } else if (type == "alarmObject") {
        if (this.formObject.alarmObjectType == "cover") {
          this.formObject.alarmObjectType = "regular";
          this.alarmObjectShow = true;
        } else {
          this.formObject.alarmObjectType = "cover";
          this.alarmObjectShow = false;
        }
      } else if (type == "alarmOutline") {
        if (this.formObject.alarmOutlineType == "cover") {
          this.formObject.alarmOutlineType = "regular";
          this.alarmOutlineShow = true;
        } else {
          this.formObject.alarmOutlineType = "cover";
          this.alarmOutlineShow = false;
        }
      } else if (type == "alarmMessage") {
        if (this.formObject.alarmMessageType == "cover") {
          this.formObject.alarmMessageType = "regular";
          this.alarmMessageShow = true;
        } else {
          this.formObject.alarmMessageType = "cover";
          this.alarmMessageShow = false;
        }
      }
    },
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.$refs["formOrder"].resetFields();
        if (!this.dataList.add) {
          if (this.dataList.projectNameType == "regular") {
            this.projectNameShow = true;
          }
          this.formObject = { ...this.dataList };
          // 数字装字符串
        }
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); // 清楚右上角提示信息
        this.visible = newVal; // 显示对话框
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit("input", newVal);
      }
    },
  },
  created() {},
};
</script>

<style scoped lang="less">
.checkBox-project {
  height: 220px;
  overflow-y: auto;
}
</style>
