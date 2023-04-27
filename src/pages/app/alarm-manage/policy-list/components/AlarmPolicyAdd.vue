<template>
    <Modal v-model="visible"
           :title="title"
           :scrollable="true"
           :mask-closable="false"
           class="vertical-center-modal"
           width="650"
           @on-cancel="cancel">
        <!--修改该区域 start -->
        <Form ref="formOrder" :model="formObject" :rules="ruleValidate" :label-width="120" >
          <i-input type="text" v-model="formObject.id" style="display: none"></i-input>
          <FormItem prop="policyName" label="策略名称">
            <i-input type="text"
                     v-model="formObject.policyName" placeholder="填写策略名称方便查找" ></i-input>
          </FormItem>
          <FormItem prop="projectName" label="项目名称">
            <i-input style="width: 80% !important;" type="text" v-model="formObject.projectName"    placeholder="请填写需要收敛告警的项目名称"></i-input>
            <div style="display: inline-block; width: 17% !important; margin-left: 4px;">
              <Checkbox type="checkbox" @on-change="setAlarmType('projectName')" v-model="checked.projectName"  value="正则" checked=true><span >正则</span></Checkbox>
            </div>
          </FormItem>

          <FormItem   prop="showAlarmObject"  label="收敛显示项目名称"  v-show="projectNameShow"  >
            <i-input type="text" v-model="formObject.showProjectName"   placeholder="按照项目名称精确收敛，例如：成都政务云"></i-input>
          </FormItem>

          <FormItem prop="alarmObject" label="资源" >
            <i-input style="width: 80% !important;" type="text" v-model="formObject.alarmObject" placeholder="按照资源名称精确收敛，例如：10.32.1.39" ></i-input>
            <div style="display: inline-block; width: 17% !important; margin-left: 4px;">
              <Checkbox type="checkbox" @on-change="setAlarmType('alarmObject')" v-model="checked.alarmObject"  value="正则"><span >正则</span></Checkbox>
            </div>
          </FormItem>

          <FormItem   prop="showAlarmObject" label="收敛显示资源"  v-show="alarmObjectShow"  >
            <i-input type="text" v-model="formObject.showAlarmObject"   placeholder="按照项目名称精确收敛，例如：成都政务云"></i-input>
          </FormItem>

          <FormItem prop="alarmOutline" label="告警概要" >
            <i-input style="width: 80% !important;" type="textarea" v-model="formObject.alarmOutline" placeholder="按照告警概要精确收敛，例如：3par容量使用率告警"></i-input>
            <div style="display: inline-block; width: 17% !important; margin-left: 4px;">
              <Checkbox type="checkbox" @on-change="setAlarmType('alarmOutline')"  v-model="checked.alarmOutline"  value="正则"><span >正则</span></Checkbox>
            </div>
          </FormItem>

          <FormItem prop="showAlarmOutline" label="收敛显示告警概要"   v-show="alarmOutlineShow">
            <i-input type="textarea"
                     v-model="formObject.showAlarmOutline" placeholder="按照告警概要精确收敛，例如：3par容量使用率告警"></i-input>
          </FormItem>

          <FormItem prop="alarmMessage" label="告警详情模版" >
            <i-input  style="width: 80% !important;"  type="textarea" v-model="formObject.alarmMessage" placeholder="接收告警之后会包含此模版收敛，例如：avg(a3par_Capacity_used_rate)" ></i-input>
            <div style="display: inline-block; width: 17% !important; margin-left: 4px;">
              <Checkbox type="checkbox" @on-change="setAlarmType('alarmMessage')" v-model="checked.alarmMessage"  value="正则"><span >正则</span></Checkbox>
            </div>
          </FormItem>

          <FormItem prop="showAlarmMessage" label="收敛显示告警详情" v-show="alarmMessageShow" >
            <i-input type="textarea" v-model="formObject.showAlarmMessage" placeholder="接收告警之后会包含此模版收敛，例如：avg(a3par_Capacity_used_rate)" ></i-input>
          </FormItem>


          <FormItem prop="yongjiu" label="策略时效性" style="clear: both" >
            <Checkbox type="checkbox" @on-change="setEndTime" value="永久"><span >永久</span></Checkbox>
          </FormItem>
          <FormItem prop="beizhu" label="策略开始时间" >
            <DatePicker type="datetime" placeholder="选择开始时间" style="width: 155px" :value="effectStartdate" format="yyyy-MM-dd HH:mm:ss" @on-change="startDateChange"></DatePicker>
            &nbsp;&nbsp;至&nbsp;&nbsp;
            <DatePicker type="datetime" placeholder="选择结束时间" style="width: 155px;margin-right: 6px; " :value="effectEnddate"  format="yyyy-MM-dd HH:mm:ss" @on-change="endDateChange"></DatePicker>
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
        name: "alarm-policy-add",

        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {   //标题
                type: String,
                default: '告警收敛策略新增'
            },
            dataList: {
                type: Object
            }
        },
        data() {
          return {
                visible: false,
                foreverTime: true,
                projectNameShow:false,
                alarmObjectShow: false,
                alarmOutlineShow:false,
                alarmMessageShow:false,
                effectStartdate:'',
                projectNameText:'',
                effectEnddate:'',
                ruleValidate: {
                  policyName:[
                    {
                      required: true,
                      message: "策略名称不能为空",
                    }
                  ],

                },  // 将表单校验挂载到组件data
                // 表单绑定的数据对象，FormItem的prop对应该对象的字段
                formObject: {
                  id: '',
                  policyName: '',
                  projectName:'',
                  showProjectName:'',
                  alarmObject: '',
                  showAlarmObject: '',
                  alarmOutline:'',
                  showAlarmOutline:'',
                  alarmMessage:'',
                  showAlarmMessage:'',
                  projectNameType:'cover',
                  alarmObjectType: 'cover',
                  alarmOutlineType:'cover',
                  alarmMessageType:'cover',
                  effectStartdate: '',
                  effectEnddate: '',
                  status: '',
                  creator: '',
                  createTime:'',
                  updateUser:'',
                  updateTime:'',
                  username:'',
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
                confirmPersonName: "",
                checked: {
                  projectName: false,
                  alarmObject: false,
                  alarmOutline: false,
                  alarmMessage: false,
                }
            }
        },
        methods: {
          // 修改开始日期
          startDateChange(startTime) {
            this.effectStartdate = startTime;
          },
          // 修改结束日期
          endDateChange(endTime) {
              this.effectEnddate = endTime;
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
              if(this.formObject.projectName == "" && this.formObject.alarmObject == "" && this.formObject.alarmOutline == "" && this.formObject.alarmMessage == ""){
                this.$Notice.warning({
                  desc: '项目名称/告警对象/告警概要/告警详情模版，不能全部为空！'
                });
                return;
              }
              this.formObject.effectStartdate = this.effectStartdate;
              this.formObject.effectEnddate = this.effectEnddate;
              // 表单验证，当valid为true时关闭对话框
                this.$refs['formOrder'].validate((valid) => {
                    // 表单验证通过
                    if (valid) {
                          this.loading = true;
                          this.$http.post('alarm/policy/add', this.formObject)
                            .then(({data}) => {
                              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
                              if (data.status) {
                                // 新增成功后的提示信息
                                this.$Notice.success({
                                  desc: '新增策略成功,请等待10-59秒，我们将为您命中此策略收敛的所有未恢复告警'
                                });
                                this.$parent.getTableData({loading: true});

                                this.visible = false;
                                this.jsmz();
                              }
                          this.loading = false;
                            })
                    }
                })
            },
          jsmz(){
            this.$http.post('alarm/policy/nowPolicy', this.formObject)
              .then(({data}) => {
              // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
              if (data.status) {
              // 新增成功后的提示信息
              this.$Notice.success({
                desc: data.message
              });
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
          getNowFormatDateBefore(){
            let date = new Date(),
              seperator1 = '-', //格式分隔符
              seperator2 = ':',
              year = date.getFullYear(), //获取完整的年份(4位)
              month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
              strDate = date.getDate() , // 获取当前日(1-31)
              hours = date.getHours(),
              menutes = date.getMinutes(),
              seconds = date.getSeconds();
            if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
            if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0
            let currentdate = year + seperator1 + month + seperator1 + strDate +" "+ hours+ seperator2 +menutes+ seperator2+seconds;
            return currentdate
          },
          getNowFormatDate(){
            let date = new Date(),
              seperator1 = '-', //格式分隔符
              seperator2 = ':',
              year = date.getFullYear(), //获取完整的年份(4位)
              month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
              strDate = date.getDate() +1, // 获取当前日(1-31)
              hours = date.getHours(),
              menutes = date.getMinutes(),
              seconds = date.getSeconds();
            if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
            if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0
            let currentdate = year + seperator1 + month + seperator1 + strDate +" "+ hours+ seperator2 +menutes+ seperator2+seconds;
            return currentdate
          },
          setEndTime(){
            let currentdate;
            if(this.foreverTime){
              let date = new Date(),
                seperator1 = '-', //格式分隔符
                seperator2 = ':',
                year = 2099, //获取完整的年份(4位)
                month = 12, //获取当前月份(0-11,0代表1月)
                strDate = 31, // 获取当前日(1-31)
                hours = 23,
                menutes = 59,
                seconds = 59;
              currentdate = year + seperator1 + month + seperator1 + strDate +" "+ hours+ seperator2 +menutes+ seperator2+seconds;
            }else {
              let date = new Date(),
                seperator1 = '-', //格式分隔符
                seperator2 = ':',
                year = date.getFullYear(), //获取完整的年份(4位)
                month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
                strDate = date.getDate() +1, // 获取当前日(1-31)
                hours = date.getHours(),
                menutes = date.getMinutes(),
                seconds = date.getSeconds();
              if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
              if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0
              currentdate = year + seperator1 + month + seperator1 + strDate +" "+ hours+ seperator2 +menutes+ seperator2+seconds;
            }
            this.effectEnddate= currentdate;
            this.foreverTime = !this.foreverTime;
          },
          setAlarmType(type){
            if(type=='projectName'){
              if(this.checked[type]){
                this.formObject.projectNameType = 'regular';
                this.projectNameShow=true;
              }else {
                this.formObject.projectNameType ='cover';
                this.projectNameShow=false;
              }
            }else if(type=='alarmObject'){
              if(this.checked[type]){
                this.formObject.alarmObjectType ='regular';
                this.alarmObjectShow=true;
              }else {
                this.formObject.alarmObjectType ='cover';
                this.alarmObjectShow=false;
              }
            }else if(type=='alarmOutline'){
              if(this.checked[type]){
                this.formObject.alarmOutlineType ='regular';
                this.alarmOutlineShow=true;
              }else {
                this.formObject.alarmOutlineType ='cover';
                this.alarmOutlineShow=false;
              }
            }else if(type=='alarmMessage'){
              if(this.checked[type]){
                this.formObject.alarmMessageType ='regular';
                this.alarmMessageShow=true;
              }else {
                this.formObject.alarmMessageType ='cover';
                this.alarmMessageShow=false;
              }
            }

          },
          // 初始化规则显示状态
          setShowRegular() {
            if(this.formObject.projectNameType === 'regular') {
              this.projectNameShow = true;
              this.checked.projectName = true
            } else {
              this.projectNameShow = false;
              this.checked.projectName = false
            }
            if(this.formObject.alarmObjectType === 'regular') {
              this.alarmObjectShow = true;
              this.checked.alarmObject = true
            } else {
              this.alarmObjectShow = false;
              this.checked.alarmObject = false
            }
            if(this.formObject.alarmOutlineType === 'regular') {
              this.alarmOutlineShow = true;
              this.checked.alarmOutline = true
            } else {
              this.alarmOutlineShow = false;
              this.checked.alarmOutline = false
            }
            if(this.formObject.alarmMessageType === 'regular') {
              this.alarmMessageShow = true;
              this.checked.alarmMessage = true
            } else {
              this.alarmMessageShow = false;
              this.checked.alarmMessage = false
            }
          }
        },
      watch: {
            value(newVal) {
                if (newVal) {
                    /*=== 可修改 start ===*/
                    this.$refs['formOrder'].resetFields();
                    if(!this.dataList.add){
                      this.effectStartdate=this.dataList.effectStartdate || this.getNowFormatDateBefore();
                      this.effectEnddate=this.dataList.effectEnddate || this.getNowFormatDate();
                      if(this.dataList.projectNameType=='regular'){
                        this.projectNameShow=true;
                      }
                      this.formObject = {...this.dataList}
                      this.setShowRegular()
                      // 数字装字符串
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
        if(this.dataList.add){
          this.effectStartdate = this.getNowFormatDateBefore();
          this.effectEnddate = this.getNowFormatDate();
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
