<template>
  <div class="firewallDetail">
    <div class="out-wrap">
      <div
        class="load-wrap"
        v-if="onoff">
        <layout :style="{padding:'0 15px',background:'#fff',height:'100%'}">
          <div :style="{background:'#fff',padding:'0 0 15px 0',height:'64px',position:'relative'}">
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
          <create-rule-set
            :modal10="modal10"
            @changeValue="change"></create-rule-set>
          <i-modal
            title="信息确认"
            v-model="offRuleSet"
            class-name="vertical-center-modal"
            :width="BatchRuleSet?42:34">
            <div class="deleteFirewallBody">
              <div
                class="deleteFirewallBody-wrap"
                style="padding:25px 60px;background:#fff">
                <h3 class="pr">
                  <img
                    src="../../../../assets/imgs/firewall/problem-img.png"
                    alt=""
                    class="delete-img pa">
                  <span class="pa">是否确认删除选中的规则集{{BatchRuleSet?"(&nbsp;数量&nbsp;:&nbsp;"+56+"&nbsp;个)":""}}</span>
                </h3>
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
  import CreateRuleSet from "./CreateRuleSet.vue"; //新建规则集
  export default {
    mounted() {
      this.resPage(1);
    },
    components: {
      'create-rule-set': CreateRuleSet,
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
        offRuleSet: false,
        BatchRuleSet: false, // 批量删除的开关
        columns7: [
          {
            type: "selection",
            align: "center",
            width: 55
          },
          {
            title: "组织",
            sortable: true,
            key: "groupName",
            align: "left",
            render: (h, params) => {
              return h(
                "div",
                {
                  class: {tableInfo: true},
                  attrs: {title: params.row.groupName}
                },
                params.row.groupName
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
            title: "下至防火墙",
            sortable: true,
            key: "firewallName",
            align: "left",
            render: (h, params) => {
              return h(
                "div",
                {
                  class: {tableInfo: true},
                  attrs: {title: params.row.firewallName}
                },
                params.row.firewallName
              );
            }
          },
          {
            title: "描述",
            key: "des",
            align: "left",
            sortable: true
          },
          {
            title: "编辑",
            key: "action",
            width: 130,
            align: "left",
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
                      this.modal10 = true;
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
            width: 130,
            align: "left",
            render: (h, params) => {
              return h("div", [
                h("i", {
                  class: "iconfont icon-shanchu tableIcon", // 添加类名，字体图标删除
                  style: {
                    // 样式
                    marginRight: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "all 0.3s"
                  },
                  on: {
                    click: () => {
                      // 点击事件
                      this.BatchRuleSet = false;
                      this.offRuleSet = true;
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
          }
        ],
        data6: [
          {
            groupName: "admin",
            name: "firewallTest",
            firewallName: "policyTest",
            des: "防火墙计费"
          },
          {
            groupName: "admin",
            name: "firewallTest",
            firewallName: "policyTest",
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
        data.onoff = false;
        this.$emit('detailsData', data)
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
        this.BatchRuleSet = true;
        this.offRuleSet = true;
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
