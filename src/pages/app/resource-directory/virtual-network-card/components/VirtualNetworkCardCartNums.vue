<!--
 * @Description 虚拟网卡网络和ip的页面
 * @Author ys1983/张睿博
 * @Date 2019-08-01 13:53:36
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:39:07
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item
      label="网络"
      prop="netWorkId">
      <i-select
        v-model="formValidate.netWorkId"
        style="width:300px"
        @on-change="changeNetwork"
        placeholder="请选择网络"
        label-in-value>
        <i-option
          v-for="value in networkData"
          :key="value.id"
          :value="value.networkId">
          {{value.name}}
        </i-option>
      </i-select>
    </i-form-item>
    <i-form-item
      label="IP地址"
      prop="ipAddress">
      <i-input
        v-model="formValidate.ipAddress"
        placeholder="请输入IP地址"
        :disabled="formValidate.netWorkId ? false : true"
        style="width: 300px">
      </i-input>
    </i-form-item>
  </i-form>
</template>

<script>
import { required, ip } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'VirtualNetworkCardCartNums',
  props: {
    netWorkId: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formValidate: {
        applyId: '',
        netWorkId: '', // 网络id
        netWorkName: '', // 网络名称
        cidr: '',
        subnetId: '',
        ipAddress: '', // id地址
        hostName: '', //必传字段,穿空即可
        portNums: 1 // 虚拟网卡的购买量，默认传1
      },
      ruleValidate: {
        netWorkId: required({ message: '请选择网络' }),
        ipAddress: ip({ message: '输入的IP格式不正确', http: this.checkIpHttp })
      },
      networkData: [] // 网络数据
    };
  },
  methods: {
    /**
     * @function getNetworkHttp
     * @description 获取网络数据的方法
     * @param {Boolean} is
     * @returns {void}
     */
    getNetworkHttp(is = false) {
      this.$http({
        url: 'network/list/forPort',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.networkData = data.data;
          let index = is ? data.data.findIndex(item => item.networkId === this.netWorkId) : 0;
          let { networkId, name, cidr, subnetId } = this.networkData[index];
          this.formValidate.netWorkId = networkId;
          this.formValidate.netWorkName = name;
          this.formValidate.cidr = cidr;
          this.formValidate.subnetId = subnetId;
        } else {
          this.networkData = [];
          this.formValidate.netWorkId = '';
          this.formValidate.netWorkName = '';
          this.formValidate.cidr = '';
          this.formValidate.subnetId = '';
        }
      });
    },
    /**
     * @function changeNetwork
     * @description 当选择的网络改变时触发的方法
     * @param {String} value  - 网络的networkId
     * @param {String} label  - 网络的netWorkName
     * @returns {void}
     */
    changeNetwork({ value, label } = { value: '', label: '' }) {
      this.formValidate.netWorkName = label;
      let { cidr, subnetId } = value ?
        this.networkData.find(item => item.networkId === value) :
        { cidr: '', subnetId: '' };
      this.formValidate.cidr = cidr;
      this.formValidate.subnetId = subnetId;
    },
    /**
     * @function checkIpHttp
     * @description 校验IP的接口
     * @param {Function} callback
     * @returns {void}
     */
    checkIpHttp(callback) {
      this.$http({
        url: `serverApply/checkPortIPAddress/${this.formValidate.subnetId}/${this.formValidate.ipAddress}?applyListId=${this.formValidate.applyId}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status) {
          callback();
        } else {
          callback(data.message);
        }
      });
    }
  },
  mounted() {
    !this.$route.query.hasOwnProperty('id') && this.getNetworkHttp(); // dom加载完毕之后调用请求网络的方法
  },
  watch: {
    netWorkId(newValue) {
      if (newValue) {
        this.getNetworkHttp(true);
        this.formValidate.ipAddress = this.ipAddress;
        this.formValidate.applyId = this.$route.query.id;
      }
    }
  }
};
</script>
