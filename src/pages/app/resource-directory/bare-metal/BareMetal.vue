<!--
 * @Description 裸金属申请主页面
 * @Author ys1983/张睿博
 * @Date 2019-07-25 15:32:55
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:55:24
 -->
<template>
  <div
    class="bare-metal cds-padding-14 cds-border cds-scroll-wrap">
    <div class="cds-scroll-content">
      <h3c-title title="裸金属">
        <template #other>
          <a
            class="cds-float-right back-to-mall"
            @click="backHome">
            返回云资源
          </a>
        </template>
      </h3c-title>
      <h3c-mall
        title="基本配置"
        class-name="icon-ai-tool"
        style-set="#55ce5b">
        <template #mallContent>
          <b-base-info
            ref="baseInfo"
            :edit-azone="editAzone"
            @e-virtType="getImageHttp"
            @e-azone="(name) => {azoneName = name}">
          </b-base-info>
        </template>
      </h3c-mall>
      <h3c-mall
        title="选择镜像"
        class-name="icon-yunjingxiang71"
        style-set="#ff9900">
        <template #mallContent>
          <i-form
            :label-width="150"
            :model="formValidate">
            <i-form-item inline>
              <i-select
                style="width:300px"
                :disabled="disabled"
                v-model="formValidate.osType"
                @on-change="changeOsItem">
                <i-option value="全部">全部</i-option>
                <i-option value="windows">windows</i-option>
                <i-option value="linux">linux</i-option>
              </i-select>
              <i-input
                placeholder="请输入镜像名称关键字搜索"
                style="width:240px;margin-left:4px"
                :disabled="disabled"
                @on-keyup.enter="changeOsItem(false)"
                v-model="formValidate.serachType">
              </i-input>
              <i-button
                type="primary"
                class="cds-btn-search"
                @click="changeOsItem(false)">
                <i class="iconfont icon-iconfontsousuo"></i>
              </i-button>
            </i-form-item>
            <i-form-item
              label="请选择镜像"
              required>
              <div class="image-table">
                <h3c-table-radio
                  :on-radio="selectedImage"
                  :columns="imageConfig.columns"
                  :data="imageConfig.data"
                  style-set="margin: 0 0 10px 0"
                  :select="{className: 'image-table', name: 'image'}"
                  :page="imagePage"
                  :get-table-data="getImageTableData"
                  :config="imageConfig.loading"
                  :checkeded="formValidate.imageId">
                </h3c-table-radio>
              </div>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <h3c-mall
        title="节点"
        class-name="icon-guige"
        style-set="#889fe3">
        <template #mallContent>
          <i-form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="150">
            <i-form-item
              label="请选择节点"
              prop="bareMetalNodeAddId">
              <i-select
                style="width:300px"
                v-model="formValidate.bareMetalNodeAddId"
                @on-change="changeNode">
                <i-option
                  v-for="item in nodeList"
                  :key="item.id"
                  :value="item.id">
                  {{item.ipmiAddress}}
                </i-option>
              </i-select>
            </i-form-item>
            <i-form-item
              label="已选节点列表"
              required>
              <i-table
                :columns="nodeConfig.columns"
                :data="nodeConfig.data"
                :loading="nodeConfig.loading">
              </i-table>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <h3c-mall
        title="网络"
        class-name="icon-wangluo1"
        style-set="#ff6600">
        <template #mallContent>
          <i-form :label-width="150">
            <i-form-item
              label="网络列表"
              required>
              <i-table
                :columns="networkConfig.columns"
                :data="networkConfig.data"
                :loading="networkConfig.loading">
              </i-table>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <h3c-mall
        title="安全设置"
        class-name="icon-anquan1"
        style-set="#57c0fc">
        <template #mallContent>
          <b-security-settings
            @e-passwordType="(type) => {passwordType = type}"
            :password-info="passwordInfo"
            ref="securitySettings">
          </b-security-settings>
        </template>
      </h3c-mall>
      <mall-footer
        :handler-submit="handlerSubmit"
        :submit-title="$route.query.id ? '修改申请清单' :'加入申请清单'">
      </mall-footer>
      <c-selected-config @e-open="selectedConfig.show = true"></c-selected-config>
      <c-selected-config-list
        v-model="selectedConfig.show"
        :rows="selectedConfig.rows"
        :azone-name="azoneName"
        :image-name="formValidate.imageName"
        :bare-metal-norm="formValidate.bareMetalNorm"
        :networks="networkConfig.data"
        :password-type="passwordType">
      </c-selected-config-list>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // 引入商城分块组件
