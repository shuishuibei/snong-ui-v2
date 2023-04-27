<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-11-03 11:25:14
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-22 18:13:06
 -->
<template>
  <div class="process-details" :style="{'margin-bottom': data.isApprove ? '80px' : 0}">
    <div
      class="resource-table-wrap"
      style="margin-top: 0">
      <div class="resource-table-title">基本信息</div>
      <i-table
        :columns="basicInforColumn"
        :data="[data]">
      </i-table>
    </div>
    <div
      v-if="server.length > 0"
      class="resource-table-wrap">
      <div class="resource-table-title">X86虚拟机</div>
      <i-table
        :loading="globalTableLoading"
        :columns="serverColumn"
        :data="server">
      </i-table>
    </div>
    <div
      v-if="volume.length > 0"
      class="resource-table-wrap">
      <div class="resource-table-title">X86硬盘</div>
      <i-table
        :loading="globalTableLoading"
        :columns="volumeColumn"
        :data="volume">
      </i-table>
    </div>
    <div
      v-if="powerVM.length > 0"
      class="resource-table-wrap">
      <div class="resource-table-title">Power虚拟机</div>
      <i-table
        :loading="globalTableLoading"
        :columns="powerVMColumn"
        :data="powerVM">
      </i-table>
    </div>
    <div
      v-if="powerVolume.length > 0"
      class="resource-table-wrap">
      <div class="resource-table-title">Power硬盘</div>
      <i-table
        :loading="globalTableLoading"
        :columns="powerVolumeColumn"
        :data="powerVolume">
      </i-table>
    </div>
    <div
      v-if="port.length > 0"
      class="resource-table-wrap">
      <div class="resource-table-title">虚拟网卡</div>
      <i-table
        :loading="globalTableLoading"
        :columns="portColumn"
        :data="port">
      </i-table>
    </div>
    <div
      v-if="bareMetal.length > 0"
      class="resource-table-wrap">
      <div class="resource-table-title">裸金属</div>
      <i-table
        :loading="globalTableLoading"
        :columns="bareMetalColumn"
        :data="bareMetal">
      </i-table>
    </div>
    <div
      v-if="data.isApprove"
      class="resource-table-wrap">
      <div class="resource-table-title">审批意见</div>
      <div class="approval-comments-input">
        <i-form
          ref="todoProcessForm"
          :model="todoProcessForm"
          :rules="ruleInline">
          <i-form-item prop="opinion">
            <i-input
              v-model="todoProcessForm.opinion"
              type="textarea"
              placeholder="请输入审批意见"
              :rows="5"
              :autosize="{minRows: 5,maxRows: 5}"
              :maxlength="255">
            </i-input>
          </i-form-item>
        </i-form>
      </div>
    </div>
    <process-footer
      v-if="data.isApprove"
      @e-ok="handlerSubmit"
      @e-cancel="handlerSubmit"
      left-title="同 意"
      right-title="驳 回">
    </process-footer>
  </div>
</template>

