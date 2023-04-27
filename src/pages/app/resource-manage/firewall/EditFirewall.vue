<template>
  <i-modal
    title="修改防火墙"
    v-model="modal9"
    class-name="vertical-center-modal"
    @on-visible-change="change">
    <div slot="footer"></div>
    <i-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="90">
      <i-form-item
        label="名称"
        prop="name">
        <i-input
          v-model="formValidate.name"
          placeholder="请输入名称"></i-input>
      </i-form-item>
      <i-form-item
        label="吞吐量(Mbps)"
        prop="throughput">
        <h3c-step-slider
          v-model="formValidate.throughput"
          :min="minThroughput"
          :max="2000"
          :step="100"
          ref="sizeSlider"></h3c-step-slider>
      </i-form-item>
      <i-form-item
        label="描述"
        prop="description">
        <i-input
          v-model="formValidate.description"
          type="textarea"
          :rows="5">
        </i-input>
      </i-form-item>
      <i-form-item :label-width="115">
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
      </i-form-item>
    </i-form>
  </i-modal>
</template>
<script>
  import H3cStepSlider from "@/components/h3c-slider/H3cStepSlider.vue";

  export default {
    name: "EditFirewall",
    props: {
      modal10: {
        type: Boolean
      }
    },
    components: {
      "h3c-step-slider": H3cStepSlider
    },
    data() {
      return {
        modal9: false,
        visible: false,
        minThroughput: 10,
        ruleSet: [],
        formValidate: {
          name: "",
          throughput: 10,
          description: "",
        },
        ruleValidate: {
          name: [
            {
              required: true,
              message: "名称不能为空"
            }
          ],
          throughput: [
            {
              trigger: "blur",
              validator(rule, value, callback) {
                if (value <= this.minThroughput) {
                  callback(new Error("吞吐量必须大于10Mbs"));
                } else {
                  callback();
                }
              }
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

