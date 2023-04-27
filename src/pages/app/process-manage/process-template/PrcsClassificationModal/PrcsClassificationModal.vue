<template>
  <div>
    <i-modal
      v-model="visible"
      :title="title"
      :mask-closable="false"
      width="600"
      class="create-disk-modal"
      @on-cancel="cancel">
      <i-form
        ref="formRef"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="110">
        <i-form-item
          label="流程分类名称："
          prop="optName">
          <i-input
            v-model="formValidate.optName"
            placeholder="请输入流程分类名称"
            :disabled="shouldDisabled" />
        </i-form-item>
        <i-form-item
          label="组织："
          prop="groupId">
          <i-cascader
            v-show="true"
            :data="groupList"
            change-on-select
            :clearable="false"
            :render-format="format"
            @on-change="handleCascaderChange"
            v-model="formValidate.groupId"
            :disabled="shouldDisabled"></i-cascader>
        </i-form-item>
        <i-form-item label="选择操作：">
          <i-select
            v-model="formValidate.optType"
            :disabled="shouldDisabled">
            <i-option
              :value="item.type"
              v-for="item in selectOptions"
              :key="item.id">
              {{ item.name }}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item
          label="流程定义名称："
          prop="defineNameString">
          <i-select v-model="formValidate.defineNameString">
            <i-option
              v-for="item in SelectDefineName"
              :value="JSON.stringify(item)"
              :key="item.id">
              {{ item.name }}
            </i-option>
          </i-select>
        </i-form-item>
      </i-form>
      <div slot="footer">
        <i-button
          type="primary"
          @click.native="ok">
          确认
        </i-button>
        <i-button @click="cancel">取消</i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
/* eslint-disable */
import { buildTree } from '@/assets/js/utils';

export default {
  name: 'PrcsClassificationModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String
    },
    // 修改时传入的 ID
    id: {
      type: String,
      default: ''
    },
    shouldDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 控制弹出框的显示与隐藏
      visible: false,
      // 选择操作 Select 内容
      selectOptions: [
        {
          id: 1,
          name: '申请',
          type: 'OPT_ACT_ADD'
        },
        {
          id: 2,
          name: '变更',
          type: 'OPT_ACT_UPDATE'
        },
        {
          id: 3,
          name: '退订',
          type: 'OPT_ACT_DELETE'
        }
      ],
      groupList: [], // 级联的组织选择
      groupSelectedId: [], // 级联的选择 ID 数组
      SelectDefineName: [], // 流程定义名称 SelectDefineName
      formValidate: {
        defineNameString: '', // 流程定义 value JSON Obejct 类型
        optName: '', // 流程分类名称
        projectId: '', // 组织 ID
        projectName: '', // 组织 Name
        groupId: [], // 组织 ID 验证
        optType: 'OPT_ACT_ADD', // 选择操作类型
        processDefId: '', // 流程定义名称 ID
        processDefKey: '', // 流程定义名称 Key
        processDefName: '' // 流程定义名称 Name
      },
      ruleValidate: {
        optName: [
          {
            required: true,
            message: '流程分类名称不能为空'
          }
        ],
        /* groupId: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("组织类别不能为空"));
                } else if (value.length == 1) {
                  callback(new Error("请选择子组织"));
                } else {
                  callback();
                }
              }
            }
          ], */
        defineNameString: [
          {
            required: true
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    // 父组织名称级联选择完成的回调，arr即已选值
    handleCascaderChange(value, selectedData) {
      this.formValidate.projectId = selectedData[selectedData.length - 1].value;
      this.formValidate.projectName = selectedData[selectedData.length - 1].label;
    },
    // 级联选择显示格式转换，只显示选择的最后一级名称
    format(labels, selectedData) {
      const index = labels.length - 1;
      const data = selectedData[index] || false;
      if (data && data.code) {
        return labels[index];
      }
      return labels[index];
    },
    // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
    handleReset() {
      this.$refs['formRef'].resetFields(); //对整个表单进行重置，将所有字段值重置为空并移除校验结果
    },
    ok() {
      if (this.formValidate) {
        let processDefObj = JSON.parse(this.formValidate.defineNameString);
        this.formValidate.processDefId = processDefObj.id;
        this.formValidate.processDefKey = processDefObj.key;
        this.formValidate.processDefName = processDefObj.name;
        this.$refs['formRef'].validate(valid => {
          if (valid) {
            this.$emit('on-ok', this.formValidate);
            this.visible = false;
          }
        });
      }
    },
    cancel() {
      this.visible = false;
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.handleReset();
        this.SelectDefineName = [];
        // 如果存在 id，则进行修改，否则进行新增
        if (this.id) {
          this.$http({
            url: `/act-classification/${this.id}`,
            method: 'GET'
          }).then(({ data }) => {
            if (data.status) {
              let records = data.data;
              let obj = {};
              this.formValidate = Object.assign({}, records);
              // 组织渲染
              this.formValidate.groupId = [this.formValidate.projectId];
              this.groupList = [
                {
                  value: this.formValidate.projectId,
                  label: this.formValidate.projectName
                }
              ];
              // 流程定义名称渲染
              obj['id'] = records.processDefId;
              obj['name'] = records.processDefName;
              obj['key'] = records.processDefKey;
              this.formValidate.defineNameString = JSON.stringify(obj);
              this.SelectDefineName.push(obj);
              this.$http({
                url: '/act-define/listLastVersion',
                method: 'POST'
              }).then(({ data }) => {
                if (data.status) {
                  let arr = data.data.filter((value, index) => {
                    return value.name !== obj.name;
                  });
                  arr.unshift(obj);
                  this.SelectDefineName = arr;
                }
              });
            }
          });
        } else {
          // 获取流程定义名称 Select 数据
          this.$http({
            url: '/act-define/listLastVersion',
            method: 'POST'
          }).then(({ data }) => {
            if (data.status) {
              this.SelectDefineName = data.data;
            }
          });
          // 获取组织 Cascader 数据
          this.$http
            .get('group/list', {
              params: {
                groupName: this.searchName
              }
            })
            .then(({ data }) => {
              if (data.data && data.data.length) {
                this.groupList = buildTree(data.data, 'createDate', item => {
                  return {
                    parentId: item.parentId,
                    value: item.id, // 级联选择时的唯一标识，因为id是唯一的，所以取id的值
                    label: item.name // 级联选择时显示的资源名称
                  };
                });
              } else {
                this.$Notice.warning({
                  desc: '查询不到该组织'
                });
              }
            });
        }
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
/* eslint-enable */
</script>
