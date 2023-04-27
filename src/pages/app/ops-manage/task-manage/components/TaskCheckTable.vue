<template>
  <div>
    <div class="cds-clearfix cds-margin-bottom-14">
            <Input
                clearable
                v-model="inputTitle"
                style="width: 160px"
                placeholder="请输入技术任务标题"
            >
            </Input>
            <Input
                clearable
                v-model="inputContent"
                style="width: 160px"
                placeholder="请输入技术任务内容"
            >
            </Input>
        <i-button
          class="cds-btn-search"
          type="primary"
          @click="handlerSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
        <div class="cds-float-right">
            <Button class="cds-btn-refresh" @click="handleRefresh">
                <i class="iconfont icon-shuaxin1"></i>
            </Button>
        </div>
    </div>
    <div class="table-wrap cds-margin-bottom-14">
        <drag-table
            border
            stripe
            ref="table"
            size="small"
            :key="table.key"
            :height='tableHeight'
            :data="table.data"
            :columns="table.columns"
            :loading="table.loading"
            @on-sort-change="handlerSortChange"
            @on-selection-change="selectionChange"
        >
        </drag-table>
    </div>
    <div class="clearfix page-wrap">
            <div class="cds-float-left">
                共有{{ page.total }}条记录，当前页{{ page.current }}/{{ page.pages }}页
            </div>
            <div class="cds-float-right">
                <Page
                    show-sizer
                    placement="top"
                    :total="page.total"
                    :current="page.current"
                    :page-size="page.pageSize"
                    @on-change="
                        handlerChangePage({ current: $event, pageSize: page.pageSize })
                    "
                    @on-page-size-change="handlerChangePage({ pageSize: $event })"
                    :page-size-opts="[10, 20, 30, 40]"
                >
                </Page>
            </div>
        </div>
    <TaskCheckEdit
            title="技术任务排查"
            v-model="showHandleAll"
            :current-row="currentRow"
            @on-ok="submitHandleAll">
      </TaskCheckEdit>
    <!-- 下载附件 -->
    <ModalConfirm ref="downloadFile"
                  v-model="download"
                  title="下载技术排查附件"
                  :info="'确认下载：【' + currentRow.taskTitle + '】技术排查结果的附件吗？'"
                  @on-ok="submitDownload"
                  :showBackgroudColor="false">
    </ModalConfirm>
    </div>

</template>

<script>
import DragTable from '@/components/drag-table/index'
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue'
import TaskCheckEdit from './TaskCheckEdit.vue';

