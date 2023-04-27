<!--
 * @Description: 项目管理编辑
 * @Author: ys2234
 * @Date: 2019-06-03 14:28:42
 * @LastEditors: y22998
 * @LastEditTime: 2022-06-10 10:29:40
 -->
<template>
  <div class="project-management-edit cds-border cds-scroll-wrap">
    <div class="cds-scroll-content project-management-content">
      <h3c-mall
        title="基本配置"
        class-name="icon-ai-tool"
        style-set="#00CD66">
        <template #mallContent>
          <i-form
            ref="form"
            :model="formObject"
            :rules="ruleValidate"
            :label-width="100">
            <i-row class-name="row">
              <i-col span="12" class-name="left">
                <i-form-item label="项目名称" prop="projectName">
                  <i-input
                    placeholder="请输入项目名称"
                    v-model="formObject.projectName">
                  </i-input>
                </i-form-item>
              </i-col>
              <i-col span="12" class-name="right">
                <i-form-item label="项目编号" prop="projectNo">
                  <i-input
                    placeholder="eg：XM-2023-001"
                    v-model="formObject.projectNo">
                  </i-input>
                </i-form-item>
              </i-col>
            </i-row>
            <i-row class-name="row">
              <i-col span="12" class-name="left">
                <i-form-item label="项目类型" prop="projectType">
                  <Select v-model="formObject.projectType">
                    <Option v-for="item in projectTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </i-form-item>
              </i-col>
              <i-col span="12" class-name="right">
                <i-form-item label="项目状态" prop="projectProgress">
                  <Select v-model="formObject.projectProgress">
                    <Option v-for="item in projectProgressList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </i-form-item>
              </i-col>
            </i-row>
            <i-row class-name="row">
              <i-col span="12" class-name="left">
                <i-form-item label="区域" prop="area">
                  <Select v-model="formObject.area">
                    <Option v-for="item in areaList" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </i-form-item>
              </i-col>
              <i-col span="12" class-name="right">
                <i-form-item label="代表处" prop="companyOffice">
                  <i-input
                    type="text"
                    placeholder="请输入代表处名称"
                    v-model="formObject.companyOffice">
                  </i-input>
                </i-form-item>
              </i-col>
            </i-row>
            <i-row class-name="row">
              <i-col span="12" class-name="left">
                <i-form-item label="服务合同号" prop="contractNumber">
                  <i-input
                    type="text"
                    placeholder="请输入服务合同号"
                    v-model="formObject.contractNumber">
                  </i-input>
                </i-form-item>
              </i-col>
              <i-col span="12" class-name="right">
                <i-form-item label="服务合同名称" prop="contractName">
                  <i-input placeholder="请输入服务合同名称" v-model="formObject.contractName"></i-input>
                </i-form-item>
              </i-col>
            </i-row>
            <i-row class-name="row">
              <i-col span="12" class-name="left">
                <i-form-item label="开始日期" prop="dateStart">
                  <DatePicker type="date" placeholder="选择日期" v-model="formObject.dateStart" format="yyyy-MM-dd" @on-change="startDateChange" ></DatePicker>
                </i-form-item>
              </i-col>
              <i-col span="12" class-name="right">
                <i-form-item label="结束日期" prop="dateEnd">
                  <DatePicker type="date" placeholder="选择日期" v-model="formObject.dateEnd" format="yyyy-MM-dd" @on-change="endDateChange" width="100px"></DatePicker>
                </i-form-item>
              </i-col>
            </i-row>

            <i-row class-name="row">
              <i-col span="12" class-name="left">
                <i-form-item label="交付规格" prop="paySpec">
                  <Select v-model="formObject.paySpec">
                    <Option v-for="item in paySpecList" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </i-form-item>
              </i-col>
              <i-col span="12" class-name="right">
                <i-form-item label="服务性质" prop="serviceProperty">
                  <Select v-model="formObject.serviceProperty">
                    <Option v-for="item in servicePropertyList" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </i-form-item>
              </i-col>
            </i-row>
            <i-row class-name="row">
              <i-col span="12" class-name="left">
                <i-form-item label="项目经理" prop="managerName">
                  <i-input v-model="formObject.managerName" placeholder="请输入项目经理名称"></i-input>
                </i-form-item>
              </i-col>
              <i-col span="12" class-name="right">
                <i-form-item label="所属行业" prop="projectTrade">
                  <Select v-model="formObject.projectTrade">
                    <Option v-for="item in projectTradeList" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </i-form-item>
              </i-col>
            </i-row>
            <i-form-item label="项目成员" >
              <div class="projectMembers">
                <div class="projectMembers-box">
                  <div v-if="membersList.length > 0">
                    <div v-for="(item,index) in membersList" :key="index" class="projectMember-box">
                                            <span>
                                                {{item.userName}}
                                            </span>
                      <div class="close-circle" @click="removeProjectMembers(index)"></div>
                    </div>
                  </div>
                  <div v-else>暂无项目成员</div>
                </div>
                <Button type="primary" @click="modalShow.shouldAddMembersShow = true" size="small">选择</Button>
              </div>
            </i-form-item>
            <i-form-item label="描述" prop="projectDesc">
              <i-input
                v-model="formObject.projectDesc"
                type="textarea"
                :autosize="{minRows: 4,maxRows: 8}">
              </i-input>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <mall-footer
        :handler-submit="saveAddProject"
        :handler-cancel="cancelAddProject"
        :submit-title="this.data ? '修改' :'保存'">
      </mall-footer>
    </div>
    <project-management-add-members v-model="modalShow.shouldAddMembersShow" @getMembersData="getMembersData" :data="membersList"></project-management-add-members>
  </div>
</template>

