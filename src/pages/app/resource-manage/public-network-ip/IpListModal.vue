<template>
  <div>
    <i-modal
      v-model="visible"
      :scrollable="true"
      :mask-closable="false"
      @on-cancel="closeModal()">
      <p slot="header">
        <span class="vertical-line"></span>
        <span class="pop-title">用户列表</span>
      </p>
      <div style="text-align:left">
        <i-input
          v-model="queryName"
          clearable
          style="width: 50%"
          @on-select="handleSelect"
          @on-search="changeName"
          placeholder="请输入查询条件进行查询">
        </i-input>
        <i-button
          class="search-btn"
          @click="getNets">
          <i class="iconfont icon-chaxun">查询</i>
        </i-button>
        <div style="margin-top: 20px;">
          <i-table
            stripe
            height="200"
            :columns="netItem"
            :data="data1">
          </i-table>
          <i-row class="page-contain">
            <div class="page-left">
              共有{{publicNetTablePage.getDataNum()}}条记录，当前页{{publicNetTablePage.getCurrentPage()}}/{{publicNetTablePage.getPageNum()}}页
            </div>
            <div class="page-right">
              <i-page
                show-sizer
                @on-change="changeVirtualPage"
                @on-page-size-change="changeVirtualPageSize"
                :current="1"
                placement="top"
                size="small"
                :total="publicNetTablePage.getDataNum()"
                :page-size="publicNetTablePage.getPageSize()"
                :page-size-opts="publicNetTablePage.getPageSizeOpts()">
              </i-page>
            </div>
          </i-row>
        </div>
      </div>
      <div slot="footer">
        <i-button
          type="primary"
          class="save"
          @click="save()">
          保存
        </i-button>
        <i-button
          class="cancel"
          @click="closeModal()">
          取消
        </i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
  import {TablePage} from '@/assets/js/TablePage.js';
  import mixinsUtil from '@/pages/app/resource-manage/mixins-util.js';

  export default {
    name: "IpListModal",
    mixins: [mixinsUtil],
    data() {
      return {
        userNameArr: [],  // 查询时出现下拉信息存储数据
        visible: false,
        publicNetTablePage: new TablePage(),
        auditorSelection: '',
        netItem: [
          {
            title: ' ',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h(
                "RadioGroup",
                {
                  style: {
                    color: "transparent"
                  },
                  /*props: {
                      value: this.auditorSelection
                  },*/
                  on: {
                    "on-change": () => {
                      // this.$set(this.auditorSelection, 0, params.index);
                      this.auditorSelection = params.row.cidr;
                    }
                  }
                }, [h("Radio", {
                  props: {
                    label: params.index
                  }
                }, params.index)]
              );
            }
          },
          {
            title: '名称',
            key: 'name',
            render: (h, params) => {
              let name = params.row.name;
              return h('div', {
                'class': {tableInfo: true},
                attrs: {title: name},
              }, name)
            }
          }, {
            title: '子网地址',
            key: 'cidr',
            render: (h, params) => {
              let cidr = params.row.cidr;
              return h('div', {
                'class': {tableInfo: true},
                attrs: {title: cidr},
              }, cidr)
            }
          }],
        data1: []
      }
    },
    methods: {
      showModal: function () {
        this.visible = true;
        this.queryName = '';
        this.initPage();
      },

      // 初始化表格
      initPage: function () {
        // 获取表格数据
        this.getNets();
        return 1;
      },

      getNets: function () {
        var _this = this;
        this.publicNetTablePage.setLoading(true);
        // 模糊查询待定
        this.$http.post(`/network/list/page/IpPools`, {
          "pageModel": {
            "current": this.publicNetTablePage.getCurrentPage(),
            "pageSize": this.publicNetTablePage.getPageSize(),
            "searchMap": {
              "name": this.queryName
            }
          },
        }).then(({data}) => {
          _this.publicNetTablePage.setLoading(false);
          if (data.status) {
            let d = data.data.records;
            _this.data1 = d;
            _this.setTablePageData(this.publicNetTablePage, d);
          }
        }).catch(function (error) {
          _this.publicNetTablePage.setLoading(false);
        });
      },

      changeVirtualPage: function (page) {
        this.publicNetTablePage.setCurrentPage(page);
        this.getNets();
      },

      changeVirtualPageSize: function (size) {
        this.publicNetTablePage.setPageSize(size);
        this.getNets();
      },

      handleSelect: function (value) {
        this.queryName = value;
        value !== '' && this.getNets();
      },
      changeName: function (value) {
        value === '' && this.initPage();
        this.queryName = value;
      },
      save: function () {
        this.$emit('changeCidr', this.auditorSelection);
        this.visible = false;
      },
      closeModal: function () {
        this.visible = false;
      }
    }
  }
</script>
