<!--
 * @Description: 修改用户信息
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:09
 * @LastEditors: ys2234
 * @LastEditTime: 2019-09-19 15:35:50
 -->
<template>
  <i-modal
    class-name="modify-user-info"
    :title="title"
    :mask-closable="false"
    v-model="visible"
    @on-cancel="cancel">
    <i-form ref="form" :model="formObject" :rules="ruleValidate" :label-width="90">
      <i-form-item label="用户名" prop="userName">
        <i-input v-model="formObject.userName" :maxlength="64"></i-input>
      </i-form-item>
      <i-form-item label="手机号码" prop="telephone">
        <i-tooltip placement="right">
          <i-input v-model="formObject.telephone" placeholder="请输入手机号码" clearable></i-input>
          <div slot="content">
            <p>该值必须是11位手机号</p>
            <p>如：13806504476</p>
          </div>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="证件号码" prop="certification">
        <i-input v-model="formObject.certification" placeholder="请输入证件号码"></i-input>
      </i-form-item>
      <i-form-item label="电子邮箱" prop="email">
        <i-tooltip placement="right">
          <i-input v-model="formObject.email" placeholder="请输入电子邮箱" clearable></i-input>
          <div slot="content">
            <p>该值必须为合法的电子邮箱地址，</p>
            <p>形如：yourname@domain.com</p>
          </div>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="地址" prop="address">
        <i-input v-model="formObject.address" :maxlength="255" placeholder="请输入地址"></i-input>
      </i-form-item>
      <i-form-item label="备注" prop="description">
        <i-input
          clearable
          type="textarea"
          :maxlength="255"
          :autosize="{ minRows: 2, maxRows: 5 }"
          v-model="formObject.description">
        </i-input>
      </i-form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click="ok">确 认</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import { required, mobilePhone, identityCards, email } from '@/assets/js/rule-validate.js'
export default {
  name: 'ModifyUserInfo',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
    }
  },
  data() {
    return {
      visible: false, // 控制弹出框的显示与隐藏
      /**
       * 表单对象
       * @property {string} userName       - 用户名
       * @property {string} telephone      - 电话号码
       * @property {string} certification  - 证件号码
       * @property {string} address        - 地址
       * @property {string} description    - 描述
       */
      formObject: {
        userName: '',
        telephone: '',
        certification: '',
        address: '',
        email: '',
        description: ''
      },
      /**
       * 表单验证规则对象
       */
      ruleValidate: {
        userName: [
          required({ message: '用户名不能为空', trigger: 'blur change'})
        ],
        telephone: [
          mobilePhone()
        ],
        certification: [
          identityCards()
        ],
        email: [
          email()
        ]
      }
    };
  },
  methods: {
    /**
     * @function 获取默认用户信息
     */
    getDefaultInfo() {
      this.$loading.show();
      this.$http({
        method: 'GET',
        url: `user/${this.$store.state.login.userId}`
      }).then(({data}) => {
        this.$loading.hide();
        if(data.status) {
          this.formObject.userName = data.data.userName;
          this.formObject.telephone = data.data.telephone ? data.data.telephone : '';
          this.formObject.certification = data.data.certification ? data.data.certification : '';
          this.formObject.address = data.data.address ? data.data.address : '';
          this.formObject.email = data.data.email ? data.data.email : '';
          this.formObject.description = data.data.description ? data.data.description : '';
        }
      })
    },
    ok() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$loading.show();
          this.$http.put('user/logged/update', this.formObject).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.visible = false;
              this.$refs['form'].resetFields();
              this.$Notice.success({
                desc: data.message && data.message !== '' ? data.message : '修改用户信息成功'
              });
              /* 修改个人信息成功后使用事件总线emit事件update，在用户管理页面监听update刷新用户列表 */
              this.$eventHub.$emit('update');
            } else {
              this.$Notice.error({
                desc:
                  data.message && data.message !== '' ? data.message : '修改用户信息失败'
              });
            }
          });
        }
      });
    },
    cancel() {
      this.visible = false;
      this.$refs['form'].resetFields();
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.getDefaultInfo();
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
