<!--
 * @Description 云主机申请主页面
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:41
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:55:39
 -->
<template>
  <div
    class="cloud-host cds-padding-14 cds-border cds-scroll-wrap">
    <div class="cds-scroll-content">
      <h3c-title title="X86虚拟机">
        <template #other>
          <a
            class="cds-float-right back-to-mall"
            @click="backHome">
            返回云资源
          </a>
        </template>
      </h3c-title>
      <h3c-mall
        title="资源区域"
        class-name="icon-ziyuan-xianxing"
        style-set="#00cc66">
        <template #mallContent>
          <c-resource-area
            ref="resourceArea"
            :resource-content="resourceContent"
            @e-azone-label-name="(name) => {azoneLabelName = name}"
            @e-azone="getImageHttp">
          </c-resource-area>
        </template>
      </h3c-mall>
      <h3c-mall
        title="镜像"
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
                v-model="osItem"
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
                v-model="mirrorSearch">
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
        title="规格"
        class-name="icon-guige"
        style-set="#889fe3">
        <template #mallContent>
          <div style="padding:15px 20px 15px 65px">
            <h3c-spec-form
              @changeFormData="changeSpecification"
              show-storage-type
              :min-cpu="imageInfo.cpu"
              :min-ram="imageInfo.memory"
              :min-disk="imageInfo.storage"
              :fixed-param="fixedParam">
            </h3c-spec-form>
          </div>
        </template>
      </h3c-mall>
      <h3c-mall
        title="数据盘"
        class-name="icon-yuncunchu"
        style-set="#3399ff">
        <template #mallContent>
          <c-host-nums
            @e-storage="(storage) => {formValidate.storage = storage}"
            :storage="storage">
          </c-host-nums>
        </template>
      </h3c-mall>
      <h3c-mall
        title="网络"
        class-name="icon-wangluo1"
        style-set="#ff6600">
        <template #mallContent>
          <i-form :label-width="150">
            <i-form-item
              label="已选择的网络"
              required>
              <i-table
                :columns="networkConfig.columns"
                :data="networkConfig.data">
              </i-table>
            </i-form-item>
            <i-form-item>
              <i-button
                type="primary"
                @click="addNetwork">
                添加网络
              </i-button>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <h3c-mall
        title="数量"
        class-name="icon-xianxing_qingdan"
        style-set="#08cfb2">
        <template #mallContent>
          <i-form :label-width="150">
            <i-form-item
              label="主机数量"
              required>
              <i-input-number
                :min="1"
                :max="10"
                :editable="false"
                :disabled="controlIpServerNums"
                v-model="formValidate.serverNums">
              </i-input-number>
              <span class="cds-margin-left-10">台</span>
              <span class="cds-margin-left-10 cds-color-ed3f14"> 注意 <b>:</b> 上述规格的X86虚拟机，可同时申请多个，如果网络指定了IP则最多只能申请一台。 </span>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <h3c-mall
        title="安全设置"
        class-name="icon-anquan1"
        style-set="#57c0fc">
        <template #mallContent>
          <c-security-settings
            ref="securitySettings"
            :virt-type="virtType"
            :password-info="passwordInfo"
            :user-name="showOsTypeUser">
          </c-security-settings>
        </template>
      </h3c-mall>
      <c-add-network
        :page-show="addNetworkPageShow"
        :azone-id="azoneId"
        :data="networkConfig.data"
        @e-submit="(data) => {networkConfig.data = [...data]}"
        @on-show="(bool) => {addNetworkPageShow = bool}">
      </c-add-network>
      <mall-footer
        :handler-submit="handlerSubmit"
        :submit-title="$route.query.id ? '修改申请清单' :'加入申请清单'">
      </mall-footer>
      <c-selected-config @e-open="selectedConfig.show = true"></c-selected-config>
      <c-selected-config-list
        v-model="selectedConfig.show"
        :rows="selectedConfig.rows"
        :azone-name="azoneLabelName"
        :image-name="formValidate.imageName"
        :server-norm="formValidate.serverNorm"
        :networks="networkConfig.data"
        :storages="formValidate.storage"
        :nums="formValidate.serverNums">
      </c-selected-config-list>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // // 引入商城分块组件