const Status = [
    {
        value: "0",
        label: '未排查'
    },
    {
        value: "1",
        label: '不涉及'
    },
    {
        value: "2",
        label: '处理中'
    },
    {
        value: "3",
        label: '已完成'
    }
]
export default {
    name: "TaskCheckTable",
    props: {
        projectName: {
            type: String,
        }
    },
    components: {
        'drag-table': DragTable,
        ModalConfirm,
      TaskCheckEdit
    },
    data() {
        return {
            inputTitle: "",
            inputContent: '',
            currentRow: {},
            sort: {},
            filtersMap: {},
            searchMap: {
                taskTitle: "",              // ip地址
                taskContent: "",  // 巡检项
                projectName: "",     // 项目名称
            },
            page: {
                current: 1,
                total: 0,
                pages: 1,
                pageSize: 10,
            },
            table: {
                data: [],
                columns: [
                  {
                    title: '操作',
                    align: 'center',
                    width: 64,
                    ellipsis: true,
                    render: (h, params) => {
                      let status = params.row.status
                      return h('div', [
                        (status == 0 || status == 2) && h('a', {
                          on: {
                            click: () => {
                              this.showHandleAll = true
                              this.currentRow = params.row
                            }
                          }
                        },'排查'),
                        (status == 1 || status == 3) && h('a', {
                          style: {
                            pointerEvents: 'none',
                            color: '#C8C8C8',
                          },
                        },'排查')
                      ])
                    },
                  },
                    {
                        title: "技术任务标题",
                        key: "taskTitle",
                        width: 220,
                        align: 'center',
                        resizable: true,
                        ellipsis: true,
                        render: (h, { row: { taskTitle } }) => {
                        return h(
                            "span",
                            {
                                attrs: {
                                    title: taskTitle,
                                },
                            },
                            taskTitle
                        );
                        },
                    },
                    {
                        title: "技术任务内容",
                        key: "taskContent",
                        width: 280,
                        align: 'center',
                        resizable: true,
                        ellipsis: true,
                        render: (h, { row: { taskContent } }) => {
                            return h(
                                "span",
                                {
                                    attrs: {
                                        title: taskContent,
                                    },
                                },
                                taskContent
                            );
                        },
                    },
                    {
                      title: '状态',
                      key: "status",
                      width: 80,
                      align: 'center',
                      resizable: true,
                      ellipsis: true,
                      filters: Status,
                      filterMultiple: false,
                      filterRemote: ([value], key) => {
                        this.filtersMap[key] = value;
                        this.handlerChangePage({ pageSize: this.page.pageSize });
                      },
                      render: (h, { row: { status } }) => {
                        let tmp = Status.filter((item) => item.value == status), text = '';
                        if (tmp.length > 0) {
                          text = tmp[0].label
                        }
                        return h(
                            "span",
                            {
                              attrs: {
                                title: text,
                              },
                              style: {
                                color: status == 0 ? "red" : "#008000",
                              }
                            },
                            text
                        );
                      },
                    },
                  {
                    title: '下载排查结果',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                      let path = params.row.feedbackUrl
                      return h('div', [
                        (path != null && path !== '') && h('i', {
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
                              this.download = true
                            }
                          }
                        })
                      ])
                    }
                  },{
                    title: "发布时间",
                    key: "createTime",
                    minWidth: 180,
                    resizable: true,
                    align: 'center',
                    ellipsis: true,
                    sortable: 'custom',
                    render: (h, { row: { createTime } }) => {
                      let time = createTime.replace(/T/g, ' ')
                      return h(
                        "span",
                        {
                          attrs: {
                            title: time,
                          },
                        },
                        time
                      );
                    },
                  },
                  {
                    title: "响应时间",
                    key: "responseTime",
                    minWidth: 140,
                    resizable: true,
                    align: 'center',
                    ellipsis: true,
                    sortable: 'custom',
                    render: (h, { row: { responseTime } }) => {
                      let time = "";
                      if (responseTime) {
                        time = responseTime.replace(/T/g, ' ')
                      }
                      return h(
                        "span",
                        {
                          attrs: {
                            title: time,
                          },
                        },
                        time
                      );
                    },
                  },
                  {
                    renderHeader: (h) => {
                      return h('div',[
                        h('span','响应期限'),
                        h('el-tooltip',
                          { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '响应期限为2个工作日内。' }},
                          [h('i', {
                            class:'el-icon-question',
                            style:'color:#ebb563;margin-left:5px;'
                          })
                          ])
                      ])
                    },
                    key: "responseDesc",
                    width: 180,
                    align: 'center',
                    resizable: true,
                    ellipsis: true,
                    render: (h, { row: { responded,responseDesc } }) => {
                      return h(
                        "span",
                        {
                          attrs: {
                            title: responseDesc,
                          },
                          style: {
                            color: responded ? "#008000" : "red",
                          }
                        },
                        responseDesc
                      );
                    },
                  },
                  {
                    title: "完成时间",
                    key: "completeTime",
                    minWidth: 140,
                    resizable: true,
                    align: 'center',
                    ellipsis: true,
                    sortable: 'custom',
                    render: (h, { row: { completeTime } }) => {
                      let time = "";
                      if (completeTime) {
                        time = completeTime.replace(/T/g, ' ')
                      }
                      return h(
                        "span",
                        {
                          attrs: {
                            title: time,
                          },
                        },
                        time
                      );
                    },
                  },
                  {
                    renderHeader: (h) => {
                      return h('div',[
                        h('span','完成期限'),
                        h('el-tooltip',
                          { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '完成期限为30天内。' }},
                          [h('i', {
                            class:'el-icon-question',
                            style:'color:#ebb563;margin-left:5px;'
                          })
                          ])
                      ])
                    },
                    key: "completeDesc",
                    width: 180,
                    align: 'center',
                    resizable: true,
                    ellipsis: true,
                    render: (h, { row: { completed,completeDesc } }) => {

                      return h(
                        "span",
                        {
                          attrs: {
                            title: completeDesc,
                          },
                          style: {
                            color: completed ? "#008000" : "red",
                          }
                        },
                        completeDesc
                      );
                    },
                  },
                  {
                    title: "排查描述",
                    key: "content",
                    width: 250,
                    resizable: true,
                    ellipsis: true,
                    render: (h, { row: { content } }) => {
                      return h(
                        "span",
                        {
                          attrs: {
                            title: content,
                          },
                          // style: {
                          //   color: description != "" ? "red" : "#495060",
                          // },
                        },
                        content
                      );
                    },
                  }
                ],
                loading: false,
                key: new Date().getTime(),
            },
            tableHeight: 0, // table表格的高度
            download: false, // 下载技术排查结果附件
            showHandleAll: false // 处理弹窗显示与否
        };
    },
    created() {
        this.$nextTick(() => {
            this.getHeight()
        })
        window.addEventListener('resize', () => {
            this.getHeight()
        })
    },
    methods: {
        getHeight() {
            const clientHeight = (window.innerHeight - 517) < 146 ? '' : window.innerHeight - 255
            this.tableHeight = clientHeight
        },
        /**
         * @description 点击查询触发的方法
         * @returns {void}
         */
        handlerSearch() {
            this.searchMap.taskTitle = this.inputTitle.trim()
            this.searchMap.taskContent = this.inputContent.trim()
            this.handlerChangePage({ pageSize: this.page.pageSize });
        },
        /**
         * @description 表格排序触发的方法
         * @param {string} key
         * @param {string} order
         * @returns {void}
         */
        handlerSortChange({ key, order }) {
            this.sort = {};
            this.sort[key] = order === "asc" ? true : false;
            this.handlerChangePage({ pageSize: this.page.pageSize });
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
            this.getData();
        },
        /**
         * @description 获取table数据
         * @returns {void}
         */
        async getData() {
            this.handleIds = [];
            this.table.loading = true;
            let { current, pageSize } = this.page;
            try {
                let {
                    data: { status, data },
                } = await this.$http({
                    url: "task/project/page/list",
                    method: "POST",
                    data: {
                        current,
                        pageSize,
                        orderMap: this.sort,
                        searchMap: { ...this.searchMap, ...this.filtersMap },
                    },
                });
                if (status) {
                    let { total, pages, records } = data;
                    this.table.data = records;
                    this.page.total = total;
                    this.page.pages = pages;
                } else {
                    this.table.data = [];
                    this.page.total = 0;
                    this.page.pages = 1;
                    this.page.current = 1;
                }
                this.table.loading = false;
            } catch (error) {
                this.table.loading = false;
                this.table.data = [];
                this.page.total = 0;
                this.page.pages = 1;
                this.page.current = 1;
            }
        },
        // 点击刷新按钮触发
        handleRefresh() {
            // 清空搜索输入框
            this.searchMap.taskTitle = this.inputTitle = ""
            this.searchMap.taskContent = this.inputContent = ""
            // 清空筛选
            this.filterMap = {};
            // 清空排序
            this.orderMap = {};
            // 将表格数据data设置为空数组
            this.table.data = [];
            // 重设Table组件的key，促使Table组件重新渲染
            this.table.key = new Date().toString();
            this.sort = {};
            // 请求表格数据：保留每页条数
            this.handlerChangePage({ pageSize: this.page.pageSize });
        },
        // 批量删除
        handleAll() {
            this.showHandleAll = true
        },
        // 复选框选中项改变时触发
        selectionChange(selection) {
            this.handleIds = [];
            selection.forEach((item) => {
                this.handleIds.push(item.id);
            });
        },
      //提交下载
      submitDownload() {
        this.$http({
          method: 'GET',
          url: `/task/download/${this.currentRow.id}?type=feedback`,
          responseType: 'blob'
        }).then((res)=>{
          let a = document.createElement('a'),
            url = window.URL.createObjectURL(res.data),
            filename = this.currentRow.feedbackUrl;
          a.href = url;
          a.download = filename.substring(filename.lastIndexOf('\\')+1);
          a.click();
          window.URL.revokeObjectURL(url);
          this.download = false;
        })
      },
        // 确定排查
        submitHandleAll(formData) {
            this.$loading.show();
            this.$http.post('/task/project/handle', formData).then(({ data }) => {
                if(data.status) {
                    this.$emit('transferFlag', 'change')
                    this.$Notice.success({
                        desc: data.message,
                    });
                    this.getData({
                        pageSize: this.page.pageSize
                    })
                }
                this.$loading.hide();
                this.showHandleAll = false;
            })
        }
    },
    // mounted() {
    //     this.searchMap.projectName = this.projectName
    //     this.getData();
    // },
    watch: {
        projectName: {
            handler(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.searchMap.projectName = newVal
                    this.getData();
                }
            },
        }
    }
};
</script>

<style lang="less" scoped>
.box-wrap {
  width: 100%;
  height: 100%;
  .table-wrap {
    margin: 15px 0;
  }
}
/deep/ .icon-wenhaofill::before {
    font-size: 36px;
}
</style>
