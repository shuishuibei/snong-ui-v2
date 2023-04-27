<!--
 * @Description: 定时任务
 * @Author: ys2234
 * @Date: 2019-07-25 11:47:04
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:10:11
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <div class="cds-clearfix cds-margin-bottom-14">
      <div class="cds-float-left-btn">
        <i-input
          clearable
          v-model="inputValue"
          class="cds-input-search"
          placeholder="请输入任务名称进行查询"
          @on-keyup.enter="handleSearch">
        </i-input>
        <i-button
          type="primary"
          class="cds-btn-search"
          @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
      <div class="cds-float-right-btn">
        <i-button type="primary" @click="flag.add = true">
          <i class="iconfont icon-plus">新增</i>
        </i-button>
        <i-button type="primary" @click="handleDeleteMult">
          <i class="iconfont icon-shanchu">批量删除</i>
        </i-button>
        <i-button class="cds-btn-refresh" @click="handleRefresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <i-table
      ref="table"
      stripe
      highlight-row
      :key="tableConfig.key"
      :loading="tableConfig.loading"
      :columns="tableConfig.columns"
      :data="tableConfig.data"
      @on-sort-change="sortChange"
      @on-select="selectConfirm"
      @on-select-cancel="selectCancel"
      @on-select-all="selectAll"
      @on-select-all-cancel="selectAllCancel">
    </i-table>
    <div class="cds-clearfix cds-margin-top-14">
      <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
      <div class="cds-float-right">
        <i-page
          show-sizer
          placement="top"
          :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          :page-size-opts="[10, 20, 30, 50]"
          @on-change="getTableData({ currentPage: $event, pageSize: page.pageSize })"
          @on-page-size-change="getTableData({ pageSize: $event })">
        </i-page>
      </div>
    </div>
    <timed-task-edit
      title="新增定时任务"
      v-model="flag.add"
      @on-refresh="handleRefresh">
    </timed-task-edit>
    <timed-task-edit
      title="修改定时任务"
      :data="currentRow"
      v-model="flag.modify"
      @on-refresh="handleRefresh">
    </timed-task-edit>
    <h3c-modal-detail
      title="定时任务详情"
      label-width="140"
      :data="currentRow"
      :rows="detailRows"
      v-model="flag.detail">
    </h3c-modal-detail>
    <h3c-modal-confirm
      title="停止定时任务"
      :info="'确认停止执行定时任务：' + currentRow.jobName + '？'"
      v-model="flag.stopExec"
      @on-ok="sumbitStop">
    </h3c-modal-confirm>
    <h3c-modal-confirm
      title="立即执行" :info="'确认立即执行定时任务：' + currentRow.jobName + '？'"
      v-model="flag.immedExec"
      @on-ok="sumbitImmed">
    </h3c-modal-confirm>
    <h3c-modal-confirm
      title="定时执行" :info="'确认定时执行定时任务：' + currentRow.jobName + '？'"
      v-model="flag.timedExec"
      @on-ok="sumbitTimed">
    </h3c-modal-confirm>
    <h3c-modal-confirm
      title="删除定时任务" :info="'确认删除定时任务：' + currentRow.jobName + '？'"
      v-model="flag.deleteSingle"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
    <h3c-modal-confirm
      title="删除定时任务" :info="'确认删除这：' + selectedIdsList.length + '个定时任务？'"
      v-model="flag.deleteMult"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
  </div>
</template>

