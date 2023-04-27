<!--
 * @Description 退订清单页面
 * @Author ys1983/张睿博
 * @Date 2019-08-06 11:56:13
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-06 14:43:11
 -->
<template>
  <div class="cds-border cds-padding-14 unsubscribe-list cds-scroll-wrap">
    <div class="cds-scroll-content">
      <h3c-title title="退订清单">
        <template #other>
          <a
            class="cds-float-right back-to-mall"
            @click="backCloudResourcePage"> 返回云资源 </a>
        </template>
      </h3c-title>
      <div
        v-if="isContentShow"
        class="resource-content">
        <div
          v-if="isResourceShow('server')"
          class="resource-table-wrap">
          <div class="resource-table-title">X86虚拟机</div>
          <i-table
            ref="serverTable"
            :loading="globalTableLoading"
            :columns="serverColumn"
            :data="server"
            @on-select="selectSingleResource"
            @on-select-all="selectAllResource"
            @on-select-cancel="selectCancelSingleResource"
            @on-select-all-cancel="selectCancelAllResource(server)">
          </i-table>
        </div>
        <div
          v-if="isResourceShow('volume')"
          class="resource-table-wrap">
          <div class="resource-table-title">X86硬盘</div>
          <i-table
            ref="volumeTable"
            :loading="globalTableLoading"
            :columns="volumeColumn"
            :data="volume"
            @on-select="selectSingleResource"
            @on-select-all="selectAllResource"
            @on-select-cancel="selectCancelSingleResource"
            @on-select-all-cancel="selectCancelAllResource(volume)">
          </i-table>
        </div>
        <div
          v-if="isResourceShow('powerVM')"
          class="resource-table-wrap">
          <div class="resource-table-title">Power虚拟机</div>
          <i-table
            ref="powerVMTable"
            :loading="globalTableLoading"
            :columns="powerVMColumn"
            :data="powerVM"
            @on-select="selectSingleResource"
            @on-select-all="selectAllResource"
            @on-select-cancel="selectCancelSingleResource"
            @on-select-all-cancel="selectCancelAllResource(powerVM)">
          </i-table>
        </div>
        <div
          v-if="isResourceShow('powerVolume')"
          class="resource-table-wrap">
          <div class="resource-table-title">Power硬盘</div>
          <i-table
            ref="powerVolumeTable"
            :loading="globalTableLoading"
            :columns="powerVolumeColumn"
            :data="powerVolume"
            @on-select="selectSingleResource"
            @on-select-all="selectAllResource"
            @on-select-cancel="selectCancelSingleResource"
            @on-select-all-cancel="selectCancelAllResource(powerVolume)">
          </i-table>
        </div>
        <div
          v-if="isResourceShow('port')"
          class="resource-table-wrap">
          <div class="resource-table-title">虚拟网卡</div>
          <i-table
            ref="portTable"
            :loading="globalTableLoading"
            :columns="portColumn"
            :data="port"
            @on-select="selectSingleResource"
            @on-select-all="selectAllResource"
            @on-select-cancel="selectCancelSingleResource"
            @on-select-all-cancel="selectCancelAllResource(port)">
          </i-table>
        </div>
        <div
          v-if="isResourceShow('bareMetal')"
          class="resource-table-wrap">
          <div class="resource-table-title">裸金属</div>
          <i-table
            ref="bareMetalTable"
            :loading="globalTableLoading"
            :columns="bareMetalColumn"
            :data="bareMetal"
            @on-select="selectSingleResource"
            @on-select-all="selectAllResource"
            @on-select-cancel="selectCancelSingleResource"
            @on-select-all-cancel="selectCancelAllResource(bareMetal)">
          </i-table>
        </div>
      </div>
      <mall-emty v-else></mall-emty>
      <h3c-modal-confirm
        title="删除确认"
        v-model="deleteShow"
        :show-background-color="isTemplateCreate ? true : false"
        :warning="isTemplateCreate ? templateCreateMessage : void(0)"
        @on-ok="deleteApplyListResource"
        :info="deleteMessage">
      </h3c-modal-confirm>
      <mall-footer
        v-if="isContentShow"
        :handler-submit="handlerSubmit"
        :disabled="selectAllList.length <= 0"
        submit-title="提交订单">
        <template #right>
          <i-checkbox
            v-model="selectAll"
            @on-change="changeResourceSelectAll">
            全选
          </i-checkbox>
        </template>
        <template #cancel><span v-pre></span></template>
      </mall-footer>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue'; // 引入确认框组件
