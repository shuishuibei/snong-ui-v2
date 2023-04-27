<!--
 * @Description Power虚拟机基本申请选择物理主机页面
 * @Author ys1983/张睿博
 * @Date 2019-08-22 14:32:35
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:57:40
 -->
<template>
  <div class="physical-host">
    <div class="physical-host-content">
      <div class="content-left">
        <h3c-tree
          :data="hostGroup"
          @on-select-change="selectTree">
        </h3c-tree>
      </div>
      <div class="content-right">
        <tabs>
          <i-tab-pane label="主机概览">
            <div class="tab-pane-wrap">
              <h3c-mall
                v-for="value in hostOverview"
                :key="value.id+value.name"
                class-name="icon-zhuji"
                :title="value.display_name"
                style-set="#3399ff"
                fs="2rem">
                <template slot="mallContent">
                  <div class="cds-float-left charts-left host-charts">
                    <div style="width:50%;height:100%" class="cds-float-left">
                      <i-circle
                        :percent="parseInt(value.cpu_utilization*100)"
                        stroke-color="#00CC65"
                        :stroke-width="3"
                        :size="100">
                        <span
                          class="demo-Circle-inner"
                          style="font-size:24px;color:#00CC65">
                          {{parseInt(value.cpu_utilization*100)+'%'}}
                        </span>
                      </i-circle>
                      <p>CPU利用率</p>
                    </div>
                    <div style="width:50%;height:100%" class="cds-float-right">
                      <i-circle
                        :percent="parseInt(value.memory_utilization*100)"
                        stroke-color="#0C8CEF"
                        :stroke-width="3"
                        :size="100">
                        <span
                          class="demo-Circle-inner"
                          style="font-size:24px;color:#0C8CEF">
                          {{parseInt(value.memory_utilization*100)+'%'}}
                        </span>
                      </i-circle>
                      <p>内存利用率</p>
                    </div>
                  </div>
                  <div class="cds-float-right charts-right host-charts">
                    <div
                      v-for="(array,key) in value.scgs"
                      :key="key+value.id">
                      <ul>
                        <li
                          v-for="hostValue in array"
                          :key="hostValue.serverId"
                          :title="hostValue.serverName">
                          <i class="iconfont icon-quanju_kongzhi" style="color:#0C8CEF"></i>
                          <span>{{hostValue.serverName}}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </template>
              </h3c-mall>
            </div>
          </i-tab-pane>
          <i-tab-pane label="主机组">
            <div class="tab-pane-wrap">
              <ul class="groupHost cds-margin-top-14" v-if="hostGrounpList.metadata">
                <li class="clearfix">
                  <p class="cds-float-left">
                    名称&nbsp;&nbsp;
                    <b>:</b>
                  </p>
                  <div class="cds-float-right">{{hostGrounpList.name}}</div>
                </li>
                <li v-if="hostGrounpList.metadata.policy">
                  <p class="cds-float-left">
                    布置策略&nbsp;&nbsp;
                    <b>:</b>
                  </p>
                  <div class="cds-float-right">{{hostGrounpList.metadata.policy}}</div>
                </li>
                <li>
                  <p class="cds-float-left">
                    自动远程重启&nbsp;&nbsp;
                    <b>:</b>
                  </p>
                  <div class="cds-float-right">{{hostGrounpList.metadata.arr_enabled?'是':'否'}}</div>
                </li>
                <template v-if="hostGrounpList.metadata.arr_enabled">
                  <li>
                    <p class="cds-float-left">
                      运行时间间隔&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.arr_run_interval+'分钟'}}</div>
                  </li>
                  <li>
                    <p class="cds-float-left">
                      稳定性&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.arr_stabilization+'次'}}</div>
                  </li>
                </template>
                <li>
                  <p class="cds-float-left">
                    动态资源优化&nbsp;&nbsp;
                    <b>:</b>
                  </p>
                  <div class="cds-float-right">{{hostGrounpList.metadata.dro_enabled?'是':'否'}}</div>
                </li>
                <template v-if="hostGrounpList.metadata.dro_enabled">
                  <li>
                    <p class="cds-float-left">
                      方式&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.dro_type}}</div>
                  </li>
                  <li>
                    <p class="cds-float-left">
                      受监视资源&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.dro_resource}}</div>
                  </li>
                  <li>
                    <p class="cds-float-left">
                      操作&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.dro_resource}}</div>
                  </li>
                  <li>
                    <p class="cds-float-left">
                      利用率阈值&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.dro_threshold+'%'}}</div>
                  </li>
                  <li>
                    <p class="cds-float-left">
                      运行时间间隔&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.dro_run_interval+'分钟'}}</div>
                  </li>
                  <li>
                    <p class="cds-float-left">
                      稳定性&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.dro_stabilization+'次'}}</div>
                  </li>
                  <li>
                    <p class="cds-float-left">
                      最大并发迁移数&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.dro_max_parallel}}</div>
                  </li>
                  <li>
                    <p class="cds-float-left">
                      调度&nbsp;&nbsp;
                      <b>:</b>
                    </p>
                    <div class="cds-float-right">{{hostGrounpList.metadata.dro_action}}</div>
                  </li>
                </template>
              </ul>
            </div>
          </i-tab-pane>
          <i-tab-pane label="主机">
            <div class="tab-pane-wrap">
              <header class="cds-clearfix cds-margin-top-14 cds-margin-bottom-14">
                <div
                  class="cds-float-left"
                  style="margin-left:1px;">
                  <auto-complete
                    clearable
                    v-model="inputName"
                    placeholder="请输入物理主机名称进行查询"
                    style="width:240px;">
                  </auto-complete>
                  <i-button
                    type="primary"
                    class="cds-btn-search"
                    style="margin-left:15px;"
                    @click="getHostListPageHttp">
                    <i class="iconfont icon-iconfontsousuo"></i>
                  </i-button>
                </div>
                <div class="cds-float-right">
                  <i-button
                    class="cds-btn-refresh"
                    @click="refreshHostListPage">
                    <i class="iconfont icon-shuaxin1"></i>
                  </i-button>
                </div>
              </header>
              <div class="table-warp">
                <h3c-table-radio
                  :on-radio="selectPhysicalHost"
                  :columns="columns"
                  :data="chiocePhysicalHost"
                  :select="{className:'table-warp',name:'table-warp'}"
                  :page="page"
                  :get-table-data="getTableData"
                  :config="tableLoading"
                  :checkeded="physicalHostInfo.name"
                  :back-end-field="'available'">
                </h3c-table-radio>
              </div>
            </div>
          </i-tab-pane>
        </tabs>
        <a @click="jumpRouterToBasePage" class="back-server">返回申请页面</a>
      </div>
    </div>
    <h3c-modal-confirm
      @on-cancel="jumpRouterToBasePage"
      :info="textInfo"
      @on-ok="ok"
      :value="onOff">
    </h3c-modal-confirm>
  </div>