<script>
import { dataFormat } from '@/assets/js/format'; // 引入日期格式化
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import H3cModalDetail from '@/components/h3c-modal-detail/H3cModalDetail.vue';
import TimedTaskEdit from './components/TimedTaskEdit.vue';
export default {
  name: 'TimedTask',
  components: {
    'h3c-modal-confirm': H3cModalConfirm,
    'h3c-modal-detail': H3cModalDetail,
    'timed-task-edit': TimedTaskEdit
  },
  data() {
    return {
      inputValue: '', // 搜索框中显示的值
      searchValue: '', // 实际点击查询按钮发送的值
      selectedIdsList: [], // 选中项
      currentRow: {}, // 表格中当前行
      /**
       * 分页
       * @property {number} pageSize    - 每页条数
       * @property {number} totalCount  - 总数
       * @property {number} totalPage   - 总页数
       * @property {number} currentPage - 当前页码
       */
      page: {
        pageSize: 20,
        totalCount: 0,
        totalPage: 1,
        currentPage: 1
      },
      tableConfig: {
        key: new Date().toString(),
        loading: false,
        columns: [
          {
            type: 'selection',
            width: 40,
            align: 'center'
          },
          {
            title: '任务名称',
            key: 'jobName',
            sortable: 'custom',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  class: 'cell-info-active',
                  attrs: {
                    title: params.row.jobName
                  },
                  on: {
                    click: () => {
                      this.currentRow = params.row;
                      this.currentRow.createDate = dataFormat(params.row.createDate, '-');
                      this.currentRow.modifiedDate = dataFormat(params.row.modifiedDate, '-');
                      this.flag.detail = true;
                    }
                  }
                },
                params.row.jobName
              );
            }
          },
          {
            title: '任务分组',
            key: 'jobGroup',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.jobGroup
                  }
                },
                params.row.jobGroup
              );
            }
          },
          {
            title: '任务描述',
            key: 'description',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.description
                  }
                },
                params.row.description
              );
            }
          },
          {
            title: 'cron表达式',
            key: 'cron',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.cron
                  }
                },
                params.row.cron
              );
            }
          },
          {
            title: '所属者',
            key: 'owner',
            ellipsis: true,
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.owner
                  }
                },
                params.row.owner
              );
            }
          },
          {
            title: '停止',
            key: 'stop',
            width: 64,
            align: 'center',
            render: (h, params) => {
              let obj = this.accessOps(params.row.start);
              return h('div', [
                h('i', {
                  class: {
                    iconfont: true,
                    'icon-tingzhi': true,
                    'cds-grey-icon': !obj.stop
                  },
                  on: {
                    click: () => {
                      if (obj.stop) {
                        this.currentRow = params.row;
                        this.flag.stopExec = true;
                      }
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '执行一次',
            key: 'one',
            width: 84,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i', {
                  class: 'iconfont icon-carry-out icon-carry-out-color',
                  on: {
                    click: () => {
                      this.currentRow = params.row;
                      this.flag.immedExec = true;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '定时执行',
            key: 'timing',
            width: 84,
            align: 'center',
            render: (h, params) => {
              let obj = this.accessOps(params.row.start);
              return h('div', [
                h('i', {
                  class: {
                    iconfont: true,
                    'icon-dingshi': true,
                    'cds-grey-icon': !obj.start
                  },
                  on: {
                    click: () => {
                      if (obj.start) {
                        this.currentRow = params.row;
                        this.flag.timedExec = true;
                      }
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '修改',
            key: 'modify',
            width: 64,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i', {
                  class: 'iconfont icon-weibiaoti2010104',
                  on: {
                    click: () => {
                      this.currentRow = params.row;
                      this.flag.modify = true;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '删除',
            key: 'delete',
            width: 64,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i', {
                  class: 'iconfont icon-shanchu',
                  on: {
                    click: () => {
                      if (params.row.start) {
                        this.$Notice.warning({
                          desc: '请先停止选中的定时任务后再删除'
                        });
                        return;
                      }
                      this.currentRow = params.row;
                      this.flag.deleteSingle = true;
                    }
                  }
                })
              ]);
            }
          }
        ],
        data: []
      },
      detailRows: [
        {
          title: '任务名称',
          key: 'jobName'
        },
        {
          title: '任务分组',
          key: 'jobGroup'
        },
        {
          title: '任务描述',
          key: 'description'
        },
        {
          title: 'CRON',
          key: 'cron'
        },
        {
          title: '任务全类名',
          key: 'className'
        },
        {
          title: '任务拥有者',
          key: 'owner'
        },
        {
          title: '是否激活',
          key: 'active'
        },
        {
          title: '是否启动',
          key: 'start'
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '修改时间',
          key: 'modifiedDate'
        }
      ],
      /**
       * @property {boolean} immedExec    - 立即执行
       * @property {boolean} timedExec    - 定时执行
       * @property {boolean} stopExec     - 停止执行
       * @property {boolean} detail       - 详情
       * @property {boolean} deleteSingle - 单条删除
       * @property {boolean} deleteMult   - 多条删除
       * @property {boolean} add          - 新增
       * @property {boolean} modify       - 修改
       */
      flag: {
        immedExec: false,
        timedExec: false,
        stopExec: false,
        detail: false,
        deleteSingle: false,
        deleteMult: false,
        add: false,
        modify: false
      }
    };
  },
  methods: {
    /**
     * @function 发送请求获取表格数据，并且做相应处理
     * @param {boolean} clearable   - 是否清空表格数据和选中项
     * @param {number}  currentPage - 分页当前页，默认值为第一页
     * @param {number}  pageSize    - 分页每页条数，默认值为每页10条
     */
    getTableData({ clearable = false, currentPage = 1, pageSize = 20 } = {}) {
      this.tableConfig.loading = true;
      if (clearable) {
        this.tableConfig.data = [];
        this.selectedIdsList = [];
      }
      this.page.pageSize = pageSize;
      this.page.currentPage = currentPage;
      this.$http
        .post('sysTimedTask/query', {
          current: currentPage,
          orderMap: this.orderMap,
          pageSize: pageSize,
          searchMap: {
            jobName: this.searchValue
          }
        })
        .then(({ data }) => {
          if (data.status) {
            let resp = data.data;
            resp.records.forEach(item => {
              for (let subItem of this.selectedIdsList) {
                if (item.id === subItem) {
                  item._checked = true;
                  break;
                }
              }
            });
            this.tableConfig.data = resp.records;
            this.page.totalCount = resp.total;
            this.page.totalPage = resp.pages ? resp.pages : 1;
          }
          this.tableConfig.loading = false;
        });
    },
    /**
     * @function 清空搜索框
     * @private
     */
    _setInputEmpty() {
      this.inputValue = '';
      this.searchValue = '';
    },
    /**
     * @function 将输入框中的值首尾去空格后赋值给查询字段searchValue，请求表格数据：保留每页条数
     * @description 点击查询按钮触发
     */
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      this.getTableData({
        clearable: true,
        pageSize: this.page.pageSize
      });
    },
    handleRefresh() {
      this._setInputEmpty(); // 清空搜索输入框
      this.orderMap = {}; // 清空排序
      this.tableConfig.key = new Date().toString(); // 重设Table组件的key，促使Table组件重新渲染
      /* 请求表格数据：保留每页条数 */
      this.getTableData({
        clearable: true,
        pageSize: this.page.pageSize
      });
    },
    handleDeleteMult() {
      let len = this.selectedIdsList.length;
      if (!len) {
        this.$Notice.warning({
          desc: '请至少选择一条数据'
        });
        return;
      }
      this.currentRow = {};
      this.flag.deleteMult = true;
    },
    /**
     * @description 当表格点击排序时触发
     * @param {object} column 当前列数据
     * @param {string} key 排序依据的指标，即当前列的key值
     * @param {string} order 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     */
    sortChange({ column, key, order }) {
      let flag;
      /* 将order转换为true或false，true为升序，false为降序 */
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
      this.getTableData({ clearable: true, pageSize: this.page.pageSize });
    },
    /**
     * @function 添加选中项
     * @description 在多选模式下有效，选中某一项时触发
     * @param {Array}  selection - 当前页面已选数据
     * @param {Object} row       - 刚选择的项数据
     */
    selectConfirm(selection, row) {
      this.selectedIdsList.push(row.id);
    },
    /**
     * @function 移除取消选中项
     * @description 在多选模式下有效，取消选中某一项时触发
     * @param {Array}  selection - 当前页面已选数据
     * @param {Object} row       - 取消选择的项数据
     */
    selectCancel(selection, row) {
      for (let [index, item] of this.selectedIdsList.entries()) {
        if (item === row.id) {
          this.selectedIdsList.splice(index, 1);
          break;
        }
      }
    },
    /**
     * @function 添加选中项
     * @description: 在多选模式下有效，点击全选时触发
     * @param {Array} selection - 当前页面已选项数据
     */
    selectAll(selection) {
      selection.forEach(item => {
        if (this.selectedIdsList.length > 0) {
          for (let [subIndex, subItem] of this.selectedIdsList.entries()) {
            if (item.id === subItem) {
              break;
            }
            if (subIndex === this.selectedIdsList.length - 1) {
              this.selectedIdsList.push(item.id);
            }
          }
        } else {
          this.selectedIdsList.push(item.id);
        }
      });
    },
    /**
     * @function 移除取消选中项
     * @description: 在多选模式下有效，点击取消全选时触发
     * @param {Array} selection - 当前页面已选项数据
     */
    selectAllCancel(selection) {
      /* 由于该方法参数未返回取消选中项，所以用当前页面数据替代 */
      this.tableConfig.data.forEach(item => {
        for (let [subIndex, subItem] of this.selectedIdsList.entries()) {
          if (item.id === subItem) {
            this.selectedIdsList.splice(subIndex, 1);
            break;
          }
        }
      });
    },
    sumbitStop() {
      this.$loading.show();
      this.$http.put(`sysTimedTask/stopById/${this.currentRow.id}`).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: '停止定时任务成功'
          });
          this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        }
      });
    },
    sumbitImmed() {
      this.$loading.show();
      this.$http
        .put(`sysTimedTask/executeCronJobForOnce/${this.currentRow.id}`)
        .then(({ data }) => {
          this.$loading.hide();
          if (data.status) {
            this.$Notice.success({
              desc: '立即执行定时任务成功'
            });
            this.getTableData({ clearable: true, pageSize: this.page.pageSize });
          }
        });
    },
    sumbitTimed() {
      this.$loading.show();
      this.$http.put(`sysTimedTask/startById/${this.currentRow.id}`).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: '开启定时任务成功'
          });
          this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        }
      });
    },
    submitDelete() {
      this.$loading.show();
      this.$http({
        method: 'DELETE',
        url: 'sysTimedTask/delete/batch',
        data: this.currentRow.id ? [this.currentRow.id] : this.selectedIdsList
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: '删除定时任务成功'
          });
          this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        }
      });
    },
    accessOps(isStart) {
      let obj = {
        stop: false,
        start: true
      };
      if (isStart) {
        obj.stop = true;
        obj.start = false;
      }
      return obj;
    }
  },
  created() {
    this.getTableData();
  }
};
</script>
