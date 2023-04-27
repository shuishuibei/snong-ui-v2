<!--
 * @Description: 其他配置
 * @Author: ys2234
 * @Date: 2019-10-21 11:22:23
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:17:56
 -->
<template>
  <div class="cds-wrapper cds-border other-config">
    <div class="cds-padding-14 other-config-wrapper">
      <i-tabs @on-click="changeTabs">
        <i-tab-pane name="sms-config" label="Ansible服务配置">
          <sms-config ref="sms-config"></sms-config>
        </i-tab-pane>
        <i-tab-pane name="email-param-config" label="Grafana服务配置">
          <email-param-config ref="email-param-config"></email-param-config>
        </i-tab-pane>
   <!--     <i-tab-pane name="email-template-config" label="邮件模板配置">
          <email-template-config ref="email-template-config"></email-template-config>
        </i-tab-pane>
        <i-tab-pane name="ldap-config" label="LDAP配置">
          <ldap-config ref="ldap-config"></ldap-config>
        </i-tab-pane>-->
      </i-tabs>
    </div>
    <div class="cds-fixed-footer">
      <div class="cds-fixed-footer-right">
<!--        <i-button-->
<!--          type="primary"-->
<!--          v-if="testShow"-->
<!--          @click="test">-->
<!--          {{ testName }}-->
<!--        </i-button>-->
        <i-button  type="primary" @click="save">保 存</i-button>
      </div>
    </div>
  </div>
</template>

<script>
import SmsConfig from './components/SmsConfig.vue';
import EmailParamConfig from './components/EmailParamConfig.vue';
// import EmailTemplateConfig from './components/EmailTemplateConfig.vue';
// import LdapConfig from './components/LdapConfig.vue';
export default {
  name: 'OtherConfig',
  components: {
    'sms-config': SmsConfig,
    'email-param-config': EmailParamConfig,
    // 'email-template-config': EmailTemplateConfig,
    // 'ldap-config': LdapConfig
  },
  data() {
    return {
      // testName: '短信测试',
      // testShow: true,
      currentTabPane: 'sms-config'
    }
  },
  methods: {
    /**
     * @function 切换footer功能
     * @description: tab 被点击时触发
     * @param {string} name - 当前点击的标签窗口名称
     */
    changeTabs(name) {
      this.currentTabPane = name;
      this.$refs[name].init();
    //   switch (name) {
    //     case 'sms-config':
    //       this.testName = '短信测试';
    //       this.testShow = true;
    //       break;
    //     case 'email-param-config':
    //       this.testName = '邮件测试';
    //       this.testShow = true;
    //       break;
    //     case 'email-template-config':
    //       this.testName = '邮件测试';
    //       this.testShow = false;
    //       break;
    //     case 'ldap-config':
    //       this.testName = 'LDAP测试';
    //       this.testShow = true;
    //       break;
    //     default:
    //       this.testName = '暂无测试';
    //       this.testShow = true;
    //       break;
    //   }
    },
    // test() {
    //   this.$refs[this.currentTabPane].test();
    // },
    save() {
      this.$refs[this.currentTabPane].save();
    }
  }
}
</script>

<style lang="less" scoped>
.other-config {
  .other-config-wrapper {
    height: calc(~"100% - 80px");
    overflow: auto;
  }
  /deep/.ivu-tabs-bar {
    margin-bottom: 18px;
    .ivu-tabs-tab {
      padding-top: 0;
    }
  }
  /deep/.form {
    .common-input {
      width: 300px;
    }
    .common-textarea {
      width: 300px;
    }
  }
}
</style>
