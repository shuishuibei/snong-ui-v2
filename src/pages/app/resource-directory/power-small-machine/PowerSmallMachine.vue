<!--
 * @Description Power虚拟机基本申请和模板申请主入口文件
 * @Author ys1983/张睿博
 * @Date 2019-07-25 16:08:06
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:58:03
 -->
<template>
  <div class="power-small-machine cds-padding-14 cds-border cds-scroll-wrap">
    <div
      class="cds-scroll-content"
      :style="{'padding-bottom': $route.meta.breadcrumb !== '物理主机' ? void(0) : 0}">
      <h3c-title title="Power虚拟机">
        <template #other>
          <a
            class="cds-float-right back-to-mall"
            @click="backHome">
            返回云资源
          </a>
        </template>
      </h3c-title>
      <div class="cds-clearfix create-info-bar-wrap" v-show="$route.meta.breadcrumb !== '物理主机'">
        <div class="create-info cds-float-left cds-clearfix">
          <p :class="{'create-info-bar': true, 'base-bar': targetRouter, 'template-bar': !targetRouter}"></p>
          <dl
            :class="{'create-info-base': true, target: targetRouter}"
            @click="$router.push({name: 'resource-directory/power-small-machine/base', query: { time: new Date().getTime() }})">
            <dd>基本</dd>
          </dl>
          <dl
            v-if="!$route.query.id"
            :class="{'create-info-template': true, target: !targetRouter}"
            @click="$router.push({name: 'resource-directory/power-small-machine/template', query: { time: new Date().getTime() }})">
            <dd>从模板创建</dd>
          </dl>
        </div>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
export default {
  name: 'PowerSmallMachine',
  components: {
    'h3c-title': H3cTitle
  },
  inject: {
    isAbsolute: {
      default: () => ({ scrollEmit: false })
    }
  },
  methods: {
    backHome() {
      this.$router.push({
        name: 'resource-directory/index',
        query: { time: new Date().getTime() }
      });
    }
  },
  computed: {
    targetRouter() {
      return this.$route.meta.breadcrumb === '基本' ? true : false;
    }
  }
};
</script>

<style lang="less" scoped>
.power-small-machine {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
  .create-info-bar-wrap {
    border-bottom: 1px solid #dcdee2;
  }
  .create-info {
    display: flex;
    position: relative;
    color: #495060;
    text-align: center;
    .create-info-base,
    .create-info-template {
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
    .create-info-template {
      margin-left: 12px;
    }
    .create-info-bar {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 2px;
      background: #39f;
      transition: transform 0.3s ease-in-out;
      transform-origin: 0 0;
    }
    .base-bar {
      width: 60px;
      transform: translate3d(0, 0, 0);
    }
    .template-bar {
      width: 102px;
      transform: translate3d(76px, 0, 0);
    }
    .target {
      color: #39f;
    }
  }
}
</style>
