<!--
 * @Description: 裸金属基本信息
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:17:07
 -->
<template>
  <div class="cds-wrapper-container">
    <div class="bare-info-wrapper-left">
      <div class="bare-info-wrapper-con one-wrapper">
        <i-row :gutter="16" class="bare-detail-row">
          <i-col :lg="24" :md="24" class="bare-detail-row-left">
            <div class="base-info">
              <h3c-title title="基本信息" :style-set="{'border-bottom': '1px solid #d5d8db'}" :is-modal="true"></h3c-title>
            </div>
            <div class="lease-info">
              <ul class="lease-info-list info-list">
                <li>
                  <div class="lease-info-list-left">名称 :</div>
                  <div class="lease-info-list-right" :title="baseData.bareMetalName">
                    {{baseData.bareMetalName}}
                  </div>
                </li>
                <li>
                  <div class="lease-info-list-left">状态 :</div>
                  <div class="lease-info-list-right">
                    <div class="statusCircle" :style="{backgroundColor: colorBc}"></div>
                    <span :style="{color: colorBc}">{{statusText}}</span>
                  </div>
                </li>
                <li>
                  <div class="lease-info-list-left">镜像 :</div>
                  <div class="lease-info-list-right" :title="baseData.image">{{baseData.image}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">规格 :</div>
                  <div class="lease-info-list-right" :title="baseData.flavor">{{baseData.flavor}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">虚拟化类型 :</div>
                  <div class="lease-info-list-right">{{baseData.virType}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">资源区域 :</div>
                  <div class="lease-info-list-right" :title="baseData.zoneName">{{baseData.zoneName}}</div>
                </li>
                <li>
                  <div class="lease-info-list-left">初始密码 :</div>
                  <div class="lease-info-list-right">
                    <div v-if="!showPwd"
                      style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;vertical-align: middle;">
                      {{baseData.password}}
                    </div>
                    <div v-if="showPwd"
                      style="height:100%;display: inline-block;vertical-align: middle;">
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                      <div class="black-ball"></div>
                    </div>
                    <div @click="showPwd = !showPwd"
                      style="cursor: pointer;margin-left: 5px;display: inline-block;vertical-align: middle;">
                      <i class="iconfont icon-xianshikejian" v-if="!showPwd"></i>
                      <i class="iconfont icon-yincangbukejian" v-if="showPwd"></i>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="lease-info-list-left">描述 :</div>
                  <div class="lease-info-list-right" :title="baseData.description">
                    {{baseData.description}}
                  </div>
                </li>
              </ul>
            </div>
          </i-col>
        </i-row>
      </div>
    </div>
    <div class="bare-info-wrapper-right">
      <div class="base-info">
        <h3c-title title="硬件配置"></h3c-title>
      </div>
      <!-- 表格 -->
      <i-table
        stripe
        highlight-row
        style="margin-top: 20px"
        size="small"
        :loading="loading"
        :columns="titleList"
        :data="datas"></i-table>
    </div>
  </div>
</template>

<script>
import { bareStatus } from '@/assets/js/status/index.js';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';

export default {
  name: 'BaseInfoBareMetal',
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
      loading: false,
      showPwd: true, // 是否显示密码
      titleList: [
        {
          title: '私网IP地址',
          key: 'addr',
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
                  title: params.row.ip
                }
              },
              params.row.ip
            );
          }
        },
        {
          title: '网络',
          key: 'networkName',
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
                  title: params.row.networkName
                }
              },
              params.row.networkName
            );
          }
        },
        {
          title: 'Mac',
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
                  title: params.row.mac
                }
              },
              params.row.mac
            );
          }
        }
      ],
      datas: [],
      baseData: {}
    };
  },
  created() {
    this._getData();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'bare-metal/index') {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  },
  methods: {
    /**
     * @description:
     * @param {string} key: 状态英文
     * @param {Array} arr: status.js中的状态数组
     */
    getStatusInfo(status, arr) {
      return arr.filter(function(item) {
        return item.value === status;
      });
    },
    _getData() {
      this.loading = true;
      this.$http.get('bareMetal/bareMetalDetailById/' + this.hostId).then(({ data }) => {
        if (data.status) {
          if (data.data !== null) {
            // 做数据处理
            this.baseData = data.data;
          } else {
            this.baseData = [];
          }
          this.datas = data.data.addressInfo ? data.data.addressInfo : [];
          let statusArr = this.getStatusInfo(this.baseData.state, bareStatus);
          if (statusArr.length > 0) {
            this.statusText = statusArr[0].label;
            this.colorBc = statusArr[0].color;
          } else {
            this.statusText = '未知状态';
            this.colorBc = '#ffa904';
          }
        }
        this.loading = false;
      });
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

  .bare-info-wrapper-left {
    display: flex;
    width: 32%;
    position: absolute;
    top: 0;
    bottom: 0;
    flex-direction: column;

    .bare-info-wrapper-con {
      border: 1px solid #d8e0eb;
      background: #fff;
      padding: 5px 10px;

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

      &.one-wrapper {
        height: 100%;
        min-height: 410px;
      }

      &.second-wrapper {
        margin-top: 10px;
        height: 45%;
        flex-grow: 1;
      }

      .bare-detail-row {
        width: 100%;

        .bare-detail-row-left {
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

        .title-line {
          position: relative;
          padding-left: 8px;
          padding-bottom: 6px;
          height: @titleHeight + 6px;
          line-height: @titleHeight + 6px;
          border-bottom: 1px solid #d5d8db;

          &:before {
            position: absolute;
            background-color: #ff0042;
            content: '';
            width: 3px;
            height: 18px;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
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

  .bare-info-wrapper-right {
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

        &:before {
          position: absolute;
          background-color: #ff0042;
          content: '';
          width: 3px;
          height: 18px;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        & > a {
          position: absolute;
          right: 0;
        }
      }
    }
  }
}
</style>
