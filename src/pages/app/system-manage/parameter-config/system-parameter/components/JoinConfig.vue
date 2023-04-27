<!--
 * @Description: 用户注册配置
 * @Author: ys2234
 * @Date: 2019-09-26 13:56:10
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:31:57
 -->
<template>
  <div class="join-config">
    <i-form
      ref="form"
      class="log-config"
      :model="formObject"
      :label-width="80">
      <i-form-item label="注册开关">
        <i-switch
          true-value="open"
          false-value="close"
          v-model="formObject.registerUser">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </i-switch>
      </i-form-item>
    </i-form>
  </div>
</template>

<script>
export default {
  name: 'JoinConfig',
  props: {
    data: {
      type: String,
      default: 'close'
    }
  },
  data() {
    return {
      formObject: {
        registerUser: ''
      }
    };
  },
  methods: {
    getDefaultValue() {
      this.$http({
        method: 'GET',
        url: '/loginparams/getSysParam/registerUser'
      }).then(({ data }) => {
        if (data.status) {
          this.formObject.registerUser = data.data.registerUser;
        }
      });
    }
  },
  created() {
    this.getDefaultValue();
  }
};
</script>
