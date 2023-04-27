<template>
    <Modal v-model="visible"
           :title="title"
           :scrollable="true"
           :mask-closable="false"
           class="vertical-center-modal"
           width="500"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="120">
          <FormItem prop="file" label="Excel上传">
            <div class="upload-file">
              <Upload
                  ref="upload"
                  type="drag"
                  action=""
                  :before-upload="handleUpload">
                <div style="padding: 5px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p v-if="formObject.file === ''">点击或拖拽文件进行上传</p>
                  <p v-if="formObject.file != null" style="color: #3399ff">{{formObject.fileName}}</p>
                </div>
              </Upload>
            </div>
            <div style="margin-top: 10px;line-height: 22px;color: #999">支持扩展名: .xls .xlsx</div>
          </FormItem>
          <FormItem prop="download" label="模板下载">
            <i-button
              @click="download">
              <i class="iconfont icon-xiazai">下载</i>
            </i-button>
          </FormItem>
        </Form>
        <!-- 修改区域 end -->
        <div slot="footer">
            <Button type="primary" @click.native="ok">确认</Button>
            <Button  @click="cancel" style="margin-left: 30px">取消</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        name: "user-manage-edit",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {   //标题
                type: String,
                default: '新增'
            },
            dataList: {
                type: Object
            }
        },
        data() {
            return {
                visible: false,
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                    file: '',
                    fileName:''
                },
              ruleValidate: {
                file: [
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (this.formObject.fileName !== '') {
                        // 匹配 excel
                        let excelList = ['xls', 'xlsx'],
                            fileName = this.formObject.fileName,
                            fileArr = fileName.split('.'),
                            suffix = fileArr[fileArr.length - 1],
                            result = excelList.some(function (item) {
                                  return item == suffix;
                            });
                        if (!result) {
                          callback('上传文件格式错误。');
                        } else {
                          callback();
                        }
                      } else {
                        callback('上传文件不能为空。');
                      }
                    }
                  }
                ]
              },  // 将表单校验挂载到组件data
                fileSuccess: false,
            }
        },
        methods: {
            handleUpload (file) {
              this.formObject.fileName = file.name;
              this.formObject.file = file;
              //阻止自动上传
              return false;
            },
          /**
           * @function 提交表单
           * @description 点击确认按钮触发
           */
          download() {
            this.$http({
              method: 'GET',
              url: '/host/download',
              responseType: 'blob'
            }).then((res)=>{
              let a = document.createElement('a'),
                url = window.URL.createObjectURL(res.data);
              a.href = url;
              a.download = 'host_template.xlsx';
              a.click();
              window.URL.revokeObjectURL(url);
            })
          },
            ok() {
                // 表单验证，当valid为true时关闭对话框
                this.$refs['form'].validate((valid) => {
                  // 表单验证通过
                  if (valid) {
                    //以formData形式上传
                    let formData = new FormData();
                    formData.append('file',this.formObject.file);
                        this.$http.post('host/import', formData)
                        .then(({data}) => {
                            // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                            if (data.status) {
                                // 新增成功后的提示信息
                                this.$Notice.success({
                                    desc: '导入主机资产数据成功。'
                                });
                                this.$parent.getTableData({loading: true});
                                this.visible = false;
                            } else {
                              // 新增成功后的提示信息
                              this.$Notice.error({
                                desc: data.message && data.message !== '' ? data.message : '导入主机资产数据失败。'
                              });
                            }
                        })
                      }
                })

            },
            cancel() {
                // 关闭对话框
                this.visible = false;
                //表单清空
                this.$refs['form'].resetFields();
                this.formObject.fileName = '';
                this.formObject.file = '';
                this.$emit('on-cancel');
            },
        },
      watch: {
            value(newVal) {
                if (newVal) {
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
                    this.formObject.fileName = '';
                    this.formObject.file = '';
                    // if(this.title == '修改技术任务'){
                    //     this.formObject.id = this.dataList.id;
                    //     this.formObject.taskTitle = this.dataList.taskTitle;
                    //     this.formObject.taskContent = this.dataList.taskContent;
                    //     this.formObject.taskGuide = this.dataList.taskGuide;
                    //     let path = this.dataList.attachmentAddr;
                    //     if (path) {
                    //       this.formObject.fileName = path.substring(path.lastIndexOf('\\')+1);
                    //     }
                    // }
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

<style scoped lang="less">
  .checkBox-project {
    height: 220px;
    overflow-y: auto;
  }
</style>
