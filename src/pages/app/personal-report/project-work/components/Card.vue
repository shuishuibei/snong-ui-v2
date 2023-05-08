<template>
  <div class="summer">
    <div class="summer-title">
      <span class="summer-work-type">{{ timePeriod }}</span> <span class="summer-title-note">已完成/总</span>
    </div>
    <div class="summer-content">
      <span :class="{ 'finished-red': finished < total }">{{ finished }}</span>
      &nbsp;/&nbsp;{{ total }}
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
  width: 190px;
  height: 75px;
  border: 2px solid #d6ebff;
  background-color: #d6ebff;
  padding: 10px;
  margin: 5px;
}

.summer-title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 5px;
  padding-left: 10px;
}

.summer-title-note {
  font-size: 14px;
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
.summer-work-type {
  color: #39f;
}
</style>
