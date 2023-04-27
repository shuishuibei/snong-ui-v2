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
            <FormItem prop="hostName" label="主机名称">
                <i-input type="text"
                         v-model="formObject.hostName"></i-input>
            </FormItem>
            <FormItem prop="ip" label="IP地址">
                <i-input type="text"
                         v-model="formObject.ip"></i-input>
            </FormItem>
          <FormItem label="项目名称" prop="projectId">
            <Select v-model="formObject.projectId" @on-change="projectChange" :disabled="forbidden" :labelInValue="true"
                    filterable clearable @on-clear="projectClear" ref="selectProject">
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="cpu" label="CPU(核)">
            <i-input type="text"
                     v-model="formObject.cpu"></i-input>
          </FormItem>
          <FormItem prop="memory" label="内存(G)">
            <i-input type="text"
                     v-model="formObject.memory"></i-input>
          </FormItem>
          <FormItem prop="deviceType" label="主机型号">
            <i-input type="text"
                     v-model="formObject.deviceType"></i-input>
          </FormItem>
          <FormItem prop="hostType" label="主机类型">
            <RadioGroup v-model="formObject.hostType">
              <Radio label = '0'>
                <span>物理主机</span>
              </Radio>
              <Radio label = 1>
                <span>云主机</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="操作系统" prop="systemType">
            <RadioGroup v-model="formObject.systemType" type="button">
              <Radio label="linux">
                <span>Linux</span>
              </Radio>
              <Radio label="windows">
                <span>Windows</span>
              </Radio>
            </RadioGroup>
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
                default: '新增'
            },
            dataList: {
                type: Object
            }
        },
        data() {
            return {
                visible: false,
              projectList: [], // 项目列表
                ruleValidate: {
                  hostName: [
                        {
                            required: true,
                            message: "主机名称不能为空",
                        }
                    ],
                  ip: [{
                        required: true,
                        message: 'IP地址不能为空',
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
                  hostName: '', // 主机名称
                  ip: '', // 主机IP
                  cpu: '',
                  memory: '',
                  hostType: '0', // 主机类型
                  deviceType:'', // 主机型号
                  projectId: '', // 所属项目
                  projectName: "", // 项目名称
                  systemType: 'linux'
                },
                projectTreeData: {},
                indeterminate: true,
                checkAll: false,
                checkId: [], // 选中的项目id
                ids: [], // 所有项目id
                checkAllDisabled: false, // 全选禁止
                getCheckId: [], // 接口获取到的选中项目id
                fileSuccess: false,
              forbidden: false
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
                          this.$http.post('host/add', this.formObject)
                            .then(({data}) => {
                              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                              if (data.status) {
                                // 新增成功后的提示信息
                                this.$Notice.success({
                                  desc: '新增主机资产成功'
                                });
                                this.$parent.getTableData({loading: true});
                                this.visible = false;
                              } else {
                                this.$Notice.error({
                                  desc: data.message && data.message !== '' ? data.message : '新增主机资产失败。'
                                });
                              }
                            })
                        } else {
                          this.formObject.id = this.dataList.id;
                          this.$http.put('host/update', this.formObject)
                            .then(({data}) => {
                              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                              if (data.status) {
                                // 新增成功后的提示信息
                                this.$Notice.success({
                                  desc: '修改主机资产成功'
                                });
                                this.$parent.getTableData({loading: true});
                                this.visible = false;
                              } else {
                                this.$Notice.error({
                                  desc: data.message && data.message !== '' ? data.message : '修改主机资产失败。'
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
