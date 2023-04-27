<!--
 * @Description: 编辑组织
 * @Author: ys2234
 * @Date: 2019-07-25 11:47:04
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-18 10:12:52
 -->
<template>
  <i-modal
    width="580px"
    class-name="group-edit"
    v-model="visible"
    :title="title"
    :scrollable="true"
    :mask-closable="false"
    @on-cancel="cancel">
    <i-form
      ref="form"
      :model="formObject"
      :rules="ruleValidate"
      :label-width="90">
      <i-form-item label="父组织名称" prop="parentGroupId">
        <i-cascader
          change-on-select
          :data="groupList"
          :clearable="false"
          :disabled="isParentGroupDisabled"
          :render-format="format"
          v-model="formObject.parentGroupPath"
          @on-change="parentGroupChange">
        </i-cascader>
      </i-form-item>
      <i-form-item label="组织名称" prop="groupName">
        <i-tooltip placement="right">
          <i-input
            clearable
            placeholder="请输入组织名称"
            v-model="formObject.groupName">
          </i-input>
          <same-name-tips></same-name-tips>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="别名" prop="alias">
        <i-input
          clearable
          placeholder="请输入别名"
          :maxlength="64"
          v-model="formObject.alias">
        </i-input>
      </i-form-item>
      <template>
        <!-- 当修改根组织时，通过parentGroupPath判断是否是根组织，是：隐藏资源池选择框 -->
        <i-form-item
          label="资源池"
          prop="resourcePoolId"
          v-if="formObject.parentGroupPath.length > 0">
          <!-- 当修改组织时，禁用资源池选择框 -->
          <i-select
            :disabled="title === '编辑组织'"
            v-model="formObject.resourcePoolId">
            <i-option
              :value="item.id"
              :key="item.id"
              v-for="item in resourcePoolList">
              {{item.name}}
            </i-option>
          </i-select>
        </i-form-item>
      </template>
      <i-form-item
        label="状态"
        prop="active"
        v-show="false">
        <i-radio-group v-model="formObject.active">
          <i-radio :label="1">
            <span>有效</span>
          </i-radio>
          <i-radio :label="0">
            <span>无效</span>
          </i-radio>
        </i-radio-group>
      </i-form-item>
      <i-form-item label="机构负责人" prop="principal">
        <i-input
          clearable
          placeholder="请输入机构负责人"
          :maxlength="64"
          v-model="formObject.principal">
        </i-input>
      </i-form-item>
      <i-form-item label="联系人" prop="linkman">
        <i-input
          clearable
          placeholder="请输入联系人"
          :maxlength="64"
          v-model="formObject.linkman">
        </i-input>
      </i-form-item>
      <i-form-item label="电话号码" prop="telephone">
        <i-tooltip placement="right">
          <i-input
            clearable
            placeholder="请输入电话号码"
            v-model="formObject.telephone">
          </i-input>
          <div slot="content">
            <p>该值必须是3或4位区号加“-”的固话或</p>
            <p>11位手机号，如：010-82774537，</p>
            <p>13806504476</p>
          </div>
        </i-tooltip>
      </i-form-item>
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
          type="textarea"
          :maxlength="255"
          v-model="formObject.description"
          :autosize="{minRows: 2,maxRows: 5}"></i-input>
      </i-form-item>
    </i-form>
    <div slot="footer">
      <i-button type="primary" @click.native="ok">确 认</i-button>
      <i-button @click="cancel">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import { required, sameName, allPhone } from '@/assets/js/rule-validate.js';
