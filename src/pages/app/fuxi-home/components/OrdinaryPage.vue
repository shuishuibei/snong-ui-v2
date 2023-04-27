<!--
 * @Description 首页普通用户页面
 * @Author caiyijun
 * @Date 2019-08-30 16:04:34
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-24 10:53:27
 -->
<template>
  <div class="cds-wrapper home" id="ordinary-page">
    <div class="first-line cds-clearfix">
      <div class="cost-count cds-border cds-float-left">
        <h3c-title title="可见资源数量统计"></h3c-title>
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
                <p class="data-value">{{userResource.bs}}</p>
              </div>
            </div>
            <div class="cds-float-left cds-clearfix division">
              <div class="cds-float-left icon-zone">
                <div class="icon-circle" style="background-color:#ff9900">
                  <i class="icon-rongliangxingyunyingpan iconfont"></i>
                </div>
              </div>
              <div class="cds-float-left data-zone">
                <span>x86硬盘数量</span>
                <p class="data-value">{{userResource.bv}}</p>
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
                <p class="data-value">{{userResource.bp}}</p>
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
                <p class="data-value">{{userResource.ps}}</p>
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
                <p class="data-value">{{userResource.pv}}</p>
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
                <p class="data-value">{{userResource.pp}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-container cds-border cds-float-left">
        <h3c-title title="我的流程">
          <template #other>
            <span class="group-text">
              <i class="iconfont icon-shuaxin1" @click="getTaskToDoData"></i>
              <i class="iconfont icon-gengduo" @click="jumpPage"></i>
            </span>
          </template>
        </h3c-title>
        <div class="home-content">
          <i-table 
            stripe
            highlight-row
            size="small"
            :loading="taskLoading"
            :height="tableHeight"
            :columns="taskColumns"
            :data="taskData"
            :row-class-name="rowClassName">
          </i-table>
        </div>
      </div>
    </div>
    <div class="second-line cds-clearfix">
      <div class="x86-info cds-border cds-float-left">
        <i-spin size="large" fix v-if="spinShow">
          <i-icon type="load-c" :size="40" class="full-icon-load"></i-icon>
          <div>Loading</div>
        </i-spin>
        <h3c-title title="性能统计"></h3c-title>
        <div class="home-content cds-clearfix">
          <i-tabs value="x86_cpu">
            <i-tab-pane label="x86 CPU TOP5" name="x86_cpu">
              <div v-for="(item,index) in x86_cpu_data" :key="index" class="cds-clearfix progress">
                <div class="system-name cds-float-left" :title="item.name">
                  {{item.name}}
                </div>
                <div class="system-value cds-float-left">
                  <i-progress :percent="item.percent">
                    <span>{{item.value}}</span>
                  </i-progress>
                </div>
              </div>
            </i-tab-pane>
            <i-tab-pane label="x86 内存 TOP5" name="x86_memory">
              <div v-for="(item,index) in x86_memory_data" :key="index" class="cds-clearfix progress">
                <div class="system-name cds-float-left" :title="item.name">
                  {{item.name}}
                </div>
                <div class="system-value cds-float-left">
                  <i-progress :percent="item.percent">
                    <span>{{item.value}}</span>
                  </i-progress>
                </div>
              </div>
            </i-tab-pane>
            <i-tab-pane label="power CPU TOP5" name="power_cpu">
              <div v-for="(item,index) in power_cpu_data" :key="index" class="cds-clearfix progress">
                <div class="system-name cds-float-left" :title="item.name">
                  {{item.name}}
                </div>
                <div class="system-value cds-float-left">
                  <i-progress :percent="item.percent">
                    <span>{{item.value}}</span>
                  </i-progress>
                </div>
              </div>
            </i-tab-pane>
            <i-tab-pane label="power 内存 TOP5" name="power_memory">
              <div v-for="(item,index) in power_memory_data" :key="index" class="cds-clearfix progress">
                <div class="system-name cds-float-left" :title="item.name">
                  {{item.name}}
                </div>
                <div class="system-value cds-float-left">
                  <i-progress :percent="item.percent">
                    <span>{{item.value}}</span>
                  </i-progress>
                </div>
              </div>
            </i-tab-pane>
          </i-tabs>
        </div>
      </div>
      <div class="power-info cds-border cds-float-left table-container">
        <h3c-title title="软件项目信息">
          <template #other>
            <span class="group-text">
              <i class="iconfont icon-shuaxin1" @click="getUserSystemListData"></i>
            </span>
          </template>
        </h3c-title>
        <div class="home-content">
          <div class="title-bar">
            <span>所属软件项目数量</span>
            <span class="data">&nbsp;{{systemData.length}}&nbsp;</span>
            <span>个</span>
          </div>
          <i-table 
            stripe
            highlight-row
            size="small"
            :loading="systemLoading"
            :height="tableHeight"
            :columns="systemColumns"
            :data="systemData"
            :row-class-name="rowClassName">
          </i-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import util from './util.js';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';
import { OrderStatus, ProcessStatus } from '@/assets/js/status';

export default {
  name: 'OrdinaryPage',
  mixins: [util],
  components: {
    'h3c-title': H3cTitle
  },
  data() {
    return {
      spinShow: false,
      taskLoading: true,
      systemLoading: true,
      defaultId: this.$store.state.login.userId,
      tableHeight: 232,
      userResource: {
        bp: 0,
        bs: 0,
        bv: 0,
        pp: 0,
        ps: 0,
        pv: 0
      },
      x86_cpu_data: [],
      x86_memory_data: [],
      power_cpu_data: [],
      power_memory_data: [],
      businessType: 1,
      arrorPositon: 'top',
      systemData: [],
      systemColumns: [
        {
          title: '编号',
          key: 'code',
          ellipsis: true,
          render: this.tableRender('code')
        },
        {
          title: '软件项目名称',
          key: 'name',
          ellipsis: true,
          render: this.tableRender('name')
        },
        {
          title: '描述',
          key: 'description',
          ellipsis: true,
          render: this.tableRender('description')
        },
        {
          title: '创建时间',
          key: 'time',
          ellipsis: true,
          render: this.tableRender('time')
        }
      ],
      taskData: [],
      taskColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          ellipsis: true,
          width: 130,
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
          render: (h, params) => {
            let arr = [];
            let param = params.row.taskName;
            if(param !== null) {
               arr = ProcessStatus.filter(val => {
                return val.value === param.toLocaleUpperCase();
              });
            }
            let text = arr.length > 0 ? arr[0].label : param;
            return h(
              'span',
              {
                attrs: { title: text }
              },
              text
            );
          }
        },
        {
          title: '处理人',
          key: 'handles',
          ellipsis: true,
          width: 80,
          render: this.tableRender('handles')
        },
        {
          title: '开始时间',
          key: 'startTime',
          ellipsis: true,
          render: this.tableRender('startTime')
        },
        {
          title: '结束时间',
          key: 'endTime',
          ellipsis: true,
          render: this.tableRender('endTime')
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
      }
    };
  },
  mounted() {
    this.getGlobalResData();
    this.getTaskToDoData();
    this.getUserSystemListData();
    this.spinShow = true;
    axios
      .all([
        this.getX86ParamData('cpu'),
        this.getX86ParamData('memory'),
        this.getPowerParamData('cpu'),
        this.getPowerParamData('memory')
      ])
      .then(() => {
        this.spinShow = false;
      })
      .catch(() => {
        this.spinShow = false;
      });
  },
  methods: {
    /**
     * @description: 整体资源数量统计信息
     * @return: promise对象
     */
    getGlobalResData() {
      return this.getPromise(`/overview/user/resource/${this.defaultId}`, result => {
        if (result.status) {
          let res = result.data;
          /* 防止传回空对象时页面报错 */
          Object.keys(this.userResource).forEach(item => {
            if (res[item]) {
              this.userResource[item] = res[item];
            }
          });
        }
      });
    },
    /**
     * @description: 获取x86主机的性能参数
     * @param type {String} 资源类型(cpu或memory)
     * @return: promise对象
     */
    getX86ParamData(type) {
      return this.getPromise(`/overview/user/x86_sort/${type}/${this.defaultId}`, result => {
        if (result.status) {
          let data = result.data;
          let max = data[0].value;
          this['x86_' + type + '_data'] = data;
          this['x86_' + type + '_data'].forEach(val => {
            if (Number(val.value) === 0) {
              val.percent = 0;
            } else {
              val.percent = Number(((100 * val.value) / max).toFixed(2));
            }
            val.value += '%';
          });
        }
      });
    },
    /**
     * @description: 获取Power虚拟机的性能参数
     * @param type {String} 资源类型(cpu或memory)
     * @return: promise对象
     */
    getPowerParamData(type) {
      return this.getPromise(`/overview/user/power_sort/${type}/${this.defaultId}`, result => {
        if (result.status) {
          let data = result.data;
          let max = data[0].value;
          this['power_' + type + '_data'] = data;
          this['power_' + type + '_data'].forEach(val => {
            if (Number(val.value) === 0) {
              val.percent = 0;
            } else {
              val.percent = Number(((100 * val.value) / max).toFixed(2));
            }
            val.value += '%';
          });
        }
      });
    },
    /**
     * @description: 跳转页面
     * @return: null
     */
    jumpPage() {
      this.$router.push({ path: '/process-manage/my-process' });
    },
    /**
     * @description: maximo任务列表
     * @return: promise对象
     */
    getTaskToDoData() {
      this.taskLoading = true;
      return this.getPromise(
        `/overview/user/task/${this.defaultId}`,
        result => {
          if (result.status) {
            this.taskData = result.data;
          }
          this.taskLoading = false;
        },
        () => {
          this.taskLoading = false;
        }
      );
    },
    /**
     * @description: 获取用户所属业务系统列表
     * @return: promise对象
     */
    getUserSystemListData() {
      this.systemLoading = true;
      return this.getPromise(
        `/overview/user/system/list/${this.defaultId}`,
        result => {
          if (result.status) {
            this.systemData = result.data;
          }
          this.systemLoading = false;
        },
        () => {
          this.systemLoading = false;
        }
      );
    }
  }
};
</script>

