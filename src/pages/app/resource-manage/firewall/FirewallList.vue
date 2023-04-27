<template>
  <div class="firewallDetail">
    <div class="out-wrap">
      <div
        class="load-wrap"
        v-if="onoff">
        <layout :style="{padding:&quot;0 15px&quot;,background:&quot;#fff&quot;,height:&quot;100%&quot;}">
          <div
            :style="{background:&quot;#fff&quot;,padding:&quot;0 0 15px 0&quot;,height:&quot;64px&quot;,position:&quot;relative&quot;}">
            <div class="search">
              <i-input
                placeholder="请输入名称进行查询查询"
                style="width: 70.64%"
                v-model="search"/>
              <i-button
                type="primary"
                icon="ios-search"
                style="background:#78ceff;border:0;width:26.54%;margin-left:1.80%"
                @click="resPage(1)">
                查询
              </i-button>
            </div>
            <div class="all-btn">
              <button
                type="button"
                class="virtual-add ivu-btn ivu-btn-primary"
                style=""
                @click="newLoadBalancing">
                <span style="fontSize:0">
                  <i
                    class="iconfont icon-xinjian iconfont-normal"
                    style="fontSize:12px;verticalAlign: middle;"></i>
                  <span
                    class="btn-title"
                    style="padding:0;fontSize:12px;verticalAlign: middle;">新建</span>
                </span>
              </button>
              <button
                type="button"
                class="virtual-add ivu-btn ivu-btn-primary"
                style="margin-left:10px;"
                @click="manyDelete">
                <span style="fontSize:0">
                  <i
                    class="iconfont icon-shanchu iconfont-normal"
                    style="fontSize:12px;verticalAlign: middle;"></i>
                  <span
                    class="btn-title"
                    style="padding:0;fontSize:12px;verticalAlign: middle;letterSpacing:0;">批量删除</span>
                </span>
              </button>
              <button
                type="button"
                class="virtual-add ivu-btn ivu-btn-primary"
                style="margin-left:10px">
                <span style="fontSize:0">
                  <i
                    class="iconfont icon-shuaxin1 iconfont-normal"
                    style="fontSize:12px;verticalAlign: middle;"></i>
                </span>
              </button>
            </div>
          </div>
          <div class="load-wrap-content">
            <i-table
              :columns="columns7"
              :data="data6"
              :loading="loading"
              stripe
              size="small"></i-table>
            <i-switch v-model="loading"></i-switch>
            <i-row class="page-contain">
              <div class="page-left">
                共有5条记录，当前页1/1页
              </div>
              <div class="page-right">
                <i-page
                  show-sizer
                  placement="top"
                  size="small"
                  :total="50">
                </i-page>
              </div>
            </i-row>
          </div>
          <create-fire-wall
            :modal10="modal10"
            @changeValue="change"></create-fire-wall>
          <edit-fire-wall
            :modal10="edit"
            @changeValue="editChange"></edit-fire-wall>
          <connect-fire-wall
            :modal10="connect"
            @changeValue="connectChange"></connect-fire-wall>
          <i-modal
            title="删除防火墙"
            v-model="deleteFirewall"
            class-name="vertical-center-modal"
            width="40">
            <div class="deleteFirewallBody">
              <div class="deleteFirewallBody-wrap">
                <h3 class="pr">
                  <img
                    src="../../../../assets/imgs/firewall/problem-img.png"
                    alt=""
                    class="delete-img pa">
                  <span class="pa">是否确认删除选中的防火墙{{BatchDelete?"(&nbsp;数量&nbsp;:&nbsp;"+56+"&nbsp;个)":""}}</span>
                </h3>
                <p class="deleteFirewallBody-text">
                  注:删除防火墙操作并不会删除该防火墙关联的规则集,若要删除规则集需要规则集列表界面进行删除
                </p>
              </div>
            </div>
            <div slot="footer">
              <i-button
                type="primary"
                @click="handleSubmit('formValidate')">
                确认
              </i-button>
              <i-button
                @click="handleReset('formValidate')"
                style="margin-left: 8px">
                取消
              </i-button>
            </div>
          </i-modal>
          <i-modal
            title="信息确认"
            v-model="offFirewall"
            class-name="vertical-center-modal"
            width="34">
            <div class="deleteFirewallBody">
              <div
                class="deleteFirewallBody-wrap"
                style="padding:25px 60px">
                <h3 class="pr">
                  <img
                    src="../../../../assets/imgs/firewall/problem-img.png"
                    alt=""
                    class="delete-img pa">
                  <span class="pa">是否确认断开选中的路由器</span>
                </h3>
                <p class="deleteFirewallBody-text">
                  注:此操作将可能导致使用此路由器的网络故障
                </p>
              </div>
            </div>
            <div slot="footer">
              <i-button
                type="primary"
                @click="handleSubmit('formValidate')">
                确认
              </i-button>
              <i-button
                @click="handleReset('formValidate')"
                style="margin-left: 8px">
                取消
              </i-button>
            </div>
          </i-modal>
        </layout>
      </div>
    </div>
  </div>
