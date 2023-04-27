<!--
 * @Description: 组织编辑（资源池关）
 * @Author: ys2234
 * @Date: 2019-09-12 09:14:09
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:26:51
 -->
<template>
  <div class="group-pool-edit cds-wrapper cds-border">
    <div class="inner-box">
      <h3c-title :title="title"></h3c-title>
      <i-form
        ref="groupForm"
        :model="groupDetail"
        :label-width="160">
        <h3c-mall
          class-name="icon-xinxi"
          title="基本信息"
          style-set="#55ce5b"
          style="padding-right: 60px;">
          <template slot="mallContent">
            <i-row>
              <i-col :xs="24" :lg="12">
                <i-form-item label="父组织名称" prop="parentId">
                  <i-cascader
                    change-on-select
                    :data="groupList"
                    :render-format="format"
                    v-model="groupPath"
                    @on-change="groupChange">
                  </i-cascader>
                </i-form-item>
              </i-col>
              <i-col :xs="24" :lg="12">
                <i-form-item label="组织名称" prop="name">
                  <i-tooltip placement="right">
                    <i-input
                      clearable
                      v-model="groupDetail.name">
                    </i-input>
                    <div slot="content">
                      <p>长度1~42个字符，允许输入中文、大小</p>
                      <p>写英文字母、数字以及括号中的英文字</p>
                      <p>符（.-@_），且不能以字符（.-@_）作</p>
                      <p>为开始字符</p>
                    </div>
                  </i-tooltip>
                </i-form-item>
              </i-col>
            </i-row>
            <i-row>
              <i-col :xs="24" :lg="12">
                <i-form-item label="联系人" prop="linkman">
                  <i-input
                    clearable
                    v-model="groupDetail.linkman">
                  </i-input>
                </i-form-item>
              </i-col>
              <i-col :xs="24" :lg="12">
                <i-form-item label="电话号码" prop="telephone">
                  <i-tooltip placement="right">
                    <i-input
                      clearable
                      v-model="groupDetail.telephone">
                    </i-input>
                    <div slot="content">
                      <p>该值必须是3或4位区号加“-”的固话或</p>
                      <p>11位手机号，如：010-82774537，</p>
                      <p>13806504476</p>
                    </div>
                  </i-tooltip>
                </i-form-item>
              </i-col>
            </i-row>
            <i-form-item label="地址" prop="address">
              <i-input
                clearable
                v-model="groupDetail.address">
              </i-input>
            </i-form-item>
            <i-form-item label="备注" prop="description">
              <i-input
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                v-model="groupDetail.description">
              </i-input>
            </i-form-item>
          </template>
        </h3c-mall>
        <h3c-mall class-name="icon-yumingguanli" title="可用域" style-set="#ffa904">
          <template slot="mallContent">
            <i-form-item prop="quotaParam['azoneList']">
              <i-checkbox-group class="azone-box" v-model="groupDetail.quotaParam['azoneList']">
                <i-row>
                  <i-col :xs="24" :md="12" :lg="8" v-for="item in azoneList" :key="item.id">
                    <i-checkbox :label="item.id" :key="item.id">
                      {{item.resourceType}}：{{item.labelName}}（{{item.virtType}}）
                    </i-checkbox>
                  </i-col>
                </i-row>
              </i-checkbox-group>
            </i-form-item>
          </template>
        </h3c-mall>
        <div v-for="(item, index) in quotaConfig" :key="index">
          <h3c-mall :class-name="item.icon" :title="item.label" :style-set="item.color">
            <template slot="mallContent">
              <i-row>
                <i-col :xs="24" :lg="12" v-for="type in item.children" :key="type.value">
                  <i-form-item :label="type.label">
                    <i-input-number
                      class="input-quota"
                      :max="quotaMax[type.value]"
                      :min="quotaMin[type.value]"
                      v-model="groupDetail.quotaParam[type.value]"
                      @on-focus="isShowRange[type.value] = true"
                      @on-blur="handleBlur(type.value)"></i-input-number>
                    <i-checkbox v-model="checkBox[type.value]" @on-change="changeCheckBox($event, type.value)">
                      最大值
                    </i-checkbox>
                    <div v-show="isShowRange[type.value]" class="range-message">
                      {{quotaRange[type.value]}}
                    </div>
                  </i-form-item>
                </i-col>
              </i-row>
            </template>
          </h3c-mall>
        </div>
      </i-form>
    </div>
    <div class="cds-fixed-footer">
      <div class="cds-fixed-footer-right">
        <i-button type="primary" @click="submit">确 认</i-button>
        <i-button @click="cancel" style="margin-left: 8px;">取 消</i-button>
      </div>
    </div>
    <i-spin
      fix
      size="large"
      v-if="isSpinShow"></i-spin>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入标题组件
