import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';

export default {
  components: {
    'h3c-modal-confirm': H3cModalConfirm //信息确认框组件
  },
  data() {
    return {
      inputValue: '', // 搜索框的值
      searchValue: '', // 实际搜索的值
      startTime: [], // 选择的时间
      page: {
        //分页数据
        totalCount: 0, // 总条数
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页条数
        totalPage: 1 // 总页数
      },
      config: {
        data: [],
        loading: true
      },
      orderMap: {}, //排序
      filterMap: [], // 表格筛选参数
      searchMap: [],
      queryTripleList: []
    }
  },
  methods: {
    // 清空搜索框
    setInputEmpty() {
      this.inputValue = '';
      this.searchValue = '';
    },
    // 查询
    handleSearch() {
      this.selectAll = [];
      this.searchMap = [];
      // 将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchValue = this.inputValue.trim();
      if (this.searchValue) {
        this.searchMap.push({
          left: 'orderNo',
          middle: 'like',
          right: this.searchValue
        })
      }
      if (this.startTime.length) {
        if (arguments.length) {
          this.searchMap.push({
            left: 'processStartTime',
            middle: 'gt',
            right: this.startTime[0]
          }, {
            left: 'processStartTime',
            middle: 'lt',
            right: this.startTime[1]
          })
        } else {
          this.searchMap.push({
            left: 'startTime',
            middle: 'gt',
            right: this.startTime[0]
          }, {
            left: 'startTime',
            middle: 'lt',
            right: this.startTime[1]
          })
        }
      }
      this.queryTripleList = this.searchMap.concat(this.filterMap);
      this.getTableData({
        pageSize: this.page.pageSize
      })
    },
    /**
     * 发送请求获取表格数据，并且做相应处理
     * @param loading {boolean} 表格缓冲，默认值为false
     * @param currentPage {number} 分页当前页，默认值为第一页
     * @param pageSize {number} 分页每页条数，默认值为每页20条
     */
    getTableData({
      loading = true,
      currentPage = 1,
      pageSize = 20,
      emptySelect = true
    } = {}) {
      this.config.loading = loading; // 设置表格缓冲
      this.page.pageSize = pageSize; // 设置分页每页条数
      this.page.currentPage = currentPage; // 设置分页当前页
      this.config.data = []; // 将表格数据data设置为空数组
      if (this.httpUrl) {
        this.$http({
          method: 'POST',
          url: this.httpUrl.urlList,
          data: {
            current: currentPage,
            orderMap: this.orderMap,
            pageSize: pageSize,
            queryTripleList: this.queryTripleList
          }
        }).then(({
          data
        }) => {
          if (data.status) {
            this.config.loading = false; // 当请求成功有数据返回的时候我们关闭加载的动画
            let {
              records,
              total,
              pages
            } = data.data;
            this.config.data = records; // 把请求到的数据赋值
            this.page.totalCount = total; // 把多少条数据赋值给page.totalCount
            this.page.totalPage = pages ? pages : 1; // 把总页数赋值给page.totalPage
            // 分页保持选中
            if (emptySelect) {
              this.selectAll = []
            } else {
              this.config.data.forEach((v, i) => {
                this.selectAll.forEach((k) => {
                  if (v.processInstanceId == k) {
                    this.config.data[i]._checked = true
                  }
                })
              })
            }
          } else {
            this.config.loading = false;
            this.config.data = [];
          }
        });
      }

    },
    //点击刷新按钮触发
    handleRefresh() {
      this.selectAll = []; // 清空选中
      this.setInputEmpty(); // 清空搜索输入框
      this.orderMap = {}; // 刷新之后我们把排序的都清空
      this.filterMap = [];
      this.searchMap = [];
      this.queryTripleList = [];
      this.startTime = [];
      this.config.key = new Date().toString();
      this.getTableData({
        pageSize: this.page.pageSize
      }); // 然后重新请求
    },
    /**
     * 当表格点击排序时触发
     * @param column {object} 当前列数据
     * @param key {string} 排序依据的指标，即当前列的key值
     * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     */
    sortChange({
      column,
      key,
      order
    }) {
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
      this.orderMap = {
        [key]: flag
      };
      this.selectAll = [];
      this.getTableData({
        pageSize: this.page.pageSize
      });
    },
    // 申请类型
    setOrderType(status) {
      switch (status) {
        case 'ADD':
          return '新增';
        case 'UNSUBSCRIBE':
          return '退订';
        case 'CHANGE':
          return '变更';
      }
    },
    /*
     * 清空时间选择器时，date的值为['',''];
     * */
    dateChange(date) {
      if (date[0] === '' && date[1] === '') {
        this.startTime = [];
      } else {
        this.startTime = date;
      }
    },
    /**
     * 从状态数组中获取某个状态的信息
     * @param status 状态英文
     * @param arr 状态数组
     */
    getStatusInfo(status, arr) {
      return arr.filter(function (item) {
        return item.value === status;
      });
    }
  },
  mounted() {
    this.getTableData();
  }
}
