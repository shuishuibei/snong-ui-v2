<template>
  <i-tabs
    class="cds-wrapper cds-border cds-padding-14"
    @on-click="tabClick"
    :animated="false">
    <i-tab-pane
      label="流程模型"
      name="template">
      <process-template-tab ref="template"></process-template-tab>
    </i-tab-pane>
    <i-tab-pane
      label="流程定义"
      name="deploy">
      <process-deploy-tab ref="deploy"></process-deploy-tab>
    </i-tab-pane>
    <i-tab-pane
      label="流程分类"
      name="classification">
      <process-classification ref="classification"></process-classification>
    </i-tab-pane>
  </i-tabs>
</template>

<script>
  import ProcessTemplateTab from './ProcessTemplateTab.vue'; // 引入流程模型
  import ProcessDeployTab from './ProcessDeployTab.vue'; // 引入流程定义
  import ProcessClassification from './ProcessClassification.vue'; // 引入流程分类

  export default {
    name: 'ProcessTemplate',
    components: {
      'process-template-tab': ProcessTemplateTab,
      'process-deploy-tab': ProcessDeployTab,
      'process-classification': ProcessClassification
    },
    data() {
      return {
        refresh: () => {
        } // 初始默认值为函数
      };
    },
    methods: {
      handleRefresh(e) {
        this.refresh = e;
      },
      tabClick(name) {
        this.$refs[name].handleRefresh();
      }
    }
  };
</script>

