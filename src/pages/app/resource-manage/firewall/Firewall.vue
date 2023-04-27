<!--
 * @Description: 防火墙模块，暂时不做该模块功能
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-12 11:26:19
 -->

<template>
  <div style="width:100%;height:100%">
    <div id="firewall" v-if="onoff">
      <i-tabs type="card">
        <i-tab-pane label="防火墙">
          <fire-wall-list @detailsData="detailsValue"></fire-wall-list>
        </i-tab-pane>
        <i-tab-pane label="规则集">
          <rule-set-list @detailsData="detailsValue"></rule-set-list>
        </i-tab-pane>
        <i-tab-pane label="规则">
          <rule></rule>
        </i-tab-pane>
      </i-tabs>
    </div>
    <firewall-detail v-else :details-data="detailsData"></firewall-detail>
  </div>
</template>
<script>
  import FirewallList from "./FirewallList.vue"; // 防火墙列表
  import RuleSetList from "./RuleSetList.vue"; // 规则集列表
  import Rule from "./Rule.vue"; // 规则列表
  import FirewallDetail from "./FirewallDetail.vue"; // 防火墙详情页
  export default {
    data() {
      return {
        onoff: true,
        detailsData: ""
      }
    },
    components: {
      "fire-wall-list": FirewallList,
      "rule-set-list": RuleSetList,
      "rule": Rule,
      "firewall-detail": FirewallDetail
    },
    methods: {
      detailsValue(e) {
        this.detailsData = e;
      }
    },
    watch: {
      detailsData(newValue, oldValue) {
        this.onoff = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  #firewall {
    width: 100%;
    height: 100%;
  }

  #firewall .ivu-tabs-tab {
    width: 100%;
    height: 39px;
    line-height: 40px;
    text-align: center;
    padding: 0;
    margin-right: 8px;
    color: #383f51;
    border-radius: 10px 10px 0 0;
  }

  #firewall .ivu-tabs-nav-container, #firewall .ivu-tabs-tab-active {
    height: 40px;
  }

  #firewall .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
    border-color: #dddee1 !important;
    height: 40px;
  }

  #firewall .ivu-tabs-card {
    width: 100%;
    height: 100%;
    background: #fff;
  }

  #firewall .ivu-tabs-bar {
    background: #f8f8f9;
  }
</style>
