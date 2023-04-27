<template>
  <i-modal
    :title="ServerTitle"
    v-model="modal9"
    class-name="vertical-center-modal"
    @on-visible-change="change">
    <div slot="footer"></div>
    <i-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="50">
      <i-form-item label="子网" prop="city">
        <i-select
          v-model="formValidate.city"
          placeholder="Select your city">
          <i-option value="beijing">New York</i-option>
          <i-option value="shanghai">London</i-option>
          <i-option value="shenzhen">Sydney</i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="名称" prop="name">
        <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
      </i-form-item>
      <i-row>
        <i-col span="11">
        <i-form-item label="端口" prop="name">
          <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
        </i-form-item>
        </i-col>
        <i-col span="2">&nbsp;</i-col>
        <i-col span="11">
          <p class="prot-message">请输入1~65535之间的整数</p>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="11">
        <i-form-item label="权重" prop="name">
          <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
        </i-form-item>
        </i-col>
        <i-col span="2">&nbsp;</i-col>
        <i-col span="11">
        <p class="weight-message">请输入1~255之间的整数</p>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="16">
        <i-form-item label="主机" prop="name">
          <i-input v-model="formValidate.name" placeholder="如不填系统会自动分配"></i-input>
        </i-form-item>
        </i-col>
        <i-col span="2">&nbsp;</i-col>
        <i-col span="6">
        <i-button
          type="primary"
          icon="ios-search"
          style="background:#78ceff;border:0;width:100%;margin-left:1.80%">查询</i-button>
        </i-col>
      </i-row>
      <i-form-item label="">
        <i-table
          :columns="columns5"
          :data="data5"
          size="small"
          stripe>
        </i-table>
        <i-row class="page-contain">
          <div class="page-left">
            共有{{data5.length}}条记录，当前页1/1页
          </div>
          <div class="page-right">
            <i-page placement="top" size="small"></i-page>
          </div>
        </i-row>
      </i-form-item>
      <i-form-item :label-width="115">
        <i-button type="primary" @click="handleSubmit('formValidate')">保存</i-button>
        <i-button @click="handleReset('formValidate')" style="margin-left: 8px">取消</i-button>
      </i-form-item>
    </i-form>
  </i-modal>
</template>
<script>
export default {
  name: "CreateServer",
  props: ["modal10","serverTitle"],
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
        changeSwitch: false
      },
      ruleValidate: {
        name: [
          {
            //required: true,
            //message: "The name cannot be empty",
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
      },
      columns5: [
        {
          type: "selection",
          align: "center",
          width: 55
        },
        {
          title: "主机名",
          key: "date",
          sortable: true
        },
        {
          title: "IP",
          key: "name",
          sortable: true
        }
      ],
      data5: [
        {
          name: "John Brown",
          date: "2016-10-03"
        }
      ]
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
      this.$emit("CreateServerchangeValue", a);
    },
  },
  watch: {
    modal10(newValue, oldValue) {
      this.modal9 = this.modal10;
    }
  }
};
</script>
<style lang="less" scoped>
.prot-message,
.weight-message {
  height: 100%;
  margin-bottom: 24px;
  vertical-align: top;
  zoom: 1;
  line-height: 32px;
  font-size: 12px;
  text-align: left;
}
</style>


