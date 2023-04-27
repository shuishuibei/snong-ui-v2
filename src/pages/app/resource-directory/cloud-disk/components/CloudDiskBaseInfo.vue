<!--
 * @Description 云硬盘基本信息页面
 * @Author ys1983/张睿博
 * @Date 2019-07-26 15:03:15
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:54:24
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item
      label="资源区域"
      prop="azoneId">
      <i-select
        style="width:300px;"
        v-model="formValidate.azoneId"
        placeholder="请选择资源区域"
        label-in-value
        @on-change="resourceAreaChange">
        <i-option
          v-for="value in resourceAreaList"
          :key="value.id"
          :value="value.id">
          {{value.labelName}}
        </i-option>
      </i-select>
    </i-form-item>
    <i-form-item
      label="X86硬盘名称"
      prop="volumeName">
      <i-input
        placeholder="请输入X86硬盘名称"
        style="width:300px"
        :maxlength="32"
        v-model="formValidate.volumeName">
      </i-input>
      <span class="cds-tip">只能由字母、数字、短横线组成，且只能以字母开头，字数不超过32</span>
    </i-form-item>
    <i-form-item
      label="存储类型"
      prop="storageType">
      <i-select
        style="width:300px;"
        v-model="formValidate.storageType">
        <i-option value="普通">普通</i-option>
      </i-select>
    </i-form-item>
    <i-form-item
      label="共享"
      prop="shared">
      <i-radio-group v-model="formValidate.shared">
        <i-radio label="true">是</i-radio>
        <i-radio label="false">否</i-radio>
      </i-radio-group>
    </i-form-item>
    <i-form-item
      label="挂载虚拟机"
      prop="serverId">
      <i-select
        style="width:300px;"
        v-model="formValidate.serverId"
        label-in-value
        @on-change="virtualMachineChange">
        <i-option
          v-for="value in virtualMachineList"
          :value="value.id"
          :key="value.id">
          {{value.serverName}}
        </i-option>
      </i-select>
      <span class="cds-tip">X86虚拟机必须在有效租期内，状态为运行中或已停止（X86虚拟机为关闭状态），且无其他任务</span>
    </i-form-item>
    <i-form-item
      label="X86硬盘描述"
      prop="description">
      <i-input
        v-model="formValidate.description"
        type="textarea"
        :rows="5"
        placeholder="X86硬盘描述"
        style="width: 550px;"
        :maxlength="85">
      </i-input>
      <span class="cds-tip">0-85位任意字符</span>
    </i-form-item>
  </i-form>
</template>

<script>
import { name, required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'CloudDiskBaseInfo',
  props: {
    resourceContent: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formValidate: {
        applyId: '', // 当前编辑页的id,如果是新申请的id为空,申请清单编辑回来的则有值
        azoneId: '', // 资源区域所选资源的id
        azoneName: '', // 资源区域所选资源的名称
        azoneLabelName: '', // 资源区域别名
        hostName: '', // 可用域返回的host字段
        volumeName: '', // X86硬盘名称
        storageType: '普通', // 存储类型
        shared: 'true', // 是否共享
        serverId: '', // 绑定虚拟机的id
        serverName: '', // 绑定虚拟机的名称
        description: '', // x86虚拟机的描述
        resTenancy: '-1', //租期  这里没有租期默认为-1
        newVolumeSize: '', //必传字段,直接传空
        normId: '', //必传字段,直接传空
        oldVolumeSize: '' //必传字段,直接传空
      },
      ruleValidate: {
        azoneId: required({ message: '所选资源区域不能为空' }),
        volumeName: [
          required({ message: 'X86硬盘名称不能为空' }),
          name({ message: '只能由字母、数字、短横线组成，且只能以字母开头，字数不超过32' })
        ],
        storageType: required({ message: '所选存储类型不能为空' }),
        shared: required({ message: '共享不能为空' })
      },
      resourceAreaList: [], // 资源区域数据集合
      virtualMachineList: [] // 挂载虚拟街数据集合
    };
  },
  methods: {
    /**
     * @function getResourceAreaHttp
     * @description 获取资源区域数据的http请求
     * @param {Boolean} is
     * @returns {void}
     */
    getResourceAreaHttp(is = false) {
      this.$http({
        url: 'azone/list/azones/cinder',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.resourceAreaList = data.data;
          let index = is ?
            data.data.findIndex(item => item.id === this.resourceContent.azoneId) :
            0;
          let { id, zone, labelName, host } = this.resourceAreaList[index];
          this.formValidate.azoneId = id;
          this.formValidate.azoneName = zone;
          this.formValidate.azoneLabelName = labelName;
          this.formValidate.hostName = host;
          this.getVirtualMachineHttp(is); // 当资源区域的数据改变时,获取虚拟机数据的方法也需要调用
        } else {
          this.resourceAreaList = [];
          this.formValidate.azoneId = '';
          this.formValidate.azoneName = '';
          this.formValidate.azoneName = '';
          this.formValidate.hostName = '';
          this.virtualMachineList = [];
          this.formValidate.serverId = '';
          this.formValidate.serverName = '';
        }
      });
    },
    /**
     * @function getVirtualMachineHttp
     * @description 获取虚拟机列表
     * @param {Boolean} is
     * @returns {void}
     */
    getVirtualMachineHttp(is) {
      this.$http({
        url: `server/list/volume/${this.formValidate.azoneId}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.virtualMachineList = data.data;
          let index = is ?
            data.data.findIndex(item => item.id === this.resourceContent.serverId) :
            0;
          let { id, serverName } = this.virtualMachineList[index];
          this.formValidate.serverId = id;
          this.formValidate.serverName = serverName;
        } else {
          this.virtualMachineList = [];
          this.formValidate.serverId = '';
          this.formValidate.serverName = '';
        }
      });
    },
    /**
     * @function resourceAreaChange
     * @description 当资源区域的选项改变时触发
     * @param {Object} option
     * @param {String} option.value
     * @param {String} option.label
     * @returns {void}
     */
    resourceAreaChange({ value, label }) {
      this.formValidate.azoneLabelName = label;
      let target = this.resourceAreaList.find(item => item.id === value);
      this.formValidate.azoneName = target.zone;
      this.formValidate.hostName = target.host;
      this.getVirtualMachineHttp(false); // 当资源区域的数据改变时,获取虚拟机数据的方法也需要调用
    },
    /**
     * @function virtualMachineChange
     * @description 当挂载虚拟机改变时触发
     * @param {Object} option
     * @param {String} option.label
     * @returns {void}
     */
    virtualMachineChange({ label }) {
      this.formValidate.serverName = label;
    }
  },
  mounted() {
    !this.$route.query.hasOwnProperty('id') && this.getResourceAreaHttp(); // 调用请求资源区域数据的方法
  },
  watch: {
    resourceContent(newValue) {
      if (newValue.hasOwnProperty('azoneId')) {
        this.getResourceAreaHttp(true);
        let { volumeName, description } = newValue;
        this.formValidate = Object.assign(this.formValidate, { volumeName, description });
      }
    }
  }
};
</script>
