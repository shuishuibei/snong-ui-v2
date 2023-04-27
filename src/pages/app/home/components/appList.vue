<template>
  <div class="cds-app-wrapper" id="manager-page">
    <div class="first-line cds-cds-clearfix">
      <div class="cost-count cds-border cds-float-left">
      <h3c-title title="应用列表"></h3c-title>
      <div class="home-content">
        <div class="cds-clearfix resource-item">
          <div v-for="app in appList" class="cds-float-left cds-clearfix" @click="jumpLink(app.url)">
            <div class="cds-float-left icon-zone">
              <div class="icon-circle" :style="app.bgColor">
                  <i :class="app.icon"></i>
              </div>
            </div>
            <div class="cds-float-left data-zone">
              <Poptip trigger="hover" :content="app.desc" :title="app.title" placement="right-end">
                <span>{{ app.title }}</span>
              </Poptip>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';

export default {
  data(){
    return {
      appList: [
        {
          url: '',
          bgColor:'background-color:#08cfb2',
          icon: 'icon-icon_yingyongguanli iconfont',
          title: '金猊运维平台',
          desc: '总部统一监控告警运维平台，部署在总部内网，需要接入总部VPN进行访问。'
        },{
          url: 'http://opscloud.h3c.com/o/bk_itsm/#/',
          bgColor:'background-color:#3399fe',
          icon: 'icon-liuchengtu iconfont',
          title: '流程管理',
          desc: '部门ITSM系统，主要用户部门内部流程管理，部署在IT云公网。'
        },{
        url: 'http://opscloud.h3c.com/o/bk-itsm-ce/#/',
        bgColor:'background-color:#3399fe',
        icon: 'icon-xinxi iconfont',
        title: '故障管理',
        desc: '部门故障管理平台，主要用于项目故障信息记录、故障消息发送和故障复盘等功能，部署在IT云公网。'
      },{
        url: 'user/iknow/login',
        bgColor:'background-color:#f90',
        icon: 'icon-zcpt-zhishikuguanli iconfont',
        title: 'iKnow知识库',
        desc: '部门知识库系统用于传递部门共享文档，知识库系统分为内外网部署，公网环境只能访问公网上的知识库。'
      },{
          url: 'http://10.10.1.47:3000/dashboards',
          bgColor:'background-color:#8bc34a',
          icon: 'icon-wangluo1 iconfont',
          title: '总部网络流量监控',
          desc: '用于展示已远程接入项目的网络设备流量的监控信息,需要接入总部VPN进行访问。'
        },{
        url: 'http://10.10.1.35:8081/',
        bgColor:'background-color:#01cc65',
        icon: 'icon-dapingzhanshi iconfont',
        title: '运维大屏',
        desc: '部门运维大屏用于展示远程接入项目的资源、告警等信息，常用于对外展示，需要接入总部VPN进行访问。'
      },{
        url: 'http://csmp.h3c.com/',
        bgColor:'background-color:#33b4f8',
        icon: 'icon-yunzhuji2 iconfont',
        title: 'CSMP系统',
        desc: 'CSMP系统'
      },{
        url: '',
        bgColor:'background-color:#9cb1e8',
        icon: 'icon-shouye iconfont',
        title: '服务销售管理',
        desc: '服务销售管理'
      }],
    }
  },
  components:{
    'h3c-title': H3cTitle,
  },
  methods:{
    jumpLink(url) {
      if (url.startsWith("http")) {
        window.open(url,'_blank')
      } else {
        this.$http.get(url).then(({ data }) => {
          if(data.status) {
            window.open(data.message,'_blank')
          }
        })
      }
    },
    // /**
    //  * 跳转iknow知识库链接
    //  */
    // iknow() {
    //   this.$http.get('user/iknow/login').then(({ data }) => {
    //     if(data.status) {
    //       window.open(data.message,'_blank')
    //     }
    //   })
    // },
    // screen() {
    //   let url = 'http://10.10.1.35:8081/'
    //   window.open(url,'_blank')
    // },
  },
  created(){
  }
}
</script>

<style lang="less">
.ivu-spin-fullscreen {
  &.ivu-spin-fullscreen-wrapper {
    .ivu-spin-fix {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

<style lang="less" scoped>
@marginLeft: 15px;
@marginTop: 10px;
.cds-app-wrapper {
  min-width: 1176px;
  overflow-x: hidden;
  overflow-y: auto;
  .cds-border {
    padding: 0 14px 14px 14px;
  }
  .first-line {
    width: 100%;
    //height: 65%;
    .cost-count {
      height: 340px;
      width: 100%;
      padding: 0 14px 14px 14px;
      .home-content {
          width: 100%;
          height: calc(~'100% - 100px');
          padding-top: 14px;
        .resource-item {
          height: 55%;
          width: 100%;
          & > div {
            width: 150px;
            height: 100%;
            padding-top: 15px;
            //border: 1px solid #d5d8db;
            border-radius: 8px;
            margin: 15px 15px 0 0;
            -webkit-box-shadow: #666 0px 0px 5px;
            -moz-box-shadow: #666 0px 0px 5px;
            box-shadow: #666 0px 0px 5px;
          }
          .icon-zone {
            height: 75%;
            width: 100%;
            position: relative;
          }
          .data-zone {
            height: 25%;
            width: 100%;
            //padding-left: 10px;
            text-align: center;
            .data-value {
              font-size: 40px;
            }
            span {
              color: #66707a;
              font-size: 14px;
            }
          }
        }
        .icon-circle {
          border-radius: 50%;
          width: 64px;
          height: 64px;
          color: #fff;
          position: absolute;
          left: 50%;
          top: 3%;
          transform: translate(-50%, 0);
          .iconfont {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .iconfont:before {
            font-size: 40px;
          }
        }
      }
    }
  }
}
</style>
