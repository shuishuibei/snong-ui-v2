<!--
 * @Description: power硬盘基本信息
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:17:38
 -->
<template>
  <div class="cds-wrapper-container">
    <div class="cds-wrapper-div-left">
      <div class="cds-wrapper-div one-wrapper">
        <i-row :gutter="16" class="virtual-detail-row">
          <i-col :lg="24" :md="24" class="virtual-detail-left">
            <div class="base-info">
              <h3c-title title="基本信息" :style-set="{'border-bottom': '1px solid #d5d8db'}" :is-modal="true"></h3c-title>
            </div>
            <div class="lease-info">
              <ul class="lease-info-list info-list">
                <li>
                  <div class="lease-info-list-left">名称 :</div>
                  <div class="lease-info-list-right" :title="baseData.name">{{baseData.name}}</div>
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
                  <div class="lease-info-list-right" :title="baseData.id">{{baseData.id}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">容量 :</div>
                  <div class="lease-info-list-right">{{baseData.size}}&nbsp;GB</div>
                </li>
                <li>
                  <div class="lease-info-list-left">类型 :</div>
                  <div class="lease-info-list-right">{{this.getType(baseData.type)}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">存储器名称 :</div>
                  <div class="lease-info-list-right" :title="baseData.hostName">{{baseData.hostName}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">存储模板名称 :</div>
                  <div class="lease-info-list-right" :title="baseData.volumeTypeName">{{baseData.volumeTypeName}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">是否为引导硬盘 :</div>
                  <div class="lease-info-list-right">
                    {{baseData.bootVolume? "是":"否"}}
                  </div>
                </li>
                <li>
                  <div class="lease-info-list-left">是否为镜像硬盘 :</div>
                  <div class="lease-info-list-right">
                    {{baseData.imageVolume? "是":"否"}}
                  </div>
                </li>
                <li>
                  <div class="lease-info-list-left">是否支持共享 :</div>
                  <div class="lease-info-list-right">
                    {{baseData.multiattach? "是":"否"}}
                  </div>
                </li>
              </ul>
            </div>
          </i-col>
        </i-row>
      </div>
    </div>
    <div class="disk-wrapper-right">
      <div class="base-info">
        <h3c-title title="主机列表"></h3c-title>
      </div>
      <div class="base-power-disk-btn cds-clearfix">
        <div class="cds-float-right">
          <i-button class="cds-btn-refresh" @click="handleRefresh">
            <i class="iconfont icon-shuaxin1"></i>
          </i-button>
        </div>
      </div>
      <!-- 表格 -->
      <i-table
        stripe
        highlight-row
        size="small"
        :key="tableKey"
        :loading="loading"
        :columns="titleList"
        :data="datas"></i-table>
    </div>
  </div>
</template>
<script>
import { powerDisk, moveState } from '@/assets/js/status/index.js';
import { powerHostStatus } from '@/assets/js/status/index.js';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';

export default {
  name: 'BaseInfoPowerDisk',
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
      colorBc: '',
      statusText: '',
      stateText: '',
      loading: false,
      tableKey: 0,
      titleList: [
        {
          title: '虚拟机名称',
          key: 'name',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
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
          render: (h, params) => {
            let status = params.row.status.toLocaleLowerCase();
            let node = powerHostStatus.filter(item => {
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
          title: '所有者',
          key: '',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.userName
                }
              },
              params.row.userName
            );
          }
        },
        {
          title: 'IP地址',
          key: '',
          render: (h, params) => {
            let ipAddressArr = [];
            ipAddressArr = params.row.ipAddress;
            let ipAddressStr = '';
            ipAddressArr.forEach((item, index) => {
              ipAddressStr = ipAddressStr + item + '/';
            });

            ipAddressStr = ipAddressStr.slice(0, ipAddressStr.length - 1);
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: ipAddressStr
                }
              },
              ipAddressStr
            );
          }
        }
      ],
      datas: [],
      baseData: {},
      typeName: {
        thick: '厚配置',
        thin: '精简配置',
        common: '通用卷',
        compression: '精简配置'
      }
    };
  },
  created() {
    this._getData();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'power-disk/index') {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  },
  methods: {
    getType(type) {
      return this.typeName[type];
    },
    getStatusInfo(status, arr) {
      return arr.filter(function(item) {
        return item.value === status;
      });
    },
    _getData() {
      this.loading = true;
      this.$http.get('power/volume/' + this.hostId).then(({ data }) => {
        if (data.data) {
          this.baseData = data.data;
          this.datas = data.data.mount;

          let statusArr = this.getStatusInfo(this.baseData.status.toLocaleLowerCase(), powerDisk);
          if (statusArr.length > 0) {
            this.statusText = statusArr[0].label;
            this.colorBc = statusArr[0].color;
          } else {
            this.statusText = '未知状态';
            this.colorBc = '#ffa904';
          }

          let stateArr = this.getStatusInfo(this.baseData.state, moveState);
          if (stateArr.length > 0) {
            this.stateText = stateArr[0].label;
          } else {
            this.stateText = '未知运行状态';
          }
        }
        this.loading = false;
      });
    },
    handleRefresh() {
      this.datas = [];
      this._getData();
    }
  }
};
</script>
<style lang="less" scoped>
@titleHeight: 24px;

.cds-wrapper-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 800px;
  min-height: 600px;
  background: #f1f1f1;

  .cds-wrapper-div-left {
    display: flex;
    width: 32%;
    position: absolute;
    top: 0;
    bottom: 0;
    flex-direction: column;

    .cds-wrapper-div {
      border: 1px solid #d8e0eb;
      background: #fff;
      padding: 5px 10px;
      height: 100%;

      &.one-wrapper {
        min-height: 410px;
      }

      &.second-wrapper {
        margin-top: 10px;
        height: 45%;
        flex-grow: 1;
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

  .disk-wrapper-right {
    width: calc(~'68% - 12px');
    background: #fff;
    border: 1px solid #d5d8db;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 5px 20px 15px 20px;
    overflow: auto;

    .base-info {
      background-color: #fff;
      padding: 0;

      .title-line {
        position: relative;
        padding-left: 8px;
        padding-bottom: 6px;
        height: @titleHeight + 6px;
        line-height: @titleHeight + 6px;
        border-bottom: 1px solid #d5d8db;
      }
    }

    .base-power-disk-btn {
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
}
</style>
