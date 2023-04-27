<template>
  <i-modal v-model="visible" :title="title" width="600">
    <div style="width:100%;overflow-x:scroll">
      <img ref="img" class="img" />
    </div>
  </i-modal>
</template>

<script>
export default {
  name: 'PrcsClassificationDetails',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      //标题
      type: String,
      default: '流程图'
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    ok() {
      // 表单验证，当valid为true时关闭对话框
      this.$refs['form'].validate(valid => {
        // 表单验证通过
        if (valid) {
          // 关闭对话框
          this.visible = false;
        }
      });
    },
    cancel() {
      // 关闭对话框
      this.visible = false;
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.$http({
          url: `act-define/processImage/${this.id}`,
          method: 'GET',
          responseType: 'blob'
        }).then(res => {
          if (res.status) {
            let url = window.URL.createObjectURL(res.data);
            let img = this.$refs['img'];
            img.setAttribute('src', url);
          }
        });
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
