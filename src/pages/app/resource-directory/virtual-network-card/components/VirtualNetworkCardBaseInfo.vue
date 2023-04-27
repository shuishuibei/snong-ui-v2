<!--
 * @Description 虚拟网卡基本信息页面
 * @Author ys1983/张睿博
 * @Date 2019-08-01 11:00:21
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:38:56
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item
      label="虚拟网卡名称"
      prop="portName">
      <i-input
        v-model="formValidate.portName"
        placeholder="请输入虚拟网卡名称"
        :maxlength="32"
        style="width:300px">
      </i-input>
      <span class="cds-tip">只能由字母、数字、短横线组成，且只能以字母开头，字数不超过32</span>
    </i-form-item>
  </i-form>
</template>

<script>
import { name, required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'VirtualNetworkCardBaseInfo',
  props: {
    portName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formValidate: {
        portName: ''
      },
      ruleValidate: {
        portName: [
          required({ message: '虚拟网卡名称不能为空' }),
          name({ message: '只能由字母、数字、短横线组成，且只能以字母开头，字数不超过32' })
        ]
      }
    };
  },
  watch: {
    portName(newValue) {
      if (newValue) {
        this.formValidate.portName = newValue;
      }
    }
  }
};
</script>
