<!--
 * @Description: 连接配置编辑
 * @Author: ys2234
 * @Date: 2019-09-09 16:08:11
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-05 11:55:57
 -->
<template>
  <i-modal
    class-name="connection-config-edit"
    v-model="visible"
    :title="title"
    :mask-closable="false"
    @on-cancel="cancel">
    <div class="config-modal-content">
      <i-form
        ref="form"
        :model="formObject"
        :rules="ruleValidate"
        :label-width="100">
        <i-form-item label="平台名称" prop="platformName">
          <i-input
            placeholder="请输入平台名称"
            v-model="formObject.platformName">
          </i-input>
        </i-form-item>
        <i-form-item label="登录名" prop="loginName">
          <i-input
            placeholder="请输入登录名"
            v-model="formObject.loginName">
          </i-input>
        </i-form-item>
        <i-form-item label="登录密码" prop="passWord">
          <i-input
            type="password"
            placeholder="请输入登录密码"
            :readonly="pwdInputReadOnly"
            v-model="formObject.passWord"
            @on-focus="pwdFocus">
          </i-input>
        </i-form-item>
        <i-form-item label="IP地址" prop="ip">
          <i-input
            placeholder="请输入IP地址"
            v-model="formObject.ip">
          </i-input>
        </i-form-item>
        <i-form-item label="端口" prop="port">
          <i-input
            placeholder="请输入端口"
            v-model="formObject.port">
          </i-input>
        </i-form-item>
        <i-form-item label="平台类型" prop="platformType">
          <i-select v-model="formObject.platformType">
            <i-option value="cloudos">cloudos</i-option>
            <i-option value="imc">imc</i-option>
            <i-option value="cas">cas</i-option>
            <i-option value="oneStor">oneStor</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="认证方式" prop="authType">
          <i-select v-model="formObject.authType">
            <i-option value="token">token</i-option>
            <i-option value="basic">basic</i-option>
            <i-option value="degist">degist</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="描述" prop="remark">
          <i-input
            type="textarea"
            v-model="formObject.remark">
          </i-input>
        </i-form-item>
      </i-form>
    </div>
    <div slot="footer">
      <i-button type="primary" @click="ok">保 存</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import { required, ip, port } from '@/assets/js/rule-validate.js';
export default {
  name: 'ConnectionConfigEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    title: {
      type: String,
      default: '新增'
    }
  },
  data() {
    return {
      visible: false, // 控制弹出框是否显示
      pwdInputReadOnly: true, // 密码输入框只读（取消浏览器默认填充）
      /**
       * 表单参数
       * @property {string} platformName  - 平台名称
       * @property {string} loginName     - 登录名
       * @property {string} passWord      - 登录密码
       * @property {string} ip            - IP地址
       * @property {string} port          - 端口
       * @property {string} platformType  - 平台类型
       * @property {string} authType      - 认证方式
       * @property {string} remark        - 备注
       */
      formObject: {
        id: '',
        platformName: '',
        loginName: '',
        passWord: '',
        ip: '',
        port: '',
        platformType: 'cloudos',
        authType: 'token',
        remark: ''
      },
      /**
       * 表单验证规则
       */
      ruleValidate: {
        platformName: [required({ message: '平台名称不能为空' })],
        loginName: [
          required({ message: '登录名不能为空' }),
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value.length > 32) {
                return callback(new Error('登录名长度不能超过32'));
              } else if (value.trim() !== value) {
                return callback(new Error('登录名不能有空格'));
              } else {
                callback();
              }
            }
          }
        ],
        passWord: [
          required({ message: '登录密码不能为空' }),
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value.length > 32) {
                callback(new Error('登录密码长度不能超过32'));
              } else if (value.trim() !== value) {
                callback(new Error('登录密码不能有空格'));
              } else {
                callback();
              }
            }
          }
        ],
        ip: [required({ message: 'IP地址不能为空' }), ip()],
        port: [required({ message: '端口不能为空' }), port()],
        platformType: [required({ message: '平台类型不能为空' })],
        authType: [required({ message: '认证方式不能为空' })],
        remark: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value.length > 50) {
                callback(new Error('描述长度不能超过50'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    pwdFocus() {
      this.pwdInputReadOnly = false;
    },
    cancel() {
      this.visible = false; // 关闭对话框
      this.$refs['form'].resetFields();
    },
    /**
     * @function 表单提交
     */
    ok() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$loading.show();
          let url = '',
            method = '',
            desc = '';
          if (this.data) {
            url = 'sysConfig/update';
            method = 'PUT';
            desc = '修改成功';
          } else {
            url = 'sysConfig/add';
            method = 'POST';
            desc = '新增成功';
          }
          this.$http({
            method,
            url,
            data: this.formObject
          })
            .then(({ data }) => {
              if (data.status) {
                this.$emit('on-refresh');
                this.visible = false;
                this.$Notice.success({
                  desc
                });
                this.$refs['form'].resetFields();
              }
              this.$loading.hide();
            })
            .catch(() => {
              this.$loading.hide();
            });
        }
      });
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        if (this.data) {
          this.formObject.id = this.data.id;
          this.formObject.platformName = this.data.platformName;
          this.formObject.loginName = this.data.loginName;
          this.formObject.passWord = this.data.passWord;
          this.formObject.ip = this.data.ip;
          this.formObject.port = this.data.port;
          this.formObject.platformType = this.data.platformType;
          this.formObject.authType = this.data.authType;
          this.formObject.remark = this.data.remark;
        }
        /*=== 可修改 end ===*/
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