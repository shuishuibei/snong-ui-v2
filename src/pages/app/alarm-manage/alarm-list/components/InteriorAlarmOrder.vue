<template>
  <div style="width: 100%">
    <div style="width: 100%">
      <!-- 搜索 -->
      <div class="cds-clearfix cds-margin-bottom-14">
        <Input
          clearable
          v-model="inputAlarmId"
          style="width: 7%"
          placeholder="请输入告警ID"
          @keyup.enter.native="handleSearch"
        >
        </Input>
        <Input
          clearable
          v-model="inputProjectName"
          style="width: 8%"
          placeholder="请输入项目名称"
          @keyup.enter.native="handleSearch"
        >
        </Input>
        <Input
          clearable
          v-model="inputKeywords"
          style="width: 20%"
          placeholder="请输入资源/告警等级/告警类型/告警概要/告警详情"
          @keyup.enter.native="handleSearch"
        >
        </Input>
        <DatePicker
          type="datetime"
          placeholder="选择开始时间"
          style="width: 9.5%"
          :value="pickStartDate"
          format="yyyy-MM-dd HH:mm:ss"
          v-if="false"
          @on-change="startDateChange"
        ></DatePicker>
        <!--&nbsp;&nbsp;至&nbsp;&nbsp;-->
        <DatePicker
          type="datetime"
          placeholder="选择结束时间"
          style="width: 9.5%; margin-right: 6px"
          :value="pickEndDate"
          v-if="false"
          format="yyyy-MM-dd HH:mm:ss"
          @on-change="endDateChange"
        ></DatePicker>
        <i-button class="cds-btn-search" type="primary" @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
        <i-button type="primary" @click="handleExcel">
          <i class="iconfont icon-daochu">导出全部</i>
        </i-button>
        <i-button
          type="primary"
          :disabled="alarmIds.length < 2"
          @click="flag.conFirmBatch = true"
        >
          <i class="iconfont icon-shuaxin1">批量确认</i>
        </i-button>
        <i-button class="cds-btn-refresh" type="primary" @click="handleRefresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
        <!--</div>-->
        <div class="list-setting">
          <el-dropdown trigger="click" :hide-on-click="false">
            <el-button
              size="mini"
              icon="icon el-icon-s-tools"
              class="f-comp-mini-margin"
            ></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(value, key) in showFields" :key="key">
                <el-checkbox v-model="showFields[key]">
                  {{ selectedList[key] }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <el-table
        ref="table"
        size="small"
        class="alarmTable"
        stripe
        border
        v-loading="tableConfig.loading"
        :data="tableConfig.data"
        @selection-change="selectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="50" fixed> </el-table-column>
        <el-table-column label="ID" width="70" prop="alarmId" sortable>
          <template slot-scope="scope">{{ scope.row.alarmId }}</template>
        </el-table-column>
        <el-table-column
          label="项目名称"
          width="100"
          align="center"
          prop="projectName"
          sortable
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.projectName }}</template>
        </el-table-column>
        <el-table-column
          label="告警状态"
          width="100"
          align="center"
          prop="alarmStatus"
          sortable
          v-if="showFields.alarmStatus"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span
              :style="{
                color:
                  scope.row.alarmStatus == '1' || scope.row.alarmStatus == '2'
                    ? 'green'
                    : 'red',
              }"
              >{{ alarmStatusList[scope.row.alarmStatus] }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="资源"
          width="150"
          align="center"
          prop="alarmObject"
          sortable
          v-if="showFields.alarmObject"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.alarmObject }}</template>
        </el-table-column>
        <el-table-column
          label="告警等级"
          width="100"
          align="center"
          prop="level"
          sortable
          v-if="showFields.level"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.level }}</template>
        </el-table-column>
        <el-table-column
          label="告警类型"
          width="120"
          align="center"
          prop="strategy"
          sortable
          v-if="showFields.strategy"
        >
          <template slot-scope="scope">{{ scope.row.strategy }}</template>
        </el-table-column>
        <el-table-column
          label="告警概要"
          width="170"
          align="center"
          prop="alarmOutline"
          sortable
          v-if="showFields.alarmOutline"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.alarmOutline }}</template>
        </el-table-column>
        <el-table-column
          label="告警详情"
          width="263"
          align="center"
          prop="alarmMessage"
          sortable
          v-if="showFields.alarmMessage"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.alarmMessage }}</template>
        </el-table-column>
        <el-table-column
          label="告警时间"
          width="135"
          align="center"
          prop="alarmTime"
          sortable
          v-if="showFields.alarmTime"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.alarmTime }}</template>
        </el-table-column>
        <el-table-column
          label="初次发生时间"
          width="135"
          align="center"
          prop="alarmFirstTime"
          sortable
          v-if="showFields.alarmFirstTime"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.alarmFirstTime }}</template>
        </el-table-column>
        <el-table-column
          label="持续时长"
          width="95"
          align="center"
          prop="alarmDuration"
          sortable
          v-if="showFields.alarmDuration"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{
            toHourMinute(scope.row.alarmTime, scope.row.alarmFirstTime)
          }}</template>
        </el-table-column>
        <el-table-column
          label="告警次数"
          width="135"
          align="center"
          prop="alarmTimes"
          sortable
          v-if="showFields.alarmTimes"
        >
          <template slot-scope="scope">{{ scope.row.alarmTimes }}</template>
        </el-table-column>
        <el-table-column label="操作" width="48" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-dropdown :hide-on-click="false">
                <span class="el-dropdown-link"
                  ><i
                    class="iconfont icon-plus"
                    :style="{ color: '#3399ff', cursor: 'pointer' }"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="confirmedOperate(scope.row)"
                    >告警确认</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="orderNoOperate(scope.row)"
                    >创建工单</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 -->

      <!-- 分页 -->
      <div class="page-wrapper clearfix cds-margin-bottom-14">
        <div class="cds-float-left">
          共有{{ page.totalCount }}条记录，当前页{{ page.currentPage }}/{{
            page.totalPage
          }}页
        </div>
        <div class="cds-float-right">
          <Page
            :total="page.totalCount"
            :current="page.currentPage"
            :page-size="page.pageSize"
            show-sizer
            size="small"
            placement="top"
            :page-size-opts="[10, 20, 50, 100]"
            @on-change="
              getTableData({ currentPage: $event, pageSize: page.pageSize })
            "
            @on-page-size-change="getTableData({ pageSize: $event })"
          >
          </Page>
        </div>
      </div>
    </div>
    <!-- 新增 -->
    <AlarmOrder v-model="flag.add" title="告警转工单" :dataList="currentRow">
    </AlarmOrder>
    <!-- 修改 -->
    <AlarmEdit v-model="flag.update" title="告警确认" :dataList="currentRow">
    </AlarmEdit>

    <AlarmConfirm
      v-model="flag.conFirmBatch"
      title="告警批量确认"
      :dataList="this.alarmIds"
    >
    </AlarmConfirm>
    <!-- 新增 -->

    <AlarmPolicyAdd
      v-model="flag.addPolicy"
      title="告警屏蔽策略新增"
      :dataList="currentRow"
    >
    </AlarmPolicyAdd>
  </div>
