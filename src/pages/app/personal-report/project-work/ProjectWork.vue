<template>
    <div class="task-manage">
        <!-- 顶部 -->
        <div class="content-wrapper">
            <div class="resourceTree-wrapper cds-padding-14">
                <div class="resource-search">
                    <i-input
                        v-model="inputName"
                        placeholder="请输入项目名称"
                        clearable
                        style="flex: 1; margin-right: 4px"
                    >
                    </i-input>
                    <i-button
                        type="primary"
                        class="cds-btn-search"
                        @click="searchResource"
                    >
                      <i class="iconfont icon-iconfontsousuo"></i>
                    </i-button>
                </div>
                <div class="search-tree">
                    <h3c-tree
                        empty-text
                        ref="resourceTree"
                        :data="resourceTreeArr"
                        :search-text="searchValue"
                        @on-select-change="resourceChange"
                    >
                    </h3c-tree>
                </div>
            </div>
            <div class="detail-wrapper">
                <div class="detail-bottom cds-padding-14">
                  <div class="month-calendar">
                    <div class="month-calendar-header">
                      <div class="month-calendar-header-nav">
                        <button class="month-calendar-header-nav-btn" @click="prevMonth">Prev</button>
                        <div class="month-calendar-header-nav-title">{{ year }}年{{ month }}月</div>
                        <button class="month-calendar-header-nav-btn" @click="nextMonth">Next</button>
                      </div>
                    </div>
                    <div class="month-calendar-body">
                      <div class="month-calendar-row" v-for="(week, index) in weeks" :key="index">
                        <div class="month-calendar-cell" v-for="day in week" :key="day.date" :class="cellClass(day)">
                          <div class="month-calendar-date" @click="handleDateClick(day)">
                            <div class="month-calendar-date-header">{{ day.week }} | {{ day.date }}</div>
                            <div class="month-calendar-date-num">{{ day.date }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FTree from "@/components/h3c-tree/index";

export default {
    name: "ProjectWork",
    components: {
        "h3c-tree": FTree
    },
    data() {
      const today = new Date()
        return {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          weeks: [],
          inspectionDate: new Date().toISOString().slice(0, 10),
          resourceTreeArr: [], // 资源列表
          searchValue: "", // 资源列表实际搜索值
          inputName: "", // 资源列表所填搜索值
          projectName: "" // 资源列表当前选中项
        };
    },
    computed: {
        placeholder() {
        let label = this.selectList.filter((item) => {
            return item.value === this.selectValue;
        })[0].label;
        return `请输入${label}进行查询`;
        },
    },
    methods: {
        // 更改日期的格式
        formDate(data, formatType) {
            let type = Object.prototype.toString.call(data)
            if(type == "[object Date]") {
                var format = formatType ? formatType : 'yyyy-MM-DD'
                let time = {
                    "M+": data.getMonth() + 1,
                    "D+": data.getDate(),
                    "H+": data.getHours(),
                    "m+": data.getMinutes(),
                    "s+": data.getSeconds(),
                };
                if (/(y+)/i.test(format)) {
                    format = format.replace(
                    RegExp.$1,
                    (data.getFullYear() + "").substr(4 - RegExp.$1.length)
                    );
                }
                for (let k in time) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(
                            RegExp.$1,
                            RegExp.$1.length === 1
                            ? time[k]
                            : ("00" + time[k]).substr(("" + time[k]).length)
                        );
                    }
                }
                return format;
            } else {
                return data
            }
        },
        // 处理列表数据
        handleResource(resp) {
            this.resourceTreeArr = []
            resp.forEach((item, index) => {
                this.resourceTreeArr.push({
                    id: item.id,
                    title: item.projectName, // 显示的列表名称
                    selected: index === 0, // 默认选择第一个列表
                });
            });
            this.projectName = this.resourceTreeArr[0] ? this.resourceTreeArr[0].title : ""
        },
        // 获取列表数据
        getResourceList() {
            this.$http.get("/project-management/task/list").then(({ data }) => {
                if (data.status) {
                    this.handleResource(data.data)
                }
            });
        },
        // 列表选中项改变时触发
        resourceChange(list) {
            this.projectName = list[0].title
        },
        // 查询列表数据
        searchResource() {
            this.searchValue = this.inputName.trim()
            if(this.searchValue !== '' && this.searchValue !== null && this.searchValue !== undefined) {
                this.$http.get(`project-management/task/list?projectName=${this.searchValue}`).then(({ data }) => {
                    if(data.status) {
                        this.handleResource(data.data)
                    }
                })
            } else {
                this.getResourceList()
            }
        },
      calculateWeeks () {
        const firstDayOfMonth = new Date(this.year, this.month - 1, 1) // 当月的第一天
        const lastDayOfMonth = new Date(this.year, this.month, 0) // 当月的最后一天
        const firstDayOfGrid = new Date(firstDayOfMonth) // 日历方格中的第一天（可能是上月的日期）
        firstDayOfGrid.setDate(1 - (firstDayOfGrid.getDay() - 1 || 7)) // 日期移到上一个星期的周一
        const weeks = []
        for (let i = 0; i < 6; i++) {
          const week = []
          for (let j = 0; j < 7; j++) {
            const date = new Date(firstDayOfGrid)
            date.setDate(date.getDate() + i * 7 + j)
            const day = {
              week: j + 1,
              date: date.getDate(),
              otherMonth: date.getMonth() !== firstDayOfMonth.getMonth()
            }
            week.push(day)
          }
          // 最后一个星期全部为下个月的日期不显示
          if (week.some(day => day.date <= 7 || day.otherMonth)) {
            if (i === 5) {
              break
            }
          }
          weeks.push(week)
        }
        this.weeks = weeks
      },
      prevMonth () {
        if (this.month === 1) {
          this.year -= 1
          this.month = 12
        } else {
          this.month -= 1
        }
        this.calculateWeeks()
      },
      nextMonth () {
        if (this.month === 12) {
          this.year += 1
          this.month = 1
        } else {
          this.month += 1
        }
        this.calculateWeeks()
      },
      handleDateClick (day) {
        if (!day.otherMonth) {
          console.log(`Clicked on ${this.year}-${this.month}-${day.date}`)
        }
      },
      cellClass (day) {
        // 当天的背景色为浅绿色
        if (!day.otherMonth && day.date === new Date().getDate()) {
          return 'month-calendar-cell today'
        }
        return day.otherMonth ? 'month-calendar-cell other-month' : 'month-calendar-cell'
      }
    },
    // Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
    created() {
        this.getResourceList();
    },
  mounted () {
    this.calculateWeeks()
  },
};
/* eslint-enable */
</script>

