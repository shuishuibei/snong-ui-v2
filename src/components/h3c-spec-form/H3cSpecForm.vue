<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-08-02 17:25:05
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-26 14:36:38
 -->
<template>
  <i-form
    ref="formValidateForm"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="90">
    <i-form-item
      label="CPU"
      prop="cpu">
      <i-radio-group
        v-model="formValidate.cpu"
        type="button"
        @on-change="changeCpu"
        :key="cpuKey">
        <i-radio :label="item.value" v-for="item in formValidate.cpuArr" :key="item.value">{{item.value}}核</i-radio>
      </i-radio-group>
    </i-form-item>

    <i-form-item
      label="内存"
      prop="memory">
      <i-radio-group
        v-model="formValidate.memory"
        type="button"
        @on-change="changeMemory"
        :key="memoryKey">
        <i-radio
          :label="item.value"
          :key="index"
          v-for="(item, index) in formValidate.memoryArr"
          :disabled="item.disabled">
          {{item.value}}G
        </i-radio>
      </i-radio-group>
    </i-form-item>

    <i-form-item
      label="存储类型"
      prop="storageType"
      v-if="showStorageType">
      <i-select
        v-model="formValidate.storageType"
        style="width:300px;">
        <i-option
          v-for="(item, index) in formValidate.stoTypeArr"
          :value="item"
          :key="index">
          {{item}}
        </i-option>
      </i-select>
    </i-form-item>

    <i-form-item
      label="系统盘"
      prop="storage"
      style="margin-top: 23px;"
      v-if="storageShow">
      <h3c-array-silder
        :key="diskKey"
        style="width:500px"
        :vertical-line-style="{backgroundColor: '#fff'}"
        :slider-button-style="{backgroundColor: '#3399ff'}"
        v-model="formValidate.storage"
        :data="sliderData"
        :disabled="disable">
      </h3c-array-silder>
    </i-form-item>
  </i-form>
</template>

<script>
import H3cArraySlider from '@/components/h3c-slider/H3cArraySlider.vue'; // 引入滑块组件

