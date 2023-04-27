<!--
 * @Description 云主机添加网络页面
 * @Author ys1983/张睿博
 * @Date 2019-08-07 15:34:00
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-25 14:21:38
 -->
<template>
  <i-modal
    v-model="isShow"
    :width="50"
    @on-visible-change="changeIsShow"
    :mask-closable="false">
    <template #header>
      <h3c-title title="选择网络"></h3c-title>
    </template>
    <div class="network-content">
      <div class="cds-margin-bottom-14">
        <i-input
          placeholder="请输入名称查询网络"
          v-model="searchNetwork"
          @on-keyup.enter="getNetworkHttp(searchNetwork)"
          style="width:200px">
        </i-input>
        <i-button
          type="primary"
          class="cds-btn-search"
          @click="getNetworkHttp(searchNetwork)">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
      <div class="network-table">
        <h3c-table-radio
          :columns="networkConfig.columns"
          :data="networkConfig.data"
          :select="{className: 'network-table',name: 'add-network'}"
          :config="networkConfig.config"
          :radio="false"
          :page="networkPage"
          :get-table-data="getNetworkTableData">
        </h3c-table-radio>
      </div>
    </div>
    <template #footer>
      <div>
        <i-button
          type="primary"
          @click="handleSubmit">
          确认
        </i-button>
        <i-button @click="changeIsShow(false)">取消</i-button>
      </div>
    </template>
  </i-modal>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cTableRadio from '@/components/h3c-radio-table/H3cRadioTable.vue'; //引入单选表格
export default {
  name: 'CloudHostAddNetwork',
  props: {
    pageShow: {
      type: Boolean,
      required: true
    },
    azoneId: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  components: {
    'h3c-title': H3cTitle,
    'h3c-table-radio': H3cTableRadio
  },
  data() {
    return {
      searchNetwork: '',
      isShow: false,
      networkConfig: {
        columns: [
          {
            title: '选择',
            key: 'action',
            width: 70,
            align: 'center',
            render: (h, params) => {
              return h('Checkbox', {
                props: {
                  value: this.inputController(params.row.resourceId),
                  disabled: this.checkboxController(params.row.resourceId)
                },
                on: {
                  'on-change': e => {
                    if (e) {
                      this.selectedNetworks.push({
                        ip: '',
                        cidr: params.row.cidr,
                        netName: params.row.name,
                        networkId: params.row.resourceId,
                        vifType: 'e1000e',
                        enableGateway: false
                      });
                    } else {
                      var indexes = this.selectedNetworks.findIndex(
                        target => target.networkId === params.row.resourceId
                      );
                      this.selectedNetworks.splice(indexes, 1);
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
            title: '网络地址',
            key: 'cidr'
          }
        ],
        data: [],
        config: true
      },
      networkPage: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 5,
        totalPage: 1
      },
      selectedNetworks: []
    };
  },
  methods: {
    /**
     * @function changeIsShow
     * @description 点击右上角X关闭页面时触发
     * @param {Boolean} bool
     * @returns {void}
     */
    changeIsShow(bool) {
      this.isShow = bool;
      !bool ? this.$emit('on-show', bool) : null;
      this.networkPage = {
        totalCount: 0,
        currentPage: 1,
        pageSize: 5,
        totalPage: 1
      };
      this.networkConfig.data = [];
      this.networkConfig.config = true;
      this.searchNetwork = '';
    },
    /**
     * @function arrayFilter
     * @description 方法 用来查找数组中符合条件的某一项
     * @param {Array} target
     * @param {String} key
     * @param {String} id
     * @returns {Object}
     */
    arrayFilter(target, key, id) {
      return target.length > 0 && target.find(value => value[key] === id);
    },
    /**
     * @function inputController
     * @description 方法 用来判断当前项是否是选中状态
     * @param {String} id
     * @returns {Boolean}
     */
    inputController(id) {
      let target = this.arrayFilter(this.selectedNetworks, 'networkId', id);
      let { networkId } = target ? target : { networkId: false };
      return networkId && true;
    },
    /**
     * @function getNetworkHttp
     * @description 获取网络数据
     * @param {String} name
     * @returns {void}
     */
    getNetworkHttp(name = '') {
      this.networkConfig.config = true;
      let { currentPage, pageSize } = this.networkPage;
      this.$http({
        url: `network/list/forAzoneId/${this.azoneId}`,
        method: 'POST',
        data: {
          current: currentPage,
          pageSize,
          searchMap: { name }
        }
      }).then(({ data }) => {
        let { records, total, pages } = data.data;
        this.networkConfig.config = false;
        if (data.status && records.length > 0) {
          this.networkPage.totalCount = total;
          this.networkPage.totalPage = pages;
          this.networkConfig.data = records;
        } else {
          this.networkPage = {
            totalCount: 0,
            currentPage: 1,
            pageSize: 5,
            totalPage: 1
          };
          this.networkConfig.data = [];
        }
      });
    },
    /**
     * @function getNetworkTableData
     * @description 网络列表点击分页触发的方法
     * @param {Boolean} loading
     * @param {Number} currentPage
     * @param {Number} pageSize
     * @returns {void}
     */
    getNetworkTableData({ loading = false, currentPage = 1, pageSize = 5 } = {}) {
      if (loading) {
        //设置表格缓冲
        this.networkConfig.config = loading;
        //将表格数据data设置为空数组
        this.networkConfig.data = [];
      }
      //设置分页每页条数
      this.networkPage.pageSize = pageSize;
      //设置分页当前页
      this.networkPage.currentPage = currentPage;
      //重新请求
      this.azoneId && this.getNetworkHttp();
    },
    /**
     * @function checkboxController
     * @description 多选控制器，当选到三条的时候其他未选的项禁用
     * @param {String} id
     * @returns {void}
     */
    checkboxController(id) {
      if (this.selectedNetworks.length >= 3) {
        let index = this.selectedNetworks.findIndex(item => item.networkId === id);
        return index > -1 ? false : true;
      } else {
        return false;
      }
    },
    /**
     * @function handleSubmit
     * @description 点击确认按钮触发的方法
     * @returns {void}
     */
    handleSubmit() {
      this.$emit('e-submit', this.selectedNetworks);
      this.changeIsShow(false);
    }
  },
  watch: {
    pageShow(newValue, oldValue) {
      if (newValue) {
        this.azoneId && this.getNetworkHttp();
        this.isShow = newValue;
        this.selectedNetworks = [...this.data];
      }
    }
  }
};
</script>
