<template>
  <div>
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix cds-margin-bottom-14">
              <!-- 下拉框联动搜索 -->
              <AutoComplete
                  clearable
                  placeholder="请输入IP地址"
                  :data="ipList"
                  :filter-method="filterMethod"
                  v-model="ipAddress"
                  @on-select="handlerSearch">
              </AutoComplete>
                <Input
                    clearable
                    v-model="inspectionItem"
                    style="width: 160px"
                    placeholder="请输入巡检项"
                >
                </Input>
                <i-button
                  class="cds-btn-search"
                  type="primary"
                  @click="handlerSearch">
                  <i class="iconfont icon-iconfontsousuo"></i>
                </i-button>
                <i-button
                  type="primary" :disabled="handleIds.length==0"
                  @click="handleAll">
                  <i class="iconfont">批量处理</i>
                </i-button>
            <div class="cds-float-right cds-btn-reset-spacing">
            <!--  <i-button
                class="cds-btn-search" type="primary"
                @click="handleExport">
                <i class="iconfont  icon-daochu"></i>
              </i-button>-->
              <i-button
                type="primary"
                @click="handleExport">
                <i class="iconfont icon-daochu">巡检导出</i>
              </i-button>
              <i-button
                class="cds-btn-refresh" type="primary"
                @click="handleRefresh">
                <i class="iconfont  icon-shuaxin1"></i>
              </i-button>
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
        <!-- 处理确认框 -->
        <ModalConfirm v-model="showHandleAll"
                    title="处理"
                    :info="'确认处理这' + handleIds.length + '个巡检项吗？'"
                    @on-ok="submitHandleAll"
                    @on-cancel="cancelHandle">
        </ModalConfirm>
      <!-- 详情信息 -->
      <Modal
        v-model="showDetail"
        title="巡检结果详情"
        @on-cancel="detailOk">
        <div class="detail-wrapper" v-html="detailRows">
        </div>
        <div slot="footer">
          <Button type="primary" @click.native="detailOk">关闭</Button>
        </div>
      </Modal>
    </div>

</template>

<script>
import DragTable from '@/components/drag-table/index'
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue'

