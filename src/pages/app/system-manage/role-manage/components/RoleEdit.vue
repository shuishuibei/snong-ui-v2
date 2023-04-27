<!--
 * @Description: 角色编辑
 * @Author: ys2234
 * @Date: 2019-09-09 16:08:11
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-18 10:14:01
 -->
<template>
  <i-modal
    width="500px"
    :value="value"
    :title="title"
    :mask-closable="false"
    @on-cancel="$emit('input', false)">
    <i-form
      ref="formCustom"
      :model="formData"
      :rules="formRules"
      :label-width="80">
      <i-form-item label="角色名称" prop="name">
        <i-tooltip placement="right">
          <i-input
            type="text"
            placeholder="请输入角色名称"
            v-model="formData.name" />
          <same-name-tips></same-name-tips>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="数据权限" prop="owner" v-if="!node">
        <i-radio-group v-model="formData.owner" type="button">
          <i-radio :label="0">
            <span>全部数据</span>
          </i-radio>
          <i-radio :label="1">
            <span>部门数据</span>
          </i-radio>
          <i-radio :label="2">
            <span>个人数据</span>
          </i-radio>
        </i-radio-group>
      </i-form-item>
      <i-form-item label="角色描述" prop="description">
        <i-tooltip content="有效长度0-255" placement="right">
          <i-input type="textarea" :rows="6"
            placeholder="请输入角色描述"
            :maxlength="255"
            v-model="formData.description">
          </i-input>
        </i-tooltip>
      </i-form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click="submit">确 认</i-button>
      <i-button @click="$emit('input', false)" style="margin-left: 8px">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import { required, sameName } from '@/assets/js/rule-validate.js';
import { SameNameTips } from '@/assets/js/tool-tips.js';
export default {
  name: 'RoleManageEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新建'
    },
    node: {
      type: Object
    }
  },
  components: {
    'same-name-tips': SameNameTips
  },
  data() {
    return {
      /**
       * 角色form表单
       * @property {string} name         - 角色名称
       * @property {string} description  - 角色描述
       * @property {string} owner        - 所有者
       * @property {number} active       - 角色名称
       * @property {string} roleLevel    - 角色等级
       */
      formData: {
        name: '',
        description: '',
        owner: 2,
        active: 1
      },
      roleLevelList: [], // 角色等级下拉列表
      /* 角色form表单校验 */
      formRules: {
        name: [
          required({ message: '角色名称不能为空' }),
          sameName({ message: '角色名称格式不正确' })
        ],
        owner: [
          required({ type: 'number' }),
        ],
        active: [required({ type: 'number' })]
      }
    };
  },
  methods: {
    /**
     * @function 提交表单
     * @description 点击确认按钮触发
     */
    submit() {
      this.$refs['formCustom'].validate(valid => {
        if (valid) {
          /* 不直接发送formData，因为单选框Radio绑定的值必须是String或者Number，不能是Boolean */
          let data = { ...this.formData };
          /* 将active由1/0转换为布尔值 */
          data.active = !!data.active;
          this.$emit('on-ok', data);
        }
      });
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.formData = { ...this.formData, ...this.node };
          /* 将active由布尔值转换为1/0 */
          this.formData.owner = Number(this.formData.owner);
        });
      } else {
        this.$refs['formCustom'].resetFields();
      }
    }
  }
};
</script>
