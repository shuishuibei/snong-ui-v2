<!--
 * @Description: power虚拟机基本信息
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:19:55
 -->
<template>
  <div class="powerhost-baseinfo-container">
    <div class="disk-base-info-left">
      <div class="disk-base-info one-wrapper">
        <i-row :gutter="16" class="virtual-detail-row">
          <i-col :lg="24" :md="24" class="virtual-detail-left">
            <div class="base-info">
              <h3c-title title="基本信息" :style-set="{'border-bottom': '1px solid #d5d8db'}" :is-modal="true"></h3c-title>
            </div>
            <div class="lease-info">
              <ul class="lease-info-list info-list">
                <li>
                  <div class="lease-info-list-left">名称 :</div>
                  <div class="lease-info-list-right" :title="datas.name">{{datas.name}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">状态 :</div>
                  <div class="lease-info-list-right">
                    <div class="cds-status-dot" :style="{backgroundColor: colorBc}"></div>
                    <span :style="{color: colorBc}">{{statusText}}</span>
                  </div>
                </li>
                <li>
                  <div class="lease-info-list-left">运行状态 :</div>
                  <div class="lease-info-list-right">{{stateText}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">UUID :</div>
                  <div class="lease-info-list-right" :title="datas.id">{{datas.id}}</div>
                </li>
                <li id="pwd">
                  <div class="lease-info-list-left">初始密码 :</div>
                  <div class="lease-info-list-right password-top" v-if="passwordType">{{datas.password}}</div>
                  <div class="lease-info-list-right password-top" v-else>
                    <div v-if="!showPwd" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                      {{datas.password}}
                    </div>
                    <div v-if="showPwd" style="height:100%">
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                    </div>
                    <div @click="showPwd = !showPwd" style="cursor: pointer;margin-left: 5px">
                      <i class="iconfont icon-xianshikejian" v-if="!showPwd"></i>
                      <i class="iconfont icon-yincangbukejian" v-if="showPwd"></i>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="lease-info-list-left">镜像 :</div>
                  <div class="lease-info-list-right">{{datas.imageName}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">CPU核数 :</div>
                  <div class="lease-info-list-right">{{datas.cpu}}&nbsp;核</div>
                </li>
                <li>
                  <div class="lease-info-list-left">内存 :</div>
                  <div class="lease-info-list-right">{{datas.memroy}}&nbsp;G</div>
                </li>
                <li>
                  <div class="lease-info-list-left">系统盘 :</div>
                  <div class="lease-info-list-right">{{datas.storage}}&nbsp;GB</div>
                </li>
                <li>
                  <div class="lease-info-list-left">所有者 :</div>
                  <div class="lease-info-list-right">{{datas.userName}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">所属主机 :</div>
                  <div class="lease-info-list-right">{{datas.hostName}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">描述 :</div>
                  <div class="lease-info-list-right" :title="datas.description">{{datas.description}}</div>
                </li>
              </ul>
            </div>
          </i-col>
        </i-row>
      </div>
    </div>

    <div class="disk-base-info-right">
      <div class="disk-detail-right-tab">
        <i-tabs :animated="false">
          <i-tab-pane label="硬件配置">
            <div class="base-info">
            </div>
            <!--表格-->
            <div class="hard-config">
              <div class="network-card">
                <div class="hard-config-header cds-clearfix">
                  <h3c-title title="网卡" class="cds-float-left" :style-set="{'border-bottom': 'none'}">
                    <template #other>
                      <i-button class="cds-btn-refresh cds-float-right" type="primary" @click="handleRefresh">
                        <i class="iconfont icon-shuaxin1"></i>
                      </i-button>
                    </template>
                  </h3c-title>
                </div>
                <div class="network-card-table-page">
                  <div class="network-card-table">
                    <i-table
                      highlight-row
                      size="small"
                      :loading="loadingNet"
                      :key="tableNetKey"
                      stripe
                      :columns="titleNetList"
                      :data="dataNetArray">
                    </i-table>
                  </div>
                  <div class="network-card-page page-container">
                    <div class="page-left">
                      共有{{pageNet.totalCount}}条记录，当前页{{pageNet.currentPage}}/{{pageNet.totalPage}}页
                    </div>
                    <div class="page-right">
                      <i-page
                        size="small"
                        :total="pageNet.totalCount"
                        :current="pageNet.currentPage"
                        :page-size="pageNet.pageSize"
                        show-sizer
                        placement="top"
                        :page-size-opts="[5, 10, 20]"
                        @on-change="pageNetChange"
                        @on-page-size-change="pageNetSizeChange"></i-page>
                    </div>
                  </div>
                </div>
              </div>

              <div class="disk">
                <div class="hard-config-header cds-clearfix">
                  <h3c-title title="硬盘" class="cds-float-left" :style-set="{'border-bottom': 'none'}">
                    <template #other>
                      <i-button class="cds-btn-refresh cds-float-right" type="primary" @click="handleDiskRefresh">
                        <i class="iconfont icon-shuaxin1"></i>
                      </i-button>
                    </template>
                  </h3c-title>
                </div>
                <div class="disk-table-page">
                  <div class="network-card-table">
                    <i-table
                      highlight-row
                      size="small"
                      :loading="loading"
                      :key="tableKey"
                      stripe
                      :columns="titleList"
                      :data="dataArray">
                    </i-table>
                  </div>
                  <div class="disk-page page-container">
                    <div class="page-left">
                      共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页
                    </div>
                    <div class="page-right">
                      <i-page
                        size="small"
                        :total="page.totalCount"
                        :page-size-opts="[5, 10, 20]"
                        :current="page.currentPage"
                        :page-size="page.pageSize"
                        show-sizer
                        placement="top"
                        @on-change="pageChange"
                        @on-page-size-change="pageSizeChange"></i-page>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </i-tab-pane>
        </i-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { powerHostStatus } from '@/assets/js/status/index.js';
import { powerDisk, moveState } from '@/assets/js/status/index.js';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';

export default {
  name: 'BaseInfoPowerHost',
  components: {
    'h3c-title': H3cTitle
  },
  computed: {
    hostId() {
      return this.$route.params.id;
    }
  },
  data() {
    return {
      showPwd: true, // 是否显示明文密码
      passwordType: false, // true代表镜像密码，false代表非镜像密码
      statusText: '',
      stateText: '',
      colorBc: '',
      loading: false,
      loadingNet: false,
      tableKey: 0,
      tableNetKey: 0,
      typeName: {
        thick: '厚配置',
        thin: '精简配置',
        common: '通用卷',
        compression: '精简配置'
      },
      /* 硬盘分页 */
      page: {
        pageSize: 5, // 每页条数
        totalCount: 0, // 总数
        totalPage: 1, // 总页数
        currentPage: 1 // 当前页码
      },
      /* 网络分页 */
      pageNet: {
        pageSize: 5, // 每页条数
        totalCount: 0, // 总数
        totalPage: 1, // 总页数
        currentPage: 1 // 当前页码
      },
      /* 硬盘信息 */
      titleList: [
        {
          title: '硬盘名称',
          key: 'name',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.name
                }
              },
              params.row.name
            );
          }
        },
        {
          title: '状态',
          key: 'status',
          filterMultiple: false,
          filters: powerDisk,
          filterRemote: filters => {
            this.page.currentPage = 1;
            this.filterStatusRemote(filters, 'status'); // 远程筛选
          },
          render: (h, params) => {
            let status = params.row.status.toLocaleLowerCase(),
              node = powerDisk.filter(item => {
                return item.value === status;
              })[0];
            return h(
              'span',
              {
                style: {
                  color: node.color
                }
              },
              [
                h('div', {
                  class: 'cds-status-dot',
                  style: {
                    background: node.color
                  }
                }),
                h('span', node.label)
              ]
            );
          }
        },
        {
          title: '运行状态',
          key: 'state',
          ellipsis: true,
          render: (h, params) => {
            let state = params.row.state,
              node = moveState.filter(item => {
                return item.value === state;
              })[0];
            return h('span', {}, node.label);
          }
        },
        {
          title: '容量(GB)',
          key: 'size'
        },
        {
          title: '类型',
          render: (h, params) => {
            let typeCopy = this.typeName[params.row.type];
            return h('span', typeCopy);
          }
        },
        {
          title: '共享',
          key: 'multiattach',
          render: (h, params) => {
            return h('span', params.row.multiattach ? '是' : '否');
          }
        }
      ],
      dataArray: [],

      /* 网卡信息 */
      titleNetList: [
        {
          title: '网络名称',
          key: 'networkName',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.networkName
                }
              },
              params.row.networkName
            );
          }
        },
        {
          title: 'ip地址',
          key: 'ip',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.ip
                }
              },
              params.row.ip
            );
          }
        },
        {
          title: 'ip地址类型',
          key: 'adapterType'
        },
        {
          title: 'mac地址',
          key: 'mac'
        }
      ],
      dataNetArray: [],
      datas: {},
      orderMap: {},
      hostFilter: {
        status: ''
      }
    };
  },
  created() {
    this._getBaseData();
    this._getDiskData();
    this._getNetcardData();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'power-host/index') {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  },
  methods: {
    filterStatusRemote(filters, key) {
      this.hostFilter[key] = filters[0];
      this._getDiskData();
    },
    setPage(data) {
      this.page.totalCount = data.total;
      this.page.totalPage = data.pages ? data.pages : 1;
      this.page.currentPage = data.current;
      this.page.pageSize = data.size;
    },
    setNetPage(data) {
      this.pageNet.totalCount = data.total;
      this.pageNet.totalPage = data.pages ? data.pages : 1;
      this.pageNet.currentPage = data.current;
      this.pageNet.pageSize = data.size;
    },
    /**
     * @description: 从状态数组中获取某个状态的信息
     * @param {string} key:状态英文
     * @param {Array} arr:status.js中的状态数组
     */
    getStatusInfo(status, arr) {
      return arr.filter(function(item) {
        return item.value === status;
      });
    },
    pageChange(page) {
      this.page.currentPage = page;
      this._getDiskData();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this._getDiskData();
    },
    pageNetChange(page) {
      this.pageNet.currentPage = page;
      this._getNetcardData();
    },
    pageNetSizeChange(size) {
      this.pageNet.pageSize = size;
      this.pageNet.currentPage = 1;
      this._getNetcardData();
    },
    /**
     * @description: 获取网卡信息
     */
    _getNetcardData() {
      this.loadingNet = true;
      this.$http
        .post('power/server/detail/' + this.hostId + '/port/page', {
          searchMap: {},
          current: this.pageNet.currentPage, // 当前页
          pageSize: this.pageNet.pageSize // 每页条数
        })
        .then(({ data }) => {
          if (data.data) {
            if (data.data.records) {
              this.dataNetArray = data.data.records;
            }
            this.setNetPage(data.data);
          }
        });
      this.loadingNet = false;
    },
    /**
     * @description: 获取硬盘信息
     */
    _getDiskData() {
      this.loading = true;
      this.$http
        .post('power/server/detail/' + this.hostId + '/volume/page', {
          searchMap: Object.assign(this.hostFilter),
          current: this.page.currentPage, // 当前页
          pageSize: this.page.pageSize // 每页条数
        })
        .then(({ data }) => {
          if (data.data) {
            if (data.data.records) {
              this.dataArray = data.data.records;
            }

            this.setPage(data.data);
          }
        });
      this.loading = false;
    },
    _getBaseData() {
      this.$http.get('power/server/detail/' + this.hostId).then(({ data }) => {
        if (data.data) {
          this.datas = data.data;
          let statusArr = this.getStatusInfo(this.datas.status.toLowerCase(), powerHostStatus);
          if (statusArr.length > 0) {
            this.statusText = statusArr[0].label;
            this.colorBc = statusArr[0].color;
          } else {
            this.statusText = '未知状态';
            this.colorBc = '#ffa904';
          }

          let stateArr = this.getStatusInfo(this.datas.state, moveState);
          if (stateArr.length > 0) {
            this.stateText = stateArr[0].label;
          } else {
            this.stateText = '未知运行状态';
          }
        }
      });
    },
    handleRefresh() {
      this.tableNetKey = new Date().toString();
      this.dataNetArray = [];
      this._getNetcardData();
    },
    /**
     * @description: 刷新硬盘
     */
    handleDiskRefresh() {
      this.tableKey = new Date().toString();
      this.dataArray = [];
      this.hostFilter = {};
      this._getDiskData();
    }
  }
};
</script>

