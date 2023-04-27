<template>
  <Modal
      width="800px"
      :value="value"
      :title="title"
      :mask-closable="false"
      @on-cancel="$emit('input', false)">
    <Form ref="formCustom" :model="formData" :label-width="120">
      <FormItem prop="taskTitle" label="技术任务标题" >
        <i-input type="text" v-model="currentRow.taskTitle" :readonly=true ></i-input>
      </FormItem>
      <FormItem prop="taskContent" label="技术任务内容">
        <i-input type="textarea" v-model="currentRow.taskContent" :rows="5" :readonly=true></i-input>
      </FormItem>
      <FormItem prop="taskContent" label="技术风险指导" v-if="currentRow.attachmentAddr !== '' && currentRow.attachmentAddr != null ">
        <i-button
          @click="download">
          <i class="iconfont icon-xiazai">下载</i>
        </i-button>
<!--        <Button  @click="download"><Icon type="android-download" size="30"></Icon></Button>-->
      </FormItem>
      <FormItem prop="status" label="排查状态">
        <RadioGroup v-model="formData.status">
          <Radio :label='1'>
            <span>不涉及</span>
          </Radio>
          <Radio :label='2'>
            <span>处理中</span>
          </Radio>
          <Radio :label='3'>
            <span>已完成</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem prop="file" label="排查结果上传">
        <div class="upload-file">
          <Upload
            ref="upload"
            type="drag"
            action=""
            :before-upload="handleUpload">
            <div style="padding: 5px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p v-if="formData.file === ''">点击或拖拽文件进行上传</p>
              <p v-if="formData.file != null" style="color: #3399ff">{{formData.fileName}}</p>
            </div>
          </Upload>
        </div>
      </FormItem>
      <FormItem prop="content" label="反馈内容">
        <i-input type="textarea" v-model="formData.content" :rows="10"></i-input>
      </FormItem>
    </Form>
    <div slot="footer">
      <i-button type="primary" @click="submit">确 认</i-button>
      <i-button @click="$emit('input', false)" style="margin-left: 8px">取 消</i-button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "TaskCheckEdit",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '排查'
    },
    currentRow: {
      type: Object
    }
  },
  data() {
    return {
      formData: {
        taskTitle: '',
        taskContent: '',
        file: '',
        fileName:'',
        status: 1,
        content: ''
      }
    };
  },
  methods: {
    /**
     * @function 提交表单
     * @description 点击确认按钮触发
     */
    download() {
      this.$http({
        method: 'GET',
        url: `/task/download/${this.currentRow.taskId}`,
        responseType: 'blob'
      }).then((res)=>{
        let a = document.createElement('a'),
            url = window.URL.createObjectURL(res.data),
            filename = this.currentRow.attachmentAddr;
        a.href = url;
        a.download = filename.substring(filename.lastIndexOf('\\')+1);
        a.click();
        window.URL.revokeObjectURL(url);
      })
    },
    handleUpload (file) {
      this.formData.fileName = file.name;
      this.formData.file = file;
      //阻止自动上传
      return false;
    },
    submit() {
      this.$refs['formCustom'].validate(valid => {
        if (valid) {
          //以formData形式上传
          let formObject = new FormData();
          formObject.append('file',this.formData.file);
          formObject.append('status',this.formData.status);
          formObject.append('content',this.formData.content);
          formObject.append('ids[]',this.currentRow.id);
          /* 不直接发送formData，因为单选框Radio绑定的值必须是String或者Number，不能是Boolean */
          // let data = { ...this.formData };
          /* 将active由1/0转换为布尔值 */
          // data.ids = [this.currentRow.id];
          this.$emit('on-ok', formObject);
          this.$refs['formCustom'].resetFields();
        }
      });
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.$refs['formCustom'].resetFields();
        this.formData.fileName = '',
          this.formData.file = '',
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
}
</script>

<style scoped>

</style>