</template>
<script>
  import CreateFirewall from "./CreateFirewall.vue"; //新建防火墙
  import EditFirewall from "./EditFirewall.vue"; //编辑防火墙
  import connectFirewall from './connectFirewall.vue'//连接路由器
  export default {
    mounted() {
      this.resPage(1);
    },
    components: {
      'create-fire-wall': CreateFirewall,
      'edit-fire-wall': EditFirewall,
      'connect-fire-wall': connectFirewall
    },
    data() {
      return {
        detailsData: "",
        xTotalCount: 0, // 用来存放总记录数
        page: 1, // 用来存放当前的页码
        limit: 10, // 用来存放当前页码显示多少条
        onoff: true,
        loading: false,
        modal10: false,
        search: "", // 用来存放搜索框的值
        edit: false,
        deleteFirewall: false,
        offFirewall: false,
        connect: false,
        BatchDelete: false, // 批量删除的开关
        columns7: [
          {
            type: "selection",
            align: "center",
            width: 55
          },
          {
            title: "组织",
            sortable: true,
            key: "organization",
            align: "left",
            render: (h, params) => {
              return h(
                "div",
                {
                  class: {tableInfo: true},
                  attrs: {title: params.row.organization}
                },
                params.row.organization
              );
            }
          },
          {
            title: "名称",
            key: "name",
            sortable: true,
            align: "left",
            render: (h, params) => {
              return h(
                "span",
                {
                  class: "fontColor",
                  style: {
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.datils(params.row);
                    }
                  }
                },
                params.row.name
              );
            }
          },
          {
            title: "规则集",
            sortable: true,
            key: "ruleset",
            align: "left",
            render: (h, params) => {
              return h(
                "div",
                {
                  class: {tableInfo: true},
                  attrs: {title: params.row.ruleset}
                },
                params.row.ruleset
              );
            }
          },
          {
            title: "路由器",
            sortable: true,
            key: "route",
            align: "left",
            render: (h, params) => {
              return h(
                "div",
                {
                  class: {tableInfo: true},
                  attrs: {title: params.row.route}
                },
                params.row.route
              );
            }
          },
          {
            title: "吞吐量(Mbps)",
            sortable: true,
            key: "throughput",
            align: "left",
            render: (h, params) => {
              return h(
                "div",
                {
                  class: {tableInfo: true},
                  attrs: {title: params.row.throughput}
                },
                params.row.throughput
              );
            }
          },
          {
            title: "状态",
            key: "states",
            width: 170,
            align: "left",
            filters: [{label: "活跃", value: 1}, {label: "非活跃", value: 2}],
            filterMultiple: false,
            filterMethod(value, row) {
              if (value === 1) {
                return row.status === "活跃";
              } else if (value === 2) {
                return row.status === "非活跃";
              } else {
                return row.status === '未知状态';
              }
            },
            render: (h, params) => {
              if (params.row.status === "活跃") {
                return h(
                  "span",
                  {
                    class: "state-run"
                  },
                  "活跃"
                );
              } else if (params.row.status === "非活跃") {
                return h(
                  "span",
                  {
                    class: "state-stop"
                  },
                  "非活跃"
                );
              } else {
                return null;
              }
            }
          },
          {
            title: "描述",
            key: "des",
            align: "left",
            sortable: true
          },
          {
            title: "修改",
            key: "action",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h("i", {
                  class: "iconfont icon-weibiaoti2010104 tableIcon",
                  style: {
                    marginRight: "5px",
                    color: "#2abafd",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "all 0.3s"
                  },
                  on: {
                    click: () => {
                      this.edit = true;
                    },
                    mouseover: e => {
                      e.target.style.fontSize = "20px";
                    },
                    mouseout: e => {
                      e.target.style.fontSize = "16px";
                    }
                  }
                })
              ]);
            }
          },
          {
            title: "删除",
            key: "action",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h("i", {
                  class: "iconfont icon-shanchu tableIcon", // 添加类名，字体图标删除
                  style: {
                    marginRight: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "all 0.3s"
                  },
                  on: {
                    click: () => {
                      // 点击事件
                      this.BatchDelete = false;
                      this.deleteFirewall = true;
                    },
                    mouseover: e => {
                      // 鼠标移入改变字体图标大小
                      e.target.style.fontSize = "20px";
                    },
                    mouseout: e => {
                      // 鼠标移出恢复原来字体图表大小
                      e.target.style.fontSize = "16px";
                    }
                  }
                })
              ]);
            }
          },
          {
            title: "连接",
            key: "action",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h("i", {
                  class: "iconfont icon-738bianjiqi_chaolianjie tableIcon", // 添加类名，字体图标删除
                  style: {
                    marginRight: "5px",
                    cursor: "pointer",
                    fontSize: "20px",
                    transition: "all 0.3s",
                    color: "#9AAEE1"
                  },
                  on: {
                    click: () => {
                      // 点击事件
                      this.connect = true;
                    },
                    mouseover: e => {
                      // 鼠标移入改变字体图标大小
                      e.target.style.fontSize = "24px";
                    },
                    mouseout: e => {
                      // 鼠标移出恢复原来字体图表大小
                      e.target.style.fontSize = "20px";
                    }
                  }
                })
              ]);
            }
          },
          {
            title: "断开",
            key: "action",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h("i", {
                  class: "iconfont icon-739bianjiqi_qingchuchaolianjie tableIcon", // 添加类名，字体图标删除
                  style: {
                    marginRight: "5px",
                    cursor: "pointer",
                    fontSize: "20px",
                    transition: "all 0.3s",
                    color: "#5EA4FB"
                  },
                  on: {
                    click: () => {
                      // 点击事件
                      this.offFirewall = true;
                    },
                    mouseover: e => {
                      // 鼠标移入改变字体图标大小
                      e.target.style.fontSize = "24px";
                    },
                    mouseout: e => {
                      // 鼠标移出恢复原来字体图表大小
                      e.target.style.fontSize = "20px";
                    }
                  }
                })
              ]);
            }
          }
        ],
        data6: [
          {
            organization: "admin",
            name: "firewallTest",
            ruleset: "policyTest",
            route: "routerTest",
            throughput: "100",
            status: "活跃",
            des: "防火墙计费"
          },
          {
            organization: "admin",
            name: "firewallTest",
            ruleset: "policyTest",
            route: "routerTest",
            throughput: "100",
            status: "非活跃",
            des: "防火墙计费"
          }
        ]
      };
    },
    methods: {
      show(index) {
      },
      remove(index) {
      },
      newLoadBalancing() {
        this.modal10 = true;
      },
      change(e) {
        this.modal10 = e;
      },
      datils(data) {
        this.$emit('detailsData', data);
      },
      resPage(page) {
      },
      changePageLimit(Limit) {
      },
      editChange(e) {
        this.edit = e;
      },
      connectChange(e) {
        this.connect = e;
      },
      manyDelete() {
        this.deleteFirewall = true;
        this.BatchDelete = true;
      }
    }
  };
