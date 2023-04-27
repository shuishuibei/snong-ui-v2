<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <div>
      <!-- 搜索 -->
      <div class="cds-clearfix cds-margin-bottom-14">
        <Input
          clearable
          v-model="inputAlarmId"
          style="width: 6%"
          placeholder="请输入告警ID"
          @keyup.enter.native="handleSearch"
        >
        </Input>
        <Input
          clearable
          v-model="inputProjectName"
          style="width: 6.5%"
          placeholder="请输入项目名称"
          @keyup.enter.native="handleSearch"
        >
        </Input>
        <!--<Input-->
        <!--clearable-->
        <!--v-model="inputAlarmObject"-->
        <!--style="width: 8.5%"-->
        <!--placeholder="请输入资源名称"-->
        <!--&gt;-->
        <!--</Input>-->
        <!--<Input-->
        <!--clearable-->
        <!--v-model="inputKeywords"-->
        <!--style="width: 6%"-->
        <!--placeholder="请输入告警等级"-->
        <!--&gt;-->
        <!--</Input>-->
        <Input
          clearable
          v-model="inputKeywords"
          style="width: 20%"
          placeholder="请输入资源/告警等级/告警类型/告警概要/告警详情"
          @keyup.enter.native="handleSearch"
        >
        </Input>
        <el-select
          v-model="searchMap.collectStatus"
          placeholder="请选择收藏状态"
        >
          <el-option
            v-for="item in collectStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <i-button class="cds-btn-search" type="primary" @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
        <i-button type="primary" @click="flag.add = true">
          <i class="iconfont icon-plus">新增标签</i>
        </i-button>
        <div class="list-setting" style="float: right">
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
      <!-- 表格 -->
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
        <!-- <el-table-column type="selection" width="50" fixed> </el-table-column> -->
        <el-table-column width="40">
          <template slot-scope="scope">
            <i
              class="el-rate__icon el-icon-star-on"
              :style="{
                color:
                  scope.row.collectStatus === 'true'
                    ? 'rgb(247, 186, 42)'
                    : '#c0c4cc',
              }"
              :class="
                scope.row.collectStatus === 'true'
                  ? 'el-icon-star-on'
                  : 'el-icon-star-off'
              "
              @click="checkCollectStatus(scope.row)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          label="ID"
          width="80"
          prop="id"
          sortable
          v-if="showFields.id"
        >
          <template slot-scope="scope"> {{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column
          label="告警ID"
          width="100"
          prop="alarmId"
          sortable
          v-if="showFields.alarmId"
        >
          <template slot-scope="scope">{{ scope.row.alarmId }}</template>
        </el-table-column>
        <el-table-column
          label="项目名称"
          width="100"
          align="center"
          prop="projectName"
          sortable
          v-if="showFields.projectName"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.projectName }}</span></template
          >
        </el-table-column>
        <el-table-column
          label="资源/告警等级/告警类型/告警概要/告警详情"
          align="center"
          prop="keywords"
          sortable
          v-if="showFields.keywords"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.keywords }}</template>
        </el-table-column>
        <el-table-column
          label="创建人"
          width="150"
          align="center"
          prop="userName"
          sortable
          v-if="showFields.userName"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span></template
          >
        </el-table-column>

        <el-table-column
          label="创建时间"
          width="150"
          align="center"
          prop="createTime"
          sortable
          v-if="showFields.createTime"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column
          label="搜索次数"
          width="100"
          align="center"
          prop="times"
          sortable
          v-if="showFields.times"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.times }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="告警数量"
          width="100"
          align="center"
          prop="coverNumber"
          sortable
          v-if="showFields.coverNumber"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.coverNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="搜索类别"
          width="130"
          align="center"
          prop="labelType"
          sortable
          v-if="showFields.labelType"
          :show-overflow-tooltip="true"
          :formatter="filedLabelType"
        >
        </el-table-column>
        <el-table-column
          label="收藏数量"
          width="100"
          align="center"
          prop="collectNumber"
          sortable
          v-if="showFields.coverNumber"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.coverNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="收藏状态"
          width="100"
          align="center"
          prop="collectStatus"
          sortable
          v-if="showFields.collectStatus"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.collectStatus === "true" ? "已收藏" : "未收藏"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改" width="70" align="center" fixed="right">
          <template slot-scope="scope">
            <div @click="editLabel(scope.row)" :style="{ cursor: 'pointer' }">
              <i
                class="iconfont icon-edit-1-copy"
                :style="{ color: '#3399ff' }"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="删除" width="70" align="center" fixed="right">
          <template slot-scope="scope">
            <div @click="delLabel(scope.row)" :style="{ cursor: 'pointer' }">
              <i
                class="iconfont icon-shanchu"
                :style="{ color: '#3399ff' }"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
    <LabelAdd v-model="flag.add" title="告警标签新增" :dataList="{ add: true }">
    </LabelAdd>
    <!-- 修改 -->
    <LabelAdd v-model="flag.update" title="告警标签修改" :dataList="currentRow">
    </LabelAdd>

    <AlarmConfirm
      v-model="flag.conFirmBatch"
      title="告警标签批量确认"
      :dataList="this.alarmIds"
    >
    </AlarmConfirm>

    <ModalConfirm
      ref="deleteSingle"
      v-model="flag.delete"
      title="告警标签"
      :info="'确认删除：这条告警标签吗？'"
      @on-cancel="deleteIds = []"
      @on-ok="submitDelete"
      :showBackgroudColor="false"
    >
    </ModalConfirm>
  </div>
</template>

