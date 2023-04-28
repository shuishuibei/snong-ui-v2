<!--
 * @Author: cfw2157 yz.caiyijun@h3c.com
 * @Date: 2023-04-28 14:13:46
 * @LastEditors:  
 * @LastEditTime: 2023-04-28 15:43:05
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
      <div class="state-container">
        <div class="state" v-if="dayState.total !== null">
          <span class="s1">日</span>
          <span class="s2">
            <span :class="{ warn: dayState.done !== dayState.total }">{{
              dayState.done
            }}</span
            >/{{ dayState.total }}
          </span>
        </div>
        <div class="state" v-if="weekState.total !== null">
          <span class="s1">周</span>
          <span class="s2">
            <span :class="{ warn: weekState.done !== weekState.total }">{{
              weekState.done
            }}</span
            >/{{ weekState.total }}
          </span>
        </div>
        <div class="state" v-if="monthState.total !== null">
          <span class="s1">月</span>
          <span class="s2">
            <span :class="{ warn: monthState.done !== monthState.total }">{{
              monthState.done
            }}</span
            >/{{ monthState.total }}
          </span>
        </div>
        <div class="state" v-if="quarterState.total !== null">
          <span class="s1">季</span>
          <span class="s2">
            <span :class="{ warn: quarterState.done !== quarterState.total }">{{
              quarterState.done
            }}</span
            >/{{ quarterState.total }}
          </span>
        </div>
        <div class="state" v-if="yearState.total !== null">
          <span class="s1">年</span>
          <span class="s2">
            <span :class="{ warn: yearState.done !== yearState.total }">{{
              yearState.done
            }}</span
            >/{{ yearState.total }}
          </span>
        </div>
        <div class="state" v-if="tempState.total !== null">
          <span class="s1">需</span>
          <span class="s2">
            <span :class="{ warn: yearState.done !== yearState.total }">{{
              yearState.done
            }}</span
            >/{{ yearState.total }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 年
    year: {
      type: Number | String,
      required: true,
    },
    // 月
    month: {
      type: Number | String,
      required: true,
    },
    // 日
    day: {
      type: Number | String,
      required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    // 当日状态，分总任务total和已完成任务done
    dayState: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0,
        };
      },
      required: true,
    },
    // 所在周状态，分总任务total和已完成任务done
    weekState: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0,
        };
      },
      required: true,
    },
    // 所在月状态，分总任务total和已完成任务done
    monthState: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0,
        };
      },
      required: false,
    },
    // 所在季度状态，分总任务total和已完成任务done
    quarterState: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0,
        };
      },
      required: false,
    },
    // 所在年状态，分总任务total和已完成任务done
    yearState: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0,
        };
      },
      required: false,
    },
    // 需，分总任务total和已完成任务done
    tempState: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0,
        };
      },
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
      const daysOfWeek = [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
      ];
      const dayofWeek = daysOfWeek[date.getDay()];
      return dayofWeek;
    },
  },
  computed: {
    // completed() {
    //   return this.dayState.done === this.dayState.total;
    // },
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
  width: 145px;
  height: 125px;
  border: 1px solid #ccc;
  & > div {
    width: 100%;
    height: 100%;
    padding: 5px 15px;
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
}
.state-container {
  width: 100%;
  height: 100px;
  overflow-y: auto;
  direction: rtl;
}

.warn {
  color: #ed1c24;
}
.state {
    float: left;
  font-size: 15px;
  line-height: 15px;
  .s1 {
    padding-left: 36px;
  }
  .s2 {
    padding-left: 10px;
    font-weight: 700;
  }
}
</style>
