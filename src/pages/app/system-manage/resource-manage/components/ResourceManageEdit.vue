<!--
 * @Description: 资源管理编辑
 * @Author: ys2234
 * @Date: 2019-09-09 16:08:11
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 15:58:44
 -->
<template>
  <i-modal
    ref="modal"
    width="740px"
    class-name="resource-manage-edit"
    :title="title"
    :mask-closable="false"
    v-model="visible"
    @on-cancel="cancel">
    <i-form
      ref="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="100">
      <i-form-item label="父资源名称" prop="parentId">
        <i-cascader
          change-on-select
          :clearable="false"
          :data="resourceList"
          :render-format="format"
          :disabled="selectDisabled"
          v-model="resourcePath"
          @on-change="resourceChange">
        </i-cascader>
      </i-form-item>
      <i-row class-name="row">
        <i-col span="12" class-name="left">
          <i-form-item label="资源名称" prop="title">
            <i-input
              placeholder="请输入资源名称"
              v-model="formObject.title">
            </i-input>
          </i-form-item>
        </i-col>
        <i-col span="12" class-name="right">
          <i-form-item label="路由/ID" prop="location">
            <i-input
              placeholder="请输入路由/ID"
              v-model="formObject.location">
            </i-input>
          </i-form-item>
        </i-col>
      </i-row>
      <i-row class-name="row">
        <i-col span="12" class-name="left">
          <i-form-item label="同级菜单序号" prop="orderNo">
            <i-input
              number
              type="text"
              placeholder="请输入同级菜单序号"
              v-model="formObject.orderNo">
            </i-input>
          </i-form-item>
        </i-col>
        <i-col span="12" class-name="right">
          <i-form-item label="ICON" prop="icon">
            <i-input v-model="formObject.icon"></i-input>
          </i-form-item>
        </i-col>
      </i-row>
      <i-row class-name="row">
        <i-col span="12" class-name="left">
          <i-form-item label="状态" prop="active">
            <i-radio-group v-model="formObject.active">
              <i-radio :label=1>
                <span>有效</span>
              </i-radio>
              <i-radio :label=0>
                <span>无效</span>
              </i-radio>
            </i-radio-group>
          </i-form-item>
        </i-col>
        <i-col span="12" class-name="right">
          <i-form-item label="创建者" prop="owner">
            <i-input
              placeholder="请输入工号"
              v-model="formObject.owner">
            </i-input>
          </i-form-item>
        </i-col>
      </i-row>
      <i-row class-name="row">
        <i-col span="12" class-name="left">
          <i-form-item label="资源类型" prop="type">
            <i-radio-group v-model="formObject.type">
              <i-radio :label="1">
                <span>组件</span>
              </i-radio>
              <i-radio :label="0">
                <span>菜单</span>
              </i-radio>
              <i-radio :label="2">
                <span>叶子</span>
              </i-radio>
            </i-radio-group>
          </i-form-item>
        </i-col>
        <i-col span="12" class-name="right">
          <i-form-item label="功能分类" prop="module">
            <i-radio-group v-model="formObject.module">
              <i-radio :label="1">
                <span>业务模块</span>
              </i-radio>
              <i-radio :label="0">
                <span>系统模块</span>
              </i-radio>
            </i-radio-group>
          </i-form-item>
        </i-col>
      </i-row>
      <i-form-item label="描述" prop="description">
        <i-input
          v-model="formObject.description"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}">
        </i-input>
      </i-form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click="submit">保 存</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>
<script>
// import { activeFormat } from '@/assets/js/format';
import { required } from '@/assets/js/rule-validate.js';
const resourceEmpty = {
  id: '',
  parentId: '',
  parentName: '',
  title: '',
  icon: '',
  location: '',
  orderNo: '',
  type: 1,
  createDate: '',
  description: '',
  modifiedDate: '',
  module: 1,
  owner: '',
  active: 1
};

export default {
  name: 'ResourceModal',
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
    resourceInfo: {
      type: Object,
      default() {
        return { ...resourceEmpty };
      }
    },
    defaultPath: {
      type: Array
    }
  },
  data() {
    const validateOrderNo = (rule, value, callback) => {
      if (value !== 0 && !value) {
        return callback(new Error('同级菜单序号不能为空'));
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入一个整数'));
      } else {
        callback();
      }
    };

    return {
      visible: false,
      selectDisabled: false, // 是否禁用级联选择器
      formObject: { ...resourceEmpty },
      resourcePath: [],
      ruleValidate: {
        parentId: [
          required({ message: '父资源名称不能为空' })
        ],
        title: [
          required({ message: '资源名称不能为空' })
        ],
        location: [
          required({ message: '路由/ID不能为空' })
        ],
        orderNo: [
          {
            required: true,
            validator: validateOrderNo,
            trigger: 'blur'
          }
        ],
        // active: [
        //   required({ type: 'boolean' })
        // ],
        // owner: [
        //   required({ message: '创建者不能为空' })
        // ],
        type: [
          required({ type: 'number' })
        ],
        module: [
          required({ type: 'number' })
        ]
      }
    };
  },
  methods: {
    /**
     * @function 设置父资源的parentId
     * @param {Array} arr - 已选值
     */
    resourceChange(arr) {
      this.formObject.parentId = arr[arr.length - 1];
    },
    format(labels, selectedData) {
      const index = labels.length - 1;
      const data = selectedData[index] || false;
      if (data && data.code) {
        return labels[index];
      }
      return labels[index];
    },
    /**
     * @function 保存或修改
     */
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // this.formObject.owner = this.formObject.owner.toLowerCase();
          this.formObject.isActive = this.formObject.active;
          this.$loading.show();
          let url = '',
              method = '';
          if(this.title === '新增资源') {
            url = 'resource/add';
            method = 'POST'
          } else {
            url = 'resource/update';
            method = 'PUT';
          }
          this.$http({
            method,
            url,
            data: this.formObject
          }).then(({ data }) => {
            this.$loading.hide();
            if(data.status) {
              this.$Notice.success({
                desc: `${this.title}成功`
              });
              this.$refs['form'].resetFields();
              this.$emit('on-ok');
              this.visible = false;
            } else {
              this.$Notice.error({
                desc:
                  data.message && data.message !== '' ? data.message : '${this.title}失败'
              });
            }
          })
        }
      });
    },
    /**
     * @function 关闭弹出框并重置表单
     */
    cancel() {
      this.visible = false;
      this.$refs['form'].resetFields();
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.visible = newVal;
        this.formObject = { ...this.resourceInfo };
        switch (this.title) {
          case '新增资源':
            this.resourcePath = this.defaultPath;
            this.formObject['parentId'] = this.defaultPath[this.defaultPath.length - 1];
            break;
          case '编辑资源':
            this.formObject.active = this.resourceInfo.isActive;
            this.resourcePath = this.defaultPath.slice(0, this.defaultPath.length - 1);
            if(this.resourcePath.length > 0) {
              this.selectDisabled = false;
            } else {
              this.selectDisabled = true;
            }
            break;
          default:
            break;
        }
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
