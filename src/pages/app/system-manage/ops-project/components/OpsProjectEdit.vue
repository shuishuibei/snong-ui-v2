<!--
 * @Description: 资源管理编辑
 * @Author: ys2234
 * @Date: 2019-09-09 16:08:11
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 15:58:44
 -->
<template>
  <i-modal
    ref="modal"
    width="740px"
    class-name="resource-manage-edit"
    :title="title"
    :mask-closable="false"
    v-model="visible"
    @on-cancel="cancel">
    <i-form
      ref="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="100">
      <i-form-item label="所属项目" prop="parentId">
        <i-cascader
          change-on-select
          :clearable="false"
          :data="resourceList"
          :render-format="format"
          :disabled="selectDisabled"
          v-model="resourcePath"
          @on-change="resourceChange">
        </i-cascader>
      </i-form-item>
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
          <i-form-item label="项目状态" prop="projectStatus">
            <i-input
              placeholder=""
              v-model="formObject.projectStatus">
            </i-input>
          </i-form-item>
        </i-col>
      </i-row>
      <i-row class-name="row">
        <i-col span="8" class-name="left">
          <i-form-item label="是否分区" prop="partitioned">
            <i-radio-group v-model="formObject.partitioned">
              <i-radio :label=1>
                <span>是</span>
              </i-radio>
              <i-radio :label=0>
                <span>否</span>
              </i-radio>
            </i-radio-group>
          </i-form-item>
        </i-col>
        <i-col span="8" class-name="left">
          <i-form-item label="是否远程" prop="partitioned">
            <i-radio-group v-model="formObject.partitioned">
              <i-radio :label=1>
                <span>是</span>
              </i-radio>
              <i-radio :label=0>
                <span>否</span>
              </i-radio>
            </i-radio-group>
          </i-form-item>
        </i-col>
        <i-col span="8" class-name="right">
          <i-form-item label="项目Proxy IP" prop="proxyIp">
            <i-input
              placeholder="请输入项目ProxyIP"
              v-model="formObject.proxyIp">
            </i-input>
          </i-form-item>
        </i-col>
      </i-row>

      <i-row class-name="row">
        <i-col span="7" class-name="left">
          <i-form-item label="区域" prop="area">
            <Select v-model="formObject.area">
              <Option v-for="item in areaList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </i-form-item>
        </i-col>
        <i-col span="10" class-name="left">
          <i-form-item label="代表处" prop="companyOffice">
            <i-input
              type="text"
              placeholder="请输入代表处名称"
              v-model="formObject.companyOffice">
            </i-input>
          </i-form-item>
        </i-col>
        <i-col span="7" class-name="right">
          <i-form-item label="常驻地" prop="location">
            <i-input v-model="formObject.location"></i-input>
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
            <i-input v-model="formObject.contractName"></i-input>
          </i-form-item>
        </i-col>
      </i-row>
      <i-row class-name="row">
        <i-col span="12" class-name="left">
          <i-form-item label="开始日期" prop="startDate">
            <DatePicker type="date" placeholder="选择日期" v-model="formObject.startDate" format="yyyy-MM-dd" @on-change="startDateChange" ></DatePicker>
          </i-form-item>
        </i-col>
        <i-col span="12" class-name="right">
          <i-form-item label="结束日期" prop="endDate">
            <DatePicker type="date" placeholder="选择日期" v-model="formObject.endDate" format="yyyy-MM-dd" @on-change="endDateChange" ></DatePicker>
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
          <i-form-item label="项目经理" prop="projectManager">
            <i-input v-model="formObject.projectManager" placeholder="请输入项目经理名称"></i-input>
          </i-form-item>
        </i-col>
        <i-col span="12" class-name="right">
          <i-form-item label="所属行业" prop="projectTrade">
            <i-input
              placeholder="请输入所属行业"
              v-model="formObject.projectTrade">
            </i-input>
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
          <Button type="primary" @click="shouldAddMembersShow = true" size="small">选择</Button>
        </div>
      </i-form-item>
      <!--<i-form-item label="描述" prop="description">
        <i-input
          v-model="formObject.description"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}">
        </i-input>
      </i-form-item>-->
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click="submit">保 存</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
    <project-management-add-members v-model="shouldAddMembersShow" @getMembersData="getMembersData" :data="membersList"></project-management-add-members>
  </i-modal>
</template>
<script>
// import { activeFormat } from '@/assets/js/format';
import { required } from '@/assets/js/rule-validate.js';
import ProjectManagementAddMembers from './ProjectManagementAddMembers.vue'; // 引入选择成员组件
const resourceEmpty = {
  id: '',
  parentId: '',
  projectName: '',
  projectNo: '',
  partitioned: 0, //是否远程
  proxyIp: '',
  projectStatus: '',
  projectType: 1,
  contractNumber: '',
  contractName: '',
  area: '东区',
  companyOffice:'',
  location: '',
  endDate: '',
  startDate: '',
  serviceProperty: '随项目',
  projectManager: '',
  projectTrade:'',
  paySpec:'8814A0BG'
};