const passStatus = [
    {
        value: "1",
        label: '通过'
    },
    {
        value: "0",
        label: '不通过'
    },
    {
      value: "2",
      label: '未知结果'
    }
]
const alertLevelStatus = [
    {
        value: 1,
        label: '紧急'
    },
    {
        value: 2,
        label: '重要'
    },
    {
        value: 3,
        label: '一般'
    },
    {
        value: 4,
        label: '提示'
    }
]
const Status = [
    {
        value: "1",
        label: '已处理'
    },
    {
        value: "0",
        label: '未处理'
    }
]
export default {
    name: "InspectionTable",
    props: {
        inspectionDate: {
            type: String,
            default: new Date().toISOString().slice(0, 10)
        },
        projectName: {
            type: String,
        },
        productName: {
            type: String,
            default: 'CAS'
        }
    },
    components: {
        'drag-table': DragTable,
          ModalConfirm
    },
    data() {
        return {
            ipAddress: "",
            inspectionItem: '',
            ipList: [],
            sort: {},
            filtersMap: {},
            currentRow:{},//表格中当前操作行
          //详情信息的标题配置信息
          detailRows: '',
            searchMap: {
                ip: "",              // ip地址
                inspectionItem: "",  // 巡检项
                inspectionDate: "",  // 巡检日期
                projectName: "",     // 项目名称
                productName: "",     // tabs栏选中项
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
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: "IP地址",
                        key: "ip",
                        width: 160,
                        align: 'center',
                        resizable: true,
                        render: (h, { row: { ip } }) => {
                        return h(
                            "span",
                            {
                                attrs: {
                                    title: ip,
                                },
                            },
                            ip
                        );
                        },
                    },
                    {
                        title: "巡检分类",
                        key: "inspectionType",
                        width: 180,
                        align: 'center',
                        resizable: true,
                        ellipsis: true,
                        render: (h, { row: { inspectionType } }) => {
                            return h(
                                "span",
                                {
                                    attrs: {
                                        title: inspectionType,
                                    },
                                },
                                inspectionType
                            );
                        },
                    },
                    {
                        title: "巡检项",
                        key: "inspectionItem",
                        width: 240,
                        align: 'center',
                        resizable: true,
                        ellipsis: true,
                        render: (h, { row: { inspectionItem } }) => {
                        return h(
                            "span",
                            {
                                attrs: {
                                    title: inspectionItem,
                                },
                            },
                            inspectionItem
                        );
                        },
                    },
                    {
                        title: "告警级别",
                        key: "alertLevel",
                        width: 140,
                        align: 'center',
                        resizable: true,
                        ellipsis: true,
                        filters: alertLevelStatus,
                        filterMultiple: false,
                        filterRemote: ([value], key) => {
                            this.filtersMap[key] = value;
                            this.handlerChangePage({ pageSize: this.page.pageSize });
                        },
                        render: (h, { row: { alertLevel } }) => {
                            let tmp = alertLevelStatus.filter((item) => item.value == alertLevel), text = '未知级别';
                            if (tmp.length > 0) {
                                text = tmp[0].label
                            }
                            return h(
                                "span",
                                {
                                    attrs: {
                                        title: text,
                                    },
                                },
                                text
                            );
                        },
                    },
                    {
                        title: "巡检结果",
                        key: "pass",
                        width: 140,
                        align: 'center',
                        resizable: true,
                        ellipsis: true,
                        filters: passStatus,
                        filterMultiple: false,
                        filterRemote: ([value], key) => {
                            this.filtersMap[key] = value;
                            this.handlerChangePage({ pageSize: this.page.pageSize });
                        },
                        render: (h, { row: { id, pass } }) => {
                            let tmp = passStatus.filter((item) => item.value == pass), text = '未知结果';
                            if (tmp.length > 0) {
                                text = tmp[0].label
                            }
                          return h('div', [
                            (pass == 0) && h('a', {
                              on: {
                                click: () => {
                                  this.showHandleAll = true
                                  this.handleIds = [id]
                                  this.singleHandle = true
                                }
                              }
                            },text),
                            (pass != 0) && h('a', {
                              style: {
                                color: '#515A6E',
                              },
                            },text)
                          ])
                            // return h(
                            //     "span",
                            //     {
                            //         style: {
                            //             color: pass == 0 ? "red" : "#495060",
                            //         },
                            //     },
                            //     text
                            // );
                        },
                    },
                    {
                      title: '状态',
                      key: "status",
                      width: 140,
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
                      title: "巡检结果详情",
                      key: "description",
                      width: 450,
                      resizable: true,
                      ellipsis: true,
                      render: (h, params) => {
                        let desc = params.row.description
                        desc = desc.replace(/<[^>]+>/g,"")
                        return h(
                            "span",
                            {
                              style: {
                                color: '#3399ff',
                                cursor: 'pointer'
                              },
                              attrs: {
                                title: desc,
                              },
                              on: {
                                click: () => {
                                  this.currentRow = params.row;
                                  this.getInspectionDetail(this.currentRow.description)
                                  this.showDetail = true;
                                }
                              }
                              // style: {
                              //   color: description != "" ? "red" : "#495060",
                              // },
                            },
                          desc
                        );
                      },
                    },
                    {
                        title: "执行时间",
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
                            title: '操作',
                            align: 'center',
                            minWidth: 120,
                            ellipsis: true,
                            render: (h, params) => {
                                let pass = params.row.pass
                                return h('div', [
                                    (pass == 0) && h('a', {
                                            on: {
                                                click: () => {
                                                    this.showHandleAll = true
                                                    this.handleIds = [params.row.id]
                                                    this.singleHandle = true
                                                }
                                            }
                                        },'处理'),
                                        (pass != 0) && h('a', {
                                            style: {
                                                pointerEvents: 'none',
                                                color: '#C8C8C8',
                                            },
                                        },'处理'),
                                    ])
                            },
                        }
                ],
                loading: false,
                key: new Date().getTime(),
            },
            tableHeight: 0, // table表格的高度
            handleIds: [],  // 要处理的id数组
            showHandleAll: false, // 处理弹窗显示与否
            showDetail: false,
            singleHandle: false,
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
            const clientHeight = (window.innerHeight - 517) < 146 ? '' : window.innerHeight - 517
            this.tableHeight = clientHeight
        },
        /**
         * @description 点击查询触发的方法
         * @returns {void}
         */
        handlerSearch() {
            this.searchMap.ip = this.ipAddress.trim()
            this.searchMap.inspectionItem = this.inspectionItem.trim()
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
        detailOk() {
          this.showDetail = false;
          this.$emit('on-ok');
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
                    url: "/inspection/page/list",
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
            // 获取IP列表
          this.$http
              .get(`/inspection/ips?dateTime=${this.inspectionDate}&projectName=${this.projectName}&productName=${this.productName}`)
              .then(({ data }) => {
                if (data.status) {
                  this.ipList = data.data
                }
              });
        },
        // 点击刷新按钮触发
        handleRefresh() {
            // 清空搜索输入框
            this.searchMap.ip = this.ipAddress = ""
            this.searchMap.inspectionItem = this.inspectionItem = ""
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
        // 全部导出
        handleExport() {
          this.$http.get(
            `/inspection/export?dateTime=${this.inspectionDate}&projectName=${this.projectName}`,
            { responseType: 'blob' })
          .then((res)=>{
            let a = document.createElement('a'),
              url = window.URL.createObjectURL(res.data);
            a.href = url;
            a.download = this.inspectionDate + "_" + this.projectName + '-' + '巡检结果.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
          })
        },
        // 复选框选中项改变时触发
        selectionChange(selection) {
            this.handleIds = [];
            selection.forEach((item) => {
                this.handleIds.push(item.id);
            });
        },
      filterMethod(value, option) {
        return option.indexOf(value) !== -1;
      },
      getInspectionDetail(desc) {
        this.detailRows = desc.replace(/\n/g,"<br/>");
      },
        // 确定处理
        submitHandleAll() {
            this.$loading.show();
            this.$http.post('/inspection/handle', this.handleIds).then(({ data }) => {
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
                if(this.singleHandle) {
                    this.handleIds = [];
                }
                this.singleHandle = false
            })
        },
        cancelHandle() {
            if(this.singleHandle) {
                this.handleIds = [];
            }
            this.singleHandle = false
        },
    },
    mounted() {
        this.searchMap.inspectionDate = this.inspectionDate
        this.searchMap.projectName = this.projectName
        this.searchMap.productName = this.productName
        this.getData();
    },
    watch: {
        inspectionDate: {
            handler(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.searchMap.inspectionDate = newVal
                    this.getData();
                }
            },
        },
        projectName: {
            handler(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.searchMap.projectName = newVal
                    this.getData();
                }
            },
        },
        productName: {
            handler(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.searchMap.productName = newVal
                    this.getData();
                }
            },
        }
    }
};
</script>

<style lang="less" scoped>
.detail-wrapper {
  max-height: 600px;
  padding: 10px 25px;
  border: 1px solid #c8d0da;
  overflow: auto;
}
.box-wrap {
  width: 100%;
  .table-wrap {
    margin: 15px 0;
  }
}
/deep/ .icon-wenhaofill::before {
    font-size: 36px;
}
</style>
