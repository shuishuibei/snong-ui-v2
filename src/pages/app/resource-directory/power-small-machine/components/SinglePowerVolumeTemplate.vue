<!--
 * @Description Power虚拟机基本申请更改存储模板页面
 * @Author ys1983/张睿博
 * @Date 2019-08-22 10:19:17
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-22 13:54:22
 -->
<template>
  <i-modal
    v-model="show"
    :width="30"
    @on-visible-change="changeVisible"
    :mask-closable="false">
    <template #header>
      <h3c-title
        title="更改存储模板"
        :is-modal="true"
        :style-set="{'border-bottom': 'none'}">
      </h3c-title>
    </template>
    <i-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="100">
      <i-form-item
        label="卷名称"
        required>
        <span>{{volumeName}}</span>
      </i-form-item>
      <i-form-item
        label="存储模板"
        prop="volumeTemplateId">
        <i-select
          style="300px;"
          v-model="formValidate.volumeTemplateId"
          palceholder="请选择自定义存储模板">
          <i-option
            v-for="item in volumeTemplateData"
            :key="item.id"
            :value="item.id">
            {{item.name}}
          </i-option>
        </i-select>
      </i-form-item>
    </i-form>
    <template #footer>
      <div>
        <i-button
          type="primary"
          @click="handleSubmit">
          确认
        </i-button>
        <i-button @click="changeVisible(false)">取消</i-button>
      </div>
    </template>
  </i-modal>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import { required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'SinglePowerVolumeTemplate',
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    volumeName: {
      type: String,
      required: true
    },
    volumeTypeName: {
      type: String,
      required: true
    }
  },
  components: {
    'h3c-title': H3cTitle
  },
  data() {
    return {
      show: false,
      formValidate: {
        volumeTemplateId: ''
      },
      ruleValidate: {
        volumeTemplateId: required({ message: '自定义存储模板为必选项' })
      },
      volumeTemplateData: []
    };
  },
  methods: {
    /**
     * @function changeVisible
     * @descritpion 当窗口状态发生改变时触发的方法
     * @param {Boolean} isShow
     * @returns {void}
     */
    changeVisible(isShow) {
      this.$emit('e-show', isShow);
    },
    /**
     * @function handleSubmit
     * @description 点击确认触发的方法
     * @returns {void}
     */
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.changeMemoryTemplate(this.formValidate.volumeTemplateId);
        }
      });
    },
    /**
     * @function getVolumnTemplateHttp
     * @description 获取存储模板列表
     * @returns {void}
     */
    getVolumnTemplateHttp() {
      this.$http({
        url: 'power/volume/type/list',
        method: 'GET',
        params: {
          volumeTypeName: this.volumeTypeName
        }
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.volumeTemplateData = data.data;
          this.formValidate.volumeTemplateId = data.data[0].id;
        } else {
          this.volumeTemplateData = [];
          this.formValidate.volumeTemplateId = '';
        }
      });
    },
    /**
     * @function changeMemoryTemplate
     * @description 存储模板值改变时触发的方法
     * @param {String} id
     * @returns {void}
     */
    changeMemoryTemplate(id) {
      this.$loading.show();
      this.$http({
        url: 'power/volume/type/list',
        method: 'GET',
        params: {
          id
        }
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status && data.data.id !== '') {
          this.$emit('e-data', data.data);
          this.changeVisible(false);
        } else {
          this.changeVisible(false);
        }
      });
    }
  },
  watch: {
    isShow(newValue) {
      this.show = newValue;
      newValue && this.getVolumnTemplateHttp();
    }
  }
};
</script>