import BareMetalBaseInfo from './components/BareMetalBaseInfo.vue'; // 引入裸金属基本信息组件
import H3cTableRadio from '@/components/h3c-radio-table/H3cRadioTable.vue'; //引入单选表格格
import { required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
import MallFooter from '../components/MallFooter.vue'; // 引入商城提交的页脚
import BareMetalSecuritySettings from './components/BareMetalSecuritySettings.vue'; // 引入安全设置组件
import CloudResourceSelectedConfig from '../components/CloudResourceSelectedConfig.vue';
import CloudResourceSelectedConfigList from '../components/CloudResourceSelectedConfigList.vue';
export default {
  name: 'BareMetal',
  components: {
    'h3c-title': H3cTitle,
    'h3c-mall': H3cMall,
    'h3c-table-radio': H3cTableRadio,
    'b-base-info': BareMetalBaseInfo,
    'mall-footer': MallFooter,
    'b-security-settings': BareMetalSecuritySettings,
    'c-selected-config': CloudResourceSelectedConfig,
    'c-selected-config-list': CloudResourceSelectedConfigList
  },
  data() {
    return {
      formValidate: {
        applyId: '',
        imageId: '',
        imageName: '',
        mirrorPageInfo: {
          currentPage: 1,
          pageSize: 5
        },
        bareMetalNodeAddId: '',
        osType: '全部',
        serachType: '',
        bareMetalNorm: '',
        allInterfaces: '',
        gateWayId: '',
        condition: '',
        ipmiAddress: ''
      },
      ruleValidate: {
        bareMetalNodeAddId: required({ message: '节点不能为空' })
      },
      virtType: '',
      disabled: true,
      imagePage: {
        //镜像分页信息
        totalCount: 0, // 总条数
        currentPage: 1, // 当前页码
        pageSize: 5, // 每页条数
        totalPage: 1 // 总页数
      },
      imageConfig: {
        columns: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '最小CPU(核)个数',
            key: 'minCpu'
          },
          {
            title: '最小内存(MB)',
            key: 'minRam'
          },
          {
            title: '最小系统盘(GB)容量',
            key: 'minDisk'
          }
        ],
        data: [],
        loading: true
      },
      nodeList: [],
      nodeParameter: '',
      nodeConfig: {
        columns: [
          {
            title: 'IPMI地址',
            key: 'ipmiAddress'
          },
          {
            title: '服务器型号',
            key: 'serverType'
          },
          {
            title: '节点状态',
            key: 'action',
            render: (h, params) => {
              return h(
                'span',
                params.row.status === 'available' ?
                  '可分配' :
                  params.row.status === 'used' ?
                  '已分配' :
                  '等待回收'
              );
            }
          },
          {
            title: 'CPU',
            key: 'cpu'
          },
          {
            title: '内存',
            key: 'memory'
          },
          {
            title: '硬盘',
            key: 'storage'
          }
        ],
        data: [],
        loading: false
      },
      networkConfig: {
        columns: [
          {
            title: '名称',
            key: 'network'
          },
          {
            title: '网络地址',
            key: 'cidr'
          },
          {
            title: 'IP地址',
            key: 'ip'
          },
          {
            title: '网关',
            width: 100,
            key: 'action',
            render: (h, params) => {
              return h('Radio', {
                props: {
                  value: params.row.gateway,
                  disabled: true
                }
              });
            }
          }
        ],
        data: [],
        loading: false
      },
      azoneName: '',
      passwordType: '自定义密码',
      resourceContent: {},
      selectedConfig: {
        rows: [
          {
            title: '资源区域',
            key: 'azoneName'
          },
          {
            title: '镜像',
            key: 'imageName'
          },
          {
            title: '节点',
            key: 'bareMetalNorm'
          },
          {
            title: '网络',
            key: 'networks',
            traversing: true,
            template: ({ network }) => {
              return network;
            }
          },
          {
            title: '认证策略',
            key: 'passwordType'
          }
        ],
        show: false
      }
    };
  },
  methods: {
    /**
     * @function backHome
     * @description 点击返回云资源的方法
     * @returns {void}
     */
    backHome() {
      this.$router.push({
        name: 'resource-directory/index',
        query: { time: new Date().getTime() }
      });
    },
    /**
     * @function changeOsItem
     * @description 镜像根据系统类别筛选的方法
     * @param {String | Boolean} type
     * @returns {void}
     */
    changeOsItem(type) {
      this.formValidate.imageId = '';
      this.formValidate.imageName = '';
      this.imagePage.currentPage = 1;
      if (type) {
        this.formValidate.serachType = '';
      }
      this.getImageHttp();
    },
    /**
     * @function getImageHttp
     * @description 获取镜像区域的数据
     * @param {Object} option
     * @param {String} option.virtType
     * @param {Boolean} Option.is
     * @returns {void}
     */
    getImageHttp({ virtType = this.virtType, is = false } = {}) {
      this.virtType = virtType;
      if (virtType) {
        this.imageConfig.loading = true;
        this.$http({
          url: `image/list/forServer/${this.virtType}`,
          method: 'POST',
          data: {
            current: this.imagePage.currentPage,
            orderMap: {},
            pageSize: this.imagePage.pageSize,
            searchMap: {
              name: this.formValidate.serachType,
              os_type: this.formValidate.osType === '全部' ? '' : this.formValidate.osType
            }
          }
        }).then(({ data }) => {
          this.imageConfig.loading = false;
          if (data.status && data.data.records.length > 0) {
            let { records, total, pages } = data.data;
            this.disabled = false;
            this.imageConfig.data = records;
            if (!this.formValidate.imageId) {
              let index = is ?
                records.findIndex(item => item.id === this.resourceContent.imageId) :
                0;
              let { id, name, minCpu, minRam, minDisk } = records[index];
              this.imagePage.totalCount = total;
              this.imagePage.totalPage = pages;
              this.formValidate.imageId = id;
              this.formValidate.imageName = name;
              this.nodeParameter = `${minCpu}*${minRam / 1024}*${minDisk}`;
              this.getNodeHttp(is);
            }
          } else {
            this.imageConfig.data = [];
            this.formValidate.imageId = '';
            this.formValidate.imageName = '';
            this.nodeParameter = '';
            this.formValidate.bareMetalNodeAddId = '';
            this.imagePage.totalCount = 0;
            this.imagePage.totalPage = 0;
          }
        });
      }
    },
    /**
     * @function selectedImage
     * @description 选择镜像触发的方法
     * @param {Object} row  - 当前选中镜像的数据
     * @returns {void}
     */
    selectedImage({ row }) {
      let { id, name, minCpu, minRam, minDisk } = row;
      this.formValidate.imageId = id;
      this.formValidate.imageName = name;
      this.nodeParameter = `${minCpu}*${minRam / 1024}*${minDisk}`;
      this.formValidate.mirrorPageInfo = {
        currentPage: this.imagePage.currentPage,
        pageSize: this.imagePage.pageSize
      };
      this.getNodeHttp();
    },
    /**
     * @function getImageTableData
     * @description 发送请求获取表格数据，并且做相应处理
     * @param {Boolean} loading     - 表格缓冲，默认值为false
     * @param {Number} currentPage  - 分页当前页，默认值为第一页
     * @param {number} pageSize     - 分页每页条数，默认值为每页10条
     * @returns {void}
     */
    getImageTableData({ loading = false, currentPage = 1, pageSize = 10 } = {}) {
      if (loading) {
        //设置表格缓冲
        this.imageConfig.loading = loading;
        //将表格数据data设置为空数组
        this.imageConfig.data = [];
      }
      //设置分页每页条数
      this.imagePage.pageSize = pageSize;
      //设置分页当前页
      this.imagePage.currentPage = currentPage;
      //重新请求
      this.virtType && this.getImageHttp();
    },
    /**
     * @function changeNode
     * @description 节点选择变化时触发的方法
     * @param {String} nodeId
     * @returns {void}
     */
    changeNode(nodeId) {
      this.nodeConfig.loading = true;
      this.$http({
        url: 'bareMetal/getBareMetalNodeDetail',
        method: 'GET',
        params: {
          bareMetalNodeId: nodeId
        }
      }).then(({ data }) => {
        this.nodeConfig.loading = false;
        if (data.status) {
          let { cpu, memory, storage, allInterfaces, networkId, status, ipmiAddress } = data.data;
          this.nodeConfig.data = [data.data];
          this.formValidate.bareMetalNorm = `${cpu}*${memory}*${storage}`;
          this.formValidate.allInterfaces = allInterfaces;
          this.formValidate.condition = status;
          this.formValidate.ipmiAddress = ipmiAddress;
          this.networkConfig.data = JSON.parse(networkId);
          this.networkConfig.loading = false;
          this.formValidate.gateWayId = this.networkConfig.data.find(
            item => item.gateway
          ).networkID;
        } else {
          this.nodeConfig.data = [];
          this.formValidate.bareMetalNorm = '';
          this.formValidate.allInterfaces = '';
          this.networkConfig.data = [];
          this.formValidate.gateWayId = '';
        }
      });
    },
    /**
     * @function getNodeHttp
     * @description 获取节点数据
     * @param {Boolean} is
     * @returns {void}
     */
    getNodeHttp(is = false) {
      this.$loading.show();
      let { bareMetalNodeAddId } = this.resourceContent;

      let url = 'bareMetal/listBareMetalNode',
        params = {
          bareMetalFlavor: this.nodeParameter,
          bareMetalAddId: bareMetalNodeAddId ? bareMetalNodeAddId : ''
        };
      this.$http({
        url,
        params
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status && data.data.length > 0) {
          this.nodeList = data.data;
          if (is) {
            this.formValidate.bareMetalNodeAddId = this.resourceContent.bareMetalNodeAddId;
          } else {
            this.formValidate.bareMetalNodeAddId = this.nodeList[0].id;
          }
          this.changeNode(this.formValidate.bareMetalNodeAddId);
        } else {
          this.formValidate.bareMetalNodeAddId = '';
          this.nodeConfig.data = [];
          this.formValidate.bareMetalNorm = '';
          this.formValidate.allInterfaces = '';
          this.networkConfig.data = [];
          this.formValidate.gateWayId = '';
        }
      });
    },
    /**
     * @function handlerSubmit
     * @description 提交订单触发的方法
     * @returns {void}
     */
    handlerSubmit() {
      if (!this.formValidate.imageId) {
        this.$Notice.error({
          title: '失败',
          desc: '镜像未选择数据'
        });
        return null;
      }
      if (!this.formValidate.bareMetalNorm) {
        this.$Notice.error({
          title: '失败',
          desc: '节点未选择数据'
        });
        return null;
      }
      if (this.networkConfig.data.length <= 0) {
        this.$Notice.error({
          title: '失败',
          desc: '网络无数据'
        });
        return null;
      }
      let { baseInfo, securitySettings } = this.$refs;
      let promiseAll = [];
      [baseInfo, securitySettings].forEach(({ $refs }) => {
        promiseAll.push(
          new Promise((resolve, reject) => {
            $refs.formValidate.validate(valid => {
              if (valid) {
                resolve($refs.formValidate.model);
              } else {
                reject('表单验证未通过，请检查');
              }
            });
          })
        );
      });
      Promise.all(promiseAll)
        .then(([baseInfo, securitySettings]) => {
          let parameter = {
            ...baseInfo,
            ...securitySettings,
            ...this.formValidate,
            ...{ network: this.networkConfig.data }
          };
          delete parameter.confirmPassword;
          this.$loading.show();
          this.$http({
            url: 'bareMetal/applyBareMetal',
            method: 'POST',
            data: parameter
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                title: '成功',
                desc: data.message
              });
            } else if (data.code === 700) {
              this.$Notice.error({
                title: '失败',
                desc: data.message
              });
            }
          });
        })
        .catch(info => {
          this.$Notice.error({
            title: '失败',
            desc: info
          });
        });
    },
    /**
     * @function getRouterResourceHttp
     * @description 获取申请清单编辑资源
     * @param {String} id
     * @returns {void}
     */
    getRouterResourceHttp(id) {
      this.formValidate.applyId = id;
      this.$http({
        url: `applyList/editResourceInfo/${id}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status) {
          let { resourceContent } = data.data;
          this.resourceContent = JSON.parse(resourceContent);
          let { currentPage, pageSize } = this.resourceContent.mirrorPageInfo;
          let { serachType, osType } = this.resourceContent;
          this.imagePage.currentPage = +currentPage;
          this.imagePage.pageSize = +pageSize;
          this.formValidate.serachType = serachType;
          this.formValidate.osType = osType;
        } else if (data.code === 700) {
          this.$Notice.error({ desc: data.message });
        }
      });
    }
  },
  computed: {
    /**
     * @function editAzone
     * @description 编辑页面把基本信息的数据筛选出来
     * @returns {Object}
     */
    editAzone() {
      let { azoneId, alias, bareMetalName, description } = this.resourceContent;
      return { azoneId, alias, bareMetalName, description };
    },
    /**
     * @function passwordInfo
     * @description 编辑页面把密码的数据筛选出来
     * @returns {Object}
     */
    passwordInfo() {
      let { passwordType, password } = this.resourceContent;
      return { passwordType, password };
    }
  },
  watch: {
    virtType(newValue) {
      this.imageConfig.data = [];
      this.formValidate.imageId = '';
      this.formValidate.imageName = '';
      this.nodeParameter = '';
      this.formValidate.bareMetalNodeAddId = '';
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.hasOwnProperty('id')) {
      next(vm => {
        vm.getRouterResourceHttp(to.query.id);
        next();
      });
    } else {
      next();
    }
  }
};
</script>

<style lang="less" scoped>
.bare-metal {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
  /deep/.ivu-radio-group-button .ivu-radio-wrapper-checked {
    background: #3399ff;
    color: #fff;
  }
}
</style>
