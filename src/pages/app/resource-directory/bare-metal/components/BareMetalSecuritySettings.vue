<!--
 * @Description 裸金属安全设置页面
 * @Author ys1983/张睿博
 * @Date 2019-08-20 09:24:12
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-03 16:18:27
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item
      label="认证策略"
      prop="passwordType"
      required>
      <i-radio-group
        type="button"
        v-model="formValidate.passwordType">
        <i-radio :label="0">自定义密码</i-radio>
        <i-radio :label="1">镜像默认密码</i-radio>
      </i-radio-group>
    </i-form-item>
    <template v-if="formValidate.passwordType === 0">
      <i-form-item
        label="密码"
        prop="password">
        <i-input
          placeholder="请输入密码"
          :type="passwordIsShow ? 'text' :'password'"
          style="width:300px;"
          v-model="formValidate.password">
          <i
            slot="suffix"
            :class="eyeClassName"
            @click="passwordIsShow = !passwordIsShow">
          </i>
        </i-input>
        <span class="cds-margin-left-10 cds-color-999">长度8-20位，必須包含数字、字母和特殊字符(!@#$&*_)这三种类型</span>
      </i-form-item>
      <i-form-item
        label="确认密码"
        prop="confirmPassword">
        <i-input
          :type="confirmPasswordIsShow ? 'text' :'password'"
          placeholder="请确认密码"
          style="width:300px"
          v-model="formValidate.confirmPassword">
          <i
            slot="suffix"
            :class="confirmEyeClassName"
            @click="confirmPasswordIsShow = !confirmPasswordIsShow">
          </i>
        </i-input>
      </i-form-item>
    </template>
  </i-form>
</template>

<script>
import { required, password, confirmPassword } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'BareMetalBaseInfo',
  props: {
    passwordInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formValidate: {
        passwordType: 0,
        password: '',
        confirmPassword: ''
      },
      ruleValidate: {
        password: [
          required({ message: '密码不能为空' }),
          password({ message: '长度8-20位，必須包含数字、字母和特殊字符(!@#$&*_)这三种类型' })
        ],
        confirmPassword: [
          required({ message: '确认密码不能为空' }),
          confirmPassword({ _this: this, message: '两次输入的密码不一致' })
        ]
      },
      passwordIsShow: false,
      confirmPasswordIsShow: false
    };
  },
  computed: {
    eyeClassName() {
      if (this.passwordIsShow) {
        return { iconfont: true, 'icon-htmal5icon09': true };
      } else {
        return { iconfont: true, 'icon-yincangbukejian': true };
      }
    },
    confirmEyeClassName() {
      if (this.confirmPasswordIsShow) {
        return { iconfont: true, 'icon-htmal5icon09': true };
      } else {
        return { iconfont: true, 'icon-yincangbukejian': true };
      }
    }
  },
  watch: {
    'formValidate.passwordType'(newValue, oldValue) {
      this.$emit('e-passwordType', newValue ? '镜像默认密码' : '自定义密码');
      if (newValue) {
        this.formValidate.password = '';
        this.formValidate.confirmPassword = '';
      }
    },
    passwordInfo(newValue) {
      if (newValue.hasOwnProperty('password')) {
        this.formValidate = {
          ...this.formValidate,
          ...newValue,
          ...{ confirmPassword: newValue.password }
        };
      }
    }
  }
};
</script>

<style lang="css" scoped>
.bare-metal >>> .ivu-radio-group-button .ivu-radio-wrapper-checked {
  color: #fff;
  background: #3399ff;
}
.iconfont {
  cursor: pointer;
}
.ivu-input-suffix .icon-htmal5icon09 {
  color: #39f;
}
</style>
