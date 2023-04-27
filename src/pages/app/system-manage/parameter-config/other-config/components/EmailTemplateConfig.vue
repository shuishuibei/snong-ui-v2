<!--
 * @Description: 邮件模板配置
 * @Author: ys2234
 * @Date: 2019-10-24 16:49:16
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:29:56
 -->
<template>
  <i-form
    ref="form"
    :model="formObject"
    :rules="ruleValidate"
    :label-width="150"
    class="email-template-config form">
    <i-form-item label="邮件模板类型" prop="emailType">
      <i-select
        class="common-input"
        v-model="formObject.emailType"
        @on-change="changeEmailType">
        <i-option value="shouldAgree">流程待审批</i-option>
        <i-option value="notAgree">流程审批驳回</i-option>
        <i-option value="yesAgree">流程审批通过</i-option>
      </i-select>
    </i-form-item>
    <i-form-item label="邮件标题" prop="emailTitle">
      <i-input
        type="text"
        class="common-input"
        placeholder="请输入邮件标题"
        v-model="formObject.emailTitle">
      </i-input>
    </i-form-item>
    <i-form-item label="邮件内容" prop="emailContent">
      <i-input
        type="textarea"
        class="common-textarea"
        placeholder="请输入邮件内容"
        :rows="3"
        :maxlength="100"
        v-model="formObject.emailContent">
      </i-input>
    </i-form-item>
    <i-form-item label="系统地址" prop="serverAddress">
      <i-input
        type="text"
        class="common-input"
        placeholder="请输入系统地址"
        v-model="formObject.serverAddress">
      </i-input>
    </i-form-item>
    <i-form-item label="提前天数" prop="tenancyDay" v-if="showTenancyDay">
      <i-input-number
        class="common-input"
        :min="1"
        :max="365"
        v-model="formObject.tenancyDay">
      </i-input-number>
    </i-form-item>
  </i-form>
</template>

<script>
import { required } from '@/assets/js/rule-validate.js';
export default {
  name: 'EmailTemplateConfig',
  data() {
    return {
      showTenancyDay: false,
      /**
       * @property {string}  emailType     - 邮件模板类型
       * @property {string}  emailTitle    - 邮件标题
       * @property {string}  emailContent  - 邮件内容
       * @property {string}  serverAddress - 系统地址
       * @property {string}  tenancyDay    - 提前天数
       */
      formObject: {
        emailType: '',
        emailTitle: '',
        emailContent: '',
        serverAddress: '',
        tenancyDay: 1
      },
      ruleValidate: {
        emailTitle: [
          required({
            message: '邮件标题不能为空'
          })
        ],
        emailContent: [
          required({
            message: '邮件内容不能为空'
          })
        ],
        serverAddress: [
          required({
            message: '系统地址不能为空'
          })
        ],
        tenancyDay: [
          required({
            message: '提前天数不能为空'
          })
        ]
      }
    }
  },
  methods: {
    /**
     * @function 获取默认高级设置
     */
    getDefaultData() {
      this.$loading.show();
      this.$http({
        method: 'GET',
        url: '/sysEmailContent/getEmailContent?emailType=shouldAgree'
      }).then(({ data }) => {
        this.$loading.hide();
        if(data.status) {
          this.formObject = data.data;
        }
      })
    },
    /**
     * @function 改变邮件模板类型
     * @param {string} 模板类型 - shouldAgree/notAgree/yesAgree
     */
    changeEmailType(value) {
      this.showTenancyDay = (value === 'tenancy');
      this.$loading.show();
      this.$http({
        method: 'GET',
        url: `/sysEmailContent/getEmailContent?emailType=${value}`
      }).then(({ data }) => {
        this.$loading.hide();
        if(data.status && data.data !== null) {
          this.formObject = data.data;
        }
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if(valid) {
          this.$loading.show();
          this.$http({
            method: 'POST',
            url: '/sysEmailContent/updateEmailContent',
            data: this.formObject
          }).then(({ data }) => {
            this.$loading.hide();
            if(data.status) {
              this.$Notice.success({
                desc: data.message
              });
            }
          })
        }
      })
    },
    init() {
      this.getDefaultData();
    }
  },
  created() {
    this.getDefaultData();
  }
}
</script>

<style>

</style>