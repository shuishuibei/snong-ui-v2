<!--
 * @Description: power虚拟机更改规格
 * @Author: lys1626
 * @Date: 2019-09-11 09:35:25
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:20:45
 -->
<template>
  <div>
    <i-modal
      v-model="show"
      class="vertical-center-modal"
      :width="670"
      class-name="modalZindex"
      @on-visible-change="statusChange"
      :mask-closable="false">
      <template #header>
        <h3c-title
          title="变更规格"
          :is-modal="true"
          :style-set="{'border-bottom': 'none'}">
        </h3c-title>
      </template>
      <div class="info-content">
        <i class="iconfont icon-tixingtishi"></i>
        <div class="content-con">跨级别修改power虚拟机规格，需保证变更下发时，虚拟机处于关机状态。</div>
      </div>
      <i-form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="120">
        <i-form-item label="power虚拟机名称">
          <i-input :value="formValidate.name" disabled style="width:300px" />
        </i-form-item>
        <i-form-item label="当前规格">
          <i-input :value="currentSpec" disabled style="width:300px" />
        </i-form-item>
        <i-form-item label="期望规格" prop="expectSpec">
          <i-select
            v-model="formValidate.expectSpec"
            @on-change="changeSpec"
            style="width:300px">
            <i-option
              v-for="item in specList"
              :value="item.id"
              :key="item.id">
              {{item.name}}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="处理单元(核数)" prop="cpu">
          <i-input v-model="formValidate.cpu" style="width: 300px" />
          <span class="color-ff6600">{{`(${cpuScope.min_units}~${cpuScope.max_units})`}}</span>
        </i-form-item>
        <i-form-item label="VCPU(个数)" prop="vcpu">
          <i-input v-model="formValidate.vcpu" style="width: 300px" />
          <span class="color-ff6600">{{`(${vcpuScope.min_vcpus}~${vcpuScope.max_vcpus})`}}</span>
        </i-form-item>
        <i-form-item label="内存(GB)" prop="memory">
          <i-input v-model="formValidate.memory" style="width: 300px" />
          <span class="color-ff6600">{{`(${ramScope.min_memory}~${ramScope.max_memory})`}}</span>
        </i-form-item>
      </i-form>
      <div slot="footer" style="text-align: center;padding: 15px">
        <i-button type="primary" class="save" @click="confirmDeletion()">{{text}}</i-button>
        <i-button class="cancel" @click="handleReset()" style="margin-left:20px">取 消</i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件

