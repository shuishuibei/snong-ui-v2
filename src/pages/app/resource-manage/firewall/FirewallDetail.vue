<template>
  <div class="load-wrap FirewallDetail" style="background:none">
    <layout :style="{background:'none',height:'100%',width:'100%',position:'relative'}">
      <div class="details-left">
        <h3>基本信息</h3>
        <p class="details-line"></p>
        <ul class="details-list">
          <li>
            <span>UUID<b>:</b></span>
            <p>ff01cb1b-e204-46b7-b184-2355c78d561f</p>
          </li>
          <li>
            <span>名称<b>:</b></span>
            <p>{{detailsData.name}}</p>
          </li>
          <li>
            <span>吞吐量<b>:</b></span>
            <p>{{detailsData.throughput}}</p>
          </li>
          <li>
            <span>规则集<b>:</b></span>
            <p>{{detailsData.ruleset}}</p>
          </li>
          <li>
            <span>路由器<b>:</b></span>
            <p>{{detailsData.route}}</p>
          </li>
          <li>
            <span>状态<b>:</b></span>
            <p :class="detailsData.status === '活跃' ? 'state-run' : 'state-stop'" :style="{textIndent:'28px',color:detailsData.state === '运行' ?'#15da76':'#929394'}">{{detailsData.status}}</p>
          </li>
          <li>
            <span>描述<b>:</b></span>
            <p>{{detailsData.des}}</p>
          </li>
        </ul>
      </div>
      <div class="details-right">
        <div class="details-overflow">
          <i-tabs type="card">
            <i-tab-pane label="规则集" v-if="onoff">
              <div style="padding:20px">
                <i-table :columns="columns7" :data="data6" :loading="loading" stripe size="small"></i-table>
                <i-switch v-model="loading"></i-switch>
                <i-row class="page-contain">
                  <div class="page-left">
                    共有5条记录，当前页1/1页
                  </div>
                  <div class="page-right">
                    <i-page show-sizer
                          size="small"
                          placement="top"
                          :total="50">
                    </i-page>
                  </div>
                </i-row>
              </div>
            </i-tab-pane>
            <i-tab-pane label="规则明细">
              <div style="padding:20px;">
                <i-table :columns="columns8" :data="data8" :loading="loading" stripe size="small"></i-table>
                <i-switch v-model="loading"></i-switch>
                <i-row class="page-contain">
                  <div class="page-left">
                    共有5条记录，当前页1/1页
                  </div>
                  <div class="page-right">
                    <i-page show-sizer
                          placement="top"
                          size="small"
                          :total="50">
                    </i-page>
                  </div>
                </i-row>
              </div>
            </i-tab-pane>
          </i-tabs>
        </div>
      </div>
    </layout>
  </div>
</template>
<script>
  export default {
    name: "FirewallDetail",
    props: {
      detailsData: {
        type: Object
      }
    },
    data() {
      return {
        onoff: this.detailsData.onoff === false ? false : true,
        loading: false,
        data6: [
          {
            name: "firewallTest",
            rulesetID: "policyTest"
          },
          {
            name: "firewallTest",
            rulesetID: "policyTest"
          }
        ],
        columns7: [
          {
            title: "名称",
            key: "name",
            sortable: true,
            align: "left"
          },
          {
            title: "规则集ID",
            sortable: true,
            key: "rulesetID",
            align: "left"
          }
        ],
        columns8: [
          {
            title: "名称",
            key: "name",
            sortable: true,
            align: "left",
          },
          {
            title: "优先级",
            sortable: true,
            key: "priority",
            align: "left",
          },
          {
            title: "协议",
            key: "protocol",
            align: "left",
            sortable: true
          },
          {
            title: "源IP",
            key: "sourceIpAddress",
            align: "left",
            sortable: true
          },
          {
            title: "源端口",
            key: "sourcePort",
            align: "left",
            sortable: true
          },
          {
            title: "目的IP",
            key: "destinationIpAddress",
            align: "left",
            sortable: true
          },
          {
            title: "目的端口",
            key: "destinationPort",
            align: "left",
            sortable: true
          },
          {
            title: "行为",
            key: "behavior",
            align: "left"
          },
        ],
        data8: [
          {
            groupName: "admin",
            name: "firewallTest",
            firewallName: "policyTest",
            protocol: "tcp",
            sourceIpAddress: "Any",
            sourcePort: "Any",
            destinationIpAddress: "Any",
            destinationPort: "Any",
            firewallPolicyName: "Any",
            behavior: "接受",
            priority: 1
          },
          {
            groupName: "admin",
            name: "firewallTest",
            firewallName: "policyTest",
            protocol: "tcp",
            sourceIpAddress: "Any",
            sourcePort: "Any",
            destinationIpAddress: "Any",
            destinationPort: "Any",
            firewallPolicyName: "Any",
            behavior: "接受",
            priority: 1
          }
        ]
      };
    }
  };
</script>
<style scoped lang="less">
  .load-wrap {
    width: 100%;
    height: 100%;
  }

  .details-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 33%;
    height: 100%;
    background: #fff;
    padding: 0 20px;
  }

  .details-left > h3 {
    position: relative;
    font-weight: normal;
    font-size: 16px;
    margin: 10px 0;
    text-indent: 20px;
  }

  .details-left > h3:after {
    position: absolute;
    content: "";
    height: 100%;
    width: 4px;
    top: 0;
    left: 0;
    background: #ff0042;
  }

  .state-run:after,
  .state-stop:after {
    left: 8px !important;
  }

  .details-line {
    width: 100%;
    height: 1px;
    background: #d5d8db;
  }

  .details-list {
    width: 100%;
    padding-top: 20px;
  }

  .details-list li {
    position: relative;
    list-style: none;
    height: 40px;
    width: 100%;
  }

  .details-list li span {
    position: absolute;
    width: 25%;
    height: 100%;
    left: 0;
    top: 0;
    text-align: right;
    line-height: 40px;
  }

  .details-list li span b {
    padding-left: 8px;
  }

  .details-list li p {
    position: absolute;
    width: 75%;
    height: 100%;
    right: 0;
    top: 0;
    text-align: left;
    line-height: 40px;
    text-indent: 8px;
  }

  .details-list li:nth-of-type(2n-1) {
    background: #f5f8fd;
  }

  .details-list li:nth-of-type(2n) {
    background: #fff;
  }

  .details-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 65.88%;
    height: 100%;
    background: #fff;
    font-size: 16px;
    font-weight: normal;
    overflow: hidden;
  }

  .details-overflow {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
<style lang="less" scoped>
  .FirewallDetail .ivu-tabs-bar {
    background: #f8f8f9;
  }

  .FirewallDetail .ivu-tabs-nav-container {
    height: 44px !important;
  }

  .FirewallDetail .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    height: 44px;
    color: #383f51;
    border-radius: 10px 10px 0 0;
    line-height: 43px;
    padding: 0 20px;
  }

  .FirewallDetail .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
    border-color: #dddee1 !important;
    height: 40px;
  }

  .FirewallDetail .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    height: 45px;
  }

  .ivu-page.mini .ivu-page-item {
    font-size: 12px;
  }
</style>