import H3cMall from '@/components/h3c-mall/H3cMall.vue';
import { buildTree } from '@/assets/js/utils';
import { treePathFormat } from '@/assets/js/format';

/**
 * @description 默认配额
 * @property {number} cores           - CPU数量
 * @property {number} instances       - 主机数量
 * @property {number} ramSize         - 内存容量
 * @property {number} volumeGigabytes - 存储总容量
 * @property {number} snapshots       - 快照数量
 * @property {number} volumes         - 硬盘数量
 * @property {number} router          - 路由器数量
 * @property {number} firewall        - 防火墙数量
 * @property {number} network         - 网络数量
 * @property {number} loadbalancer    - 负载均衡数量
 * @property {number} listeners       - 监听器数量
 * @property {number} vnic            - 网卡数量
 * @property {number} floatingIp      - 公网IP数量
 * @property {number} securityGroups  - 安全组数量
 * @property {number} subnets         - 子网数量
 */
const quotaDefault = {
  cores: 0,
  instances: 0,
  ramSize: 0,
  volumeGigabytes: 0,
  snapshots: 0,
  volumes: 0,
  router: 0,
  firewall: 0,
  network: 0,
  loadbalancer: 0,
  // listeners: 0,
  vnic: 0,
  floatingIp: 0,
  // securityGroups: 0,
  subnets: 0
};

/**
 * @property {} id                                -
 * @property {string} name                        - 组织名称
 * @property {string} parentId                    - 父组织Id
 * @property {} label                             -
 * @property {string} description                 - 备注
 * @property {} parentName                        -
 * @property {} active                            -
 * @property {} principal                         -
 * @property {string} linkman                     - 联系人
 * @property {string} telephone                   - 电话号码
 * @property {string} address                     - 地址
 * @property {} owner                             -
 * @property {} otherInfo                         -
 * @property {} platformTenantId                  -
 * @property {Object} quotaParam                  -
 * @property {Array} quotaParam.azoneList         - 已选中的可用域列表
 * @property {Array} quotaParam.netWorkIdList     -
 * @property {Array} quotaParam.quotaDefault      - 默认配额
 */
const groupInfoEmpty = {
  id: null,
  name: null,
  parentId: null,
  label: null,
  description: null,
  parentName: null,
  active: true,
  principal: null,
  linkman: null,
  telephone: null,
  address: null,
  owner: null,
  otherInfo: null,
  platformTenantId: null,
  quotaParam: { azoneList: [], netWorkIdList: [], ...quotaDefault }
};

