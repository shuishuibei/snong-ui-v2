<template>
  <i-modal
    title="新建健康检查"
    v-model="modal9"
    class-name="vertical-center-modal"
    @on-visible-change="change">
    <div slot="footer"></div>
    <i-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="95">
      <i-form-item label="名称" prop="name">
        <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
      </i-form-item>
      <i-form-item label="实服务器组" prop="city">
        <i-select v-model="formValidate.city" placeholder="Select your city">
          <i-option value="beijing">New York</i-option>
          <i-option value="shanghai">London</i-option>
          <i-option value="shenzhen">Sydney</i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="类型" prop="city">
        <i-select v-model="formValidate.city" placeholder="Select your city">
          <i-option value="beijing">New York</i-option>
          <i-option value="shanghai">London</i-option>
          <i-option value="shenzhen">Sydney</i-option>
        </i-select>
      </i-form-item>
      <i-row>
        <i-col span="20">
        <i-form-item label="检查间隔" prop="name">
          <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
        </i-form-item>
        </i-col>
        <i-col span="4">
        <p class="HealthCheck-Message">1~600秒</p>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="20">
        <i-form-item label="超时时间" prop="name">
          <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
        </i-form-item>
        </i-col>
        <i-col span="4">
        <p class="HealthCheck-Message">1~600秒</p>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="20">
        <i-form-item label="最大重复次数" prop="name">
          <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
        </i-form-item>
        </i-col>
        <i-col span="4">
        <p class="HealthCheck-Message">1~600秒</p>
        </i-col>
      </i-row>
      <i-form-item :label-width="115">
        <i-button type="primary" @click="handleSubmit('formValidate')">保存</i-button>
        <i-button @click="handleReset('formValidate')" style="margin-left: 8px">取消</i-button>
      </i-form-item>
    </i-form>
  </i-modal>
</template>
<script>
export default {
  name: "CreateHealthCheck",
  props: ["modal10"],
  data() {
    return {
      modal9: false,
      formValidate: {
        name: "",
        city: "",
        interest: [],
        date: "",
        time: "",
        desc: "",
        realSwitch: true,
        changeSwitch:false
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        city: [
          {
            required: true,
            message: "Please select the city",
            trigger: "change"
          }
        ],
        interest: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "Choose at least one hobby",
            trigger: "change"
          },
          {
            type: "array",
            max: 2,
            message: "Choose two hobbies at best",
            trigger: "change"
          }
        ],
        date: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: false,
            message: "Please enter a personal introduction",
            trigger: "blur"
          },
          {
            type: "string",
            min: 20,
            message: "Introduce no less than 20 words",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    change(a) {
      this.$emit("CreateHealthCheckchangeValue", a);
    }
  },
  watch: {
    modal10(newValue, oldValue) {
      this.modal9 = this.modal10;
    }
  }
};
</script>
<style lang="less" scoped>
.HealthCheck-Message {
  text-align: right;
  height: 100%;
  margin-bottom: 24px;
  vertical-align: top;
  zoom: 1;
  line-height: 32px;
  font-size: 12px;
}
</style>




