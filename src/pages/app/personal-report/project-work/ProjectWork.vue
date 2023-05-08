<template>
  <div class="task-manage">
    <!-- 顶部 -->
    <work-list
      v-if="dateClickFlag"
      :projectName="projectName"
      :projectId="projectId"
      :date="workListDate"
      @close="dateClickFlag = false"
    ></work-list>
    <div class="content-wrapper" v-else>
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
          <calendar @dateClick="dateClick" :projectId="projectId"></calendar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FTree from "@/components/h3c-tree/index";
import CalendarCard from "./components/CalendarCard.vue";
import Calendar from "./components/Calendar.vue";
import WorkList from "./components/WorkList.vue";

export default {
  name: "ProjectWork",
  components: {
    "h3c-tree": FTree,
    CalendarCard,
    Calendar,
    WorkList,
  },
  data() {
    return {
      inspectionDate: new Date().toISOString().slice(0, 10),
      resourceTreeArr: [], // 资源列表
      searchValue: "", // 资源列表实际搜索值
      inputName: "", // 资源列表所填搜索值
      projectName: "", // 资源列表当前选中项
      projectId: "", // 资源列表当前选中项的id
      dateClickFlag: false,
      workListDate: "", // 工作清单页面展示日期
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
    dateClick(params) {
      let { year, month, date } = params;
      this.workListDate = this.$moment(`${year}-${month}-${date}`).format('YYYY-MM-DD');
      this.dateClickFlag = true;
    },
    // 更改日期的格式
    formDate(data, formatType) {
      let type = Object.prototype.toString.call(data);
      if (type == "[object Date]") {
        var format = formatType ? formatType : "yyyy-MM-DD";
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
        return data;
      }
    },
    // 处理列表数据
    handleResource(resp) {
      this.resourceTreeArr = [];
      resp.forEach((item, index) => {
        this.resourceTreeArr.push({
          id: item.id,
          title: item.projectName, // 显示的列表名称
          selected: index === 0, // 默认选择第一个列表
        });
      });
      this.projectName = this.resourceTreeArr[0]
        ? this.resourceTreeArr[0].title
        : "";
      this.projectId = this.resourceTreeArr[0]
        ? this.resourceTreeArr[0].id
        : "";
    },
    // 获取列表数据
    getResourceList() {
      this.$http.get("/project-management/task/list").then(({ data }) => {
        if (data.status) {
          this.handleResource(data.data);
        }
      });
    },
    // 列表选中项改变时触发
    resourceChange(list) {
      this.projectName = list[0].title;
      this.projectId = list[0].id;
    },
    // 查询列表数据
    searchResource() {
      this.searchValue = this.inputName.trim();
      if (
        this.searchValue !== "" &&
        this.searchValue !== null &&
        this.searchValue !== undefined
      ) {
        this.$http
          .get(`project-management/task/list?projectName=${this.searchValue}`)
          .then(({ data }) => {
            if (data.status) {
              this.handleResource(data.data);
            }
          });
      } else {
        this.getResourceList();
      }
    },
  },
  // Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
  created() {
    this.getResourceList();
  },
};
/* eslint-enable */
</script>

<style scoped lang="less">
/deep/ .ivu-tree-arrow {
  width: 0;
  display: block;
}
/deep/ .ivu-tree-title-selected,
.ivu-tree-title-selected:hover {
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
  height: 100%;
  position: relative;
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
</style>
