<!--
 * @Description Power虚拟机基本申请页面的基本信息
 * @Author ys1983/张睿博
 * @Date 2019-08-21 15:40:23
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:56:22
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item
      label="物理主机"
      prop="hostName">
      <i-input
        placeholder="请选择物理主机"
        style="width:300px;"
        disabled
        v-model="formValidate.hostName">
      </i-input>
      <i-button
        type="primary"
        @click="jumpRouterToSelectHostPage"
        style="width:70px;margin-left:10px">
        <i v-pre class="iconfont icon-icon icon-xuanzegongju"></i>
        <span v-pre class="btn-title">选择</span>
      </i-button>
    </i-form-item>
    <i-form-item
      label="连接组"
      prop="scgId">
      <i-select
        style="width:300px"
        v-model="formValidate.scgId"
        @on-change="changeConnectionGroup"
        label-in-value>
        <i-option
          v-for="item in connectionGroup"
          :key="item.scgId"
          :value="item.scgId">
          {{item.display_name}}
        </i-option>
      </i-select>
    </i-form-item>
    <i-form-item
      label="Power虚拟机名称"
      prop="name">
      <i-input
        placeholder="请输入Power虚拟机名称"
        style="width:300px"
        v-model="formValidate.name">
      </i-input>
      <span v-pre class="cds-margin-left-10 cds-color-999">只能由字母、数字、短横线组成，且只能以字母开头，字数不超过32</span>
    </i-form-item>
    <i-form-item
      label="Power虚拟机描述"
      prop="description">
      <i-input
        v-model="formValidate.description"
        type="textarea"
        :maxlength="128"
        style="width: 550px;"
        :rows="5"
        placeholder="描述Power虚拟机用途，例如：ERP系统，字数不超过128">
      </i-input>
    </i-form-item>
  </i-form>
</template>

<script>
import { required, name } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'SinglePowerBaseInfo',
  props: {
    baseInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formValidate: {
        hostName: '', // 物理主机名称
        groupName: '', // 物理主机属于哪个物理主机组
        scgId: '', // 连接组id
        scgName: '', // 连接组名称
        name: '', //虚拟机名称
        description: '', // 虚拟机描述
        hostPageInfo: {
          page: 1,
          pageSize: 10
        },
        displayHostName: ''
      },
      ruleValidate: {
        hostName: required({ message: '物理主机名称不能为空' }),
        scgId: required({ message: '连接组不能为空' }),
        name: [
          required({ message: 'Power虚拟机名称不能为空' }),
          name({ message: '只能由字母、数字、短横线组成，且只能以字母开头' })
        ]
      },
      connectionGroup: [], // 连接组数据
      hostInfo: {
        id: '',
        name: '',
        groupName: ''
      }
    };
  },
  methods: {
    /**
     * @function getConnectionGroupHttp
     * @description 获取主机连接组列表
     * @param {Boolean} is
     * @returns {null}
     */
    getConnectionGroupHttp(is = false) {
      this.$http({
        url: 'power/server/list/scg',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.list.length > 0) {
          this.connectionGroup = data.data.list;
          if (!is) {
            this.formValidate.scgId = '-1';
            this.formValidate.scgName = '自动配置';
          }
        } else {
          this.connectionGroup = [];
          this.formValidate.scgId = '';
          this.formValidate.scgName = '';
        }
      });
    },
    /**
     * @function changeConnectionGroup
     * @description 当连接组改变时触发的方法
     * @param {String} label
     * @returns {null}
     */
    changeConnectionGroup({ label }) {
      this.formValidate.scgName = label;
    },
    /**
     * @function jumpRouterToSelectHostPage
     * @description 跳转路由到选择物理主机页面
     * @returns {void}
     */
    jumpRouterToSelectHostPage() {
      let { id, name, groupName } = this.hostInfo;
      let { page, pageSize } = this.formValidate.hostPageInfo;
      if (this.$route.query.id) {
        this.$router.push({
          name: 'resource-directory/power-small-machine/base/select-host',
          query: {
            id: this.$route.query.id,
            hostId: id,
            name,
            groupName,
            page,
            pageSize,
            time: new Date().getTime()
          }
        });
      } else {
        this.$router.push({
          name: 'resource-directory/power-small-machine/base/select-host',
          query: {
            hostId: id,
            name,
            groupName,
            page,
            pageSize,
            time: new Date().getTime()
          }
        });
      }
    }
  },
  mounted() {
    !this.$route.query.hasOwnProperty('id') && this.getConnectionGroupHttp();
  },
  watch: {
    $route({ params }) {
      if (params.hasOwnProperty('row') && params.row.hasOwnProperty('id')) {
        let { id, name, display_name, groupName } = params.row;
        this.formValidate.hostName = name;
        this.formValidate.groupName = groupName;
        this.formValidate.displayHostName = display_name;
        this.hostInfo = { id, name, groupName };
        this.formValidate.hostPageInfo = params.pageInfo;
        this.$emit('e-host-name', { name, is: false });
      }
    },
    baseInfo(newValue) {
      if (newValue.hostName) {
        let { hostName, groupName } = newValue;
        this.formValidate = Object.assign(this.formValidate, newValue);
        this.hostInfo = { ...this.hostInfo, name: hostName, groupName };
        this.$emit('e-host-name', { name: hostName, is: true });
        this.getConnectionGroupHttp(true);
      }
    }
  }
};
</script>
