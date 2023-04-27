<!--
 * @Description 变更清单页面
 * @Author ys1983/张睿博
 * @Date 2019-08-06 11:44:45
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-06 14:19:28
 -->
<template>
  <div class="cds-border cds-padding-14 change-list cds-scroll-wrap">
    <div class="cds-scroll-content">
      <h3c-title title="变更清单">
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
      </div>
      <mall-emty v-else></mall-emty>
      <h3c-modal-confirm
        title="删除确认"
        v-model="deleteShow"
        :show-background-color="isTemplateCreate ? true : false"
        @on-ok="deleteApplyListResource"
        :warning="isTemplateCreate ? templateCreateMessage : void(0)"
        :info="deleteMessage">
      </h3c-modal-confirm>
      <h3c-modal-confirm
        title="变更规格"
        :width="760"
        v-model="editCloudHostShow"
        @on-ok="confirmEditCloudHost">
        <template #content>
          <h3c-spec-form
            @changeFormData="changeSpecification"
            show-storage-type
            :min-cpu="imageInfo.cpu"
            :min-ram="imageInfo.memory"
            :min-disk="imageInfo.storage"
            :fixed-param="fixedParam">
          </h3c-spec-form>
        </template>
      </h3c-modal-confirm>
      <h3c-modal-confirm
        title="变更容量"
        :width="760"
        v-model="editCloudDiskShow"
        @on-ok="confirmEditCloudDisk">
        <template #content>
          <div class="change-content cds-clearfix">
            <span class="cds-float-left label-text">X86硬盘名称：</span>
            <i-input
              class="cds-float-left"
              style="width:30%;margin-left:20px"
              v-model="volumeName"
              :disabled="true">
            </i-input>
          </div>
          <div class="cds-clearfix change-size">
            <span class="cds-float-left label-text">容量：</span>
            <h3c-array-silder
              style="width:80%;padding:5px 0;float:left;margin-left:20px"
              v-model="volumeSize"
              :data="volumeSizeList"
              :slider-button-style="{backgroundColor: '#3399ff'}"
              :vertical-line-style="{backgroundColor: '#fff',width: '2px'}">
            </h3c-array-silder>
          </div>
        </template>
      </h3c-modal-confirm>
      <h3c-modal-confirm
        title="变更规格"
        :width="670"
        :validate="true"
        v-model="eidtPowerHostShow"
        @on-ok="confirmEditPowerHost">
        <template #content>
          <change-power-host
            ref="changePowerHostForm"
            :name="powerHostName"
            :value="eidtPowerHostShow"
            :power-edit-spec="powerEditSpec"
            :flavor-id="flavorId"
            :new-power-edit-spec="newPowerEditSpec">
          </change-power-host>
        </template>
      </h3c-modal-confirm>
      <h3c-modal-confirm
        title="变更容量"
        v-model="editPowerVolumeShow"
        :validate="true"
        @on-ok="confirmEditPowerVolume">
        <template #content>
          <i-form
            ref="formValidate"
            :model="formValidate"
            :label-width="100">
            <i-form-item label="Power硬盘名称">
              <i-input
                v-model="formValidate.name"
                :disabled="true">
              </i-input>
            </i-form-item>
            <i-form-item
              label="容量"
              prop="size"
              :rules="powerVolumeSizeRule">
              <i-input-number
                :max="maxPowerVolumeSize"
                :min="1"
                v-model="formValidate.size"
                @on-blur="changePowerVolumeSize">
              </i-input-number>
            </i-form-item>
          </i-form>
        </template>
      </h3c-modal-confirm>
      <mall-resource-preflight
        v-model="resourcePreflightShow"
        :apply-list-id="selectAllList"
        @e-result="resourcePreflightResult"
        url="changeList/resourceCheck">
      </mall-resource-preflight>
      <h3c-modal-confirm
        title="资源预检"
        @on-ok="resourceOk"
        v-model="resourcePreflightConfirmShow">
        <template #content>
          <div class="modal-content">
            <div class="modal-info modal-circle">
              <p class="info-icon">
                <i
                  class="iconfont icon-wenhaofill"
                  :class="{iconfont:true,'icon-71shibai':!previewStatus,'icon-chenggong':previewStatus}"
                  :style="{color:previewStatus?'#00CC65':'#FC180F'}">
                </i>
              </p>
              <div class="info-text">资源预检{{previewStatus?'成功':'失败'}}，是否确认提交订单？</div>
              <div class="psInfo" style="color:#FF6600">注：提交订单后，会进入流程审批</div>
            </div>
          </div>
        </template>
      </h3c-modal-confirm>
      <mall-footer
        v-if="isContentShow"
        :handler-submit="handlerSubmit"
        :disabled="selectAllList.length <= 0"
        submit-title="提交订单">
        <template #right>
          <i-checkbox v-model="selectAll" @on-change="changeResourceSelectAll">全选</i-checkbox>
        </template>
        <template #cancel><span v-pre></span></template>
      </mall-footer>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue'; // 引入确认框组件
