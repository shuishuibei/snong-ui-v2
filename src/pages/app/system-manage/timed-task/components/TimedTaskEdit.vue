<!--
 * @Description: 定时任务编辑
 * @Author: ys2234
 * @Date: 2019-09-09 16:08:11
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:07:32
 -->
<template>
  <i-modal
    v-model="visible"
    :title="title"
    :mask-closable="false"
    class="timed-task-edit"
    @on-cancel="cancel">
    <i-form
      ref="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="100">
      <i-form-item label="任务名称" prop="jobName">
        <i-input
          placeholder="请输入任务名称"
          v-model="formObject.jobName">
        </i-input>
      </i-form-item>
      <i-form-item label="任务分组" prop="jobGroup">
        <i-input
          placeholder="请输入任务分组"
          v-model="formObject.jobGroup">
        </i-input>
      </i-form-item>
      <i-form-item label="任务描述" prop="description">
        <i-input
          placeholder="请输入任务描述"
          v-model="formObject.description">
        </i-input>
      </i-form-item>
      <i-form-item label="cron表达式" prop="cron">
        <i-input
          placeholder="请输入cron表达式"
          v-model="formObject.cron">
        </i-input>
      </i-form-item>
      <i-form-item label="任务全类名" prop="className">
        <i-input
          placeholder="请输入任务全类名"
          v-model="formObject.className">
        </i-input>
      </i-form-item>
      <i-form-item label="任务拥有者" prop="owner">
        <i-input
          placeholder="请输入任务拥有者"
          v-model="formObject.owner">
        </i-input>
      </i-form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click="ok">保 存</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import { required } from '@/assets/js/rule-validate.js';
export default {
  name: 'TimedTaskEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增'
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      /**
       * @property {string} id           - 任务ID
       * @property {string} jobName      - 任务名称
       * @property {string} jobGroup     - 任务分组
       * @property {string} description  - 任务描述
       * @property {string} cron         - cron表达式
       * @property {string} className    - 任务全类名
       * @property {string} owner        - 任务拥有者
       */
      formObject: {
        id: '',
        jobName: '',
        jobGroup: '',
        description: '',
        cron: '',
        className: '',
        owner: '',
        active: '',
        start: ''
      },
      ruleValidate: {
        jobName: [
          required({ message: '任务名称不能为空' })
        ],
        jobGroup: [
          required({ message: '任务分组不能为空' })
        ],
        description: [
          required({ message: '任务描述不能为空' })
        ],
        cron: [
          required({ message: 'cron表达式不能为空' })
        ],
        className: [
          required({ message: '任务全类名不能为空' })
        ],
        owner: [
          required({ message: '任务拥有者不能为空' })
        ]
      },
    };
  },
  methods: {
    ok() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$loading.show();
          let url = '',
              method = '',
              desc = '';
          if(this.data) {
            url = 'sysTimedTask/update';
            method = 'PUT';
            desc = '修改定时任务成功';
          } else {
            url = 'sysTimedTask/add';
            method = 'POST';
            desc = '新增定时任务成功';
          }
          this.$http({
            method,
            url,
            data: this.formObject
          }).then(({ data }) => {
            this.$loading.hide();
            if(data.status) {
              this.visible = false;
              this.$Notice.success({
                desc
              })
              this.$emit('on-refresh');
            }
          }).catch(() => {
            this.$loading.hide();
          })
        }
      })
    },
    cancel() {
      this.visible = false; // 关闭对话框
      this.$refs['form'].resetFields(); // 表单清空
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        if(this.data) {
          this.formObject.id = this.data.id;
          this.formObject.jobName = this.data.jobName;
          this.formObject.jobGroup = this.data.jobGroup;
          this.formObject.description = this.data.description;
          this.formObject.cron = this.data.cron;
          this.formObject.className = this.data.className;
          this.formObject.owner = this.data.owner;
        }
        /*=== 可修改 end ===*/
        this.$Notice.destroy();  // 清楚右上角提示信息
        this.visible = newVal;   // 显示对话框
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
