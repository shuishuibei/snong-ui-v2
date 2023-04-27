<template>
    <Modal v-model="visible"
           :title="title"
           :scrollable="true"
           :mask-closable="false"
           class="vertical-center-modal"
           width="950"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="120">
            <FormItem prop="taskTitle" label="技术任务标题">
                <i-input type="text"
                         v-model="formObject.taskTitle"></i-input>
            </FormItem>
            <FormItem prop="taskContent" label="技术任务内容">
                <i-input type="textarea"
                         :rows="6"
                         v-model="formObject.taskContent"></i-input>
            </FormItem>
          <FormItem prop="taskLevel" label="技术公告级别">
            <RadioGroup v-model="formObject.taskLevel">
              <Radio :label='1'>
                <span>代理商级别</span>
              </Radio>
              <Radio :label='2'>
                <span>内部工程师级别</span>
              </Radio>
            </RadioGroup>
          </FormItem>
            <FormItem prop="taskGuide" label="操作指导">
                <i-input type="textarea"
                         :rows="4"
                         v-model="formObject.taskGuide"></i-input>
            </FormItem>
          <FormItem prop="file" label="附件上传">
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
            <!--<div style="margin-top: 10px;line-height: 22px;color: #999">支持扩展名: .doc .docx .xls .xlsx</div>-->
          </FormItem>
          <FormItem prop="project" label="选择项目">
            <div class="checkBox-project">
              <Checkbox
                :indeterminate="indeterminate"
                v-model="checkAll"
                @click.prevent.native="handleCheckAll"
                :disabled="checkAllDisabled"
              >全部项目</Checkbox>
              <card :padding=10>
                <p slot="title">远程项目</p>
                <CheckboxGroup v-model="checkId" @on-change="checkIdChange">
                  <Checkbox
                    v-for="(item, index) in projectTreeData.remoteChildren"
                    :key="index"
                    :label="item.id"
                    :disabled="item.disabled"
                  >{{ item.title }}</Checkbox>
                </CheckboxGroup>
              </card>
              <card :padding=10>
                <p slot="title" style="">本地项目</p>
                <CheckboxGroup v-model="checkId" @on-change="checkIdChange">
                  <Checkbox
                    v-for="(item, index) in projectTreeData.localChildren"
                    :key="index"
                    :label="item.id"
                    :disabled="item.disabled"
                  >{{ item.title }}</Checkbox>
                </CheckboxGroup>
                </card>
            </div>
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
                ruleValidate: {
                  taskTitle: [
                        {
                            required: true,
                            message: "技术任务标题不能为空",
                        }
                    ],
                  taskContent: [
                        {
                            required: true,
                            message: "技术任务内容不能为空",
                        }
                    ]
                },  // 将表单校验挂载到组件data
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                    id: '',
                    taskTitle: '', // 技术任务标题
                    taskContent: '', // 技术任务内容
                    taskLevel: 1, // 技术公告级别
                    taskGuide: '', // 技术指导
                    file: '',
                    fileName:''
                },
                projectTreeData: {},
                indeterminate: true,
                checkAll: false,
                checkId: [], // 选中的项目id
                ids: [], // 所有项目id
                checkAllDisabled: false, // 全选禁止
                getCheckId: [], // 接口获取到的选中项目id
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
            ok() {
                // 表单验证，当valid为true时关闭对话框
                this.$refs['form'].validate((valid) => {
                    // 表单验证通过
                    if (valid) {
                        this.formObject.projectIds = this.checkId
                      //以formData形式上传
                      let formData = new FormData();
                      formData.append('file',this.formObject.file);
                      formData.append('taskTitle',this.formObject.taskTitle);
                      formData.append('taskContent',this.formObject.taskContent);
                      formData.append('taskLevel',this.formObject.taskLevel);
                      formData.append('taskGuide',this.formObject.taskGuide);
                      formData.append('projectIds',this.formObject.projectIds);
                        if(!this.dataList.add){
                          formData.append('id',this.formObject.id);
                            this.$http.put('task/update', formData)
                            .then(({data}) => {
                                // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                                if (data.status) {
                                    // 新增成功后的提示信息
                                    this.$Notice.success({
                                        desc: '修改技术任务成功'
                                    });
                                    this.$parent.getTableData({loading: true});
                                    this.visible = false;
                                }
                            })
                        } else {
                          this.$http.post('task/add', formData)
                          .then(({data}) => {
                              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                              if (data.status) {
                                  // 新增成功后的提示信息
                                  this.$Notice.success({
                                      desc: '新增技术任务成功'
                                  });
                                  this.$parent.getTableData({loading: true});
                                  this.visible = false;
                              }
                          })
                        }
                    }
                })

            },
            cancel() {
                // 关闭对话框
                this.visible = false;
                //表单清空
                this.$refs['form'].resetFields();
                this.$emit('on-cancel');
            },
            getProjectTreeList() {
              this.$http.get(`/task/project/tree?id=${this.dataList.id}`).then(({ data }) => {
                if (data.status) {
                    this.projectTreeData = data.data
                    this.ids = []
                    this.getCheckId = []
                    this.projectTreeData.localChildren.filter(item => {
                        this.ids.push(item.id)
                        if(item.checked) {
                            this.getCheckId.push(item.id)
                        }
                    })
                  this.projectTreeData.remoteChildren.filter(item => {
                    this.ids.push(item.id)
                    if(item.checked) {
                      this.getCheckId.push(item.id)
                    }
                  })
                    this.checkId = this.getCheckId
                    this.indeterminate = true
                    this.checkAll = false
                    this.checkAllDisabled = false
                    if(this.checkId.length !== 0 && this.checkId.length === this.ids.length) {
                        this.indeterminate = false
                        this.checkAll = true
                        this.checkAllDisabled = true
                    }
                }
              });
            },
            handleCheckAll() {
                if(!this.checkAllDisabled) {
                    if (this.indeterminate) {
                        this.checkAll = false;
                    } else {
                        this.checkAll = !this.checkAll;
                    }
                    this.indeterminate = false;
                    if (this.checkAll) {
                        this.checkId = this.ids;
                    } else {
                        this.checkId = this.getCheckId;
                    }
                }
            },
            checkIdChange(idList) {
                if (idList.length !== 0 && idList.length == this.projectTreeData.children.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (idList.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            }
        },
      watch: {
            value(newVal) {
                if (newVal) {
                    this.getProjectTreeList();
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
                    if(this.title == '修改技术任务'){
                        this.formObject.id = this.dataList.id;
                        this.formObject.taskTitle = this.dataList.taskTitle;
                        this.formObject.taskContent = this.dataList.taskContent;
                        this.formObject.taskGuide = this.dataList.taskGuide;
                        let path = this.dataList.attachmentAddr;
                        if (path) {
                          this.formObject.fileName = path.substring(path.lastIndexOf('\\')+1);
                        }
                    }
                    this.formObject.fileName = '',
                    this.formObject.file = '',
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
    height: 260px;
    overflow-y: auto;
  }
  /deep/ .ivu-card-head {
    padding: 5px 12px !important;
    p {
      font-size: 11px;
    }
  }
</style>
