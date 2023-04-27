<!--
 * @Description: 短信配置
 * @Author: ys2234
 * @Date: 2019-10-24 10:02:09
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:16:46
 -->
<template>
  <div class="sms-config">
    <i-form
      ref="form"
      class="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="150">
      <i-form-item label="IP地址" prop="ip">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入IP地址"
          v-model="formObject.ip">
        </i-input>
      </i-form-item>
      <i-form-item label="端口号" prop="port">
        <h3c-input-number
          type="text"
          class-name="common-input"
          placeholder="请输入端口"
          v-model="formObject.port">
        </h3c-input-number>
      </i-form-item>
      <i-form-item label="登录名" prop="userName">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入登录名"
          v-model="formObject.userName">
        </i-input>
      </i-form-item>
      <i-form-item label="密码" prop="password">
        <i-input
          type="password"
          class="common-input"
          placeholder="请输入密码"
          v-model="formObject.password">
        </i-input>
      </i-form-item>
      <i-form-item label="项目ID" prop="projectId">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入项目ID"
          v-model="formObject.projectId">
        </i-input>
      </i-form-item>
      <i-form-item label="模板ID" prop="templateId">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入任务模板ID"
          v-model="formObject.templateId">
        </i-input>
      </i-form-item>
    </i-form>
  </div>
</template>

<script>
import {
  required,
  ip,
  port
} from '@/assets/js/rule-validate.js';
import H3cInputNumber from '@/components/h3c-input-number/H3cInputNumber.vue';
export default {
  name: 'SmsConfig',
  components: {
    'h3c-input-number': H3cInputNumber
  },
  data() {
    return {
      isSmsTestShow: false,
      /**
       * @property {string} dbName          - 短信数据库名
       * @property {string} dbType          - 短信数据库类型
       * @property {string} dbUserName      - 登录名
       * @property {string} dbUserPassword  - 密码
       * @property {string} dbServerIp      - IP地址
       * @property {string} dbServerPort    - 端口
       * @property {string} sendUser        - 短信发送人
       * @property {string} remark          - 备注
       */
      formObject: {
        ip: '',
        port: '',
        userName: 'admin',
        password: '',
        templateId: '',
        projectId: 1,
      },
      ruleValidate: {
        userName: [
          required({
            message: '登录名不能为空'
          })
        ],
        templateId : [
          required({
            message: '任务模板ID不能为空'
          })
        ],
        projectId : [
          required({
            message: '项目ID不能为空'
          })
        ],
        password: [
          required({
            message: '密码不能为空'
          })
        ],
        ip: [
          required({
            message: 'IP地址不能为空'
          }),
          ip({
            message: 'ip地址格式不正确'
          })
        ],
        port: [
          required({
            message: '端口号不能为空'
          }),
          port({
            message: '端口格式不正确'
          })
        ]
      }
    }
  },
  methods: {
    getDefaultData() {
      this.$loading.show();
      this.$http({
        method: 'GET',
        url: '/loginparams/ansible/ansibleServer'
      }).then(({ data }) => {
        this.$loading.hide();
        if(data.status && data.data !== null) {
          this.formObject = data.data;
          // this.formObject.dbServerPort = Number(data.data.dbServerPort);
        }
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if(valid) {
          this.$loading.show();
          this.$http({
            method: 'POST',
            url: '/loginparams/ansible/ansibleServer',
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
