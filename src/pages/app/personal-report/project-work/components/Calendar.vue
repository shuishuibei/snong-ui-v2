<template>
  <div class="calendar">
    <div class="summary">
      <card
        v-for="(item, index) of fakeSummary"
        :key="index"
        :timePeriod="item.timePeriod"
        :finished="item.finished"
        :total="item.total"
      ></card>
    </div>
    <div class="calendar-header">
      <i-select class="calendar-header-select" v-model="year">
        <i-option v-for="y in years" :key="y" :value="y">{{ y }}&nbsp;年</i-option>
      </i-select>
      <i-select class="calendar-header-select" v-model="month">
        <i-option v-for="m in months" :key="m" :value="m">{{ `${m}`.padStart(2, '0') }}&nbsp;月</i-option>
      </i-select>
      <i-button type="primary" class="calendar-header-button">导出报表</i-button>
    </div>
    <div class="calendar-body">
      <div
        class="calendar-cell"
        v-for="day in days"
        :key="day.date + '-' + day.week"
        :class="cellClass(day)"
      >
        <template v-if="!day.otherMonth">
          <calendar-card
            v-for="data in filteredFakeData(day.date)"
            :key="data.day"
            :year="data.year"
            :month="data.month"
            :day="data.day"
            :completed="data.completed"
            :dayState="data.dayState"
            :weekState="data.weekState"
            :monthState="data.monthState"
            :quarterState="data.quarterState"
            :yearState="data.yearState"
            :tempState="data.tempState"
          ></calendar-card>
        </template>
        <div v-else class="calendar-date" @click="handleDateClick(day)">
          <div class="calendar-date-header">
            {{ day.week }} | {{ day.date }}
          </div>
          <div class="calendar-date-num">{{ day.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "./Card.vue";
import CalendarCard from "./CalendarCard.vue";

export default {
  components: {
    Card,
    CalendarCard,
  },
  data() {
    const today = new Date();
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const years = Array.from({ length: 11 }, (_, i) => year - 5 + i); // 显示从当前年份前5年到后5年的年份
    const months = Array.from({ length: 12 }, (_, i) => i + 1); // 生成1-12月的数组
    return {
      days: [],
      fakeSummary: [
        {
          timePeriod: "日",
          finished: 191,
          total: 225,
        },
        {
          timePeriod: "周",
          finished: 13,
          total: 15,
        },
        {
          timePeriod: "月",
          finished: 1,
          total: 1,
        },
        {
          timePeriod: "季度",
          finished: 1,
          total: 1,
        },
        {
          timePeriod: "年",
          finished: 0,
          total: 0,
        },
        {
          timePeriod: "需",
          finished: 1,
          total: 1,
        },
      ],
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      weeks: [],
      fakeData: this.generateFakeData(year, month),
      years: years,
      months: months,
    };
  },
  methods: {
    handleYearMonthChange() {
      this.calculateWeeks(this.year, this.month);
    },
    // 创建假数据
    generateFakeData(year, month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      const fakeData = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const total = Math.floor(Math.random() * 100) + 1;
        const done = Math.floor(Math.random() * (total + 1));

        fakeData.push({
          day: day,
          year: year,
          month: month,
          completed: false,
          dayState: {
            total: total,
            done: done,
          },
          weekState: {
            total: total,
            done: done,
          },
          monthState: {
            total: total,
            done: done,
          },
          quarterState: {
            total: null,
            done: done,
          },
          yearState: {
            total: null,
            done: done,
          },
          tempState: {
            total: null,
            done: done,
          },
        });
      }
      return fakeData;
    },
    handleDateClick(day) {
      if (!day.otherMonth) {
        console.log(`Clicked on ${this.year}-${this.month}-${day.date}`);
      }
    },
    cellClass(day) {
      // 当天的背景色为浅绿色
      if (!day.otherMonth && day.date === new Date().getDate()) {
        return "calendar-cell today";
      }
      return day.otherMonth ? "calendar-cell other-month" : "calendar-cell";
    },
    calculateWeeks(year, month) {
      const firstDayOfMonth = new Date(year, month - 1, 1); // 当月的第一天
      const lastDayOfMonth = new Date(year, month, 0); // 当月的最后一天
      const firstDayOfGrid = new Date(firstDayOfMonth); // 日历方格中的第一天（可能是上月的日期）
      firstDayOfGrid.setDate(1 - (firstDayOfGrid.getDay() - 1 || 7)); // 日期移到上一个星期的周一

      const days = [];
      let currentDay = new Date(firstDayOfGrid);

      while (currentDay <= lastDayOfMonth || currentDay.getDay() !== 1) {
        const day = {
          week: currentDay.getDay() || 7,
          date: currentDay.getDate(),
          otherMonth: currentDay.getMonth() !== firstDayOfMonth.getMonth(),
        };
        days.push(day);
        currentDay.setDate(currentDay.getDate() + 1);
      }

      this.days = days;
    },
  },
  computed: {
    filteredFakeData() {
      return (day) => {
        return this.fakeData.filter((data) => data.day === day);
      };
    },
  },
  watch: {
    year() {
      this.handleYearMonthChange();
    },
    month() {
      this.handleYearMonthChange();
    },
  },

  mounted() {
    this.calculateWeeks(this.year, this.month);
  },
};
</script>

<style lang="less" scoped>
.calendar {
  width: 100%;
  min-width: 700px;
  padding: 0 5px;
}
.summary {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.calendar-header {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  .calendar-header-select {
    width: 80px;
    height: 35px;
    margin: 5px;
  }
  .calendar-header-button {
    margin: 5px;
  }
}

.calendar-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 5px 0;
}
.calendar-cell {
  width: 145px;
  height: 125px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  margin: 0 5px 5px 5px;
}
.calendar-cell.today {
  background-color: #e2f3d9;
}
.calendar-cell.other-month {
  color: #ccc;
}
.calendar-date {
  cursor: pointer;
}
.calendar-date-header {
  font-size: 14px;
  margin-bottom: 10px;
}
.calendar-date-num {
  font-size: 30px;
}
</style>
