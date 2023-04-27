<!--
 * @Description: x86硬盘模块
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-11-01 11:53:36
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix cds-margin-bottom-14">
      <!-- search start -->
      <div class="cds-float-left-btn">
        <!-- 下拉框联动搜索 -->
        <i-input
          clearable
          class="cds-input-search"
          v-model="queryName"
          placeholder="请输入x86硬盘名称进行查询"></i-input>
        <i-button type="primary" class="cds-btn-search" @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
      <div class="cds-float-right-btn">
        <i-button type="primary" @click="handleDeleteMult">
          <i class="iconfont icon-tuihuozhong">批量退订</i>
        </i-button>
        <i-button class="cds-btn-refresh" @click="refresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <!-- 表格 -->
    <i-table
      stripe
      highlight-row
      :key="tableConfig.key"
      :data="cloudDiskTable.showData"
      :columns="tableConfig.columns"
      :loading="cloudDiskTable.loading"
      @on-select="handleSelectSingle"
      @on-select-cancel="handleSelectSingleCancel"
      @on-select-all="handleSelectAll"
      @on-select-all-cancel="handleSelectAllCancel"
      @on-sort-change="sortChange"></i-table>
    <!-- 分页 -->
    <div class="cds-clearfix cds-margin-top-14">
      <div class="cds-float-left">
        共有{{cloudDiskTable.total}}条记录，当前页{{cloudDiskTable.current}}/{{cloudDiskTable.getPageNum()}}页
      </div>
      <div class="cds-float-right">
        <i-page
          show-sizer
          placement="top"
          :total="cloudDiskTable.total"
          :current="cloudDiskTable.current"
          :page-size="cloudDiskTable.size"
          :page-size-opts="cloudDiskTable.pageSizeOpts"
          @on-page-size-change="changePageSize($event, cloudDiskTable)"
          @on-change="changePage($event, cloudDiskTable)"></i-page>
      </div>
    </div>

    <!-- 修改 -->
    <update-disk-modal
      v-model="disk.updateDisk"
      :data="transferUpdateData"
      @updateDisks="getDisklist"
      title="修改"></update-disk-modal>

    <!-- 删除 -->
    <h3c-modal-confirm
      title="退订x86硬盘"
      warning="注：硬盘销毁后，硬盘上存储的数据将无法恢复"
      :value="disk.deleteSelect"
      :info="'确认退订选中的x86硬盘' + (transferDeleteData.singleOrMultipleDelete===true ? '(数量：'+selectAll.length+'个)' : '：'+transferDeleteData.name)"
      @on-cancel="disk.deleteSelect=false"
      @on-ok="submitDelete"></h3c-modal-confirm>

    <!-- 详情信息 -->
    <details-info-modal
      v-model="disk.detailsInfo"
      :data="transferDetailData"
      title="硬盘基本信息"></details-info-modal>

    <!-- 扩容Disk Modal -->
    <expand-disk-modal
      v-model="disk.expandDisk"
      :data="transferExpandData"
      @updateDisks="getDisklist"
      title="扩容X86硬盘"></expand-disk-modal>

    <!-- 挂载/卸载 Modal -->
    <h3c-modal-table
      ref="MountInfoModal"
      title="挂载至虚拟机"
      placeholder="请输入名称进行查询"
      query-key="serverName"
      url="server/list/volume/page"
      :width="800"
      :tips-flag="false"
      :query-flag="true"
      :param-map="mountToHost"
      :table-item="mountDiskItem"></h3c-modal-table>

    <!-- 卸载Disk Modal -->
    <h3c-modal-confirm
      title="卸载x86硬盘"
      warning="注 : 卸载硬盘前，建议先在操作系统中停用或umount要卸载的硬盘,以免造成虚拟机操作系统异常;卸载完成后请重启虚拟机以保证虚拟机可用。"
      :value="disk.uninstallDisk"
      :info="'确认卸载选中的x86硬盘:'+transferUninstallData.name"
      @on-cancel="disk.uninstallDisk=false"
      @on-ok="submitUnmountVolume"></h3c-modal-confirm>
  </div>
</template>

