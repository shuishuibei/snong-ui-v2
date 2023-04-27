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
        <!--        <Input
                    clearable
                    v-model="ipAddress"
                    :filter-method="filterMethod"
                    style="width: 160px"
                    placeholder="请输入Web IP地址"
                    @on-select="handlerSearch"
                >
                </Input>
                <i-button
                  class="cds-btn-search"
                  type="primary"
                  @click="handlerSearch">
                  <i class="iconfont icon-iconfontsousuo"></i>
                </i-button>-->
         <!--   <div class="cds-float-right cds-btn-reset-spacing">
              <i-button
                class="cds-btn-refresh" type="primary"
                @click="handleRefresh">
                <i class="iconfont  icon-shuaxin1"></i>
              </i-button>
            </div>-->
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
    </div>

</template>

<script>
import DragTable from '@/components/drag-table/index'
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue'

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
            sort: {},
            filtersMap: {},
            currentRow:{},//表格中当前操作行
            searchMap: {
              ip: "",              // ip地址
              // inspectionDate: "",  // 巡检日期
              projectName: "",     // 项目名称
              productName: "",     // tabs栏选中项
            },
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
          this.searchMap.ip = this.ipAddress.trim()
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
                    url: '/inspection/product/page/list',
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
        // handleExport() {
        //   this.$http.get(
        //     `/capacity/cas-compute/export?&projectName=${this.projectName}`,
        //     { responseType: 'blob' })
        //   .then((res)=>{
        //     let a = document.createElement('a'),
        //       url = window.URL.createObjectURL(res.data);
        //     a.href = url;
        //     a.download =  this.projectName + "容量报告" + this.$moment().format('YYYYMMDD') + ".xlsx"
        //     a.click();
        //     window.URL.revokeObjectURL(url);
        //   })
        // },
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
      computePercent(hostMem, vmMem, flag) {
        if (hostMem.slice(-2) === vmMem.slice(-2)) {
          hostMem = hostMem.slice(0,-2)
          vmMem = vmMem.slice(0,-2)
        }
        let point = vmMem/hostMem;
        if (flag) {
          point = 1-point;
        }
        return this.toPercent(point);
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
      this.searchMap.projectName = this.projectName
      // this.searchMap.inspectionDate = this.inspectionDate
      this.searchMap.productName = this.productName
        // 查询项目的水位线信息
        if (this.productName === 'CAS') {
          this.table.columns = [
            {
              title: "巡检日期",
              key: "inspectionDate",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.inspectionDate);
              }
            },
            {
              title: "Web IP",
              key: "ip",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].managerAddress);
              }
            },
            {
              title: "版本信息",
              key: "version",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].version);
              }
            },
            {
              title: "主机总数",
              key: "hostNum",
              align: 'center',
              minWidth: 90,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.hostNum);
              }
            },
            {
              title: "主机CPU总核数",
              key: "cpuAllocated",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].hostCPUs);
              }
            },
            {
              title: "虚拟机CPU总核数",
              key: "cpuAllocatedPercent",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].vmCPUs);
              }
            },
            {
              title: "CPU分配比",
              key: "cpuUsedPercent",
              align: 'center',
              minWidth: 90,
              render: (h, params) => {
                let hostCpu = params.row.casInspection.resourceInfo[0].hostCPUs,
                  vmCpu = params.row.casInspection.resourceInfo[0].vmCPUs;
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: '#daac02',
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(vmCpu/hostCpu));
              }
            },
            {
              title: "主机内存总数",
              key: "memoryTotal",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].hostMems);
              }
            },
            {
              title: "虚拟机内存总数",
              key: "memoryAllocated",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].vmMems);
              }
            },
            {
              title: "内存分配率",
              key: "memoryAllocatedPercent",
              align: 'center',
              minWidth: 90,
              render: (h, params) => {
                let hostMem = params.row.casInspection.resourceInfo[0].hostMems,
                  vmMem = params.row.casInspection.resourceInfo[0].vmMems;
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: '#daac02',
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.computePercent(hostMem,vmMem));
              }
            },
            {
              title: "共享存储总容量",
              key: "storageCapacityTotal",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].storageCapacityTotal);
              }
            },
            {
              title: "共享存储可用容量",
              key: "storageCapacityAvailable",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].storageCapacityAvailable);
              }
            },
            {
              title: "虚拟机总数",
              key: "memoryFree",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.vmNum);
              }
            },
            {
              title: "运行虚拟机数",
              key: "memoryUsedPercent",
              align: 'center',
              minWidth: 90,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.vmRunNum);
              }
            }
          ];
        } else if (this.productName === 'ONEStor') {
          this.table.columns = [
            {
              title: "巡检日期",
              key: "inspectionDate",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.inspectionDate);
              }
            },
            {
              title: "Web IP",
              key: "ip",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.resourceInfo[0].managerAddress);
              }
            },
            {
              title: "版本信息",
              key: "version",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.resourceInfo[0].version);
              }
            },
            {
              title: "存储类型",
              key: "storageType",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.storageType);
              }
            },
            {
              title: "集群总容量",
              key: "clusterCapacityTotal",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.resourceInfo[0].clusterCapacityTotal);
              }
            },
            {
              title: "集群可用容量",
              key: "clusterCapacityAvailable",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.resourceInfo[0].clusterCapacityAvailable);
              }
            },
            {
              title: "容量使用率",
              key: "volumeUsedPercent",
              align: 'center',
              minWidth: 90,
              render: (h, params) => {
                let volumeTotal = params.row.oneStorInspection.resourceInfo[0].clusterCapacityTotal,
                  volumeUsed = params.row.oneStorInspection.resourceInfo[0].clusterCapacityAvailable;
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: '#daac02',
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.computePercent(volumeTotal,volumeUsed,true));
              }
            },
            {
              title: "主机总数",
              key: "hostNum",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.hostNum);
              }
            },
            {
              title: "磁盘总数",
              key: "clusterCapacityAvailable",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.diskNum);
              }
            },
            {
              title: "数据盘总数",
              key: "clusterCapacityAvailable",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.diskDataNum);
              }
            },
            {
              title: "冗余策略",
              key: "strategy",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.strategy);
              }
            }
          ];
        } else if (this.productName === 'UIS') {
          this.table.columns = [
            {
              title: "巡检日期",
              key: "inspectionDate",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.inspectionDate);
              }
            },
            {
              title: "Web IP",
              key: "ip",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].managerAddress);
              }
            },
            {
              title: "版本信息",
              key: "version",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].version);
              }
            },
            {
              title: "主机总数",
              key: "hostNum",
              align: 'center',
              minWidth: 90,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.hostNum);
              }
            },
            {
              title: "主机CPU总核数",
              key: "cpuAllocated",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].hostCPUs);
              }
            },
            {
              title: "虚拟机CPU总核数",
              key: "cpuAllocatedPercent",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].vmCPUs);
              }
            },
            {
              title: "CPU分配比",
              key: "cpuUsedPercent",
              align: 'center',
              minWidth: 90,
              render: (h, params) => {
                let hostCpu = params.row.casInspection.resourceInfo[0].hostCPUs,
                  vmCpu = params.row.casInspection.resourceInfo[0].vmCPUs;
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: '#daac02',
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.toPercent(vmCpu/hostCpu));
              }
            },
            {
              title: "主机内存总数",
              key: "memoryTotal",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].hostMems);
              }
            },
            {
              title: "虚拟机内存总数",
              key: "memoryAllocated",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].vmMems);
              }
            },
            {
              title: "内存分配率",
              key: "memoryAllocatedPercent",
              align: 'center',
              minWidth: 90,
              render: (h, params) => {
                let hostMem = params.row.casInspection.resourceInfo[0].hostMems,
                  vmMem = params.row.casInspection.resourceInfo[0].vmMems;
                return h('span', {
                  style: {
                    padding: '10px',
                    backgroundColor: '#daac02',
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }, this.computePercent(hostMem,vmMem));
              }
            },
            {
              title: "共享存储总容量",
              key: "storageCapacityTotal",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].storageCapacityTotal);
              }
            },
            {
              title: "共享存储可用容量",
              key: "storageCapacityAvailable",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.resourceInfo[0].storageCapacityAvailable);
              }
            },
            {
              title: "虚拟机总数",
              key: "memoryFree",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.vmNum);
              }
            },
            {
              title: "运行虚拟机数",
              key: "memoryUsedPercent",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.casInspection.vmRunNum);
              }
            },
            {
              title: "集群总容量",
              key: "clusterCapacityTotal",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.resourceInfo[0].clusterCapacityTotal);
              }
            },
            {
              title: "集群可用容量",
              key: "clusterCapacityAvailable",
              align: 'center',
              minWidth: 120,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.resourceInfo[0].clusterCapacityAvailable);
              }
            },
            {
              title: "磁盘总数",
              key: "clusterCapacityAvailable",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.diskNum);
              }
            },
            {
              title: "数据盘总数",
              key: "clusterCapacityAvailable",
              align: 'center',
              minWidth: 100,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.diskDataNum);
              }
            },
            {
              title: "冗余策略",
              key: "strategy",
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('span', {
                }, params.row.oneStorInspection.strategy);
              }
            }
          ];
        }
        // else if (this.productName === 'CloudOS') {
        //   this.table.columns = STORAGE_ALONE_COLUMNS;
        // }
        if (this.projectName !== '') {
          this.getData();
        }
    },
    watch: {
      // inspectionDate: {
      //   handler(newVal, oldVal) {
      //     if(newVal !== oldVal) {
      //       this.searchMap.inspectionDate = newVal
      //       this.getData();
      //     }
      //   },
      // },
      projectName: {
          handler(newVal, oldVal) {
              if(newVal !== oldVal) {
                  this.searchMap.projectName = newVal
                  // this.selectWaterLine();
                  this.getData();
              }
          }
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
