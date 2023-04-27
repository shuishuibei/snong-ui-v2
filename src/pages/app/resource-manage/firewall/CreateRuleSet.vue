<template>
  <i-modal
    title="新建规则集"
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
        label="描述"
        prop="description">
        <i-input
          v-model="formValidate.description"
          :rows="5">
        </i-input>
      </i-form-item>
      <div style="width: 100%;height: 300px">
        <p style="text-align: left;height: 30px;">规则列表 (拖动已选择规则中的规则可更改优先级)</p>
        <div style="width: 100%;height: 270px">
          <div class="optional-rules">
            <div style="background-color: #F5F8FD;height:30px;text-align:center;font-size:14px">可选的规则</div>
            <div style="height:240px;overflow: auto;">
              <p style="text-align:center">
                <i-checkbox style="font-size:13px">ruleTest07</i-checkbox>
                <i-checkbox style="font-size:13px">ruleTest08</i-checkbox>
                <i-checkbox style="font-size:13px">ruleTest09</i-checkbox>
              </p>
            </div>
          </div>
          <div class="rules-operation">
            <ul class="angle-button">
              <li>
                <i-button size="small">
                  <i class="iconfont icon-Single-arrow-right"></i>
                </i-button>
              </li>
              <li>
                <i-button size="small">
                  <i class="iconfont icon-double-arrow-right"></i>
                </i-button>
              </li>
              <li>
                <i-button size="small">
                  <i class="iconfont icon-arrow"></i>
                </i-button>
              </li>
              <li>
                <i-button size="small">
                  <i class="iconfont icon-double-arrow-left"></i>
                </i-button>
              </li>
            </ul>
          </div>
          <div class="selected-rules">
            <div style="background-color: #F5F8FD;height:30px;text-align:center;font-size:14px">已选的规则</div>
            <div style="height:240px;overflow: auto;">
              <p style="text-align:center">
                <i-checkbox style="font-size:13px">ruleTest04</i-checkbox>
                <i-checkbox style="font-size:13px">ruleTest05</i-checkbox>
                <i-checkbox style="font-size:13px">ruleTest06</i-checkbox>
              </p>
            </div>
          </div>
        </div>
      </div>
    </i-form>
  </i-modal>
</template>
<script>
  export default {
    name: "CreateRuleSet",
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
          name: "",
          description: "",
        },
        ruleValidate: {
          name: [
            {
              required: true,
              message: "名称不能为空"
            }
          ],
          description: [{}]
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
<style lang="less">
  .CreateRuleSte .ivu-btn-ghost:hover {
    color: #fff;
    background-color: #78ceff;
    border-color: #78ceff;
  }

  .CreateRuleSte .ivu-checkbox-inner {
    width: 20px !important;
    height: 20px !important;
  }

  .CreateRuleSte .ivu-checkbox-checked .ivu-checkbox-inner:after {
    top: 4px;
    left: 7px;
  }
</style>



