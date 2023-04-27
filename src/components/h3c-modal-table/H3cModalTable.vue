<!--
 * @Description: 有表格的弹出框
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-11-04 09:27:37
 -->
<template>
  <div>
    <i-modal
      scrollable
      v-model="visible"
      :title="title"
      :mask-closable="false"
      @on-cancel="closeModal()"
      :width="width">
      <div class="info-content" v-if="tipsFlag">
        <i class="iconfont icon-tixingtishi"></i>
        <div class="content-div">{{tips}}</div>
      </div>
      <div :style="{textAlign:'left',marginTop: (queryFlag || selectFlag)?'15px':'0'}">
        <i-row class="cds-margin-bottom-14">
          <i-col span="9" v-if="selectFlag">
            {{selectText}}
            <i-select v-model="privateIp" style="width:200px;" @on-change="choosePrivateIp">
              <i-option v-for="item in privateIpArr" :value="item.ipAddress" :key="item.id">{{item.ipAddress}}</i-option>
            </i-select>
          </i-col>
          <i-col span="15" v-if="queryFlag">
            <i-input v-model="queryName" :placeholder="placeholder" style="width:50%" clearable></i-input>
            <i-button type="primary" class="cds-btn-search" @click="getTableData">
              <i class="iconfont icon-iconfontsousuo"></i>
            </i-button>
          </i-col>
        </i-row>

        <div>
          <i-table stripe
            size="small"
            height="232"
            no-data-text="暂无数据"
            :columns="tableItem"
            :data="tableData.length === 0?pageParams.showData:tableData"
            :loading="tableData.length === 0?pageParams.loading:false">
          </i-table>
          <i-row class="cds-clearfix cds-margin-top-14" v-if="tableData.length === 0">
            <div class="cds-float-left">
              共有{{pageParams.total}}条记录，当前页{{pageParams.current}}/{{pageParams.getPageNum()}}页
            </div>
            <div class="cds-float-right">
              <i-page show-sizer
                size="small"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
                :current="1"
                placement="top"
                :total="pageParams.total"
                :page-size="pageParams.size"
                :page-size-opts="pageParams.pageSizeOpts">
              </i-page>
            </div>
          </i-row>
        </div>
      </div>
      <div slot="footer"></div>
    </i-modal>
  </div>
</template>

<script>
import { PageParams } from '@/assets/js/page-params.js';

export default {
  name: 'H3cModalTable',
  props: {
    /* 组件标题 */
    title: {
      type: String,
      default: ''
    },
    /* 查询输入框默认提示 */
    placeholder: {
      type: String,
      default: '请输入登录名称进行查询'
    },
    /* 组件宽度 */
    width: {
      type: Number,
      default: 600
    },
    /*ajax请求参数对象*/
    paramMap: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /*ajax请求类型*/
    type: {
      type: String,
      default: 'post'
    },
    /* 是否展示提示信息 */
    tipsFlag: {
      type: Boolean,
      default: false
    },
    /* 提示信息 */
    tips: {
      type: String,
      default: ''
    },
    /*是否支持下拉框*/
    selectFlag: {
      type: Boolean,
      default: false
    },
    /*是否支持模糊查询*/
    queryFlag: {
      type: Boolean,
      default: false
    },
    /*模糊查询字段*/
    queryKey: {
      type: String,
      default: ''
    },
    /* 表格查询url */
    url: {
      type: String,
      default: ''
    },
    /*表格数据,可以传入静态数据*/
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /*下拉框左侧提示信息*/
    selectText: {
      type: String,
      default: ''
    },
    /*下拉框url*/
    selectUrl: {
      type: String,
      default: ''
    },
    /* 表格Item */
    tableItem: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      visible: false,
      key: '', // 表格table的key值，用来刷新表格样式
      queryName: '', // 模糊查询输入框内容
      pageParams: new PageParams({ size: 5, pageSizeOpts: [5, 10, 20] }),
      privateIp: '', // 被选中的私网IP地址(与业务强相关)
      privateIpArr: [] // 私网IP地址数组
    };
  },
  computed: {
    param() {
      let pageModelParam = {
        searchMap: {},
        current: this.pageParams.current,
        pageSize: this.pageParams.size
      };
      pageModelParam.searchMap[this.queryKey] = this.queryName;
      let param = Object.keys(this.paramMap).length
        ? { pageModel: pageModelParam, paramMap: this.paramMap }
        : pageModelParam;
      return param;
    }
  },
  methods: {
    showModal() {
      this.key = new Date() + Math.random();
      this.visible = true;
      this.queryName = '';
      this.pageParams = new PageParams({ size: 5, pageSizeOpts: [5, 10, 20] });
      this.$nextTick(() => {
        this.initPage();
      });
    },
    closeModal() {
      this.visible = false;
    },
    initPage() {
      this.getTableData();
      /*有下拉框*/
      if (this.selectFlag) {
        this.getSelectData();
      }
    },
    /*获取下拉框数据*/
    getSelectData() {
      this.$http.get(this.selectUrl).then(({ data }) => {
        if (data.status) {
          this.privateIpArr = data.data;
          if (data.data.length !== 0) {
            this.privateIp = data.data[0].ipAddress;
            this.$emit('selectedData', data.data[0]);
          }
        }
      });
    },
    /*下拉框选择改变后触发事件*/
    choosePrivateIp(value) {
      let arr = this.privateIpArr,
        length = arr.length;
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          let item = arr[i],
            ipAddress = item.ipAddress;
          if (value === ipAddress) {
            this.$emit('selectedData', item);
          }
        }
      }
    },
    /**
     * @description: 查询表格数据方法
     * @return: null
     */
    getTableData() {
      this.pageParams.loading = true;
      this.pageParams.showData = [];
      this.$http[this.type](this.url, this.param).then(({ data }) => {
        /*添加这段代码是因为后台列表数据里有null,数据不规范*/
        let list = [],
          array = [];
        /*后台返回数据有些是records有些直接从data中取*/
        if (data.data !== null && data.data.records) {
          list = data.data.records;
        } else if (data.data !== null) {
          list = data.data;
        }
        list.forEach(function(val) {
          if (val !== null) {
            array.push(val);
          }
        });
        this.pageParams.loading = false;
        this.pageParams.showData = array;
        data.data && data.data.total ? (this.pageParams.total = data.data.total) : 0;
        data.data && data.data.size ? (this.pageParams.size = data.data.size) : 5;
        data.data && data.data.current ? (this.pageParams.current = data.data.current) : 1;
      });
    },
    changePage(page) {
      this.pageParams.current = page;
      this.getTableData();
    },
    changePageSize(size) {
      this.pageParams.size = size;
      this.getTableData();
    }
  }
};
</script>
<style lang="less" scoped>
.info-content {
  color: #ff6600;
  padding: 15px 10px 10px 10px;
  background-color: #fff0e1;
  position: relative;
  display: flex;
}

.icon-tixingtishi {
  transform: translate(0, -3px);
  color: #ff8605;
  font-size: 18px;
  /* position: absolute;
  top: 45%;
  transform: translate(0, -50%); */
  &:before {
    font-size: inherit !important;
  }
}
.content-div {
  line-height: 22px;
}

.tableInfo {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}
</style>
