<!--
 * @Description: power虚拟机添加网卡弹窗
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:19:14
 -->
<template>
  <div>
    <i-modal
      class="add-modal"
      :value="true"
      :scrollable="true"
      :mask-closable="false"
      :width="1000"
      @on-enter="handleSearch"
      @on-visible-change="closeModal">
      <template #header>
        <h3c-title
          :title="title"
          :is-modal="true"
          :style-set="{'border-bottom': 'none'}">
        </h3c-title>
      </template>
      <div class="info-content cds-margin-bottom-14" v-if="tipsFlag">
        <i class="iconfont icon-tixingtishi"></i>
        <div class="content-con">{{tips}}</div>
      </div>
      <!--搜索框-->
      <!-- 头部搜索和按钮操作 -->
      <div class="cds-clearfix cds-margin-bottom-14">
        <div class="cds-float-left-btn">
          <i-input
            clearable
            class="cds-input-search"
            style="width: 200px;"
            v-model="inputValue"
            placeholder="请输入名称进行查询"></i-input>
          <i-button type="primary" class="cds-btn-search" @click="handleSearch">
            <i class="iconfont icon-iconfontsousuo"></i>
          </i-button>
        </div>
      </div>
      <div id="modal-network">
        <i-table
          stripe
          highlight-row
          class="add-network-table"
          size="small"
          height="233"
          ref="selection"
          :loading="tableConfig.loading"
          :columns="tableList"
          :data="tableData">
        </i-table>
        <i-row class="cds-margin-top-14 cds-clearfix">
          <div class="cds-float-left">
            共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页
          </div>
          <div class="cds-float-right">
            <i-page
              show-sizer
              size="small"
              :page-size-opts="[5, 10, 20]"
              @on-change="submitAddNetwork({currentPage: $event, pageSize: page.pageSize})"
              @on-page-size-change="submitAddNetwork({pageSize: $event})"
              placement="top"
              :total="page.totalCount"
              :current="page.currentPage"
              :page-size="page.pageSize">
            </i-page>
          </div>
        </i-row>
      </div>
      <div slot="footer"></div>
    </i-modal>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件