export default {
  name: 'ChangesPowerHostEdit',
  components: {
    'h3c-title': H3cTitle
  },
  props: {
    applyListId: {
      type: String,
      default: ''
    },
    refresh: {
      type: Function,
      default: () => {}
    },
    name: {
      type: String,
      default: ''
    },
    serverId: {
      type: String,
      default: ''
    },
    powerEditSpec: {
      type: Object,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      default: '确认'
    },
    flavorId: {
      type: String,
      default: ''
    },
    success: {
      type: String,
      default: ''
    },
    warning: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      formValidate: {
        name: '',
        cpu: '0',
        memory: '0',
        vcpu: '0',
        expectSpec: ''
      },
      ruleValidate: {
        name: [
          {
            type: 'string',
            required: true,
            trigger: 'change'
          }
        ],
        expectSpec: {
          required: true,
          message: '期望规格不能为空',
          trigger: 'change'
        },
        cpu: [
          {
            required: true,
            message: '处理单元输入不能为空',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (/^((\d+)|(\d\.\d{1}))$/.test(value)) {
                let { min_units, max_units } = this.cpuScope;
                let units = Number(value);
                if (units >= min_units && units <= max_units) {
                  if (units < Number(this.formValidate.vcpu)) {
                    callback();
                  } else {
                    callback('处理单元的值要小于VCPU的值');
                  }
                } else {
                  callback(`处理单元的值只能大于等于${min_units}并且小于等于${max_units}`);
                }
              } else {
                callback('只能输入数字或小数点1位的值');
              }
            },
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (/^((\d+)|(\d\.\d{1}))$/.test(value)) {
                let { min_units, max_units } = this.cpuScope;
                let units = Number(value);
                if (units >= min_units && units <= max_units) {
                  if (units < Number(this.formValidate.vcpu)) {
                    callback();
                  } else {
                    callback('处理单元的值要小于VCPU的值');
                  }
                } else {
                  callback(`处理单元的值只能大于等于${min_units}并且小于等于${max_units}`);
                }
              } else {
                callback('只能输入数字或小数点1位的值');
              }
            },
            trigger: 'blur'
          }
        ],
        vcpu: [
          {
            required: true,
            message: 'VCPU输入不能为空',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (/^\d+$/.test(value)) {
                let { min_vcpus, max_vcpus } = this.vcpuScope;
                let vcpu = Number(value);
                if (vcpu >= min_vcpus && vcpu <= max_vcpus) {
                  if (vcpu > this.formValidate.cpu) {
                    callback();
                  } else {
                    callback('VCPU的值要大于处理单元的值');
                  }
                } else {
                  callback(`VCPU的值要大于等于${min_vcpus}并且要小于等于${max_vcpus}`);
                }
              } else {
                callback('VCPU只能输入整数');
              }
            },
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (/^\d+$/.test(value)) {
                let { min_vcpus, max_vcpus } = this.vcpuScope;
                let vcpu = Number(value);
                if (vcpu >= min_vcpus && vcpu <= max_vcpus) {
                  if (vcpu > this.formValidate.cpu) {
                    callback();
                  } else {
                    callback('VCPU的值要大于处理单元的值');
                  }
                } else {
                  callback(`VCPU的值要大于等于${min_vcpus}并且要小于等于${max_vcpus}`);
                }
              } else {
                callback('VCPU只能输入整数');
              }
            },
            trigger: 'blur'
          }
        ],
        memory: [
          {
            required: true,
            message: '内存输入不能为空',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (/^\d+$/.test(value)) {
                let { min_memory, max_memory } = this.ramScope;
                let ram = Number(value);
                if (ram >= min_memory && ram <= max_memory) {
                  callback();
                } else {
                  callback(`内存的值要大于等于${min_memory}并且小于等于${max_memory}`);
                }
              } else {
                callback('内存只能输入整数');
              }
            },
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (/^\d+$/.test(value)) {
                let { min_memory, max_memory } = this.ramScope;
                let ram = Number(value);
                if (ram >= min_memory && ram <= max_memory) {
                  callback();
                } else {
                  callback(`内存的值要大于等于${min_memory}并且小于等于${max_memory}`);
                }
              } else {
                callback('内存只能输入整数');
              }
            },
            trigger: 'blur'
          }
        ]
      },
      cpuScope: {
        min_units: 0,
        max_units: 0
      },
      ramScope: {
        min_memory: 0,
        max_memory: 0
      },
      vcpuScope: {
        min_vcpus: 0,
        max_vcpus: 0
      },
      specList: [] // 获取的规格列表
    };
  },
  methods: {
    statusChange(Bol) {
      if (!Bol) {
        this.$refs['formValidate'].resetFields();
      }
      this.$emit('input', Bol);
    },
    editHttp() {
      this.$loading.show();
      this.$http({
        url: 'power/server/update/norm/',
        method: 'POST',
        data: {
          applyListId: this.applyListId,
          cpu: +this.formValidate.cpu,
          memory: +this.formValidate.memory,
          serverId: this.serverId,
          vcpu: +this.formValidate.vcpu,
          flavorId: this.formValidate.expectSpec
        }
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({ desc: this.success });
          this.statusChange(false);
          this.refresh();
        } else {
          this.statusChange(false);
        }
      });
    },
    confirmDeletion() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          this.editHttp();
        } else {
          this.$Notice.warning('数据不符合要求请检查后再提交');
        }
      });
    },
    handleReset() {
      this.$refs['formValidate'].resetFields();
      this.statusChange(false);
    },
    /**
     * @function getSpecificationsHttp
     * @description 获取规格参数列表
     * @returns {void}
     */
    getSpecificationsHttp() {
      this.$loading.show();
      this.$http({
        url: 'power/server/changeFlavor/list',
        method: 'GET'
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status && data.data.length > 0) {
          this.specList = data.data;
          let index = this.flavorId
            ? this.specList.findIndex(item => item.id === this.flavorId)
            : 0;
          let {
            min_units,
            max_units,
            min_memory,
            max_memory,
            min_vcpus,
            max_vcpus,
            units,
            vcpus,
            memory,
            id
          } = this.specList[index];
          this.formValidate.expectSpec = id;
          this.formValidate.cpu = units.toString();
          this.formValidate.vcpu = vcpus.toString();
          this.formValidate.memory = memory.toString();
          this.cpuScope = { min_units, max_units };
          this.vcpuScope = { min_vcpus, max_vcpus };
          this.ramScope = { min_memory, max_memory };
        } else {
          this.specList = [];
          this.formValidate.expectSpec = '';
        }
      });
    },
    /**
     * @function changeSpec
     * @description 期望规格改变的时候触发的方法
     * @param id {String}
     * @returns {void}
     */
    changeSpec(id) {
      if (id) {
        let {
          min_units,
          max_units,
          min_memory,
          max_memory,
          min_vcpus,
          max_vcpus,
          units,
          vcpus,
          memory
        } = this.specList.find(item => item.id === id);
        this.cpuScope = { min_units, max_units };
        this.vcpuScope = { min_vcpus, max_vcpus };
        this.ramScope = { min_memory, max_memory };
        this.formValidate.cpu = units.toString();
        this.formValidate.vcpu = vcpus.toString();
        this.formValidate.memory = memory.toString();
      }
    }
  },
  computed: {
    /**
     * @function currentSpec
     * @description 组个当前规格的字符串
     * @returns {String}
     */
    currentSpec() {
      let { cpu, memory, vcpu } = this.powerEditSpec;
      return `${cpu} Unit，${vcpu} vCPU， ${memory} GB`;
    }
  },
  watch: {
    value(newValue) {
      this.show = newValue;
      newValue && this.getSpecificationsHttp();
    },
    name(newValue) {
      this.formValidate.name = newValue;
    }
  }
};
</script>

<style lang="less" scoped>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}

.modal-text {
  position: relative;
  padding-left: 10px;

  &:after {
    position: absolute;
    content: '';
    width: 4px;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #ff0000;
  }
}

.iconfont:not(.header-icon):before {
  font-size: 18px;
}

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

.color-ff6600 {
  color: #ff6600;
}
</style>
<style>
.vertical-center-modal .ivu-input[disabled],
fieldset[disabled] .ivu-input {
  color: #000;
}

.vertical-center-modal .ivu-modal .ivu-form {
  padding: 18px 30px 0 30px;
}
</style>
