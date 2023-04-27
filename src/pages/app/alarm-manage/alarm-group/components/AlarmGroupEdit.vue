<template>
    <Modal v-model="visible"
           :title="title"
           :width="width"
           :mask-closable="false"
           class="vertical-center-modal"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="90">
            <FormItem prop="alarmGroupTitle" label="告警组名称">
                <i-input type="text" v-model="formObject.alarmGroupTitle"></i-input>
            </FormItem>
            <FormItem prop="userIds" label="通知用户">
              <Select v-model="formObject.userIds" multiple filterable>
                <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.userName }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="noticeType" label="通知方式" >
              <CheckboxGroup v-model="formObject.noticeType">
                <Checkbox label="wx">企业微信</Checkbox>
                <Checkbox label="email" disabled>邮件</Checkbox>
                <Checkbox label="sms" disabled>短信</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem prop="description" label="描述">
                <i-input type="textarea" v-model="formObject.description" :rows="5"></i-input>
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
            operator: {
              type: String,
              default: ''
            },
            width: {   //对话框宽度
              type: [Number, String]
            },
            title: {   //标题
                type: String,
                default: '新增'
            },
            data: {
                type: Object
            }
        },
        data() {
            const validatePassworld = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('长度不得小于6位'));
                } else {
                    callback();
                }
            };
            const validateConfirmPassword = (rule, value, callback) => {
                if (value === this.formObject.password) {
                    callback();
                } else {
                    callback(new Error("两次密码不一致"));
                }
            };
            return {
                userList:[], //用户列表
                visible: false,
                ruleValidate: {
                    alarmGroupTitle: [
                        {
                            required: true,
                            message: "告警组名称不能为空",
                        }
                    ],
                    userIds: [
                        {
                            required: true,
                            message: "通知用户不能为空",
                        }
                    ],
                  noticeType: [
                    {
                      required: true,
                      message: "通知方式不能为空",
                    }
                  ],
                },  // 将表单校验挂载到组件data
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                    id: '',
                    alarmGroupTitle: '', // 姓名
                    userIds: [], // 用户ID
                    noticeType: ['wx'], // 通知类型
                    description: '' // 描述
                }
            }
        },
        methods: {
            ok() {
                // 表单验证，当valid为true时关闭对话框
                this.$refs['form'].validate((valid) => {
                    // 表单验证通过
                    if (valid) {
                        // 关闭对话框
                        if(this.operator === 'update'){
                            this.$http.put('alarm/group/update', this.formObject)
                            .then(({data}) => {
                                // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                                if (data.status) {
                                    // 新增成功后的提示信息
                                    this.$Notice.success({
                                        desc: '修改成功'
                                    });
                                    this.$parent.getTableData({loading: true});
                                    this.visible = false;
                                }
                            })
                        } else {
                            this.$http.post('alarm/group/add', this.formObject)
                            .then(({data}) => {
                                // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                                if (data.status) {
                                    // 新增成功后的提示信息
                                    this.$Notice.success({
                                        desc: '新增成功'
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
          getUserList() {
            return new Promise((resolve, reject) => {
              this.$http({
                method: 'GET',
                url: `user/list`
              }).then(({ data }) => {
                resolve(data);
              });
            });
          },

        },
        watch: {
            value(newVal) {
                if (newVal) {
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
                    // 获取用户列表
                    this.getUserList().then(res => {
                      this.userList = res.data;
                    });
                    if(this.operator === 'update'){
                      this.formObject = {...this.data}
                      this.formObject.userIds = this.data.userId.split(",");
                      this.formObject.noticeType = this.data.noticeType.split(",");
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
        }
    }
</script>

<style scoped lang="less">

</style>
