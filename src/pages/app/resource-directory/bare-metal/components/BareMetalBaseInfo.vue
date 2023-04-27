<!--
 * @Description 裸金属基本信息页面
 * @Author ys1983/张睿博
 * @Date 2019-08-02 10:47:41
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:55:31
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
        @on-change="changeAzoneId">
        <i-option
          v-for="item in resourceArea"
          :value="item.id"
          :key="item.id">
          {{item.labelName}}
        </i-option>
      </i-select>
    </i-form-item>
    <i-form-item
      label="裸金属名称"
      prop="bareMetalName">
      <i-input
        v-model="formValidate.bareMetalName"
        :maxlength="32"
        placeholder="请输入裸金属名称"
        style="width:300px;">
      </i-input>
      <span class="cds-margin-left-10 cds-color-999">只能由字母、数字、短横线组成，且只能以字母开头，字数不超过32</span>
    </i-form-item>
    <i-form-item
      label="裸金属别名"
      prop="alias">
      <i-input
        v-model="formValidate.alias"
        placeholder="请输入裸金属别名"
        :maxlength="32"
        style="width:300px;">
      </i-input>
    </i-form-item>
    <i-form-item
      label="裸金属描述"
      prop="description">
      <i-input
        type="textarea"
        v-model="formValidate.description"
        :maxlength="128"
        style="width: 550px;"
        :rows="5"
        placeholder="描述裸金属用途，例如：ERP系统，字数不超过128">
      </i-input>
    </i-form-item>
  </i-form>
</template>

<script>
import { required, name } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'BareMetalBaseInfo',
  props: {
    editAzone: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formValidate: {
        azoneId: '1',
        azoneLabelName: '', // 资源区域的标签名
        azoneName: '', //资源区域名称
        bareMetalName: '', //裸金属名称
        alias: '', //裸金属别名
        description: '' //裸金属描述
      },
      ruleValidate: {
        azoneId: required({ message: '资源区域不能为空' }),
        bareMetalName: [
          required({ message: '裸金属名称不能为空' }),
          name({ message: '裸金属名称只能由字母、数字、短横线组成，且只能以字母开头' })
        ]
      },
      resourceArea: [] //资源区域的数据集合
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
        url: 'azone/list/azones/bareMetal',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.resourceArea = data.data;
          let index = is ? data.data.findIndex(item => item.id === this.editAzone.azoneId) : 0;
          let { id, zone, labelName, virtType } = this.resourceArea[index];
          this.formValidate.azoneId = id;
          this.formValidate.azoneLabelName = labelName;
          this.formValidate.azoneName = zone;
          this.$emit('e-virtType', { virtType, is });
          this.$emit('e-azone', labelName);
        } else {
          this.resourceArea = [];
          this.formValidate.azoneId = '';
          this.formValidate.azoneLabelName = '';
          this.formValidate.azoneName = '';
          this.$emit('e-virtType', { virtType: '', is });
          this.$emit('e-azone', '');
        }
      });
    },
    /**
     * @function changeAzoneId
     * @description 当资源区域改变的时候所触发的方法
     * @param {String} azoneId
     * @returns {null}
     */
    changeAzoneId(azoneId) {
      let { id, zone, labelName, virtType } = this.resourceArea.find(value => value.id === azoneId);
      this.formValidate.azoneId = id;
      this.formValidate.azoneLabelName = labelName;
      this.formValidate.azoneName = zone;
      this.$emit('e-virtType', { virtType, is: false });
      this.$emit('e-azone', labelName);
    }
  },
  mounted() {
    !this.$route.query.hasOwnProperty('id') && this.getResourceAreaHttp();
  },
  watch: {
    editAzone(newValue) {
      if (newValue.bareMetalName) {
        this.formValidate = Object.assign(this.formValidate, newValue);
        this.getResourceAreaHttp(true);
      }
    }
  }
};
</script>
