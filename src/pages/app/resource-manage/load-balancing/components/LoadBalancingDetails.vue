<template>
    <div class="load-wrap" style="background:none">
        <layout :style="{background:'none',height:'100%',width:'100%',position:'relative'}">
            <div class="details-left">
                 <h3>基本信息</h3>
                 <p class="details-line"></p>
                 <ul class="details-list">
                     <li>
                         <span>UUID<b>:</b></span>
                         <p>{{detailsData.id}}</p>
                     </li>
                     <li>
                         <span>名称<b>:</b></span>
                         <p>{{detailsData.name}}</p>
                     </li>
                     <li>
                         <span>状态<b>:</b></span>
                         <p :class="detailsData.state === '运行' ? 'state-run' : 'state-stop'" :style="{textIndent:'28px',color:detailsData.state === '运行' ?'#15da76':'#929394'}">{{detailsData.state}}</p>
                     </li>
                     <li>
                         <span>虚服务IP<b>:</b></span>
                         <p>{{detailsData.virtualIP}}</p>
                     </li>
                      <li>
                          <span>虚服务子网id<b>:</b></span>
                         <p>{{detailsData.possessor}}</p>
                      </li>
                      <li>
                          <span>描述<b>:</b></span>
                         <p>{{detailsData.describe}}</p>
                      </li>
                 </ul>
            </div>
            <div class="details-right">
                <div class="details-overflow">
                    <i-tabs value="name1">
                        <i-tab-pane label="监听器" name="name1">
                            <monitor></monitor>
                        </i-tab-pane>
                        <i-tab-pane label="实服务器" name="name2">
                            <server-group></server-group>
                        </i-tab-pane>
                        <i-tab-pane label="健康检查" name="name3">
                             <health-check></health-check>
                        </i-tab-pane>
                        <i-tab-pane label="操作日志" name="name4">标签四的内容</i-tab-pane>
                    </i-tabs>
                </div>
            </div>
        </layout>
    </div>
</template>
<script>
import Monitor from './Monitor.vue'
import ServerGroup from './ServerGroup.vue'
import HealthCheck from './HealthCheck.vue'
export default {
    props:['detailsData'],
    components:{
       'monitor': Monitor,
       'server-group': ServerGroup,
       'health-check': HealthCheck
    }
}
</script>
<style scoped>
   .load-wrap{
       width:100%;
       height:100%;
   }
   .details-left{
       position: absolute;
       top:0;
       left:0;
       width:33%;
       height:100%;
       background: #fff;
       padding:0 20px;
   }
   .details-left >h3{
       position: relative;
       font-weight: normal;
       font-size: 16px;
       margin: 15px 0;
       text-indent:20px;
   }
   .details-left >h3:after{
       position: absolute;
       content: '';
       height:100%;
       width:4px;
       top:0;
       left:0;
       background: #ff0042;
   }
   .state-run:after,.state-stop:after{
       left:8px !important;
   }
   .details-line{
       width:100%;
       height:1px;
       background: #d5d8db;
   }
   .details-list{
       width:100%;
       padding-top:20px;
   }
   .details-list li{
       position: relative;
       list-style: none;
       height:40px;
       width:100%;
   }
   .details-list li span{
       position: absolute;
       width:25%;
       height:100%;
       left:0;
       top:0;
       text-align: right;
       line-height: 40px;
   }
   .details-list li span b{
       padding-left: 8px;
   }
   .details-list li p{
       position: absolute;
       width:75%;
       height:100%;
       right:0;
       top:0;
       text-align: left;
       line-height: 40px;
       text-indent:8px;
   } 
   .details-list li:nth-of-type(2n-1){
       background: #f5f8fd;
   }
   .details-list li:nth-of-type(2n){
       background: #fff;
   }
   .details-right{
      position: absolute;
      top:0;
      right:0;
      width:65.88%;
      padding:0 23px;
      height:100%;
      background: #fff;
      font-size: 16px;
      font-weight: normal;
      overflow: hidden;
   }
   .details-overflow{
       width:100%;
       height:100%;
       overflow: hidden;
   }
</style>
<style>
   .details-right .ivu-tabs-bar{
       height:55px;
   }
   .details-right .ivu-tabs-nav{
       height:55px;
       line-height:55px;
   }
   .details-right .ivu-tabs-nav .ivu-tabs-tab{
       width:120px;
       padding:0;
       text-align:center;
   }
   .ivu-tabs-nav .ivu-tabs-tab-active{
       color:#47c5fe;
   }
   .details-right .ivu-tabs-ink-bar{
       background:#47c5fe;
   }
   .details-right .ivu-tabs-content{
       padding-top:20px;
   }
   .ivu-switch-checked{
       background: #9AAdde;
       border-color:#9AAdde;
   }
</style>


