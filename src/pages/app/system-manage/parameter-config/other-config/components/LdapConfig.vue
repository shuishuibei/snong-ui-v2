<!--
 * @Description: LDAP配置
 * @Author: ys2234
 * @Date: 2019-10-24 10:04:08
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:31:00
 -->
<template>
  <div class="ldap-config">
    <i-form
      ref="form"
      class="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="150">
      <i-form-item label="域服务器地址" prop="address">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入域服务器地址"
          v-model="formObject.address">
        </i-input>
      </i-form-item>
      <i-form-item label="端口号" prop="port">
        <h3c-input-number
          type="text"
          class-name="common-input"
          placeholder="请输入端口号"
          v-model="formObject.port">
      </h3c-input-number>
      </i-form-item>
      <i-form-item label="BaseDn" prop="baseDn">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入BaseDn"
          v-model="formObject.baseDn">
        </i-input>
      </i-form-item>
      <i-form-item label="认证类型" prop="type">
        <i-select
          class="common-input"
          v-model="formObject.type">
          <i-option
            v-for="(item,index) in typeList"
            :value="item" :key="index">
            {{ item }}
          </i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="默认组织" prop="groupId">
        <i-select
          transfer
          class="common-input"
          v-model="formObject.groupId">
          <i-option
            v-for="item in groupList"
            :value="item.id"
            :key="item.id">
            {{item.name}}
          </i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="默认角色" prop="roleId">
        <i-select
          transfer
          class="common-input"
          v-model="formObject.roleId">
          <i-option
            v-for="item in roleList"
            :value="item.id"
            :key="item.id">
            {{item.name}}
            </i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="测试用户名" prop="username">
        <i-input
          type="text"
          class="common-input"
          placeholder="请输入测试用户名"
          v-model="formObject.username">
        </i-input>
      </i-form-item>
      <i-form-item label="测试用户密码" prop="password">
        <i-input
          type="password"
          class="common-input"
          placeholder="请输入测试用户密码"
          v-model="formObject.password">
        </i-input>
      </i-form-item>
    </i-form>
  </div>
</template>

<script>
import {
  required,
  ip,
  port
} from '@/assets/js/rule-validate.js';
import H3cInputNumber from '@/components/h3c-input-number/H3cInputNumber.vue';
export default {
  name: 'LdapConfig',
  components: {
    'h3c-input-number': H3cInputNumber
  },
  data() {
    return {
      isTest: false,
      typeList: [
        'simple',
        'none',
        'strong'
      ], // 认证类型列表
      groupList: [], // 组织列表
      roleList: [], // 角色列表
      /**
       * @property {string} address   - 域服务器地址
       * @property {string} port      - 端口号
       * @property {string} baseDn    - BaseDn
       * @property {string} type      - 认证类型
       * @property {string} groupId   - 默认组织
       * @property {string} roleId    - 默认角色
       * @property {string} username  - 测试用户名
       * @property {string} password  - 测试用户密码
       */
      formObject: {
        address: '',
        port: '',
        baseDn: '',
        type: '',
        groupId: '',
        roleId: '',
        username: '',
        password: ''
      },
      ruleValidate: {
        address: [
          required({
            message: '域服务器地址不能为空'
          }),
          ip({
            message: '域服务器地址格式不正确'
          })
        ],
        port: [
          required({
            message: '端口号不能为空'
          }),
          port({
            message: '端口号格式不正确'
          })
        ],
        baseDn: [
          required({
            message: 'BaseDn（域名）不能为空'
          })
        ],
        username: [
          required({
            message: '测试用户名不能为空'
          })
        ],
        password: [
          required({
            message: '测试用户密码不能为空'
          }),
        ]
      }
    }
  },
  methods: {
    getGroupList() {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'GET',
          url: '/sysldap/groups'
        }).then(({ data }) => {
          resolve(data);
        })
      })
    },
    getRoleList() {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'GET',
          url: '/sysldap/roles'
        }).then(({ data }) => {
          resolve(data);
        })
      })
    },
    getDefaultValue() {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'GET',
          url: '/sysldap/info'
        }).then(({ data }) => {
          resolve(data);
        })
      })
    },
    test() {
      this.$loading.show();
      this.$http({
        method: 'POST',
        url: '/sysldap/connect',
        data: this.formObject
      }).then(({ data }) => {
        this.$loading.hide();
        if(data.status) {
          this.isTest = true;
          this.$Notice.success({
            desc: '认证通过！'
          });
        }
      })
    },
    save() {
      if(this.isTest) {
        this.$loading.show();
        this.$http({
          method: 'POST',
          url: '/sysldap/save',
          data: this.formObject
        }).then(({ data }) => {
          this.$loading.hide();
          if(data.status) {
            this.$Notice.success({
              desc: '保存成功！'
            });
          }
        })
      } else {
        this.$Notice.warning({
          desc: '请先进行连接测试！'
        })
      }
    },
    init() {
      this.isTest = false;
      this.$loading.show();
      Promise.all([this.getGroupList(), this.getRoleList()]).then((res) => {
        if(res[0].status) {
          this.groupList = res[0].data;
        }
        if(res[1].status) {
          this.roleList = res[1].data;
        }
        this.getDefaultValue().then((res) => {
          this.$loading.hide();
          if(res.status) {
            this.formObject = res.data;
            this.formObject.port = String(res.data.port);
          }
        })
      })
    }
  },
  created() {
    this.init();
  }
}
</script>

<style>

</style>