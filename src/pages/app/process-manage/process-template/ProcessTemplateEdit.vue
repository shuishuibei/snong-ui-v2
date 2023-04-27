<template>
  <i-modal
    v-model="visible"
    :title="title"
    :mask-closable="false"
    @on-cancel="cancel">
    <!--修改该区域 start -->
    <i-form
      ref="form"
      :model="actTemplate"
      :rules="ruleValidate"
      :label-width="90">
      <i-form-item prop="modelName" label="模板名称">
        <i-input type="text" v-model="actTemplate.modelName"></i-input>
      </i-form-item>
      <!-- <i-form-item prop="categoryCopy" label="分配组织">
        <Cascader
          v-show="true"
          :data="groupList"
          change-on-select
          :clearable="false"
          :render-format="format"
          v-model="actTemplate.categoryCopy"
          @on-change="groupChange"
        ></Cascader>
      </i-form-item>-->
      <i-form-item prop="key" label="模板标识">
        <i-input type="text" v-model="actTemplate.key"></i-input>
      </i-form-item>
      <i-form-item prop="description" label="描述">
        <i-input type="text" v-model="actTemplate.description"></i-input>
      </i-form-item>
    </i-form>
    <!-- 修改区域 end -->
    <div slot="footer">
      <i-button type="primary" @click.native="ok">确认</i-button>
      <i-button @click="cancel" style="margin-left: 8px">取消</i-button>
    </div>
  </i-modal>
</template>

<script>
  export default {
    name: 'ProcessTemplateEdit',
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
        ruleValidate: {
          modelName: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('模板名称不能为空'))
                } else {
                  if(!value.trim()){
                    callback(new Error('模板名称不能为空'))
                  } else {
                    callback()
                  }
                }
              }
            }
          ],
          /* categoryCopy: [
            {
              required: true
            }
          ], */
          key: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                rule = /^[A-z][A-z0-9]*$/;
                if (!value) {
                  callback(new Error('请输入模板标识'))
                } else {
                  if (rule.test(value)) {
                    callback()
                  } else {
                    callback(new Error('只能输入数字和字母，且不能以数字开头'))
                  }
                }
              }
            }
          ]
        },
        actTemplate: {},
        categoryList: {}
      };
    },
    methods: {
      ok() {
        //表单验证，当valid为true时关闭对话框
        this.$refs['form'].validate(valid => {
          //表单验证通过
          if (valid) {
            //关闭对话框
            this.visible = false;
            this.$emit('on-ok', this.actTemplate);
          }
        });
      },
      cancel() {
        //关闭对话框
        this.visible = false;
        //表单清空
        this.$refs['form'].resetFields();
        this.$emit('on-cancel');
      }
      //父组织名称级联选择完成的回调，arr即已选值
      /* groupChange(arr) {
        //传回后端的值是选中的Id所以我们只需要取数组的最后一项,重新付给我们暂时用来存的变量
        this.actTemplate.category = arr.length ? arr[arr.length - 1] : "";
      }, */
      //级联选择显示格式转换，只显示选择的最后一级名称
      /* format(labels, selectedData) {
        const index = labels.length - 1;
        const data = selectedData[index] || false;
        if (data && data.code) {
          return labels[index];
        }
        return labels[index];
      } */
    },
    watch: {
      value(newVal) {
        if (newVal) {
          this.actTemplate = Object.assign({}, this.data);
          /* this.$http
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
                    value: item.id, //级联选择时的唯一标识，因为id是唯一的，所以取id的值
                    label: item.name //级联选择时显示的资源名称
                  };
                });
              } else {
                this.$Notice.warning({
                  desc: '查询不到该组织'
                });
              }
            }); */
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
