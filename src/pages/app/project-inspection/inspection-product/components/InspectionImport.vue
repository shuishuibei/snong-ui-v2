<template>
    <Modal v-model="visible"
           :title="title"
           :scrollable="true"
           :mask-closable="false"
           class="vertical-center-modal"
           width="800"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="120">
          <FormItem label="项目名称" prop="projectName">
            <Select v-model="formObject.projectName" @on-change="projectChange" :labelInValue="true"
                    filterable clearable @on-clear="projectClear" ref="selectProject">
              <Option v-for="item in projectList" :value="item.projectName" :key="item.id">{{ item.projectName }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="file" label="压缩包上传">
            <div class="upload-file">
              <Upload
                  multiple
                  :format="['zip']"
                  ref="upload"
                  type="drag"
                  action=""
                  :before-upload="handleUpload">
                <div style="padding: 5px 0">
                  <span v-if="formObject.file.length === 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>可点击或拖拽多个文件进行上传</p>
                  </span>
                  <span v-if="formObject.file.length != 0"  style="color: #3399ff">
                    <p class="upload-file-def" v-for="(item, index) in formObject.file">{{item.name}}</p>
                  </span>
                </div>
              </Upload>
            </div>
          </FormItem>
          <div style="margin-top: 10px;line-height: 22px;color: #f50606">
            <p>1.请先执行巡检脚本得到.zip扩展名的巡检数据包，然后再进行上传。</p>
            <p>2.可一次上传同一项目的多个巡检数据包；不同项目的巡检数据包，请分批上传。</p>
            <p>3.同一天请勿重复上传同一项目的巡检数据包，上传后不会保存数据，避免数据重复。</p>
          </div>
        </Form>
        <!-- 修改区域 end -->
        <div slot="footer">
            <Button type="primary" @click.native="ok">确认</Button>
            <Button  @click="cancel" style="margin-left: 30px">取消</Button>
        </div>
    </Modal>
</template>

<script>
    // import {forEach} from "../../../../../lib/util";

    export default {
        name: "inspection-import",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {   //标题
                type: String,
                default: '新增'
            }
        },
        data() {
            return {
              visible: false,
              projectList: [], // 项目列表
              // 表单绑定的数据对象，FormItem的prop对应该对象的字段
              formObject: {
                  projectName:'',
                  // productName:'CAS',
                  file: [],
                  fileName:''
              },
              ruleValidate: {
                file: [
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (this.formObject.file.length !== 0) {
                        // 匹配 zip文件
                        let zipList = ['zip'],
                          files = this.formObject.file,
                          result = true;
                        files.forEach((file) => {
                          if (zipList.indexOf(file.name.replace(/.+\./, "")) <= -1) {
                            result = false
                          }
                        })
                        if (!result) {
                          callback('上传文件格式错误，请上传zip格式文件。');
                        } else {
                          callback();
                        }
                      } else {
                        callback('上传文件不能为空。');
                      }
                    }
                  }
                ],
                projectName: [
                  {
                    required: true,
                    message: "项目名称不能为空",
                  }
                ],
                // productName: [
                //   {
                //     required: true,
                //     message: "产品类型不能为空",
                //   }
                // ]
              },  // 将表单校验挂载到组件data
            }
        },
        methods: {
          getProjectList(){
            this.$http({
              method:'GET',
              url:'/project-management/listAll'
            }).then(({data})=>{
              if(data.status){
                this.projectList = data.data;
                // 新增模式下
                // this.formObject.projectId = this.projectList[0].id;
                // this.formObject.projectName = this.projectList[0].projectName;
              }
            })
          },
          projectChange(value){
            if(value){
              this.formObject.projectName = value.label;
            }
          },
          projectClear(){
            this.formObject.projectName = '';
          },
          handleUpload (file) {
            // this.formObject.fileName = file.name;
            this.formObject.file.push(file);
            //阻止自动上传
            return false;
          },
          ok() {
              // 表单验证，当valid为true时关闭对话框
              this.$refs['form'].validate((valid) => {
                // 表单验证通过
                if (valid) {
                  //以formData形式上传
                  let formData = new FormData();
                  for (const item of this.formObject.file) {
                    formData.append("file", item);
                  }
                  this.$loading.show();
                  // formData.append('file',this.formObject.file);
                  this.$http.post(`/inspection/import?project=${this.formObject.projectName}`, formData)
                  .then(({data}) => {
                      // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                      if (data.status) {
                          // 新增成功后的提示信息
                          this.$Notice.success({
                              desc: '导入巡检压缩包数据成功。'
                          });
                          // this.$parent.getData({loading: true});
                          this.visible = false;
                      } else {
                        // 新增成功后的提示信息
                        this.$Notice.error({
                          desc: data.message && data.message !== '' ? data.message : '导入巡检压缩包数据失败。'
                        });
                      }
                    this.$loading.hide();
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
              this.formObject.file = [];
              this.$emit('on-cancel');
          },
        },
      watch: {
            value(newVal) {
                if (newVal) {
                  this.getProjectList();
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
                    this.formObject.fileName = '';
                    this.formObject.file = [];
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
  .upload-file-def {
    border: 3px double
  }
</style>
