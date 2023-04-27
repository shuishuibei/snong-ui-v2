<!--
 * @Description: x86虚拟机表格操作下拉框
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-12 14:36:26
 -->
<template>
  <div class="virtual-operation">
    <i-dropdown
      trigger="click"
      :transfer="true"
      transfer-class-name="virtual-dropdown"
      @on-click="operate">
      <a href="javascript:void(0)">
        <i class="iconfont icon-gengduo"></i>
      </a>
      <i-dropdown-menu slot="list">
        <i-dropdown-item name="open">
          <i class="iconfont icon-kaiqi"> 开启</i>
        </i-dropdown-item>
        <i-dropdown-item name="close">
          <i class="iconfont icon-guanbi"> 关闭</i>
        </i-dropdown-item>
        <i-dropdown-item name="restart">
          <i class="iconfont icon-lvzhou_zhongqi"> 重启</i>
        </i-dropdown-item>
        <i-dropdown-item name="hangup">
          <i class="iconfont icon-guaqi"> 挂起</i>
        </i-dropdown-item>
        <i-dropdown-item name="recovery">
          <i class="iconfont icon-huifu"> 恢复</i>
        </i-dropdown-item>
        <i-dropdown-item divided name="mountDisk">
          <i class="iconfont icon-guazai"> 挂载硬盘</i>
        </i-dropdown-item>
        <i-dropdown-item name="unloadDisk">
          <i class="iconfont icon-xiezai"> 卸载硬盘</i>
        </i-dropdown-item>
        <i-dropdown-item divided name="changeSpec">
          <i class="iconfont icon-guige"> 更改规格</i>
        </i-dropdown-item>
        <i-dropdown-item name="loadNetworkCard">
          <i class="iconfont icon-738bianjiqi_chaolianjie"> 加载网卡</i>
        </i-dropdown-item>
        <i-dropdown-item name="unloadNetworkCard">
          <i class="iconfont icon-739bianjiqi_qingchuchaolianjie"> 卸载网卡</i>
        </i-dropdown-item>
        <!--<i-dropdown-item name="relet">
          <i class="iconfont icon-renew"> 续租</i>
        </i-dropdown-item>-->
        <i-dropdown-item name="delete">
          <i class="iconfont icon-tuihuozhong"> 申请退订</i>
        </i-dropdown-item>
      </i-dropdown-menu>
    </i-dropdown>
  </div>
</template>

<script>
import emitter from '@/assets/js/emitter.js';

export default {
  mixins: [emitter],
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  methods: {
    /**
     * @description: 触发点击事件，向CloudHost组件传递事件名称及参数
     * @param name {String} 操作名称
     * @return: null
     */
    operate(name) {
      this.dispatch('CloudHost', name, this.params.row);
    }
  }
};
</script>

<style lang="less" scoped>
.virtual-dropdown {
  z-index: 1000;
  .iconfont {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    letter-spacing: 0;
  }
}
</style>

