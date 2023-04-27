<!--
 * @Description Power虚拟机基本申请创建网络页面
 * @Author ys1983/张睿博
 * @Date 2019-08-26 15:10:09
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-22 11:45:29
 -->
<template>
  <i-modal
    v-model="show"
    width="60"
    @on-visible-change="changeVisible"
    :mask-closable="false">
    <template #header>
      <h3c-title
        title="可选网络列表"
        :is-modal="true"
        :style-set="{'border-bottom': 'none'}">
      </h3c-title>
    </template>
    <div>
      <div class="cds-margin-bottom-14">
        <i-input
          placeholder="请输入名称查询网络"
          style="width:200px;"
          @on-keyup.enter="searchBtn"
          v-model="searchNetwork">
        </i-input>
        <i-button
          type="primary"
          class="cds-btn-search"
          @click="searchBtn">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
      <h3c-table-radio
        :columns="networkConfig.column"
        :data="networkConfig.data"
        :select="{className: 'network', name: 'network'}"
        :page="networkPage"
        :get-table-data="switchNetworkPage"
        :config="networkConfig.loading"
        :radio="false">
      </h3c-table-radio>
    </div>
    <template #footer>
      <div>
        <i-button
          type="primary"
          @click="handleSubmit">
          确认
        </i-button>
        <i-button @click="changeVisible(false)">取消</i-button>
      </div>
    </template>
  </i-modal>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cTableRadio from '@/components/h3c-radio-table/H3cRadioTable.vue'; //引入单选表格
export default {
  name: 'SinglePowerCreateNetwork',
  components: {
    'h3c-title': H3cTitle,
    'h3c-table-radio': H3cTableRadio
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    hostName: {
      type: String,
      required: true
    },
    networks: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      show: false,
      searchNetwork: '',
      networkConfig: {
        column: [
          {
            title: '选择',
            key: 'action',
            width: 70,
            align: 'center',
            render: (h, params) => {
              return h('Checkbox', {
                props: {
                  value: this.isSelectNetwork(params.row.id),
                  disabled: this.disabled && !this.isSelectNetwork(params.row.id)
                },
                on: {
                  'on-change': e => {
                    this.network = [...this.network];
                    if (e) {
                      this.network.push({
                        adapterType: params.row.adapterType,
                        cidr: params.row.cidr,
                        id: params.row.id,
                        ip: '',
                        name: params.row.name,
                        redundant: true,
                        subnet_id: params.row.subnet_id,
                        vNicCap: params.row.adapterType !== 'SEA' ? 2 : 0,
                        addressPool: `${params.row.allocation_pools[0].start}-${params.row.allocation_pools[0].end}`,
                        allocation: '自动分配'
                      });
                    } else {
                      let index = this.network.findIndex(value => value.id === params.row.id);
                      this.network.splice(index, 1);
                    }
                  }
                }
              });
            }
          },
          {
            title: '网络名称',
            key: 'name'
          },
          {
            title: '类型',
            key: 'type'
          },
          {
            title: 'IP地址类型',
            key: 'action',
            render: (h, params) => {
              return h('span', params.row.dhcp ? 'DHCP' : '静态');
            }
          },
          {
            title: 'cidr',
            key: 'cidr'
          },
          {
            title: '地址池',
            width: 200,
            key: 'action',
            render: (h, params) => {
              return h(
                'span',
                `${params.row.allocation_pools[0].start}-${params.row.allocation_pools[0].end}`
              );
            }
          },
          {
            title: '网关',
            key: 'gateway'
          },
          {
            title: '适配器类型',
            key: 'adapterType'
          }
        ],
        data: [],
        loading: true
      },
      networkPage: {
        //网络分页数据
        totalCount: 0, //总条数
        currentPage: 1, //当前页码
        pageSize: 5, //每页条数
        totalPage: 1 //总页数
      },
      network: []
    };
  },
  methods: {
    /**
     * @function changeVisible
     * @description 当弹出框状态发生改变时触发的方法
     * @param {Boolean} visible
     * @returns {void}
     */
    changeVisible(visible) {
      this.$emit('e-show', visible);
    },
    /**
     * @function handleSubmit
     * @description 点击确认提交表单时触发的方法
     * @returns {void}
     */
    handleSubmit() {
      this.$emit('e-data', this.network);
      this.changeVisible(false);
    },
    /**
     * @function searchBtn
     * @description 点击搜索按钮触发的方法
     * @returns {void}
     */
    searchBtn() {
      this.network = [];
      let resetPage = {
        currentPage: 1,
        pageSize: 5
      };
      this.networkPage = { ...this.networkPage, ...resetPage };
      this.getNetworkHttp();
    },
    /**
     * @function switchNetworkPage
     * @description 网络切换分页触发的方法
     * @param {Object} option
     * @param {Boolean} option.loading
     * @param {Number} option.currentPage
     * @param {Number} option.pageSize
     * @returns {void}
     */
    switchNetworkPage({ loading = false, currentPage = 1, pageSize = 10 }) {
      if (loading) {
        //设置表格缓冲
        this.networkConfig.loading = loading;
        //将表格数据data设置为空数组
        this.networkConfig.data = [];
      }
      //设置分页每页条数
      this.networkPage.pageSize = pageSize;
      //设置分页当前页
      this.networkPage.currentPage = currentPage;
      //重新请求
      this.getNetworkHttp();
    },
    /**
     * @function isSelectNetwork
     * @description 是否选择此条网络
     * @param {String} id
     * @returns {void}
     */
    isSelectNetwork(id) {
      let index = this.network.findIndex(item => item.id === id);
      return index > -1 ? true : false;
    },
    /**
     * @function getNetworkHttp
     * @description 获取网络列表的方法
     * @returns {void}
     */
    getNetworkHttp() {
      this.networkConfig.loading = true;
      this.$http({
        url: `power/server/list/network/host/${this.hostName}/page`,
        method: 'POST',
        data: {
          current: this.networkPage.currentPage,
          orderMap: {},
          pageSize: this.networkPage.pageSize,
          searchMap: {
            name: this.searchNetwork
          }
        }
      }).then(({ data }) => {
        let { total, records, pages } = data.data;
        this.networkConfig.loading = false;
        if (data.status && records.length > 0) {
          this.networkConfig.data = records;
          this.networkPage.totalCount = total;
          this.networkPage.totalPage = pages;
        } else {
          this.networkConfig.data = [];
          this.networkPage.totalCount = 0;
          this.networkPage.totalPage = 0;
        }
      });
    }
  },
  computed: {
    disabled() {
      return this.network.length >= 3 ? true : false;
    }
  },
  watch: {
    isShow(newValue) {
      this.show = newValue;
      if (newValue) {
        let resetPage = {
          currentPage: 1,
          pageSize: 5
        };
        this.networkPage = { ...this.networkPage, ...resetPage };
        this.searchNetwork = '';
        this.getNetworkHttp();
        this.network = JSON.parse(JSON.stringify(this.networks));
      }
    }
  }
};
</script>
