<!--
 * @Description: API编辑
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:09
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-05 11:55:18
 -->
<template>
  <i-modal
    ref="apiModal"
    :title="title"
    :mask-closable="false"
    v-model="visible"
    @on-cancel="cancel">
    <i-form
      ref="apiForm"
      :model="apiDetail"
      :rules="ruleValidate"
      :label-width="100">
      <form-item label="资源名称" prop="resourceId">
        <i-cascader
          change-on-select
          :clearable="false"
          :data="resourceList"
          :render-format="format"
          v-model="currentPath"
          @on-change="resourceChange">
        </i-cascader>
      </form-item>
      <form-item label="API" prop="url">
        <i-input v-model="apiDetail.url"></i-input>
      </form-item>
      <form-item label="责任人" prop="owner">
        <i-input
          v-model="apiDetail.owner"
          placeholder="请输入工号">
        </i-input>
      </form-item>
      <form-item label="状态" prop="active">
        <i-radio-group
          v-model="active"
          @on-change="activeChange">
          <i-radio :label="1">
            <span>有效</span>
          </i-radio>
          <i-radio :label="0">
            <span>无效</span>
          </i-radio>
        </i-radio-group>
      </form-item>
      <form-item label="描述" prop="description">
        <i-input
          type="textarea"
          v-model="apiDetail.description"
          :autosize="{minRows: 2,maxRows: 5}">
        </i-input>
      </form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click="submit">保 存</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import { activeFormat } from '@/assets/js/format';

const apiInfoEmpty = {
  id: null,
  url: null,
  resourceId: null,
  description: null,
  active: true,
  createDate: null,
  modifiedDate: null,
  owner: null
};

export default {
  name: 'ApiManageEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    resourceList: {
      type: Array
    },
    defaultPath: {
      type: Array
    },
    apiInfo: {
      type: Object,
      default() {
        return apiInfoEmpty;
      }
    }
  },
  data() {
    return {
      visible: false,
      currentPath: [],
      active: 0,
      apiDetail: apiInfoEmpty,
      ruleValidate: {
        resourceId: [
          {
            required: true,
            type: 'string',
            message: '资源名称不能为空',
            trigger: 'blur'
          }
        ],
        url: [
          {
            required: true,
            type: 'string',
            message: 'API名称不能为空',
            trigger: 'blur'
          }
        ],
        owner: [
          {
            required: true,
            type: 'string',
            message: '责任人不能为空'
          }
        ]
      }
    };
  },
  methods: {
    /**
     * @function 资源名称级联选择完成的回调，value即已选值
     */
    resourceChange(value) {
      this.apiDetail.resourceId = value[value.length - 1];
    },
    /**
     * @function 级联选择显示格式转换，只显示选择的最后一级名称
     */
    format(labels, selectedData) {
      const index = labels.length - 1;
      const data = selectedData[index] || false;
      if (data && data.code) {
        return labels[index];
      }
      return labels[index];
    },
    activeChange(val) {
      this.apiDetail.active = activeFormat(val, true, false);
    },
    submit() {
      this.$refs['apiForm'].validate(valid => {
        if (valid) {
          this.$loading.show();
          // this.$emit('submitSave', this.apiDetail);
          let url = '',
            method = '';
          if (this.title === '新增API') {
            url = 'api/add';
            method = 'POST';
          } else {
            url = 'api/update';
            method = 'PUT';
          }
          this.$http({
            url,
            method,
            data: {
              id: this.apiDetail.id,
              url: this.apiDetail.url,
              owner: this.apiDetail.owner.toLowerCase(),
              resourceId: this.apiDetail.resourceId,
              description: this.apiDetail.description,
              active: this.apiDetail.active
            }
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                desc: `${this.title}成功`
              });
              this.$emit('on-ok');
              this.visible = false;
              this.$refs['apiForm'].resetFields();
            }
          });
        }
      });
    },
    cancel() {
      this.visible = false;
      this.$refs['apiForm'].resetFields();
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.visible = newVal;
        this.currentPath = this.defaultPath;
        this.apiDetail = { ...this.apiInfo };
        this.active = activeFormat(this.apiDetail.active, 1, 0);
        this.apiDetail.resourceId = this.defaultPath[
          this.defaultPath.length - 1
        ];
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); // 清楚右上角提示信息
        this.visible = newVal; // 显示对话框
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('input', newVal);
      }
    }
  }
};
</script>
