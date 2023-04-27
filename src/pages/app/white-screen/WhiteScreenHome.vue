<!--
 * @Description 服务目录云资源首页面
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:41
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:45:41
 -->
<template>
  <div>
  <ul class="cloud-home cds-border">
    <li
      class="cloud-resource"
      v-for="item in resources"
      :key="item.handle"
      @click="flag.proxyLog = true">
      <div class="action-img">
        <i :class="{iconfont:true,[item.iconName]:true}"></i>
      </div>
      <span class="cloud-resource-title">{{item.name}}</span>
      <p class="cloud-resource-desc">{{item.desc}}</p>
      <p class="cloud-loading"></p>
    </li>
    <li
      class="cloud-hide"
      v-if="resources.length < 7">
    </li>
    <li
      class="cloud-hide"
      v-if="resources.length < 8">
    </li>
  </ul>
  <proxy-log v-model="flag.proxyLog" :data="currentRow" ></proxy-log>
  </div>
</template>

<script>
import ProxyLog from './components/ProxyLog.vue'
export default {
  name: 'white-screen',
  components:{
    'proxy-log': ProxyLog,
  },
  data() {
    return {
      resources: [
        {
          name: 'Proxy主机日志下载',
          iconName: 'icon-yunzhuji',
          handle: 'resource-directory/x86',
          desc: 'Proxy主机为远程运维与项目现场连接的主机，可以将日志下载后分析故障'
        }
      ],
      flag: {
        proxyLog: false
      },
      selectIds: [], //表格中选中的数据
      currentRow: {}, //表格中当前操作行
    };
  }
};
</script>

<style scoped lang="less">
.cloud-home {
  display: flex;
  //align-content: space-around;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  min-height: 780px;
  overflow: auto;
  box-sizing: border-box;
  padding: 0 15/1920 * 100vw;
  .cloud-hide {
    width: 372/1920 * 100vw;
    min-width: 277.44px;
    height: 400/1080 * 100vh;
    min-height: 265px;
  }
  .cloud-resource {
    position: relative;
    width: 372/1920 * 100vw;
    min-width: 277.44px;
    height: 400/1080 * 100vh;
    min-height: 265px;
    background-color: rgba(227, 239, 248, 0.8);
    box-sizing: border-box;
    padding: 0 45/1920 * 100vw;
    cursor: pointer;
    transform: translateY(0);
    transition: transform 0.3s;
    &:hover {
      transform: translateY(-20/1920 * 100vw);
      background-color: rgba(227, 239, 248, 1);
      .cloud-loading {
        width: 100%;
      }
      .action-img {
        width: 113/1920 * 100vw;
        min-width: 50.7px;
        height: 92/1920 * 100vw;
        min-height: 59.66;
        background-image: url(../../../assets/imgs/cloud-mall/box-img-open.png);
        .iconfont {
          opacity: 1;
          top: -20/1920 * 100vw;
        }
      }
      &:nth-of-type(5) {
        .action-img {
          .iconfont {
            top: -30/1920 * 100vw;
          }
        }
      }
    }
    .action-img {
      position: absolute;
      top: 60/1920 * 100vw;
      left: 50%;
      transform: translateX(-50%);
      width: 68/1920 * 100vw;
      height: 80/1920 * 100vw;
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url(../../../assets/imgs/cloud-mall/box-img.png);
      > .iconfont {
        position: absolute;
        top: 0;
        left: 50%;
        opacity: 0;
        transform: translateX(-50%);
        transition: opacity 0.1s, top 0.3s;
        &::before {
          font-size: 48/1920 * 100vw;
          background-image: linear-gradient(to right, #1a52e1, #4493fd);
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    &:nth-of-type(2) {
      .action-img {
        > .iconfont {
          &::before {
            font-size: 40/1920 * 100vw;
          }
        }
      }
    }
    &:nth-of-type(3) {
      .action-img {
        > .iconfont {
          &::before {
            font-size: 46/1920 * 100vw;
          }
        }
      }
    }
    &:nth-of-type(4) {
      .action-img {
        > .iconfont {
          &::before {
            font-size: 42/1920 * 100vw;
          }
        }
      }
    }
    &:nth-of-type(5) {
      .action-img {
        > .iconfont {
          &::before {
            font-size: 56/1920 * 100vw;
          }
        }
      }
    }
    &:nth-of-type(6) {
      .action-img {
        > .iconfont {
          &::before {
            font-size: 40/1920 * 100vw;
          }
        }
      }
    }
    .cloud-resource-title {
      position: absolute;
      left: 50%;
      top: 43%;
      width: 100%;
      transform: translateX(-50%);
      font-size: 33/1920 * 100vw;
      color: #3299fe;
      text-align: center;
      &::before {
        position: absolute;
        top: 135%;
        left: 50%;
        transform: translateX(-50%);
        content: '';
        width: 50/1920 * 100vw;
        height: 6/1920 * 100vw;
        background-color: #3299fe;
      }
    }
    .cloud-resource-desc {
      position: absolute;
      bottom: 60/1920 * 100vw;
      left: 50%;
      transform: translateX(-50%);
      width: calc(~'100% - 90px');
      height: 42/1080 * 100vh;
      min-height: 35px;
      font-size: 14/1080 * 100vh;
      text-align: center;
      letter-spacing: 0.5px;
      overflow: hidden;
    }
    .cloud-loading {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 6/1920 * 100vw;
      background-color: #3299fe;
      transition: width 0.5s;
    }
  }
}
</style>
