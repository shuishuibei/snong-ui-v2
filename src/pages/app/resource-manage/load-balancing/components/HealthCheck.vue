<template>
  <div :style="{width:&quot;100%&quot;,height:&quot;100%&quot;,background:&quot;#fff&quot;}">
    <div :style="{background:&quot;#fff&quot;,padding:&quot;0&quot;,height:&quot;45px&quot;,position:&quot;relative&quot;}">
      <div class="all-btn">
        <i-button
          type="button"
          class="virtual-add ivu-btn ivu-btn-primary btn-create btn-common"
          style="float:left"
          @click="newMonitor">
          <span style="fontSize:0">
            <i
              class="iconfont icon-xinjian iconfont-normal"
              style="fontSize:12px;verticalAlign: middle;"></i>
            <span
              class="btn-title"
              style="padding:0;fontSize:12px;verticalAlign: middle;">新建</span>
          </span>
        </i-button>
        <i-button
          type="button"
          class="virtual-add ivu-btn ivu-btn-primary btn-common btn-delete"
          style="float:left;margin-left:10px;">
          <span style="fontSize:0">
            <i
              class="iconfont icon-shanchu iconfont-normal"
              style="fontSize:12px;verticalAlign: middle;"></i>
            <span
              class="btn-title"
              style="padding:0;fontSize:12px;verticalAlign: middle;letterSpacing:0;">批量删除</span>
          </span>
        </i-button>
        <i-button
          type="button"
          class="virtual-add ivu-btn ivu-btn-primary btn-common btn-refresh"
          style="float:right;margin-left:10px;">
          <span style="fontSize:0">
            <i
              class="iconfont icon-shuaxin1 iconfont-normal"
              style="fontSize:12px;verticalAlign: middle;"></i>
          </span>
        </i-button>
      </div>
    </div>
    <div class="details-content">
      <i-table
        :columns="columns7"
        :data="data6"
        size="small"></i-table>
      <i-row class="page-contain">
        <div class="page-left">
          共有{{data6.length}}条记录，当前页1/1页
        </div>
        <div class="page-right">
          <i-page
            show-sizer
            placement="top"
            size="small">
          </i-page>
        </div>
      </i-row>
      <create-health-check
        :modal10="modal10"
        @CreateHealthCheckchangeValue="change"></create-health-check>
    </div>
  </div>
</template>
<script>
import CreateHealthCheck from './CreateHealthCheck.vue'
export default {
  name: "HealthCheck",
  components:{
     'create-health-check': CreateHealthCheck
  },
  data() {
    return {
      modal10: false,
      columns7: [
        {
          type: "selection",
          align: "center",
          width: 55
        },
        {
          title: "名称",
          align: "center",
          key: "name",
          sortable: true,
          width: 50,
        //   render: (h, params) => {
        //     return h(
        //       "span",
        //       {
        //         class: "fontColor",
        //         on: {
        //           click: () => {
        //             //this.datils(params.row);
        //           }
        //         }
        //       },
        //       params.row.name
        //     );
        //   }
        },
        {
          title: "健康检查类型",
          align: "center",
          key: "describe",
          sortable: true
        },
        {
          title: "实服务器组",
          align: "center",
          key: "listening",
        },
        {
          title: "检查间隔",
          align: "center",
          key: "port",
          sortable: true,
        },
        {
          title: "超时时间",
          align: "center",
          key: "linkLimit",
          sortable: true
        },
        {
          title: "最大重复次数",
          align: "center",
          key: "hostGroup",
          sortable: true
        },
        {
          title: "修改",
          key: "action",
          width: 50,
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
          width: 50,
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
      data6: [
        {
          name: "wcsss",
          describe: "",
          listening: "HTTP",
          linkLimit: "-1",
          port: "80",
          hostGroup: "wsdsa",
          IPadaress: "禁用"
        }
      ]
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
    change(e){
      this.modal10=e;
    },
    newMonitor(){
      this.modal10=true;
    }
  }
};
</script>
