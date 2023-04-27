<template>
  <div style="width: 100%; height: 100%">
    <iframe
      :src="iframeUrl"
      style="width: 100%"
      frameborder="0"
      scrolling="no"
      id="bdIframe"
      class="bdIframe"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframeUrl: ''
    };
  },
  methods: {
    getGrafanaUrl() {
      this.$http({
        method: 'GET',
        url: '/overview/grafana/grafanaServer'
      }).then(({ data }) => {
        if(data.status && data.data !== null) {
          this.iframeUrl = data.data;
        }
      })
    },
  },
  created() {
    this.getGrafanaUrl();
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.bdIframe {
  height: calc(100% - 5px);
}
</style>