<style scoped lang="less">
/deep/ .ivu-tree-arrow {
    width: 0;
    display: block;
}
/deep/ .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
    width: 100%;
    border-left: 2px solid #39f;
}
/deep/ .ivu-tree-title {
    padding: 10px 10px 10px 20px;
    border-radius: 0;
    width: 100%;
}
/deep/ .ivu-tree ul {
    font-size: 14px;
}
/deep/ .ivu-tree ul li {
    margin: 0;
}
.task-manage {
    width: 100%;
    min-height: 100%;
    position: relative;
    //.header-wrapper {
    //    width: 100%;
    //    background-color: #fff;
    //    border: 1px solid #d8e0eb;
    //    .search-wrapper,
    //    .btn-wrapper {
    //        display: inline-block;
    //    }
    //}
    .content-wrapper {
        position: absolute;
        width: 100%;
        //min-width: 1176px;
        top: 0px;
        bottom: 0;
        .resourceTree-wrapper {
            position: absolute;
            width: 200px;
            height: 100%;
            background-color: #fff;
            border: 1px solid #d8e0eb;
            overflow: auto;
            .resource-search {
                display: flex;
                margin-bottom: 8px;
            }
            .search-tree {
                overflow: auto;
                height: calc(100% - 40px);
            }
        }
        .detail-wrapper {
            position: absolute;
            height: 100%;
            left: 208px;
            right: 0;
            color: #383f51;
            .detail-bottom {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: #fff;
                border: 1px solid #d8e0eb;
                overflow: auto;
            }
        }
    }
}
.inspection-box {
    margin-right: 14px;
}
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
