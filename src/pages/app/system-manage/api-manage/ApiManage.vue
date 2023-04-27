<!--
 * @Description: API管理
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:09
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-05 11:52:17
 -->
<template>
  <div class="cds-wrapper api-manage">
    <div class="cds-border cds-padding-14 api-manage-left">
      <h3c-tree
        ref="resourceTree"
        :data="resourceTreeArr"
        @on-select-change="resourceChange">
      </h3c-tree>
    </div>
    <div class="api-manage-right">
      <div class="cds-border api-manage-right-title">
        <h3c-title
          :is-border-bottom="false"
          :title="'资源名称：' + resourceName">
        </h3c-title>
      </div>
      <div class="cds-border cds-padding-14 api-manage-right-content">
        <div class="cds-clearfix cds-margin-bottom-14">
          <div class="cds-float-left-btn">
            <i-input
              class="cds-input-search"
              clearable
              v-model="inputValue"
              placeholder="请输入API名称进行查询"
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
          size="small"
          highlight-row
          :key="tableConfig.key"
          :loading="tableConfig.loading"
          :columns="tableConfig.columns"
          :data="tableConfig.data"
          @on-select="selectConfirm"
          @on-select-cancel="selectCancel"
          @on-select-all="selectAll"
          @on-select-all-cancel="selectAllCancel">
        </i-table>
        <div class="cds-margin-top-14 cds-clearfix page-wrapper">
          <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
          <div class="cds-float-right">
            <i-page
              show-sizer
              size="small"
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
      </div>
    </div>
    <i-spin
      fix
      size="large"
      v-if="isSpinApiManageShow">
    </i-spin>
    <api-edit
      title="新增API"
      :resource-list="resourceTreeArr"
      :default-path="defaultPath"
      v-model="flag.add"
      @on-ok="handleRefresh">
    </api-edit>
    <api-edit
      title="修改API"
      :resource-list="resourceTreeArr"
      :default-path="defaultPath"
      :api-info="apiInfo"
      v-model="flag.modify"
      @on-ok="resetTable">
    </api-edit>
    <h3c-modal-confirm
      :info="`确认删除API：${currentRow.url}？`"
      v-model="flag.deleteSingle"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
    <h3c-modal-confirm
      :info="`确认删除这${selectedIdsList.length}个API？`"
      v-model="flag.deleteMult"
      @on-ok="submitDelete">
    </h3c-modal-confirm>
  </div>
</template>

