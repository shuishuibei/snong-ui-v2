<template>
  <i-modal
    title="新建负载均衡"
    v-model="modal9"
    class-name="vertical-center-modal"
    @on-visible-change="change">
    <div slot="footer"></div>
    <i-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="90">
      <i-form-item label="选择用户" prop="city">
        <i-select v-model="formValidate.city" placeholder="Select your city">
          <i-option value="beijing">New York</i-option>
          <i-option value="shanghai">London</i-option>
          <i-option value="shenzhen">Sydney</i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="名称" prop="name">
        <i-input v-model="formValidate.name" placeholder="请输入姓名"></i-input>
      </i-form-item>
      <i-form-item label="虚服务网路" prop="city">
        <i-select v-model="formValidate.city" placeholder="Select your city">
          <i-option value="beijing">New York</i-option>
          <i-option value="shanghai">London</i-option>
          <i-option value="shenzhen">Sydney</i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="虚服务IP" prop="name">
        <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
      </i-form-item>
      <i-form-item label="描述" prop="desc">
        <i-input
          v-model="formValidate.desc"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
          placeholder="Enter something..."></i-input>
      </i-form-item>
      <i-form-item :label-width="115">
        <i-button type="primary" @click="handleSubmit('formValidate')">确认</i-button>
        <i-button @click="handleReset('formValidate')" style="margin-left: 8px">取消</i-button>
      </i-form-item>
    </i-form>
  </i-modal>
</template>
<script>
export default {
  name:"CreateLoadBalancing",
  data() {
    return {
      modal9:false,
      formValidate: {
        name: "",
        mail: "",
        city: "",
        gender: "",
        interest: [],
        date: "",
        time: "",
        desc: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        mail: [
          {
            required: true,
            message: "Mailbox cannot be empty",
            trigger: "blur"
          },
          { type: "email", message: "Incorrect email format", trigger: "blur" }
        ],
        city: [
          {
            required: true,
            message: "Please select the city",
            trigger: "change"
          }
        ],
        gender: [
          { required: true, message: "Please select gender", trigger: "change" }
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
    change(a){
        this.$emit('changeValue',a);
    }
  },
  watch:{
     modal10(newValue,oldValue){
         this.modal9=this.modal10;
     }
  }
};
</script>