import MallFooter from '../components/MallFooter.vue'; // 引入商城提交的页脚
import MallEmty from '../components/MallEmty.vue';
import OrderListMixin from '../order-list-mixins.js';
import OrderProcessList from '@/assets/js/order-process-column.js';
export default {
  name: 'UnsubscribeList',
  mixins: [OrderListMixin],
  components: {
    'h3c-title': H3cTitle,
    'h3c-modal-confirm': H3cModalConfirm,
    'mall-footer': MallFooter,
    'mall-emty': MallEmty
  },
  data() {
    return {
      bareMetal: [], // 裸金属退订资源列表
      port: [], // 虚拟网卡退订资源列表
      powerVM: [], // power虚拟机退订资源列表
      powerVolume: [], // power硬盘退订资源列表
      server: [], // X86虚拟机退订资源列表
      volume: [], // X86硬盘退订资源列表
      resourceInfo: {
        // 被删除资源的信息
        id: '',
        name: ''
      },
      deleteMessage: '', // 退订删除的删除提示信息
      deleteShow: false, // 删除资源的弹框
      isTemplateCreate: false,
      templateCreateMessage: '注：此资源为模板批量创建、删除资源的同时其它被创建的资源也会被删除',
      serverColumn: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '删除',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-shanchu',
                on: {
                  click: () => {
                    this.deleteConfirmInfo(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
          }
        }
      ],
      volumeColumn: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '删除',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-shanchu',
                on: {
                  click: () => {
                    this.deleteConfirmInfo(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
          }
        }
      ],
      powerVMColumn: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '删除',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-shanchu',
                on: {
                  click: () => {
                    let { applyListId, resourceName, createFromMode } = row;
                    this.deleteConfirmInfo(applyListId, resourceName, createFromMode);
                  }
                }
              })
            ]);
          }
        }
      ],
      powerVolumeColumn: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '删除',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-shanchu',
                on: {
                  click: () => {
                    this.deleteConfirmInfo(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
          }
        }
      ],
      portColumn: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '删除',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-shanchu',
                on: {
                  click: () => {
                    this.deleteConfirmInfo(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
          }
        }
      ],
      bareMetalColumn: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '删除',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-shanchu',
                on: {
                  click: () => {
                    this.deleteConfirmInfo(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
          }
        }
      ]
    };
  },
  methods: {
    /**
     * @function getApplyListHttp
     * @description 获取申请清单资源展示列表
     * @returns {void}
     */
    getApplyListHttp() {
      this.$loading.show();
      this.globalTableLoading = true;
      let userId = this.$store.state.login.userId; //获取当前用户id
      this.$http({
        url: `unsubList/getUnsubList/${userId}`,
        method: 'GET'
      }).then(({ data }) => {
        this.$loading.hide();
        this.globalTableLoading = false;
        let allList = [];
        if (data.status) {
          for (const key in data.data) {
            if (data.data.hasOwnProperty(key)) {
              this[key] = data.data[key].unsubscribe;
              this[key].forEach(item => {
                item.resourceContent = JSON.parse(item.resourceContent);
                allList.push(item.applyListId);
                if (!this.selectAllListBackup.includes(item.applyListId)) {
                  item._checked = true;
                  this.selectAllList.push(item.applyListId);
                  this.selectAllListBackup.push(item.applyListId);
                } else {
                  if (this.selectAllList.includes(item.applyListId)) {
                    item._checked = true;
                  } else {
                    item._checked = false;
                  }
                }
              });
            }
          }
          if (this.selectAllListBackup.length !== allList.length) {
            this.selectAllListBackup = allList;
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
     * @function deleteConfirmInfo
     * @description 删除信息确认框
     * @param {String} id
     * @param {String} name
     * @param {Boolean} is
     * @returns {void}
     */
    deleteConfirmInfo(id, name, is = false) {
      this.deleteShow = true;
      this.resourceInfo.id = id;
      this.resourceInfo.name = name;
      this.isTemplateCreate = is;
      this.deleteMessage = `确认删除资源：${name}吗？`;
    },
    /**
     * @function deleteApplyListResource
     * @description 根据id删除申请清单资源
     * @returns {void}
     */
    deleteApplyListResource() {
      this.$loading.show();
      this.$http({
        url: `unsubList/delete/${this.resourceInfo.id}`,
        method: 'DELETE'
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.changeResourceSelect(false, this.resourceInfo.id);
          let index = this.selectAllListBackup.findIndex(item => item === this.resourceInfo.id);
          index > -1 && this.selectAllListBackup.splice(index, 1);
          this.getApplyListHttp();
          this.$Notice.success({
            desc: data.message
          });
        } else if (data.code === 700) {
          this.$Notice.error({
            desc: data.message
          });
        }
      });
    },
    /**
     * @function handlerSubmit
     * @descritpion 提交订单触发的方法
     * @returns {void}
     */
    handlerSubmit() {
      this.$loading.show();
      let userId = this.$store.state.login.userId; //获取当前用户id
      this.$http({
        url: 'unsubList/submit',
        method: 'POST',
        data: {
          userId,
          applyListIdList: this.selectAllList
        }
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.selectAllList.forEach(item => {
            let index = this.selectAllListBackup.findIndex(id => id === item);
            index > -1 && this.selectAllListBackup.splice(index, 1);
          });
          this.selectAllList = [];
          this.getApplyListHttp();
        } else if (data.code === 700) {
          this.$Notice.warning({
            desc: data.message
          });
        }
      });
    }
  },
  mounted() {
    let orderList = new OrderProcessList();
    [
      'serverColumn',
      'volumeColumn',
      'powerVMColumn',
      'powerVolumeColumn',
      'portColumn',
      'bareMetalColumn'
    ].forEach(item => {
      this[item] = orderList.filterTableColumn('UNSUBSCRIBE', item, this[item]);
    });
    this.getApplyListHttp();
  }
};
</script>

<style lang="less" scoped>
@import '../less/index.less';
.unsubscribe-list {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
}
</style>
