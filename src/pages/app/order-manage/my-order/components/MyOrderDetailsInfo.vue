<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-09-06 13:54:17
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-06 16:11:11
 -->
<template>
  <div class="my-order-details">
    <div
      class="resource-table-wrap"
      style="margin-top: 0">
      <div class="resource-table-title">基本信息</div>
      <i-table
        :columns="basicInforColumn"
        :data="[this.applicant]">
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
  </div>
</template>

<script>
import OrderProcessList from '@/assets/js/order-process-column.js';
export default {
  name: 'MyOrderDetailsInfo',
  props: {
    applicant: {
      type: Object
    }
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
          title: '下发状况',
          key: 'resourceChangeResult',
          width: 150,
          render: (h, { row }) => {
            let resourceChangeResult = this.filterSituation(row.resourceChangeResult);
            return h(
              'span',
              {
                style: {
                  color: resourceChangeResult.color
                }
              },
              resourceChangeResult.text
            );
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
        },
        {
          title: '补发',
          key: 'action',
          align: 'center',
          width: 70,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-fabu',
                attrs: {
                  disabled: row.resourceChangeResult === 2 ? false : true
                },
                on: {
                  click: () => {
                    row.resourceChangeResult === 2 &&
                      this.reissueResource(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
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
          title: '下发状况',
          key: 'resourceChangeResult',
          width: 150,
          render: (h, { row }) => {
            let resourceChangeResult = this.filterSituation(row.resourceChangeResult);
            return h(
              'span',
              {
                style: {
                  color: resourceChangeResult.color
                }
              },
              resourceChangeResult.text
            );
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
        },
        {
          title: '补发',
          key: 'action',
          align: 'center',
          width: 70,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-fabu',
                attrs: {
                  disabled: row.resourceChangeResult === 2 ? false : true
                },
                on: {
                  click: () => {
                    row.resourceChangeResult === 2 &&
                      this.reissueResource(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
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
          title: '下发状况',
          key: 'resourceChangeResult',
          width: 150,
          render: (h, { row }) => {
            let resourceChangeResult = this.filterSituation(row.resourceChangeResult);
            return h(
              'span',
              {
                style: {
                  color: resourceChangeResult.color
                }
              },
              resourceChangeResult.text
            );
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
        },
        {
          title: '补发',
          key: 'action',
          align: 'center',
          width: 70,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-fabu',
                attrs: {
                  disabled: row.resourceChangeResult === 2 ? false : true
                },
                on: {
                  click: () => {
                    row.resourceChangeResult === 2 &&
                      this.reissueResource(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
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
          title: '下发状况',
          key: 'resourceChangeResult',
          width: 150,
          render: (h, { row }) => {
            let resourceChangeResult = this.filterSituation(row.resourceChangeResult);
            return h(
              'span',
              {
                style: {
                  color: resourceChangeResult.color
                }
              },
              resourceChangeResult.text
            );
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
        },
        {
          title: '补发',
          key: 'action',
          align: 'center',
          width: 70,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-fabu',
                attrs: {
                  disabled: row.resourceChangeResult === 2 ? false : true
                },
                on: {
                  click: () => {
                    row.resourceChangeResult === 2 &&
                      this.reissueResource(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
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
          title: '下发状况',
          key: 'resourceChangeResult',
          width: 150,
          render: (h, { row }) => {
            let resourceChangeResult = this.filterSituation(row.resourceChangeResult);
            return h(
              'span',
              {
                style: {
                  color: resourceChangeResult.color
                }
              },
              resourceChangeResult.text
            );
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
        },
        {
          title: '补发',
          key: 'action',
          align: 'center',
          width: 70,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-fabu',
                attrs: {
                  disabled: row.resourceChangeResult === 2 ? false : true
                },
                on: {
                  click: () => {
                    row.resourceChangeResult === 2 &&
                      this.reissueResource(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
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
          title: '下发状况',
          key: 'resourceChangeResult',
          width: 150,
          render: (h, { row }) => {
            let resourceChangeResult = this.filterSituation(row.resourceChangeResult);
            return h(
              'span',
              {
                style: {
                  color: resourceChangeResult.color
                }
              },
              resourceChangeResult.text
            );
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
        },
        {
          title: '补发',
          key: 'action',
          align: 'center',
          width: 70,
          render: (h, { row }) => {
            return h('div', [
              h('i', {
                class: 'iconfont icon-fabu',
                attrs: {
                  disabled: row.resourceChangeResult === 2 ? false : true
                },
                on: {
                  click: () => {
                    row.resourceChangeResult === 2 &&
                      this.reissueResource(row.applyListId, row.resourceName);
                  }
                }
              })
            ]);
          }
        }
      ],
      globalTableLoading: true
    };
  },
  methods: {
    /**
     * @function filterSituation
     * @description 过滤下发状态的对应值
     * @param {Number} result
     * @returns {String}
     */
    filterSituation(result) {
      switch (result) {
        case 0:
          return {
            text: '下发中',
            color: '#329afd'
          };
        case 1:
          return {
            text: '成功',
            color: '#0dd773'
          };
        case 2:
          return {
            text: '失败',
            color: '#ff7703'
          };
        default:
          return {
            text: '未下发',
            color: '#919294'
          };
      }
    },
    /**
     * @function getOrderDetailsHttp
     * @description  获取资源详情的请求
     * @returns {void}
     */
    getOrderDetailsHttp() {
      this.$loading.show();
      this.globalTableLoading = true;
      let userId = this.$store.state.login.userId; //获取当前用户id
      let orderId = this.$route.params.id;
      this.$http({
        url: `order/detail/${userId}&${orderId}`,
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
     * @function isResourceShow
     * @description 判断某个资源的类型是否有值
     * @param {String} name
     * @param {String} type
     * @returns {Boolean}
     */
    isResourceShow(name, key) {
      return this[name][key].length;
    },
    /**
     * @function isAllResourceShow
     * @description 判断某个资源是否为空
     * @param {String} name
     * @returns {Boolean}
     */
    isAllResourceShow(name) {
      return (
        this.isResourceShow(name, 'add') ||
        this.isResourceShow(name, 'change') ||
        this.isResourceShow(name, 'unsubscribe')
      );
    },
    /**
     * @function reissueResource
     * @description 补发资源触发的方法
     * @param {String} id
     * @param {String} name
     * @returns {void}
     */
    reissueResource(id, name) {
      this.$loading.show();
      this.$http({
        url: `order/resourceReissue/${id}&${name}`,
        method: 'POST'
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
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
      this[item] = orderList.filterOrderTableColumn(this.$route.query.applyType, item, this[item]);
    });
    this.getOrderDetailsHttp();
  }
};
</script>

<style scoped lang="less">
.my-order-details {
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
}
</style>
