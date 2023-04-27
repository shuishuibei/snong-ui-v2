<template>
  <Modal
    v-model="visible"
    :scrollable="true"
    class-name="vertical-center-modal"
    width="600px"
    :title="title"
    class="assign-permissions">
    <div class="permissions-top">
      <Input
        clearable
        v-model="inputProjectName"
        style="width: 160px"
        placeholder="请输入项目名称进行查询"
      >
      </Input>
      <Input
        clearable
        v-model="inputValue"
        style="width: 160px"
        placeholder="请输入IP进行查询"
      >
      </Input>

      <Button type="primary" @click="handleSearch" style="width: 40px;">
        <i class="iconfont icon-iconfontsousuo"></i>
      </Button>
    </div>
    <Table ref="table"
           size="small"
           stripe
           :key="tableConfig.key"
           :loading="tableConfig.loading"
           :columns="getColumns"
           :data="tableConfig.data"
           @on-sort-change="sortChange">
    </Table>
    <!-- 分页 -->
    <div class="page-wrapper clearfix">
      <div class="float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
      <div class="float-right">
        <Page
          show-sizer
          placement="top"
          :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          :page-size-opts="[5,10,20,50]"
          @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
          @on-page-size-change="getTableData({pageSize: $event})">
        </Page>
      </div>
    </div>
    <div slot="footer" v-show="false">
<!--      <Button type="primary" @click.native="ok">确认</Button>-->
<!--      <Button @click="cancel" style="margin-left: 30px">取消</Button>-->
    </div>
  </Modal>
</template>
<script>
export default {
  name: "proxy-logs",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    selected: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "Proxy日志下载"
    }
  },
  data() {
    return {
      visible: false, // 控制弹出框是否显示
      inputValue: "", // 搜索框中显示的值
      searchValue: "", // 实际点击查询按钮发送的值
      // 表格配置信息
      inputProjectName: "",
      tableConfig: {
        key: new Date().toString(), //表格的属性key
        loading: false, //表格是否加载中
        //表格列的配置描述
        // columns: getColumns(),
        data: []  //表格中的
      },
      searchMap: {
        proxyIp: '',
        projectName: ''
      },
      // 分页
      page: {
        pageSize: 5, // 每页条数
        totalCount: 0, // 总数
        totalPage: 1, // 总页数
        currentPage: 1 // 当前页码
      },
      flag: {
        download: false
      }
    };
  },
  computed: {
    getColumns(){
      let columns = [
        {
          title: '所属项目',
          key: "projectName",
        },
        {
          title: 'IP',
          key: 'proxyIp'
        },
        {
          title: '日志下载',
          width: 128,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i', {
                style: {
                  color: '#3399ff',
                },
                class: {
                  'iconfont': true,
                  'icon-xiazai': true,
                  'icon-active': true
                },
                on: {
                  click: () => {
                    this.currentRow = params.row;
                    this.submitDownload(params.row);
                    // this.flag.download = true
                  }
                }
              })
            ])
          }
        },
      ]
      if (this.selected) {
        columns.shift();
      }
      return columns;
    }
  },
  methods: {
    // 点击查询按钮触发
    handleSearch() {
      // 将输入框中的值首尾去空格后赋值给查询字段searchValue
      this.searchMap.proxyIp = this.inputValue.trim();
      this.searchMap.projectName = this.inputProjectName.trim();
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
    getTableData({loading = false, currentPage = 1, pageSize = 5} = {}) {
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
      this.$http.post(`white-screen/page/list`, {
        current: currentPage,
        orderMap: this.orderMap,
        pageSize: pageSize,
        searchMap: {
          ...this.searchMap
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
    /**
     * 当表格点击排序时触发
     * @param column {object} 当前列数据
     * @param key {string} 排序依据的指标，即当前列的key值
     * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     */
    sortChange({column, key, order}) {
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
      this.orderMap = {[key]: flag};
      this.getTableData({pageSize: this.page.pageSize});
    },
    //清空搜索框
    setInputEmpty() {
      this.searchMap.proxyIp = this.inputValue = '';
      this.searchMap.projectName = this.inputProjectName = '';
    },
    //提交下载
    submitDownload(row) {
      this.$loading.show();
      this.$http({
        method: 'GET',
        url: `/white-screen/download/${row.projectName}`
      }).then((res)=>{
        let data = res.data;
        if (data.status) {
          let a = document.createElement('a');
          a.href = data.data;
          a.download = row.projectName + '_proxy-log.tar.gz'
          //此处的download是a标签的内容，固定写法，不是后台api接口
          a.setAttribute('download',row.projectName + '_proxy-log.tar.gz')
          a.click();
          //移除链接
          document.body.removeAttribute('a');
        }
      })
      this.$loading.hide();
    },
    ok() {
      this.$http.post(`host/cancel/${this.data.id}/user`, this.selectedIdList)
        .then(({data}) => {
          if (data.status) {
            // 分配权限成功后的提示信息
            this.$Notice.success({
              desc: '取消权限成功'
            });
            this.$parent.getTableData({loading: true}); // 更新父组件的最新数据
            this.visible = false; // 关闭对话框
          } else {
            // 分配权限失败后的提示信息
            this.$Notice.error({
              desc: '取消权限失败'
            });
          }
        })
    },
    cancel() {
      // 关闭对话框
      this.visible = false;
      // 表单清空
      // this.$refs['form'].resetFields();
      this.$emit("on-cancel");
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.getTableData();
        // this.setInputEmpty();
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); //清楚右上角提示信息
        this.visible = newVal; //显示对话框
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.permissions-top {
  margin-bottom: 15px;
}
.user-table {
  border: 1px solid #dcdee2;
  border-radius: 5px;
  padding: 10px
}
/* 分页 */
.page-wrapper {
  position: relative;
  margin-top: 12px;
}
</style>
