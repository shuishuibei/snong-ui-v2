<template>
  <div>
    <div class="home-top">
      <div class="ht-left ht-box">
        <div class="htl-titleBox titleBox">
          <span class="hasBeenSendNum sendNum">{{String(this.sendNames.length).length < 2 ? '0' + String(this.sendNames.length) : this.sendNames.length}}</span>
          <p>已填写周报人数</p>
        </div>
        <div class="allname-box">
          <div class="sendName allName">
            <div v-if="sendNames.length > 0">
              <ul>
                <li v-for="item in sendNames"><a href="javascript:;" @click="handleAnchors(item)">{{item}}</a></li>
              </ul>
             <!-- <ul v-if="type === 'preview-person'">
                <li v-for="item in sendNames"><a href="javascript:;" @click="transferName(item)">{{item}}</a></li>
              </ul>-->
            </div>
            <div v-else>暂无</div>
          </div>
        </div>
      </div>
      <div class="ht-right ht-box">
        <div class="titleBox">
          <span class="unsendNum sendNum">{{String(this.unSendNames.length).length < 2 ? '0' + String(this.unSendNames.length) : this.unSendNames.length}}</span>
          <p>未填写周报人数</p>
        </div>
        <div class="allname-box">
          <div class="unsendName allName">
            <div v-if="unSendNames.length > 0">
              <ul>
                <li v-for="item in unSendNames">{{item}}</li>
              </ul>
            </div>
            <div v-else>暂无</div>
          </div>
        </div>

      </div>
    </div>
    <!-- 头部搜索和按钮操作 -->
      <!-- 搜索 -->
      <div class="cds-clearfix cds-margin-bottom-14">
        <AutoComplete
          clearable
          v-model="inputUserName"
          placeholder="请输入员工姓名"
          style="width: 120px;">
        </AutoComplete>
        <DatePicker
          type="date"
          style="width: 140px"
          format="yyyy-MM-dd"
          placeholder="选择开始日期"
          v-model="pickStartDate"
          @on-change="startDateChange">
        </DatePicker>
        &nbsp;&nbsp;至&nbsp;&nbsp;
        <DatePicker
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择结束日期"
          style="width: 140px;margin-right: 6px;"
          v-model="pickEndDate"
          @on-change="endDateChange">
        </DatePicker>
        <i-button
          class="cds-btn-search"
          type="primary"
          @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
        <!-- 按钮操作 -->
        <div class="cds-float-right">
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
            <Tooltip placement="top" :transfer="true" content="本周一至周日只能发送上周周报">
            <i class="iconfont icon-daochu">发送邮件</i>
            </Tooltip>
          </i-button>
          <i-button
            class="cds-btn-refresh"
            type="primary"
            @click="handleRefresh">
            <i class="iconfont icon-shuaxin1"></i>
          </i-button>
        </div>
      </div>
      <!-- 表格 -->
      <Table ref="table"
             size="small"
             stripe
             :key="tableConfig.key"
             :loading="tableConfig.loading"
             :columns="tableConfig.columns"
             :data="tableConfig.data"
             @on-sort-change="sortChange">
      </Table>
      <!-- 分页 -->
      <div class="page-wrapper clearfix cds-margin-bottom-14">
        <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
        <div class="cds-float-right">
          <Page :total="page.totalCount"
                :current="page.currentPage"
                :page-size="page.pageSize"
                show-sizer
                size="small"
                placement="top"
                :page-size-opts="[10,20,50,100]"
                @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                @on-page-size-change="getTableData({pageSize: $event})">
          </Page>
        </div>
      </div>
    <!-- 单条删除 -->
    <ModalConfirm ref="deleteSingle"
                  v-model="flag.delete"
                  title="删除主机资产"
                  :info="'确认删除个人周报吗？'"
                  @on-ok="submitDelete"
                  :showBackgroudColor="false">
    </ModalConfirm>
    <!-- 发送邮件 -->
    <modal-confirm v-model="mailConfirmShow.mailShow" title="发送周报邮件" :info="'是否确认发送周报邮件？'" @on-ok="submitSend" :showBackgroudColor="false"></modal-confirm>
  </div>
</template>