</script>
<style scoped lang="less">
  .out-wrap {
    width: 100%;
    height: 100%;
  }

  .load-wrap {
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .search {
    position: absolute;
    width: 28.85%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .all-btn {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
  }

  .deleteFirewallBody {
    width: 100%;
  }

  .deleteFirewallBody-wrap {
    padding: 25px;
    height: 100%;
    background: #feefe6;
  }

  .delete-img {
    width: 39px;
    height: 39px;
    left: 0;
    top: 0;
  }

  .deleteFirewallBody-wrap h3 {
    height: 39px;
  }

  .deleteFirewallBody-wrap h3 span {
    height: 39px;
    line-height: 39px;
    left: 54px;
    top: 0;
    font-size: 24px;
    font-weight: normal;
  }

  .deleteFirewallBody-text {
    padding: 25px 0 0 54px;
    color: #ff5d05;
    font-size: 14px;
    letter-spacing: 1px;
    line-height: 25px;
  }
</style>
<style lang="less" scoped>
  .fontColor {
    color: #67a7f8 !important;
  }

  .ivu-table-header .fontColor {
    //改变名称区域的颜色
    color: #495060 !important;
  }

  .firewallDetail .state-run {
    &:after {
      left: 0 !important;
    }
  }

  .firewallDetail .state-stop {
    &:after {
      left: 0 !important;
    }
  }

  .state-run {
    display: block;
    position: relative;
    text-indent: 20px !important;
    &:after {
      position: absolute;
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #0bd870;
      left: 37%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .state-stop {
    display: block;
    position: relative;
    text-indent: 20px;
    &:after {
      position: absolute;
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #929394;
      left: 37%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .ivu-modal-header-inner {
    font-weight: normal !important;
  }
</style>
<style lang="less" scoped>
  .page-contain {
    padding: 15px;
    line-height: 25px;
    .page-left {
      float: left;
      font-size: 12px;
    }
    .page-right {
      float: right;
      .ivu-page-options-sizer {
        margin-right: 0;
      }
    }
  }

  .pa {
    position: absolute;
  }

  .pr {
    position: relative;
  }
</style>
