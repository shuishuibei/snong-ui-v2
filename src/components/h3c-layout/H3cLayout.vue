<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-29 16:17:46
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-24 13:35:29
 -->
<template>
  <div class="cds-wrapper">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'H3cLayout'
};
</script>
