<!--
 * @Description: 拓展硬盘容量组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-25 14:58:15
 -->
<template>
  <i-modal v-model="visible" width="600px" :mask-closable="false" :title="title">
    <div>
      <i-row>
        <i-col span="5" style="line-height: 32px;text-align:center">名称</i-col>
        <i-col span="14">
          <i-input v-model="diskName" disabled></i-input>
        </i-col>
      </i-row>
      <br />
      <br />
      <i-row>
        <i-col span="5" style="line-height: 25px;text-align:center">容量(GB)</i-col>
        <i-col span="14">
          <h3c-array-slider
            style="width:350px"
            v-model="size"
            :data="sliderData"
            :slider-button-style="buttonStyle"
            :vertical-line-style="lineStyle"
            slider-tooltip-color="#3399fe"
            @on-change="changeSlider"></h3c-array-slider>
        </i-col>
      </i-row>
      <br>
    </div>
    <div slot="footer">
      <i-button type="primary" @click="submit">确 认</i-button>
      <i-button @click="visible=false">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
import H3cArraySlider from '@/components/h3c-slider/H3cArraySlider.vue';

export default {
  name: 'ExpandDiskModal',
  components: {
    H3cArraySlider
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      diskId: '',
      diskName: '',
      storageType: '',
      visible: false,
      volumeNormRange: {},
      sliderData: [],
      size: 100,
      buttonStyle: {
        backgroundColor: '#3399fe'
      },
      lineStyle: {
        backgroundColor: '#fff'
      }
    };
  },
  methods: {
    /**
     * @description: 扩容硬盘
     * @return: null
     */
    submit() {
      this.$loading.show();
      this.$http.post(`volume/expand/${this.diskId}/${this.size}`).then(({ data }) => {
        if (data.status) {
          this.visible = false;
          this.$Notice.success({ desc: '成功加入申请变更清单!' });
          this.$emit('updateDisks');
        }
        this.$loading.hide();
      });
    },
    /**
     * @description: 改变容量
     * @return: null
     */
    changeSlider(val) {
      this.size = val;
    },
    /**
     * @description: 获取存储类型和容量
     * @param size {Number} 容量
     * @return: null
     */
    getStorageTypeAndCapacity(size) {
      return this.$http.get('volumeNorm/range').then(({ data }) => {
        if (data.status) {
          this.volumeNormRange = data.data;
          let index = this.volumeNormRange[this.storageType].indexOf(size);
          this.sliderData = this.volumeNormRange[this.storageType].slice(index);
        }
      });
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.diskId = this.data.id;
        this.diskName = this.data.name;
        this.size = this.data.size;
        this.storageType = this.data.storageType;
        this.getStorageTypeAndCapacity(this.size).then(() => {
          this.visible = newVal;
        });
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); //清楚右上角提示信息
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('input', newVal);
      }
    }
  }
};
</script>
