<template>
  <i-modal
    title="新建规则"
    v-model="modal9"
    class-name="vertical-center-modal CreateRuleSte"
    @on-visible-change="change">
    <div slot="footer">
      <i-button
        type="primary"
        @click="handleSubmit('formValidate')">
        确认
      </i-button>
      <i-button
        @click="handleReset('formValidate')"
        style="margin-left: 8px">
        取消
      </i-button>
    </div>
    <i-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
      style="padding:8px 30px 0 30px">
      <i-form-item
        label="名称"
        prop="name">
        <i-input
          v-model="formValidate.name"
          placeholder="请输入名称"></i-input>
      </i-form-item>
      <i-form-item
        label="协议"
        prop="protocol">
        <i-select v-model="formValidate.protocol">
          <i-option value="TCP">TCP</i-option>
          <i-option value="UDP">UDP</i-option>
          <i-option value="ICMP">ICMP</i-option>
          <i-option value="ANY">ANY</i-option>
        </i-select>
      </i-form-item>
      <i-form-item
        label="行为"
        prop="behavior">
        <i-radio-group
          v-model="formValidate.behavior"
          style="float:left">
          <i-radio label="allow">
            <span>接受</span>
          </i-radio>
          <i-radio label="deny">
            <span>拒绝</span>
          </i-radio>
        </i-radio-group>
      </i-form-item>
      <i-form-item
        label="源IP"
        prop="sourceIpAddress">
        <i-tooltip placement="right">
          <div slot="content">
            <p>支持IP地址或CIDR地址形式,如:</p>
            <p>192.168.1.123或者172.1.0.0/24</p>
          </div>
          <i-input v-model="formValidate.sourceIpAddress"></i-input>
        </i-tooltip>
      </i-form-item>
      <i-form-item
        label="源端口"
        prop="sourcePort">
        <i-input v-model="formValidate.sourcePort">
        </i-input>
      </i-form-item>
      <i-form-item
        label="目的IP"
        prop="destinationIpAddress">
        <i-input v-model="formValidate.destinationIpAddress">
        </i-input>
      </i-form-item>
      <i-form-item
        label="目的端口"
        prop="destinationPort">
        <i-input v-model="formValidate.destinationPort">
        </i-input>
      </i-form-item>
    </i-form>
  </i-modal>
</template>
<script>
  export default {
    name: "CreateRule",
    props: {
      modal10: {
        type: Boolean
      }
    },
    data() {
      return {
        modal9: false,
        visible: false,
        minThroughput: 10,
        ruleSet: [],
        formValidate: {
          name: '',
          protocol: 'TCP',
          sourceIpAddress: '',
          sourcePort: '',
          destinationIpAddress: '',
          destinationPort: '',
          behavior: 'allow'
        },
        ruleValidate: {
          name: [{
            required: true,
            message: '名称不能为空'
          }],
          protocol: [{
            required: true,
            message: '协议不能为空'
          }],
          behavior: [{
            required: true,
            message: '行为不能为空'
          }]
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
        this.$emit("changeValue", a);
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
  .rules-list {
    line-height: 30px;
    position: relative;
    height: 100%;
    width: 40%;
    float: left;
    border: 1px solid #e0e5eb;
  }

  .optional-rules {
    .rules-list;
  }

  .selected-rules {
    .rules-list;
  }

  .rules-operation {
    height: 100%;
    width: 20%;
    float: left;
  }

  .angle-button {
    position: relative;
    top: 20%;
    list-style: none;
    li {
      margin: 10px 20px;
      cursor: pointer;
    }
  }
</style>



