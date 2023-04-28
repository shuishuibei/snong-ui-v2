<template>
  <div>
    <div class="month-calendar">
      <div class="month-calendar-header">
        <div class="month-calendar-header-nav">
          <button class="month-calendar-header-nav-btn" @click="prevMonth">
            Prev
          </button>
          <div class="month-calendar-header-nav-title">
            {{ year }}年{{ month }}月
          </div>
          <button class="month-calendar-header-nav-btn" @click="nextMonth">
            Next
          </button>
        </div>
      </div>
      <div class="month-calendar-body">
        <div
          class="month-calendar-row"
          v-for="(week, index) in weeks"
          :key="index"
        >
          <div
            class="month-calendar-cell"
            v-for="day in week"
            :key="day.date"
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
            <div
              v-else
              class="month-calendar-date"
              @click="handleDateClick(day)"
            >
              <div class="month-calendar-date-header">
                {{ day.week }} | {{ day.date }}
              </div>
              <div class="month-calendar-date-num">{{ day.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarCard from "./CalendarCard.vue";
export default {
  components: {
    "calendar-card": CalendarCard,
  },
  data() {
    const today = new Date();
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      weeks: [],
      fakeData: this.generateFakeData(year, month),
    };
  },
  methods: {
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
            total: total,
            done: done,
          },
          yearState: {
            total: total,
            done: done,
          },
          tempState: {
            total: total,
            done: done,
          },
        });
      }
      return fakeData;
    },
    prevMonth() {
      if (this.month === 1) {
        this.year -= 1;
        this.month = 12;
      } else {
        this.month -= 1;
      }
      this.calculateWeeks();
    },
    nextMonth() {
      if (this.month === 12) {
        this.year += 1;
        this.month = 1;
      } else {
        this.month += 1;
      }
      this.calculateWeeks();
    },
    handleDateClick(day) {
      if (!day.otherMonth) {
        console.log(`Clicked on ${this.year}-${this.month}-${day.date}`);
      }
    },
    cellClass(day) {
      // 当天的背景色为浅绿色
      if (!day.otherMonth && day.date === new Date().getDate()) {
        return "month-calendar-cell today";
      }
      return day.otherMonth
        ? "month-calendar-cell other-month"
        : "month-calendar-cell";
    },
    calculateWeeks() {
      const firstDayOfMonth = new Date(this.year, this.month - 1, 1); // 当月的第一天
      const lastDayOfMonth = new Date(this.year, this.month, 0); // 当月的最后一天
      const firstDayOfGrid = new Date(firstDayOfMonth); // 日历方格中的第一天（可能是上月的日期）
      firstDayOfGrid.setDate(1 - (firstDayOfGrid.getDay() - 1 || 7)); // 日期移到上一个星期的周一
      const weeks = [];
      for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
          const date = new Date(firstDayOfGrid);
          date.setDate(date.getDate() + i * 7 + j);
          const day = {
            week: j + 1,
            date: date.getDate(),
            otherMonth: date.getMonth() !== firstDayOfMonth.getMonth(),
          };
          week.push(day);
        }
        // 最后一个星期全部为下个月的日期不显示
        if (week.some((day) => day.date <= 7 || day.otherMonth)) {
          if (i === 5) {
            break;
          }
        }
        weeks.push(week);
      }
      this.weeks = weeks;
    },
  },
  computed: {
    filteredFakeData() {
      return (day) => {
        return this.fakeData.filter((data) => data.day === day);
      };
    },
  },
  mounted() {
    this.calculateWeeks();
  },
};
</script>

<style lang="less" scoped>
.month-calendar {
  width: 700px;
}

.month-calendar-header {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.month-calendar-header-nav {
  display: flex;
  align-items: center;
}

.month-calendar-header-nav-btn {
  background: none;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-size: 14px;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}

.month-calendar-header-nav-title {
  font-size: 16px;
  margin: 0 10px;
}

.month-calendar-body {
  display: flex;
  flex-wrap: wrap;
}

.month-calendar-row {
  display: flex;
  flex-wrap: nowrap;
  margin: 5px 0;
}

.month-calendar-cell {
  width: 135px;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  margin: 0 5px;
}

.month-calendar-cell.today {
  background-color: #e2f3d9;
}

.month-calendar-cell.other-month {
  color: #ccc;
}

.month-calendar-date {
  cursor: pointer;
}

.month-calendar-date-header {
  font-size: 14px;
  margin-bottom: 10px;
}

.month-calendar-date-num {
  font-size: 30px;
}
</style>