import H3cSpecForm from '@/components/h3c-spec-form/H3cSpecForm.vue'; //引入规格组件
import H3cArraySlider from '@/components/h3c-slider/H3cArraySlider.vue'; // 引入滑块组件
import ChangePowerHost from './components/ChangePowerHost.vue'; // 引入power虚拟机更改规格组件
import MallFooter from '../components/MallFooter.vue'; // 引入商城提交的页脚
import MallResourcePreflight from '../components/MallResourcePreflight.vue'; // 引入资源预检组件
import MallEmty from '../components/MallEmty.vue';
import OrderListMixin from '../order-list-mixins.js';
import OrderProcessList from '@/assets/js/order-process-column.js';
export default {
  name: 'ChangeList',
  mixins: [OrderListMixin],
  components: {
    'h3c-title': H3cTitle,
    'h3c-modal-confirm': H3cModalConfirm,
    'h3c-spec-form': H3cSpecForm,
    'h3c-array-silder': H3cArraySlider,
    'change-power-host': ChangePowerHost,
    'mall-footer': MallFooter,
    'mall-resource-preflight': MallResourcePreflight,
    'mall-emty': MallEmty
  },
  data() {
    return {
      deleteMessage: '',
      deleteShow: false, // 删除确认弹框的显示开关
      editCloudHostShow: false, // 编辑云主机规格弹框的显示开关
      editCloudDiskShow: false, // 编辑云硬盘容量弹框的开关
      eidtPowerHostShow: false, // 编辑power虚拟机弹框的开关
      editPowerVolumeShow: false, // 编辑power硬盘容量弹框的开关
      previewStatus: false, // 资源预检是否成功的标志
      resourceInfo: {
        id: '',
        name: ''
      },
      imageInfo: {
        cpu: 0,
        memory: 0,
        storage: 0
      },
      fixedParam: {
        cpu: 0,
        memory: 0,
        disk: 0
      },
      serverNorm: {},
      applyListId: '',
      volumeName: '',
      volumeSize: 0,
      volumeSizeList: [],
      minVolumeSize: 0,
      powerHostName: '',
      powerEditSpec: {
        cpu: '0',
        memory: '0',
        vcpu: '0'
      },
      newPowerEditSpec: {
        cpu: '0',
        memory: '0',
        vcpu: '0'
      },
      flavorId: '', // 期望规格对应的id
      formValidate: {
        // power硬盘容量
        name: '',
        size: 0
      },
      maxPowerVolumeSize: 0,
      minPowerVolumeSize: 0,
      powerVolumeSizeRule: {
        required: true,
        validator: (rule, value, callback) => {
          if (this.formValidate.size) {
            callback();
          } else {
            callback('硬盘容量不能为空');
          }
        },
        trigger: 'blur'
      },
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
                    this.editResource(row.applyListId, 'server', row.resourceContent);
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
                    this.editResource(row.applyListId, 'volume', row.resourceContent);
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
                      this.editResource(row.applyListId, 'powerVM', row.resourceContent);
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
                    let { applyListId, resourceName } = row;
                    this.deleteConfirmInfo(applyListId, resourceName);
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
                    this.editResource(row.applyListId, 'powerVolume', row.resourceContent);
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
     * @function getApplyListHttp
     * @description 获取申请清单资源展示列表
     * @returns {void}
     */
    getApplyListHttp() {
      this.$loading.show();
      this.globalTableLoading = true;
      let userId = this.$store.state.login.userId; //获取当前用户id
      this.$http({
        url: `changeList/getChangeList/${userId}`,
        method: 'GET'
      }).then(({ data }) => {
        this.$loading.hide();
        this.globalTableLoading = false;
        let allList = [];
        if (data.status) {
          for (const key in data.data) {
            if (data.data.hasOwnProperty(key)) {
              this[key] = data.data[key].change;
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
     * @function deleteApplyListResource
     * @description 根据id删除申请清单资源
     * @returns {void}
     */
    deleteApplyListResource() {
      this.$loading.show();
      this.$http({
        url: `changeList/delete/${this.resourceInfo.id}`,
        method: 'DELETE'
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.changeResourceSelect(false, this.resourceInfo.id);
          this.getApplyListHttp();
          let index = this.selectAllListBackup.findIndex(item => item === this.resourceInfo.id);
          index > -1 && this.selectAllListBackup.splice(index, 1);
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
     * @function editResource
     * @description 编辑资源时触发的方法，会跳转对应的申请页面
     * @param {String} id
     * @param {String} name
     * @returns {void}
     */
    editResource(id, name, resourceContent) {
      this.applyListId = id;
      switch (name) {
        case 'server': {
          this.editCloudHostShow = true;
          let { newNormName, oldNormName } = resourceContent;
          {
            let oldNorm = oldNormName.match(/\d+/g);
            oldNorm.forEach((item, index) => {
              oldNorm[index] = +item;
            });
            let [cpu, memory, storage] = oldNorm;
            this.imageInfo = {
              cpu,
              memory,
              storage
            };
          }
          {
            let newNorm = newNormName.match(/\d+/g);
            newNorm.forEach((item, index) => {
              newNorm[index] = +item;
            });
            let [cpu, memory, disk] = newNorm;
            this.fixedParam = {
              cpu,
              memory,
              disk
            };
          }
          break;
        }
        case 'volume': {
          let { newVolumeSize, oldVolumeSize, volumeName } = resourceContent;
          this.minVolumeSize = +/\d+/g.exec(oldVolumeSize)[0];
          this.getVolumeNormHttp(() => {
            this.editCloudDiskShow = true;
            this.volumeSize = +/\d+/g.exec(newVolumeSize)[0];
            this.volumeName = volumeName;
          });
          break;
        }
        case 'powerVM': {
          this.eidtPowerHostShow = true;
          let {
            oldCpu,
            oldMemory,
            oldVcpu,
            cpu,
            memory,
            vcpu,
            name,
            serverId,
            flavorId
          } = resourceContent;
          this.powerHostName = name;
          this.serverId = serverId;
          this.flavorId = flavorId;
          this.powerEditSpec = Object.assign(this.powerEditSpec, {
            cpu: oldCpu.toString(),
            vcpu: oldVcpu.toString(),
            memory: oldMemory.toString()
          });
          this.newPowerEditSpec = Object.assign(this.newPowerEditSpec, {
            cpu: cpu.toString(),
            vcpu: vcpu.toString(),
            memory: memory.toString()
          });
          break;
        }
        case 'powerVolume': {
          this.editPowerVolumeShow = true;
          let { size, name, oldSize, freeSize } = resourceContent;
          this.formValidate = Object.assign(this.formValidate, { size, name });
          this.maxPowerVolumeSize = freeSize;
          this.minPowerVolumeSize = oldSize;
          break;
        }
        default:
          break;
      }
    },
    /**
     * @function editCloudHostShow
     * @description 编辑云主机规格时，确认变更后触发的方法
     * @returns {void}
     */
    confirmEditCloudHost() {
      this.$loading.show();
      let { cpu, memory, storage } = this.serverNorm;
      this.$http({
        url: `serverApply/update/flavor/${this.applyListId}/${cpu}*${memory}*${storage}`,
        method: 'POST'
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.getApplyListHttp();
        } else if (data.code === 700) {
          this.$Notice.warning({
            desc: data.message
          });
        }
      });
    },
    /**
     * @function changeSpecification
     * @description 点击选中规格所触发的方法
     * @param {Object} option
     * @param {String} option.cpu     - Cpu
     * @param {String} option.memory  - 内存
     * @param {String} option.storage - 存储
     * @returns {void}
     */
    changeSpecification({ cpu, memory, storage }) {
      this.serverNorm = { cpu, memory, storage };
    },
    /**
     * @function confirmEditCloudDisk
     * @description 确认修改容量是触发的方法
     * @returns {void}
     */
    confirmEditCloudDisk() {
      this.$loading.show();
      this.$http({
        url: `serverApply/update/volumeSize/${this.applyListId}/${this.volumeSize}`,
        method: 'POST'
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.getApplyListHttp();
        } else if (data.code === 700) {
          this.$Notice.warning({
            desc: data.message
          });
        }
      });
    },
    /**
     * @function getVolumeNormHttp
     * @description 获取硬盘容量的列表
     * @param {Function} callback
     * @returns {void}
     */
    getVolumeNormHttp(callback) {
      this.$loading.show();
      this.$http({
        url: 'volumeNorm/Volume',
        method: 'GET'
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status && data.data.length > 0) {
          this.volumeSizeList = [];
          data.data.forEach(item => {
            this.volumeSizeList.push(+item.volumeAdvSpaceSize);
          });
          this.volumeSizeList = this.volumeSizeList.filter(item => item >= this.minVolumeSize);
          callback();
        } else {
          this.volumeSizeList = [];
        }
      });
    },
    /**
     * @function confirmEditPowerHost
     * @description 确认修改Power虚拟机规格触发的方法
     * @param {Function} callback
     * @returns {void}
     */
    confirmEditPowerHost(callback) {
      let { $refs } = this.$refs.changePowerHostForm;
      $refs.formValidate.validate(valid => {
        if (valid) {
          callback();
          this.$loading.show();
          let { cpu, expectSpec, memory, vcpu } = $refs.formValidate.model;
          this.$http({
            url: 'power/server/update/norm',
            method: 'POST',
            data: {
              applyListId: this.applyListId,
              serverId: this.serverId,
              cpu: +cpu,
              vcpu: +vcpu,
              memory: +memory,
              flavorId: expectSpec
            }
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                desc: data.message
              });
              this.getApplyListHttp();
            } else if (data.code === 700) {
              this.$Notice.warning({
                desc: data.message
              });
            }
          });
        } else {
          this.$Notice.warning({
            desc: '表单校验未通过'
          });
        }
      });
    },
    /**
     * @function confirmEditPowerVolume
     * @description power硬盘编辑容量提交时触发的方法
     * @param {Function} callback
     * @returns {void}
     */
    confirmEditPowerVolume(callback) {
      this.$refs.formValidate.validate(valida => {
        if (valida) {
          this.$loading.show();
          this.$http({
            url: `power/volume/expand/applylist/${this.applyListId}/${this.formValidate.size}`,
            method: 'POST'
          }).then(({ data }) => {
            this.$loading.hide();
            callback();
            if (data.status) {
              this.$Notice.success({
                desc: data.message
              });
              this.getApplyListHttp();
            } else if (data.code === 700) {
              this.$Notice.warning({
                desc: data.message
              });
            }
          });
        }
      });
    },
    /**
     * @function changePowerVolumeSize
     * @description 硬盘容量发生变化时触发的方法
     * @returns {void}
     */
    changePowerVolumeSize() {
      if (this.formValidate.size < this.minPowerVolumeSize) {
        this.formValidate.size = this.minPowerVolumeSize;
      }
    },
    /**
     * @function resourceOk
     * @description 资源预检完毕点击提交订单触发的方法
     * @returns {void}
     */
    resourceOk() {
      this.$loading.show();
      let userId = this.$store.state.login.userId; //获取当前用户id
      this.$http({
        url: 'changeList/submit',
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
    ['serverColumn', 'volumeColumn', 'powerVMColumn', 'powerVolumeColumn'].forEach(item => {
      this[item] = orderList.filterTableColumn('CHANGE', item, this[item]);
    });
    this.getApplyListHttp();
  }
};
</script>

<style lang="less" scoped>
@import '../less/index.less';
.change-list {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
}
</style>