import { SameNameTips } from '@/assets/js/tool-tips.js';
export default {
  name: 'GroupEdit',
  /**
   * @property {boolean} value           - 弹出框显示或隐藏
   * @property {string}  title           - 弹出框标题
   * @property {Array}   groupList       - 弹出框组织层级列表
   * @property {Array}   defaultPath     - 默认父组织路径
   * @property {Object}  groupInfo       - 当前组织详情
   */
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    groupList: {
      type: Array
    },
    defaultPath: {
      type: Array
    },
    groupInfo: {
      type: Object
    }
  },
  components: {
    'same-name-tips': SameNameTips
  },
  data() {
    return {
      visible: false, // 控制弹出框是否显示
      resourcePoolList: [], // 资源池列表
      isParentGroupDisabled: false, // 是否禁用父组织级联选择器
      /**
       * @property {string} id              - 组织ID，新增时为空
       * @property {Array}  parentGroupPath - 父组织路径
       * @property {string} parentGroupId   - 父组织ID
       * @property {string} groupName       - 组织名称
       * @property {string} alias           - 别名
       * @property {string} resourcePoolId  - 资源池ID
       * @property {number} active          - 状态
       * @property {string} principal       - 机构负责人
       * @property {string} linkman         - 联系人
       * @property {string} telephone       - 电话号码
       * @property {string} address         - 地址
       * @property {string} description     - 备注
       */
      formObject: {
        id: '',
        parentGroupPath: [],
        parentGroupId: '',
        groupName: '',
        alias: '',
        resourcePoolId: '',
        active: 1,
        principal: '',
        linkman: '',
        telephone: '',
        address: '',
        description: ''
      },
      ruleValidate: {
        parentGroupId: [required({ message: '父组织不能为空' })],
        groupName: [
          required({ message: '组织名称不能为空' }),
          sameName({ message: '组织名称格式不正确' })
        ],
        resourcePoolId: [required({ message: '资源池不能为空' })],
        active: [required({ message: '状态不能为空', type: 'number' })],
        telephone: [allPhone()]
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
     * @function 设置父组织ID
     * @description 选择完成后的回调
     * @param {array} selectedPathId - 已选路径的ID
     */
    parentGroupChange(selectedPathId) {
      this.formObject.parentGroupId = selectedPathId[selectedPathId.length - 1];
    },
    /**
     * @function 获取资源池列表
     * @returns {Promise} 返回一个请求资源池的Promise对象
     */
    getPoolList(parentGroupId) {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'POST',
          url: '/pool/options',
          params: {
            parentGroupId
          }
        }).then(({ data }) => {
          resolve(data);
        });
      });
    },
    ok() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$loading.show();
          let payload = {
            id: this.formObject.id,
            parentId: this.formObject.parentGroupId,
            name: this.formObject.groupName,
            poolId: this.formObject.resourcePoolId,
            label: this.formObject.alias,
            active: this.formObject.active ? true : false,
            principal: this.formObject.principal,
            linkman: this.formObject.linkman,
            telephone: this.formObject.telephone,
            address: this.formObject.address,
            description: this.formObject.description
          };
          switch (this.title) {
            case '新增组织':
              this.$http({
                method: 'POST',
                url: '/group/v2/',
                data: payload
              }).then(({ data }) => {
                this.$loading.hide();
                if (data.status) {
                  this.$Notice.success({
                    desc: '新增组织成功'
                  });
                  this.$emit('on-ok', this.formObject.groupName);
                  this.visible = false;
                  this.$refs['form'].resetFields();
                }
              });
              break;
            case '编辑组织':
              this.$http({
                method: 'PUT',
                url: '/group/update',
                data: {
                  ...payload,
                  owner: this.groupInfo.owner,
                  otherInfo: this.groupInfo.otherInfo,
                  platformTenantId: this.groupInfo.platformTenantId
                }
              }).then(({ data }) => {
                this.$loading.hide();
                if (data.status) {
                  this.$Notice.success({
                    desc: '编辑组织成功'
                  });
                  this.$emit('on-ok', this.formObject.groupName);
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
        /* 资源池打开时 */
        switch (true) {
          case this.title === '新增组织':
            this.formObject.parentGroupPath = this.defaultPath; // 设置默认父组织路径
            this.parentGroupChange(this.defaultPath); // 设置默认父组织ID
            /* 获取资源池列表 */
            this.$loading.show();
            this.getPoolList(this.formObject.parentGroupId).then(res => {
              this.$loading.hide();
              if (res.status) {
                this.resourcePoolList = res.data; // 设置资源池列表
                this.formObject.resourcePoolId =
                  this.resourcePoolList.length > 0
                    ? this.resourcePoolList[0].id
                    : ''; // 设置资源池默认选择项
              }
            });
            break;
          case this.title === '编辑组织':
            this.formObject.id = this.groupInfo.id; // 设置当前组织ID
            this.isParentGroupDisabled = true; // 禁用父组织级联选择器
            if (this.defaultPath.length > 1) {
              /* 当修改的组织不是根组织时 */
              this.$loading.show();
              this.formObject.parentGroupPath = this.defaultPath.slice(
                0,
                this.defaultPath.length - 1
              ); // 设置默认父组织路径
              this.parentGroupChange(this.formObject.parentGroupPath); // 设置默认父组织ID
              this.getPoolList(this.formObject.parentGroupId).then(res => {
                this.$loading.hide();
                if (res.status) {
                  this.resourcePoolList = res.data; // 设置资源池列表
                  this.formObject.resourcePoolId = this.groupInfo.poolId;
                }
              });
            } else {
              /* 当修改的组织是根组织时，不需要获取资源池列表 */
              this.formObject.parentGroupId = this.groupInfo.parentId;
            }
            this.formObject.groupName = this.groupInfo.name; // 设置组织名称
            this.formObject.alias = this.groupInfo.label
              ? this.groupInfo.label
              : ''; // 设置组织别名
            this.formObject.active = this.groupInfo.active ? 1 : 0; // 设置状态
            this.formObject.principal = this.groupInfo.principal
              ? this.groupInfo.principal
              : ''; // 设置机构负责人
            this.formObject.linkman = this.groupInfo.linkman
              ? this.groupInfo.linkman
              : ''; // 设置联系人
            this.formObject.telephone = this.groupInfo.telephone
              ? this.groupInfo.telephone
              : ''; // 设置电话号码
            this.formObject.address = this.groupInfo.address
              ? this.groupInfo.address
              : ''; // 设置地址
            this.formObject.description = this.groupInfo.description
              ? this.groupInfo.description
              : ''; // 设置备注
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