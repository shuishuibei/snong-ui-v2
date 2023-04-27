<template>
  <div class="weekly-report-table">
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix">
      <!-- 搜索 -->
        <!-- 下拉框联动搜索 -->
        <AutoComplete
          clearable
          v-model="inputValue"
          placeholder="请输入员工姓名"
          style="width: 160px;">
        </AutoComplete>
        <DatePicker type="date" placeholder="选择开始日期" style="width: 160px" v-model="pickStartDate" format="yyyy-MM-dd" @on-change="startDateChange"></DatePicker>
        &nbsp;&nbsp;至&nbsp;&nbsp;
        <DatePicker type="date" placeholder="选择结束日期" style="width: 160px;margin-right: 6px;" v-model="pickEndDate" format="yyyy-MM-dd" @on-change="endDateChange"></DatePicker>
        <i-button
          class="cds-btn-search"
          type="primary"
          @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      <!-- 按钮操作 -->
      <div class="cds-float-right-btn">
        <i-button
          type="primary"
          @click="handleAdd">
          <i class="iconfont icon-plus">新增</i>
        </i-button>
        <i-button
          type="primary"
          @click="handlePreview">
          <i class="iconfont icon-htmal5icon09">预览</i>
        </i-button>
        <i-button
          type="primary"
          @click="handleSendMail">
          <i class="iconfont icon-daochu">发送邮件</i>
        </i-button>
        <i-button
          type="primary" class="cds-btn-refresh"
          @click="handleRefresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <!-- 表格 -->
    <Table ref="table"
      class="cds-margin-top-14"
      size="small"
      stripe
      :key="tableConfig.key"
      :loading="tableConfig.loading"
      :columns="tableConfig.columns"
      :data="tableConfig.data"
      @on-sort-change="sortChange">
    </Table>
    <!-- 分页 -->
    <div class="cds-margin-top-14 cds-clearfix">
      <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
      <div class="cds-float-right">
        <Page :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          show-sizer
          size="small"
          placement="top"
          @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
          @on-page-size-change="getTableData({pageSize: $event})">
        </Page>
      </div>
    </div>
    <!-- 删除 -->
    <modal-confirm v-model="shouldModalShow.shouldWeeklyReportDeleteShow" title="删除周报" :info="'是否确认删除选中的周报？'" @on-ok="submitDelete" :showBackgroudColor="false"></modal-confirm>
    <!-- 发送邮件 -->
    <modal-confirm v-model="mailConfirmShow.mailShow" title="发送周报邮件" :info="'是否确认发送周报邮件？'" @on-ok="submitSend" :showBackgroudColor="false"></modal-confirm>
  </div>
</template>

