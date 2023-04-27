<!--
 * @Description: 用户注册
 * @Author: ys2234
 * @Date: 2019-09-09 11:05:54
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-18 10:06:36
 -->
<template>
  <div class="join cds-wrapper">
    <h3c-header>
      <template #header-function>
        <div class="header-prompt">
          已有账号？去
          <a href="javascript:;" @click="$router.push({ name: 'login' })">登录</a>
        </div>
      </template>
    </h3c-header>
    <div class="join-content-box">
      <div class="join-content">
        <div class="join-content-top">
          <div class="username-box">
            <i class="iconfont icon-username"></i>
          </div>
          <span>用户注册</span>
        </div>
        <div class="join-content-bottom">
          <i-form
            ref="form"
            class="join-form"
            :model="formObject"
            :rules="ruleValidate"
            :label-width="100">
            <i-form-item label="组织名称" prop="groupId">
              <i-cascader
                placeholder="请选择组织"
                change-on-select
                :data="groupList"
                :clearable="false"
                :render-format="format"
                v-model="formObject.groupPath"
                @on-change="groupChange">
              </i-cascader>
            </i-form-item>
            <i-form-item label="登录名" prop="loginName">
              <i-tooltip placement="right">
                <i-input
                  clearable
                  placeholder="请输入登录名"
                  v-model="formObject.loginName">
                </i-input>
                <same-name-tips></same-name-tips>
              </i-tooltip>
            </i-form-item>
            <i-form-item label="密码" prop="password">
              <i-tooltip placement="right">
                <i-input
                  clearable
                  placeholder="请输入密码"
                  type="password"
                  v-model="formObject.password"
                  :readonly="pwdInputReadOnly"
                  @on-focus="passwordFocus">
                </i-input>
                <same-password-tips></same-password-tips>
              </i-tooltip>
            </i-form-item>
            <i-form-item label="用户名" prop="userName">
              <i-input
                clearable
                placeholder="请输入用户名"
                v-model="formObject.userName">
              </i-input>
            </i-form-item>
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
            <i-form-item label="证件号码" prop="certification">
              <i-input
                clearable
                placeholder="请输入证件号码"
                v-model="formObject.certification">
              </i-input>
            </i-form-item>
            <i-form-item label="电子邮箱" prop="email">
              <i-input
                clearable
                placeholder="请输入电子邮箱"
                v-model="formObject.email">
              </i-input>
            </i-form-item>
            <i-form-item label="地址">
              <i-input
                clearable
                placeholder="请输入地址"
                v-model="formObject.address">
              </i-input>
            </i-form-item>
            <i-form-item label="备注">
              <i-input
                clearable
                type="textarea"
                placeholder="请输入备注"
                :maxlength="255"
                :autosize="{ minRows: 2, maxRows: 5 }"
                v-model="formObject.description">
              </i-input>
            </i-form-item>
            <i-form-item>
              <i-button
                long
                type="primary"
                @click="handleJoin">
                立即注册
              </i-button>
            </i-form-item>
          </i-form>
        </div>
        <div class="copy-right">
          版权所有&copy;新华三云计算有限公司 保留一切权利
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  required,
  mobilePhone,
  sameName,
  identityCards,
  email,
  samePassword
} from '@/assets/js/rule-validate.js';
import {
  SameNameTips,
  SamePasswordTips,
  TelephoneTips
} from '@/assets/js/tool-tips.js';
import { buildTree } from '@/assets/js/utils';
import { treePathFormat } from '@/assets/js/format';
import H3cHeader from '@/components/h3c-header/H3cHeader.vue';
export default {
  name: 'Join',
  components: {
    'h3c-header': H3cHeader,
    'same-name-tips': SameNameTips,
    'same-password-tips': SamePasswordTips,
    'telephone-tips': TelephoneTips
  },
  data() {
    return {
      groupList: [], // 组织列表
      pwdInputReadOnly: true,
      /**
       * @property {string} groupId         - 组织ID
       * @property {string} groupPath       - 组织路径
       * @property {string} loginName       - 登录名
       * @property {string} password        - 密码
       * @property {string} userName        - 用户名
       * @property {number} phoneNumber     - 登录名
       * @property {string} certification   - 证件号码
       * @property {string} email           - 电子邮箱
       * @property {string} address         - 地址
       * @property {string} description     - 备注
       */
      formObject: {
        groupId: '',
        groupPath: [],
        loginName: '',
        password: '',
        userName: '',
        telephone: '',
        certification: '',
        email: '',
        address: '',
        description: ''
      },
      ruleValidate: {
        groupId: [required({ message: '组织不能为空' })],
        loginName: [required({ message: '登录名不能为空' }), sameName()],
        password: [required({ message: '密码不能为空' }), samePassword()],
        userName: [required({ message: '用户名不能为空' })],
        telephone: [mobilePhone()],
        certification: [identityCards()],
        email: [email()]
      }
    };
  },
  methods: {
    getGroupList() {
      this.$http({
        method: 'GET',
        url: '/group/list/registe'
      }).then(({ data }) => {
        if (data.status) {
          this.groupList = buildTree(data.data, 'createDate', item => {
            return {
              id: item.id,
              name: item.name,
              parentId: item.parentId,
              parentName: item.parentName,
              title: item.name, // 显示的组织名称
              value: item.id, // 级联选择时的唯一标识，因为id是唯一的，所以取id的值
              label: item.name, // 级联选择时显示的资源名称
              show: item.show
            };
          })[0].children;
          if (this.groupList.length > 0) {
            this.formObject.groupId = this.groupList[0].id;
            this.formObject.groupPath = treePathFormat(
              this.groupList,
              this.formObject.groupId
            ).path;
          }
        }
      });
    },
    /**
     * @function format
     * @description 选择后展示的函数，用于自定义显示格式
     * @param {Array} labels        - 已选路径的标签
     * @param {Array} selectedData  - 已选路径的数据
     * @return {string}             - 级联选择器中显示的字符串
     */
    format(labels, selectedData) {
      return labels[labels.length - 1];
    },
    /**
     * @function groupChange
     * @description 选择完成后的回调，设置父组织ID
     * @param {array} selectedPathId - 已选路径的ID
     */
    groupChange(selectedPathId) {
      this.formObject.groupId = selectedPathId[selectedPathId.length - 1];
    },
    passwordFocus() {
      this.pwdInputReadOnly = false;
    },
    handleJoin() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$loading.show();
          this.$http({
            method: 'POST',
            url: '/user/add',
            data: {
              ...this.formObject,
              password: this.$base64.encode(this.formObject.password)
            }
          }).then(({ data }) => {
            if (data.status) {
              this.$Notice.success({
                desc: '用户注册成功，即将跳转至登录页面'
              });
              setTimeout(() => {
                this.$loading.hide();
                this.$router.push({
                  name: 'login'
                });
              }, 2000);
            } else {
              this.$loading.hide();
            }
          });
        }
      });
    }
  },
  created() {
    this.getGroupList();
  }
};
</script>

