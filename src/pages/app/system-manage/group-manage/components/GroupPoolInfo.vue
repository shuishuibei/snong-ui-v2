<!--
 * @Description: 组织详情（资源池关）
 * @Author: ys2234
 * @Date: 2019-09-07 14:30:34
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-09 13:32:43
 -->
<template>
  <div class="group-pool-info">
    <h3c-mall class-name="icon-xinxi" title="基本信息" style-set="#55ce5b" style="padding-right: 60px;">
      <template #mallContent>
        <i-row>
          <i-col span="8" v-for="(item, index) in basic" :key="index" class="sup-col">
            <i-col class="sub-col-left" span="12">{{item.label}}：</i-col>
            <i-col span="12">{{data[item.value]}}</i-col>
          </i-col>
        </i-row>
      </template>
    </h3c-mall>
    <h3c-mall class-name="icon-yumingguanli" title="可用域" style-set="#ffa904">
      <template #mallContent>
        <i-row>
          <i-col span="8" v-for="item in data.azoneList" :key="item.id" class="sup-col">
            <i-col class="sub-col-left" span="12">{{item.resourceType}}：</i-col>
            <i-col class="sub-col-right" span="12" :title="`${item.labelName}（${item.virtType}）`">{{item.labelName}}（{{item.virtType}}）</i-col>
          </i-col>
        </i-row>
      </template>
    </h3c-mall>
    <h3c-mall
      v-for="(item, index) in quota"
      :key="index"
      :class-name="item.icon"
      :title="item.label"
      :style-set="item.color">
      <template #mallContent>
        <i-row>
          <i-col span="8" v-for="type in item.children" :key="type.value" class="sup-col">
            <i-col class="sub-col-left" span="12">{{type.label}}：</i-col>
            <i-col span="12" v-if="data.quota">{{data.quota[type.value]}}</i-col>
          </i-col>
        </i-row>
      </template>
    </h3c-mall>
  </div>
</template>

<script>
import H3cMall from '@/components/h3c-mall/H3cMall.vue';
export default {
  name: 'GroupPoolInfo',
  props: {
    data: {
      type: Object
    }
  },
  components: {
    'h3c-mall': H3cMall
  },
  data() {
    return {
      basic: [
        {
          label: '组织名称',
          value: 'name'
        },
        {
          label: '联系人',
          value: 'telephone'
        },
        {
          label: '电话号码',
          value: 'address'
        },
        {
          label: '地址',
          value: 'description'
        },
        {
          label: '备注',
          value: 'description'
        }
      ],
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
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.group-pool-info {
  margin: 15px;
  .sup-col {
    height: 30px;
    line-height: 30px;
    .sub-col-left {
      text-align: right;
    }
    .sub-col-right {
      white-space: nowrap;
      text-overflow:ellipsis;
      overflow:hidden;
    }
  }
}
</style>