export default {
  name: 'ResourceModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    resourceList: {
      type: Array
    },
    resourceInfo: {
      type: Object,
      default() {
        return { ...resourceEmpty };
      }
    },
    defaultPath: {
      type: Array
    }
  },
  components:{
    'project-management-add-members':ProjectManagementAddMembers
  },
  data() {
    const validateOrderNo = (rule, value, callback) => {
      if (value !== 0 && !value) {
        return callback(new Error('同级菜单序号不能为空'));
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入一个整数'));
      } else {
        callback();
      }
    };

    return {
      visible: false,
      shouldAddMembersShow: false,
      selectDisabled: false, // 是否禁用级联选择器
      formObject: { ...resourceEmpty },
      resourcePath: [],
      membersList:[], // 项目成员数据
      projectTypeList: [
        { value: 1, label: '云服务'},
        { value: 2, label: '云驻场'}
      ],
      projectStatusList: [
        { value: 2, label: '外部项目'},
        { value: 2, label: '外部项目'}
      ],
      areaList: ['东区','南区','西区','北区'],
      servicePropertyList: ['随项目','单独销售','提前交付','其他'],
      paySpecList: ['8814A0BG','8814A0BS','8814A0E7',
                    '8814A0PP','8814A0XJ','8814A0XK',
                    '8814A0Y8','8814A109'],
      ruleValidate: {
        parentId: [
          required({ message: '父资源名称不能为空' })
        ],
        title: [
          required({ message: '资源名称不能为空' })
        ],
        location: [
          required({ message: '路由/ID不能为空' })
        ],
        orderNo: [
          {
            required: true,
            validator: validateOrderNo,
            trigger: 'blur'
          }
        ],
        // active: [
        //   required({ type: 'boolean' })
        // ],
        // owner: [
        //   required({ message: '创建者不能为空' })
        // ],
        type: [
          required({ type: 'number' })
        ],
        module: [
          required({ type: 'number' })
        ]
      }
    };
  },
  methods: {
    /**
     * @function 设置父资源的parentId
     * @param {Array} arr - 已选值
     */
    resourceChange(arr) {
      this.formObject.parentId = arr[arr.length - 1];
    },
    format(labels, selectedData) {
      const index = labels.length - 1;
      const data = selectedData[index] || false;
      if (data && data.code) {
        return labels[index];
      }
      return labels[index];
    },
    /**
     * @function 保存或修改
     */
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // this.formObject.owner = this.formObject.owner.toLowerCase();
          this.formObject.isActive = this.formObject.active;
          this.$loading.show();
          let url = '',
              method = '';
          if(this.title === '新增资源') {
            url = 'resource/add';
            method = 'POST'
          } else {
            url = 'resource/update';
            method = 'PUT';
          }
          this.$http({
            method,
            url,
            data: this.formObject
          }).then(({ data }) => {
            this.$loading.hide();
            if(data.status) {
              this.$Notice.success({
                desc: `${this.title}成功`
              });
              this.$refs['form'].resetFields();
              this.$emit('on-ok');
              this.visible = false;
            } else {
              this.$Notice.error({
                desc:
                  data.message && data.message !== '' ? data.message : '${this.title}失败'
              });
            }
          })
        }
      });
    },
    startDateChange(date) {
      this.formObject.startDate = date;
    },
    endDateChange(date) {
      this.formObject.endDate = date;
    },
    // 获取选中的项目成员
    getMembersData(membersList) {
      this.membersList = membersList;
    },
    // 移除项目成员
    removeProjectMembers(index) {
      this.membersList.splice(index,1);
    },
    /**
     * @function 关闭弹出框并重置表单
     */
    cancel() {
      this.visible = false;
      this.$refs['form'].resetFields();
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.visible = newVal;
        this.formObject = { ...this.resourceInfo };
        switch (this.title) {
          case '新增资源':
            this.resourcePath = this.defaultPath;
            this.formObject['parentId'] = this.defaultPath[this.defaultPath.length - 1];
            break;
          case '编辑资源':
            this.formObject.active = this.resourceInfo.isActive;
            this.resourcePath = this.defaultPath.slice(0, this.defaultPath.length - 1);
            if(this.resourcePath.length > 0) {
              this.selectDisabled = false;
            } else {
              this.selectDisabled = true;
            }
            break;
          default:
            break;
        }
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('input', newVal);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.projectMembers {
  height: 100px;
  position: relative;
  .projectMembers-box {
    height: 100px;
    width: 400px;
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
    left: 420px;
    top: 35px;
    width: 60px;
  }
}
</style>

