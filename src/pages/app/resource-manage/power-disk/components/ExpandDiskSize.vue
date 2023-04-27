<!--
 * @Description: power硬盘扩容弹框
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:18:09
 -->
<template>
  <i-modal
    v-model="visible"
    :scrollable="true"
    class="expand-disk-modal"
    :mask-closable="false">
    <template #header>
      <h3c-title
        :title="title"
        :is-modal="true"
        :style-set="{'border-bottom': 'none'}">
      </h3c-title>
    </template>
    <i-form :model="formItem" ref="formItem" :rules="ruleValidate" :label-width="100">
      <i-form-item label="名称">
        <i-input
          style="width:250px;"
          v-model="diskName"
          disabled/>
      </i-form-item>
      <i-form-item label="容量（GB）" prop="size" required>
        <i-input-number
          v-model="formItem.size"
          :max="sizeMax"
          :min="sizeMin"
          @on-change="changePowerVolumeSize">
        </i-input-number>
      </i-form-item>
      <br>
    </i-form>
    <div slot="footer">
      <i-button type="primary" class="save" @click="expandDiskSize">确 认</i-button>
      <i-button @click="visible=false">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
  import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件

  export default {
    name: 'ExpandDiskSize',
    components: {
      'h3c-title': H3cTitle
    },
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
      var validatesize = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('硬盘容量不能为空'));
        } else {
          callback();
        }
      };

      return {
        formItem: {
          size: 0
        },
        diskId: '',
        diskName: '',
        storageType: '',
        visible: false,
        volumeNormRange: {},
        sliderData: [10, 20, 30, 40, 80, 100],
        sizeMax: 0,
        sizeMin: 1,
        ruleValidate: {
          size: [{validator: validatesize, trigger: 'blur'}],
        }
      };
    },
    methods: {
      changePowerVolumeSize(size) {
        if (/\d+\.\d+/.test(size)) {
          this.$nextTick(() => {
            this.formValidate.size = parseInt(size);
          });
        }
      },
      init() {
        this.$nextTick(() => {
          this.$http
            .get(`power/volume/${this.diskId}/flavor`)
            .then(({data}) => {
              if (data.status) {
                this.sizeMax = data.data;
                this.visible = true;
              } else {
                this.visible = false;
                this.$emit('input', false);
              }
            })
        });
      },
      expandDiskSize() {
        this.$refs['formItem'].validate((valid) => {
          if (valid) { // 表单验证通过执行
             this.$loading.show();
             this.$http
               .post(`power/volume/expand/${this.diskId}/${this.formItem.size}`)
               .then(({data}) => {
                 if (data.status) {
                   this.$Notice.success({desc: '成功加入申请变更清单!'});
                   this.$refs['formItem'].resetFields();
                   this.visible = false;
                   this.$emit('_getData');
                 }
               });
             this.$loading.hide();
          }
        });
      },
    },
    watch: {
      value(newVal) {
        if (newVal) {
          this.diskId = this.data.id;
          this.diskName = this.data.name;
          this.storageType = this.data.storageType;
          this.init();
          this.$refs['formItem'].resetFields();
          this.formItem.size = this.data.originSize;
          this.$Notice.destroy(); // 清除右上角提示信息
        }
      },
      visible(newVal) {
        if (!newVal) {
          this.$emit('input', newVal);
        }
      },
    }
  };
</script>
