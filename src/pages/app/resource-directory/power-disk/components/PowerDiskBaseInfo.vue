<!--
 * @Description Power硬盘基本信息页面
 * @Author ys1983/张睿博
 * @Date 2019-07-29 11:37:55
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:47:30
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150">
    <i-form-item
      label="Power硬盘名称"
      prop="name">
      <i-input
        placeholder="请输入Power硬盘名称"
        style="width:300px;"
        :maxlength="32"
        v-model="formValidate.name">
      </i-input>
      <span class="cds-tip">只能由字母、数字、短横线组成，且只能以字母开头，字数不超过32</span>
    </i-form-item>
    <i-form-item
      label="共享"
      prop="multiattach">
      <i-radio-group v-model="formValidate.multiattach">
        <i-radio label="true">是</i-radio>
        <i-radio label="false">否</i-radio>
      </i-radio-group>
    </i-form-item>
    <i-form-item
      label="Power硬盘数量"
      style="display: inline-block"
      required>
      <i-input-number
        :max="3"
        :min="1"
        :step="1"
        :disabled="countDisabled"
        :editable="false"
        @on-change="changeVolumeCount"
        v-model="formValidate.count">
      </i-input-number>
    </i-form-item>
    <i-form-item
      label="挂载虚拟机"
      :label-width="150"
      prop="mount">
      <i-select
        style="width:300px;"
        label-in-value
        @on-change="changeMountVirtual"
        v-model="formValidate.mount">
        <i-option
          v-for="item in virtualHost"
          :value="item.id"
          :key="item.id">
          {{item.name}}
        </i-option>
      </i-select>
    </i-form-item>
    <i-form-item
      label="Power硬盘容量"
      prop="size"
      :label-width="150"
      :show-message="false"
      required>
      <i-input-number
        :max-siz="maxSize"
        :min="1"
        :max="maxSize"
        @on-change="changeVolumeCapacity"
        v-model="formValidate.size">
      </i-input-number>
      <span class="cds-tip">只能输入数字，且最大容量不得大于单块硬盘的最大设置容量</span>
    </i-form-item>
  </i-form>
</template>

<script>
import { name, required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'PowerDiskBaseInfo',
  props: {
    theRemainingCapacity: {
      type: Number,
      required: true
    },
    resourceContent: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      maxSize: 1, // 规定硬盘容量规格
      formValidate: {
        name: '', // power硬盘的名称
        multiattach: 'true', // 是否共享
        count: 1, // 硬盘数量
        mount: '', // 挂载虚拟机id
        mountVmName: '', //挂载虚拟机名称
        size: 1 //硬盘容量规格
      },
      ruleValidate: {
        name: [
          required({ message: '硬盘名称不能为空' }),
          name({ message: '只能由字母、数字、短横线组成，且只能以字母开头' })
        ],
        multiattach: required({ message: '共享不能为空' }),
        mount: required({ message: '挂载虚拟机不能为空' })
      },
      virtualHost: [],
      countDisabled: false
    };
  },
  methods: {
    /**
     * @function getMountVirtualHttp
     * @description 获取挂载虚拟机的方法
     * @param {Boolean} is
     * @returns {void}
     */
    getMountVirtualHttp(is = false) {
      this.$http({
        url: 'power/server/list',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.virtualHost = data.data;
          let index = is ? data.data.findIndex(item => item.id === this.resourceContent.mount) : 0;
          let { id, name } = this.virtualHost[index];
          this.formValidate.mount = id;
          this.formValidate.mountVmName = name;
          this.$emit('e-mount', { mount: id, is });
        } else {
          this.virtualHost = [];
          this.formValidate.mount = '';
          this.formValidate.mountVmName = '';
          this.$emit('e-mount', { mount: '', is });
        }
      });
    },
    /**
     * @function changeMountVirtual
     * @description 当挂载虚拟机改变时触发的方法
     * @param {String} value
     * @param {String} label
     * @returns {void}
     */
    changeMountVirtual({ value, label }) {
      this.formValidate.mount = value;
      this.formValidate.mountVmName = label;
      this.$emit('e-mount', { mount: value, is: false });
      this.formValidate.size = 1;
    },
    /**
     * @function changeVolumeCount
     * @description 当数量发生变化的时候计算最大的可用容量
     * @param {Number} count
     * @returns {void}
     */
    changeVolumeCount(count) {
      this.maxSize = Math.floor(this.theRemainingCapacity / Number(count));
      this.formValidate.size > this.maxSize ? (this.formValidate.size = this.maxSize) : null;
    },
    /**
     * @function changeVolumeCapacity
     * @description 当硬盘容量发生改变的时候触发的方法
     * @param {Number} capacity
     * @returns {void}
     */
    changeVolumeCapacity(capacity) {
      if (capacity) {
        !Number.isInteger(capacity) &&
          this.$nextTick(() => {
            this.formValidate.size = parseInt(capacity);
          });
      } else {
        !Number.isInteger(capacity) &&
          this.$nextTick(() => {
            this.formValidate.size = 1;
          });
      }
    }
  },
  mounted() {
    !this.$route.query.hasOwnProperty('id') && this.getMountVirtualHttp();
  },
  watch: {
    theRemainingCapacity(newValue) {
      if (newValue > 1) {
        this.countDisabled = false;
        this.maxSize = Math.floor(newValue / this.formValidate.count);
      } else {
        this.countDisabled = true;
        this.formValidate.count = 1;
        this.formValidate.size = 1;
      }
    },
    resourceContent(newValue) {
      if (newValue.mount) {
        let { name, multiattach, count, size } = newValue;
        this.formValidate.name = name;
        this.formValidate.multiattach = String(multiattach);
        this.formValidate.count = count;
        this.formValidate.size = size;
        this.getMountVirtualHttp(true);
      }
    }
  }
};
</script>