<style lang="less" scoped>
.disk {
  .disk-table-page {
    position: relative;
    margin-bottom: 15px;
  }
}

#pwd {
  .password-top > div {
    float: left;
  }

  .password-top:after {
    content: '';
    display: block;
    clear: both;
  }

  .black-ball {
    position: relative;
    top: 40%;
    float: left;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #666;
    margin: 0 1px;
  }

  .icon-xianshikejian {
    color: #3399ff;
    font-size: 1rem;
  }

  .icon-yincangbukejian {
    color: #808695;
    font-size: 1rem;
  }
}

@titleHeight: 24px;

.powerhost-baseinfo-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 800px;
  min-height: 600px;
  background: #f1f1f1;

  .disk-base-info-left {
    width: 32%;
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    border: 1px solid #d8e0eb;
    background: #fff;
    flex-direction: column;

    .disk-base-info {
      background: #fff;
      padding: 5px 10px;

      &.second-wrapper {
        margin-top: 10px;
      }

      .virtual-detail-row {
        width: 100%;

        .virtual-detail-left {
          width: 100%;
          margin-left: 8px;
        }

        .base-info {
          background-color: #fff;
          padding: 0;
        }

        .lease-info {
          background-color: #fff;
          height: calc(~'100% - 464px');
          min-height: 146px;
        }

        .info-list {
          list-style-type: none;
          margin-top: 10px;
          font-size: 12px;
          color: #666;

          &.base-info-list {
            @listInfoLeftWidth: 100px;

            .base-info-list-left {
              float: left;
              width: @listInfoLeftWidth;
              text-align: right;
              padding-right: 6px;
            }

            .base-info-list-right {
              float: left;
              width: calc(~'100% - @{listInfoLeftWidth}');
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          &.lease-info-list {
            .lease-info-list-left {
              float: left;
              width: 100px;
              text-align: right;
              padding-right: 6px;
            }

            .lease-info-list-right {
              float: left;
              text-align: left;
            }
          }
          li {
            height: 30px;
            line-height: 30px;
            width: 100%;
            padding-left: 10px;

            & > div {
              height: 30px;
              width: calc(~'100% - 106px');
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }

            &:nth-child(2n + 1) {
              background-color: #f5f8fd;
            }

            &:after {
              content: '';
              display: block;
              clear: both;
            }
          }
        }
      }
    }
  }

  .disk-base-info-right {
    width: calc(~'68% - 12px');
    background: #fff;
    border: 1px solid #d5d8db;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 5px 20px 15px 20px;
    overflow: auto;

    .disk-detail-right-tab {
      height: 100%;
      background-color: #fff;
      border-top: none;

      .hard-config {
        height: 100%;

        .hard-config-header {
          margin-bottom: 10px;
        }

        .page-container {
          margin-top: 10px;

          .page-left {
            float: left;
          }

          .page-right {
            float: right;
            .ivu-page-options-sizer {
              margin-right: 0;
            }
          }

          &:after {
            content: '';
            display: block;
            clear: both;
          }
        }

        .network-card {
          height: 50%;
        }

        .disk {
          margin-top: 10px;
          height: calc(~'50% - 10px');

          .disk-table-page {
            position: relative;
          }
        }
      }
    }
  }
}
</style>
