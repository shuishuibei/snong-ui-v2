<!--
 * @Description: 系统参数
 * @Author: ys2234
 * @Date: 2019-10-21 11:22:30
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 15:54:04
 -->
<template>
  <div class="cds-wrapper cds-border system-param">
    <div class="system-param-wrapper cds-padding-14">
      <i-collapse
        class="system-param-collapse"
        simple
        v-model="configName">
        <i-panel name="loginConfig">
          登录页配置
          <template slot="content">
            <login-config ref="login-config"></login-config>
          </template>
        </i-panel>
        <i-panel name="cmdConfig">
          非root用户命令配置
          <template slot="content">
            <cmd-config ref="cmd-config"></cmd-config>
          </template>
        </i-panel>
        <i-panel name="joinConfig">
          用户注册配置
          <template slot="content">
            <join-config ref="join-config"></join-config>
          </template>
        </i-panel>
        <i-panel name="logConfig">
          日志保留时间配置
          <template slot="content">
            <log-config ref="log-config"></log-config>
          </template>
        </i-panel>
      </i-collapse>
    </div>
    <div class="cds-fixed-footer">
      <div class="cds-fixed-footer-right">
        <i-button type="primary" @click="submit">应 用</i-button>
      </div>
    </div>
  </div>
</template>

<script>
import LoginConfig from './components/LoginConfig.vue'; // 登录页配置
import CmdConfig from './components/CmdConfig.vue'; // 用户注册配置
import JoinConfig from './components/JoinConfig.vue'; // 用户注册配置
import LogConfig from './components/LogConfig.vue'; // 日志保留时间配置
export default {
  name: 'SystemParameter',
  components: {
    'login-config': LoginConfig,
    'cmd-config': CmdConfig,
    'join-config': JoinConfig,
    'log-config': LogConfig
  },
  data() {
    return {
      configName: 'loginConfig'
    }
  },
  methods: {
    submit() {
      this.$loading.show();
      let arr = []
      this.$refs['cmd-config'].cmdList.forEach(cmd => {
        if (cmd.value !== '') {
          arr.push(cmd.value)
        }
      })
      let cmdStrings = {
        cmdStrings: arr.toString()
      }
      this.$http({
        method: 'POST',
        url: '/loginparams/saveOrUpdate',
        data: {
          ...this.$refs['login-config'].formObject,
          ...this.$refs['join-config'].formObject,
          ...this.$refs['log-config'].formObject,
          ...cmdStrings
        }
      }).then(({ data }) => {
        this.$loading.hide();
        if(data.status) {
          this.$Notice.success({
            desc: '应用成功！'
          });
          this.$refs['login-config'].commitStore();
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/.system-param-collapse {
  border: none;
  & > .ivu-collapse-item {
    border-top: none;
    & > .ivu-collapse-header {
      background-color: #F2F3F5;
      border-bottom: 1px solid transparent;
      font-weight: 600;
    }
    & > .ivu-collapse-content {
      padding: 14px;
      & > .ivu-collapse-content-box {
        padding: 0;
      }
    }
  }
}
.system-param-wrapper {
  width: 100%;
  height: calc(~"100% - 80px");
  overflow: auto;
}
</style>
