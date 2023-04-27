<!--
 * @Description: 短信测试弹出框
 * @Author: ys2234
 * @Date: 2019-10-24 17:04:13
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:31:13
 -->
<template>
  <i-modal
    :title="title"
    :mask-closable="false"
    v-model="visible"
    @on-cancel="cancel">
    <i-form
      ref="form"
      class="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="110">
      <i-form-item label="手机号" prop="phoneNumber">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入手机号"
          v-model="formObject.phoneNumber">
        </i-input>
      </i-form-item>
      <i-form-item label="短信内容" prop="message">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入短信内容"
          v-model="formObject.message">
        </i-input>
      </i-form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click="submit">发 送</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import {
  required,
  mobilePhone
} from '@/assets/js/rule-validate.js';
export default {
  name: 'SmsTest',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      /**
       * @property {string} phoneNumber - 手机号
       * @property {string} message     - 短信内容
       */
      formObject: {
        phoneNumber: '',
        message: ''
      },
      ruleValidate: {
        phoneNumber: [
          required({
            message: '手机号码不能为空'
          }),
          mobilePhone({
            message: '手机号码格式不正确'
          })
        ],
        message: [
          required({
            message: '短信内容不能为空'
          })
        ],
      }
    };
  },
  methods: {
    /**
     * @function 提交测试表单
     * @description: 此处会出现问题：并未将修改后的短信配置随测试内容一起发送。因此此测试针对的是修改前的配置。
     */
    submit() {
      this.$refs['form'].validate((valid) => {
        if(valid) {
          this.$loading.show();
          this.$http({
            method: 'POST',
            url: '/loginparams/sendMessage',
            data: this.formObject
          }).then(({ data }) => {
            this.$loading.hide();
            if(data.status) {
              this.$emit('on-ok', true);
              this.visible = false;
              this.$refs['form'].resetFields();
              this.$Notice.success({
                desc: '短信测试成功！'
              })
            }
          })
        }
      })
    },
    cancel() {
      this.visible = false;
      this.$refs['form'].resetFields();
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.$Notice.destroy(); // 清楚右上角提示信息
        this.visible = newVal; // 显示对话框
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('input', newVal);
      }
    }
  }
};
</script>
