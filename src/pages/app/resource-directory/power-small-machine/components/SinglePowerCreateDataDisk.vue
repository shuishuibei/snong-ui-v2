<!--
 * @Description Power虚拟机基本申请创建数据盘页面
 * @Author ys1983/张睿博
 * @Date 2019-08-26 09:36:07
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-22 11:45:40
 -->
<template>
  <i-modal
    v-model="show"
    :width="900"
    @on-visible-change="changeVisible"
    :mask-closable="false">
    <template #header>
      <h3c-title
        title="新增数据盘"
        :is-modal="true"
        :style-set="{'border-bottom': 'none'}">
      </h3c-title>
    </template>
    <i-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      style="padding:0 0 0 30px"
      :label-width="100">
      <i-form-item
        label="硬盘数量"
        prop="count"
        required>
        <i-input-number
          :max="maxDiskNums"
          :min="1"
          v-model="formValidate.count">
        </i-input-number>
      </i-form-item>
      <i-form-item
        label="共享"
        prop="multiattach"
        required>
        <i-radio-group v-model="formValidate.multiattach">
          <i-radio :label="1">是</i-radio>
          <i-radio :label="0">否</i-radio>
        </i-radio-group>
      </i-form-item>
      <i-form-item
        label="硬盘容量"
        prop="size">
        <i-input-number
          :max="maxDiskSize"
          :min="1"
          @on-change="changeDiskSize"
          v-model="formValidate.size">
        </i-input-number>
        <span>GB</span>
        <span class="cds-margin-left-10 cds-color-999">只能输入整数，且最大容量不得大于单块硬盘的最大设置容量</span>
      </i-form-item>
      <i-form-item
        label="存储模板"
        prop="memoryTemplateValue">
        <i-select
          style="width:300px;"
          @on-change="changeMemoryTemplate"
          v-model="formValidate.memoryTemplateValue">
          <i-option
            v-for="item in memoryTemplateData"
            :key="item.id"
            :value="item.id">
            {{item.name}}
          </i-option>
        </i-select>
      </i-form-item>
      <i-table
        :columns="memoryTemplateConfig.column"
        :data="memoryTemplateConfig.data"
        :loading="memoryTemplateConfig.loading">
      </i-table>
    </i-form>
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
import { required } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'SinglePowerCreateDataDisk',
  components: {
    'h3c-title': H3cTitle
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    imageVolume: {
      type: Array,
      required: true
    },
    maxDiskNums: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      formValidate: {
        count: 1,
        multiattach: 1,
        size: 1,
        memoryTemplateValue: '',
        mountVmName: '',
        mount: '',
        volumeType: ''
      },
      ruleValidate: {
        size: {
          required: true,
          validator(rule, value, callback) {
            callback();
          },
          trigger: 'blur'
        },
        memoryTemplateValue: required({ message: '存储模板不能为空' })
      },
      show: false,
      memoryTemplateData: [], // 存储模板数据
      memoryTemplateConfig: {
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
            title: '存储器名称',
            key: 'storage',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.storage
                  }
                },
                params.row.storage
              );
            }
          },
          {
            title: '存储池名称',
            key: 'pool',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.pool
                  }
                },
                params.row.pool
              );
            }
          },
          {
            title: '存储池剩余容量（GB）',
            key: 'freeSize',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.freeSize
                  }
                },
                params.row.freeSize
              );
            }
          },
          {
            title: '存储池总容量（GB）',
            key: 'totalSize',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.totalSize
                  }
                },
                params.row.totalSize
              );
            }
          }
        ],
        data: [],
        loading: true
      }
    };
  },
  methods: {
    /**
     * @function changeVisible
     * @description 弹出框显示的状态发生变化触发的方法
     * @param {Boolean} isShow
     * @returns {void}
     */
    changeVisible(isShow) {
      this.formValidate.count = 1;
      this.formValidate.size = 1;
      this.formValidate.multiattach = 1;
      this.$emit('e-show', isShow);
    },
    /**
     * @function handleSubmit
     * @description 点击确认提交表单的方法
     * @returns {void}
     */
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.$emit('e-add-volume', { ...this.formValidate });
          this.changeVisible(false);
        }
      });
    },
    /**
     * @function getVolumeTemplateHttp
     * @description 获取存储模板列表数据
     * @returns {void}
     */
    getVolumeTemplateHttp() {
      this.$http({
        url: 'power/volume/type/data/list',
        method: 'POST',
        data: {
          imageVolume: this.imageVolume
        }
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.memoryTemplateData = data.data;
          this.formValidate.memoryTemplateValue = data.data[0].id;
          this.changeMemoryTemplate(data.data[0].id);
        } else {
          this.memoryTemplateData = [];
          this.formValidate.memoryTemplateValue = '';
          this.memoryTemplateConfig.data = [];
          this.formValidate.volumeType = {};
        }
      });
    },
    /**
     * @function changeMemoryTemplate
     * @description 存储模板值改变时触发的方法
     * @param {String} id
     * @returns {void}
     */
    changeMemoryTemplate(id) {
      this.memoryTemplateConfig.loading = true;
      this.$http({
        url: 'power/volume/type/list',
        method: 'GET',
        params: {
          id
        }
      }).then(({ data }) => {
        this.memoryTemplateConfig.loading = false;
        if (data.status && data.data.id !== '') {
          this.memoryTemplateConfig.data = [data.data];
          this.formValidate.volumeType = data.data;
        } else {
          this.memoryTemplateConfig.data = [];
          this.formValidate.volumeType = {};
        }
      });
    },
    /**
     * @function changeDiskSize
     * @description 硬盘容量发生变化时触发的方法
     * @param {Number} size
     * @returns {void}
     */
    changeDiskSize(size) {
      this.$nextTick(() => {
        if (size) {
          !Number.isInteger(size) ? (this.formValidate.size = parseInt(size)) : null;
        } else {
          this.formValidate.size = 1;
        }
      });
    }
  },
  computed: {
    maxDiskSize() {
      let maxSize = Math.floor(this.formValidate.volumeType.freeSize / this.formValidate.count);
      return maxSize;
    }
  },
  watch: {
    isShow(newValue) {
      this.show = newValue;
      newValue && this.getVolumeTemplateHttp();
    },
    maxDiskSize(newValue) {
      if (this.formValidate.size > newValue) {
        this.formValidate.size = newValue;
      }
    }
  }
};
</script>