<script>
import LabelAdd from "./components/LabelAdd.vue";
import ModalConfirm from "@/components/modal-confirm/ModalConfirmTemp.vue";
import AlarmConfirm from "./components/AlarmConfirm.vue";
export default {
  name: "alarm-label",
  components: {
    LabelAdd,
    ModalConfirm,
    AlarmConfirm,
  },
  data() {
    return {
      inputProjectName: "", //搜索框中显示的值
      deleteIds: [],
      inputKeywords: "", //模糊匹配的关键字
      inputAlarmId: "",
      // searchValue: '', //实际点击查询按钮发送的值
      searchMap: {
        projectName: "", // 项目名称
        alarmId: "",
        keywords: "",
        collectStatus: "", // 收藏状态
      },
      collectStatusList: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "true",
          label: "已收藏",
        },
        {
          value: "false",
          label: "未收藏",
        },
      ],
      //分页
      page: {
        pageSize: 20, //每页条数
        totalCount: 0, //总数
        totalPage: 1, //总页数
        currentPage: 1, //当前页码
      },
      // 筛选
      showFields: {
        id: true,
        alarmId: true,
        projectName: true,
        keywords: true,
        userName: true,
        createTime: true,
        times: true,
        coverNumber: true,
        labelType: true,
        collectNumber: true,
        collectStatus: true,
      },
      selectedList: {
        id: "ID",
        alarmId: "告警ID",
        projectName: "项目名称",
        keywords: "资源/告警等级/告警类型/告警概要/告警详情",
        userName: "创建人",
        createTime: "创建时间",
        times: "搜索次数",
        coverNumber: "告警数量",
        labelType: "搜索类别",
        collectNumber: "收藏数量",
        collectStatus: "收藏状态",
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
        delete: false, //删除
        conFirmBatch: false, // 批量确认
        update: false, // 修改
      },
    };
  },
  computed: {},
  methods: {
    filedLabelType(row) {
      return row.labelType == 1
        ? "普通搜索标签"
        : row.labelType == 2
        ? "固定项目查询标签"
        : "";
    },
    checkCollectStatus(row) {
      this.$http
        .post(
          `alarm/labelUser/${row.collectStatus === "true" ? `delete` : `add`}`,
          { labelId: row.id }
        )
        .then(({ data }) => {
          //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
          if (data.status) {
            //删除成功后的提示信息
            this.$Notice.success({
              desc: data.message,
            });
            this.getTableData({ loading: true });
          } else {
            this.$Notice.error({
              desc: data.message,
            });
          }
        });
    },
    // 编辑
    editLabel(row) {
      // 设置当前操作行
      this.currentRow = row;
      this.flag.update = true;
    },
    // 删除
    delLabel(row) {
      //设置当前操作行
      this.currentRow = row;
      this.deleteIds = [row.id];
      this.flag.delete = true;
    },
    //点击查询按钮触发
    handleSearch() {
      //将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchMap.projectName = this.inputProjectName.trim();
      this.searchMap.keywords = this.inputKeywords.trim();
      this.searchMap.alarmId = this.inputAlarmId.trim()
      //请求表格数据：不显示缓冲状态，保留每页条数
      this.getTableData({
        loading: true,
        pageSize: this.page.pageSize,
      });
    },

    //点击刷新按钮触发dateUtil
    handleRefresh() {
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
      this.searchMap.keywords = this.inputKeywords = "";
      this.searchMap.alarmId = this.inputAlarmId = "";
      this.searchMap.collectStatus = "";
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
        case "asc":
          flag = true;
          break;
        case "desc":
          flag = false;
          break;
        case "normal":
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
      //发送请求并且做相应处理
      this.$http
        .post(`alarm/label/page/list`, {
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
        strDate = date.getDate() - 1, // 获取当前日(1-31)
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
    //提交删除
    submitDelete() {
      // console.log(this.deleteIds)
      this.$http
        .post(`alarm/label/delete`, { id: this.deleteIds[0] })
        .then(({ data }) => {
          //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
          if (data.status) {
            //删除成功后的提示信息
            this.$Notice.success({
              desc: "删除告警标签成功",
            });
            this.getTableData({ loading: true });
          } else {
            this.$Notice.error({
              desc: "删除告警标签失败！",
            });
          }
        });
    },
  },

  //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
  created() {
    this.getTableData({ loading: true });
  },
};
</script>
<style>
.d-bord {
  height: 110px;
  width: 250px;
  margin-bottom: 18px;
  color: #666;
  cursor: pointer;
  border-radius: 5px 4px 4px 40px rgb(0 0 0 / 7%);
  box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
  border-color: rgba(0, 0, 0, 0.05);
  float: left;
}
.l-bord {
  height: 80px;
  width: 80px;
  /*border: 1px solid #5EBBF7;*/
  margin-bottom: 8px;
  float: left;
  margin: 15px 15px 15px 15px;
}

.r-bord {
  height: 80px;
  width: 100px;
  margin-bottom: 8px;
  float: left;
  margin: 15px 15px 15px 15px;
}
.r-t-bord {
  height: 39px;
  width: 90px;
  clear: both;
  text-align: right;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 19px;
  font-weight: bold;
}
.r-b-bord {
  height: 39px;
  width: 90px;
  text-align: right;
  font-size: 20px;
  font-weight: bold;
}

.d-hover:hover {
  color: #fff !important;
  background: #dbdbdb !important;
}
.d-hover {
  color: #fff;
  background: #dbdbdb;
}

.l-hover:hover {
  color: #fff !important;
  background: #f4516c !important;
}

.r-hover:hover {
  color: #fff !important;
  background: #34bfa3 !important;
}
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
</style>


