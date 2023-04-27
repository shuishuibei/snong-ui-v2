<template>
    <Modal
        v-model="visible"
        :scrollable="true"
        class-name="vertical-center-modal"
        width="1000px"
        title="水位线管理"
        class="assign-permissions">
      <div class="model-high">
            <div class="permissions-top">
                <AutoComplete
                    clearable
                    v-model="inputValue"
                    placeholder="请输入资源类型进行查询"
                    style="width: 220px;">
                </AutoComplete>
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
                            :page-size-opts="[10,20,30,50]"
                            @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                            @on-page-size-change="getTableData({pageSize: $event})">
                        </Page>
                    </div>
                </div>
          </div>
        <div slot="footer" v-show="!selected">
            <Button type="primary" @click.native="ok">保存</Button>
            <Button @click="cancel" style="margin-left: 30px">取消</Button>
        </div>
    </Modal>
</template>
<script>
export default {
    name: "water-line",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        projectName: {
          type: String
        },
        selected: {
          type: Boolean,
        }
    },
    data() {
        return {
            visible: false, // 控制弹出框是否显示
            inputValue: "", // 搜索框中显示的值
            searchValue: "", // 实际点击查询按钮发送的值
            edit: false,
            // 表格配置信息
            tableConfig: {
                key: new Date().toString(), //表格的属性key
                loading: false, //表格是否加载中
                //表格列的配置描述
              data: [],
            },
          filterMap: {},  //表格筛选参数
            // 分页
            page: {
                pageSize: 5, // 每页条数
                totalCount: 0, // 总数
                totalPage: 1, // 总页数
                currentPage: 1 // 当前页码
            },
            startTimeOptions: {}, // 生效时间可选项
            endTimeOptions: {},   // 失效时间可选项
        };
    },
  computed: {
    getColumns(){
      let columns = [ //主要是render不同
          {
            title: "资源类型",
            key: "resourceType",
            align: 'center'
          },
        {
          title: "单位",
          key: "unit",
          align: 'center'
        },
          {
            title: "按使用停售水位线",
            key: "useStopLine",
            align: 'center',
            render: (h,params) => {
              return h('div',{
                props: {
                  value:params.row.useStopLine
                },
                attrs: {
                  contentEditable: true
                },
                style: {
                  cursor: "pointer"
                },
                on: {
                  "blur": event => {
                    let newValue = event.target.innerText;
                    this.tableConfig.data[params.index].useStopLine = newValue
                    params.row.useStopLine = newValue;
                  }}
              },params.row.useStopLine)
            }
          },
        {
          title: "按使用预警水位线",
          key: "useAlertLine",
          align: 'center',
          render: (h,params) => {
            return h('div',{
              props: {
                value:params.row.useAlertLine
              },
              attrs: {
                contentEditable: true
              },
              style: {
                cursor: "pointer"
              },
              on: {
                "blur": event => {
                  let newValue = event.target.innerText;
                  this.tableConfig.data[params.index].useAlertLine = newValue
                  params.row.useAlertLine = newValue;
                }}
            },params.row.useAlertLine)
          }
        },
        {
          title: "按使用安全水位线",
          key: "useSafeLine",
          align: 'center',
          render: (h,params) => {
            return h('div',{
              props: {
                value:params.row.useSafeLine
              },
              attrs: {
                contentEditable: true
              },
              style: {
                cursor: "pointer"
              },
              on: {
                "blur": event => {
                  let newValue = event.target.innerText;
                  this.tableConfig.data[params.index].useSafeLine = newValue
                  params.row.useSafeLine = newValue;
                }}
            },params.row.useSafeLine)
          }
        },
        {
          title: "按分配停售水位线",
          key: "assignStopLine",
          align: 'center',
          render: (h,params) => {
            return h('div',{
              props: {
                value:params.row.assignStopLine
              },
              attrs: {
                contentEditable: true
              },
              style: {
                cursor: "pointer"
              },
              on: {
                "blur": event => {
                  let newValue = event.target.innerText;
                  this.tableConfig.data[params.index].assignStopLine = newValue
                  params.row.assignStopLine = newValue;
                }}
            },params.row.assignStopLine)
          }
        },
        {
          title: "按使用预警水位线",
          key: "assignAlertLine",
          align: 'center',
          render: (h,params) => {
            return h('div',{
              props: {
                value:params.row.assignAlertLine
              },
              attrs: {
                contentEditable: true
              },
              style: {
                cursor: "pointer"
              },
              on: {
                "blur": event => {
                  let newValue = event.target.innerText;
                  this.tableConfig.data[params.index].assignAlertLine = newValue
                  params.row.assignAlertLine = newValue;
                }}
            },params.row.assignAlertLine)
          }
        },
        {
          title: "按分配安全水位线",
          key: "assignSafeLine",
          align: 'center',
          render: (h,params) => {
            return h('div',{
              props: {
                value:params.row.assignSafeLine
              },
              attrs: {
                contentEditable: true
              },
              style: {
                cursor: "pointer"
              },
              on: {
                "blur": event => {
                  let newValue = event.target.innerText;
                  this.tableConfig.data[params.index].assignSafeLine = newValue
                  params.row.assignSafeLine = newValue;
                }}
            },params.row.assignSafeLine)
          }
        }]
      return columns;
    }
  },
    methods: {
        // 点击查询按钮触发
        handleSearch() {
            // 将输入框中的值首尾去空格后赋值给查询字段searchValue
            this.searchValue = this.inputValue.trim();
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
            //发送请求并且做相应处理
            this.$http.post(`capacity/water-line/list`, {
                current: currentPage,
                orderMap: this.orderMap,
                pageSize: pageSize,
                searchMap: {
                    projectName: this.projectName,
                    resourceType: this.searchValue,
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
        ok() {
          this.$http.post(`/capacity/water-line/${this.projectName}/update`, this.tableConfig.data)
            .then(({data}) => {
              if (data.status) {
                // 分配权限成功后的提示信息
                this.$Notice.success({
                  desc: '容量水位线更新成功。'
                });
                // this.$refs.getData({loading: true}); // 更新父组件的最新数据
                this.visible = false; // 关闭对话框
              } else {
                // 分配权限失败后的提示信息
                this.$Notice.error({
                  desc: '容量水位线更新失败。'
                });
              }
            })
        },
        cancel() {
            // 关闭对话框
            this.visible = false;
            // 表单清空
            this.$emit("on-cancel");
        }
    },
  watch: {
    value(newVal) {
        if (newVal) {
          this.searchValue = this.inputValue = '';
            /*=== 可修改 start ===*/
            this.getTableData();
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
.model-high {
  max-height:660px;
  overflow-y:auto;
  overflow-x:hidden;
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
