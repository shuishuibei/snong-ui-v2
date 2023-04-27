<!--
 * @Description Power虚拟机基本申请主页面
 * @Author ys1983/张睿博
 * @Date 2019-08-21 15:29:26
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 11:17:07
 -->
<template>
  <div class="single-power-small-machine">
    <div v-show="$route.meta.breadcrumb !== '物理主机'">
      <h3c-mall
        title="基本配置"
        class-name="icon-ai-tool"
        style-set="#00cc66">
        <template #mallContent>
          <s-base-info
            ref="baseInfo"
            :base-info="baseInfo"
            @e-host-name="getSpecificationHttp">
          </s-base-info>
        </template>
      </h3c-mall>
      <h3c-mall
        title="镜像"
        class-name="icon-yunjingxiang71"
        style-set="#ff9900">
        <template #mallContent>
          <i-form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="150">
            <i-form-item
              label="镜像"
              prop="imageId">
              <i-select
                style="width:300px"
                v-model="formValidate.imageId"
                @on-change="changeImage"
                placeholder="请选择镜像">
                <i-option
                  v-for="item in imageData"
                  :key="item.id"
                  :value="item.id">
                  {{item.name}}
                </i-option>
              </i-select>
            </i-form-item>
            <i-form-item>
              <i-table
                :columns="imageConfig.column"
                :data="imageConfig.data"
                :loading="imageConfig.loading">
              </i-table>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <h3c-mall
        title="规格"
        class-name="icon-guige"
        style-set="#889fe3">
        <template #mallContent>
          <i-form :label-width="150">
            <i-form-item
              label="请选择规格"
              class="spec-wrap"
              required>
              <h3c-table-radio
                :on-radio="selectedSpecification"
                :columns="specificationConfig.column"
                :data="specificationConfig.data"
                style-set="margin:0 0 10px 0"
                :select="{className: 'spec-wrap', name: 'spec'}"
                :page="specificationPage"
                :get-table-data="switchSpecificationPage"
                :config="specificationConfig.loading"
                :checkeded="formValidate.specificationsId">
              </h3c-table-radio>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <h3c-mall
        title="数据盘"
        class-name="icon-yuncunchu"
        style-set="#3399ff">
        <template #mallContent>
          <i-form :label-width="150">
            <i-form-item label="请添加数据盘">
              <i-button
                type="primary"
                :disabled="!maxDiskNums"
                @click="addDataDiskBtn">
                <i class="iconfont icon-plus iconfont-normal"></i>
                <span class="btn-title">新建数据盘</span>
              </i-button>
            </i-form-item>
            <i-form-item>
              <i-table
                :columns="dataDiskConfig.column"
                :data="dataDiskConfig.data">
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
              class="network-table-overflow"
              label="网络列表"
              required>
              <i-table
                :columns="networkConfig.column"
                :data="networkConfig.data">
              </i-table>
            </i-form-item>
            <i-form-item>
              <i-button
                type="primary"
                :disabled="networkDisabled"
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
          <i-form
            :label-width="150"
            required>
            <i-form-item label="主机数量">
              <i-input-number
                :max="1"
                :min="1"
                :disabled="true"
                v-model="formValidate.count">
              </i-input-number>
              <span class="cds-margin-left-10">台</span>
              <span class="cds-margin-left-10" style="color:#ed3f14">注意 <b>:</b> 当前资源申请页面只能申请一台，如需多台请切换批量申请。</span>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <h3c-mall
        title="安全设置"
        class-name="icon-anquan1"
        style-set="#57c0fc">
        <template #mallContent>
          <s-security-settings
            ref="password"
            :password="resourceContent.password">
          </s-security-settings>
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
        :image-name="formValidate.imageName"
        :host-name="hostName"
        :specifications="specifications"
        :networks="networkConfig.data"
        :data-disk="dataDiskConfig.data"
        :nums="formValidate.count">
      </c-selected-config-list>
      <s-volume-template
        :is-show="confirmEditVolumeTemplate"
        :volume-name="volumeName"
        :volume-type-name="volumeTypeName"
        @e-data="editTriggerVolumeTemplate"
        @e-show="(show) => {confirmEditVolumeTemplate = show}">
      </s-volume-template>
      <s-create-data-disk
        :is-show="confirmCreateDataDisk"
        @e-show="(show) => {confirmCreateDataDisk = show}"
        @e-add-volume="emitAddVolume"
        :max-disk-nums="maxDiskNums"
        :image-volume="imageConfig.data">
      </s-create-data-disk>
      <s-create-network
        @e-show="(show) => { confirmCreateNetwork = show}"
        @e-data="emitAddNetwork"
        :networks="networkConfig.data"
        :host-name="hostName"
        :is-show="confirmCreateNetwork">
      </s-create-network>
    </div>
    <template>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import SinglePowerBaseInfo from '../components/SinglePowerBaseInfo.vue'; //引入基本信息组件
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // 引入商城分块组件
import SinglePowerVolumeTemplate from '../components/SinglePowerVolumeTemplate.vue'; // 引入更改存储模板组件
import SinglePowerCreateDataDisk from '../components/SinglePowerCreateDataDisk.vue'; // 引入新增数据盘组件
import H3cTableRadio from '@/components/h3c-radio-table/H3cRadioTable.vue'; //引入单选表格
import SinglePowerCreateNetwork from '../components/SinglePowerCreateNetwork.vue'; // 引入创建网络组建
import SinglePowerSecuritySettings from '../components/SinglePowerSecuritySettings.vue'; // 引入安全设置组件
import CloudResourceSelectedConfig from '../../components/CloudResourceSelectedConfig.vue';
import CloudResourceSelectedConfigList from '../../components/CloudResourceSelectedConfigList.vue';
import MallFooter from '../../components/MallFooter.vue'; // 引入商城提交的页脚
import { required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'SinglePowerSmallMachine',
  components: {
    'h3c-mall': H3cMall,
    'h3c-table-radio': H3cTableRadio,
    's-base-info': SinglePowerBaseInfo,
    's-volume-template': SinglePowerVolumeTemplate,
    's-create-data-disk': SinglePowerCreateDataDisk,
    's-create-network': SinglePowerCreateNetwork,
    's-security-settings': SinglePowerSecuritySettings,
    'c-selected-config': CloudResourceSelectedConfig,
    'c-selected-config-list': CloudResourceSelectedConfigList,
    'mall-footer': MallFooter
  },
  data() {
    return {
      formValidate: {
        applyListId: '',
        imageId: '', // 镜像id
        imageName: '', // 镜像名称
        imageSize: '', // 镜像大小
        specificationsId: '', // 规格id
        count: 1, // 主机数量
        cpu: 0, // 所选规格的cpu
        memory: 0, // 所选规格的内存
        specificationsPageInfo: {
          //所选规格的分页数据
          page: 1,
          pageSize: 5
        },
        resTenancy: '-1',
        tenancy: 0
      },
      ruleValidate: {
        imageId: required({ message: '镜像不能为空' })
      },
      imageData: [],
      imageConfig: {
        column: [
          {
            title: '名称',
            key: 'name',
            ellipsis: true,
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
            title: '规格(G)',
            width: 100,
            key: 'size',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.size
                  }
                },
                params.row.size
              );
            }
          },
          {
            title: '存储器',
            align: 'center',
            key: 'storage_host',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.storage_host
                  }
                },
                params.row.storage_host
              );
            }
          },
          {
            title: '存储模板',
            align: 'center',
            key: 'volume_type',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.volume_type
                  }
                },
                params.row.volume_type
              );
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (h, params) => {
              return h(
                'Button',
                {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.volumeTypeName = params.row.volume_type;
                      this.volumeName = params.row.name;
                      this.confirmEditVolumeTemplate = true;
                    }
                  }
                },
                '修改存储模板'
              );
            }
          }
        ],
        data: [],
        loading: true
      },
      confirmEditVolumeTemplate: false, // 控制修改存储模板弹框的显示与否
      confirmCreateDataDisk: false, // 控制修改新增数据盘的显示与否
      volumeTypeName: '', // 修改镜像的存储模板名称
      volumeName: '', // 修改镜像的存储模板名称类型
      specificationConfig: {
        column: [
          {
            title: '处理单元(核)',
            key: 'cpu',
            align: 'center'
          },
          {
            title: '内存大小(G)',
            key: 'memory',
            align: 'center'
          }
        ],
        data: [],
        loading: false
      },
      specificationPage: {
        //规格分页数据
        totalCount: 0, //总条数
        currentPage: 1, //当前页码
        pageSize: 5, //每页条数
        totalPage: 1 //总页数
      },
      dataDiskConfig: {
        column: [
          {
            title: '存储模板名称',
            key: 'action',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.volumeType.name
                  }
                },
                params.row.volumeType.name
              );
            }
          },
          {
            title: '硬盘容量',
            key: 'size'
          },
          {
            title: '数量',
            key: 'count'
          },
          {
            title: '共享',
            key: 'multiattach',
            render: (h, params) => {
              return h('span', params.row.multiattach === 1 ? '是' : '否');
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
                    this.deleteDataDisk(params.index);
                  }
                }
              });
            }
          }
        ],
        data: []
      },
      networkConfig: {
        column: [
          {
            title: '网络名称',
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
            title: '地址池',
            key: 'addressPool',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.addressPool
                  }
                },
                params.row.addressPool
              );
            }
          },
          {
            title: 'IP分配方式',
            key: 'action',
            render: (h, params) => {
              return h(
                'Select',
                {
                  props: {
                    value: params.row.allocation
                  },
                  on: {
                    'on-change': value => {
                      if (value === '自动分配') {
                        this.networkConfig.data[params.index].ip = '';
                      }
                      this.networkConfig.data[params.index].allocation = value;
                    }
                  }
                },
                [
                  h(
                    'Option',
                    {
                      props: {
                        value: '自动分配'
                      }
                    },
                    '自动分配'
                  ),
                  h(
                    'Option',
                    {
                      props: {
                        value: '手动分配'
                      }
                    },
                    '手动分配'
                  )
                ]
              );
            }
          },
          {
            title: '私网IP',
            key: 'action',
            width: 200,
            render: (h, params) => {
              if (params.row.allocation === '手动分配') {
                return h('Input', {
                  props: {
                    placeholder: '请输入IP地址',
                    value: params.row.ip
                  },
                  on: {
                    'on-blur': e => {
                      var indexes = this.networkConfig.data.findIndex(
                        value => value.id === params.row.id
                      );
                      if (e.srcElement.value !== '') {
                        const reg = /^\d+\.\d+\.\d+\.\d+$/g;
                        let check = reg.test(e.srcElement.value);
                        if (check) {
                          this.$loading.show();
                          this.$http({
                            url: 'power/server/check/ip',
                            method: 'POST',
                            data: Object.assign({}, this.networkConfig.data[indexes], {
                              applyListId: this.$route.query.pageId ? this.$route.query.pageId : '',
                              ip: e.srcElement.value
                            })
                          }).then(({ data }) => {
                            if (data.status) {
                              this.$Notice.success({
                                title: '成功',
                                desc: 'IP校验成功'
                              });
                              this.networkConfig.data[indexes].ip = e.srcElement.value;
                            } else {
                              this.IPValue = e.srcElement.value;
                              e.srcElement.style.visibility = 'hidden';
                              var Span = e.srcElement.parentElement.getElementsByClassName(
                                'ivu-input-icon'
                              )[0];
                              Span.innerHTML = data.message;
                              Span.style.display = 'block';
                              Span.style.zIndex = 99;
                              this.$set(this.networkConfig.data[indexes], 'ip', '');
                            }
                            this.$loading.hide();
                          });
                        } else {
                          this.IPValue = e.srcElement.value;
                          e.srcElement.style.visibility = 'hidden';
                          var Span = e.srcElement.parentElement.getElementsByClassName(
                            'ivu-input-icon'
                          )[0];
                          Span.innerHTML = '您输入的IP地址不符合格式,请重新输入';
                          Span.style.display = 'block';
                          Span.style.zIndex = 99;
                          this.$set(this.networkConfig.data[indexes], 'ip', '');
                        }
                      } else {
                        this.IPValue = '';
                        this.$set(this.networkConfig.data[indexes], 'ip', '');
                      }
                    }
                  },
                  nativeOn: {
                    click: e => {
                      if (e.target.nodeName === 'I') {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling.nodeName === 'INPUT') {
                          e.target.nextElementSibling.style.visibility = 'visible';
                          e.target.nextElementSibling.value = this.IPValue;
                          e.target.nextElementSibling.focus();
                        }
                      }
                    }
                  }
                });
              } else {
                return h('span', '自动分配IP地址');
              }
            }
          },
          {
            title: '适配器类型',
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
            title: '是否冗余适配器',
            key: 'action', //enableGateway
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
                        this.networkConfig.data[params.index].redundant = JSON.parse(bool);
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
            render: (h, params) => {
              if (params.row.adapterType !== 'SEA') {
                return h('Input', {
                  props: {
                    value: params.row.vNicCap,
                    placeholder: '请输入NIC容量'
                  },
                  on: {
                    'on-blur': e => {
                      let nic = Number(e.srcElement.value);
                      if (Object.is(nic, NaN)) {
                        e.srcElement.value = 2;
                        this.$Notice.warning({
                          desc: 'NIC容量只能输入数字,且只能在2-100的之间的偶数'
                        });
                      } else if (2 <= nic && nic <= 100 && nic % 2 === 0) {
                        this.networkConfig.data[params.index].vNicCap = nic;
                      } else {
                        e.srcElement.value = 2;
                        this.$Notice.warning({
                          desc: 'NIC容量只能输入数字,且只能在2-100的之间的偶数'
                        });
                      }
                    }
                  }
                });
              } else {
                return h('span', '不支持');
              }
            }
          },
          {
            title: '删除',
            width: 70,
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
      networkDisabled: true, // 添加网络按钮是否禁用
      confirmCreateNetwork: false, // 控制添加网络的模态框的显示与否
      hostName: '',
      resourceContent: {},
      selectedConfig: {
        rows: [
          {
            title: '物理主机',
            key: 'hostName'
          },
          {
            title: '镜像',
            key: 'imageName'
          },
          {
            title: '规格',
            key: 'specifications'
          },
          {
            title: '网络',
            key: 'networks',
            traversing: true,
            template: ({ name }) => name
          },
          {
            title: '数据盘',
            key: 'dataDisk',
            traversing: true,
            template: ({ count, size }) => `数据盘${count}块${size}GB`
          },
          {
            title: '数量',
            key: 'nums',
            template: nums => `${nums}台`
          }
        ],
        show: false
      }
    };
  },
  methods: {
    /**
     * @function getImageHttp
     * @description 获取镜像列表方法
     * @param {Boolean} is
     * @returns {void}
     */
    getImageHttp(is = false) {
      this.imageConfig.loading = true;
      this.$http({
        url: 'power/server/list/image/page',
        method: 'POST',
        data: {
          current: 1,
          orderMap: {},
          pageSize: 1000,
          searchMap: {}
        }
      }).then(({ data }) => {
        this.imageConfig.loading = false;
        let { records } = data.data;
        if (data.status && records.length > 0) {
          this.imageData = records;
          let { imageId, imageVolume, volumes } = this.resourceContent;
          let index = is ? records.findIndex(item => item.id === imageId) : 0;
          let { id, name, size, systemVolumes } = records[index];
          this.formValidate.imageId = id;
          this.formValidate.imageName = name;
          this.formValidate.imageSize = size;
          if (is) {
            this.imageConfig.data = imageVolume;
            this.dataDiskConfig.data = volumes;
          } else {
            this.imageConfig.data = systemVolumes;
            this.imageConfig.data.forEach(value => {
              value.resizeType = false;
            });
          }
        } else {
          this.imageData = [];
          this.formValidate.imageId = '';
          this.formValidate.imageName = '';
          this.formValidate.imageSize = '';
          this.imageConfig.data = [];
        }
      });
    },
    /**
     * @function editTriggerVolumeTemplate
     * @description 修改存储模板时触发的方法
     * @param {Object} data
     * @returns {void}
     */
    editTriggerVolumeTemplate(data) {
      let index = this.imageConfig.data.findIndex(item => item.name === this.volumeName);
      this.$set(this.imageConfig.data[index], 'volumeType', data);
      this.$set(this.imageConfig.data[index], 'volume_type', data.name);
      this.$set(this.imageConfig.data[index], 'resizeType', true);
      this.dataDiskConfig.data = this.dataDisk;
    },
    /**
     * @function changeImage
     * @description 镜像发生改变时触发的方法
     * @param {String} id
     * @returns {void}
     */
    changeImage(id) {
      let { name, size, systemVolumes } = this.imageData.find(item => item.id === id);
      this.formValidate.imageName = name;
      this.formValidate.imageSize = size;
      this.imageConfig.data = systemVolumes;
      this.imageConfig.data.forEach(value => {
        value.resizeType = false;
      });
      this.volumeName = '';
      this.volumeTypeName = '';
      this.dataDiskConfig.data = [];
    },
    /**
     * @function selectedSpecification
     * @description 选中规格触发的方法
     * @param {Object} row
     * @returns {void}
     */
    selectedSpecification({ row }) {
      let { cpu, memory } = row;
      this.formValidate.cpu = cpu;
      this.formValidate.memory = memory;
      let { currentPage, pageSize } = this.specificationPage;
      this.formValidate.specificationsPageInfo.page = currentPage;
      this.formValidate.specificationsPageInfo.pageSize = pageSize;
    },
    /**
     * @function switchSpecificationPage
     * @description 切换规格的分页触发的方法
     * @param {Boolean} loading
     * @param {Number} currentPage
     * @param {Number} pageSize
     * @returns {void}
     */
    switchSpecificationPage({ loading = false, currentPage = 1, pageSize = 5 } = {}) {
      if (loading) {
        this.specificationConfig.loading = loading;
        this.specificationConfig.data = [];
      }
      this.specificationPage.pageSize = pageSize;
      this.specificationPage.currentPage = currentPage;
    },
    /**
     * @function getSpecificationHttp
     * @description 根据物理主机名称获取规格数据
     * @param {Object} option
     * @param {String} option.name
     * @param {Boolean} option.is
     * @returns {void}
     */
    getSpecificationHttp({ name, is }) {
      this.specificationConfig.loading = true;
      this.networkDisabled = false;
      this.hostName = name;
      this.networkConfig.data = is ? this.resourceContent.networks : [];
      this.$http({
        url: `power/server/host/${name}/flavor`,
        method: 'POST',
        data: {
          current: this.specificationPage.currentPage,
          orderMap: {},
          pageSize: this.specificationPage.pageSize,
          searchMap: {}
        }
      }).then(({ data }) => {
        this.specificationConfig.loading = false;
        let { records, total } = data.data;
        if (data.status && records.length > 0) {
          this.specificationConfig.data = records;
          this.specificationPage.totalCount = total;
          let index = is ?
            records.findIndex(item => item.id === this.resourceContent.specificationsId) :
            0;
          let { cpu, memory, id } = records[index];
          this.formValidate.specificationsId = id;
          this.formValidate.cpu = cpu;
          this.formValidate.memory = memory;
        } else {
          this.specificationConfig.data = [];
          this.formValidate.specificationsId = '';
          this.formValidate.cpu = 0;
          this.formValidate.memory = 0;
        }
      });
    },
    /**
     * @function addDataDiskBtn
     * @description 点击添加数据盘触发的方法
     * @returns {void}
     */
    addDataDiskBtn() {
      this.confirmCreateDataDisk = true;
    },
    /**
     * @function emitAddVolume
     * @description 在新增数据盘弹窗点击确认触发的方法
     * @param {Object} volume
     * @returns {void}
     */
    emitAddVolume(volume) {
      this.dataDiskConfig.data.push(volume);
    },
    /**
     * @function deleteDataDisk
     * @description 数据盘表格点击删除触发的方法
     * @param {Number} index
     * @returns {void}
     */
    deleteDataDisk(index) {
      this.dataDiskConfig.data.splice(index, 1);
    },
    /**
     * @function addNetwork
     * @description 网络区域点击添加网络触发的方法
     * @returns {void}
     */
    addNetwork() {
      this.confirmCreateNetwork = true;
    },
    /**
     * @function emitAddNetwork
     * @description 选中网络提交之后触发的方法
     * @param {Array} network
     * @returns {void}
     */
    emitAddNetwork(network) {
      this.networkConfig.data = network;
    },
    /**
     * @function deleteNetwork
     * @description 点击删除网络触发的方法
     * @param {Number} index
     * @returns {void}
     */
    deleteNetwork(index) {
      this.networkConfig.data.splice(index, 1);
    },
    /**
     * @function validateNetwork
     * @description 验证网络是否符合提交规范
     * @returns {Promise}
     */
    validateNetwork() {
      return new Promise((resolve, reject) => {
        if (this.networkConfig.data.length) {
          let isValid = this.networkConfig.data.some(
            network => network.allocation === '手动分配' && network.ip === ''
          );
          isValid ? reject('网络ip校验未通过') : resolve(this.networkConfig.data);
        } else {
          reject('当前未选择网络');
        }
      });
    },
    /**
     * @function isEmptyValidate
     * @description 校验提交的表单是否有空值存在
     * @param {Array} keyList
     * @returns {Promise}
     */
    isEmptyValidate(keyList) {
      let formData = this.formValidate;
      return new Promise((resolve, reject) => {
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            let isValidateKey = keyList && keyList.includes(key) > -1 ? false : true;
            if (
              isValidateKey &&
              (formData[key] === '' ||
                formData[key].length === 0 ||
                Object.keys(formData[key]).length === 0)
            ) {
              reject('表单验证未通过，请检查');
              break;
            }
          }
        }
        resolve(formData);
      });
    },
    /**
     * @function handlerSubmit
     * @description 点击加入申请清单触发的方法
     * @returns {void}
     */
    handlerSubmit() {
      let { baseInfo, password } = this.$refs;
      let promiseAll = [this.validateNetwork(), this.isEmptyValidate(['applyListId'])];
      [baseInfo, password].forEach(({ $refs }) => {
        promiseAll.push(
          new Promise((resolve, reject) => {
            $refs.formValidate.validate(valid => {
              valid ? resolve($refs.formValidate.model) : reject('表单验证未通过，请检查');
            });
          })
        );
      });
      Promise.all(promiseAll)
        .then(([network, formData, baseInfo, passwordForm]) => {
          let { password } = passwordForm;
          this.$loading.show();
          this.$http({
            url: 'applyList/server',
            method: 'POST',
            data: {
              networks: network,
              volumes: this.dataDiskConfig.data,
              imageVolume: this.imageConfig.data,
              password,
              ...baseInfo,
              ...formData
            }
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                title: '成功',
                desc: data.message
              });
            } else {
              this.$Notice.error({
                title: '失败',
                desc: data.message
              });
            }
          });
        })
        .catch(erro => {
          this.$Notice.error({
            title: '失败',
            desc: erro
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
      this.formValidate.applyListId = id;
      this.$http({
        url: `applyList/editResourceInfo/${id}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status) {
          let { resourceContent } = data.data;
          this.resourceContent = JSON.parse(resourceContent);
          let { page, pageSize } = this.resourceContent.specificationsPageInfo;
          this.specificationPage.current = page;
          this.specificationPage.pageSize = pageSize;
          this.getImageHttp(true);
        } else if (data.code === 700) {
          this.$Notice.error({ desc: data.message });
        }
      });
    }
  },
  computed: {
    /**
     * @function maxDiskNums
     * @description 最大可以申请几块
     * @returns {Number}
     */
    maxDiskNums() {
      let max = 0;
      this.dataDiskConfig.data.forEach(volume => {
        max += volume.count;
      });
      return 3 - max;
    },
    /**
     * @function specifications
     * @description 组装规格
     * @returns {String}
     */
    specifications() {
      let { cpu, memory, imageSize } = this.formValidate;
      return `${cpu}*${memory}*${imageSize}`;
    },
    /**
     * @function baseInfo
     * @description 过滤编辑的数据，把需要的数据给基本配置组件
     * @returns {Object}
     */
    baseInfo() {
      let {
        description,
        displayHostName,
        groupName,
        hostName,
        hostPageInfo,
        scgId,
        scgName,
        name
      } = this.resourceContent;
      return {
        description,
        displayHostName,
        groupName,
        hostName,
        hostPageInfo,
        scgId,
        scgName,
        name
      };
    },
    /**
     * @function dataDisk
     * @description 数据盘再更改存储模板时，那些应该去掉，那些应该留下
     * @returns {Array}
     */

    dataDisk() {
      let { data } = this.dataDiskConfig;
      return data.filter(disk => {
        return this.imageConfig.data.some(image => image.volume_type === disk.volumeType.name);
      });
    }
  },
  mounted() {
    !this.$route.query.hasOwnProperty('id') && this.getImageHttp();
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
.single-power-small-machine {
  width: 100%;
  min-height: 100%;
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
    &::before {
      content: '' !important;
    }
  }
  .network-table-overflow {
    /deep/.ivu-table-wrapper {
      overflow: visible;
    }
  }
}
</style>
