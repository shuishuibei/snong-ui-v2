<!--
 * @Description 首页管理员页面
 * @Author caiyijun
 * @Date 2019-08-30 16:04:34
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-24 10:52:18
 -->
<template>
  <div class="cds-wrapper home" id="manager-page">
    <div class="first-line cds-cds-clearfix">
      <div class="cost-count cds-border cds-float-left">
        <h3c-title title="整体资源数量统计"></h3c-title>
        <div class="home-content">
          <div class="cds-clearfix resource-item">
            <div class="cds-float-left cds-clearfix division">
              <div class="cds-float-left icon-zone">
                <div class="icon-circle" style="background-color:#3399fe">
                  <i class="icon-yunzhuji2 iconfont"></i>
                </div>
              </div>
              <div class="cds-float-left data-zone">
                <span>x86虚拟机数量</span>
                <p class="data-value">{{globalResource.server}}</p>
              </div>
            </div>
            <div class="cds-float-left cds-clearfix division">
              <div class="cds-float-left icon-zone">
                <div class="icon-circle" style="background-color:#f90">
                  <i class="icon-rongliangxingyunyingpan iconfont"></i>
                </div>
              </div>
              <div class="cds-float-left data-zone">
                <span>x86硬盘数量</span>
                <p class="data-value">{{globalResource.volume}}</p>
              </div>
            </div>
            <div class="cds-float-left cds-clearfix">
              <div class="cds-float-left icon-zone">
                <div class="icon-circle" style="background-color:#01cc65">
                  <i class="icon-xuniwangqia81 iconfont"></i>
                </div>
              </div>
              <div class="cds-float-left data-zone">
                <span>x86网卡数量</span>
                <p class="data-value">{{globalResource.port}}</p>
              </div>
            </div>
          </div>
          <div class="cds-clearfix resource-item">
            <div class="cds-float-left cds-clearfix division">
              <div class="cds-float-left icon-zone">
                <div class="icon-circle" style="background-color:#08cfb2">
                  <i class="icon-host iconfont"></i>
                </div>
              </div>
              <div class="cds-float-left data-zone">
                <span>Power虚拟机数量</span>
                <p class="data-value">{{globalResource.power_server}}</p>
              </div>
            </div>
            <div class="cds-float-left cds-clearfix division">
              <div class="cds-float-left icon-zone">
                <div class="icon-circle" style="background-color:#9cb1e8">
                  <i class="icon-yingpan iconfont"></i>
                </div>
              </div>
              <div class="cds-float-left data-zone">
                <span>power硬盘数量</span>
                <p class="data-value">{{globalResource.power_volume}}</p>
              </div>
            </div>
            <div class="cds-float-left cds-clearfix">
              <div class="cds-float-left icon-zone">
                <div class="icon-circle" style="background-color:#33b4f8">
                  <i class="icon-wuliji iconfont"></i>
                </div>
              </div>
              <div class="cds-float-left data-zone">
                <span>power网卡数量</span>
                <p class="data-value">{{globalResource.power_port}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="notice cds-border cds-float-left">
        <h3c-title title="待办任务列表">
          <template #other>
            <span class="group-text">
              <i class="iconfont icon-shuaxin1" @click="getTaskToDoData"></i>
              <i class="iconfont icon-gengduo" @click="jumpPage"></i>
            </span>
          </template>
        </h3c-title>
        <div class="home-content" id="notice-list">
          <i-table 
            stripe
            highlight-row
            size="small"
            :loading="loading"
            :height="height"
            :columns="noticeColumns"
            :data="noticeData"
            :row-class-name="rowClassName">
          </i-table>
        </div>
      </div>
    </div>
    <div class="second-line cds-clearfix">
      <div class="x86-info cds-border cds-float-left">
        <i-spin size="large" fix v-if="spinShow0">
          <i-icon
            type="load-c"
            :size="40"
            class="full-icon-load">
          </i-icon>
          <div>Loading</div>
        </i-spin>
        <h3c-title title="X86资源使用率信息"></h3c-title>
        <div class="home-content cds-clearfix">
          <div class="cds-float-left water-wave">
            <div>vCPU</div>
            <custom-circle
              :percent="x86InfoObj.cpu_percent"
              color="#cde3fa"
              circle-color="#3298fd">
            </custom-circle>
            <div class="sum">总量 : <span>{{x86InfoObj.totalKernel}}</span>核</div>
            <div class="allocated">已分配 : <span>{{x86InfoObj.usedKernel}}</span>核</div>
          </div>
          <div class="cds-float-left water-wave">
            <div>内存</div>
            <custom-circle
              :percent="x86InfoObj.memory_percent"
              color="#f8e3c4"
              circle-color="#fe9900">
            </custom-circle>
            <div class="sum">总量 : <span>{{x86InfoObj.totalMemory}}</span>GB</div>
            <div class="allocated">已分配 : <span>{{x86InfoObj.usedMemory}}</span>GB</div>
          </div>
          <div class="cds-float-left water-wave">
            <div>存储</div>
            <custom-circle
              :percent="x86InfoObj.capacity_percent"
              color="#c1eeda"
              circle-color="#02cc65">
            </custom-circle>
            <div class="sum">总量 : <span>{{x86InfoObj.totalCapacity}}</span>TB</div>
            <div class="allocated">已分配 : <span>{{x86InfoObj.usedCapacity}}</span>TB</div>
          </div>
        </div>
      </div>
      <div class="power-info cds-border cds-float-left">
        <i-spin size="large" fix v-if="spinShow1">
          <i-icon
            type="load-c"
            :size="40"
            class="full-icon-load">
          </i-icon>
          <div>Loading</div>
        </i-spin>
        <h3c-title title="Power资源使用率信息"></h3c-title>
        <div class="home-content">
          <div class="cds-float-left water-wave">
            <div>处理单元</div>
            <custom-circle
              :percent="powerInfoObj.cpu_percent"
              color="#cde3fa"
              circle-color="#3298fd">
            </custom-circle>
            <div class="sum">总量 : <span>{{powerInfoObj.totalKernel}}</span>核</div>
            <div class="allocated">已分配 : <span>{{powerInfoObj.usedKernel}}</span>核</div>
          </div>
          <div class="cds-float-left water-wave">
            <div>内存</div>
            <custom-circle
              :percent="powerInfoObj.memory_percent"
              color="#f8e3c4"
              circle-color="#fe9900">
            </custom-circle>
            <div class="sum">总量 : <span>{{powerInfoObj.totalMemory}}</span>GB</div>
            <div class="allocated">已分配 : <span>{{powerInfoObj.usedMemory}}</span>GB</div>
          </div>
          <div class="cds-float-left water-wave">
            <div>存储</div>
            <custom-circle
              :percent="powerInfoObj.capacity_percent"
              color="#c1eeda"
              circle-color="#02cc65">
            </custom-circle>
            <div class="sum">总量 : <span>{{powerInfoObj.totalCapacity}}</span>TB</div>
            <div class="allocated">已分配 : <span>{{powerInfoObj.usedCapacity}}</span>TB</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import util from './util.js';
import { OrderStatus } from '@/assets/js/status';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';
import CustomCircle from './CustomCircle.vue';

export default {
  name: 'ManagerPage',
  mixins: [util],
  components: {
    'h3c-title': H3cTitle,
    'custom-circle': CustomCircle
  },
  mounted() {
    /*this.$loading.show();*/
    axios.all([this.getGlobalResData(), this.getTaskToDoData()]);
    this.getX86ResData();
    this.getPowerResData();
  },
  data() {
    return {
      spinShow0: true,
      spinShow1: true,
      spinShow2: true,
      loading: false,
      globalResource: {
        port: 0,
        power_port: 0,
        power_server: 0,
        power_volume: 0,
        server: 0,
        volume: 0
      },
      /*X86资源使用率信息展示数据*/
      x86InfoObj: {},
      /*Power资源使用率信息展示数据*/
      powerInfoObj: {},
      customPercent: 40,
      businessType: 1,
      noticeData: [],
      noticeColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          ellipsis: true,
          render: this.tableRender('orderNo')
        },
        {
          title: '申请类型',
          width: 90,
          key: 'applyType',
          render: (h, params) => {
            let status = params.row.applyType,
              arr = this.getStatusInfo(status, OrderStatus);
            let text = arr.length > 0 ? arr[0].label : '未知状态';
            return h(
              'div',
              {
                class: 'ivu-table-cell-ellipsis',
                attrs: { title: text }
              },
              [
                h(
                  'span',
                  {
                    style: {
                      'margin-left': '6px'
                    }
                  },
                  text
                )
              ]
            );
          }
        },
        {
          title: '当前任务',
          key: 'taskName',
          ellipsis: true,
          width: 100,
          render: this.tableRender('taskName')
        },
        {
          title: '申请人',
          key: 'applyUserName',
          ellipsis: true,
          width: 80,
          render: this.tableRender('applyUserName')
        },
        {
          title: '开始时间',
          key: 'processStartTime',
          ellipsis: true,
          render: this.tableRender('processStartTime')
        }
      ],
      cardData1: {
        heading: '内存利用率',
        subHeading: 'Memory utilization',
        color: '#00cc66',
        usage: 28,
        footData: {
          key: ['总量', '已使用', '未使用'],
          value: ['300G', '84G', '216G']
        }
      },
      cardData2: {
        heading: '存储利用率',
        subHeading: 'Storage utilization',
        color: '#f60',
        usage: 75,
        footData: {
          key: ['总量', '已使用', '未使用'],
          value: ['123G', '93G', '40G']
        }
      },
      cardData3: {
        heading: 'CPU利用率',
        subHeading: 'CPU utilization',
        color: '#39f',
        usage: 65,
        footData: {
          key: ['总量', '已使用', '未使用'],
          value: ['12G', '8G', '4G']
        }
      },
      cardData4: {
        heading: 'X86虚拟机利用率',
        subHeading: 'Cloud host utilization',
        color: '#f90',
        usage: 27,
        footData: {
          key: ['总量', '已使用', '未使用'],
          value: ['900G', '243G', '657G']
        }
      },
      height: 232
    };
  },
  methods: {
    /**
     * @description: 跳转到待办任务页面
     * @return: null
     */
    jumpPage() {
      this.$router.push({ path: '/process-manage/todo-process' });
    },
    /**
     * @description: 整体资源数量统计信息
     * @return: promise对象
     */
    getGlobalResData() {
      return this.getPromise('/overview/global/resource', data => {
        if (data.status) {
          let res = data.data;
          /* 防止传回空对象时页面报错 */
          Object.keys(this.globalResource).forEach(item => {
            if (res[item]) {
              this.globalResource[item] = res[item];
            }
          });
        }
      });
    },
    /**
     * @description: 待办任务列表信息
     * @return: promise对象
     */
    getTaskToDoData() {
      this.loading = true;
      return this.getPromise(
        '/overview/global/task_todo',
        data => {
          if (data.status) {
            this.noticeData = data.data;
          }
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
    },
    /**
     * @description: x86资源使用率信息
     * @return: promise对象
     */
    getX86ResData() {
      this.spinShow0 = true;
      return this.getPromise(
        '/overview/global/availability/x86',
        data => {
          if (data.status) {
            this.x86InfoObj = data.data;
          }
          this.spinShow0 = false;
        },
        () => {
          this.spinShow0 = false;
        }
      );
    },
    /**
     * @description: Power虚拟机资源使用率信息
     * @return: promise对象
     */
    getPowerResData() {
      this.spinShow1 = true;
      return this.getPromise(
        '/overview/global/availability/power',
        data => {
          if (data.status) {
            this.powerInfoObj = data.data;
          }
          this.spinShow1 = false;
        },
        () => {
          this.spinShow1 = false;
        }
      );
    }
  }
};
</script>

<style lang="less">
@import './common.less';

.ivu-spin-fullscreen {
  &.ivu-spin-fullscreen-wrapper {
    .ivu-spin-fix {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

<style lang="less" scoped>
#manager-page {
  /deep/ .ivu-progress-text {
    color: #3399fe;
  }
  /deep/ .ivu-progress-bg {
    background-color: #3399fe;
  }

  #notice-list {
    /deep/ .ivu-table th {
      background-color: #e6f0f7 !important;
    }
    /*偶数行*/
    /deep/ .ivu-table-stripe-even td {
      background-color: #fff !important;
    }

    /*奇数行*/
    /deep/ .ivu-table-stripe-odd td {
      background-color: #f5f7f9 !important;
    }
  }
}

.icon-shuaxin1:before {
  font-size: 18px !important;
}

.icon-gengduo:before {
  font-size: 18px !important;
}

.home-content {
  width: 100%;
  height: calc(~'100% - 30px');
  padding-top: 14px;
}

@total-cost-height: 20px;
@line-height: 270px;
@marginLeft: 15px;
@marginTop: 10px;
.cds-wrapper {
  .cds-border {
    padding: 0 14px 14px 14px;
  }

  .second-line {
    width: 100%;
    height: calc(~'(100% - 2 * @{marginTop})/2');
    margin: @marginTop 0;
    .x86-info {
      position: relative;
      height: 100%;
      width: calc(~'(100% - @{marginLeft}) * 0.5');
      padding: 0 14px 14px 14px;
      .home-content {
        .water-wave {
          width: calc(~'100% / 3 - 1px');
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          & > div {
            width: 100%;
            text-align: center;
          }
        }
      }
    }
    .power-info {
      position: relative;
      margin-left: @marginLeft;
      padding: 0 14px 14px 14px;
      height: 100%;
      width: calc(~'(100% - @{marginLeft}) * 0.5');
      .home-content {
        .water-wave {
          width: calc(~'100% / 3 - 1px');
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          & > div {
            width: 100%;
            text-align: center;
          }
        }
      }
    }
  }
  .first-line {
    width: 100%;
    height: calc(~'(100% - 2 * @{marginTop})/2');
    .cost-count {
      height: 100%;
      width: calc(~'(100% - @{marginLeft}) * 0.5');
      padding: 0 14px 14px 14px;
      .home-content {
        .resource-item {
          height: 50%;
          width: 100%;
          & > div {
            width: calc(100% / 3);
            height: 100%;
            padding-top: 15px;
          }
          .division:after {
            content: '';
            display: inline-block;
            width: 1px;
            height: 40px;
            background-color: #e2e5ec;
            position: relative;
            left: 95%;
            top: -90px;
          }
          .icon-zone {
            height: 100%;
            width: 25%;
            position: relative;
          }
          .data-zone {
            height: 100%;
            width: 75%;
            padding-left: 10px;
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
          width: 32px;
          height: 32px;
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
            font-size: 20px;
          }
        }
      }
    }
    .notice {
      margin-left: 15px;
      padding: 0 14px 14px 14px;
      height: 100%;
      width: calc(~'(100% - @{marginLeft}) * 0.5');
      .group-text {
        position: absolute;
        right: 10px;
        .icon-shuaxin1 {
          color: #15ce61;
          font-size: 15px;
          cursor: pointer;
        }
        .icon-gengduo {
          color: #929d9b;
          font-size: 15px;
          cursor: pointer;
        }
      }
      #notice-list {
        overflow: hidden;
      }
    }
  }
}
</style>

