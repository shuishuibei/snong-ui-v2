<!--
 * @Description: 修改硬盘名称和描述组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-25 14:58:24
 -->

<template>
  <i-modal v-model="visible" :mask-closable="false" :title="title">
    <div style="text-align:center">
      <div class="basicInfo">
        <div class="formContent">
          <i-form ref="formRef" :label-width="90" :rules="ruleValidate" :model="formValidate">
            <div class="formRow">
              <i-form-item label="名称" prop="name" class="formUnit">
                <i-input v-model="formValidate.name"></i-input>
              </i-form-item>
            </div>
            <div class="formRow">
              <i-form-item label="描述" prop="description" class="formUnit">
                <i-input type="textarea" :rows="4" v-model="formValidate.description"></i-input>
              </i-form-item>
            </div>
          </i-form>
        </div>
      </div>
    </div>
    <div slot="footer">
      <i-button type="primary" @click="submit">确 认</i-button>
      <i-button @click="visible = false;">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
  
  export default {
    name: 'UpdateDisk',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object
      },
      title: {
        type: String
      }
    },
    data() {
      return {
        visible: false,
        id: '',
        name: '',
        description: '',
        formValidate: {
          name: '',
          description: ''
        },
        ruleValidate: {
          name: [
            {
              required: true,
              message: '名称不能为空'
            }
          ],
          description: [{}]
        }
      };
    },
    methods: {
      submit() {
        this.$refs['formRef'].validate(valid => {
          if (valid) {
            this.$loading.show();
            this.$http
                .put('volume/update', {
                  name: this.formValidate.name,
                  description: this.formValidate.description,
                  id: this.id
                })
                .then(({data}) => {
                  this.$loading.hide();
                  if (data.status) {
                    this.visible = false;
                    this.$Notice.success({desc: '修改成功！'});
                    this.$emit('updateDisks');
                  }
                })
          }
        });
      }
    },
    watch: {
      value(newVal) {
        if (newVal) {
          /*=== 可修改 start ===*/
          this.id = this.data.id;
          this.formValidate.name = this.data.name;
          this.formValidate.description = this.data.description;
          /*=== 可修改 end ===*/
          this.$Notice.destroy(); //清楚右上角提示信息
          this.visible = newVal; //显示对话框
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