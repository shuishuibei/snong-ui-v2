<!--
 * @Description: 修改用户密码
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:10
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-18 10:07:43
 -->
<template>
  <i-modal
    class="modify-user-password"
    width="550px"
    :title="title"
    :mask-closable="false"
    v-model="visible"
    @on-cancel="cancel">
    <i-form
      ref="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="90">
      <i-form-item label="原密码" prop="originalPassword">
        <i-input clearable type="password" placeholder="请输入原密码" v-model="formObject.originalPassword"></i-input>
      </i-form-item>
      <i-form-item label="新密码" prop="newPassword">
        <i-tooltip placement="right">
          <i-input clearable type="password" placeholder="请输入新密码" v-model="formObject.newPassword"></i-input>
          <same-password-tips></same-password-tips>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="确认密码" prop="rePassword">
        <i-tooltip placement="right">
          <i-input clearable type="password" placeholder="请确认新密码" v-model="formObject.rePassword"></i-input>
          <same-password-tips></same-password-tips>
        </i-tooltip>
      </i-form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click="ok">确 认</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
    <h3c-modal-confirm
      title="修改密码"
      info="密码修改成功，请重新登录！"
      icon="icon-chenggong"
      icon-color="#19be6b"
      :closable="false"
      v-model="flag.success">
      <template #footer>
        <div slot="footer">
          <i-button type="primary" @click="handleRelogin">确 认</i-button>
        </div>
      </template>
    </h3c-modal-confirm>
  </i-modal>
</template>
<script>
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import { required } from '@/assets/js/rule-validate.js';
import { SamePasswordTips } from '@/assets/js/tool-tips.js';
export default {
  name: 'ModifyUserPassword',
  components: {
    'h3c-modal-confirm': H3cModalConfirm,
    'same-password-tips': SamePasswordTips
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      visible: false, // 控制弹出框是否显示
      /**
       * 表单对象
       * @property {string} riginalPassword  - 原始密码
       * @property {string} ewPassword       - 新密码
       * @property {string} ePassword        - 再次键入的新密码
       */
      formObject: {
        originalPassword: '',
        newPassword: '',
        rePassword: ''
      },
      ruleValidate: {
        originalPassword: [required({ message: '原密码不能为空' })],
        newPassword: [
          required({ message: '新密码不能为空', trigger: 'blur change' }),
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![!@#$%^&*?]+$)([a-z]|[A-Z]|[0-9]|[!@#$%^&*?]){8,20}$/;
              let _originalPassword = this.formObject.originalPassword;
              switch (true) {
                case value.trim() !== value:
                  callback(new Error('新密码不能有空格'));
                  break;
                case _originalPassword === value:
                  callback(new Error('原密码不能与新密码一致'));
                  break;
                case !reg.test(value):
                  callback(new Error('新密码格式不合法'));
                  break;
                default:
                  callback();
                  break;
              }
            }
          }
        ],
        rePassword: [
          required({ message: '确认密码不能为空', trigger: 'blur change' }),
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let _newPassword = this.formObject.newPassword;
              switch (true) {
                case _newPassword !== value:
                  callback(new Error('两次输入的密码不一致'));
                  break;
                default:
                  callback();
                  break;
              }
            }
          }
        ]
      },
      flag: {
        success: false
      }
    };
  },
  methods: {
    ok() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$loading.show();
          this.$http({
            method: 'PUT',
            url: 'user/password/update',
            data: {
              originalPassword: this.$base64.encode(
                this.formObject.originalPassword
              ),
              newPassword: this.$base64.encode(this.formObject.newPassword),
              rePassword: this.$base64.encode(this.formObject.rePassword)
            }
          }).then(({data}) => {
            this.$loading.hide();
            if (data.status) {
              this.flag.success = true;
            }
          });
        }
      });
    },
    cancel() {
      this.visible = false;
      this.$refs['form'].resetFields();
    },
    handleRelogin() {
      this.$loading.show();
      this.$http.get('user/logout').then(({data}) => {
        this.$loading.hide();
        if (data.status) {
          localStorage.removeItem('userName');
          localStorage.removeItem('userId');
          /* 跳转到登录页面 */
          this.$router.push({
            name: 'login'
          });
        }
      })
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
