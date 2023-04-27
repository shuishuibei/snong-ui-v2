<!--
 * @Description 服务目录申请清单页面
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:41
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-06 14:06:53
 -->
<template>
  <div class="application-list cds-border cds-padding-14 cds-scroll-wrap">
    <div class="application-list-wrap cds-scroll-content">
      <h3c-title title="申请清单">
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
      <mall-emty
        v-else
        :is-title="true"
        @e-click="$router.push({name: 'resource-directory/index'})">
      </mall-emty>
      <h3c-modal-confirm
        title="删除确认"
        v-model="deleteShow"
        :show-background-color="isTemplateCreate ? true : false"
        :warning="isTemplateCreate ? templateCreateMessage : void(0)"
        @on-ok="deleteApplyListResource"
        :info="deleteMessage">
      </h3c-modal-confirm>
      <mall-resource-preflight
        v-model="resourcePreflightShow"
        :apply-list-id="selectAllList"
        @e-result="resourcePreflightResult"
        url="applyList/resourceCheck">
      </mall-resource-preflight>
      <h3c-modal-confirm
        title="资源预检"
        @on-ok="resourceOk"
        v-model="resourcePreflightConfirmShow">
        <template #content>
          <div class="modal-content">
            <div class="modal-info modal-circle">
              <p class="info-icon">
                <i class="iconfont icon-wenhaofill" :class="{iconfont:true,'icon-71shibai':!previewStatus,'icon-chenggong':previewStatus}" :style="{color:previewStatus?'#00CC65':'#FC180F'}"></i>
              </p>
              <div class="info-text">资源预检{{previewStatus?'成功':'失败'}}，是否确认提交订单？</div>
              <div class="psInfo" style="color:#FF6600">注<b>：</b>提交订单后，会进入流程审批</div>
            </div>
          </div>
        </template>
      </h3c-modal-confirm>
      <mall-footer
        v-if="isContentShow"
        :handler-submit="handlerSubmit"
        :disabled="selectAllList.length === 0"
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
import MallResourcePreflight from '../components/MallResourcePreflight.vue'; // 引入资源预检组件s';
import MallEmty from '../components/MallEmty.vue';
import OrderListMixin from '../order-list-mixins.js';
import OrderProcessList from '@/assets/js/order-process-column.js';
export default {
  name: 'ApplicationList',
  mixins: [OrderListMixin],
  components: {
    'h3c-title': H3cTitle,
    'h3c-modal-confirm': H3cModalConfirm,
    'mall-footer': MallFooter,
    'mall-resource-preflight': MallResourcePreflight,
    'mall-emty': MallEmty
  },
  data() {
    return {
      eventMethod: '', // 滚动条触发的监听事件
      bareMetal: [], // 裸金属列表
      port: [], // 虚拟网卡
      powerVM: [], // power虚拟机
      powerVolume: [], // power硬盘
      server: [], // x86虚拟机
      volume: [], // 云硬盘
      globalTableLoading: false,
      resourceInfo: {
        id: '',
        name: ''
      },
      deleteShow: false,
      selectAll: true,
      selectAllList: [],
      selectAllListBackup: [],
      resourcePreflightConfirmShow: false,
      previewStatus: false, // 资源预检是否成功
      deleteMessage: '',
      isTemplateCreate: false,
      templateCreateMessage: '注：此资源为模板批量创建、删除资源的同时其它被创建的资源也会被删除',
      serverColumn: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '申请数量',
          key: 'action',
          render: (h, { row }) => {
            return h('InputNumber', {
              props: {
                value: row.resourceNumber,
                min: 1,
                max: 10,
                editable: false,
                disabled: this.disabledHost(row.resourceContent.network)
              },
              on: {
                'on-change': count => {
                  this.changeApplyCount(row.applyListId, count, 'server');
                }
              }
            });
          }
        },
        {
          title: '修改',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-weibiaoti2010104',
                on: {
                  click: () => {
                    this.editResource(row.applyListId, 'resource-directory/x86');
                  }
                }
              })
            ]);
          }
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
          title: '申请数量',
          key: 'action',
          render: (h, { row }) => {
            return h('InputNumber', {
              props: {
                value: row.resourceNumber,
                min: 1,
                max: 3,
                editable: false
              },
              on: {
                'on-change': count => {
                  this.changeApplyCount(row.applyListId, count, 'volume');
                }
              }
            });
          }
        },
        {
          title: '修改',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-weibiaoti2010104',
                on: {
                  click: () => {
                    this.editResource(row.applyListId, 'resource-directory/disk');
                  }
                }
              })
            ]);
          }
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
          title: '申请数量',
          key: 'action',
          width: 100,
          render(h, { row }) {
            return h('span', row.resourceNumber);
          }
        },
        {
          title: '修改',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-weibiaoti2010104',
                attrs: {
                  disabled: row.createFromMode
                },
                on: {
                  click: () => {
                    !row.createFromMode &&
                      this.editResource(row.applyListId, 'resource-directory/power-small-machine');
                  }
                }
              })
            ]);
          }
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
          title: '申请数量',
          key: 'action',
          render: (h, { row }) => {
            return h('InputNumber', {
              props: {
                value: row.resourceNumber,
                min: 1,
                max: 3,
                editable: false
              },
              on: {
                'on-change': count => {
                  this.changeApplyCount(row.applyListId, count, 'powerVolume');
                }
              }
            });
          }
        },
        {
          title: '修改',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-weibiaoti2010104',
                on: {
                  click: () => {
                    this.editResource(row.applyListId, 'resource-directory/power-disk');
                  }
                }
              })
            ]);
          }
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
          title: '申请数量',
          key: 'action',
          render(h, { row }) {
            return h('span', row.resourceNumber);
          }
        },
        {
          title: '修改',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-weibiaoti2010104',
                on: {
                  click: () => {
                    this.editResource(row.applyListId, 'resource-directory/virtual-network-card');
                  }
                }
              })
            ]);
          }
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
          title: '申请数量',
          key: 'action',
          width: 100,
          render(h, { row }) {
            return h('span', row.resourceNumber);
          }
        },
        {
          title: '修改',
          key: 'action',
          align: 'center',
          width: 60,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-weibiaoti2010104',
                on: {
                  click: () => {
                    this.editResource(row.applyListId, 'resource-directory/bare-metal');
                  }
                }
              })
            ]);
          }
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
     * @function backCloudResourcePage
     * @description 返回云资源页面的方法
     * @returns {void}
     */
    backCloudResourcePage() {
      this.$router.push({
        name: 'resource-directory/index',
        query: { time: new Date().getTime() }
      });
    },
    /**
     * @function getApplyListHttp
     * @description 获取申请清单资源展示列表
     * @returns {void}
     */
    getApplyListHttp() {
      this.$loading.show();
      let userId = this.$store.state.login.userId; //获取当前用户id
      this.$http({
        url: `applyList/getApplyList/${userId}`,
        method: 'GET'
      }).then(({ data }) => {
        this.$loading.hide();
        let allList = [];
        if (data.status) {
          for (const key in data.data) {
            if (data.data.hasOwnProperty(key)) {
              this[key] = data.data[key].add;
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
     * @function changeApplyCount
     * @description 申请数量发生改变时触发的方法
     * @param {String} id
     * @param {Number} count
     * @param {String} server
     * @returns {void}
     */
    changeApplyCount(id, count, server) {
      this.$nextTick(() => {
        if (!Number.isInteger(count)) {
          let index = this[server].findIndex(item => item.applyListId === id);
          this[server][index].resourceNumber = Number(count.toFixed(0));
        }
        this.$loading.show();
        this.$http({
          url: `applyList/editResourceNumber/${id}&${count.toFixed(0)}`,
          method: 'GET'
        }).then(({ data }) => {
          this.$loading.hide();
          if (data.status) {
            this.getApplyListHttp();
          } else if (data.code === 700) {
            this.$Notice.warning({
              desc: data.message
            });
          }
        });
      });
    },
    /**
     * @function deleteApplyListResource
     * @description 根据id删除申请清单资源
     * @returns {void}
     */
    deleteApplyListResource() {
      this.$loading.show();
      this.$http({
        url: `applyList/delete/${this.resourceInfo.id}`,
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
          this.$Notice.warning({
            desc: data.message
          });
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
     * @function isResourceShow
     * @description 资源是否显示
     * @param {String} key
     * @returns {Boolean}
     */
    isResourceShow(key) {
      return this[key].length > 0 ? true : false;
    },
    /**
     * @function resourceOk
     * @description 资源预检完成时点击确认触发的方法
     * @returns {void}
     */
    resourceOk() {
      this.$loading.show();
      let userId = this.$store.state.login.userId; //获取当前用户id
      this.$http({
        url: 'applyList/submit',
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
    },
    /**
     * @function editResource
     * @description 编辑资源时触发的方法，会跳转对应的申请页面
     * @param {String} id
     * @param {String} name
     * @returns {void}
     */
    editResource(id, name) {
      this.$router.push({
        name,
        query: { id: id }
      });
    },
    /**
     * @function disabledHost
     * @description 主机网络如果指定了ip则不能修改数量
     * @param {Array} network
     * @returns {void}
     */
    disabledHost(network) {
      return network.some(item => item.ip !== '');
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
      this[item] = orderList.filterTableColumn('ADD', item, this[item]);
    });
    this.getApplyListHttp();
  }
};
</script>

<style lang="less" scoped>
@import '../less/index.less';
.application-list {
  .resource-content {
    width: 100%;
  }
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
}
</style>
