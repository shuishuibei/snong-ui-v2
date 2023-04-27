<template>
    <Modal v-model="visible"
           :title="title"
           :scrollable="true"
           :mask-closable="false"
           class="vertical-center-modal"
           width="450"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="100">
            <FormItem prop="userName" label="管理员账号">
                <i-input type="text"
                         v-model="formObject.userName"></i-input>
            </FormItem>
            <FormItem prop="password" label="管理员密码">
                <i-input type="password"
                         v-model="formObject.password"></i-input>
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
        name: "host-assets-edit",

        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {   //标题
                type: String,
                default: '主机认证'
            },
            dataList: {
                type: Object
            },
            ids: {
            type: Array
          }
        },
        data() {
            return {
                visible: false,
              projectList: [], // 项目列表
                ruleValidate: {
                  userName: [
                        {
                            required: true,
                            message: "管理员账号不能为空",
                        }
                    ],
                  password:[
                    {
                      required: true,
                      message: "管理员密码不能为空",
                    }
                  ]
                },  // 将表单校验挂载到组件data
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                  userName: '', // 主机名称
                  password: '', // 主机IP
                  ip: '',
                  projectId: '' // 所属项目
                }
            }
        },
        methods: {
            ok() {
                // 表单验证，当valid为true时关闭对话框
                this.$refs['form'].validate((valid) => {
                    // 表单验证通过
                    if (valid) {
                      this.formObject.ip = this.dataList.ip;
                      this.formObject.projectName = this.dataList.projectName;
                      this.formObject.ids = this.ids;
                      this.loading = true;
                        this.$http.post('host/auth', this.formObject).then(({data}) => {
                          // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                          if (data.status) {
                            // 新增成功后的提示信息
                            this.$Notice.success({
                              desc: data.message && data.message !== '' ? data.message : '主机认证成功。'
                            });
                            this.$parent.getTableData({loading: true});
                            this.visible = false;
                          } else {
                            // 新增成功后的提示信息
                            this.$Notice.error({
                              desc: data.message && data.message !== '' ? data.message : '主机认证失败。'
                            });
                          }
                        })
                      this.loading = false;
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
        },
      watch: {
            value(newVal) {
                if (newVal) {
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
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
