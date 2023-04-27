<template>
    <Modal v-model="visible"
           :title="title"
           :scrollable="true"
           :mask-closable="false"
           class="vertical-center-modal"
           width="650"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="formOrder" :model="formObject" :rules="ruleValidate" :label-width="100">
          <i-input type="text" v-model="formObject.alarmId" style="display: none"></i-input>
            <FormItem prop="projectName" label="项目名称">
                <i-input type="text"
                         v-model="formObject.projectName" disabled></i-input>
            </FormItem>
          <FormItem prop="strategy" label="告警类型">
            <i-input type="text"
                     v-model="formObject.strategy" disabled></i-input>
          </FormItem>
          <FormItem prop="level" label="告警等级">
            <i-input type="text"
                     v-model="formObject.level" disabled></i-input>
          </FormItem>
          <FormItem prop="alarmFirstTime" label="初次发生时间">
            <i-input type="text"
                     v-model="formObject.alarmFirstTime" disabled></i-input>
          </FormItem>
          <FormItem prop="alarmDuration" label="持续时长">
            <i-input type="text"
                     v-model="formObject.alarmDuration" disabled></i-input>
          </FormItem>
          <FormItem prop="alarmTimes" label="告警次数">
            <i-input type="text"
                     v-model="formObject.alarmTimes" disabled></i-input>
          </FormItem>

          <FormItem prop="alarmOutline" label="告警概要">
            <i-input type="textarea"
                     v-model="formObject.alarmOutline" disabled></i-input>
          </FormItem>
          <FormItem prop="alarmMessage" label="告警详情">
            <i-input type="textarea" v-model="formObject.alarmMessage" disabled></i-input>
          </FormItem>
          <FormItem label="紧急度" prop="jjcd">
            <Select v-model="formObject.jjcd" style="width:100%" >
              <Option label="紧急" :value="1"></Option>
              <Option label="非紧急" :value="2"></Option>
            </Select>
          </FormItem>
          <FormItem label="处理人" prop="dealPerson">
            <Select v-model="formObject.username" @on-change="opsUserChange" :disabled="forbidden" :labelInValue="true"
                    filterable clearable @on-clear="opsUserClear" ref="selectProject">
              <Option v-for="item in opsUserList" :value="item.username" :key="item.username">{{ item.display_name }}（{{ item.username }}）</Option>
            </Select>
          </FormItem>
          <FormItem prop="beizhu" label="备注">
            <i-input type="textarea" v-model="formObject.beizhu" ></i-input>
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
        name: "alarm-order",

        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {   //标题
                type: String,
                default: '告警转工单'
            },
            dataList: {
                type: Object
            }
        },
        data() {
          return {
                visible: false,
                opsUserList: [], // 项目列表
                ruleValidate: {
                  jjcd:[
                    {
                      required: true,
                      message: "紧急程度不能为空",
                    }
                  ],
                  dealPerson:[
                    {
                      required: true,
                      message: "处理人不能为空",
                    }
                  ]

                },  // 将表单校验挂载到组件data
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                  id: '',
                  confirmContent: '', // 主机名称
                  confirmPerson_id: '', // 主机IP
                  confirmPerson_name: '',
                  confirmTime: '',
                  confirmPersonId: '',
                  confirmPersonName: '',
                  alarmId:'',
                  strategy:'',
                  projectName:'',
                  level:'',
                  alarmFirstTime:'',
                  alarmDuration:'',
                  alarmTimes:'',
                  alarmOutline:'',
                  alarmMessage:'',
                  jjcd:'',
                  username:'',
                  beizhu:''
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
            getopsUserList(){
              this.$http({
                method:'POST',
                url:'/alarm/getOpsUser'
              }).then(({data})=>{
              this.opsUserList = data;
              // 修改或复制新增下或预览模式下
              this.formObject.dealPerson = this.dataList.username;
              this.formObject.display_name = this.dataList.display_name;
            })
            },
            opsUserChange(value){
              if(value){
                this.formObject.dealPerson = value.label;
              }
            },
            opsUserClear(){
              this.formObject.dealPerson = '';
            },
            ok() {
              // 表单验证，当valid为true时关闭对话框
                this.$refs['formOrder'].validate((valid) => {
                    // 表单验证通过
                    if (valid) {
                          this.loading = true;
                          this.$http.put('alarm/alarmToOrder', this.formObject)
                            .then(({data}) => {
                              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                              if (data.status) {
                                // 新增成功后的提示信息
                                this.$Notice.success({
                                  desc: '告警转工单成功'
                                });
                                this.$parent.getTableData({loading: true});
                                this.visible = false;
                              }
                          this.loading = false;
                            })
                    }
                })
            },
            cancel() {
                // 关闭对话框
                this.visible = false;
                //表单清空
                this.$refs['formOrder'].resetFields();
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
            toHourMinute(alarmTime,alarmFirstTime){
              var beginDate = new Date(alarmFirstTime);
              var endDate = new Date(alarmTime);
              var minutes=Math.floor((endDate - beginDate)/(1000 * 60));
              if(minutes>1440){
                return ((Math.floor(minutes/1440) + "天"+Math.floor((minutes/60)%24) + "小时" + (minutes%60) + "分" ));
              }else{
                return (Math.floor(minutes/60) + "小时" + (minutes%60) + "分" );
              }
          },
        },
      watch: {
            value(newVal) {
                if (newVal) {
                    this.getopsUserList();
                    this.opsUserClear();
                    /*=== 可修改 start ===*/
                    this.$refs['formOrder'].resetFields();
                    if(!this.dataList.add){
                      this.formObject = {...this.dataList}
                      // 数字装字符串
                      this.formObject.alarmDuration=this.toHourMinute(this.dataList.alarmTime,this.dataList.alarmFirstTime)
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

      }
    }
</script>

<style scoped lang="less">
  .checkBox-project {
    height: 220px;
    overflow-y: auto;
  }
</style>