<style lang="less">
@import './common.less';
</style>

<style lang="less" scoped>
#ordinary-page {
  .table-container {
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

  /deep/ .ivu-progress-text {
    color: #3399fe;
  }
  /deep/ .ivu-progress-bg {
    background-color: #3399fe;
  }
}

.icon-shuaxin1:before {
  font-size: 18px !important;
}

.home-content {
  width: 100%;
  height: calc(~'100% - 30px');
  padding-top: 14px;
}

.table-container {
  width: calc(~'(100% - @{marginLeft}) * 0.5');
  height: 100%;
  margin-left: 15px;
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
}

@total-cost-height: 20px;
@line-height: 300px;
@marginLeft: 15px;
.cds-wrapper {
  height: 100%;
  border: 0;
  padding: 0;
  background-color: #f5f7f9;
  overflow-y: auto;
  overflow-x: hidden;

  .cds-border {
    padding: 0 14px 14px 14px;
  }

  .second-line {
    width: 100%;
    height: calc(~'100% - @{line-height} - 10px');
    margin: 10px 0;
    .x86-info {
      position: relative;
      width: calc(~'(100% - @{marginLeft}) * 0.5');
      height: 100%;
      min-height: 320px;
      .home-content {
        min-height: 290px;
        .progress {
          margin-top: 20px;
          .system-name {
            position: relative;
            top: 50%;
            width: 100px;
            text-align: right;
            transform: translate(0, -50%);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
          }
          .system-value {
            position: relative;
            top: 50%;
            width: calc(~'100% - 100px');
            padding-left: 10px;
            transform: translate(0, -50%);
          }
        }
      }
    }
    .power-info {
      width: calc(~'(100% - @{marginLeft}) * 0.5');
      height: 100%;
      min-height: 320px;
      margin-left: @marginLeft;
      .home-content {
        min-height: 290px;
        .title-bar {
          display: flex;
          height: 40px;
          margin-bottom: 10px;
          padding-left: 10px;
          line-height: 40px;
          background-color: #f6f7f9;
          align-items: center;
          .data {
            color: #00cc67;
            font-size: 30px;
          }
        }
      }
    }
  }

  .first-line {
    width: 100%;
    height: @line-height;
    .cost-count {
      width: calc(~'(100% - @{marginLeft}) * 0.5');
      height: 100%;
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
            position: relative;
            left: 95%;
            top: -100px;
            width: 1px;
            height: 40px;
            background-color: #e2e5ec;
          }
          .icon-zone {
            width: 25%;
            height: 100%;
            position: relative;
          }
          .data-zone {
            width: 75%;
            height: 100%;
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
          position: absolute;
          left: 50%;
          top: 5%;
          width: 32px;
          height: 32px;
          color: #fff;
          border-radius: 50%;
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
  }
  .service-resource {
    margin: 15px 0;
    width: 100%;
    height: calc(~'(100% - 30px) *3 / 13');
    .home-content {
      display: flex;
      flex-direction: row;
      & > div {
        width: calc(~'100% / 3');
      }
    }
  }
}
</style>