export default {
  name: 'H3cSpecForm',
  components: {
    'h3c-array-silder': H3cArraySlider
  },
  props: {
    /*传入具体的cpu、memory、disk值*/
    fixedParam: {
      type: Object,
      default: () => {
        return {};
      }
    },
    minCpu: {
      type: Number
    },
    minRam: {
      type: Number
    },
    minDisk: {
      type: Number
    },
    // api接口1
    specSearchUrl: {
      type: String,
      default: '/serverNorm'
    },
    // api接口2
    getSpecRangUrl: {
      type: String,
      default: '/serverNorm/serverFlavor'
    },
    // 是否显示存储类型
    showStorageType: {
      type: Boolean,
      default: false
    },
    storageShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cpuKey: '',
      memoryKey: '',
      diskKey: '',
      formValidate: {
        cpu: '',
        cpuArr: [],
        memory: '',
        memoryArr: [],
        storage: 0,
        storageType: '',
        stoTypeArr: []
      },
      sliderData: [],
      ruleValidate: {
        cpu: [
          {
            type: 'number',
            required: true,
            trigger: 'change'
          }
        ],
        memory: [
          {
            type: 'number',
            required: true,
            trigger: 'change'
          }
        ],
        storage: [
          {
            type: 'number',
            required: true,
            trigger: 'change'
          }
        ],
        storageType: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      },
      disable: false
    };
  },
  methods: {
    resetData() {
      this.formValidate = {
        cpu: '',
        cpuArr: [],
        memory: '',
        memoryArr: [],
        storage: 0,
        storageType: '',
        stoTypeArr: []
      };
    },
    /*给内存、存储添加是否可选标识*/
    initJudgment(arr) {
      return arr.map(val => {
        return {
          value: val,
          disabled: true
        };
      });
    },
    addJudgment(arr1, arr2) {
      arr1.forEach(function(val) {
        let value = val.value;
        /*在可选范围内*/
        arr2.includes(value) ? (val.disabled = false) : (val.disabled = true);
      });
    },
    setSpecRang(minCpu, minMemory, minDisk) {
      return new Promise(
        function(resolve, reject) {
          this.$http
            .get(`${this.specSearchUrl}/${minCpu}/${minMemory}/${minDisk}`)
            .then(({ data }) => {
              if (data.status) {
                /*获取总范围*/
                let { cpuRange, memoryRange, diskRange, typeRange } = data.data;
                this.formValidate.cpuArr = this.initJudgment(cpuRange);
                this.formValidate.memoryArr = this.initJudgment(memoryRange);
                this.formValidate.diskArr = this.initJudgment(diskRange);
                this.formValidate.stoTypeArr = typeRange;
                if (this.formValidate.cpuArr.length === 0) {
                  this.$loading.hide();
                  return;
                }
                // 默认选cpu第一项
                this.formValidate.cpu = this.formValidate.cpuArr[0].value;
                /*传入的参数里有cpu项*/
                if (
                  Object.prototype.hasOwnProperty.call(this.fixedParam, 'cpu') &&
                  this.fixedParam.cpu !== 0
                ) {
                  this.formValidate.cpu = this.fixedParam.cpu;
                }
                this.cpuKey = new Date() + Math.random();
                this.$http
                  .post(this.getSpecRangUrl, {
                    cpuType: 'cpu',
                    cpuValue: this.formValidate.cpu,
                    minCpu: minCpu,
                    minRam: minMemory,
                    minDisk: minDisk
                  })
                  .then(({ data }) => {
                    if (data.status) {
                      /*获取最大范围*/
                      let { memoryRange, diskRange, typeRange } = data.data;
                      /*开始渲染，获取可选的范围*/
                      this.addJudgment(this.formValidate.memoryArr, memoryRange);
                      this.addJudgment(this.formValidate.diskArr, diskRange);
                      this.formValidate.stoTypeArr = typeRange;
                      this.formValidate.storageType = typeRange[0];
                      /*默认选memory第一项*/
                      this.formValidate.memory = this.formValidate.memoryArr[0].value;
                      this.changeMemory(this.formValidate.memory, false);
                      /*传入的参数里有memory项*/
                      if (
                        Object.prototype.hasOwnProperty.call(this.fixedParam, 'memory') &&
                        this.fixedParam.memory !== 0
                      ) {
                        this.formValidate.memory = this.fixedParam.memory;
                        this.changeMemory(this.formValidate.memory, true);
                      }
                      this.memoryKey = new Date() + Math.random();
                      if (diskRange.length === 1) {
                        this.disable = true;
                        diskRange.unshift(0);
                      } else {
                        this.disable = false;
                      }
                      /* this.sliderData = diskRange;
                    this.formValidate.storage = diskRange[0]===0?diskRange[1]:diskRange[0];*/
                      /*传入的参数里有disk项*/
                      this.diskKey = new Date() + Math.random();
                      this.$loading.hide();
                      resolve(data);
                    } else {
                      reject();
                    }
                  });
              }
            });
        }.bind(this)
      );
    },
    changeCpu(cpu) {
      this.$nextTick(() => {
        this.$http
          .post(this.getSpecRangUrl, {
            cpuType: 'cpu',
            cpuValue: cpu,
            minCpu: this.imageInfo.cpu,
            minRam: this.imageInfo.memory,
            minDisk: this.imageInfo.storage
          })
          .then(({ data }) => {
            if (data.status) {
              // 获取最大范围
              let { memoryRange, diskRange, typeRange } = data.data;
              // 开始渲染，获取可选的范围
              this.addJudgment(this.formValidate.memoryArr, memoryRange);
              this.addJudgment(this.formValidate.diskArr, diskRange);
              this.formValidate.stoTypeArr = typeRange;
              this.formValidate.storageType = typeRange[0];
              let array = this.formValidate.memoryArr;
              for (let i = 0; i < array.length; i++) {
                if (!array[i].disabled) {
                  this.formValidate.memory = array[i].value;
                  break;
                }
              }
              this.changeMemory(this.formValidate.memory, false);
              if (diskRange.length === 1) {
                this.disable = true;
                diskRange.unshift(0);
              } else {
                this.disable = false;
              }
              this.sliderData = diskRange;
              this.formValidate.storage = diskRange[0] === 0 ? diskRange[1] : diskRange[0];
            }
          });
      });
    },
    changeMemory(memory, bool) {
      this.$nextTick(() => {
        this.$http
          .post(this.getSpecRangUrl, {
            cpuType: 'cpu',
            cpuValue: this.formValidate.cpu,
            memoryType: 'memory',
            memoryValue: memory,
            minCpu: this.imageInfo.cpu,
            minRam: this.imageInfo.memory,
            minDisk: this.imageInfo.storage
          })
          .then(({ data }) => {
            if (data.status) {
              // 获取最大范围
              let { diskRange, typeRange } = data.data;
              // 开始渲染，获取可选的范围
              this.addJudgment(this.formValidate.diskArr, diskRange);
              this.formValidate.stoTypeArr = typeRange;
              this.formValidate.storageType = typeRange[0];
              if (diskRange.length === 1) {
                this.disable = true;
                diskRange.unshift(0);
              } else {
                this.disable = false;
              }
              this.sliderData = diskRange;
              if (
                Object.prototype.hasOwnProperty.call(this.fixedParam, 'disk') &&
                this.fixedParam.disk !== 0 &&
                bool
              ) {
                this.formValidate.storage = this.fixedParam.disk;
              } else {
                this.formValidate.storage = diskRange[0] === 0 ? diskRange[1] : diskRange[0];
              }
            }
          });
      });
    }
  },
  mounted() {
    this.resetData();
    this.setSpecRang(this.minCpu, this.minRam, this.minDisk);
  },
  computed: {
    imageInfo() {
      return {
        cpu: this.minCpu,
        memory: this.minRam,
        storage: this.minDisk
      };
    }
  },
  watch: {
    imageInfo: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.setSpecRang(newVal.cpu, newVal.memory, newVal.storage);
      }
    },
    formValidate: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.$emit('changeFormData', newVal);
      }
    },
    fixedParam: {
      deep: true,
      handler(newVal, oldVal) {
        let len1 = Object.keys(newVal).length,
          len2 = Object.keys(oldVal).length;
        if (len1 !== 0 || len2 !== 0) {
          this.setSpecRang(this.minCpu, this.minRam, this.minDisk);
        }
      }
    }
  }
};
</script>

<style scoped>
.ivu-radio-group-button .ivu-radio-wrapper-checked {
  background: #3399ff;
  border-color: #3399ff;
  color: #fff;
  box-shadow: none;
}

.ivu-radio-group-button .ivu-radio-wrapper {
  border: 1px solid #3399ff;
}

.ivu-radio-group-button .ivu-radio-wrapper-disabled {
  border-color: #dddee1;
}
</style>
