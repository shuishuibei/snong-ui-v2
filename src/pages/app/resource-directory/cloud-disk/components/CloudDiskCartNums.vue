<!--
 * @Description 云硬盘申请数量页面
 * @Author ys1983/张睿博
 * @Date 2019-07-26 16:40:02
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:54:43
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate">
    <i-form-item
      label="容量（GB）"
      :label-width="150"
      required>
      <h3c-array-silder
        style="width:500px;padding:5px 0"
        v-model="formValidate.volumeSize"
        :data="volumeNormList"
        :slider-button-style="{backgroundColor: '#3399ff'}"
        :vertical-line-style="{backgroundColor: '#fff',width: '2px'}">
      </h3c-array-silder>
    </i-form-item>
    <i-form-item
      label="购买量"
      :label-width="150"
      required>
      <i-input-number
        :max="3"
        :min="1"
        :step="1"
        :editable="false"
        v-model="formValidate.volumeNums">
      </i-input-number>
      <span class="cds-tip">每次最多可创建3块硬盘</span>
    </i-form-item>
  </i-form>
</template>

<script>
import H3cArraySlider from '@/components/h3c-slider/H3cArraySlider.vue'; // 引入滑块组件
export default {
  name: 'CloudDiskCartNums',
  components: {
    'h3c-array-silder': H3cArraySlider
  },
  props: {
    volumeNumsSize: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formValidate: {
        volumeNums: 1, // 申请x86硬盘的数量
        volumeSize: 0 // 硬盘的容量
      },
      volumeNormList: [] // 硬盘规格集合
    };
  },
  methods: {
    /**
     * @function getVolumeNormHttp
     * @description 获取硬盘规格数据
     * @returns {void}
     */
    getVolumeNormHttp() {
      this.$http({
        url: 'volumeNorm/Volume',
        method: 'GET'
      }).then(({ data }) => {
        this.volumeNormList = [];
        if (data.status && data.data.length > 0) {
          data.data.forEach(value => {
            this.volumeNormList.push(Number(value.volumeAdvSpaceSize));
          });
        } else {
          this.formValidate.volumeSize = 0;
        }
      });
    }
  },
  mounted() {
    this.getVolumeNormHttp(); // 调用获取硬盘规格的方法
  },
  watch: {
    volumeNumsSize(newValue) {
      if (newValue.volumeSize) {
        this.formValidate = Object.assign(this.formValidate, newValue);
      }
    }
  }
};
</script>