export default {
  name: 'GroupPoolEdit',
  components: {
    'h3c-title': H3cTitle,
    'h3c-mall': H3cMall
  },
  data() {
    return {
      groupList: [], // 组织数据（父组织）
      groupPath: [], // 组织路径（父组织）
      operation: '',
      node: null, // 修改时资源池数据
      title: '', // 编辑页标题
      isSpinShow: false,
      groupDetail: { ...groupInfoEmpty },
      azoneList: [], // 可用域列表
      azoneSelect: [], // 可用域列表ID
      quotaConfig: [
        {
          label: '计算配额',
          icon: 'icon-06',
          color: '#9cb1e7',
          children: [
            {
              label: 'CPU数量（核）',
              value: 'cores'
            },
            {
              label: '云主机数量（个）',
              value: 'instances'
            },
            {
              label: '内存容量（GB）',
              value: 'ramSize'
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
              value: 'volumeGigabytes'
            },
            {
              label: '快照数量（个）',
              value: 'snapshots'
            },
            {
              label: '云硬盘数量（个）',
              value: 'volumes'
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
              value: 'router'
            },
            {
              label: '防火墙数量（个）',
              value: 'firewall'
            },
            {
              label: '网络数量（个）',
              value: 'network'
            },
            {
              label: '负载均衡数量（个）',
              value: 'loadbalancer'
            },
            {
              label: '公网IP数量（个）',
              value: 'floatingIp'
            },
            {
              label: '网卡数量（个）',
              value: 'vnic'
            }
            /* {
              label: '子网数量（个）',
              value: 'subnets'
            } */
          ]
        }
      ],
      quota: {}, // 配额信息，包含已用和总量
      quotaMax: {}, // 配额可用最大值
      quotaMin: {}, // 配额可填写的最小值
      quotaAssigned: {}, // 配额已配置的数量
      quotaRange: {}, // 配额可配范围提示
      isShowRange: {}, // 是否显示范围
      defaults: 500
    };
  },
  computed: {
    checkBox() {
      let obj = {};
      Object.keys(quotaDefault).forEach(type => {
        obj[type] = this.quotaMax[type] === this.groupDetail.quotaParam[type];
      });
      return obj;
    }
  },
  methods: {
    /**
     * @function 选择后展示的函数，用于自定义显示格式
     * @param {Array} labels        - 已选路径的标签
     * @param {Array} selectedData  - 已选路径的数据
     * @return {string}             - 级联选择器中显示的字符串
     */
    format(labels, selectedData) {
      return labels[labels.length - 1];
    },
    /**
     * @function 设置组织ID
     * @description 选择完成后的回调
     * @param {array} selectedPathId - 已选路径的ID
     */
    groupChange(selectedPathId) {
      this.groupDetail.parentId = selectedPathId[selectedPathId.length - 1];
    },
    /**
     * @description 复选框变化时触发
     * @param {boolean} value CheckBox的状态值：true为选中，false为未选中
     * @param {string} type 根据CheckBox的状态需要改变的字段
     */
    changeCheckBox(value, type) {
      this.groupDetail.quotaParam[type] = value ? this.quotaMax[type] : this.quotaAssigned[type];
    },
    /**
     * @function 隐藏配额范围提示
     * @description 输入框失去焦点时触发
     */
    handleBlur(type) {
      this.isShowRange[type] = false;
      this.$nextTick(() => {
        if (this.groupDetail.quotaParam[type] == null) {
          this.groupDetail.quotaParam[type] = this.quotaAssigned[type];
        }
      });
    },
    /**
     * @function 表单通过验证后，执行请求
     * @description 点击保存按钮触发
     */
    submit() {
      this.$refs['groupForm'].validate(valid => {
        if (valid) {
          this.$loading.show();
          let obj = {},
            url = '',
            message = '',
            method = '';
          obj.groupDto = { ...this.groupDetail };
          obj.quotaParam = this.groupDetail.quotaParam;
          delete obj.groupDto.quotaParam;
          if (this.title === '组织新增') {
            method = 'POST';
            url = 'quota/group/add';
            message = '新增组织成功';
          } else {
            method = 'PUT';
            (url = 'quota/group/update'), (message = '修改组织成功');
          }
          this.$http({
            method,
            url,
            data: obj
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                desc: message
              });
              this.$router.push({
                name: 'group-manage/index'
              });
            }
          });
        }
      });
    },
    cancel() {
      this.operation = 'cancel';
      this.$router.push({
        name: 'group-manage/index'
      });
    },
    /**
     * @function 设置配额范围可见性标志位（默认隐藏）和范围值
     */
    setRange() {
      for (let type in quotaDefault) {
        this.$set(this.isShowRange, type, false);
        // 配额有限范围
        this.quotaRange[type] = `有效范围为${this.quotaMin[type]}-${this.quotaMax[type]}`;
      }
    },
    /**
     * @function 获取可用域列表
     * @param {string} id - 当前资源池ID
     */
    getAzone(id) {
      this.azoneSelect = [];
      let url = id ? `azone/list?groupId=${id}` : 'azone/list?groupId=';
      return this.$http.get(url).then(({ data }) => {
        if (data.status) {
          this.azoneList = data.data.map(item => {
            item.resourceType = item.resourceType.replace('cinder', '存储').replace('nova', '计算');
            if (id) {
              item.own ? this.azoneSelect.push(item.id) : '';
            } else {
              this.azoneSelect.push(item.id);
            }
            return item;
          });
        }
      });
    },
    /**
     * @function 获取根组织配额信息
     */
    getRootQuota() {
      return this.$http.get('quota/root').then(({ data }) => {
        if (data.status) {
          let quota = data.data.quota;
          if (quota) {
            /* 配额可用最大值 = 总量 - 已用 */
            this.quotaMax.cores = quota.maxTotalCores - quota.totalCoresUsed; // CPU数量
            this.quotaMax.instances = quota.maxTotalInstances - quota.totalInstancesUsed; // 主机数量
            this.quotaMax.ramSize = quota.maxTotalRAMSize - quota.totalRAMUsed; // 内存容量
            this.quotaMax.volumeGigabytes =
              quota.maxTotalVolumeGigabytes - quota.totalGigabytesUsed; // 存储总容量
            this.quotaMax.snapshots = quota.maxTotalSnapshots - quota.totalSnapshotsUsed; // 快照数量
            this.quotaMax.volumes = quota.maxTotalVolumes - quota.totalVolumesUsed; // 硬盘数量
            this.quotaMax.router = quota.maxRouters - quota.totalRoutersUsed; // 路由器数量
            this.quotaMax.firewall = quota.maxFirewalls - quota.totalFirewallsUsed; // 防火墙数量
            this.quotaMax.network = quota.maxNetworks - quota.totalNetworksUsed; // 网络数量
            this.quotaMax.loadbalancer = quota.maxLoadbalancers - quota.totalLoadbalancersUsed; // 负载均衡数量
            this.quotaMax.vnic = quota.maxVnic - quota.totalVnicUsed; // 网卡数量
            this.quotaMax.floatingIp = quota.maxTotalFloatingIps - quota.totalFloatingIpsUsed; // 公网IP数量
            // this.quotaMax.subnets = quota.maxSubnets - quota.totalSubnetsUsed; // 子网数量
            this.quotaMin = { ...quotaDefault }; // 配额可用最小值全部默认为0
            this.setRange();
            /* 设置默认配额，当配额最大值小于默认值时，值为最大值，否则为默认值 */
            for (let type in quotaDefault) {
              if (this.quotaMax[type] < this.defaults) {
                this.quotaAssigned[type] = this.quotaMax[type];
              } else {
                this.quotaAssigned[type] = this.defaults;
              }
            }
          }
        }
      });
    },
    /**
     * @function 修改资源池时获取资源池信息
     * @param {string} parentGroupId  - 父组织ID
     */
    getPoolById(parentGroupId) {
      return this.$http
        .get(`/quota/quota/${this.$route.query.id}/${parentGroupId}`)
        .then(({ data }) => {
          if (data.status) {
            let quota = data.data.quota;
            /* 配额可用最大值 */
            this.quotaMax.cores = quota.maxTotalCores;
            this.quotaMax.instances = quota.maxTotalInstances;
            this.quotaMax.ramSize = quota.maxTotalRAMSize;
            this.quotaMax.volumeGigabytes = quota.maxTotalVolumeGigabytes;
            this.quotaMax.snapshots = quota.maxTotalSnapshots;
            this.quotaMax.volumes = quota.maxTotalVolumes;
            this.quotaMax.router = quota.maxRouters;
            this.quotaMax.firewall = quota.maxFirewalls;
            this.quotaMax.network = quota.maxNetworks;
            this.quotaMax.loadbalancer = quota.maxLoadbalancers;
            this.quotaMax.vnic = quota.maxVnic;
            this.quotaMax.floatingIp = quota.maxTotalFloatingIps;
            // this.quotaMax.subnets = quota.maxSubnets;
            /* 当前组织已配置的配额（即新建组织时分配的配额） */
            this.quotaAssigned.cores = quota.totalCoresUsed;
            this.quotaAssigned.instances = quota.totalInstancesUsed;
            this.quotaAssigned.ramSize = quota.totalRAMUsed;
            this.quotaAssigned.volumeGigabytes = quota.totalGigabytesUsed;
            this.quotaAssigned.snapshots = quota.totalSnapshotsUsed;
            this.quotaAssigned.volumes = quota.totalVolumesUsed;
            this.quotaAssigned.router = quota.totalRoutersUsed;
            this.quotaAssigned.firewall = quota.totalFirewallsUsed;
            this.quotaAssigned.network = quota.totalNetworksUsed;
            this.quotaAssigned.loadbalancer = quota.totalLoadbalancersUsed;
            this.quotaAssigned.vnic = quota.totalVnicUsed;
            this.quotaAssigned.floatingIp = quota.totalFloatingIpsUsed;
            // this.quotaAssigned.subnets = quota.totalSubnetsUsed;
            /* 配额可用最小值 */
            this.quotaMin.cores = quota.minTotalCores;
            this.quotaMin.instances = quota.minTotalInstances;
            this.quotaMin.ramSize = quota.minTotalRAMSize;
            this.quotaMin.snapshots = quota.minTotalSnapshots;
            this.quotaMin.volumeGigabytes = quota.minTotalVolumeGigabytes;
            this.quotaMin.volumes = quota.minTotalVolumes;
            this.quotaMin.router = quota.minRouters;
            this.quotaMin.firewall = quota.minFirewalls;
            this.quotaMin.network = quota.minNetworks;
            this.quotaMin.loadbalancer = quota.minLoadbalancers;
            this.quotaMin.vnic = quota.minVnic;
            this.quotaMin.floatingIp = quota.minTotalFloatingIps;
            this.quotaMin.subnets = quota.minSubnets;
            this.setRange();
          }
        });
    },
    getGroupList() {
      return this.$http({
        method: 'GET',
        url: 'group/list'
      }).then(({ data }) => {
        if (data.status) {
          this.groupList = buildTree(data.data, 'createDate', item => {
            return {
              id: item.id,
              name: item.name,
              parentId: item.parentId,
              parentName: item.parentName,
              title: item.name, // 显示的组织名称
              value: item.id, // 级联选择时的唯一标识，因为id是唯一的，所以取id的值
              label: item.name, // 级联选择时显示的资源名称
              show: item.show
            };
          });
        }
      });
    }
  },
  created() {
    this.isSpinShow = true;
    if (this.$route.query.id) {
      this.title = '组织修改';
      this.$http
        .get(`quota/group/${this.$route.query.id}`)
        .then(({ data }) => {
          if (data.status) {
            this.node = data.data;
            let azone2 = this.getAzone(this.$route.query.id);
            let quota2 = this.getPoolById(this.node.parentId);
            let group2 = this.getGroupList();
            Promise.all([azone2, quota2, group2])
              .then(() => {
                this.groupDetail = { ...this.groupDetail, ...this.node }; // 设置默认信息
                this.groupDetail.quotaParam = {
                  ...this.groupDetail.quotaParam,
                  ...this.quotaAssigned
                };
                this.groupDetail.quotaParam.azoneList = this.azoneSelect;
                this.groupPath = treePathFormat(this.groupList, this.node.parentId).path;
                this.isSpinShow = false;
              })
              .catch(() => {
                this.isSpinShow = false;
              });
          }
        })
        .catch(() => {
          this.isSpinShow = false;
        });
    } else {
      this.getGroupList();
      this.title = '组织新增';
      let azone1 = this.getAzone();
      let quota1 = this.getRootQuota();
      let group1 = this.getGroupList();
      Promise.all([azone1, quota1, group1])
        .then(() => {
          this.groupDetail.quotaParam = { ...this.groupDetail.quotaParam, ...this.quotaAssigned };
          this.groupDetail.quotaParam.azoneList = this.azoneSelect;
          this.groupPath = treePathFormat(this.groupList, this.$route.query.parentId).path;
          this.groupChange(this.groupPath);
          this.isSpinShow = false;
        })
        .catch(() => {
          this.isSpinShow = false;
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    /* id存在，修改 */
    if (to.query.id) {
      to.meta.breadcrumb = '组织修改';
    } else {
      to.meta.breadcrumb = '组织新增';
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (this.operation === 'cancel') {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  }
};
</script>

<style scoped lang="less">
.group-pool-edit {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .inner-box {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 15px 15px 70px 15px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .header-box {
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #d5d8db;
    font-size: 14px;
    font-weight: 700;
    vertical-align: middle;
  }

  .range-message {
    position: absolute;
    line-height: 18px;
  }

  .azone-box {
    padding-left: 10px;
    overflow: auto;
  }

  .input-quota {
    width: 66%;
  }
}
</style>
