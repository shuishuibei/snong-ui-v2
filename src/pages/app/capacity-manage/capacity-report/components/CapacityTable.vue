<template>
  <div>
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix cds-margin-bottom-14">
              <!-- 下拉框联动搜索 -->
  <!--            <AutoComplete
                  clearable
                  placeholder="请输入IP地址"
                  :data="ipList"
                  :filter-method="filterMethod"
                  v-model="ipAddress"
                  @on-select="handlerSearch">
              </AutoComplete>-->
                <Input
                    clearable
                    v-model="inputValue"
                    style="width: 160px"
                    :placeholder="inputText"
                >
                </Input>
                <i-button
                  class="cds-btn-search"
                  type="primary"
                  @click="handlerSearch">
                  <i class="iconfont icon-iconfontsousuo"></i>
                </i-button>
              <i-button
                type="primary"
                @click="handleExport">
                <i class="iconfont icon-daochu">全部导出</i>
              </i-button>
            <div class="cds-float-right cds-btn-reset-spacing">
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
<!--        <ModalConfirm v-model="showHandleAll"-->
<!--                    title="处理"-->
<!--                    :info="'确认处理这' + handleIds.length + '个巡检项吗？'"-->
<!--                    @on-ok="submitHandleAll"-->
<!--                    @on-cancel="cancelHandle">-->
<!--        </ModalConfirm>-->
      <!-- 详情信息 -->
<!--      <Modal-->
<!--        v-model="showDetail"-->
<!--        title="巡检结果详情"-->
<!--        @on-cancel="detailOk">-->
<!--        <div class="detail-wrapper" v-html="detailRows">-->
<!--        </div>-->
<!--        <div slot="footer">-->
<!--          <Button type="primary" @click.native="detailOk">关闭</Button>-->
<!--        </div>-->
<!--      </Modal>-->
    </div>

</template>

<script>
import DragTable from '@/components/drag-table/index'
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue'
import {
  STORAGE_ALONE_COLUMNS,
  STORAGE_CAS_COLUMNS,
  UIS_CLUSTER_COLUMNS,
  UIS_COMPUTER_COLUMNS,
  UIS_STORAGE_COLUMNS} from '@/constants/capacity-table.js';