import H3cSpecForm from '@/components/h3c-spec-form/H3cSpecForm.vue'; //引入规格组件
import CloudHostResourceArea from './components/CloudHostResourceArea.vue'; // 引入资源区域组件
import H3cTableRadio from '@/components/h3c-radio-table/H3cRadioTable.vue'; //引入单选表格
import CloudHostNums from './components/CloudHostNums.vue'; // 云主机数量
import MallFooter from '../components/MallFooter.vue'; // 引入商城提交的页脚
import CloudHostAddNetwork from './components/CloudHostAddNetwork.vue'; // 添加网络页面
import CloudHostSecuritySettings from './components/CloudHostSecuritySettings.vue'; // 安全设置页面
import CloudResourceSelectedConfig from '../components/CloudResourceSelectedConfig.vue';
import CloudResourceSelectedConfigList from '../components/CloudResourceSelectedConfigList.vue';
export default {
  name: 'CloudHost',
  components: {
    'h3c-title': H3cTitle,
    'h3c-mall': H3cMall,
    'c-resource-area': CloudHostResourceArea,
    'h3c-table-radio': H3cTableRadio,
    'h3c-spec-form': H3cSpecForm,
    'mall-footer': MallFooter,
    'c-host-nums': CloudHostNums,
    'c-add-network': CloudHostAddNetwork,
    'c-security-settings': CloudHostSecuritySettings,
    'c-selected-config': CloudResourceSelectedConfig,
    'c-selected-config-list': CloudResourceSelectedConfigList
  },
  inject: {
    isAbsolute: {
      default: () => ({ scrollEmit: false })
    }
  },
  data() {
    return {
      formValidate: {
        imageId: '', // 镜像id
        imageName: '', // 镜像名称
        osType: '', // 镜像所属系统类别
        serverApplyImageDTO: {
          currentSize: 1,
          imagePage: 5,
          imageOsType: '全部',
          searchValue: ''
        },
        serverNums: 1, // 主机数量
        storage: [
          {
            diskNums: 0,
            diskSize: 0
          }
        ], // 所选数据盘
        serverNorm: '', // 所选规格
        userId: '',
        userName: '',
        storageType: '普通'
      },
      disabled: true, // 镜像的选择操作系统筛选镜像是否禁用
      imageConfig: {
        //镜像表格的配置
        columns: [
          {
            title: '名称',
            ellipsis: true,
            key: 'action',
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
            title: '最小CPU(核)',
            width: 120,
            key: 'minCpu'
          },
          {
            title: '最小内存(MB)',
            key: 'minRam',
            width: 120
          },
          {
            title: '最小磁盘(GB)',
            key: 'minDisk',
            width: 120
          },
          {
            title: '大小(GB)',
            width: 100,
            key: 'size'
          }
        ],
        data: [],
        loading: true
      },
      imagePage: {
        //镜像分页信息
        totalCount: 0, // 总条数
        currentPage: 1, // 当前页码
        pageSize: 5, // 每页条数
        totalPage: 1 // 总页数
      },
      imageInfo: {
        // 所选镜像的最小cpu，内存和存储
        cpu: 0,
        memory: 0,
        storage: 0
      },
      fixedParam: {}, // 规格区域默认参数
      safeUser: '', // 根据镜像所属系统类别判断显示那个用户名
      networkConfig: {
        // 已选网络规格列表配置
        columns: [
          {
            title: '网络名称',
            key: 'netName',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.netName
                  }
                },
                params.row.netName
              );
            }
          },
          {
            title: '网络地址',
            key: 'cidr',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.cidr
                  }
                },
                params.row.cidr
              );
            }
          },
          {
            title: 'IP地址',
            key: 'action',
            width: 300,
            render: (h, params) =>
              h('i-input', {
                props: {
                  placeholder: '请输入IP地址，不填则默认为系统自动分配',
                  value: params.row.ip,
                  'element-id': params.row.networkId
                },
                on: {
                  'on-blur': e => {
                    let index = this.networkConfig.data.findIndex(
                      item => item.networkId === params.row.networkId
                    );
                    this.ipRuleNetwork[index] = false;
                    let ip = e.srcElement.value;
                    this.networkConfig.data[index].ip = ip;
                    if (ip !== '') {
                      const reg = /^\d+\.\d+\.\d+\.\d+$/g;
                      if (reg.test(ip)) {
                        this.checkIpHttp(e, ip, params.row.networkId, index);
                      } else {
                        this.ipRuleNetwork[index] = false;
                        this.$nextTick(() => {
                          let Dom = document.getElementById(params.row.networkId);
                          this.errorNetworkIpMessage(Dom, '输入的IP地址不符合格式,请重新输入');
                        });
                      }
                    } else {
                      this.ipRuleNetwork[index] = true;
                    }
                  }
                },
                nativeOn: {
                  click: e => {
                    if (e.target.nodeName === 'I') {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling.nodeName === 'INPUT') {
                        e.target.nextElementSibling.style.visibility = 'visible';
                        e.target.nextElementSibling.value = params.row.ip;
                        e.target.nextElementSibling.focus();
                      }
                    }
                  }
                }
              })
          },
          {
            title: '网卡类型',
            key: 'action',
            render: (h, params) => {
              return h(
                'i-select',
                {
                  props: {
                    value: params.row.vifType
                  },
                  on: {
                    'on-change': value => {
                      this.networkConfig.data[params.index].vifType = value;
                    }
                  }
                },
                [
                  h(
                    'Option',
                    {
                      props: {
                        value: 'e1000e'
                      }
                    },
                    'e1000e'
                  ),
                  h(
                    'Option',
                    {
                      props: {
                        value: 'vmxnet3'
                      }
                    },
                    'vmxnet3'
                  )
                ]
              );
            }
          },
          {
            title: '网关',
            width: 70,
            key: 'action', //enableGateway
            render: (h, params) => {
              return h('Checkbox', {
                props: {
                  value: params.row.enableGateway,
                  disabled: this.checkboxController(params.row.enableGateway)
                },
                on: {
                  'on-change': bool => {
                    this.$set(this.networkConfig.data[params.index], 'enableGateway', bool);
                  }
                }
              });
            }
          },
          {
            title: '删除',
            width: 100,
            key: 'action',
            render: (h, params) => {
              return h('i', {
                class: 'iconfont icon-shanchu',
                style: {
                  fontSize: '16px',
                  color: '#3399FE'
                },
                on: {
                  click: () => {
                    this.deleteNetwork(params.index);
                  }
                }
              });
            }
          }
        ],
        data: []
      },
      addNetworkPageShow: false, // 控制添加网络弹框页面显示与否
      azoneId: '', // 所选作用域的id用来传值到添加网络页面
      ipRuleNetwork: [true, true, true], // ip校验是否通过
      azoneLabelName: '', // 所选资源区域名称，用来传往所选配置页面的值
      osItem: '全部', // 镜像的操作系统类别
      mirrorSearch: '', // 镜像搜索的值
      virtType: '',
      resourceContent: {}, // 申请清单编辑跳转到页面保留被编辑的资源
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
            title: '规格',
            key: 'serverNorm'
          },
          {
            title: '网络',
            key: 'networks',
            traversing: true,
            template: ({ netName }) => {
              return netName;
            }
          },
          {
            title: '数据盘',
            key: 'storages',
            traversing: true,
            template: ({ diskNums, diskSize }) => {
              return `${diskNums}块${diskSize}G`;
            }
          },
          {
            title: '数量',
            key: 'nums',
            template: nums => {
              return nums + '台';
            }
          }
        ],
        show: false
      }
    };
  },
  methods: {
    /**
     * @function backHome
     * @description 点击返回云商城触发的方法
     * @returns {void}
     */
    backHome() {
      this.$router.push({
        name: 'resource-directory/index',
        query: { time: new Date().getTime() }
      });
    },
    /**
     * @function selectedImage
     * @description 选择镜像触发的方法
     * @param {Object} row  - 当前选中镜像的数据
     * @returns {void}
     */
    selectedImage({ row }) {
      let { osType, id, name, minCpu, minDisk, minRam } = row;
      this.formValidate.osType = osType;
      this.formValidate.imageId = id;
      this.formValidate.imageName = name;
      this.imageInfo = {
        cpu: minCpu,
        memory: parseInt(minRam / 1024),
        storage: minDisk
      };
      this.formValidate.serverApplyImageDTO = {
        currentSize: this.imagePage.currentPage,
        imagePage: this.imagePage.pageSize,
        imageOsType: this.osItem,
        searchValue: this.mirrorSearch
      };
    },
    /**
     * @function getImageTableData
     * @description 发送请求获取表格数据，并且做相应处理
     * @param {Boolean} loading    - 表格缓冲，默认值为false
     * @param {Number} currentPage - 分页当前页，默认值为第一页
     * @param {Number} pageSize    - 分页每页条数，默认值为每页10条
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
     * @function getImageHttp
     * @description 发送请求获取镜像区域的数据
     * @param {String} virType
     * @returns {void}
     */
    getImageHttp({ virtType = this.virtType, azoneId = this.azoneId, is = false } = {}) {
      if (!is) {
        this.networkConfig.data = [];
      }
      if (this.azoneId !== azoneId) {
        this.azoneId = azoneId;
        this.virtType = virtType;
        this.formValidate.imageId = '';
      }
      this.imageConfig.loading = true;
      this.$http({
        url: `image/list/forServer/${this.virtType}`,
        method: 'POST',
        data: {
          currentPage: this.imagePage.currentPage,
          orderMap: {},
          pageSize: this.imagePage.pageSize,
          searchMap: {
            name: this.mirrorSearch,
            os_type: this.osItem === '全部' ? '' : this.osItem
          }
        }
      }).then(({ data }) => {
        this.imageConfig.loading = false;
        this.disabled = false;
        if (data.status && data.data.records.length > 0) {
          let { records, total, pages } = data.data;
          this.imageConfig.data = records;
          this.imagePage.totalCount = total;
          this.imagePage.totalPage = pages;
          if (!this.formValidate.imageId) {
            if (is) {
              let { imageId, serverNorm } = this.resourceContent;
              let norm = serverNorm.split('*');
              let row = records.find(item => item.id === imageId);
              this.selectedImage({ row });
              this.fixedParam = {
                cpu: Number(norm[0]),
                memory: Number(norm[1]),
                disk: Number(norm[2])
              };
            } else {
              this.selectedImage({ row: records[0] });
              this.fixedParam = {};
            }
          }
        } else {
          this.imageConfig.data = [];
          this.imagePage.totalCount = 0;
          this.imagePage.totalPage = 0;
          this.formValidate.imageId = '';
          this.formValidate.imageName = '';
          this.formValidate.osType = '';
          this.imageInfo = { cpu: 0, memory: 0, storage: 0 };
          this.fixedParam = {};
        }
      });
    },
    /**
     * @function changeOsItem
     * @description 当镜像系统类别进行筛选的时候出发的方法
     * @param {String | Boolean} type
     * @returns {void}
     */
    changeOsItem(type) {
      this.formValidate.imageId = '';
      this.formValidate.imageName = '';
      this.imagePage.currentPage = 1;
      if (type) {
        this.mirrorSearch = '';
      }
      this.getImageHttp();
    },
    /**
     * @function changeSpecification
     * @description 点击选中规格所触发的方法
     * @param {String} cpu     - Cpu
     * @param {String} memory  - 内存
     * @param {String} storage - 存储
     * @returns {void}
     */
    changeSpecification({ cpu, memory, storage }) {
      this.formValidate.serverNorm = `${cpu}*${memory}*${storage}`;
    },
    /**
     * @function handlerSubmit
     * @description 点击加入申请清单触发的方法
     * @returns {void}
     */
    handlerSubmit() {
      let { resourceArea, securitySettings } = this.$refs;
      let promiseAll = [];
      [resourceArea, securitySettings].forEach(({ $refs }) => {
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
        .then(data => {
          let networks = this.networkConfig.data;
          if (networks.length < 1) {
            this.$Notice.error({
              desc: '未添加网络'
            });
            return null;
          }
          if (this.ipRuleNetwork.some(item => item === false)) {
            this.$Notice.error({
              desc: '网络ip校验未通过'
            });
            return null;
          }
          if (!networks.some(item => item.enableGateway)) {
            this.$Notice.error({
              desc: '网络网关必须勾选其中一个'
            });
            return null;
          }
          if (!this.formValidate.imageId) {
            this.$Notice.error({
              desc: '镜像未选择数据'
            });
            return null;
          }
          if (!this.storageRule()) {
            this.$Notice.error({
              desc: '请选择正确的数据盘数量/容量'
            });
            return null;
          }
          this.$loading.show();
          this.$http({
            url: 'serverApply/server',
            method: 'POST',
            data: {
              ...data[0],
              ...data[1],
              ...this.formValidate,
              ...{ network: this.networkConfig.data }
            }
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
        .catch(warning => {
          this.$Notice.error({
            title: '失败',
            desc: warning
          });
        });
    },
    /**
     * @function deleteNetwork
     * @description 网络表格点删除网络触发的方法
     * @param {Number} index
     * @returns {void}
     */
    deleteNetwork(index) {
      if (index < this.networkConfig.data.length - 1) {
        let dom = document.getElementById(this.networkConfig.data[index].networkId);
        dom.style.visibility = 'visible';
        let span = dom.parentElement.getElementsByClassName('ivu-input-icon')[0];
        span.innerHTML = '';
        span.style.display = 'none';
      }
      this.networkConfig.data.splice(index, 1);
      this.ipRuleNetwork[index] = true;
    },
    /**
     * @function addNetwork
     * @description 点击添加网络按钮触发的方法
     * @return {void}
     */
    addNetwork() {
      this.addNetworkPageShow = true;
    },
    /**
     * @function checkboxController
     * @description 已选网络列表的网关只能选一个，当选中一个时其它的网关按钮要被禁用
     * @param {Boolean} enableGateway
     * @returns {Boolean}
     */
    checkboxController(enableGateway) {
      let every = this.networkConfig.data.every(item => !item.enableGateway);
      if (every) {
        return false;
      } else {
        let target = this.networkConfig.data.find(item => item.enableGateway === enableGateway);
        return target.enableGateway === true ? false : true;
      }
    },
    /**
     * @function checkIpHttp
     * @description 校验云主机网络地址是否符合要求
     * @param {Element} dom
     * @param {String} ip
     * @param {String} networkId
     * @param {Number} index
     * @returns {void}
     */
    checkIpHttp(dom, ip, networkId, index) {
      this.$loading.show();
      this.$http({
        url: `serverApply/checkServerIpAddress/${networkId}/${ip}`,
        method: 'GET',
        params: {
          applyListId: this.$route.query.hasOwnProperty('id') ? this.$route.query.id : ''
        }
      }).then(({ data }) => {
        this.$loading.hide();
        if (!data.status) {
          this.$nextTick(() => {
            let Dom = document.getElementById(networkId);
            this.errorNetworkIpMessage(Dom, data.message);
          });
        } else {
          this.ipRuleNetwork[index] = true;
        }
      });
    },
    /**
     * @function errorNetworkIpMessage
     * @description 校验IP失败时的报错信息显示
     * @param {Element} dom
     * @param {String} message
     * @returns {void}
     */
    errorNetworkIpMessage(dom, message) {
      dom.style.visibility = 'hidden';
      let span = dom.parentElement.getElementsByClassName('ivu-input-icon')[0];
      span.innerHTML = message;
      span.style.display = 'block';
      span.style.zIndex = 99;
    },
    /**
     * @function storageRule
     * @description 检查数据盘是否符合提交的规则
     * @returns {Boolean}
     */
    storageRule() {
      let storages = this.formValidate.storage;
      if (storages.length > 1) {
        return storages.every(item => item.diskNums !== 0 && item.diskSize !== 0);
      } else {
        let { diskNums, diskSize } = storages[0];
        if ((diskNums !== 0 && diskSize !== 0) || (diskNums === 0 && diskSize === 0)) {
          return true;
        } else {
          return false;
        }
      }
    },
    /**
     * @function getRouterResourceHttp
     * @description 获取申请清单编辑资源
     * @param {String} id
     * @returns {void}
     */
    getRouterResourceHttp(id) {
      this.$http({
        url: `applyList/editResourceInfo/${id}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status) {
          let { resourceNumber, resourceContent } = data.data;
          this.formValidate.serverNums = resourceNumber;
          this.resourceContent = JSON.parse(resourceContent);
          let { serverApplyImageDTO } = this.resourceContent;
          let { currentSize, imagePage, imageOsType, searchValue } = serverApplyImageDTO;
          this.imagePage = Object.assign(this.imagePage, {
            currentPage: currentSize,
            pageSize: imagePage
          });
          this.formValidate.serverApplyImageDTO = serverApplyImageDTO;
          this.osItem = imageOsType;
          this.mirrorSearch = searchValue;
          this.networkConfig.data = this.network;
        } else if (data.code === 700) {
          this.$Notice.error({ desc: data.message });
        }
      });
    }
  },
  computed: {
    /**
     * @function showOsTypeUser
     * @description 根据所选镜像的ostype来决定显示那个用户名
     * @returns {String}
     */
    showOsTypeUser() {
      return this.formValidate.osType.search(/windows/i) > -1 ? 'administrator' : 'root';
    },
    /**
     * @function controlIpServerNums
     * @description 根据网络区域是否自定义了ip来决定是否可以申请多台
     * @returns {Boolean}
     */
    controlIpServerNums() {
      let bool = this.networkConfig.data.some(network => network.ip !== '');
      return bool;
    },
    /**
     * @function storage
     * @description 查看是否是编辑页面过来，如果是则返回数据盘的数据，不是则返回空数组
     * @returns {Array}
     */
    storage() {
      return this.resourceContent.hasOwnProperty('storage') ? this.resourceContent.storage : [];
    },
    /**
     * @function network
     * @description 查看是否是编辑页面过来，编辑页网络数据要进行二次处理
     * @returns {Array}
     */
    network() {
      this.resourceContent.network.forEach(item => {
        item.enableGateway = item.enableGateway === 'true' ? true : false;
      });
      return this.resourceContent.network;
    },
    /**
     * @function passwordInfo
     * @description 查看是否是编辑页面过来，安全区域信息过滤
     * @returns {Object}
     */
    passwordInfo() {
      let { vmxVersion, password } = this.resourceContent;
      return { vmxVersion, password, confirmPassword: password };
    }
  },
  watch: {
    controlIpServerNums(newValue) {
      newValue ? (this.formValidate.serverNums = 1) : null;
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
.cloud-host {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
  .ivu-table-wrapper {
    overflow: visible;
  }
  /deep/.ivu-input-icon {
    position: absolute !important;
    width: 100% !important;
    height: 100% !important;
    border: 1px solid #ff0042 !important;
    color: #ff0042 !important;
    top: 0 !important;
    left: 0 !important;
    border-radius: 4px !important;
    line-height: 30px !important;
    font-size: 13px !important;
    display: none;
    text-align: left !important;
    padding-left: 8px !important;
    animation: none !important;
    cursor: pointer;
  }
  .ivu-input-icon::before {
    content: '' !important;
  }
}
</style>
