<!--
 * @Description 云主机添加硬盘数量页面
 * @Author ys1983/张睿博
 * @Date 2019-08-06 15:10:27
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:48:23
 -->
<template>
  <i-form
    :model="formValidate"
    :label-width="150">
    <i-form-item
      v-for="(item,index) in formValidate.storage"
      :key="index"
      label="数据盘数量">
      <i-input-number
        :max="item.maxNums"
        :min="0"
        :editable="false"
        v-model="item.diskNums"
        @on-change="(value) => {changeNums(value, index)}"
        style="vertical-align: top">
      </i-input-number>
      <span class="input-number-info">块</span>
      <div class="custom-slider-wrap">
        <span class="custom-slider-title">容量（GB）</span>
        <h3c-array-silder
          style="width:80%;padding:5px 0"
          v-model="item.diskSize"
          :data="diskSizeList"
          :disabled="item.diskNums === 0 ? true : false"
          :slider-button-style="{backgroundColor: '#3399ff'}"
          :vertical-line-style="{backgroundColor: '#fff',width: '2px'}">
        </h3c-array-silder>
        <div
          v-if="index !== 0"
          class="custom-slider-show">
          <span
            class="storage-delete"
            @click="deleteStorage(index)">
            <i class="iconfont icon-shanchu"></i>
          </span>
        </div>
      </div>
    </i-form-item>
    <i-form-item>
      <i-button
        type="primary"
        :disabled="countDiskNums === 0 ? true : false"
        @click="addStorage">
        <span class="btn-title">增加数据盘</span>
      </i-button>
      <span class="cds-tip">数据盘可以配置3块，您还可以配置{{countDiskNums}}块</span>
      <transition
        name="fade"
        mode="out-in">
        <p
          v-if="warningShow"
          class="cds-warning">
          当前数据盘有一项数量为0，无法继续添加数据盘
        </p>
      </transition>
    </i-form-item>
  </i-form>
</template>

<script>
import H3cArraySlider from '@/components/h3c-slider/H3cArraySlider.vue'; // 引入滑块组件
export default {
  name: 'CloudHostNums',
  components: {
    'h3c-array-silder': H3cArraySlider
  },
  props: {
    storage: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      formValidate: {
        storage: [
          {
            diskNums: 0,
            diskSize: 0,
            maxNums: 3
          }
        ]
      },
      warningShow: false,
      diskSizeList: [0]
    };
  },
  methods: {
    /**
     * @function deleteStorage
     * @description 点击删除触发的方法
     * @param {Number} index
     * @returns {void}
     */
    deleteStorage(index) {
      this.formValidate.storage.splice(index, 1);
    },
    /**
     * @function addStorage
     * @description 点击新增数据盘触发的方法
     * @returns {void}
     */
    addStorage() {
      !this.testResultsNum() ?
        this.formValidate.storage.push({
            diskNums: 0,
            diskSize: 0,
            maxNums: 3
          }) :
        (this.warningShow = true);
    },
    /**
     * @function changeNums
     * @description 数据盘数据发生变化时触发的方法
     * @param {Number} value
     * @param {Number} index
     * @returns {void}
     */
    changeNums(value, index) {
      !value ?
        this.$set(this.formValidate.storage[index], 'diskSize', 0) :
        this.testResultsNum() ?
        null :
        (this.warningShow = false);
    },
    /**
     * @function testResultsNums
     * @description 当新增数据盘时检测已有的数据盘数量是否有为0的情况，有则返回false，否则返回true
     * @returns {Boolean}
     */
    testResultsNum() {
      let index = this.formValidate.storage.findIndex(value => value.diskNums === 0);
      return index === -1 ? false : true;
    },
    /**
     * @function getVolumeNormHttp
     * @description 获取数据盘规格的http请求
     * @returns {void}
     */
    getVolumeNormHttp() {
      this.$http({
        url: 'volumeNorm/Volume',
        method: 'GET'
      }).then(({ data }) => {
        this.diskSizeList = [0];
        if (data.status && data.data.length > 0) {
          data.data.forEach(value => {
            this.diskSizeList.push(+value.volumeAdvSpaceSize);
          });
        }
      });
    }
  },
  computed: {
    /**
     * @function countDiskNums
     * @description 用来计算数据盘还能添加几块
     * @returns {Number}
     */
    countDiskNums() {
      let couter = 0;
      this.formValidate.storage.forEach(item => {
        couter += item.diskNums;
      });
      return 3 - couter;
    }
  },
  mounted() {
    this.getVolumeNormHttp();
  },
  watch: {
    countDiskNums(newValue, oldValud) {
      if (!newValue) {
        this.formValidate.storage.forEach(item => {
          item.maxNums = item.diskNums;
        });
      }
    },
    'formValidate.storage': {
      deep: true,
      handler: function(newValue) {
        this.$emit('e-storage', newValue);
      }
    },
    storage(newValue) {
      newValue.forEach(item => {
        delete item.diskName;
      });
      this.formValidate.storage = newValue;
    }
  }
};
</script>

<style lang="less" scoped>
.custom-slider-wrap {
  display: inline-block;
  width: 80%;
  vertical-align: top;
  margin-left: 20px;
}
.input-number-info {
  margin-left: 10px;
  vertical-align: top;
  line-height: 35px;
}
.custom-slider-title {
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  letter-spacing: 1px;
  line-height: 35px;
}
.custom-slider-show {
  display: inline-block;
  vertical-align: top;
  margin-left: 20px;
}
.storage-delete i:before {
  font-size: 18px;
}
.storage-delete {
  cursor: pointer;
  padding: 5px;
  color: #9cb1e8;
}
</style>
