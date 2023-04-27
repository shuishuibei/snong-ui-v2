<template>
    <Modal v-model="visible"
           :title="title"
           :scrollable="true"
           :mask-closable="false"
           class="vertical-center-modal"
           width="650"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="150">
          <FormItem label="项目名称" prop="projectId">
            <Select v-model="formObject.projectId" @on-change="projectChange" :disabled="forbidden" :labelInValue="true"
                    filterable clearable @on-clear="projectClear" ref="selectProject">
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="region" label="区域">
            <Select v-model="formObject.region" placeholder="请选择节点网络区域，无区分可不选择。">
              <Option v-for="item in areaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="pingObject" label="拨测对象">
            <RadioGroup v-model="formObject.pingObject" type="button">
              <Radio v-for="item in probeObjects"  :key="item.value" :label="item.value">
                <span>{{ item.label }}</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="pingIp" label="探针IP">
              <i-input type="text"
                       v-model="formObject.pingIp"></i-input>
          </FormItem>
          <FormItem prop="pingPublicIp" label="探针公网IP">
            <i-input type="text"
                     v-model="formObject.pingPublicIp"></i-input>
          </FormItem>
          <FormItem prop="userName" label="登录名">
            <i-input type="text" placeholder="请输入登录该节点用户名"
                     v-model="formObject.userName"></i-input>
          </FormItem>
          <FormItem prop="password" label="密码">
            <i-input type="password" placeholder="请输入登录该节点密码"
                     v-model="formObject.password"></i-input>
          </FormItem>
          <FormItem prop="area" label="所属地区">
            <i-input type="text" placeholder="请输入所在地区，例如：四川，北京，成都"
                     v-model="formObject.area"></i-input>
          </FormItem>
          <FormItem prop="description" label="描述">
            <i-input type="textarea" :rows="4"
                     v-model="formObject.description"></i-input>
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
import {ADD_URL, UPDATE_URL, NETWORK_AREA, PING_OBJECTS} from './api.js';
    export default {
        name: "probe-edit",
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
                functionName: '探针节点',
                areaList : NETWORK_AREA,
                probeObjects : PING_OBJECTS,
                visible: false,
                projectList: [], // 项目列表
                ruleValidate: {
                  userName: [
                        {
                            required: true,
                            message: "登录名不能为空",
                        }
                    ],
                  password: [
                    {
                      required: true,
                      message: "密码不能为空",
                    }
                  ],
                  pingObject: [
                    {
                      required: true,
                      message: "拨测对象不能为空",
                    }
                  ],
                  pingIp: [{
                        required: true,
                        message: '探针IP地址不能为空',
                        trigger: 'blur'
                      }, {
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                          let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                          if (reg.test(value)) {
                            callback();
                          } else {
                            callback(new Error('IP地址格式不正确'));
                          }
                        }
                      }],
                      // pingPublicIp: [{
                      //   required: true,
                      //   message: '探针IP地址不能为空',
                      //   trigger: 'blur'
                      // }, {
                      //   trigger: 'blur',
                      //   validator: (rule, value, callback) => {
                      //     let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                      //     if (reg.test(value)) {
                      //       callback();
                      //     } else {
                      //       callback(new Error('IP地址格式不正确'));
                      //     }
                      //   }
                      // }],
                  projectId:[
                    {
                      required: true,
                      message: "所属项目不能为空",
                    }
                  ]
                },  // 将表单校验挂载到组件data
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                  id: '',
                  area: '', // 地区
                  pingNodeName: '', // 探针名称
                  region: '', // 区域
                  pingObject:'manage', // 拨测对象
                  pingIp: '', // 探针IP
                  pingPublicIp: '',// 探针公网IP
                  projectId: '', // 所属项目
                  projectName: "", // 项目名称
                  userName:'', // 登录名
                  password: '', // 密码
                  description: '' // 描述
                },
              forbidden: false
            }
        },
        methods: {
          getProjectList(){
            this.$http({
              method:'GET',
              url:'/project-management/get/user/project'
            }).then(({data})=>{
              if(data.status){
                this.projectList = data.data;
                if(this.dataList.add){
                  // 新增模式下
                  this.formObject.projectId = this.projectList[0].id;
                  this.formObject.projectName = this.projectList[0].projectName;
                } else {
                  // 修改或复制新增下或预览模式下
                  this.formObject.projectId = this.dataList.projectId;
                  this.formObject.projectName = this.dataList.projectName;
                }
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
            ok() {
                // 表单验证，当valid为true时关闭对话框
                this.$refs['form'].validate((valid) => {
                    // 表单验证通过
                    if (valid) {
                        if(this.dataList.add){
                          this.$http.post(ADD_URL, this.formObject)
                            .then(({data}) => {
                              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                              if (data.status) {
                                // 新增成功后的提示信息
                                this.$Notice.success({
                                  desc: '新增' + this.functionName +'成功'
                                });
                                this.$parent.getTableData({loading: true});
                                this.visible = false;
                              } else {
                                this.$Notice.error({
                                  desc: data.message && data.message !== '' ? data.message : '新增' + this.functionName + '失败。'
                                });
                              }
                            })
                        } else {
                          this.formObject.id = this.dataList.id;
                          this.$http.put(UPDATE_URL, this.formObject)
                            .then(({data}) => {
                              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                              if (data.status) {
                                // 新增成功后的提示信息
                                this.$Notice.success({
                                  desc: '修改探针节点成功'
                                });
                                this.$parent.getTableData({loading: true});
                                this.visible = false;
                              } else {
                                this.$Notice.error({
                                  desc: data.message && data.message !== '' ? data.message : '修改探针节点失败。'
                                });
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
            }
        },
      watch: {
            value(newVal) {
                if (newVal) {
                    this.getProjectList();
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
                    if(!this.dataList.add){
                      this.formObject = {...this.dataList}
                      // 数字装字符串
                      this.formObject.hostType = this.dataList.hostType+'';
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
  .checkBox-project {
    height: 220px;
    overflow-y: auto;
  }
</style>