<script>
// 引入硬盘状态
import { VolumeStatus } from '@/assets/js/status/index.js';
// 引入硬盘基本信息 Modal
import DetailsInfoModal from './components/DiskDetail.vue';
// 引入 扩容 Modal
import ExpandDiskModal from './components/ExpandDiskSize.vue';
// 引入 修改 Modal
import UpdateDiskModal from './components/UpdateDisk.vue';
// 引入确认弹出框 Modal
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
// 引入表格弹出框 Modal
import H3cModalTable from '@/components/h3c-modal-table/H3cModalTable.vue';
// 引入分页封装对象
import { PageParams } from '@/assets/js/page-params.js';
// 引入时间转化方法
import { formatDate } from '@/assets/js/utils';
// 引入表格多选保留数据的混合文件
import tableSelectAllMixins from '@/assets/js/table-select-all-mixins.js';

export default {
  name: 'CloudDisk',
  mixins: [tableSelectAllMixins],
  components: {
    'details-info-modal': DetailsInfoModal,
    'expand-disk-modal': ExpandDiskModal,
    'update-disk-modal': UpdateDiskModal,
    'h3c-modal-confirm': H3cModalConfirm,
    'h3c-modal-table': H3cModalTable
  },
  data() {
    return {
      queryFlag: false,
      /* 挂载硬盘到主机所需参数 */
      mountToHost: {
        userId: '',
        azoneId: '',
        volumeId: '',
        serverId: ''
      },
      /* 挂载硬盘弹出主机列表Item */
      mountDiskItem: [
        {
          title: '名称',
          sortable: true,
          key: 'serverName'
        },
        {
          title: '挂载',
          width: 100,
          key: 'link',
          render: (h, params) => {
            return h('i', {
              class: ['iconfont', 'icon-guazai'],
              attrs: {
                title: '挂载'
              },
              on: {
                click: () => {
                  this.mountToHost.serverId = params.row.id; //点击Modal中的挂载获取serverId
                  this.submitMountVolume();
                }
              }
            });
          }
        }
      ],
      cloudDiskTable: new PageParams(),
      selectTableConfig: {
        tableKey: 'id',
        dataKey: 'cloudDiskTable.showData',
        disableKey: 'true'
      },
      orderMap: {}, //表格排序参数
      hostFilter: {}, //表格筛选参数
      /**
       * 搜索功能定义两个变量queryName和searchValue
       * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
       */
      queryName: '', //搜索框中显示的值
      searchValue: '', //实际点击查询按钮发送的值
      // disk下的弹出框 Modal
      disk: {
        createDisk: false,
        detailsInfo: false,
        expandDisk: false,
        updateDisk: false,
        deleteSelect: false,
        uninstallDisk: false
      },
      // 传输至DetailsInfo Modal 的数据
      transferDetailData: {},
      // 传输至ExpandDisk Modal 的数据
      transferExpandData: {},
      // 传输至updateDisk Modal 的数据
      transferUpdateData: {},
      // 传输至DeleteSelect Modal 的数据
      transferDeleteData: {
        name: '',
        id: '', //删除一条时
        singleOrMultipleDelete: null
      },
      // 传输至UninstallDisk Modal 的数据
      transferUninstallData: {
        name: '',
        volumeId: '',
        serverId: ''
      },
      // created life cycle 时进行赋值
      userName: '',
      //表格配置信息
      tableConfig: {
        key: new Date().toString(), //表格的属性key
        //表格列的配置描述
        columns: [
          {
            type: 'selection', //多选功能
            width: 40,
            align: 'center'
          },
          {
            title: '名称', //列头显示文字
            key: 'name', //对应列内容的字段名，需要与表格绑定的data中对象的属性匹配
            sortable: 'custom', //设置为custom，代表远程排序
            width: 150,
            ellipsis: true,
            render: (h, params) => {
              let id = params.row.id,
                name = params.row.name;
              return h(
                'div',
                {
                  class: ['cell-info-active'],
                  attrs: { title: name },
                  on: {
                    click: () => {
                      this.disk.detailsInfo = true;
                      this.transferDetailData = {
                        id: id,
                        name: name
                      };
                    }
                  }
                },
                name
              );
            }
          },
          {
            title: '状态',
            key: 'status',
            ellipsis: true,
            VolumeStatus: VolumeStatus,
            filterMultiple: false, //筛选默认是多选的，需要手动关闭
            filters: VolumeStatus, //必须同时配置filterRemote
            filterRemote: filters => {
              this.cloudDiskTable.current = 1;
              this.filterStatusRemote(filters, 'status');
            },
            render: function(h, params) {
              let active = params.row.status,
                node = params.column.VolumeStatus.filter(item => {
                  return item.value === active;
                })[0];
              return h(
                'span',
                {
                  style: {
                    color: node.color
                  }
                },
                [
                  h('div', {
                    class: 'cds-status-dot',
                    style: {
                      background: node.color
                    }
                  }),
                  h(
                    'span',
                    {
                      style: {
                        'vertical-align': 'middle'
                      }
                    },
                    node.label
                  )
                ]
              );
            }
          },
          {
            title: '容量(GB)',
            sortable: 'custom',
            key: 'size',
            ellipsis: true,
            render: this.tableRender('size')
          },
          {
            title: '存储类型',
            sortable: 'custom',
            ellipsis: true,
            key: 'storageType',
            render: this.tableRender('storageType')
          },
          {
            title: '虚拟机',
            width: 120,
            ellipsis: true,
            key: 'serverName',
            render: this.tableRender('serverName')
          },
          {
            title: '所有者',
            key: 'loginName',
            ellipsis: true,
            render: this.tableRender('loginName')
          },
          {
            title: '资源区域',
            ellipsis: true,
            key: 'azoneNameLabel',
            render: this.tableRender('azoneNameLabel')
          },
          {
            title: '创建时间',
            ellipsis: true,
            key: 'createdDate',
            sortable: 'custom', //设置为custom，代表远程排序
            render: (h, params) => {
              let date = formatDate(params.row.createdDate);
              //将时间格式化
              return h(
                'span',
                {
                  attrs: {
                    title: date
                  }
                },
                date
              );
            }
          },
          {
            title: '挂载/卸载',
            key: 'edit',
            width: 74,
            align: 'center',
            render: (h, params) => {
              let { id, name, serverId, azoneId, userId } = params.row;
              // name = params.row.name;
              if (params.row.serverName == null || params.row.serverName === '') {
                return h(
                  'div',
                  {
                    attrs: {
                      title: '挂载'
                    },
                    on: {
                      click: () => {
                        this.mountToHost.userId = userId;
                        this.mountToHost.azoneId = azoneId;
                        this.mountToHost.volumeId = id;
                        this.$refs.MountInfoModal.showModal();
                      }
                    }
                  },
                  [
                    h('i', {
                      class: 'iconfont icon-guazai'
                    })
                  ]
                );
              } else {
                return h(
                  'div',
                  {
                    attrs: {
                      title: '卸载'
                    },
                    on: {
                      //点击卸载图标，显示卸载硬盘对话框
                      click: () => {
                        this.transferUninstallData = {
                          volumeId: id,
                          name: name,
                          serverId: serverId
                        };
                        this.disk.uninstallDisk = true;
                      }
                    }
                  },
                  [
                    h('i', {
                      class: 'iconfont icon-xiezai'
                    })
                  ]
                );
              }
            }
          },
          {
            title: '扩容',
            key: 'dilatation',
            width: 50,
            align: 'center',
            render: (h, params) => {
              let id = params.row.id,
                size = params.row.size,
                name = params.row.name,
                storageType = params.row.storageType;
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.transferExpandData = {
                        id,
                        name,
                        size,
                        storageType
                      };
                      this.disk.expandDisk = true;
                    }
                  }
                },
                [
                  h('i', {
                    class: 'iconfont icon-kuozhan'
                  })
                ]
              );
            }
          },
          {
            title: '修改',
            key: 'modifyOwner',
            width: 50,
            align: 'center',
            render: (h, params) => {
              let id = params.row.id,
                name = params.row.name,
                description = params.row.description;
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.transferUpdateData = {
                        id,
                        name,
                        description
                      };
                      this.disk.updateDisk = true;
                    }
                  }
                },
                [
                  h('i', {
                    class: 'iconfont icon-weibiaoti2010104'
                  })
                ]
              );
            }
          },
          {
            title: '退订',
            key: 'delete',
            width: 50,
            align: 'center',
            render: (h, params) => {
              let id = params.row.id,
                name = params.row.name;
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.transferDeleteData.name = name;
                      this.transferDeleteData.id = id;
                      this.transferDeleteData.singleOrMultipleDelete = false;
                      this.disk.deleteSelect = true;
                    }
                  }
                },
                [
                  h('i', {
                    class: 'iconfont icon-tuihuozhong'
                  })
                ]
              );
            }
          }
        ]
      }
    };
  },
  methods: {
    /**
     * @description: 给表格内数据添加title属性
     * @param paramName {String} 参数名
     * @return: render回调函数
     */
    tableRender(paramName) {
      return (h, params) => {
        let param = params.row[paramName];
        return h(
          'span',
          {
            attrs: { title: param }
          },
          param
        );
      };
    },
    /**
     * @description: 状态远程过滤方法
     * @param filters {Array} 状态数组
     * @param key {String} 状态字段
     */
    filterStatusRemote(filters, key) {
      this.hostFilter[key] = filters[0];
      this.selectAll = [];
      this.getDisklist();
    },
    /**
     * @description:当表格点击排序时触发
     * @param option {Object} 排序信息对象 里面有column:当前列数据;key:排序依据的指标，即当前列的key值;order:排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     * @return: null
     */
    sortChange(option) {
      this.orderMap = {};
      this.cloudDiskTable.current = 1; //改编页码时跳转到第一页
      let order;
      if (option.order === 'asc') {
        order = true;
      } else if (option.order === 'desc') {
        order = false;
      } else {
        order = undefined;
      }
      this.$set(this.orderMap, option.key, order);
      this.selectAll = [];
      this.getDisklist();
    },
    /**
     * @description: 跳转页面
     * @param currentPage {Number} 当前页数
     * @param tablePage {Object} 分页封装对象
     * @return: null
     */
    changePage(currentPage, tablePage) {
      tablePage.current = currentPage;
      this.getDisklist();
    },
    /**
     * @description: 更改页数
     * @param pageSize {Number} 每页展示页数
     * @param tablePage {Object} 分页封装对象
     * @return: null
     */
    changePageSize(pageSize, tablePage) {
      tablePage.size = pageSize;
      this.$nextTick(() => {
        this.getDisklist();
      });
    },
    /**
     * @description: 发送挂载云硬盘请求
     * @return: null
     */
    submitMountVolume() {
      this.$loading.show();
      this.$http
        .post(`volume/mount/${this.mountToHost.volumeId}/${this.mountToHost.serverId}`)
        .then(({ data }) => {
          if (data.status) {
            this.$refs.MountInfoModal.closeModal();
            this.$Notice.success({ desc: '挂载请求发送成功，请稍后刷新确认！' });
            this.submitTimedTask();
            this.getDisklist();
          }
          this.$loading.hide();
        });
    },
    /**
     * @description: 卸载x86硬盘
     * @return: null
     */
    submitUnmountVolume() {
      this.$loading.show();
      this.$http
        .delete(
          `volume/unmount/${this.transferUninstallData.volumeId}/${this.transferUninstallData.serverId}`
        )
        .then(({ data }) => {
          this.$loading.hide();
          this.disk.uninstallDisk = false;
          if (data.status) {
            this.$Notice.success({ desc: '卸载请求发送成功，请稍后刷新确认！' });
            this.submitTimedTask();
            this.getDisklist();
          }
        });
    },
    /**
     * @description: 退订x86硬盘
     * @return: null
     */
    submitDelete() {
      let ids = this.transferDeleteData.singleOrMultipleDelete
        ? this.selectAll
        : [this.transferDeleteData.id];
      this.$loading.show();
      this.$http
        .post('volume/delete/batch', {
          password: '',
          volumeIds: ids
        })
        .then(({ data }) => {
          if (data.status) {
            this.$Notice.success({ desc: data.message });
            this.disk.deleteSelect = false;
            this.refresh();
          }
          this.$loading.hide();
        });
    },
    /**
     * @description: 点击查询按钮触发
     * @return: null
     */
    handleSearch() {
      /* 将输入框中的值首尾去空格后赋值给查询字段searchValue */
      this.searchValue = this.queryName.trim();
      this.selectAll = [];
      this.getDisklist();
    },
    /**
     * @description: 点击刷新按钮触发，刷新硬盘
     * @return: null
     */
    refresh() {
      this.tableConfig.key = new Date().toString(); // 重设Table组件的key，促使Table组件重新渲染
      this.setInputEmpty(); // 清空搜索输入框
      this.orderMap = {}; // 清空排序
      this.hostFilter = {};
      this.selectAll = [];
      this.cloudDiskTable.current = 1;
      this.cloudDiskTable.showData = [];
      this.getDisklist();
    },
    /**
     * @description: 点击批量删除按钮触发
     * @return: null
     */
    handleDeleteMult() {
      let len = this.selectAll.length;
      //如果选中的条数为0，提示请至少选择一条数据
      if (!len) {
        this.$Notice.warning({
          desc: '请至少选择一条数据'
        });
        return;
      }
      this.transferDeleteData.singleOrMultipleDelete = true;
      //如果选中的条数不为0，则显示批量删除提示框
      this.disk.deleteSelect = true;
    },
    /**
     * @description: 新建x86硬盘成功后启动定时任务，清空搜索框，并且跳转到第一页
     * @return: null
     */
    afterCreateSuccess() {
      // this.submitTimedTask();                  //启动定时任务
      this.setInputEmpty(); //清空搜索框
      this.getDisklist();
    },
    /**
     * @description: 发送定时任务请求，定时获取硬盘状态并且同步到本地表中
     * @return: null
     */
    submitTimedTask() {
      this.$http.put('sysTimedTask/startByName/volumeStatus').then();
    },
    /**
     * @description: 清空搜索框
     * @return: null
     */
    setInputEmpty() {
      this.queryName = '';
      this.searchValue = '';
    },
    /**
     * @description: 获取硬盘列表方法
     * @return: null
     */
    getDisklist() {
      /* 防止触发changePageSize时同时触发changePage事件，短时间内同时调用两次请求 */
      if (this.queryFlag) {
        return;
      } else {
        this.queryFlag = true;
        setTimeout(() => {
          this.queryFlag = false;
        }, 300);
      }
      //显示表格加载数据动画
      this.cloudDiskTable.loading = true;
      this.$http
        .post('/volume/list/page', {
          searchMap: Object.assign({ name: this.searchValue }, this.hostFilter),
          orderMap: this.orderMap,
          current: this.cloudDiskTable.current,
          pageSize: this.cloudDiskTable.size
        })
        .then(({ data }) => {
          if (data.status) {
            let resp = data.data;
            resp.records.forEach(item => {
              if (this.selectAll.includes(item.id)) {
                item._checked = true;
              }
            });
            this.cloudDiskTable.showData = resp.records;
            this.cloudDiskTable.size = resp.size;
            this.cloudDiskTable.total = resp.total;
            this.cloudDiskTable.current = resp.current;
          }
          this.cloudDiskTable.loading = false;
        })
        .catch(() => {
          this.cloudDiskTable.loading = false;
        });
    }
  },
  created() {
    this.getDisklist();
    this.userName = this.$store.state.login.userName;
  }
};
</script>

<style lang="less" scoped>
/* Uninstall & Delete Warn */
.warn-content {
  clear: both;
  text-align: center;
  background-color: #feefe6;
}

#uninstallDisk {
  .warn-content {
    height: 150px;
    margin: 0;
  }
}

#deleteDisk {
  .warn-content {
    height: 100px;
    margin-bottom: 10px;
  }
}

.warn-content-top {
  float: left;
  text-align: center;
  height: 100%;
  width: 15%;
  font-size: 20px;
  .problemImg {
    position: relative;
    top: 20%;
    left: 10%;
  }
}

.warn-content-bottom {
  float: left;
  text-align: left;
  height: 100%;
  width: 85%;
  .warn-info {
    font-size: 20px;
    height: 50%;
    position: relative;
    div {
      width: 100%;
      position: absolute;
      top: 65%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .notes {
    color: #ff6410;
    height: 50%;
    line-height: 30px;
  }
}
</style>