export default {
    name: "CapacityTable",
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
            default: 'cas-compute'
        }
    },
    components: {
        'drag-table': DragTable,
          ModalConfirm
    },
    data() {
        return {
            inputValue: "",
            inputText: "请输入集群IP",
            sort: {},
            filtersMap: {},
            currentRow:{},//表格中当前操作行
            searchMap: {
                project: "",     // 项目名称
                isLatest: 1         // 最新数据标志
            },
            url: '/capacity/cas-compute/page/list',
            table: {
              data: [],
              columns: [],
              loading: false,
              key: new Date().getTime(),
            },
            page: {
                current: 1,
                total: 0,
                pages: 1,
                pageSize: 10,
            },
            tableHeight: 0, // table表格的高度
            handleIds: [],  // 要处理的id数组
            // showHandleAll: false, // 处理弹窗显示与否
            showDetail: false,
            singleHandle: false,
            projectWaterLine: [],
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
            const clientHeight = (window.innerHeight - 374) < 146 ? '' : window.innerHeight - 374
            this.tableHeight = clientHeight
        },
        /**
         * @description 点击查询触发的方法
         * @returns {void}
         */
        handlerSearch() {
          this.searchMap = {
            cvmVip: this.inputValue.trim(),
            project: this.projectName,
            isLatest: 1
          }
          if (this.productName === 'alone-storage') {
            this.searchMap = {
              storageIp: this.inputValue.trim(),
              project: this.projectName,
              isLatest: 1
            }
          } else if (this.productName === 'uis-compute') {
            this.searchMap = {
              hostIp: this.inputValue.trim(),
              project: this.projectName,
              isLatest: 1
            }
          } else if (this.productName === 'uis-cluster') {
            this.searchMap = {
              clusterName: this.inputValue.trim(),
              project: this.projectName,
              isLatest: 1
            }
          } else if (this.productName === 'uis-storage') {
            this.searchMap = {
              diskName: this.inputValue.trim(),
              project: this.projectName,
              isLatest: 1
            }
          }
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
            this.getData(this.url);
        },
        detailOk() {
          this.showDetail = false;
          this.$emit('on-ok');
        },
        /**
         * @description 获取table数据
         * @returns {void}
         */
        async getData(url) {
            this.handleIds = [];
            this.table.loading = true;
            let { current, pageSize } = this.page;
            try {
                let {
                    data: { status, data },
                } = await this.$http({
                    url: url,
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
            this.searchMap.ip = this.ipAddress = ""
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
        // 全部导出
        handleExport() {
          this.$http.get(
            `/capacity/cas-compute/export?&projectName=${this.projectName}`,
            { responseType: 'blob' })
          .then((res)=>{
            let a = document.createElement('a'),
              url = window.URL.createObjectURL(res.data);
            a.href = url;
            a.download =  this.projectName + "容量报告" + this.$moment().format('YYYYMMDD') + ".xlsx"
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
      toPercent(point){
        let str=Number(point*100).toFixed(2);
        str+="%";
        return str;
      },
      selectWaterLine() {
        this.$http.get(`/capacity/water-line/${this.projectName}`).then(({ data }) => {
          if (data.status) {
            this.projectWaterLine = data.data;
          }
        })
      },
      handleColor(v,t,r) {
        let useColor, assignColor,
          waterLine = this.projectWaterLine.filter(wl => {
           return wl.resourceType === t;
          });
        if (waterLine.length > 0) {
          if (r === '按使用') {
            if (v >= waterLine[0].useStopLine) {
              useColor = '#bd0202';
            } else if (v >= waterLine[0].useAlertLine) {
              useColor = '#daac02'
            } else if (v >= waterLine[0].useSafeLine) {
              useColor = '#1842e8'
            } else {
              useColor = '#26c503'
            }
          } else if (r === '按分配') {
            if (v >= waterLine[0].assignStopLine) {
              assignColor = '#bd0202';
            } else if (v >= waterLine[0].assignAlertLine) {
              assignColor = '#daac02'
            } else if (v >= waterLine[0].assignSafeLine) {
              assignColor = '#1842e8'
            } else {
              assignColor = '#26c503'
            }
          }
        }
        return {useColor, assignColor};
      }
    },
    mounted() {
        this.searchMap.project = this.projectName
        this.inputText = '请输入集群IP';
        // 查询项目的水位线信息
        if (this.productName === 'cas-compute') {
          this.table.columns = [
            {
              title: "集群IP",
              key: "cvmVip",
              minWidth: 100,
            },
            {
              title: "主机池",
              key: "hostPool",
              minWidth: 80,
            },
            {
              title: "集群名称",
              key: "clusterName",
              minWidth: 80,
            },
            // {
            //   title: "CVK主机数量",
            //   key: "cvkNum",
            //   minWidth: 100,
            // },
            // {
            //   title: "虚拟机数量",
            //   key: "vmNum",
            //   minWidth: 90,
            // },
            // {
            //   title: "虚拟机密度",
            //   key: "vmDensity",
            //   minWidth: 90,
            // },
            {
              title: "CPU总核数",
              key: "cpuTotal",
              minWidth: 90,
            },
            {
              title: "CPU已分配核数",
              key: "cpuAllocated",
              minWidth: 120,
            },
            {
              title: "CPU分配率",
              key: "cpuAllocatedPercent",
              minWidth: 90,
              render: (h, params) => {
                let v = params.row.cpuAllocatedPercent, t = 'CPU',
                color = this.handleColor(v, t,'按分配');
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: color.assignColor,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(v));
              }
            },
            {
              title: "CPU使用率",
              key: "cpuUsedPercent",
              minWidth: 90,
              render: (h, params) => {
                let v = params.row.cpuUsedPercent, t = 'CPU',
                color = this.handleColor(v, t,'按使用');
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: color.useColor,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(v));
              }
            },
            {
              title: "内存总量(GB)",
              key: "memoryTotal",
              minWidth: 100,
            },
            {
              title: "内存已分配量(GB)",
              key: "memoryAllocated",
              minWidth: 120,
            },
            {
              title: "内存分配率",
              key: "memoryAllocatedPercent",
              minWidth: 90,
              render: (h, params) => {
                let v = params.row.memoryAllocatedPercent, t = '内存',
                color = this.handleColor(v, t,'按分配');
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: color.assignColor,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(v));
              }
            },
            {
              title: "剩余内存(GB)",
              key: "memoryFree",
              minWidth: 100,
            },
            {
              title: "内存使用率",
              key: "memoryUsedPercent",
              minWidth: 90,
              render: (h, params) => {
                let v = params.row.memoryUsedPercent, t = '内存',
                color = this.handleColor(v, t,'按使用');
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: color.useColor,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(v));
              }
            }
          ];
          this.url = '/capacity/cas-compute/page/list';
        } else if (this.productName === 'cvk-compute') {
          this.table.columns = [
            {
              title: "集群名称",
              key: "clusterName",
              minWidth: 80
            },
            {
              title: "主机池",
              key: "hostPool",
              minWidth: 80
            },
            {
              title: "集群IP",
              key: "cvmVip",
              minWidth: 100,
            },
            {
              title: "主机IP",
              key: "hostIp",
              minWidth: 100,
            },
            {
              title: "CPU总核数",
              key: "cpuTotal",
              minWidth: 30,
            },
            {
              title: "CPU已分配核数",
              key: "cpuAllocated",
              minWidth: 30,
            },
            {
              title: "CPU分配率",
              key: "cpuAllocatedPercent",
              minWidth: 90,
              render: (h, params) => {
                let v = params.row.cpuAllocatedPercent, t = 'CPU',
                  color = this.handleColor(v, t,'按分配');
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: color.assignColor,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(v));
              }
            },
            {
              title: "CPU使用率",
              key: "cpuUsedPercent",
              minWidth: 90,
              render: (h, params) => {
                let v = params.row.cpuUsedPercent, t = 'CPU',
                  color = this.handleColor(v, t,'按使用');
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: color.useColor,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(v));
              }
            },
            {
              title: "内存总量(GB)",
              key: "memoryTotal",
              minWidth: 30,
            },
            {
              title: "内存已分配量(GB)",
              key: "memoryAllocated",
              minWidth: 30,
            },
            {
              title: "内存分配率",
              key: "memoryAllocatedPercent",
              minWidth: 90,
              render: (h, params) => {
                let v = params.row.memoryAllocatedPercent, t = '内存',
                  color = this.handleColor(v, t,'按分配');
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: color.assignColor,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(v));
              }
            },
            {
              title: "内存使用量(GB)",
              key: "memoryUsed",
              minWidth: 30,
            },
            {
              title: "内存使用率",
              key: "memoryUsedPercent",
              minWidth: 90,
              render: (h, params) => {
                let v = params.row.memoryUsedPercent, t = '内存',
                  color = this.handleColor(v, t,'按使用');
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: color.useColor,
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(v));
              }
            },
            {
              title: "磁盘总量(GB)",
              key: "diskStorage",
              minWidth: 30,
            },
            {
              title: "磁盘使用量(GB)",
              key: "diskStorageUsed",
              minWidth: 30,
            },
            {
              title: "磁盘使用率",
              key: "diskStorageRate",
              minWidth: 30,
            }
          ];
          this.url = '/capacity/cvk-compute/page/list';
        } else if (this.productName === 'cas-storage') {
          this.table.columns = STORAGE_CAS_COLUMNS;
          this.url = '/capacity/storage-cas/page/list';
        } else if (this.productName === 'alone-storage') {
          this.table.columns = STORAGE_ALONE_COLUMNS;
          this.url = '/capacity/storage-alone/page/list';
          this.inputText = '请输入存储IP';
        } else if (this.productName === 'uis-compute') {
          this.table.columns = UIS_COMPUTER_COLUMNS;
          this.url = '/capacity/uis-compute/page/list';
          this.inputText = '请输入主机IP';
        } else if (this.productName === 'uis-cluster') {
          this.table.columns = UIS_CLUSTER_COLUMNS;
          this.url = '/capacity/uis-cluster/page/list';
          this.inputText = '请输入集群名称';
        } else if (this.productName === 'uis-storage') {
          this.table.columns = UIS_STORAGE_COLUMNS;
          this.url = '/capacity/uis-storage/page/list';
          this.inputText = '请输入存储名称';
        }
        if (this.projectName !== '') {
          this.selectWaterLine();
        }
        this.getData(this.url);
    },
    watch: {
      projectName: {
          handler(newVal, oldVal) {
              if(newVal !== oldVal) {
                  this.searchMap.project = newVal
                  this.selectWaterLine();
                  this.getData(this.url);
              }
          }
      }
    }
};
</script>

<style lang="less" scoped>
.detail-wrapper {
  //max-height: 600px;
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
