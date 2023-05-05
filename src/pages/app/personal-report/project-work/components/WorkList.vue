<template>
  <div class="work-list-wrapper">
    <div class="header">
      <i-button type="primary">新建</i-button>
      <i-button type="primary">确认</i-button>
    </div>
    <div class="day-work">
      <h3>每日工作</h3>
      <i-table :columns="dayColumns"></i-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dayColumns: [
        
      ]
    }
  }
}
</script>

<style lang="less" scoped>
    .work-list-wrapper {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
</style>