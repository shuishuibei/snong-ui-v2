<template>
    <div class="inspection-manage">
        <!-- 顶部 -->
        <div class="header-wrapper cds-padding-14 cds-clearfix">
            <!-- 搜索 -->
            <div class="cds-float-left-btn">
                <span style="margin-left: 4px">报告日期：</span>
                <DatePicker
                    type="date"
                    placeholder="请选择报告日期"
                    style="width: 150px"
                    v-model="inspectionDate"
                    :readonly = true
                    format="yyyy-MM-dd"
                    @on-change="inspectionDateChange"
                >
                </DatePicker>
               <!-- <i-button type="primary" class="cds-btn-search" @click="handleSearch">
                    <i class="iconfont icon-iconfontsousuo"></i>
                </i-button>-->

            </div>
          <div class="cds-float-right cds-btn-reset-spacing">
            <i-button
              type="primary"
              @click="waterLine = true">
              <i class="iconfont icon-daochu">水位线管理</i>
            </i-button>
          </div>
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
                        <TabPane label="CAS计算资源" name="cas-compute">
                            <div v-if="tabName === 'cas-compute'">
                                <capacity-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                    @transferFlag="getTransferData"
                                >
                                </capacity-table>
                            </div>
                        </TabPane>
                        <TabPane label="CVK计算资源" name="cvk-compute">
                            <div v-if="tabName === 'cvk-compute'">
                                <capacity-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                    @transferFlag="getTransferData"
                                >
                                </capacity-table>
                            </div>
                        </TabPane>
                        <TabPane label="CAS共享存储" name="cas-storage">
                            <div v-if="tabName === 'cas-storage'">
                                <capacity-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                    @transferFlag="getTransferData"
                                >
                                </capacity-table>
                            </div>
                        </TabPane>
                      <TabPane label="独立存储" name="alone-storage">
                        <div v-if="tabName === 'alone-storage'">
                          <capacity-table
                            :inspectionDate="formDate(this.inspectionDate)"
                            :projectName="projectName"
                            :productName="tabName"
                            :url="url"
                            @transferFlag="getTransferData"
                          >
                          </capacity-table>
                        </div>
                      </TabPane>
                      <TabPane label="UIS主机资源" name="uis-compute">
                        <div v-if="tabName === 'uis-compute'">
                          <capacity-table
                            :inspectionDate="formDate(this.inspectionDate)"
                            :projectName="projectName"
                            :productName="tabName"
                            @transferFlag="getTransferData"
                          >
                          </capacity-table>
                        </div>
                      </TabPane>
                      <TabPane label="UIS集群资源" name="uis-cluster">
                        <div v-if="tabName === 'uis-cluster'">
                          <capacity-table
                            :inspectionDate="formDate(this.inspectionDate)"
                            :projectName="projectName"
                            :productName="tabName"
                            @transferFlag="getTransferData"
                          >
                          </capacity-table>
                        </div>
                      </TabPane>
                      <TabPane label="UIS共享存储" name="uis-storage">
                        <div v-if="tabName === 'uis-storage'">
                          <capacity-table
                            :inspectionDate="formDate(this.inspectionDate)"
                            :projectName="projectName"
                            :productName="tabName"
                            @transferFlag="getTransferData"
                          >
                          </capacity-table>
                        </div>
                      </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
      <water-line v-model="waterLine" :projectName="projectName" ></water-line>
    </div>
</template>

<script>
import FTree from "@/components/h3c-tree/index";
import CapacityTable from "./components/CapacityTable.vue";
import WaterLine from "./components/CapacityWaterLine.vue";
export default {
    name: "CapacityManage",
    components: {
        "h3c-tree": FTree,
        "capacity-table": CapacityTable,
        "water-line":WaterLine
    },
    data() {
        return {
            inspectionDate: new Date().toISOString().slice(0, 10),
            resourceTreeArr: [], // 资源列表
            searchValue: "", // 资源列表实际搜索值
            inputName: "", // 资源列表所填搜索值
            url: "/capacity/cas-compute/page/list", //初始调用的url
            projectName: "", // 资源列表当前选中项
            tabName: "cas-compute",
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
            waterLine: false
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
      // 处理列表数据
      handleResource(resp) {
        this.resourceTreeArr = []
        resp.forEach((item, index) => {
          this.resourceTreeArr.push({
            id: item.id,
            title: item.projectName, // 显示的列表名称
            selected: index === 0, // 默认选择第一个列表
          });
        });
        this.projectName = this.resourceTreeArr[0] ? this.resourceTreeArr[0].title : this.inputName.trim()
      },
      // 获取列表数据
      getResourceList() {
        this.$http.get("/project-management/task/list").then(({ data }) => {
          if (data.status) {
            this.handleResource(data.data)
          }
        });
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
        getTransferData() {
        }
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
    width: 0;
    display: block;
}
/deep/ .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
    width: 100%;
    border-left: 2px solid #39f;
}
/deep/ .ivu-tree-title {
    padding: 10px 10px 10px 20px;
    border-radius: 0;
    width: 100%;
}
/deep/ .ivu-tree ul {
    font-size: 14px;
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
            width: 200px;
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
            left: 208px;
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
