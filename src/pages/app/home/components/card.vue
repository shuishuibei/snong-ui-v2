<template>
  <div>
    <Row class="overview-row">
      <Col class="overview-col" span="6">
        <Card>
          <p class="overview-title">告警数量</p>
          <p class="overview-number">{{ alarmCount }}</p>
        </Card>
      </Col>
      <Col class="overview-col" span="6">
        <Card>
          <p class="overview-title">已处理告警数量</p>
          <p class="overview-number">{{ processedAlarmCount }}</p>
        </Card>
      </Col>
      <Col class="overview-col" span="6">
        <Card>
          <p class="overview-title">未处理告警数量</p>
          <p class="overview-number">{{ unprocessedAlarmCount }}</p>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alarmCount: 0,
      processedAlarmCount: 0,
      unprocessedAlarmCount: 0
    };
  },
  mounted() {
    // 假设以下为从服务端获取的数据
    this.alarmCount = 100;
    this.processedAlarmCount = 80;
    this.unprocessedAlarmCount = 20;
  }
};
</script>

<style scoped>
.overview-row {
  margin-top: 20px;
}

.overview-col {
  text-align: center;
}

.overview-title {
  font-size: 14px;
  color: #999;
}

.overview-number {
  font-size: 36px;
  color: #333;
  margin-top: 10px;
}
</style>