export default {
  name: 'AddNetwork',
  components: {
    'h3c-title': H3cTitle
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    tipsFlag: {
      type: Boolean,
      default: false
    },
    hostId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableConfig: {
        loading: false // 表格是否加载中
      },
      loading: false,
      netObj: [],
      netIp: '',
      netInfo: [],
      netInfoBouble: [],
      netInfoItem: {
        ip: '',
        networkId: '',
        networkName: '',
        redundant: true,
        subnetId: '',
        type: '',
        vNicCap: ''
      },
      singleNetId: '', // 单个挂载时的硬盘id
      isSingleMount: false,
      serverIds: [], // 获取选中的硬盘id数组
      dataList: [],
      tableItem: [],
      /* 挂载表格标题数组 */
      tableList: [
        {
          title: '网络名称',
          key: 'name',
          minWidth: 80,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.name
                }
              },
              params.row.name
            );
          }
        },
        {
          title: '地址池',
          minWidth: 80,
          key: 'allocation_pools',
          render: (h, params) => {
            let str = '';
            let allocation_poolsStart = '';
            let allocation_poolsEnd = '';
            params.row.allocation_pools.forEach((item, index) => {
              allocation_poolsStart = item.start;
              allocation_poolsEnd = item.end;
              let strItem = allocation_poolsStart + '-' + allocation_poolsEnd;
              str = str + ',' + strItem;
            });
            str = str.substr(1);

            return h(
              'span',
              {
                attrs: {
                  title: str
                }
              },
              str
            );
          }
        },
        {
          title: 'IP地址类型',
          key: 'adapterType',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  title: params.row.adapterType
                }
              },
              params.row.adapterType
            );
          }
        },
        {
          title: 'IP',
          key: 'ip',
          width: 130,
          ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: String(params.row.ip)
                },
                on: {
                  'on-blur': e => {
                    params.row.ip = e.srcElement.value;
                    this.tableData[params.index] = params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '是否冗余适配器',
          key: 'action',
          width: 120,
          ellipsis: true,
          render: (h, params) => {
            if (params.row.adapterType !== 'SEA') {
              return h(
                'RadioGroup',
                {
                  props: {
                    value: String(params.row.redundant)
                  },
                  on: {
                    'on-change': bool => {
                      params.row.redundant = JSON.parse(bool);
                      this.tableData[params.index] = params.row;
                    }
                  }
                },
                [
                  h(
                    'Radio',
                    {
                      props: {
                        label: 'true'
                      }
                    },
                    '是'
                  ),
                  h(
                    'Radio',
                    {
                      props: {
                        label: 'false'
                      }
                    },
                    '否'
                  )
                ]
              );
            } else {
              return h('span', '不支持');
            }
          }
        },
        {
          title: '虚拟NIC容量(%)',
          key: 'action',
          width: 150,
          render: (h, params) => {
            if (params.row.adapterType !== 'SEA') {
              return h('InputNumber', {
                props: {
                  value: Number(params.row.vnicCap),
                  min: 2,
                  max: 100
                },
                style: {
                  width: '65px'
                },
                on: {
                  'on-change': value => {
                    params.row.vnicCap = value;
                    this.tableData[params.index] = params.row;
                  }
                }
              });
            } else {
              return h('span', '不支持');
            }
          }
        },
        {
          title: '挂载',
          key: 'id',
          width: 60,
          render: (h, params) => {
            return h('span', {
              class: 'iconfont icon-guazai cell-info-active',
              on: {
                click: e => {
                  this.matchData(params.row.id);
                }
              }
            });
          }
        }
      ],
      /* 挂载表格数据数组 */
      tableData: [],
      /* 分页 */
      page: {
        pageSize: 5, // 每页条数
        totalCount: 0, // 总数
        totalPage: 1, // 总页数
        currentPage: 1 // 当前页码
      },
      selectText: '',
      inputValue: '',
      searchValue: '' // 真实用于查询的数据
    };
  },
  methods: {
    /**
     * @description: 获取数据后，将页码设置为返回来的数据
     * @param {Array} data:列表数据
     */
    setPage(data) {
      this.page.totalCount = data.total;
      this.page.totalPage = data.pages ? data.pages : 1;
      this.page.currentPage = data.current;
      this.page.pageSize = data.size;
    },
    closeModal(Bool) {
      !Bool ? this.$emit('show', false) : this.$emit('show', true);
    },
    setEmpty() {
      this.inputValue = '';
      this.searchValue = '';
      this.$refs.selection.selectAll(false);
    },
    submitAddNetwork({ loading = false, currentPage = 1, pageSize = 5 } = {}) {
      if (loading) {
        this.tableConfig.loading = loading;
        this.tableData = [];
      }
      this.page.pageSize = pageSize;
      this.page.currentPage = currentPage;
      this.netInfo = [];

      this.$http
        .post('power/server/list/network/server/' + this.hostId + '/page', {
          searchMap: {
            name: this.searchValue
          },
          current: currentPage, // 当前页
          pageSize: pageSize // 每页条数
        })
        .then(({ data }) => {
          if (data.status) {
            let resp = data.data;
            this.tableData = resp.records;
            this.page.totalCount = resp.total;
            this.page.totalPage = resp.pages ? resp.pages : 1;
          }
          loading ? (this.tableConfig.loading = false) : ''; // 如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
        });
    },
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      this.submitAddNetwork({
        loading: true,
        pageSize: this.page.pageSize
      });
    },
    /**
     * @description: 封装要发送请求的数据
     * @param {string} _id: 要挂载的id
     */
    matchData(_id) {
      this.netInfoBouble = [];
      this.tableData.forEach((item, index) => {
        if (item.id == _id) {
          this.netInfoBouble.push({
            ip: item.ip,
            networkId: item.id,
            networkName: item.name,
            redundant: item.redundant,
            subnetId: item.subnet_id,
            type: item.adapterType,
            vNicCap: item.vNicCap
          });
        }
      });
      this.handleMount();
    },
    handleMount() {
      this.$loading.show();
      this.$http
        .post('power/server/port', {
          port: this.netInfoBouble,
          serverId: this.hostId // server用来存储已选中的硬盘id
        })
        .then(({ data }) => {
          if (data.status) {
            this.$Notice.success({
              desc: '网卡添加成功！'
            });
            this.$emit('show', false);
          }
          this.netInfoBouble = [];
          this.$loading.hide();
        });
    }
  },
  mounted() {
    this.setEmpty();
    this.submitAddNetwork();
  }
};
</script>

<style lang="less" scoped>
/deep/ .add-network-table {
  .ivu-table-cell-ellipsis {
    .ivu-radio-group {
      span {
        display: inline-flex !important;
      }
    }
  }

  .ivu-table-row td:last-child .ivu-table-cell {
    overflow: visible;
  }
}
</style>

<style lang="less" scoped>
.info-content {
  color: #ff6600;
  padding: 10px 10px;
  background-color: #feefe6;
  position: relative;

  .icon-tixingtishi {
    position: absolute;
    top: 45%;
    transform: translate(0, -50%);
    color: #ff6600;
    font-size: 18px;
  }

  .content-con {
    padding-left: 25px;
  }
}

.iconfont:not(.header-icon):before {
  font-size: 16px;
}

i.icon-tixingtishi:before {
  font-size: 18px !important;
}
</style>
