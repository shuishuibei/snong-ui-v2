<!--
 * @Description: 
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-08-30 16:00:13
 -->
<template>
  <i-modal
    title="连接至路由器"
    v-model="modal10"
    class-name="vertical-center-modal connect-Firewall"
    width="45.31"
    @on-visible-change="change">
    <layout :style="{padding:'5px 0 0 0',background:'#fff',height:'100%'}">
      <div
        :style="{background: '#fff',padding: '0 0 18px 0',height: '72px',position: 'relative'}">
        <div
          class="search"
          style="width:58%">
          <i-input
            placeholder="请输入名称进行查询查询"
            style="width: 70.64%;"
            v-model="search"/>
          <i-button
            type="primary"
            icon="ios-search"
            style="background:#78ceff;border:0;width:26.54%;margin-left:1.80%;height:40px">
            查询
          </i-button>
        </div>
        <div class="all-btn">
        </div>
      </div>
      <div class="load-wrap-content">
        <i-table
          stripe
          :columns="routeItem"
          :data="showData"
          :loading="loading"
          height="200"
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
    </layout>
    <div slot="footer">
      <i-button type="primary">确 认</i-button>
      <i-button style="margin-left: 8px">取 消</i-button>
    </div>
  </i-modal>
</template>
<script>
  export default {
    props: {
      modal10: {
        type: Boolean
      }
    },
    data() {
      return {
        loading: false,
        search: '',
        showData: [
          {
            name: "xuechao",
            uuid: "223a4ec9-5cba-46d4-a3"
          }
        ],
        routeItem: [
          {
            title: "名称",
            sortable: true,
            key: "name"
          },
          {
            title: "UUID",
            sortable: true,
            key: "uuid"
          },
          {
            title: "连接",
            width: 100,
            key: "link",
            render: (h, params) => {
              return h("div", [
                h("i", {
                  class: "iconfont icon-738bianjiqi_chaolianjie tableIcon", // 添加类名，字体图标删除
                  style: {
                    // 样式
                    marginRight: "5px",
                    cursor: "pointer",
                    fontSize: "20px",
                    transition: "all 0.3s",
                    color: "#9aaee1"
                  },
                  on: {
                    click: () => {
                      // 点击事件
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
        ]
      };
    },
    methods: {
      change(a) {
        this.$emit("changeValue", a);
      }
    }
  };
</script>
<style lang="less" scoped>
  .connect-Firewall .ivu-modal-body {
    margin-top: 0;
  }

  .connect-Firewall .ivu-input {
    height: 40px;
  }
</style>