<script>
import * as CONST from './components/ProjectConst';
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // // 引入商城分块组件
import MallFooter from '@/components/h3c-mall/MallFooter.vue'; // 引入商城提交的页脚
import ProjectManagementAddMembers from './ProjectManagementAddMembers.vue'; // 引入选择成员组件
export default {
    name: 'project-management-edit',
    props:{
        data:{
            type: Object
        }
    },
    components:{
        'h3c-mall': H3cMall,
        'mall-footer': MallFooter,
        'project-management-add-members':ProjectManagementAddMembers
    },
    data(){
        return {
          projectTypeList: CONST.projectTypeList,
          projectProgressList: CONST.projectProgressList,
          areaList: CONST.areaList,
          servicePropertyList: CONST.servicePropertyList,
          paySpecList: CONST.paySpecList,
          projectTradeList: CONST.projectTradeList,
            userList:[],
            formObject: {
                id: '',
                projectName: '', // 项目名称
                projectNo: '', // 项目编号
                projectType: 2, // 项目类型
                projectStatus: '', // 项目状态 --- 需要去掉
                projectProgress: '1', // 项目进度
                projectTrade: '政务云', // 所属行业
                dateStart: '', // 开始时间
                dateEnd: '', // 结束时间
                projectDesc: '', //项目描述
                contractNumber: '',
                contractName: '',
                area: '东区',
                companyOffice:'', //公司代表处
                location: '', //常驻地
                serviceProperty: '随项目',
                paySpec:'8814A0BS',
                managerName: '', // 项目经理名称
                members: [], // 成员
            },

            ruleValidate: {
                projectName:[
                    {
                        required: true,
                        message: "请选择项目名称"
                    }
                ],
                projectType:[
                    {
                        required: true,
                        message: "项目类型不能为空"
                    }
                ],
                projectStatus:[
                    {
                        required: true,
                        message: "项目状态不能为空"
                    }
                ],
                managerName:[
                    {
                        required: true,
                        message: "项目经理不能为空"
                    }
                ]
            }, // 表单验证规则
            ipShow: true,
            modalShow: {
                shouldAddMembersShow: false
            },
            membersList:[] // 项目成员数据
        }
    },
    methods:{
        startDateChange(date) {
            this.formObject.dateStart = date;
        },
        endDateChange(date) {
            this.formObject.dateEnd = date;
        },
        // 点击保存，进行保存并跳转到表格页面
        saveAddProject() {
            if(typeof this.formObject.dateStart == 'object'){
                this.formObject.dateStart = this.$moment(this.formObject.dateStart).format("YYYY-MM-DD HH:mm:ss")
                this.formObject.dateEnd = this.$moment(this.formObject.dateEnd).format("YYYY-MM-DD HH:mm:ss")
            }
            if(this.membersList.length > 0) {
                this.membersList.forEach((item,index)=>{
                    this.formObject.members.push(item.id);
                })
            }
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$loading.show();
                    if(this.data){
                        // 修改
                        this.$http({
                            method:'PUT',
                            url:`/project/update`,
                            data:Object.assign({},this.formObject,{id:this.data.id})
                        }).then(({data})=>{
                            if(data.status){
                                this.$Notice.success({
                                    desc: '修改项目成功'
                                });
                                this.$emit('shouldComponentShow','shouldTableShow', 'refreshTable');
                            }
                            this.$loading.hide();
                        })
                    } else {
                        this.$http({
                            method:'POST',
                            url:`/project/add`,
                            data:this.formObject
                        }).then(({data})=>{
                            if(data.status){
                                this.$Notice.success({
                                    desc: '添加项目成功'
                                });
                                this.$emit('shouldComponentShow','shouldTableShow', 'refreshTable');
                            }
                            this.$loading.hide();
                        })
                    }
                }
            })
        },
        // 点击取消，返回表格页面
        cancelAddProject(){
            this.$emit('shouldComponentShow','shouldTableShow');
        },
        getExistingMembers(projectId){
            this.$http({
                url:`/project-management/usersInProject/${projectId}`,
                method: 'GET'
            }).then(({data})=>{
                if(data.status){
                    this.membersList = data.data;
                }
            })
        },
        // 获取选中的项目成员
        getMembersData(membersList) {
            this.membersList = membersList;
        },
        // 移除项目成员
        removeProjectMembers(index) {
            this.membersList.splice(index,1);
        }
    },
    mounted(){
        this.startDateChange(new Date().toLocaleDateString().replace(/\//g,'-'));
        this.endDateChange(new Date().toLocaleDateString().replace(/\//g,'-')); // typeof: string
        this.$nextTick(()=>{
            if(this.data){
                // 修改
                this.formObject = {...this.data}
                this.formObject.members = [] // members属性会丢失
                this.getExistingMembers(this.data.id) // 设置默认项目成员
            }
        })
    },
}
</script>

<style lang="less" scoped>
.project-management-edit {
    .project-management-content {
        height: calc(~"100% - 80px");
        margin-bottom: 10px;
        .projectMembers {
            height: 100px;
            position: relative;
            .projectMembers-box {
                height: 100px;
                width: 80%;
                border: 1px solid #dddee1;
                border-radius: 4px;
                padding: 0 10px;
                .projectMember-box {
                    position: relative;
                    display: inline-block;
                    margin-right: 15px;
                    .close-circle {
                        width: 10px;
                        height: 10px;
                        background-color: #FE0141;;
                        border-radius: 50%;
                        position: absolute;
                        right: -10px;
                        top: 5px;
                        cursor: pointer;
                        &::before{
                            content: "×";
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            color: #FFF3F7;
                        }
                    }
                }
            }
            button {
                position: absolute;
                right: 10%;
                top: 40px;
            }
        }
    }
}
</style>

