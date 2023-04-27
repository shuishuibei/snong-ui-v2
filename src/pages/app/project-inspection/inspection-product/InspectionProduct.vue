<template>
    <div class="inspection-manage">
        <!-- 顶部 -->
        <div class="header-wrapper cds-padding-14 cds-clearfix">
          <!-- 搜索 -->
          <div class="cds-float-left-btn">
<!--            <span style="margin-left: 4px">巡检日期：</span>-->
<!--            <DatePicker-->
<!--              type="date"-->
<!--              placeholder="请选择巡检日期"-->
<!--              style="width: 150px"-->
<!--              v-model="inspectionDate"-->
<!--              format="yyyy-MM-dd"-->
<!--              @on-change="inspectionDateChange"-->
<!--            >-->
<!--            </DatePicker>-->
<!--            <i-button type="primary" class="cds-btn-search" @click="handleSearch">-->
<!--              <i class="iconfont icon-iconfontsousuo"></i>-->
<!--            </i-button>-->
            <i-button
              type="primary"
              @click="flag.import = true">
              <i class="iconfont icon-zu">数据上传</i>
            </i-button>
            <i-button
              type="primary"
              @click="handleExport">
              <i class="iconfont icon-xiazai">全部下载</i>
            </i-button>
          </div>
<!--          <div class="cds-float-right">-->
<!--            -->
<!--          </div>-->
        </div>
        <div class="content-wrapper">
            <div class="resourceTree-wrapper cds-padding-14">
                <div class="resource-search">
                    <i-input
                        v-model="inputName"
                        placeholder="请输入项目名称"
                        clearable
                        style="flex: 1; margin-right: 4px"
                    >
                    </i-input>
                    <i-button
                        type="primary"
                        class="cds-btn-search"
                        @click="searchResource"
                    >
                        <i class="iconfont icon-iconfontsousuo"></i>
                    </i-button>
                </div>
                <div class="search-tree">
                    <h3c-tree
                        empty-text
                        ref="resourceTree"
                        :data="resourceTreeArr"
                        :search-text="searchValue"
                        @on-select-change="resourceChange"
                    >
                    </h3c-tree>
                </div>
            </div>
            <div class="detail-wrapper">
                <div class="detail-bottom cds-padding-14">
                    <Tabs type="card" :animated="false" v-model="tabName">
                        <TabPane label="CAS" name="CAS">
                            <div v-if="tabName === 'CAS'">
                                <product-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                >
                                </product-table>
                            </div>
                        </TabPane>
                       <!-- <TabPane label="CloudOS" name="CloudOS">
                            <div v-if="tabName === 'CloudOS'">
                                <product-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                    @transferFlag="getTransferData"
                                >
                                </product-table>
                            </div>
                        </TabPane>-->
                        <TabPane label="ONEStor" name="ONEStor">
                            <div v-if="tabName === 'ONEStor'">
                                <product-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                >
                                </product-table>
                            </div>
                        </TabPane>
                      <TabPane label="UIS" name="UIS">
                        <div v-if="tabName === 'UIS'">
                          <product-table
                            :inspectionDate="formDate(this.inspectionDate)"
                            :projectName="projectName"
                            :productName="tabName"
                          >
                          </product-table>
                        </div>
                      </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
      <!-- 导入Excel数据 -->
      <InspectionImport v-model="flag.import"
                        title="导入巡检数据压缩包">
      </InspectionImport>
    </div>
</template>

