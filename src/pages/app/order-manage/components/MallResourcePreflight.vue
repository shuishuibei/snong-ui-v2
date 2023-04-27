<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-09-03 11:50:30
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:06:38
 -->
<template>
  <div
    v-if="value"
    class="mall-resource-preflight">
    <div class="mall-resource-preflight-content">
      <div class="cds-layout-center">
        <i-circle
          :percent="percentage"
          :stroke-color="strokeColor"
          :size="250"
          :stroke-width="5"
          :trail-width="4">
          <span style="font-size:55px;color:#3399FD;">{{ percentage }}%</span>
        </i-circle>
      </div>
      <p class="content-text">正在资源预检,请稍后<b>...</b></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MallResourcePreflight',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    strokeColor: {
      type: String,
      default: '#3399FD'
    },
    applyListId: {
      type: Array,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      percentage: 0,
      theTimer: ''
    };
  },
  methods: {
    /**
     * @function _timer
     * @description 资源预检进度的方法
     * @returns {void}
     */
    _timer() {
      this.theTimer = setInterval(() => {
        this.percentage++;
        if (this.percentage >= 100) {
          this.$emit('input', false);
          clearInterval(this.theTimer);
          this.$Notice.warning({
            desc: '资源预检超时'
          });
        }
      }, 1000);
    },
    /**
     * @function getResourceCheckResultHttp
     * @description 获取资源预检结果
     * @returns {void}
     */
    getResourceCheckResultHttp() {
      this.$http({
        url: this.url,
        method: 'POST',
        data: this.applyListId
      }).then(({ data }) => {
        clearInterval(this.theTimer);
        this.percentage = 100;
        if (data.status) {
          this.$emit('e-result', { status: true, message: data.message });
        } else if (data.code === 700) {
          this.$emit('e-result', { status: false, message: data.message });
        }
        this.$emit('input', false);
      });
    }
  },
  watch: {
    value(newValue) {
      if (newValue) {
        this._timer();
        this.getResourceCheckResultHttp();
      } else {
        clearInterval(this.theTimer);
        this.percentage = 0;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mall-resource-preflight {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  .mall-resource-preflight-content {
    position: absolute;
    width: 670px;
    height: 300px;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    .content-text {
      position: absolute;
      bottom: -25px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      text-align: center;
      font-size: 30px;
      letter-spacing: 2px;
    }
  }
}
</style>