<script>
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue';
export default {
  components: {
    'modal-confirm': ModalConfirm
  },
  data() {
    return {
      inputValue: '', // 搜索框中显示的值
      searchValue: '', // 实际点击查询按钮发送的值
      pickStartDate: '', // 选择起始日期
      pickEndDate: '', // 选择结束日期
      orderMap: {}, //表格排序参数
      // 分页
      page: {
        pageSize: 10, // 每页条数
        totalCount: 0, // 总数
        totalPage: 1, // 总页数
        currentPage: 1 // 当前页码
      },
      // 表格配置信息
      tableConfig: {
        key: new Date().toString(), //表格的属性key
        loading: false, //表格是否加载中
        //表格列的配置描述
        columns: [
          {
            title: '姓名',
            key: 'userName',
            width: 100,
            ellipsis: true,
            sortable: 'custom',
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.userName
                  },
                  style: {
                    color: '#3399ff',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.transferData = params.row;
                      // this.transferData.mode = 'preview'
                      // this.$emit('shouldComponentShow','shouldEditShow',this.transferData);
                      this.$emit(
                        'shouldComponentShow',
                        'shouldSinglePreviewShow',
                        this.transferData
                      );
                    }
                  }
                },
                params.row.userName
              );
            }
          },
          {
            title: '周报时间',
            width: 300,
            key: 'dateTo',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.dateTo
                  }
                },
                '云智运维服务部周报[' +
                  params.row.dateFrom +
                  '~' +
                  params.row.dateTo +
                  ']'
              );
            }
          },
          {
            title: '个人周报汇报',
            key: 'createDate',
            ellipsis: true,
            render: (h, params) => {
              let reportProjectString = '';
              params.row.reportProject.forEach((item, index) => {
                reportProjectString +=
                  item.projectName +
                  '，本周重点工作：' +
                  item.weekProgress +
                  '，工作成果输出：' +
                  (item.projectProgress.length > 0
                    ? item.projectProgress
                    : '无') +
                  '，问题与求助：' +
                  (item.projectRisk.length > 0 ? item.projectRisk : '无') +
                  '，下周工作计划：' +
                  (item.nextWeekPlan.length > 0 ? item.nextWeekPlan : '无；');
              });
              return h(
                'span',
                {
                  attrs: {
                    title: reportProjectString
                  }
                },
                reportProjectString
              );
            }
          },
          {
            title: '修改',
            width: 64,
            align: 'center',
            render: (h, params) => {
              let userName = params.row.userName,
                color = '#c5c8ce',
                active = false;
              if (userName === localStorage.getItem('userName')) {
                color = '#3399ff';
                active = true;
              }
              return h('div', [
                h('i', {
                  style: {
                    color: color
                  },
                  class: {
                    iconfont: true,
                    'icon-active': active,
                    'icon-edit-1-copy': true
                  },
                  on: {
                    click: () => {
                      if (userName === localStorage.getItem('userName')) {
                        this.transferData = params.row;
                        this.transferData.mode = 'modify';
                        this.$emit(
                          'shouldComponentShow',
                          'shouldEditShow',
                          this.transferData
                        );
                      }
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '删除',
            width: 64,
            align: 'center',
            render: (h, params) => {
              let userName = params.row.userName,
                color = '#c5c8ce',
                active = false;
              if (userName === localStorage.getItem('userName')) {
                color = '#3399ff';
                active = true;
              }
              return h('div', [
                h('i', {
                  style: {
                    color: color
                  },
                  class: {
                    iconfont: true,
                    'icon-shanchu': true,
                    'icon-active': active
                  },
                  on: {
                    click: () => {
                      if (userName === localStorage.getItem('userName')) {
                        this.transferData = {};
                        this.transferData = params.row;
                        this.shouldModalShow.shouldWeeklyReportDeleteShow = true;
                      }
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '复制新增',
            width: 84,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i', {
                  style: {
                    color: '#3399ff'
                  },
                  class: 'iconfont icon-active icon-ziyuan-xianxing',
                  on: {
                    click: () => {
                      this.transferData = params.row;
                      this.transferData.mode = 'copyAdd';
                      this.$emit(
                        'shouldComponentShow',
                        'shouldEditShow',
                        this.transferData
                      );
                    }
                  }
                })
              ]);
            }
          }
        ],
        data: [] //表格中的
      },
      shouldModalShow: {
        shouldWeeklyReportDeleteShow: false
      },
      mailConfirmShow: {
        mailShow: false
      },
      transferData: {}
    };
  },
  methods: {
    // 修改开始日期
    startDateChange(startTime) {
      this.pickStartDate = startTime;
    },
    // 修改结束日期
    endDateChange(endTime) {
      this.pickEndDate = endTime;
    },
    // 点击查询按钮触发
    handleSearch() {
      // 将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchValue = this.inputValue.trim();
      // 请求表格数据：不显示缓冲状态，保留每页条数
      this.getTableData({
        loading: true,
        pageSize: this.page.pageSize
      });
    },
    // 点击新增按钮触发
    handleAdd() {
      this.$emit('shouldComponentShow', 'shouldEditShow');
    },
    // 点击预览按钮触发
    handlePreview() {
      this.$emit(
        'shouldComponentShow',
        'shouldPreviewShow',
        this.tableConfig.data
      );
    },
    handleSendMail() {
      this.mailConfirmShow.mailShow = true;
    },
    // 点击刷新按钮触发
    handleRefresh() {
      // 清空搜索输入框
      this.inputValue = '';
      this.searchValue = '';
      this.pickStartDate = '';
      this.pickEndDate = '';
      this.orderMap = {};
      // 重设Table组件的key，促使Table组件重新渲染
      this.tableConfig.key = new Date().toString();
      this.getTableData({ loading: true });
    },
    /**
     * 当表格点击排序时触发
     * @param column {object} 当前列数据
     * @param key {string} 排序依据的指标，即当前列的key值
     * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     */
    sortChange({ column, key, order }) {
      let flag;
      // 将order转换为true或false，true为升序，false为降序
      switch (order) {
        case 'asc':
          flag = true;
          break;
        case 'desc':
          flag = false;
          break;
        case 'normal':
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
    getTableData({ loading = false, currentPage = 1, pageSize = 10 } = {}) {
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
      //发送请求并且做相应处理
      this.$http
        .post(`weekly-report/page/list`, {
          current: currentPage,
          orderMap: this.orderMap,
          pageSize: pageSize,
          searchMap: {
            userName: this.searchValue, //不包含下拉框联动时的传参方式
            dateFrom: this.pickStartDate,
            dateTo: this.pickEndDate
          }
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
          loading ? (this.tableConfig.loading = false) : '';
        });
    },
    // 确认发送邮件
    submitSend() {
      this.$loading.show();
      return this.$http.get('overview/weeklyExcel/send').then(({data}) => {
        if (data.status) {
          this.$loading.hide();
          this.$Notice.success({
            desc: '发送最新个人周报邮件成功。',
            duration: 2
          });
        } else {
          this.$loading.hide();
          this.$Notice.error({
            desc: '发送最新个人周报邮件失败。',
            duration: 2
          });
        }
      });
    },
    // 提交删除
    submitDelete() {
      // 提交删除HTTP请求
      this.$http({
        method: 'DELETE',
        url: `/weekly-report/delete/${this.transferData.id}`
      }).then(({ data }) => {
        // 新增成功后重新请求表格数据，表格缓冲且保留原每页条数（操作失败不作处理，已在入口文件做了统一处理）
        if (data.status) {
          // 新增成功后的提示信息
          this.$Notice.success({
            desc: '删除成功'
          });
          this.getTableData({ loading: false });
        }
      });
    }
  },
  created() {
    this.getTableData({ loading: true });
  }
};
</script>

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
