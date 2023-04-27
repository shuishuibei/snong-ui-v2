<!--
 * @Description 云主机安全设置页面
 * @Author ys1983/张睿博
 * @Date 2019-08-13 14:13:49
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-26 14:17:34
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item
      v-if="this.virtType==='VMware'"
      label="指定虚拟机版本"
      prop="vmxVersion">
      <i-select
        style="width:300px"
        v-model="formValidate.vmxVersion">
        <i-option value="version-8">version-8</i-option>
        <i-option value="version-10">version-10</i-option>
        <i-option value="version-13">version-13</i-option>
      </i-select>
    </i-form-item>
    <i-form-item label="用户名">
      <span>{{userName}}</span>
    </i-form-item>
    <i-form-item
      label="密码"
      prop="password">
      <i-input
        placeholder="请输入密码"
        :type="passwordIsShow ? 'text' : 'password'"
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
        placeholder="请确认密码"
        :type="confirmPasswordIsShow ? 'text' : 'password'"
        style="width:300px;"
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
  name: 'CloudHostSecuritySettings',
  props: {
    userName: {
      type: String,
      required: true
    },
    virtType: {
      type: String,
      required: true
    },
    passwordInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formValidate: {
        vmxVersion: 'version-13', // 指定虚拟机版本，默认值version-13
        password: '', // 密码
        confirmPassword: '', // 确认密码
        passwordType: 1
      },
      ruleValidate: {
        vmxVersion: required({ message: '指定虚拟机版本不能为空' }),
        password: [
          required({ message: '密码不能为空' }),
          { max: 20, message: '密码长度不能超过20位', trigger: 'change' },
          password({ message: '密码不符合要求' })
        ],
        confirmPassword: [
          required({ message: '确认密码不能为空' }),
          { max: 20, message: '密码长度不能超过20位', trigger: 'change' },
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
    virtType(newValue) {
      this.formValidate.vmxVersion = newValue === 'VMware' ? 'version-13' : '';
    },
    passwordInfo(newValue) {
      if (newValue.password) {
        this.formValidate = Object.assign(this.formValidate, newValue);
      }
    }
  }
};
</script>

<style lang="less" scope>
.iconfont {
  cursor: pointer;
}
.ivu-input-suffix .icon-htmal5icon09 {
  color: #39f;
}
</style>