<script>
import { required } from '@/assets/js/rule-validate.js';
import OrderProcessList from '@/assets/js/order-process-column.js';
import ProcessFooter from './ProcessFooter.vue';
export default {
  name: 'ProcessOrderDetails',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    'process-footer': ProcessFooter
  },
  data() {
    return {
      basicInforColumn: [
        {
          title: '申请人',
          key: 'userName',
          ellipsis: true,
          render: (h, { row }) => {
            return h(
              'span',
              {
                attrs: {
                  title: row.userName
                }
              },
              row.userName
            );
          }
        },
        {
          title: '申请部门',
          key: 'groupName',
          ellipsis: true,
          render: (h, { row }) => {
            return h(
              'span',
              {
                attrs: {
                  title: row.groupName
                }
              },
              row.groupName
            );
          }
        },
        {
          title: '邮箱',
          key: 'email',
          ellipsis: true,
          render: (h, { row }) => {
            return h(
              'span',
              {
                attrs: {
                  title: row.email
                }
              },
              row.email
            );
          }
        },
        {
          title: '电话',
          key: 'telephone',
          ellipsis: true,
          render: (h, { row }) => {
            return h(
              'span',
              {
                attrs: {
                  title: row.telephone
                }
              },
              row.telephone
            );
          }
        },
        {
          title: '地址',
          key: 'address',
          ellipsis: true,
          render: (h, { row }) => {
            return h(
              'span',
              {
                attrs: {
                  title: row.address
                }
              },
              row.address
            );
          }
        }
      ],
      globalTableLoading: true,
      bareMetal: [],
      port: [],
      powerVM: [],
      powerVolume: [],
      server: [],
      volume: [],
      serverColumn: [
        {
          title: '名称',
          key: 'action',
          width: 150,
          render(h, { row }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '申请类型',
          key: 'applyType',
          width: 150,
          render(h, { row }) {
            let typeList = {
              ADD: ['新增', '#39f'],
              CHANGE: ['变更', '#0c6'],
              UNSUBSCRIBE: ['退订', '#f60']
            };
            return h(
              'span',
              {
                style: {
                  color: typeList[row.applyType][1]
                }
              },
              typeList[row.applyType][0]
            );
          }
        }
      ],
      volumeColumn: [
        {
          title: '名称',
          key: 'action',
          width: 150,
          render(h, { row }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '申请类型',
          key: 'applyType',
          width: 150,
          render(h, { row }) {
            let typeList = {
              ADD: ['新增', '#39f'],
              CHANGE: ['变更', '#0c6'],
              UNSUBSCRIBE: ['退订', '#f60']
            };
            return h(
              'span',
              {
                style: {
                  color: typeList[row.applyType][1]
                }
              },
              typeList[row.applyType][0]
            );
          }
        }
      ],
      powerVMColumn: [
        {
          title: '名称',
          key: 'action',
          width: 150,
          render(h, { row }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '申请类型',
          key: 'applyType',
          width: 150,
          render(h, { row }) {
            let typeList = {
              ADD: ['新增', '#39f'],
              CHANGE: ['变更', '#0c6'],
              UNSUBSCRIBE: ['退订', '#f60']
            };
            return h(
              'span',
              {
                style: {
                  color: typeList[row.applyType][1]
                }
              },
              typeList[row.applyType][0]
            );
          }
        }
      ],
      powerVolumeColumn: [
        {
          title: '名称',
          key: 'action',
          width: 150,
          render(h, { row }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '申请类型',
          key: 'applyType',
          width: 150,
          render(h, { row }) {
            let typeList = {
              ADD: ['新增', '#39f'],
              CHANGE: ['变更', '#0c6'],
              UNSUBSCRIBE: ['退订', '#f60']
            };
            return h(
              'span',
              {
                style: {
                  color: typeList[row.applyType][1]
                }
              },
              typeList[row.applyType][0]
            );
          }
        }
      ],
      portColumn: [
        {
          title: '名称',
          key: 'action',
          width: 150,
          render(h, { row }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '申请类型',
          key: 'applyType',
          width: 150,
          render(h, { row }) {
            let typeList = {
              ADD: ['新增', '#39f'],
              CHANGE: ['变更', '#0c6'],
              UNSUBSCRIBE: ['退订', '#f60']
            };
            return h(
              'span',
              {
                style: {
                  color: typeList[row.applyType][1]
                }
              },
              typeList[row.applyType][0]
            );
          }
        }
      ],
      bareMetalColumn: [
        {
          title: '名称',
          key: 'action',
          width: 150,
          render(h, { row }) {
            return h('span', row.resourceName);
          }
        },
        {
          title: '申请类型',
          key: 'applyType',
          width: 150,
          render(h, { row }) {
            let typeList = {
              ADD: ['新增', '#39f'],
              CHANGE: ['变更', '#0c6'],
              UNSUBSCRIBE: ['退订', '#f60']
            };
            return h(
              'span',
              {
                style: {
                  color: typeList[row.applyType][1]
                }
              },
              typeList[row.applyType][0]
            );
          }
        }
      ],
      ruleInline: {
        opinion: required({ message: '审批意见不能为空' })
      },
      todoProcessForm: {
        opinion: ''
      }
    };
  },
  methods: {
    /**
     * @function getProcessDetails
     * @description 获取订单详情
     * @returns {void}
     */
    getProcessDetails() {
      this.$loading.show();
      let userId = this.$store.state.login.userId; //获取当前用户id
      this.globalTableLoading = true;
      this.$http({
        url: `order/info/${userId}&${this.$route.params.id}`,
        method: 'GET'
      }).then(({ data }) => {
        this.$loading.hide();
        this.globalTableLoading = false;
        if (data.status) {
          let { resourceContentDTO } = data.data;
          for (const key in resourceContentDTO) {
            if (resourceContentDTO.hasOwnProperty(key)) {
              for (const bond in resourceContentDTO[key]) {
                if (resourceContentDTO[key].hasOwnProperty(bond)) {
                  resourceContentDTO[key][bond].forEach(item => {
                    item.resourceContent = JSON.parse(item.resourceContent);
                    item.applyType = bond.toUpperCase();
                  });
                  this[key] = [...this[key], ...resourceContentDTO[key][bond]];
                }
              }
            }
          }
        } else {
          this.bareMetal = [];
          this.port = [];
          this.powerVM = [];
          this.powerVolume = [];
          this.server = [];
          this.volume = [];
        }
      });
    },
    /**
     * @function handlerSubmit
     * @description 点击同意触发的方法
     * @param {Boolean} isAgree true为同意，false为驳回
     * @returns {void}
     */
    handlerSubmit(isAgree) {
      this.$loading.show();
      this.$refs.todoProcessForm.validate(valid => {
        if (valid) {
          this.$http({
            url: `act-manage/approve-task/${this.data.currentTaskId}`,
            method: 'PUT',
            params: {
              agree: isAgree,
              opinion: this.todoProcessForm.opinion
            }
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                desc: data.message
              });
              this.$router.push({
                name: 'todo-process/index',
                query: { time: new Date().getTime() },
                params: { isRefresh: true }
              });
            }
          });
        }
        this.$loading.hide();
      });
    }
  },
  mounted() {
    let orderList = new OrderProcessList();
    let columnsName = ['serverColumn', 'volumeColumn', 'powerVMColumn', 'powerVolumeColumn'];
    this.$route.query.applyType !== 'CHANGE'
      ? (columnsName = [...columnsName, ...['portColumn', 'bareMetalColumn']])
      : void 0;
    columnsName.forEach(item => {
      this[item] = orderList.filterProcessTableColumn(
        this.$route.query.applyType,
        item,
        this[item]
      );
    });
    this.getProcessDetails();
  }
};
</script>

<style lang="less" scoped>
.process-details {
  width: 100%;
  height: 100%;
  .resource-table-wrap {
    width: 100%;
    height: auto;
    margin-top: 14px;

    .resource-table-title {
      width: 100%;
      height: 40px;
      padding-left: 12px;
      line-height: 40px;
      border: 1px solid #d5d8db;
      border-bottom: none;
      font-size: 14px;
      font-weight: 700;
      background: #fdfdfd;
    }
  }
  /deep/.more-text {
    margin: 5px 0;
  }
  .approval-comments-input {
    width: 100%;
    border: 1px solid #d5d8db;
    padding: 14px 0 0 12px;
    /deep/.ivu-form {
      width: 800px;
      .ivu-form-item {
        margin-bottom: 14px;
      }
    }
  }
}
</style>
