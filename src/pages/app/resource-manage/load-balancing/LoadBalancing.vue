<!--
 * @Description: 负载均衡模块，暂时不做该模块功能
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-12 11:25:47
 -->

<template>
  <div class="out-wrap">
    <div class="load-wrap" v-if="onoff">
      <layout :style="{padding:'0 15px',background:'#fff',height:'100%'}">
        <Header :style="{background:'#fff',padding:'0 0 15px 0',height:'64px',position:'relative'}">
          <div class="search">
            <i-input
              clearable
              placeholder="请输入名称进行查询查询"
              class="cds-input-search"
              v-model="search"></i-input>
            <i-button type="primary" class="cds-btn-search" @click="resPage(1)">
              <i class="iconfont icon-iconfontsousuo"></i>
            </i-button>
          </div>
          <div class="all-btn">
            <i-button type="primary" class="virtual-add" @click="newLoadBalancing">
              <i class="iconfont icon-plus">新建</i>
            </i-button>
            <i-button type="primary">
              <i class="iconfont icon-shanchu">批量删除</i>
            </i-button>
            <i-button type="primary" class="cds-btn-refresh">
              <i class="iconfont icon-shuaxin1"></i>
            </i-button>
          </div>
        </Header>
        <Content class="load-wrap-content">
          <i-table
            :columns="columns7"
            :data="data6"
            :loading="loading"
            stripe
            size="small"></i-table>
          <i-row class="page-contain">
            <div class="page-left">
              共有{{xTotalCount}}条记录，当前页{{page}}/{{Math.ceil(xTotalCount/limit)}}页
            </div>
            <div class="page-right">
              <i-page
                show-sizer
                placement="top"
                size="small"
                :total="Number(xTotalCount)"
                @on-change="resPage"
                @on-page-size-change="changePageLimit">
              </i-page>
            </div>
          </i-row>
        </Content>
        <create-load-balancing :modal10="modal10" @changeValue="change"></create-load-balancing>
      </layout>
    </div>
    <load-balancing-defails v-else :details-data="detailsData"></load-balancing-defails>
  </div>
</template>

<script>
import CreateLoadBalancing from "./components/CreateLoadBalancing.vue";
import LoadBalancingDetails from "./components/LoadBalancingDetails.vue";

export default {
  name: 'LoadBalancing',
  components: {
    'create-load-balancing':CreateLoadBalancing,
    'load-balancing-defails': LoadBalancingDetails
  },
  mounted() {
    this.resPage(1);
  },
  data() {
    return {
      detailsData: "",
      xTotalCount:0,//用来存放总记录数
      page:1,//用来存放当前的页码
      limit:10,//用来存放当前页码显示多少条
      onoff: true,
      loading: true,
      modal10: false,
      search:"",//用来存放搜索框的值
      columns7: [
        {
          type: "selection",
          align: "center",
          width: 55
        },
        {
          title: "名称",
          key: "name",
          sortable: true,
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
          title: "描述",
          key: "describe",
          sortable: true
        },
        {
          title: "虚IP",
          key: "virtualIP",
          sortable: true
        },
        {
          title: "所有者",
          key: "possessor",
          sortable: true
        },
        {
          title: "状态",
          key: "state",
          width: 170,
          align: "center",
          filters: true,
          render: (h, params) => {
            return h(
              "span",
              {
                class: params.row.state === "运行" ? "state-run" : "state-stop"
              },
              params.row.state
            );
          }
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
                    this.show(params.index);
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
                class: "iconfont icon-shanchu tableIcon", //添加类名，字体图标删除
                style: {
                  //样式
                  marginRight: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "all 0.3s"
                },
                on: {
                  click: () => {
                    //点击事件
                    this.show(params.index);
                  },
                  mouseover: e => {
                    //鼠标移入改变字体图标大小
                    e.target.style.fontSize = "20px";
                  },
                  mouseout: e => {
                    //鼠标移出恢复原来字体图表大小
                    e.target.style.fontSize = "16px";
                  }
                }
              })
            ]);
          }
        }
      ],
      data6: []
    };
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data6[index].name}<br>Age：${
          this.data6[index].age
        }<br>Address：${this.data6[index].address}`
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    },
    newLoadBalancing() {
      this.modal10 = true;
    },
    change(e) {
      this.modal10 = e;
    },
    datils(data) {
      this.onoff = false;
      this.detailsData = data;
    },
    resPage(page){
      this.page=page;
      this.$http({
      url:'http://localhost:3000/LoadBalancingList?_page='+page+'&_limit='+this.limit+'&name_like='+this.search,
      method:'get'
      }).then((data)=>{
        this.loading=false;
        this.xTotalCount=data.headers["x-total-count"];
        this.data6=data.data;
      })
    },
    changePageLimit(Limit){
      this.limit=Limit;
      this.resPage(this.page);
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>
<style lang="less">
.fontColor {
  color: #67a7f8 !important;
}
.ivu-table-header .fontColor {
  //改变名称区域的颜色
  color: #495060 !important;
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
<style lang="less">
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
</style>



