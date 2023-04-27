<!--
 * @Description 修改power虚拟机的提交表单
 * @Author ys1983/张睿博
 * @Date 2019-09-10 16:07:09
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:36:07
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item label="Power虚拟机名称：">
      <i-input
        :value="formValidate.name"
        disabled
        style="width:300px">
      </i-input>
    </i-form-item>
    <i-form-item label="当前规格：">
      <i-input
        :value="currentSpec"
        disabled
        style="width:300px">
      </i-input>
    </i-form-item>
    <i-form-item
      label="期望规格："
      prop="expectSpec">
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
    <i-form-item
      label="处理单元(核数)："
      prop="cpu">
      <i-input
        v-model="formValidate.cpu"
        style="width:300px">
      </i-input>
      <span class="color-ff732d">{{`(${cpuScope.min_units}~${cpuScope.max_units})`}}</span>
    </i-form-item>
    <i-form-item
      label="VCPU(个数)："
      prop="vcpu">
      <i-input
        v-model="formValidate.vcpu"
        style="width:300px">
      </i-input>
      <span class="color-ff732d">{{`(${vcpuScope.min_vcpus}~${vcpuScope.max_vcpus})`}}</span>
    </i-form-item>
    <i-form-item
      label="内存(GB)："
      prop="memory">
      <i-input
        v-model="formValidate.memory"
        style="width:300px">
      </i-input>
      <span class="color-ff732d">{{`(${ramScope.min_memory}~${ramScope.max_memory})`}}</span>
    </i-form-item>
  </i-form>
</template>

<script>
import { required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'ChangePowerHost',
  props: {
    name: {
      type: String,
      required: true
    },
    powerEditSpec: {
      type: Object,
      required: true
    },
    flavorId: {
      type: String,
      required: true
    },
    newPowerEditSpec: {
      type: Object,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formValidate: {
        name: '',
        cpu: '0',
        vcpu: '0',
        memory: '0',
        expectSpec: ''
      },
      ruleValidate: {
        expectSpec: required({ message: '期望规格不能为空', trigger: 'change' }),
        cpu: [
          required({ message: '处理单元输入不能为空' }),
          {
            validator: (rule, value, callback) => {
              if (/^((\d+)|(\d+\.\d{1}))$/.test(value)) {
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
              if (/^((\d+)|(\d+\.\d{1}))$/.test(value)) {
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
          required({ message: 'VCPU输入不能为空' }),
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
          required({ message: '内存输入不能为空' }),
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
      specList: [],
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
      }
    };
  },
  methods: {
    /**
     * @function changeSpec
     * @description 期望规格改变的时候触发的方法
     * @param {String} id
     * @returns {void}
     */
    changeSpec(id) {
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
          let index;
          index = this.specList.findIndex(item => item.id === this.flavorId);
          let {
            min_units,
            max_units,
            min_memory,
            max_memory,
            min_vcpus,
            max_vcpus
          } = this.specList[index];
          this.formValidate.expectSpec = this.flavorId;
          this.formValidate = Object.assign(this.formValidate, this.newPowerEditSpec);
          this.cpuScope = { min_units, max_units };
          this.vcpuScope = { min_vcpus, max_vcpus };
          this.ramScope = { min_memory, max_memory };
        } else {
          this.specList = [];
          this.formValidate.expectSpec = '';
          this.cpuScope = { ...this.cpuScope, ...{ min_units: 0, max_units: 0 } };
          this.ramScope = { ...this.ramScope, ...{ min_memory: 0, max_memory: 0 } };
          this.vcpuScope = { ...this.vcpuScope, ...{ min_vcpus: 0, max_vcpus: 0 } };
        }
      });
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
    'formValidate.cpu'(newValue) {
      this.$refs.formValidate.validateField('vcpu');
    },
    'formValidate.vcpu'(newValue) {
      this.$refs.formValidate.validateField('cpu');
    },
    value(newValue) {
      newValue && this.getSpecificationsHttp();
    },
    name(newValue) {
      this.formValidate.name = newValue;
    }
  }
};
</script>

<style lang="less" scoped>
.color-ff732d {
  color: #ff732d;
}
</style>
