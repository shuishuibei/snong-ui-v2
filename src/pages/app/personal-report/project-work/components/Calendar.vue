<template>
  <div class="calendar">
    <div class="summary">
      <card
        v-for="(item, index) of summerData"
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
      <!--<i-button type="primary" class="calendar-header-button">导出报表</i-button>-->
    </div>
    <div class="calendar-body">
      <div
        class="calendar-cell"
        v-for="(day, index) in days"
        :key="index"
        :class="cellClass(day)"
      >
        <template v-if="!day.otherMonth">
          <calendar-card
            @click.native="handleDateClick(day)"
            v-for="data in filteredCalendarData(day)"
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
        <div v-else class="calendar-date">
          {{ day.date }} | {{ day.week }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "./Card.vue";
import CalendarCard from "./CalendarCard.vue";
const today = new Date();
const year = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => year - 5 + i); // 显示从当前年份前5年到后5年的年份
const months = Array.from({ length: 12 }, (_, i) => i + 1); // 生成1-12月的数组
export default {
  components: {
    Card,
    CalendarCard,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      days: [],
      summerData: [],
      calendarData: [],
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      weeks: [],
      years: years,
      months: months,
    };
  },
  methods: {
     // 获取日历页面日期数据
     getCalendarData() {
       this.$loading.show();
      this.$http.get(`/projectWorkState/month?projectId=${this.projectId}&yearMonth=${this.yearMonth}`).then(({ data }) => {
        if (data.status) {
          this.calendarData = data.data;
          this.generateData(this.year, this.month);
        }
        this.$loading.hide();
      });
    },
    // 获取日历页面统计数据
    getSummerData() {
      this.$http.get(`/projectWorkState/month/count?projectId=${this.projectId}&yearMonth=${this.yearMonth}`).then(({ data }) => {
        if (data.status) {
          this.summerData = this.convertData(data.data);
        }
      });
    },
    convertData(data) {
      const result = [
        { timePeriod: "日", finished: data.day ? data.day[1] : 0, total: data.day ? data.day[0] : 0 },
        { timePeriod: "周", finished: data.week ? data.week[1] : 0, total: data.week ? data.week[0] : 0 },
        { timePeriod: "月", finished: data.month ? data.month[1] : 0, total: data.month ? data.month[0] : 0 },
        { timePeriod: "季度", finished: data.quarter ? data.quarter[1] : 0, total: data.quarter ? data.quarter[0] : 0 },
        { timePeriod: "年", finished: data.year ? data.year[1] : 0, total: data.year ? data.year[0] : 0 },
        { timePeriod: "需", finished: data.temp ? data.temp[1] : 0, total: data.temp ? data.temp[0] : 0 }
      ];
      return result;
    },
    handleYearMonthChange() {
      this.getCalendarData();
      this.calculateWeeks(this.year, this.month);
    },
    // 生成数据
    generateData(year, month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        let targetDay = this.calendarData.find((item) => {
          return item.day === day;
        })
        // 当天没有数据，则生成空数据
        if (!targetDay) {
          let nullObj = {
            total: null,
            done: null,
          }
          this.calendarData.push({
            day: day,
            year: year,
            month: month,
            completed: true,
            dayState: nullObj,
            weekState: nullObj,
            monthState: nullObj,
            quarterState: nullObj,
            yearState: nullObj,
            tempState: nullObj,
          });
        }
      }
    },
    handleDateClick(day) {
      this.$emit('dateClick', {
        year: this.year,
        month: this.month,
        date: day.date
      });
    },
    cellClass(day) {
      // 当天的背景色为浅绿色
      if (!day.otherMonth && day.date === new Date().getDate()) {
        return "calendar-cell today";
      }
      return day.otherMonth ? "calendar-cell other-month" : "calendar-cell";
    },
    getWeekDay(date) {
      const formatter = new Intl.DateTimeFormat("zh-CN", { weekday: "short" });
      return formatter.format(date);
    },
    calculateWeeks(year, month) {
      const firstDayOfMonth = new Date(year, month - 1, 1); // 当月的第一天
      const lastDayOfMonth = new Date(year, month, 0); // 当月的最后一天
      const firstDayOfGrid = new Date(firstDayOfMonth); // 日历方格中的第一天（可能是上月的日期）
      // 如果当月的第一天不是周一，将 firstDayOfGrid 设置为上一个星期的周一
      if (firstDayOfMonth.getDay() !== 1) {
        firstDayOfGrid.setDate(1 - (firstDayOfGrid.getDay() || 7)); // 日期移到上一个星期的周一
      }
      this.days = [];
      let currentDay = new Date(firstDayOfGrid);
      while (currentDay <= lastDayOfMonth || currentDay.getDay() !== 1) {
        const day = {
          week: this.getWeekDay(currentDay),
          date: currentDay.getDate(),
          year: currentDay.getFullYear(), // 添加年份信息
          month: currentDay.getMonth() + 1, // 添加月份信息，注意要加 1
          otherMonth: currentDay.getMonth() !== firstDayOfMonth.getMonth(),
        };
        this.days.push(day);
        currentDay.setDate(currentDay.getDate() + 1);
      }
    },
  },
  computed: {
    filteredCalendarData() {
      return (day) => {
        let result = this.calendarData.filter((data) => {
          return data.day === day.date;
        });
        return result;
      };
    },
    yearMonth() {
      let month = `${this.month}`.padStart(2, '0');
      return `${this.year}-${month}`;
    },
  },
  watch: {
    projectId: {
      immediate: true,
      handler() {
        this.getSummerData();
        this.getCalendarData();
      },
    },
    year() {
      this.handleYearMonthChange();
    },
    month() {
      this.handleYearMonthChange();
    },
  },
  created() {
    // 第一行汇总数据，后期通过接口获取实际数据，通过convertData方法转换后赋值给summerData
    this.getSummerData();
    // 日历里展示的数据，后期通过接口获取实际数据，赋值给calendarData
    this.getCalendarData();
    this.calculateWeeks(this.year, this.month);
  },
};
</script>

<style lang="less" scoped>
.calendar {
  width: 100%;
  min-width: 700px;
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
  width: 165px;
  height: 125px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  padding: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.calendar-cell.today {
  background-color: #e2f3d9;
}
.calendar-cell.other-month {
  color: #ccc;
}
.calendar-date {
  width: 100%;
  font-weight: 800;
  font-size: 16px;
  line-height: 16px;
  padding: 5px 0;
  margin-left: -20px;
}
</style>
