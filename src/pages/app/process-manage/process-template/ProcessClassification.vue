<template>
  <div class="process-template">
    <!-- 头部搜索和按钮操作 -->
    <div class="cds-clearfix">
      <div class="cds-float-right">
        <i-button
          type="primary"
          @click="handleCreate">
          <i class="iconfont icon-plus">新 增</i>
        </i-button>
        <i-button
          type="primary"
          class="btn-long"
          @click="handleDeleteMult">
          <i class="iconfont icon-shanchu">批量删除</i>
        </i-button>
        <i-button
          type="primary"
          class="cds-btn-refresh"
          @click="handleRefresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <!-- 表格 -->
    <i-table
      class="cds-margin-top-14"
      stripe
      size="small"
      :columns="tableConfig.columns"
      :loading="tableConfig.loading"
      :data="tableConfig.data"
      @on-select="handleSelectSingle"
      @on-select-cancel="handleSelectSingleCancel"
      @on-select-all="handleSelectAll"
      @on-select-all-cancel="handleSelectAllCancel"
      @on-sort-change="sortChange">
    </i-table>
    <!-- 分页 -->
    <div class="cds-margin-top-14 cds-clearfix">
      <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
      <div class="cds-float-right">
        <i-page
          :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          show-sizer
          placement="top"
          :page-size-opts="[10,20,30,50]"
          @on-change="getTableData({currentPage: $event, pageSize: page.pageSize, emptySelect: false})"
          @on-page-size-change="getTableData({pageSize: $event, emptySelect: false})"></i-page>
      </div>
    </div>
    <!-- 新增、修改弹出框 -->
    <process-modal
      v-model="classification.processModal"
      :title="title"
      :id="sendPrcsClassificationModal.id"
      :should-disabled="cascaderDisabled"
      @on-ok="submitAddOrUpdate"></process-modal>
    <!-- 查看图片弹出框 -->
    <process-details-modal
      v-model="classification.processDetailsModal"
      :id="sendPrcsClassificationDetails.id"></process-details-modal>
    <!-- 单挑删除确认框 -->
    <h3c-modal-confirm
      v-model="classification.confirmModal"
      title="删除流程分类"
      :info="'确认删除该条流程分类吗？'"
      @on-ok="submitDelete"></h3c-modal-confirm>
    <!-- 批量删除 -->
    <h3c-modal-confirm
      v-model="classification.confirmModal"
      title="删除确认"
      :info="'确认删除这' + selectAll.length + '条流程分类吗？'"
      warning="该操作不可恢复"
      @on-ok="submitDelete"></h3c-modal-confirm>
  </div>
</template>

<script>
import ProcessModal from './PrcsClassificationModal/PrcsClassificationModal.vue'; // 引入新增、修改弹出框
import ProcessDetailsModal from './PrcsClassificationModal/PrcsClassificationDetails.vue'; // 引入查看图片弹出框
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import tableSelectAllMixin from '@/assets/js/table-select-all-mixins.js';