<style scoped lang="less">
@import url('../../assets/css/theme.less');
@inputHeight: 45px;
.join {
  font-family: 'Microsoft YaHei';
  .header-prompt {
    padding-right: 20px;
    font-size: 16px;
    color: #a3aabd;
  }
  .join-content-box {
    width: 100%;
    position: absolute;
    top: @headerHeight;
    bottom: 0;
    overflow: auto;
    background-color: #f5f6f8;
    background: #f5f6f8 url(../../assets/imgs/join/join-bg-img.png) no-repeat 0
      100%;
    background-size: 100% 50%;
    .join-content {
      width: 940px;
      border-radius: 6px;
      margin: 45px auto;
      position: relative;
      .join-content-top,
      .join-content-bottom {
        background-color: #ffffff;
      }
      .join-content-top {
        box-sizing: content-box;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-bottom: 1px solid #e4e7ee;
        padding: 18px 0;
        font-size: 0;
        border-radius: 6px 6px 0 0;
        .username-box,
        span {
          display: inline-block;
          vertical-align: middle;
        }
        .username-box {
          width: 32px;
          height: 32px;
          line-height: 32px;
          font-size: 20px;
          color: #fdfcf7;
          background-color: #329cff;
          border-radius: 50%;
          margin-right: 12px;
          box-sizing: content-box;
          .iconfont {
            font-size: 20px;
            &::before {
              font-size: 20px;
            }
          }
        }
        span {
          font-size: 16px;
        }
      }
      .join-content-bottom {
        border-radius: 0 0 6px 6px;
        .join-form {
          width: 500px;
          padding: 25px 0 20px 0;
          margin: 0 auto;
          /deep/ .ivu-form-item {
            margin-bottom: 25px;
          }
          /* form-item-label */
          /deep/ .ivu-form-item-label {
            font-size: 14px;
            padding-top: 0;
            padding-bottom: 0;
            line-height: @inputHeight;
          }
          /* input */
          /deep/ .ivu-input {
            height: @inputHeight;
            font-size: 14px;
          }
          /* input中的clearable */
          /deep/ .ivu-input-icon {
            line-height: @inputHeight;
          }
          /* 立即注册按钮 */
          /deep/ .ivu-btn-primary {
            height: @inputHeight;
            font-size: 14px;
          }
        }
      }
      .copy-right {
        text-align: center;
        color: #9b9b9d;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: calc(~'100% + 25px');
      }
    }
  }
}
</style>