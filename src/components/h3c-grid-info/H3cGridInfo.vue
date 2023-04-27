<!--
 * @Description: 栅格详情组件
 * @Author: ys2234
 * @Date: 2019-09-02 17:29:03
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-22 11:49:36
 -->
<template>
  <div class="h3c-grid-info" :style="[{ margin: marginValue }]">
    <!-- <i-row align="middle"> -->
      <div v-for="(item, index) in data" :key="index">
        <i-row type="flex" class="row-item" v-if="index % 2 === 0">
          <i-col span="3" class="sub-col-left">{{ item.label }}：</i-col>
          <i-col span="8" class="sub-col-right">{{ item.value }}</i-col>
          <template v-if="data[index + 1]">
            <i-col span="3" class="sub-col-left">{{ data[index + 1].label }}：</i-col>
            <i-col span="8" class="sub-col-right">{{ data[index + 1].value }}</i-col>
          </template>
        </i-row>
      </div>
    <!-- </i-row> -->
  </div>
</template>

<script>
export default {
  name: 'H3cGridInfo',
  props: {
    data: {
      type: Array
    },
    marginValue: {
      type: String,
      default: '0'
    }
  }
}
</script>

<style lang="less" scoped>
.h3c-grid-info {
  .row-item {
    line-height: 32px;
    margin-bottom: 28px;
    .sub-col-left {
      text-align: right;
    }
    .sub-col-right {
      min-height: 32px;
      line-height: 20px;
      padding: 6px 10px;
      word-wrap: break-word;
      word-break: normal;
      background-color: #d5e8fc;
    }
  }
}
</style>