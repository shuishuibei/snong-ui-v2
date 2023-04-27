<!--
 * @Description 云主机资源区域页面
 * @Author ys1983/张睿博
 * @Date 2019-08-02 11:31:05
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:48:44
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
        style="width:300px"
        v-model="formValidate.azoneId"
        placeholder="请选择资源区域"
        @on-change="changeResourceArea"
        label-in-value>
        <i-option
          v-for="item in resourceAreaList"
          :key="item.id"
          :value="item.id">
          {{item.labelName}}
        </i-option>
      </i-select>
    </i-form-item>
    <i-form-item
      label="物理主机"
      prop="cvk">
      <i-select
        style="width:300px"
        placeholder="请选择物理主机"
        v-model="formValidate.cvk">
        <i-option
          v-for="item in cvkList"
          :key="item.id"
          :value="item.name">
          {{item.name}}
        </i-option>
      </i-select>
    </i-form-item>
    <i-form-item
      label="X86虚拟机名称"
      prop="serverName">
      <i-input
        style="width:300px"
        placeholder="请输入X86虚拟机名称"
        :maxlength="32"
        v-model="formValidate.serverName">
      </i-input>
      <span class="cds-tip">只能由字母、数字、短横线组成，且只能以字母开头，字数不超过32</span>
    </i-form-item>
    <i-form-item
      label="X86虚拟机描述"
      prop="description">
      <i-input
        v-model="formValidate.description"
        type="textarea"
        :maxlength="128"
        style="width: 550px;"
        :rows="5"
        placeholder="描述X86虚拟机用途，例如：ERP系统，字数不超过128"
        element-id="noResize">
      </i-input>
    </i-form-item>
  </i-form>
</template>

<script>
import { required, name } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'CloudHostResourceArea',
  props: {
    resourceContent: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formValidate: {
        applyId: '',
        azoneId: '', // 资源区域id
        azoneLabelName: '', // 资源区域名称
        hostName: '', // 主机名
        cvk: '', //物理主机名称
        imageVirType: '',
        serverName: '', //虚拟机名称
        resTenancy: '-1', // 租期默认为-1
        description: '', //申请云主机描述
        normId: '',
        newNormName: '',
        oldNormName: ''
      },
      ruleValidate: {
        azoneId: required({ message: '资源区域不能为空' }),
        serverName: [
          required({ message: 'X86虚拟机名称不能为空' }),
          name({ message: '只能由字母、数字、短横线组成，且只能以字母开头' })
        ]
      },
      resourceAreaList: [], // 资源区域数据
      cvkList: [] // 物理主机数据
    };
  },
  methods: {
    /**
     * @function getResourceAreaHttp
     * @description 获取资源区域数据
     * @returns {void}
     */
    getResourceAreaHttp() {
      this.$http({
        url: 'azone/list/azones/nova',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.resourceAreaList = data.data;
          let { azoneId } = this.resourceContent;
          let { id, labelName, host, virtType } = this.isEdit ?
            this.resourceAreaList.find(item => item.id === azoneId) :
            this.resourceAreaList[0];
          this.formValidate.azoneId = id;
          this.formValidate.azoneLabelName = labelName;
          this.formValidate.hostName = host;
          this.formValidate.imageVirType = virtType;
          this.$emit('e-azone', { virtType: virtType, azoneId: id, is: this.isEdit });
          this.getCvkHttp(this.isEdit);
        } else {
          this.resourceAreaList = [];
          this.formValidate.azoneId = '';
          this.formValidate.azoneLabelName = '';
          this.formValidate.hostName = '';
          this.formValidate.imageVirType = '';
          this.cvkList = [];
          this.formValidate.cvk = '';
        }
      });
    },
    /**
     * @function getCvkHttp
     * @description 获取物理主机区域数据
     * @param {Boolean} is
     * @returns {void}
     */
    getCvkHttp(is) {
      this.$http({
        url: `hypervisor/${this.formValidate.hostName}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.cvkList = data.data;
          this.formValidate.cvk = is ? this.resourceContent.cvk : this.cvkList[0].name;
        } else {
          this.cvkList = [];
          this.formValidate.cvk = '';
        }
      });
    },
    /**
     * @function changeResourceArea
     * @description 当资源区域数据发生变化时触发的方法
     * @param {String} value
     * @param {String} label
     * @returns {void}
     */
    changeResourceArea({ value, label }) {
      this.formValidate.azoneLabelName = label;
      let { host, virtType } = this.resourceAreaList.find(item => item.id === value);
      this.formValidate.hostName = host;
      this.formValidate.imageVirType = virtType;
      this.$emit('e-azone', { virtType: virtType, azoneId: value, is: false });
      this.getCvkHttp(false);
    }
  },
  computed: {
    isEdit() {
      return this.resourceContent.hasOwnProperty('azoneId');
    }
  },
  mounted() {
    !this.$route.query.hasOwnProperty('id') && this.getResourceAreaHttp(); // 页面加载完成时调用获取资源数据的方法
  },
  watch: {
    'formValidate.azoneLabelName'(newValue) {
      this.$emit('e-azone-label-name', newValue);
    },
    isEdit(newValue) {
      newValue && this.getResourceAreaHttp();
      let { serverName, description } = this.resourceContent;
      this.formValidate = Object.assign(this.formValidate, {
        serverName,
        description,
        applyId: this.$route.query.id
      });
    }
  }
};
</script>
