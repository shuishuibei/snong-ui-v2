<template>
    <Modal v-model="visible"
           :title="title"
           :mask-closable="false"
           :width="600"
           class="vertical-center-modal"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="form" :model="formObject" :rules="ruleValidate" :label-width="120">
          <FormItem prop="projectName" label="数据中心名称">
            <i-input type="text" v-model="formObject.projectName"></i-input>
          </FormItem>
          <FormItem prop="remoted" label="远程运维">
            <RadioGroup v-model="formObject.remoted" @on-change="handleRemoteChange">
              <Radio :label='1'> <span>是</span></Radio>
              <Radio :label='0'> <span>否</span></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="proxyIp" label="远程代理IP" v-show="show.proxyShow">
            <i-input type="text" v-model="formObject.proxyIp"></i-input>
          </FormItem>
          <FormItem prop="localDeploy" label="本地部署">
            <RadioGroup v-model="formObject.localDeploy" @on-change="handleDeployChange">
              <Radio :label='1'> <span>是</span></Radio>
              <Radio :label='0'> <span>否</span></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="startTime" label="License时间" v-show="show.deployShow">
            <DatePicker type="datetime" placeholder="请填写License失效时间" v-model="formObject.deployTime"
                        style="width: 100%" format="yyyy-MM-dd HH:mm:ss" ></DatePicker>
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
        name: "project-zone-edit",
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
                  id: '',
                  projectName: '',
                  remoted: 1,
                  proxyIp: '',
                  localDeploy: 0,
                  projectId: '',
                  deployTime: ''
                },
              show: {
                proxyShow: true,
                deployShow: false
              },
              ruleValidate: {
                zoneName: [
                  {
                    required: true,
                    message: "数据中心名称不能为空"
                  }
                ],
                // proxyIp: [
                //   {
                //     required: true,
                //     message: "远程代理IP不能为空"
                //   }
                // ]
              },  // 将表单校验挂载到组件data
            }
        },
        methods: {
            ok() {
                // 表单验证，当valid为true时关闭对话框
                this.$refs['form'].validate((valid) => {
                    // 表单验证通过
                    if (valid) {
                      if (this.dataList.add) {
                        this.$http.post('project-management/add', this.formObject)
                          .then(({data}) => {
                            // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                            if (data.status) {
                              // 新增成功后的提示信息
                              this.$Notice.success({
                                desc: data.message && data.message !== '' ? data.message : '增加数据中心成功。'
                              });
                              this.$emit("refresh-table")
                              // this.$parent.$parent.getTableData({loading: true});
                              this.visible = false;
                            }
                          })
                      } else {
                        this.$http.put('project-management/update', this.formObject)
                          .then(({data}) => {
                            // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                            if (data.status) {
                              // 新增成功后的提示信息
                              this.$Notice.success({
                                desc: data.message && data.message !== '' ? data.message : '修改数据中心成功。'
                              });
                              this.$emit("refresh-table")
                              // this.$parent.getTableData({loading: true});
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
          filterMethod(value, option) {
            return option.indexOf(value) !== -1;
          },
          // 处理radio值改变事件
          handleRemoteChange(value) {
              if (value === 0) {
                this.formObject.proxyIp = '';
              }
              this.show.proxyShow = (value === 1)
          },
          // 处理radio值改变事件
          handleDeployChange(value) {
            if (value === 0) {
              this.formObject.deployTime = '';
            }
            this.show.deployShow = (value === 1)
          }
        },
        watch: {
            value(newVal) {
                if (newVal) {
                    /*=== 可修改 start ===*/
                    this.$refs['form'].resetFields();
                    if(!this.dataList.add){
                      this.formObject = {...this.dataList.rowData}
                      this.handleRemoteChange(this.formObject.remoted)
                      this.handleDeployChange(this.formObject.localDeploy)
                    }
                  this.formObject.projectId = this.dataList.projectId;
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
