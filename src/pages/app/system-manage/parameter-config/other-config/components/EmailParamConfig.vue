<!--
 * @Description: 参数配置
 * @Author: ys2234
 * @Date: 2019-10-24 10:02:22
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:29:37
 -->
<template>
  <i-form
    ref="form"
    class="form email-param-config"
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
        placeholder="请输入端口号"
        v-model="formObject.port">
      </h3c-input-number>
    </i-form-item>
    <i-form-item label="访问uri地址" prop="uri">
      <i-input
        type="text"
        class="common-input"
        placeholder="请输入访问首页uri地址"
        v-model="formObject.uri">
      </i-input>
    </i-form-item>
<!--    <i-form-item label="认证协议" prop="protocol">-->
<!--      <i-select-->
<!--        class="common-input"-->
<!--        v-model="formObject.protocol">-->
<!--        <i-option value="smtp">smtp</i-option>-->
<!--        <i-option value="pop">pop</i-option>-->
<!--      </i-select>-->
<!--    </i-form-item>-->
  </i-form>
</template>

<script>
import {
  required,
  port,
  ip
} from '@/assets/js/rule-validate.js';
import H3cInputNumber from '@/components/h3c-input-number/H3cInputNumber.vue';
export default {
  name: 'EmailParamConfig',
  components: {
    'h3c-input-number': H3cInputNumber
  },
  data() {
    return {
      /**
       * @property {string}  ip - 服务器名称
       * @property {string}  port        - 端口号
       * @property {string}  uri  - 代理服务器名称
       */
      formObject: {
        grafanaIp: '',
        grafanaPort: '',
        uri: ''
      },
      ruleValidate: {
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
        ],
        uri: [
          required({
            message: '访问首页uri不能为空'
          })
        ]
      }
    }
  },
  methods: {
    /**
     * @function 获取默认设置
     */
    getDefaultData() {
      this.$loading.show();
      this.$http({
        method: 'GET',
        url: '/loginparams/ansible/grafanaServer',
      }).then(({ data }) => {
        this.$loading.hide();
        if(data.status) {
          this.formObject = data.data;
          this.formObject.port = String(data.data.port);
          this.formObject.portProxy = String(data.data.portProxy);
        }
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if(valid) {
          this.$loading.show();
          this.$http({
            method: 'POST',
            url: '/loginparams/ansible/grafanaServer',
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
