<template>
  <div class="summer">
    <div class="summer-title">
      {{ timePeriod }} <span class="summer-title-note">已完成/总</span>
    </div>
    <div class="summer-content">
      <span :class="{ 'finished-red': finished < total }">{{ finished }}</span>
      /{{ total }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    timePeriod: String,
    finished: Number,
    total: Number,
  },
};
</script>

<style lang="less" scoped>
.summer {
  width: 200px;
  height: 70px;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
  margin: 5px;
}

.summer-title {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 5px;
  padding-left: 10px;
}

.summer-title-note {
  font-size: 12px;
  font-weight: 400;
  padding-left: 20px;
}

.summer-content {
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}
.finished-red {
  color: red;
}
</style>
