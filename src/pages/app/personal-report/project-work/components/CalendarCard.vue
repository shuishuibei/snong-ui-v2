<!--
 * @Author: cfw2157 yz.caiyijun@h3c.com
 * @Date: 2023-04-28 14:13:46
 * @LastEditors: cfw2157 yz.caiyijun@h3c.com
 * @LastEditTime: 2023-05-04 14:49:51
 * @FilePath: \snong-ui-v2\src\pages\app\personal-report\project-work\components\CalendarCard.vue
 * @Description: 日历组件子组件——日期卡片组件
-->
<template>
  <div class="calendar-card" @click="callback">
    <div
      :class="{
        'bg-green': completed,
        'bg-red': !completed,
        'bg-grey': noTask,
      }"
    >
      <div class="week-day">
        {{ `${day} | ${getWeekDay(year, month, day)}` }}
      </div>
      <div
        class="state-container"
        :class="{ 'two-columns': sortedStates.length > 3, 'one-columns': sortedStates.length <= 3 }"
      >
        <div class="state" v-for="item in sortedStates" :key="item.label">
          <span class="s1">{{ item.label }}</span>
          <span :class="{ 'warn': item.state.done !== item.state.total, 's2': true }">
            {{ item.state.done }}
          </span>
          <span class="s3">&nbsp;/&nbsp;{{item.state.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function defaultState() {
  return {
    total: null,
    done: null,
  };
}
export default {
  props: {
    // 年
    year: {
      type: [Number, String],
      required: true,
    },
    // 月
    month: {
      type: [Number, String],
      required: true,
    },
    // 日
    day: {
      type: [Number, String],
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    // 数据展示优先级：日 周  月  季 年 需
    // 当日状态，分总任务total和已完成任务done
    dayState: {
      type: Object,
      default: defaultState,
      required: false,
    },
    // 所在周状态，分总任务total和已完成任务done
    weekState: {
      type: Object,
      default: defaultState,
      required: false,
    },
    // 所在月状态，分总任务total和已完成任务done
    monthState: {
      type: Object,
      default: defaultState,
      required: false,
    },
    // 所在季度状态，分总任务total和已完成任务done
    quarterState: {
      type: Object,
      default: defaultState,
      required: false,
    },
    // 所在年状态，分总任务total和已完成任务done
    yearState: {
      type: Object,
      default: defaultState,
      required: false,
    },
    // 需，分总任务total和已完成任务done
    tempState: {
      type: Object,
      default: defaultState,
      required: false,
    },
    callback: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    getWeekDay(year, month, day) {
      const date = new Date(year, month - 1, day);
      const formatter = new Intl.DateTimeFormat("zh-CN", { weekday: "short" });
      return formatter.format(date);
    },
  },
  computed: {
    sortedStates() {
      const stateList = [
        { label: "日", state: this.dayState },
        { label: "周", state: this.weekState },
        { label: "月", state: this.monthState },
        { label: "季", state: this.quarterState },
        { label: "年", state: this.yearState },
        { label: "需", state: this.tempState },
      ];
      return stateList.filter(({ state }) => state.total !== null).slice(0, 6);
    },
    // 大于今天的日期的，
    noTask() {
      return this.dayState.done == null && this.dayState.total == null;
    },
  },
};
</script>

<style lang="less">
/* 给滚动条整体设置样式 */
::-webkit-scrollbar {
  width: 5px; /* 设置滚动条宽度 */
}

/* 设置滚动条轨道样式 */
::-webkit-scrollbar-track {
  background-color: #fff; /* 设置轨道颜色 */
  border-radius: 10px; /* 设置轨道边角的弧度 */
}

/* 设置滚动条滑块样式 */
::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 设置滑块颜色 */
  border-radius: 10px; /* 设置滑块边角的弧度 */
}
</style>

<style lang="less" scoped>
.calendar-card {
  width: 100%;
  height: 100%;
  & > div {
    width: 100%;
    height: 100%;
    padding: 5px;
  }
}
.bg-green {
  background-color: #c8efd4;
}
.bg-red {
  background-color: #fbcfd0;
}
.bg-grey {
  background-color: #ccc !important;
}
.week-day {
  width: 100%;
  font-weight: 800;
  font-size: 16px;
  line-height: 16px;
  padding: 5px 0;
  margin-left: -20px;
}
.state-container {
  width: 100%;
  height: 100px;
  overflow: hidden;
  direction: ltr;
  height: calc(100% - 26px);
}

.state-container.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 4px;
  font-size: 12px;
}

.state-container.one-columns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.warn {
  color: #ed1c24;
}
.state {
  display: flex;
  align-items: center;
  .s2 {
    padding-left: 10px;
    font-weight: 700;
  }
}
</style>