<script>
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue';
export default {
  name: "work-report",
  components: {ModalConfirm},
  data() {
    return {
      /**
       * 搜索功能定义两个变量inputValue和searchValue
       * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
       */
      inputUserName: '', //搜索框中显示的值
      pickStartDate: '', // 选择起始日期
      pickEndDate: '', // 选择结束日期
      // searchValue: '', //实际点击查询按钮发送的值
      searchMap: {
        userName: "", // 用户姓名
        dateFrom: "",  // 开始日期
        dateTo: ""     // 结束日期
      },
      //分页
      page: {
        pageSize: 10,   //每页条数
        totalCount: 0,  //总数
        totalPage: 1,   //总页数
        currentPage: 1  //当前页码
      },
      //表格配置信息
      tableConfig: {
        key: new Date().toString(), //表格的属性key
        loading: false, //表格是否加载中
        //表格列的配置描述
        columns: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center',
          // },
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
            title: '本周重点工作',
            key: 'importWork',
            ellipsis: true,
            render: (h, params) => {
              return h('span', {
                attrs: {
                  title: params.row.importWork
                }
              }, params.row.importWork);
            }
          },
          {
            title: '本周其他工作',
            key: 'otherWork',
            ellipsis: true,
            render: (h, params) => {
              return h('span', {
                attrs: {
                  title: params.row.otherWork
                }
              }, params.row.otherWork);
            }
          },
          {
            title: '问题与求助',
            key: 'question',
            ellipsis: true,
            render: (h, params) => {
              return h('span', {
                attrs: {
                  title: params.row.question
                }
              }, params.row.question);
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            ellipsis: true,
            width: 160,
            align: 'center',
            sortable: 'custom',
            render: (h, params) => {
              let time = params.row.createTime
              time = time.replace(/T/g, ' ')
              return h('span', {
                attrs: {
                  title:time
                }
              }, time);
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
                        this.currentRow = params.row;
                        this.currentRow.mode = 'modify';
                        this.$emit(
                          'shouldComponentShow',
                          'shouldEditShow',
                          this.currentRow
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
                        this.currentRow = params.row;
                        this.flag.delete = true;
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
        data: []  //表格中的数据
      },
      filterMap: {},  //表格筛选参数
      orderMap: {},   //表格排序参数
      currentRow: {}, //表格中当前操作行
      //对话框标志位
      flag: {
        delete: false,  //删除
        update: false // 修改
      },
      mailConfirmShow: {
        mailShow: false
      },
      sendNames: [], // 已发送人员列表
      unSendNames: [] // 未发送人员列表
    }
  },
  computed: {},
  methods: {
    // 修改开始日期
    startDateChange(startTime) {
      this.pickStartDate = startTime;
    },
    // 修改结束日期
    endDateChange(endTime) {
      this.pickEndDate = endTime;
    },
    // 点击新增按钮触发
    handleAdd() {
      this.$emit('shouldComponentShow', 'shouldEditShow');
    },
    //点击查询按钮触发
    handleSearch() {
      //将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchMap.userName = this.inputUserName.trim()
      this.searchMap.dateFrom = this.pickStartDate.trim()
      this.searchMap.dateTo = this.pickEndDate.trim()
      //请求表格数据：不显示缓冲状态，保留每页条数
      this.getTableData({
        loading: true,
        pageSize: this.page.pageSize
      });
    },
    //点击刷新按钮触发
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
        pageSize: this.page.pageSize
      });
    },
    /**
     * @description 分页切换时触发的方法
     * @param {object} option
     * @param {number} option.current
     * @param {number} option.pageSize
     * @returns {void}
     */
    handlerChangePage({ current = 1, pageSize = 10 } = {}) {
      this.page.current = current;
      this.page.pageSize = pageSize;
      this.getTableData({pageSize: this.page.pageSize});
    },
    //清空搜索框
    setInputEmpty() {
      this.searchMap.userName = this.inputUserName = '';
      this.searchMap.dateFrom = this.pickStartDate = '';
      this.searchMap.dateTo = this.pickEndDate = '';
    },
    /**
     * 当表格点击排序时触发
     * @param column {object} 当前列数据
     * @param key {string} 排序依据的指标，即当前列的key值
     * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     */
    sortChange({column, key, order}) {
      let flag;
      //将order转换为true或false，true为升序，false为降序
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
      this.orderMap = {[key]: flag};
      this.getTableData({pageSize: this.page.pageSize});
    },
    /**
     * 发送请求获取表格数据，并且做相应处理
     * @param loading {boolean} 表格缓冲，默认值为false
     * @param currentPage {number} 分页当前页，默认值为第一页
     * @param pageSize {number} 分页每页条数，默认值为每页10条
     */
    getTableData({loading = false, currentPage = 1, pageSize = 10} = {}) {
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
      this.deleteIds = [];
      //发送请求并且做相应处理
      this.$http.post(`work/page/list`, {
        current: currentPage,
        orderMap: this.orderMap,
        pageSize: pageSize,
        searchMap: {
          // url: this.searchValue,     //不包含下拉框联动时的传参方式
          ...this.searchMap, //包含下拉框联动时的传参方式
          ...this.filterMap
        }
      }).then(({data}) => {
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
        loading ? this.tableConfig.loading = false : '';
      })
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
    // 确认发送邮件
    submitSend() {
      this.$loading.show();
      return this.$http.get('/work/email/send').then(({data}) => {
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
    //提交删除
    submitDelete() {
      this.$http.delete(`work/delete/${this.currentRow.id}`
      ).then(({data}) => {
        //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
        if (data.status) {
          //删除成功后的提示信息
          this.$Notice.success({
            desc: '删除个人周报成功'
          });
          this.getPersonnelCount();
          this.getTableData({loading: true});
        } else {
          this.$Notice.error({
            desc: '删除个人周报失败'
          });
        }
      })
    },
    filterMethod(value, option) {
      return option.indexOf(value) !== -1;
    },
    getPersonnelCount(){
      this.$http({
        method: 'GET',
        url: `/overview/user/list`
      }).then(({data})=>{
        if(data.status){
          this.unSendNames  = data.data.unSendNames;
          this.sendNames = data.data.sendNames;
        }
      })
    },
    handleAnchors(anchorsTo){
      // 获取top值
      let offsetTop = this.$parent.$children[1].$refs[anchorsTo][0].offsetTop;
      // 赋值，进行滚动
      this.$parent.$refs['homeBottomBox'].scrollTop = offsetTop - 50;
    },
    transferName(item) {
      this.$emit('clickName', item)
    }
  },
  //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
  created() {
    this.getTableData({loading: true});
  },
  mounted(){
      this.getPersonnelCount();
  }
}
</script>

<style scoped lang="less">
.search-wrapper, .btn-wrapper {
  padding-bottom: 15px;
}

.page-wrapper {
  position: relative;
  margin-top: 12px;
}

.home-top {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  position: relative;
  .ht-left {
    width: 50%;
    background-color: #fff;
    top: 0;
    left: 0;
  }
  .ht-right {
    width: 49.5%;
    background-color: #fff;
    right: 0;
    top: 0;
  }
  .ht-box {
    height: 100px;
    border: 1px solid #D8DCE5;
    position: absolute;

  }
}
.titleBox {
  height: 100%;
  background-color: #E6F1F7;
  line-height: 100px;
  width: 240px;
  padding-left: 20px;
  position: absolute;
  top: 0;
  left: 0;
  p {
    display: inline-block;
    font-size: 16px;
    color: #51677F;
    padding-left: 10px;
  }
}
.allname-box {
  height: 100%;
  width: calc(~"100% - 240px");
  position: absolute;
  right: 0;
  top: 0;
  overflow: hidden;
}
.allName {
  color: #64707c;
  font-size: 14px;
  padding: 10px 10px 0 10px;
  width: calc(~"100%");
  height: 100%;
  overflow: auto;
  ul {
    list-style-type: none;
    li {
      padding: 5px;
      float: left;
    }
  }
}
.ht-left {
  .sendName {
    color: #3399FD;
  }
}
.ht-right {
  .unsendNum {
    background-color: #FF9900 !important;
  }
}
.home-top {
  .sendNum {
    display: inline-block;
    width: 70px;
    height: 70px;
    background-color: #00CC65;
    border-radius: 50%;
    color: #FFFFFD;
    font-size: 50px;
    text-align: center;
    line-height: 70px;
    font-family: 'Fette-Engschrift';
    vertical-align: middle;
  }
}
</style>
