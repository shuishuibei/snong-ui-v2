<!--
 * @Description: 编辑用户
 * @Author: ys2234
 * @Date: 2019-09-03 14:43:34
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-18 10:11:27
 -->
<template>
  <i-modal
    class-name="user-edit"
    width="700px"
    :scrollable="true"
    :title="title"
    :mask-closable="false"
    v-model="visible"
    @on-cancel="cancel">
    <i-form
      ref="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="90">
      <i-form-item label="组织名称" prop="groupId">
        <i-cascader
          change-on-select
          placeholder="请选择组织"
          :clearable="false"
          :data="groupList"
          :render-format="format"
          :disabled="groupDisabled"
          v-model="formObject.groupPath"
          @on-change="groupChange">
        </i-cascader>
      </i-form-item>
      <i-row>
        <i-col span="12">
          <i-form-item label="登录名" prop="loginName">
            <i-tooltip placement="right">
              <i-input
                clearable
                placeholder="请输入登录名"
                :disabled="loginNameDisabled"
                v-model="formObject.loginName">
              </i-input>
              <same-name-tips></same-name-tips>
            </i-tooltip>
          </i-form-item>
        </i-col>
        <i-col span="12">
          <i-form-item v-if="!userInfo" label="密码" prop="password">
            <i-tooltip placement="right">
              <i-input
                clearable
                type="password"
                placeholder="请输入密码"
                :readonly="pwdInputReadOnly"
                v-model="formObject.password"
                @on-focus="pwdFocus">
              </i-input>
              <same-password-tips></same-password-tips>
            </i-tooltip>
          </i-form-item>
          <i-form-item v-else label="状态" prop="active">
            <i-radio-group v-model="formObject.active">
              <i-radio :label="1">
                <span>有效</span>
              </i-radio>
              <i-radio :label="0">
                <span>无效</span>
              </i-radio>
            </i-radio-group>
          </i-form-item>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="12">
          <i-form-item label="用户名" prop="userName">
            <i-input
              clearable
              placeholder="请输入用户名"
              :maxlength="64"
              v-model="formObject.userName">
            </i-input>
          </i-form-item>
        </i-col>
        <i-col span="12">
          <i-form-item label="手机号码" prop="telephone">
            <i-tooltip placement="right">
              <i-input
                clearable
                placeholder="请输入手机号码"
                v-model="formObject.telephone">
              </i-input>
              <telephone-tips></telephone-tips>
            </i-tooltip>
          </i-form-item>
        </i-col>
      </i-row>
      <i-row v-if="!userInfo">
        <i-col span="12">
          <i-form-item label="角色" prop="roleId">
            <i-select
              placeholder="请选择角色"
              v-model="formObject.roleId">
              <i-option
                v-for="item in roleList"
                :value="item.id"
                :key="item.id">
                {{ item.name }}
              </i-option>
            </i-select>
          </i-form-item>
        </i-col>
        <i-col span="12">
          <i-form-item label="状态" prop="active">
            <i-radio-group v-model="formObject.active">
              <i-radio :label="1">
                <span>有效</span>
              </i-radio>
              <i-radio :label="0">
                <span>无效</span>
              </i-radio>
            </i-radio-group>
          </i-form-item>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="12">
          <i-form-item label="证件号码" prop="certification">
            <i-input
              clearable
              placeholder="请输入证件号码"
              :maxlength="64"
              v-model="formObject.certification">
            </i-input>
          </i-form-item>
        </i-col>
        <i-col span="12">
          <i-form-item label="电子邮箱" prop="email">
            <i-input
              clearable
              placeholder="请输入电子邮箱"
              :maxlength="64"
              v-model="formObject.email">
            </i-input>
          </i-form-item>
        </i-col>
      </i-row>
      <i-form-item label="地址" prop="address">
        <i-input
          clearable
          placeholder="请输入地址"
          :maxlength="255"
          v-model="formObject.address">
        </i-input>
      </i-form-item>
      <i-form-item label="备注" prop="description">
        <i-input
          clearable
          type="textarea"
          :maxlength="255"
          :autosize="{ minRows: 2, maxRows: 5 }"
          v-model="formObject.description">
        </i-input>
      </i-form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click.native="ok">确 认</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>
