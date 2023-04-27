<template>
  <Layout :style="{width:&quot;100%&quot;,height:&quot;100%&quot;,background:&quot;#fff&quot;}">
    <Header :style="{background:&quot;#fff&quot;,padding:&quot;0&quot;,height:&quot;45px&quot;,position:&quot;relative&quot;}">
      <div class="all-btn">
        <button
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
        </button>
        <button
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
        </button>
        <button
          type="button"
          class="virtual-add ivu-btn ivu-btn-primary btn-common btn-refresh"
          style="float:right;margin-left:10px;">
          <span style="fontSize:0">
            <i
              class="iconfont icon-shuaxin1 iconfont-normal"
              style="fontSize:12px;verticalAlign: middle;"></i>
          </span>
        </button>
      </div>
    </Header>
    <Content class="details-content">
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
    </Content>
    <create-server
      :modal10="CreateServeOnOff"
      @CreateServerchangeValue="Createchange"
      :server-title="ServerTitle"></create-server>
    <delete-server
      :modal10="DeleteServerOnOff"
      @DeleteServerchangeValue="Deletechange"></delete-server>
    <create-all-server
      :modal10="modal10"
      @CreateAllServerchangeValue="change"></create-all-server>
  </Layout>
</template>
<script>
import CreateServer from './CreateServer.vue'
import DeleteServer from './DeleteServer.vue'
import CreateAllServer from './CreateAllServer.vue'
export default {
  name: "ServerGroup",
  components:{
     'create-server': CreateServer,
     'delete-server': DeleteServer,
     'create-all-server': CreateAllServer
  },
  data() {
    return {
      ServerTitle:"添加实服务",//添加和编辑实服务复用一个组件,初始的时候我们定义默认为添加实服务
      CreateServeOnOff:false,//添加实服务的开关
      DeleteServerOnOff:false,//删除实服务的开关
      onoff:true,//控制操作点击展开和收回的开关
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
          render: (h, params) => {
            return h(
              "span",
              {
                class: "fontColor",
                on: {
                  click: () => {
                    //this.datils(params.row);
                  }
                }
              },
              params.row.name
            );
          }
        },
        {
          title: "描述",
          align: "center",
          key: "describe",
          sortable: true
        },
        {
          title: "协议",
          align: "center",
          key: "listening",
          sortable: true
        },
        {
          title: "监听器",
          align: "center",
          key: "port",
          filters: true,
        },
        {
          title: "健康检查",
          align: "center",
          key: "linkLimit",
          sortable: true
        },
        {
          title: "实服务",
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
                'class': "iconfont icon-weibiaoti2010104 tableIcon",
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
        },
        {
          title: "操作",
          key: "action",
          width: 50,
          align: "center",
          render: (h, params) => {
            return h("div",{
              'class':"action-list-wrap",
              style:{
                position:'relative',
                width:'100%',
                height:'100%'
              }
            }, [
              h("i", {
                class: "iconfont icon-gengduo", //添加类名，字体图标删除
                style: {
                  //样式
                  marginRight: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "all 0.3s"
                },
                on: {
                  click: () => {
                     var actionList=document.getElementsByClassName('action-list')[params.index];
                     if(this.onoff){
                       actionList.style.height="85px";
                       actionList.style.padding="13px 0";
                       this.onoff=false;
                     }else{
                       actionList.style.height="0";
                       actionList.style.padding="0";
                       this.onoff=true;
                     }
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
              }),
              h("ul",{
                'class':"action-list",
                style:{
                  width:"145px",
                  height:"0",
                  position:"absolute",
                  right:"2px",
                  top:"100%",
                  zIndex:"999",
                  background:"#fff",
                  boxShadow:"0 0 13px -4px #000",
                  borderRadius:"5px",
                  overflow:"hidden",
                  transition:"all 0.5s",
                  boxSizing: "content-box"
                }
              },[
                h("li",{
                  style:{
                    width:"100%",
                    fontSize:"12px",
                    color:"#495060",
                    cursor:"pointer",
                    listStyle:"none",
                    padding:"5px 13px"
                  },
                  on:{
                    click:(e)=>{
                       this.ServerTitle='添加实服务'
                       this.CreateServeOnOff=true;
                       this.actionListOff(params.index);
                    },
                  }
                },[
                  h("i",{
                    'class':"iconfont icon-xinjian virtual-op-iconfont-normal",
                    style:{
                      fontWeight:"bold"
                    }
                  }),
                  h("span",{
                    'class':"virtual-op-title",
                    style:{
                      marginLeft:"15px"
                    }
                  },"添加实服务")
                ]),
                 h("li",{
                  style:{
                    width:"100%",
                    fontSize:"12px",
                    color:"#495060",
                    cursor:"pointer",
                    listStyle:"none",
                    padding:"5px 13px"
                  },
                  on:{
                    click:e=>{
                      this.CreateServeOnOff=true;
                      this.ServerTitle='编辑实服务'
                      this.actionListOff(params.index);
                    }
                  }
                },[
                  h("i",{
                    'class':"iconfont icon-weibiaoti2010104 virtual-op-iconfont-normal",
                    style:{
                      fontWeight:"bold"
                    }
                  }),
                  h("span",{
                    'class':"virtual-op-title",
                    style:{
                      marginLeft:"15px"
                    }
                  },"编辑实服务")
                ]), h("li",{
                  style:{
                    width:"100%",
                    fontSize:"12px",
                    color:"#495060",
                    cursor:"pointer",
                    listStyle:"none",
                    padding:"5px 13px"
                  },
                  on:{
                    click:e=>{
                      this.DeleteServerOnOff=true;
                      this.actionListOff(params.index);
                    }
                  }
                },[
                  h("i",{
                    'class':"iconfont icon-guaqi virtual-op-iconfont-normal",
                    style:{
                      fontWeight:"bold"
                    }
                  }),
                  h("span",{
                    'class':"virtual-op-title",
                    style:{
                      marginLeft:"15px"
                    }
                  },"移除实服务")
                ])
              ])
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
    Createchange(e){//接受添加实服务组件的值
      this.CreateServeOnOff=e;//把接受的值赋值给开关
    },
    Deletechange(e){//接受删除实服务组件的值
      this.DeleteServerOnOff=e;//把接受的值赋值给开关
    },
    newMonitor(){
      this.modal10=true;
    },
    actionListOff(index){
      var actionList=document.getElementsByClassName('action-list')[index];
      actionList.style.height="0";
      actionList.style.padding="0";
      this.onoff=true;
    }
  }
};
</script>
<style>
.action-list li:hover {
  background: #78ceff;
}
.action-list li:hover i {
  color: #fff;
}
.action-list li:hover span {
  color: #fff;
}
</style>