<script>
import { buildTree } from '@/assets/js/utils';
import { treePathFormat } from '@/assets/js/format';
import FTree from '@/components/h3c-tree/index'; // 引入树形控件
import ApiEdit from './components/ApiEdit.vue';
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
export default {
  name: 'ApiManage',
  components: {
    'h3c-tree': FTree,
    'api-edit': ApiEdit,
    'h3c-title': H3cTitle,
    'h3c-modal-confirm': H3cModalConfirm
  },
  data() {
    return {
      resourceId: '', // 当前资源ID
      resourceName: '', // 当前资源名称
      resourceTreeArr: [], // 资源数据
      defaultPath: [], // 当前资源的路径
      apiInfo: {}, // api信息
      inputValue: '', // 搜索框中显示的值
      searchValue: '', // 实际点击查询按钮发送的值
      currentRow: {}, // 表格当前行
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
            title: 'API名称',
            key: 'url'
          },
          {
            title: '状态',
            key: 'active',
            width: 64,
            align: 'center',
            render: (h, params) => {
              let color = params.row.active ? '#5ddb50' : 'red';
              return h(
                'div',
                {
                  class: 'cds-status-halo-shadow',
                  style: {
                    color: color
                  }
                },
                [
                  h('div', {
                    class: 'cds-status-halo-dot',
                    style: {
                      backgroundColor: color
                    }
                  })
                ]
              );
            }
          },
          {
            title: '责任人',
            key: 'owner',
            width: 90
          },
          {
            title: '描述',
            key: 'description'
          },
          {
            title: '创建时间',
            key: 'createDate'
          },
          {
            title: '修改时间',
            key: 'modifiedDate'
          },
          {
            title: '修改',
            width: 64,
            align: 'center',
            render: (h, params) => {
              return h('i', {
                class: 'iconfont icon-weibiaoti2010104',
                on: {
                  click: () => {
                    this.apiInfo = params.row;
                    this.flag.modify = true;
                  }
                }
              });
            }
          },
          {
            title: '删除',
            width: 64,
            align: 'center',
            render: (h, params) => {
              return h('i', {
                class: 'iconfont icon-shanchu',
                on: {
                  click: () => {
                    this.$nextTick(() => {
                      this.currentRow = params.row;
                      this.flag.deleteSingle = true;
                    });
                  }
                }
              });
            }
          }
        ],
        data: []
      },
      page: {
        pageSize: 20,
        totalCount: 0,
        totalPage: 1,
        currentPage: 1
      },
      selectedIdsList: [], // 选中项
      isSpinApiManageShow: false, // Api管理遮罩
      flag: {
        add: false,
        modify: false,
        deleteSingle: false,
        deleteMult: false
      }
    };
  },
  methods: {
    getResourceList() {
      this.isSpinApiManageShow = true;
      this.$http.get('resource/list').then(({ data }) => {
        this.isSpinApiManageShow = false;
        if (data.status) {
          if (data.data && data.data.length) {
            this.resourceTreeArr = buildTree(data.data, 'orderNo', item => {
              /**
               * @property {string} id      - id
               * @property {string} title   - 显示的资源名称
               * @property {string} value   - 级联选择时的唯一标识，因为id是唯一的，所以取id的值
               * @property {string} label   - 级联选择时显示的资源名称
               * @property {string} orderNo - 菜单排序
               */
              return {
                id: item.id,
                title: item.title,
                value: item.id,
                label: item.title,
                orderNo: item.orderNo
              };
            });
            /* 默认一级菜单展开 */
            if (
              this.resourceTreeArr[0].children &&
              this.resourceTreeArr[0].children.length
            ) {
              this.$set(this.resourceTreeArr[0], 'expand', true);
            }
            this.$set(this.resourceTreeArr[0], 'selected', true);
            /* 设置resourceName和resourceId */
            this.resourceName = this.resourceTreeArr[0].title;
            this.resourceId = this.resourceTreeArr[0].id;
            /* 获取当前资源对应的API */
            this.getTableData({ clearable: true });
            this.defaultPath = [this.resourceTreeArr[0].value];
          } else {
            this.$Notice.warning({
              desc: '资源列表为空'
            });
          }
        }
      });
    },
    /**
     * 发送请求获取表格数据，并且做相应处理
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
        .post(`api/list/pages/${this.resourceId}`, {
          current: currentPage,
          orderMap: this.orderMap,
          pageSize: pageSize,
          searchMap: {
            url: this.searchValue
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
     * @function 设置当前资源的资源路径，及Name和Id。同时获取当前资源的API列表。
     * @description 改变资源时触发
     * @param {Array} node - 当前选中资源数据
     */
    resourceChange(node) {
      if (node && node.length) {
        this.resourceName = node[0].title;
        this.resourceId = node[0].id;
        this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        this.defaultPath = treePathFormat(
          this.resourceTreeArr,
          node[0].id
        ).path;
      }
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
    /**
     * @function 点击查询按钮触发
     */
    handleSearch() {
      this.searchValue = this.inputValue.trim();
      this.getTableData({
        clearable: true,
        pageSize: this.page.pageSize
      });
    },
    /**
     * @function 点击刷新按钮触发
     */
    handleRefresh() {
      this._setInputEmpty();
      this.tableConfig.key = new Date().toString();
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
    submitDelete() {
      this.$loading.show();
      this.$http({
        method: 'DELETE',
        url: 'api/delete/batch',
        data: this.currentRow.id ? [this.currentRow.id] : this.selectedIdsList
      }).then(({ data }) => {
        this.$loading.hide();
        if (data.status) {
          this.$Notice.success({
            desc: '删除API成功'
          });
          this.getTableData({ clearable: true, pageSize: this.page.pageSize });
        }
      });
    },
    _setInputEmpty() {
      this.inputValue = '';
      this.searchValue = '';
    },
    /**
     * @function 编辑后，保留表格搜索项，但清除表格数据和选中项
     */
    resetTable() {
      this.getTableData({ clearable: true, pageSize: this.page.pageSize });
    }
  },
  created() {
    this.getResourceList();
  }
};
</script>

<style lang="less" scoped>
.api-manage {
  width: 100%;
  height: 100%;
  position: relative;
  .api-manage-left,
  .api-manage-right {
    height: 100%;
  }
  .api-manage-left {
    width: 280px;
    overflow: auto;
  }
  .api-manage-right {
    position: absolute;
    top: 0;
    left: 292px;
    right: 0;
    overflow: hidden;
    .api-manage-right-title,
    .api-manage-right-content {
      width: 100%;
    }
    .api-manage-right-title {
      padding-left: 14px;
    }
    .api-manage-right-content {
      position: absolute;
      top: 55px;
      bottom: 0;
      overflow: auto;
      .page-wrapper {
        position: relative;
      }
    }
  }
}
</style>