const optTypeArr = [
  {
    type: 'UNSUBSCRIBE',
    text: '退订'
  },
  {
    type: 'CHANGE',
    text: '变更'
  },
  {
    type: 'ADD',
    text: '申请'
  }
];
export default {
  mixins: [tableSelectAllMixin],
  components: {
    'process-modal': ProcessModal, // 注册新增、修改弹出框
    'process-details-modal': ProcessDetailsModal, // 查看图片弹出框
    'h3c-modal-confirm': H3cModalConfirm // 删除确认弹出框
  },
  data() {
    return {
      // 分页
      page: {
        pageSize: 20, // 每页条数
        totalCount: 0, // 总数
        totalPage: 1, // 总页数
        currentPage: 1 // 当前页码
      },
      // 表格配置信息
      tableConfig: {
        key: new Date().toString(), // 表格的属性key
        loading: false, // 表格是否加载中
        // 表格列的配置描述
        columns: [
          {
            type: 'selection', //多选功能
            width: 40,
            align: 'center'
          },
          {
            title: '流程分类名称',
            key: 'optName',
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.optName
                  }
                },
                params.row.optName
              );
            }
          },
          {
            title: '组织机构名称',
            key: 'projectName',
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.projectName
                  }
                },
                params.row.projectName
              );
            }
          },
          {
            title: '流程名称',
            key: 'processDefName',
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.processDefName
                  }
                },
                params.row.processDefName
              );
            }
          },
          {
            title: '操作类型',
            align: 'center',
            key: 'optType',
            render: (h, params) => {
              let optType = params.row.optType,
                node = optTypeArr.filter(item => {
                  return item.type == optType;
                })[0];
              return h(
                'span',
                {
                  attrs: {
                    title: node.text
                  }
                },
                node.text
              );
            }
          },
          {
            title: '创建时间',
            key: 'createDate',
            ellipsis: true,
            sortable: 'custom',
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.createDate
                  }
                },
                params.row.createDate
              );
            }
          },
          {
            title: '修改时间',
            key: 'modifiedDate',
            ellipsis: true,
            sortable: 'custom',
            render: (h, params) => {
              return h(
                'span',
                {
                  attrs: {
                    title: params.row.modifiedDate
                  }
                },
                params.row.modifiedDate
              );
            }
          },
          {
            title: '修改',
            key: 'update',
            align: 'center',
            maxWidth: 64,
            render: (h, params) => {
              let id = params.row.id,
                deletable = params.row.deletable;
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      if (deletable) {
                        // true  可选
                        this.cascaderDisabled = false;
                      } else {
                        // false 禁用
                        this.cascaderDisabled = true;
                      }
                      this.classification.processModal = true;
                      this.title = '编辑流程分类';
                      this.sendPrcsClassificationModal.id = id;
                      this.shouldAdd = false;
                    }
                  }
                },
                [
                  h('i', {
                    class: 'iconfont icon-weibiaoti2010104 tableIcon'
                  })
                ]
              );
            }
          },
          {
            title: '查看',
            key: 'detail',
            align: 'center',
            maxWidth: 64,
            render: (h, params) => {
              let id = params.row.processDefId;
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.$http({
                        url: `act-define/processImage/${id}`,
                        method: 'GET',
                        responseType: 'blob'
                      }).then(res => {
                        if (res.status) {
                          let url = window.URL.createObjectURL(res.data);
                          window.open(url);
                        }
                      });
                      // this.classification.processDetailsModal = true;
                      // this.sendPrcsClassificationDetails.id = id;
                    }
                  }
                },
                [
                  h('i', {
                    class: 'iconfont icon-icon-chakanxq tableIcon'
                  })
                ]
              );
            }
          },
          {
            title: '删除',
            key: 'detail',
            align: 'center',
            maxWidth: 64,
            render: (h, params) => {
              let id = params.row.id;
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      if (params.row.deletable) {
                        this.classification.confirmModal = true;
                        this.selectAll = [id];
                      } else {
                        this.$Notice.error({
                          desc: '该条数据不可删除'
                        });
                      }
                    }
                  }
                },
                [
                  h('i', {
                    class: 'iconfont icon-shanchu',
                    style: {
                      color: params.row.deletable ? '#3399ff' : '#bbbec4'
                    }
                  })
                ]
              );
            }
          }
        ],
        data: [] // 表格中的数据
      },
      // 设置弹出框的显示
      classification: {
        processModal: false, // 新增、修改弹出框
        processDetailsModal: false, // 查看图片弹出框
        confirmModal: false // 删除弹出框
      },
      sendPrcsClassificationModal: {
        id: ''
      },
      sendPrcsClassificationDetails: {
        id: ''
      },
      title: '', //modal title
      cascaderDisabled: false, // 是否禁用 cascader
      shouldAdd: true, // true:add;false:update
      orderMap: {}, // 表格排序参数
      selectTableConfig: {
        tableKey: 'id',
        dataKey: 'tableConfig.data',
        disabledKey: 'deletable'
      }
    };
  },
  methods: {
    /**
     * 发送请求获取表格数据，并且做相应处理
     * @param loading {boolean} 表格缓冲，默认值为false
     * @param currentPage {number} 分页当前页，默认值为第一页
     * @param pageSize {number} 分页每页条数，默认值为每页20条
     * @param emptySelect 是否清空选中项
     */
    getTableData({ loading = false, currentPage = 1, pageSize = 20, emptySelect = true } = {}) {
      if (loading) {
        // 设置表格缓冲
        this.tableConfig.loading = loading;
        // 将表格数据data设置为空数组
        this.tableConfig.data = [];
      }
      // 设置分页每页条数
      this.page.pageSize = pageSize;
      // 设置分页当前页
      this.page.currentPage = currentPage;
      // 发送请求并且做相应处理
      this.$http
        .post('/act-classification/list/page', {
          current: currentPage,
          pageSize: pageSize,
          orderMap: this.orderMap
        })
        .then(({ data }) => {
          // 请求状态status为true时的处理，为false不需要单独处理（因为在入口文件中已经做了全局处理）
          if (data.status) {
            let resp = data.data;
            // 设置数据不可选状态
            resp.records.forEach((element, index, arr) => {
              if (!element.deletable) {
                this.$set(arr[index], '_disabled', true);
              }
            });
            this.tableConfig.data = resp.records;
            // 分页保持选中
            if (emptySelect) {
              this.selectAll = [];
            } else {
              this.tableConfig.data.forEach((v, i) => {
                this.selectAll.forEach(k => {
                  if (v.id == k) {
                    this.tableConfig.data[i]._checked = true;
                  }
                });
              });
            }
            // 设置分页总条数
            this.page.totalCount = resp.total;
            // 设置分页总页数，当总页数为0时显示为1
            this.page.totalPage = resp.pages ? resp.pages : 1;
          }
          // 如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
          loading ? (this.tableConfig.loading = false) : '';
        });
    },
    // 点击新增按钮触发，添加进程
    handleCreate() {
      this.classification.processModal = true;
      this.sendPrcsClassificationModal.id = ''; // 将 modal id 置为空
      this.cascaderDisabled = false; // 取消禁用 cascader
      this.shouldAdd = true; // 进行新增
      this.title = '添加流程分类';
    },
    // 点击刷新按钮触发，刷新进程
    handleRefresh() {
      // 重设Table组件的key，促使Table组件重新渲染
      this.tableConfig.key = new Date().toString();
      this.getTableData({
        loading: true,
        pageSize: this.page.pageSize
      });
    },
    // 新增或修改
    submitAddOrUpdate(data) {
      if (this.shouldAdd) {
        // 进行新增操作
        this.$loading.show();
        this.$http.post('/act-classification/add', data).then(({ data }) => {
          if (data.status) {
            this.$Notice.success({ desc: data.message });
          }
          this.$loading.hide();
          this.getTableData({ loading: true, pageSize: this.page.pageSize });
        });
      } else {
        // 进行修改操作
        this.$loading.show();
        this.$http.put('/act-classification/update', data).then(({ data }) => {
          if (data.status) {
            this.$Notice.success({ desc: data.message });
          }
          this.$loading.hide();
          this.getTableData({ loading: true, pageSize: this.page.pageSize });
        });
      }
    },
    // 处理单项删除及批量删除
    submitDelete() {
      this.$loading.show();
      this.$http
        .delete('/act-classification/delete', {
          data: this.selectAll
        })
        .then(({ data }) => {
          if (data.status) {
            this.$Notice.success({ desc: data.message });
            this.getTableData({
              loading: true,
              pageSize: this.page.pageSize
            });
          }
          this.$loading.hide();
        });
    },
    // 批量删除
    handleDeleteMult() {
      let len = this.selectAll.length;
      // 如果选中的条数为0，提示请至少选择一条数据
      if (!len) {
        this.$Notice.warning({
          desc: '请至少选择一条数据'
        });
        return;
      }
      // 如果选中的条数不为0，则显示批量删除提示框
      this.classification.confirmModal = true;
    },
    /**
     * 当表格点击排序时触发
     * @param column {object} 当前列数据
     * @param key {string} 排序依据的指标，即当前列的key值
     * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
     */
    sortChange({ column, key, order }) {
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
      this.orderMap = { [key]: flag };
      this.getTableData({ pageSize: this.page.pageSize });
    }
  },
  // Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
  created() {
    this.getTableData({ loading: true });
    this.$emit('handleRefresh', this.handleRefresh);
  }
};
</script>
