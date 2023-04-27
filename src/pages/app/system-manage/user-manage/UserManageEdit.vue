<template>
    <Modal v-model="visible"
           :title="title"
           :mask-closable="false"
           :width="800"
           class="vertical-center-modal"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="90">
          <i-row class-name="row">
            <i-col span="12" class-name="left">
              <i-form-item label="登录名" prop="loginName">
                <i-input type="text" v-model="formObject.loginName"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="12" class-name="right">
              <i-form-item label="姓名" prop="userName">
                <i-input type="text" v-model="formObject.userName"></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row class-name="row">
            <i-col span="12" class-name="left">
              <FormItem prop="password" label="密码" v-if="this.data.add">
                <i-input placeholder="请输入密码" type="password" v-model="formObject.password"></i-input>
              </FormItem>
            </i-col>
            <i-col span="12" class-name="right">
              <FormItem label="确认密码" prop="ConfirmPassword" v-if="this.data.add">
                <Input placeholder="请再次输入密码"  type="password" v-model="formObject.ConfirmPassword"/>
              </FormItem>
            </i-col>
          </i-row>
          <i-row class-name="row">
            <i-col span="12" class-name="left">
              <FormItem prop="roleId" label="用户角色">
                <i-select placeholder="请选择角色" v-model="formObject.roleId">
                  <i-option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                </i-select>
              </FormItem>
            </i-col>
            <i-col span="12" class-name="right">
              <FormItem prop="active" label="用户状态">
                <RadioGroup v-model="formObject.active">
                  <Radio :label='1'>
                    <span>在职</span>
                  </Radio>
                  <Radio :label='0'>
                    <span>离职</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
          </i-row>
          <i-row class-name="row">
            <i-col span="12" class-name="left">
              <FormItem label="驻场类型" prop="userType">
                <Select v-model="formObject.userType">
                  <Option v-for="item in userTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12" class-name="right">
              <FormItem label="技术级别" prop="level">
                <Select v-model="formObject.level">
                  <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </i-row>
          <i-row class-name="row">
            <i-col span="12" class-name="left">
              <FormItem prop="userNo" label="用户编号">
                <i-input type="text" v-model="formObject.userNo"></i-input>
              </FormItem>
            </i-col>
            <i-col span="12" class-name="right">
              <FormItem prop="phone" label="手机号">
                <i-input type="text" v-model="formObject.phone"></i-input>
              </FormItem>
            </i-col>
          </i-row>
          <i-row class-name="row">
            <i-col span="12" class-name="left">
              <FormItem label="电子邮箱" prop="email">
                <Tooltip placement="right">
                  <Input v-model="formObject.email" clearable></Input>
                  <div slot="content">
                    <p>该值必须为合法的电子邮箱地址，</p>
                    <p>形如：yourname@domain.com</p>
                  </div>
                </Tooltip>
              </FormItem>
            </i-col>
            <i-col span="12" class-name="right">
              <FormItem prop="wxName" label="企业微信号">
                <i-input type="text" v-model="formObject.wxName"></i-input>
              </FormItem>
            </i-col>
          </i-row>

          <FormItem prop="company" label="所属公司">
            <AutoComplete
              clearable
              style="width: 100%"
              v-model="formObject.company"
              :data="companyList"
              :filter-method="filterMethod"
              placeholder="可搜索后选择公司名称，不存在时可直接填入。">
            </AutoComplete>
          </FormItem>
          <FormItem prop="skillDesc" label="技能描述">
            <i-input type="textarea" v-model="formObject.skillDesc" :rows="3"></i-input>
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
import * as Const from './components/UserConst';
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
            data: {
                type: Object
            }
        },
        data() {
            const validatePassword = (rule, value, callback) => {
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
                levelList: Const.LevelList,
                userTypeList: Const.UserTypeList,
                companyList: Const.CompanyList,
                roleList: [], // 角色列表
                visible: false,
                ruleValidate: {
                    userName: [
                        {
                            required: true,
                            message: "姓名不能为空",
                        }
                    ],
                    loginName: [
                        {
                            required: true,
                            message: "工号不能为空",
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: "密码不能为空",
                            trigger: "blur"
                        },
                        {
                            validator: validatePassword,
                            trigger: "blur"
                        }
                    ],
                    ConfirmPassword: [
                        {
                            required: true,
                            message: "密码确认不能为空",
                            trigger: "blur"
                        },
                        {
                            validator: validateConfirmPassword,
                            trigger: "blur"
                        }
                    ],
                  email: [
                    {
                      required: true,
                      type: 'email',
                      message: '电子邮箱格式不合法',
                      trigger: 'blur'
                    },
                    {
                      trigger: 'change',
                      validator: (rule, value, callback) => {
                        (value && value.length > 64)
                            ? callback(new Error('电子邮箱长度不超过64'))
                            : callback()
                      }
                    }
                  ],
                  roleId: [
                    {
                      required: true,
                      message: "用户角色不能为空",
                    }
                  ],
                },  // 将表单校验挂载到组件data
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                  id: '',
                  userNo:'', //员工编号
                  userName: '', // 姓名
                  password:"",//密码
                  loginName: '', // 工号
                  userType: 'local', //用户类型
                  level: 'local', //用户级别
                  company: '', //所属公司
                  active: 1, // 状态
                  description: '', // 描述
                  email:'', // 邮箱
                  phone:'', //手机号
                  wxName:'', // 微信
                  ConfirmPassword:"",//确认密码
                  skillDesc: '', //技能描述
                  roleId: '' //
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
                        if(this.title == '修改用户信息'){
                            this.$http.put('user/update', this.formObject)
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
                            this.$http.post('user/add', this.formObject)
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
          getRoleList() {
            return new Promise((resolve, reject) => {
              this.$http({
                method: 'POST',
                url: `role/list/page`,
                data: {
                  current: 0,
                  pageSize: 1000
                }
              }).then(({ data }) => {
                resolve(data);
              });
            });
          },
          filterMethod(value, option) {
            return option.indexOf(value) !== -1;
          }
        },
        watch: {
            value(newVal) {
                if (newVal) {
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
                    if(this.title === '修改用户信息'){
                      this.formObject = {...this.data}
                      this.getRoleList().then(res => {
                        this.roleList = res.data.records;
                      });
                    } else {
                      // 获取角色列表
                      this.getRoleList().then(res => {
                        this.roleList = res.data.records;
                        if (this.roleList.length > 0) {
                          this.formObject.roleId = this.roleList[0].id;
                        } else {
                          this.formObject.roleId = '';
                        }
                      });
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
