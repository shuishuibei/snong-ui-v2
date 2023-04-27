<!--
 * @Description: 资源池详情
 * @Author: ys2234
 * @Date: 2019-09-12 09:14:09
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-13 15:38:24
 -->
<template>
  <div class="resource-pool-manage-detail cds-padding-14 cds-border cds-scroll-wrap">
    <div class="cds-scroll-content">
      <h3c-title title="资源池详情"></h3c-title>
      <h3c-mall class-name="icon-xinxi" title="基本信息" style-set="#55ce5b">
        <i-row slot="mallContent">
          <i-col :lg="8" v-for="item in basicInfo" :key="item.value">
            <span class="item-label module-item">{{item.label}}：</span>
            <span>{{node[item.value]}}</span>
          </i-col>
        </i-row>
      </h3c-mall>
      <h3c-mall class-name="icon-yumingguanli" title="可用域" style-set="#ffa904">
        <i-row slot="mallContent">
          <i-col :lg="8" v-for="item in azoneList" :key="item.value">
            <span class="item-label module-item">{{item.resourceType}}：</span>
            <span>{{item.labelName}}（{{item.virtType}}）</span>
          </i-col>
        </i-row>
      </h3c-mall>
      <template v-if="!!node.quota">
        <h3c-mall
          v-for="(item, index) in quota"
          :key="index"
          :class-name="item.icon"
          :title="item.label"
          :style-set="item.color">
          <i-row slot="mallContent">
            <i-col :xs="12" :lg="8" v-for="type in item.children" :key="type.value">
              <span class="item-label module-item">{{type.label}}：</span>
              <span>{{node.quota[type.value]}}</span>
            </i-col>
          </i-row>
        </h3c-mall>
      </template>
      <div class="cds-fixed-footer" style="border: 1px solid #d8e0eb;">
        <div class="cds-fixed-footer-right">
          <i-button type="primary" @click="close">关 闭</i-button>
        </div>
      </div>
    </div>
    <i-spin
      fix
      size="large"
      v-if="isSpinShow">
    </i-spin>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入标题组件
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // 引入商城分块组件;

export default {
  name: 'ResourcePoolManageDetail',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'h3c-title': H3cTitle,
    'h3c-mall': H3cMall
  },
  data() {
    return {
      node: {}, // 当前资源池数据
      basicInfo: [
        {
          label: '名称',
          value: 'name'
        },
        {
          label: '联系人',
          value: 'linkman'
        },
        {
          label: '电话号码',
          value: 'telephone'
        },
        {
          label: '地址',
          value: 'address'
        },
        {
          label: '备注',
          value: 'description'
        }
      ],
      /**
       * 此处value取最大值：资源池在新建时分配的配额就是该资源池配额的最大值
       */
      quota: [
        {
          label: '计算配额',
          icon: 'icon-06',
          color: '#9cb1e7',
          children: [
            {
              label: 'CPU数量（核）',
              value: 'maxTotalCores'
            },
            {
              label: '云主机数量（个）',
              value: 'maxTotalInstances'
            },
            {
              label: '内存容量（GB）',
              value: 'maxTotalRAMSize'
            }
          ]
        },
        {
          label: '存储配额',
          icon: 'icon-yuncunchu',
          color: '#27b9f9',
          children: [
            {
              label: '存储总容量（GB）',
              value: 'maxTotalVolumeGigabytes'
            },
            {
              label: '快照数量（个）',
              value: 'maxTotalSnapshots'
            },
            {
              label: '云硬盘数量（个）',
              value: 'maxTotalVolumes'
            }
          ]
        },
        {
          label: '网络配额',
          icon: 'icon-wangluo',
          color: '#ff6600',
          children: [
            {
              label: '路由器数量（个）',
              value: 'maxRouters'
            },
            {
              label: '防火墙数量（个）',
              value: 'maxFirewalls'
            },
            {
              label: '网络数量（个）',
              value: 'maxNetworks'
            },
            {
              label: '负载均衡数量（个）',
              value: 'maxLoadbalancers'
            },
            {
              label: '公网IP数量（个）',
              value: 'maxTotalFloatingIps'
            },
            {
              label: '网卡数量（个）',
              value: 'maxVnic'
            },
            {
              label: '子网数量（个）',
              value: 'maxSubnets'
            }
          ]
        }
      ],
      azoneList: [],
      isSpinShow: false
    };
  },
  methods: {
    /**
     * @function 获取资源池详情数据
     * @param {string} id  - 当前资源池ID
     */
    getPoolData(id) {
      this.isSpinShow = true;
      this.$http
        .get(`quota/pool/${id}`)
        .then(({ data }) => {
          this.isSpinShow = false;
          if (data.status) {
            this.node = data.data;
            this.node.azoneList.map(item => {
              item.resourceType = item.resourceType
                .replace('cinder', '存储')
                .replace('nova', '计算');
            });
            this.azoneList = this.node.azoneList;
          }
        })
        .catch(() => {
          this.isSpinShow = false;
        });
    },
    close() {
      this.$router.push({
        name: 'resource-pool-manage/index'
      });
    }
  },
  created() {
    this.getPoolData(this.$route.query.id);
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'resource-pool-manage/index') {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  }
};
</script>

<style scoped lang="less">
.resource-pool-manage-detail {
  padding-bottom: 70px;
  .inner-box {
    .module-item {
      line-height: 30px;
    }
    .item-label {
      display: inline-block;
      width: 140px;
      text-align: right;
    }
  }
}
</style>