<script>
import { buildTree } from '@/assets/js/utils';
import FTree from "@/components/h3c-tree/index";
import ProductTable from "./components/ProductTable.vue";
import InspectionImport from "./components/InspectionImport.vue";
export default {
    name: "InspectionProduct",
    components: {
        "h3c-tree": FTree,
        "product-table": ProductTable,
      InspectionImport
    },
    data() {
        return {
            inspectionDate: new Date().toISOString().slice(0, 10),
            resourceTreeArr: [], // 资源列表
            searchValue: "", // 资源列表实际搜索值
            inputName: "", // 资源列表所填搜索值
            projectName: "", // 资源列表当前选中项
            tabName: "CAS",
            searchMap: {
              ip: "",              // ip地址
              isLatest: 1,         // 最新数据标志
              project: ""     // 项目名称
            },
            page: {
              current: 1,
              total: 0,
              pages: 1,
              pageSize: 10,
            },
            flag: {
              import: false // 巡检数据上传
            }
        };
    },
    computed: {
        placeholder() {
          let label = this.selectList.filter((item) => {
              return item.value === this.selectValue;
          })[0].label;
          return `请输入${label}进行查询`;
        },
    },
    methods: {
        // 更改日期的格式
        formDate(data, formatType) {
            let type = Object.prototype.toString.call(data)
            if(type == "[object Date]") {
                var format = formatType ? formatType : 'yyyy-MM-DD'
                let time = {
                    "M+": data.getMonth() + 1,
                    "D+": data.getDate(),
                    "H+": data.getHours(),
                    "m+": data.getMinutes(),
                    "s+": data.getSeconds(),
                };
                if (/(y+)/i.test(format)) {
                    format = format.replace(
                    RegExp.$1,
                    (data.getFullYear() + "").substr(4 - RegExp.$1.length)
                    );
                }
                for (let k in time) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(
                            RegExp.$1,
                            RegExp.$1.length === 1
                            ? time[k]
                            : ("00" + time[k]).substr(("" + time[k]).length)
                        );
                    }
                }
                return format;
            } else {
                return data
            }
        },
        // 修改日期
        inspectionDateChange(reportTime) {
            this.inspectionDate = reportTime;
        },
        // 日期查询
        handleSearch() {
        },
      // 获取列表数据
      getResourceList() {
        this.$http.get("/project-management/task/list").then(({ data }) => {
          if (data.status) {
            this.handleResource(data.data)
          }
        });
      },
      // 处理列表数据
      handleResource(resp) {
        this.resourceTreeArr = buildTree(resp,'projectName',item => {
          /**
           * @property {string} id      - id
           * @property {string} title   - 显示的资源名称
           * @property {string} value   - 级联选择时的唯一标识，因为id是唯一的，所以取id的值
           */
          return {
            id: item.id,
            parentId: item.parentId,
            title: item.projectName,
            value: item.id,
            label: item.projectName
          };
        });
        /* 默认一级菜单展开 */
        this.resourceTreeArr.forEach(arr => {
          if (arr.children && arr.children.length) {
            this.$set(arr, 'expand', true);
          }
        })
        // 默认选择第一个有子节点的子节点
        let node = this.resourceTreeArr.find(arr => arr.children && arr.children.length).children[0];
        this.$set(node, 'selected', true);
        this.projectName = node ? node.title : this.inputName.trim()
      },
      // 列表选中项改变时触发
      resourceChange(list) {
        this.projectName = list[0].title
        this.inputValue = ''
      },
      // 查询列表数据
      searchResource() {
        this.searchValue = this.inputName.trim()
        if(this.searchValue !== '' && this.searchValue !== null && this.searchValue !== undefined) {
          this.$http.get(`project-management/task/list?projectName=${this.searchValue}`).then(({ data }) => {
            if(data.status) {
              this.handleResource(data.data)
            }
          })
        } else {
          this.getResourceList()
        }
      },
      // 全部导出
      handleExport() {
        this.$loading.show();
        this.inspectionDate = this.formDate(this.inspectionDate)
        this.$http.get(
          `/inspection/download?dateTime=${this.inspectionDate}`,
          { responseType: 'blob' })
          .then((res)=>{
            let a = document.createElement('a'),
              url = window.URL.createObjectURL(res.data);
            a.href = url;
            a.download = this.inspectionDate + "_" + '云平台信息统计.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
            this.$loading.hide();
          }).catch(() => {
            this.$loading.hide();
            this.$Notice.error({
              desc: '内部错误，下载文件无法打开！'
            });
          });
      },
    },
    // Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
    created() {
      // 获取项目信息
      this.getResourceList();

    }
};
/* eslint-enable */
</script>

<style scoped lang="less">
/deep/ .ivu-tree-arrow {
    //width: 12px;
    //display: inline-block;
    padding-top: 10px;
}
/deep/ .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
    width: 100%;
    border-left: 2px solid #39f;
}
/deep/ .ivu-tree-title {
    padding: 10px 10px 10px 5px;
    border-radius: 0;
    width: 100%;
}
/deep/ .ivu-tree ul {
    font-size: 13px;
}
/deep/ .ivu-tree ul li {
    margin: 0;
}
.inspection-manage {
    width: 100%;
    min-height: 100%;
    position: relative;
    .header-wrapper {
        width: 100%;
        background-color: #fff;
        border: 1px solid #d8e0eb;
        .search-wrapper,
        .btn-wrapper {
            display: inline-block;
        }
    }
    .content-wrapper {
        position: absolute;
        width: 100%;
        //min-width: 1176px;
        top: 70px;
        bottom: 0;
        .resourceTree-wrapper {
            position: absolute;
            width: 220px;
            height: 100%;
            background-color: #fff;
            border: 1px solid #d8e0eb;
            overflow: auto;
            .resource-search {
                display: flex;
                margin-bottom: 8px;
            }
            .search-tree {
                overflow: auto;
                height: calc(100% - 40px);
            }
        }
        .detail-wrapper {
            position: absolute;
            height: 100%;
            left: 228px;
            right: 0;
            color: #383f51;
            .detail-bottom {
                background-color: #fff;
                border: 1px solid #d8e0eb;
                overflow: auto;
            }
        }
    }
}
.inspection-box {
    margin-right: 14px;
}
</style>