<script>
import {
  required,
  sameName,
  mobilePhone,
  identityCards,
  email
} from '@/assets/js/rule-validate.js';
import {
  SameNameTips,
  SamePasswordTips,
  TelephoneTips
} from '@/assets/js/tool-tips.js';
export default {
  name: 'UserEdit',
  /**
   * @property {boolean} value        - 弹出框显示或隐藏
   * @property {Object}  userInfo     - 用户信息
   * @property {string}  title        - 弹出框标题
   * @property {Array}   groupList    - 弹出框组织层级列表
   * @property {Array}   defaultPath  - 默认组织路径
   */
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object
    },
    title: {
      type: String
    },
    groupList: {
      type: Array
    },
    defaultPath: {
      type: Array
    }
  },
  components: {
    'same-name-tips': SameNameTips,
    'same-password-tips': SamePasswordTips,
    'telephone-tips': TelephoneTips
  },
  data() {
    return {
      visible: false, // 控制弹出框是否显示
      groupDisabled: false, // 禁用组织
      roleList: [], // 角色列表
      pwdInputReadOnly: true, // 密码输入框只读（取消浏览器默认填充）
      loginNameDisabled: false,
      /**
       * @property {string} id              - 用户ID
       * @property {Array}  groupPath       - 组织路径
       * @property {string} groupId         - 组织ID
       * @property {string} loginName       - 登录名
       * @property {string} password        - 密码
       * @property {number} active          - 状态
       * @property {string} userName        - 用户名
       * @property {string} telephone       - 手机号码
       * @property {string} roleId          - 角色ID
       * @property {string} certification   - 证件号码
       * @property {string} email           - 电子邮箱
       * @property {string} address         - 地址
       * @property {string} description     - 备注
       */
      formObject: {
        id: '',
        groupPath: [],
        groupId: '',
        loginName: '',
        password: '',
        active: 1,
        userName: '',
        telephone: '',
        roleId: '',
        certification: '',
        email: '',
        address: '',
        description: ''
      },
      ruleValidate: {
        groupId: [required({ message: '组织不能为空' })],
        loginName: [required({ message: '登录名不能为空' }), sameName()],
        password: [
          required({ message: '密码不能为空', trigger: 'blur change' }),
          {
            trigger: 'blur change',
            validator: (rule, value, callback) => {
              let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![!@#$%^&*?]+$)([a-z]|[A-Z]|[0-9]|[!@#$%^&*?]){8,20}$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error('密码格式不正确'));
              }
            }
          }
        ],
        active: [required({ message: '状态不能为空', type: 'number' })],
        userName: [
          required({ message: '用户名不能为空', trigger: 'blur change' })
        ],
        telephone: [mobilePhone()],
        roleId: [required({ message: '角色不能为空' })],
        email: [email()],
        certification: [identityCards()]
      }
    };
  },
  methods: {
    /**
     * @function 选择后展示的函数，用于自定义显示格式
     * @param {Array} labels        - 已选路径的标签
     * @param {Array} selectedData  - 已选路径的数据
     * @return {string}             - 级联选择器中显示的字符串
     */
    format(labels, selectedData) {
      return labels[labels.length - 1];
    },
    /**
     * @function 设置组织ID，并重新获取角色列表
     * @description 选择完成后的回调
     * @param {array} selectedPathId - 已选路径的ID
     */
    groupChange(selectedPathId) {
      this.formObject.groupId = selectedPathId[selectedPathId.length - 1];
      this.getRoleList().then(res => {
        this.roleList = res.data.records;
        if (this.roleList.length > 0) {
          this.formObject.roleId = this.roleList[0].id;
        } else {
          this.formObject.roleId = '';
        }
      });
    },
    getRoleList() {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'POST',
          url: `user/role/list/page/${this.formObject.groupId}`,
          data: {
            current: 0,
            pageSize: 10000
          }
        }).then(({ data }) => {
          resolve(data);
        });
      });
    },
    pwdFocus() {
      this.pwdInputReadOnly = false;
    },
    ok() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$loading.show();
          switch (this.title) {
            case '新增用户':
              this.$http({
                method: 'POST',
                url: '/user/add',
                data: {
                  ...this.formObject,
                  active: this.formObject.active ? true : false
                }
              }).then(({ data }) => {
                this.$loading.hide();
                if (data.status) {
                  this.$Notice.success({
                    desc: '新增用户成功'
                  });
                  this.$emit('on-ok');
                  this.visible = false;
                  this.$refs['form'].resetFields();
                }
              });
              break;
            case '修改用户':
              this.$http({
                method: 'PUT',
                url: 'user/update',
                data: {
                  ...this.formObject,
                  active: this.formObject.active ? true : false,
                  roleLevel: this.userInfo.roleLevel
                }
              }).then(({ data }) => {
                this.$loading.hide();
                if (data.status) {
                  this.$Notice.success({
                    desc: '修改用户成功'
                  });
                  this.$emit('on-ok');
                  this.visible = false;
                  this.$refs['form'].resetFields();
                }
              });
              break;
            default:
              break;
          }
        }
      });
    },
    cancel() {
      this.visible = false;
      this.$refs['form'].resetFields();
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.formObject.groupPath = this.defaultPath; // 设置组织默认路径
        switch (this.title) {
          case '新增用户':
            this.groupChange(this.formObject.groupPath); // 设置组织ID
            this.loginNameDisabled = false;
            break;
          case '修改用户':
            this.formObject.groupId = this.formObject.groupPath[
              this.formObject.groupPath.length - 1
            ]; // 设置组织ID
            this.loginNameDisabled = true;
            this.formObject.id = this.userInfo.id; // ID
            this.formObject.loginName = this.userInfo.loginName; // 登录名
            this.formObject.active = this.userInfo.active ? 1 : 0; // 状态
            this.formObject.userName = this.userInfo.userName; // 用户名
            this.formObject.telephone = this.userInfo.telephone
              ? this.userInfo.telephone
              : ''; // 电话号码
            this.getRoleList().then(res => {
              this.roleList = res.data.records;
              this.formObject.roleId = this.userInfo.roleId; // 角色ID
            });
            this.formObject.certification = this.userInfo.certification
              ? this.userInfo.certification
              : ''; // 证件号码
            this.formObject.email = this.userInfo.email
              ? this.userInfo.email
              : ''; // 电子邮箱
            this.formObject.address = this.userInfo.address; // 地址
            this.formObject.description = this.userInfo.description; // 备注
            /* 修改的用户等级为云管理员时（只有根组织下有云管理员，因此不需要判断组织是否是根组织），禁止修改组织 */
            if (this.userInfo.roleLevel === 0) {
              this.groupDisabled = true;
            } else {
              this.groupDisabled = false;
            }
            break;
          default:
            break;
        }
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); // 清楚右上角提示信息
        this.visible = newVal; // 显示对话框
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