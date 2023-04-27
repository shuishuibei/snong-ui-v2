<!--
 * @Description: 
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-12 11:34:26
 -->
<!--cfw2157-->
<template>
  <div>
    <div style="text-align:left;margin-top: 20px;">
      <i-input
        v-model="queryRes"
        @on-select="handleSelect"
        @on-search="changeRes"
        clearable
        style="width: 55%"
        placeholder="请输入查询条件进行查询">
      </i-input>
      <i-button class="search-btn" @click="searchByName()">
        <i class="iconfont icon-chaxun">查询</i>
      </i-button>
    </div>

    <i-table stripe
             height="200"
             style="margin-top: 20px"
             :columns="titleItem"
             :data="tableData"
             class="table-virtual-machine">
    </i-table>
    <i-row class="page-contain">
      <div class="page-left">
        共有{{tablePage.getDataNum()}}条记录，当前页{{tablePage.getCurrentPage()}}/{{tablePage.getPageNum()}}页
      </div>
      <div class="page-right">
        <i-page show-sizer
                :current="1"
                placement="top"
                size="small"
                @on-change="changeResPage"
                @on-page-size-change="changeResPageSize"
                :total="tablePage.getDataNum()"
                :page-size="tablePage.getPageSize()"
                :page-size-opts="tablePage.getPageSizeOpts()">
        </i-page>
      </div>
    </i-row>
  </div>
</template>

<script>
  import {TablePage} from '@/assets/js/TablePage.js';

  export default {
    name: 'FormTable',
    data() {
      return {
        tablePage: new TablePage(),
        visible: false,
        queryRes: ''
      }
    },
    props: {
      choosedId: {
        type: String,
        default: function () {
          return '';
        }
      },
      titleItem: {
        type: Array,
        default: function () {
          return [];
        }
      },
      tableData: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    methods: {
      init() {
        this.searchByName();
        return 1;
      },
      searchByName() {
        this.tablePage.setLoading(true);
        // 模糊查询待定
        this.$http.post(`/server/list/floatIp/page/${this.choosedId}`, {
          "current": this.tablePage.getCurrentPage(),
          "pageSize": this.tablePage.getPageSize(),
          "searchMap": {
            "name": this.queryRes
          }
        }).then(({data}) => {
          this.tablePage.setLoading(false);
          if (data.status) {
            let d = data.data;
            this.setTablePageData(this.tablePage, d);
          }
        }).catch(function (error) {
          this.tablePage.setLoading(false);
        });
      },
      handleSelect(value) {
        this.queryRes = value;
        value !== '' && this.searchByName();
      },
      changeRes(value) {
        if (value === '') {
          this.init();
        }
        this.queryRes = value;
      },
      changeResPage(page) {
        this.tablePage.setCurrentPage(page);
        this.searchByName();
      },
      changeResPageSize(size) {
        this.tablePage.setPageSize(size);
        this.searchByName();
      }
    }
  }
</script>
