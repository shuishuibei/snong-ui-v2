<!--
 * @Description: 系统header组件
 * @Author: ys2234
 * @Date: 2019-08-30 15:56:49
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 13:28:27
 -->
<template>
  <div class="h3c-header cds-clearfix">
    <div class="h3c-header-left cds-float-left">
      <img class="logo" :src="logoUrl" :key="logoKey" alt="云智运维管理系统" />
      <h1 class="title">云智运维管理系统</h1>
    </div>
    <div class="cds-float-left">
      <slot name="header-menu"></slot>
    </div>
    <div class="h3c-header-right cds-float-right">
      <slot name="header-function"></slot>
    </div>
  </div>
</template>

<script>
const defaultLogoUrl = require('@/assets/imgs/logo-index.png');
export default {
  name: 'H3cHeader',
  data() {
    return {
      logoUrl: '', // logo路径
      logoKey: ''
    }
  },
  methods: {
    getLogo(name) {
      this.$http({
        method: 'GET',
        url: `/loginparams/showLogoImg/${name}`,
        responseType: 'arraybuffer'
      }).then(({ data }) => {
        this.logoUrl = 'data:image/jpeg;base64,' + btoa(
          new Uint8Array(data).reduce(
            (data, byte) => data + String.fromCharCode(byte)
          , '')
        );
      })
    },
    getLogoInfo() {
      this.$http({
        method: 'GET',
        url: 'loginparams/getCurrentLoginParam'
      }).then(({ data }) => {
        if(
          (data.status && data.data.logoImage) &&
          data.data.logoImage !== 'logo-index.png'
        ) {
          this.getLogo(data.data.logoImage);
        } else {
          this.logoUrl = defaultLogoUrl;
        }
      })
    }
  },
  mounted() {
    this.getLogoInfo();
    this.$eventHub.$on('changeLogo', () => {
      this.$nextTick(() => {
        this.logoUrl = this.$store.state.login.logoImageSrc;
        this.logoKey = new Date() + Math.random();
      });
    });
  },
}
</script>

<style scoped lang="less">
@import "../../assets/css/theme.less";
.h3c-header {
  width: 100%;
  min-width: 611px;
  background-color: @headerBgcolorDark;
  height: @headerHeight;
  line-height: @headerHeight;
  .h3c-header-left {
    padding-left: 20px;
    font-size: 0;
    .logo, .title {
      display: inline-block;
      vertical-align: middle;
    }
    .logo {
      max-width: 107px;
      height: 26px;
    }
    .title {
      font-weight: 400;
      font-size: 1.6rem;
      color: #fff;
      letter-spacing: 2px;
      margin-left: 10px;
    }
  }
}
</style>