</template>

<script>
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // 引入商城分块组件
import FTree from '@/components/h3c-tree/tree.vue';
import H3cTableRadio from '@/components/h3c-radio-table/H3cRadioTable.vue'; //引入单选表格
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue'; //确认删除弹框
export default {
  name: 'SinglePowerSelectHost',
  components: {
    'h3c-mall': H3cMall, //商城公共组件
    'h3c-tree': FTree,
    'h3c-table-radio': H3cTableRadio, //单选表格组件
    'h3c-modal-confirm': H3cModalConfirm //确认按钮
  },
  props: {
    physicalHostInfo: {
      type: Object,
      required: true
    },
    hostPageInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hostGroup: [
        {
          title: '主机组',
          expand: true,
          disabled: true,
          children: []
        }
      ],
      inputName: '',
      columns: [
        {
          title: '主机名称',
          key: 'display_name',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.display_name
                }
              },
              params.row.display_name
            );
          }
        },
        {
          title: '虚拟机数量',
          key: 'nums',
          align: 'center',
          render(h, params) {
            return h(
              'span',
              (() => {
                let target = params.row.scgs;
                let length = 0;
                for (const key in target) {
                  if (target.hasOwnProperty(key)) {
                    length += target[key].length;
                  }
                }
                return length;
              })()
            );
          }
        },
        {
          title: '处理器',
          key: 'action',
          ellipsis: true,
          render(h, params) {
            return h(
              'span',
              {
                attrs: {
                  title:
                    '已使用' + params.row.proc_units_used + '(总计' + params.row.proc_units + ')'
                }
              },
              '已使用' + params.row.proc_units_used + '(总计' + params.row.proc_units + ')'
            );
          }
        },
        {
          title: '内存',
          key: 'action',
          ellipsis: true,
          render(h, params) {
            return h(
              'span',
              {
                attrs: {
                  title: '已使用' + params.row.memory_mb_used + '(总计' + params.row.memory_mb + ')'
                }
              },
              '已使用' + params.row.memory_mb_used + '(总计' + params.row.memory_mb + ')'
            );
          }
        },
        {
          title: '管理类型',
          key: 'host_type',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.host_type
                }
              },
              params.row.host_type
            );
          }
        }
      ],
      hostOverview: [],
      hostGrounpList: {},
      page: {
        totalCount: 10, //分页当前的总数据数
        currentPage: 1, //当前页码
        pageSize: 10, //每页显示多少条
        totalPage: 1 //总共多少页
      },
      tableLoading: true,
      groupName: '',
      chiocePhysicalHost: [],
      onOff: false,
      textInfo: '',
      row: ''
    };
  },
  methods: {
    /**
     * @function getHostListHttp
     * @description 获取主机组对应主机列表
     * @returns {void}
     */
    getHostListHttp() {
      this.$loading.show();
      this.$http({
        url: 'power/server/list/group/' + this.groupName + '/host/page',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.$loading.hide();
          this.hostOverview = data.data;
        }
      });
    },
    /**
     * @function selectTree
     * @description 选择树形的对应主机组触发的方法
     * @param {Array} value
     * @returns {void}
     */
    selectTree(value) {
      this.hostGrounpList = value[0];
      this.groupName = value[0].name;
      this.getHostListHttp();
      this.getHostListPageHttp();
    },
    /**
     * @function getTableData
     * @descrtiption 可选主机列表分页触发的方法
     * @param {Boolean} loading
     * @param {Number} currentPage
     * @param {Number} pageSize
     * @returns {void}
     */
    getTableData({ loading = false, currentPage = 1, pageSize = 10 } = {}) {
      if (loading) {
        //设置表格缓冲
        this.tableLoading = loading;
        //将表格数据data设置为空数组
        this.hostOverview = [];
      }
      //设置分页每页条数
      this.page.pageSize = pageSize;
      //设置分页当前页
      this.page.currentPage = currentPage;
      //重新请求
      this.getHostListPageHttp();
    },
    /**
     * @function selectPhysicalHost
     * @description 选择物理主机触发的方法
     * @param {Object} row
     * @returns {void}
     */
    selectPhysicalHost({ row }) {
      this.onOff = true;
      this.row = row;
      this.row.groupName = this.groupName;
      this.textInfo = '是否确认选择物理主机 ' + row.display_name + ' ?';
    },
    /**
     * @function getHostListPageHttp
     * @description 获取主机列表的分页数据
     * @returns {void}
     */
    getHostListPageHttp() {
      this.chiocePhysicalHost = [];
      this.tableLoading = true;
      this.$http({
        url: 'power/server/list/group/' + this.groupName + '/host/page',
        method: 'POST',
        data: {
          current: this.page.currentPage,
          orderMap: {},
          pageSize: this.page.pageSize,
          searchMap: {
            name: this.inputName
          }
        }
      }).then(({ data }) => {
        if (data.status) {
          this.chiocePhysicalHost = data.data.records;
          this.tableLoading = false;
          this.page.totalCount = data.data.total;
          this.page.totalPage = data.data.pages;
        } else {
          this.chiocePhysicalHost = [];
          this.tableLoading = true;
        }
      });
    },
    /**
     * @function refreshHostListPage
     * @description 刷新分页的主机列表
     * @returns {void}
     */
    refreshHostListPage() {
      this.page = {
        totalCount: 10, //分页当前的总数据数
        currentPage: 1, //当前页码
        pageSize: 10 //每页显示多少条
      };
      this.inputName = '';
      this.getHostListPageHttp();
    },
    /**
     * @function ok
     * @description 点击确认触发的方法
     * @returns {void}
     */
    ok() {
      if (this.$route.query.id) {
        this.$router.push({
          name: 'resource-directory/power-small-machine/base',
          query: { id: this.$route.query.id, time: new Date().getTime() },
          params: {
            row: this.row,
            pageInfo: { page: this.page.currentPage, pageSize: this.page.pageSize }
          }
        });
      } else {
        this.$router.push({
          name: 'resource-directory/power-small-machine/base',
          query: { time: new Date().getTime() },
          params: {
            row: this.row,
            pageInfo: { page: this.page.currentPage, pageSize: this.page.pageSize }
          }
        });
      }
    },
    /**
     * @function jumpRouterToBasePage
     * @description 跳转到申请页面
     * @returns {void}
     */
    jumpRouterToBasePage() {
      if (this.$route.query.id) {
        this.$router.push({
          name: 'resource-directory/power-small-machine/base',
          query: { id: this.$route.query.id, time: new Date().getTime() }
        });
      } else {
        this.$router.push({
          name: 'resource-directory/power-small-machine/base',
          query: { time: new Date().getTime() }
        });
      }
    }
  },
  created() {
    this.$loading.show();
    this.$http({
      url: 'power/server/list/group/page',
      method: 'GET'
    }).then(({ data }) => {
      this.$loading.hide();
      if (data.status && data.data.length > 0) {
        this.$set(this.hostGroup[0], 'children', data.data);
        this.hostGroup[0].children.forEach(value => {
          this.$set(value, 'title', value.name);
        });
        if (this.physicalHostInfo.groupName === '') {
          this.$set(this.hostGroup[0].children[0], 'selected', true); //默认选中第一项
          this.hostGrounpList = this.hostGroup[0].children[0];
          this.groupName = this.hostGroup[0].children[0].title;
        } else {
          let index = this.hostGroup[0].children.findIndex(
            value => value.title === this.physicalHostInfo.groupName
          );
          this.$set(this.hostGroup[0].children[index], 'selected', true);
          this.hostGrounpList = this.hostGroup[0].children[index];
          this.groupName = this.hostGroup[0].children[index].title;
        }
        this.page.currentPage = this.hostPageInfo.page;
        this.page.pageSize = this.hostPageInfo.pageSize;
        this.getHostListHttp();
        this.getHostListPageHttp();
      }
    });
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.hasOwnProperty('hostId') && from.name) {
      next();
    } else {
      next({
        name: 'resource-directory/power-small-machine/base',
        query: { time: new Date().getTime() }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.physical-host {
  position: relative;
  margin-top: 20px;
  width: 100%;
  height: calc(100vh - 220px);
  background-color: #f5f7f9;
  box-sizing: content-box;
  .physical-host-content {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background: #fff;
    .content-left {
      width: 15%;
      height: 100%;
      padding: 15px;
      background-color: #fff;
      border: 1px solid #d8e0eb;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .content-right {
      width: 84%;
      height: 100%;
      background-color: #fff;
      border: 1px solid #d8e0eb;
      padding: 15px;
    }
  }
  /deep/.ivu-tree ul {
    font-size: 14px !important;
  }
  /deep/.ivu-tabs-nav-container {
    font-size: 15px;
  }
  /deep/.iconfont-radius {
    padding: 0;
    &::before {
      border: none !important;
    }
  }
  /deep/.ivu-tabs-bar {
    padding: 0 !important;
    margin-bottom: 0;
  }
  /deep/.ivu-tabs {
    height: 100%;
  }
  /deep/.ivu-tabs .ivu-tabs-tabpane {
    height: 100%;
  }
  /deep/.ivu-tabs .ivu-tabs-tabpane .tab-pane-wrap {
    height: 95%;
  }
  /deep/.ivu-tabs .ivu-tabs-content-animated {
    height: 100%;
  }
}
.host-charts {
  height: 180px;
}
.charts-left {
  width: 40%;
  padding: 20px;
}
.charts-right {
  width: 60%;
  display: flex;
  justify-content: space-between;
}
.host-charts > div {
  position: relative;
}
.host-charts {
  /deep/.ivu-chart-circle {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
  p {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
  }
}
.charts-right div {
  width: 23%;
  height: 100%;
  overflow: hidden;
}
.charts-right div ul {
  width: 100%;
  height: 100%;
  font-size: 13px;
  border: 1px solid #eeeeee;
  overflow: auto;
}
.charts-right div::after {
  position: absolute;
  content: '';
  width: 8px;
  height: 20px;
  top: 0;
  left: 0;
}
.charts-right div:nth-of-type(1)::after {
  background-color: #00cc65;
}
.charts-right div:nth-of-type(2)::after {
  background-color: #ff9900;
}
.charts-right div:nth-of-type(3)::after {
  background-color: #889fe3;
}
.charts-right div:nth-of-type(4)::after {
  background-color: #0c8cef;
}
.charts-right div ul li {
  width: 100%;
  box-sizing: border-box;
  padding: 2px 0 2px 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.charts-right div ul li i::before {
  font-size: 20px !important;
  vertical-align: middle;
}
.charts-right div ul li span {
  vertical-align: middle;
  margin-left: 5px;
}
.tab-pane-wrap {
  width: 100%;
  overflow-y: auto;
  padding-bottom: 14px;
}
.groupHost {
  width: 100%;
  height: auto;
  border: 1px solid #d8e0eb;
}
.groupHost li {
  width: 100%;
  height: 35px;
  font-size: 13px;
  letter-spacing: 1px;
}
.groupHost li p {
  width: 15%;
  height: 100%;
  text-align: right;
  line-height: 35px;
}
.groupHost li div {
  width: 85%;
  height: 100%;
  line-height: 35px;
  padding-left: 15px;
}
.groupHost li:nth-of-type(2n + 1) {
  background-color: #f6f7f9;
}
.page-wrapper {
  margin-top: 15px;
}
.back-server {
  position: absolute;
  top: 20px;
  right: 15px;
}
</style>
