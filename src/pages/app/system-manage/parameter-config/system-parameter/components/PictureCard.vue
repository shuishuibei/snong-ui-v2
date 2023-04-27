<!--
 * @Description: 参数配置模块背景图片和logo图片展示用的卡片组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:37:31
 -->
<template>
  <div class="picture-card-contain">
    <div class="image-area">
      <img
        :id="id"
        :src="url"
        :class="[{ 'login-image': loginImage, 'logo-image': logoImage }]" />
      <div
        class="close-circle"
        v-if="!this.status && !defaultType"
        @click="deletePicture">
      </div>
      <div v-else-if="this.status && !defaultType"></div>
      <div
        class="default-tip"
        v-else>
        默认
      </div>
    </div>
    <div class="option-bar">
      <i-radio
        class="radio-button"
        v-model="actualStatus"
        @on-change="onchange">
        应用
      </i-radio>
    </div>
  </div>
</template>

<script>
import defaultLogoImage from '@/assets/imgs/logo-index.png';
export default {
  name: 'PictureCard',
  props: {
    url: {
      type: String,
      default: ''
    },
    /*图片卡片是否是默认类型或者普通类型*/
    defaultType: {
      type: Boolean,
      default: false
    },
    /*是否选中状态*/
    status: {
      type: Boolean,
      default: false
    },
    imgName: {
      type: String,
      default: ''
    },
    loginImage: {
      type: Boolean,
      default: false
    },
    logoImage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    single() {
      return this.status;
    },
    actualStatus: {
      get: function() {
        return this.status;
      },
      set: function(newValue) {
        this.choose = newValue;
      }
    }
  },
  data() {
    return {
      defaultUrl: defaultLogoImage,
      choose: false,
      id: new Date() + Math.random() + 'image'
    };
  },
  methods: {
    deletePicture() {
      this.$emit('delete', true);
    },
    onchange() {
      this.$emit('on-change', true);
    },
    initImage(newVal) {}
  },
  watch: {
    url: {
      handler: function(newVal) {
        if (newVal !== '') {
          this.initImage(newVal);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped lang="less">
.picture-card-contain {
  position: relative;
  height: auto;
  width: auto;
  .image-area {
    position: relative;
    width: 200px;
    height: 120px;
    background-color: #f6f7f9;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    .login-image {
      width: 200px;
      height: 120px;
    }
    .logo-image {
      width: auto;
      height: 26px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .default-tip {
    text-align: center;
    color: #fff;
    position: absolute;
    width: 36px;
    height: 18px;
    line-height: 18px;
    border-radius: 20px;
    background-color: #7d7d7d;
    right: -10px;
    top: -5px;
  }
  .close-circle {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #ed2c1c;
    right: -7px;
    top: -7px;
  }
  .close-circle:hover {
    cursor: pointer;
  }
  .close-circle:after {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    height: 10px;
    z-index: 200;
    transform: translate(-50%, -50%) rotate(45deg);
    background-color: #fff;
    left: 50%;
    top: 50%;
  }
  .close-circle:before {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    height: 10px;
    z-index: 200;
    transform: translate(-50%, -50%) rotate(-45deg);
    background-color: #fff;
    left: 50%;
    top: 50%;
  }
  .option-bar {
    color: #fff;
    text-align: center;
    position: absolute;
    width: 200px;
    height: 25px;
    bottom: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.4);
    .radio-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
