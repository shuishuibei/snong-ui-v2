<template>
    <Modal v-model="visible"
           :title="title"
           :scrollable="true"
           :mask-closable="false"
           class="vertical-center-modal"
           width="650"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="100">
            <FormItem prop="projectName" label="告警Ids">
                <i-input type="text"
                         v-model="formObject.alarmIds" disabled></i-input>
            </FormItem>
          <FormItem prop="confirmContent" label="告警确认内容">
            <i-input type="textarea"
                     v-model="formObject.confirmContent"></i-input>
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
        name: "alarm-ConfirmBatch",

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
                type: Array
            }
        },
        data() {
            return {
                visible: false,
                projectList: [], // 项目列表
                ruleValidate: {

                },  // 将表单校验挂载到组件data
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                  alarmIds: '',
                  confirmContent: '', //
                  confirmPerson_id: '', //
                  confirmPerson_name: '',
                  confirmTime: '',
                  confirmPersonId: '',
                  confirmPersonName: ''
                },
                projectTreeData: {},
                indeterminate: true,
                checkAll: false,
                checkId: [], // 选中的项目id
                ids: [], // 所有项目id
                checkAllDisabled: false, // 全选禁止
                getCheckId: [], // 接口获取到的选中项目id
                fileSuccess: false,
                forbidden: false,
                confirmPersonId: "", //获取当前用户id
                confirmPersonName: ""
            }
        },
        methods: {
            ok() {
                this.getUser();
              // 表单验证，当valid为true时关闭对话框
                this.$refs['form'].validate((valid) => {
                    // 表单验证通过
                    if (valid) {
                          this.$http.put('alarm/confirm', this.formObject)
                            .then(({data}) => {
                              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                              if (data.status) {
                                // 新增成功后的提示信息
                                this.$Notice.success({
                                  desc: '告警批量确认成功'
                                });
                                this.$parent.getTableData({loading: true});
                                this.visible = false;
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
                this.$emit('on-cancel');
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
            getUser(){
              this.formObject.confirmPersonId = this.$store.state.login.userId; //获取当前用户id
              this.formObject.confirmPersonName = this.$store.state.login.userName; //获取当前用户名
            },
        },
      watch: {
            value(newVal) {
                if (newVal) {
                    this.formObject.alarmIds=""
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
                    for(var i=0;i<this.dataList.length;i++){
                      this.formObject.alarmIds += this.dataList[i]+","
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
        },
      created() {
          this.getUser();
      }
    }
</script>

<style scoped lang="less">
  .checkBox-project {
    height: 220px;
    overflow-y: auto;
  }
</style>
