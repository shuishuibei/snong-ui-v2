<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-09-06 13:54:17
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-12 14:38:14
 -->
<template>
  <div id="flow">
    <iframe
      :src="src"
      width="100%"
      frameborder="0"
      scrolling="auto">
    </iframe>
  </div>
</template>

<script>
export default {
  name: 'MyOrderFlowTracing',
  props: {
    processDefinitionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      src: ''
    };
  },
  mounted() {
    let env = process.env.NODE_ENV;
    let { procInsId } = this.$route.query;
    if (env === 'development') {
      this.src = `http://localhost:8080/act/diagram-viewer/index.html?processDefinitionId=${this.processDefinitionId}&processInstanceId=${procInsId}`;
    } else {
      this.src = `act/diagram-viewer/index.html?processDefinitionId=${this.processDefinitionId}&processInstanceId=${procInsId}`;
    }
  }
};
</script>

<style scoped lang="less">
#flow iframe {
  min-height: calc(100vh - 230px);
}
</style>
