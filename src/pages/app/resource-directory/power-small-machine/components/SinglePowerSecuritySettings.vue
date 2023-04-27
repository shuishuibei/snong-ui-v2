<!--
 * @Description Power虚拟机基本申请安全设置页面
 * @Author ys1983/张睿博
 * @Date 2019-08-27 15:24:49
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-03 16:18:39
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item
      label="密码"
      prop="password">
      <i-input
        placeholder="请输入密码"
        :type="passwordIsShow ? 'text' :'password'"
        style="width: 300px"
        v-model="formValidate.password">
        <i
          slot="suffix"
          :class="eyeClassName"
          @click="passwordIsShow = !passwordIsShow">
        </i>
      </i-input>
      <span class="cds-margin-left-10 cds-color-999">长度8-20位，必须包含数字、字母和特殊字符(!@#$&*_)这三种类型</span>
    </i-form-item>
    <i-form-item
      label="确认密码"
      prop="confirmPassword">
      <i-input
        placeholder="请确认密码"
        :type="confirmPasswordIsShow ? 'text' :'password'"
        style="width: 300px"
        v-model="formValidate.confirmPassword">
        <i
          slot="suffix"
          :class="confirmEyeClassName"
          @click="confirmPasswordIsShow = !confirmPasswordIsShow">
        </i>
      </i-input>
    </i-form-item>
  </i-form>
</template>

<script>
import { required, password, confirmPassword } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'SinglePowerSecuritySettings',
  props: {
    password: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formValidate: {
        password: '',
        confirmPassword: ''
      },
      ruleValidate: {
        password: [required({ message: '密码不能为空' }), password({ message: '密码不符合要求' })],
        confirmPassword: [
          required({ message: '确认密码不能为空' }),
          confirmPassword({ _this: this })
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
    password(newValue) {
      if (newValue) {
        this.formValidate.password = newValue;
        this.formValidate.confirmPassword = newValue;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.iconfont {
  cursor: pointer;
}
.ivu-input-suffix .icon-htmal5icon09 {
  color: #39f;
}
</style>