</template>

<script>
import AlarmEdit from "./AlarmEdit.vue";
import AlarmOrder from "./AlarmOrder.vue";
import AlarmPolicyAdd from "../../policy-list/components/AlarmPolicyAdd.vue";
import AlarmConfirm from "./AlarmConfirm.vue";

export default {
  name: "alarm-manage",
  components: {
    AlarmEdit,
    AlarmOrder,
    AlarmPolicyAdd,
    AlarmConfirm,
  },
  data() {
    return {
      alarmStatusList: {
        0: "未恢复",
        1: "已恢复",
        2: "部分恢复",
        3: "全部未恢复",
      },

      /**
       * 搜索功能定义两个变量inputValue和searchValue
       * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
       */
      inputProjectName: "", //搜索框中显示的值
      inputKeywords: "", //模糊匹配的关键字
      inputAlarmId: "",
      alarmStatusCard: "",
      pickStartDate: "",
      pickEndDate: "",
      // searchValue: '', //实际点击查询按钮发送的值
      searchMap: {
        projectName: "", // 项目名称
        alarmId: "",
        keywords: "",
        alarmStatus: "",
        policyStatus: 2,
        startDate: "", // 开始日期
        endDate: "", //结束日期
      },
      //分页
      page: {
        pageSize: 20, //每页条数
        totalCount: 0, //总数
        totalPage: 1, //总页数
        currentPage: 1, //当前页码
      },

      // 筛选
      showFields: {
        // alarmId: true,
        // projectName: true,
        alarmStatus: true,
        alarmObject: true,
        level: true,
        strategy: true,
        alarmOutline: true,
        alarmMessage: true,
        alarmTime: true,
        alarmFirstTime: true,
        alarmDuration: true,
        alarmTimes: true,
      },
      selectedList: {
        // alarmId: "ID",
        // projectName: "项目名称",
        alarmStatus: "告警状态",
        alarmObject: "资源",
        level: "告警等级",
        strategy: "告警类型",
        alarmOutline: "告警概要",
        alarmMessage: "告警详情",
        alarmTime: "告警时间",
        alarmFirstTime: "初次发生时间",
        alarmDuration: "持续时长",
        alarmTimes: "告警次数",
      },
      //表格配置信息
      tableConfig: {
        key: new Date().toString(), //表格的属性key
        loading: false, //表格是否加载中
        data: [], //表格中的数据
      },
      filterMap: {}, //表格筛选参数
      orderMap: {}, //表格排序参数
      alarmIds: [], //表格中选中的数据
      currentRow: {}, //表格中当前操作行
      //对话框标志位
      flag: {
        add: false, //新增
        addPolicy: false, //新增告警屏蔽
        delete: false, //删除
        conFirmBatch: false, // 批量确认
        update: false, // 修改
      },
    };
  },
  props: ["parentRow"],
  watch: {
    "parentRow.policyId": {
      handler(val) {
        if (val) {
          this.pickStartDate = this.getNowFormatDateBefore();
          this.pickEndDate = this.getNowFormatDate();
          this.searchMap.policyId = val;
          this.getTableData({ loading: true });
        }
      },
      deep: true, // 深度监听
      immediate: true, // 初次监听即执行
    },
  },
  computed: {},
  methods: {
    // 告警确认操作按钮
    confirmedOperate(row) {
      if (row.confirmed === 1) {
        this.$Notice.success({
          desc: "已确认",
        });
        return;
      }
      // 设置当前操作行
      this.currentRow = row;
      if (row.alarmStatus == 1) {
        this.$Notice.error({
          desc: "已恢复的告警不能确认！",
        });
      } else {
        if (row.confirmed == 0) {
          this.flag.update = true;
        }
      }
    },
    // 创建工单操作按钮
    orderNoOperate(row) {
      //设置当前操作行
      this.currentRow = row;
      if (row.orderNo == null) {
        if (row.confirmed == 0 && row.alarmStatus == 0) {
          this.$Notice.warning({
            desc: "请您先确认告警之后，再创建工单！",
          });
        } else {
          this.flag.add = true;
        }
      } else {
        window.open(
          "http://opscloud.h3c.com/o/bk_itsm/#/ticket/detail?id=" +
            row.orderNo.split("+")[0] +
            "&from=AllTicket"
        );
      }
    },

    // 添加策略操作按钮
    addPolicyOperate(row) {
      //设置当前操作行
      this.currentRow = row;
      this.flag.addPolicy = true;
    },

    //点击查询按钮触发
    handleSearch() {
      //将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchMap.projectName = this.inputProjectName.trim();
      this.searchMap.keywords = this.inputKeywords.trim();
      this.searchMap.alarmId = this.inputAlarmId.trim();
      this.searchMap.startDate = this.pickStartDate;
      this.searchMap.alarmStatus = this.alarmStatusCard.trim();
      this.searchMap.endDate = this.pickEndDate;
      //请求表格数据：不显示缓冲状态，保留每页条数
      this.getTableData({
        loading: true,
        pageSize: this.page.pageSize,
      });
    },

    //点击下载
    handleExcel() {
      //   this.$http.post(`alarm/excel`).then(({data}) => {
      // })
      this.loading = true;
      this.$http({
        method: "GET",
        url:
          `alarm/excel?projectName=` +
          this.searchMap.projectName +
          "&alarmStatus=" +
          this.searchMap.alarmStatus +
          "&policyStatus=" +
          this.searchMap.policyStatus +
          "&alarmId=" +
          this.searchMap.alarmId +
          "&keywords=" +
          this.searchMap.keywords +
          "&startDate=" +
          this.searchMap.startDate +
          "&endDate=" +
          this.searchMap.endDate,
        responseType: "blob",
      }).then((res) => {
        window.open(res.config.url);
        this.$Notice.success({
          desc: "告警数据导出成功！",
        });
        this.loading = true;
      });
    },
    // 修改开始日期
    startDateChange(startTime) {
      this.pickStartDate = startTime;
    },
    // 修改结束日期
    endDateChange(endTime) {
      console.log("!endTime", !endTime);
      if (!endTime) {
        this.pickEndDate = this.getNowFormatDate();
      } else {
        this.pickEndDate = endTime;
      }
    },
    //点击刷新按钮触发dateUtil
    handleRefresh() {
      this.pickStartDate = this.getNowFormatDateBefore();
      this.pickEndDate = this.getNowFormatDate();
      //清空搜索输入框
      this.setInputEmpty();
      //清空筛选
      this.filterMap = {};
      //清空排序
      this.orderMap = {};
      //重设Table组件的key，促使Table组件重新渲染
      this.tableConfig.key = new Date().toString();
      //请求表格数据：显示缓冲状态，保留每页条数
      this.getTableData({
        loading: true,
        pageSize: this.page.pageSize,
      });
    },
    /**
     * @description 分页切换时触发的方法
     * @param {object} option
     * @param {number} option.current
     * @param {number} option.pageSize
     * @returns {void}
     */
    handlerChangePage({ current = 1, pageSize = 20 } = {}) {
      this.page.current = current;
      this.page.pageSize = pageSize;
      this.getTableData({ pageSize: this.page.pageSize });
    },
    //清空搜索框
    setInputEmpty() {
      this.searchMap.projectName = this.inputProjectName = "";
      this.searchMap.alarmStatus = this.alarmStatusCard = "";
      this.searchMap.keywords = this.inputKeywords = "";
      this.searchMap.alarmId = this.inputAlarmId = "";
    },
    //表格选中项发生变化时触发
    selectionChange(selection) {
      //清空表格中选中的数据
      this.alarmIds = [];
      //重置选中项
      selection.forEach((item) => {
        this.alarmIds.push(item.alarmId);
      });
    },
    /**
     * 当表格点击排序时触发
     * @param column {object} 当前列数据
     * @param key {string} 排序依据的指标，即当前列的key值
     * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     */
    sortChange({ column, key, order }) {
      let flag;
      //将order转换为true或false，true为升序，false为降序
      switch (order) {
        case "ascending":
          flag = true;
          break;
        case "descending":
          flag = false;
          break;
        case "null":
        default:
          flag = undefined;
      }
      this.orderMap = { [key]: flag };
      this.getTableData({ pageSize: this.page.pageSize });
    },
    /**
     * 发送请求获取表格数据，并且做相应处理
     * @param loading {boolean} 表格缓冲，默认值为false
     * @param currentPage {number} 分页当前页，默认值为第一页
     * @param pageSize {number} 分页每页条数，默认值为每页10条
     */
    getTableData({ loading = false, currentPage = 1, pageSize = 20 } = {}) {
      if (loading) {
        //设置表格缓冲
        this.tableConfig.loading = loading;
        //将表格数据data设置为空数组
        this.tableConfig.data = [];
      }
      //设置分页每页条数
      this.page.pageSize = pageSize;
      //设置分页当前页
      this.page.currentPage = currentPage;
      //清空表格中选中的数据（除了批量删除其他操作都需要清空该值，故在获取数据时清空）
      this.alarmIds = [];
      this.searchMap.startDate = this.pickStartDate;
      this.searchMap.endDate = this.pickEndDate;
      //发送请求并且做相应处理
      this.$http
        .post(`alarm/page/list`, {
          current: currentPage,
          orderMap: this.orderMap,
          pageSize: pageSize,
          searchMap: {
            // url: this.searchValue,     //不包含下拉框联动时的传参方式
            ...this.searchMap, //包含下拉框联动时的传参方式
            ...this.filterMap,
          },
        })
        .then(({ data }) => {
          //请求状态status为true时的处理，为false不需要单独处理（因为在入口文件中已经做了全局处理）
          if (data.status) {
            let resp = data.data;
            //将获取的分页数据赋值给表格数据data
            this.tableConfig.data = resp.records;
            //设置分页总条数
            this.page.totalCount = resp.total;
            //设置分页总页数，当总页数为0时显示为1
            this.page.totalPage = resp.pages ? resp.pages : 1;
          }

          //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
          loading ? (this.tableConfig.loading = false) : "";
        });
    },

    getNowFormatDateBefore() {
      let date = new Date(),
        seperator1 = "-", //格式分隔符
        seperator2 = ":",
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate();
      if (month >= 1 && month <= 9) month = "0" + month; // 如果月份是个位数，在前面补0
      if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate; // 如果日是个位数，在前面补0
      let currentdate =
        year + seperator1 + month + seperator1 + strDate + " 00:00:00";
      return currentdate;
    },
    getNowFormatDate() {
      let date = new Date(),
        seperator1 = "-", //格式分隔符
        seperator2 = ":",
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate(), // 获取当前日(1-31)
        hours = date.getHours(),
        menutes = date.getMinutes(),
        seconds = date.getSeconds();
      if (month >= 1 && month <= 9) month = "0" + month; // 如果月份是个位数，在前面补0
      if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate; // 如果日是个位数，在前面补0
      let currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hours +
        seperator2 +
        menutes +
        seperator2 +
        seconds;
      return currentdate;
    },
    toHourMinute(alarmTime, alarmFirstTime) {
      var beginDate = new Date(alarmFirstTime);
      var endDate = new Date(alarmTime);
      var minutes = Math.floor((endDate - beginDate) / (1000 * 60));
      if (minutes > 1440) {
        return (
          Math.floor(minutes / 1440) +
          "天" +
          Math.floor((minutes / 60) % 24) +
          "小时" +
          (minutes % 60) +
          "分"
        );
      } else {
        return Math.floor(minutes / 60) + "小时" + (minutes % 60) + "分";
      }
    },
  },
  //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
  created() {},
};
</script>
<style>
.alarmTable {
  table-layout: fixed;
}
.alarmTable tbody tr td div span {
  word-wrap: break-word;
  white-space: normal;
}
</style>

<style scoped lang="less">
.search-wrapper,
.btn-wrapper {
  padding-bottom: 15px;
}

.page-wrapper {
  position: relative;
  margin-top: 12px;
}

.interior-table-box {
  padding: 20px 55px;
}

.list-setting {
  float: right;
}
</style>


