<template>
    <div class="inspection-manage">
        <!-- 顶部 -->
        <div class="header-wrapper cds-padding-14 cds-clearfix">
            <!-- 搜索 -->
            <div class="cds-float-left-btn">
                <span style="margin-left: 4px">巡检日期：</span>
                <DatePicker
                    type="date"
                    placeholder="请选择巡检日期"
                    style="width: 150px"
                    v-model="inspectionDate"
                    format="yyyy-MM-dd"
                    @on-change="inspectionDateChange"
                >
                </DatePicker>
                <i-button type="primary" class="cds-btn-search" @click="handleSearch">
                    <i class="iconfont icon-iconfontsousuo"></i>
                </i-button>
            </div>
            <div class="cds-float-right">
              <i-button
                type="primary"
                @click="handleExport">
                <i class="iconfont icon-xiazai">全部下载</i>
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
                <div class="detail-top" >
                  <div v-for="node in nodeList" :key="node.id" @click = "queryDetail(node.id)" >
                    <pass-error :list="node" :isPass="node.isPass" :class="node.className"></pass-error>
                  </div>
                  <div class="split"></div>
                  <div v-for="item in list" :key="item.id">
                      <pass-error :list="item" :isPass="item.isPass" :class="item.className"></pass-error>
                  </div>
                </div>
                <div class="detail-bottom cds-padding-14">
                    <Tabs type="card" :animated="false" v-model="tabName">
                        <TabPane label="CAS" name="CAS">
                            <div v-if="tabName === 'CAS'">
                                <inspection-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                    @transferFlag="getTransferData"
                                >
                                </inspection-table>
                            </div>
                        </TabPane>
                        <TabPane label="CloudOS" name="CloudOS">
                            <div v-if="tabName === 'CloudOS'">
                                <inspection-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                    @transferFlag="getTransferData"
                                >
                                </inspection-table>
                            </div>
                        </TabPane>
                        <TabPane label="ONEStor" name="ONEStor">
                            <div v-if="tabName === 'ONEStor'">
                                <inspection-table
                                    :inspectionDate="formDate(this.inspectionDate)"
                                    :projectName="projectName"
                                    :productName="tabName"
                                    @transferFlag="getTransferData"
                                >
                                </inspection-table>
                            </div>
                        </TabPane>
                      <TabPane label="UIS" name="UIS">
                        <div v-if="tabName === 'UIS'">
                          <inspection-table
                            :inspectionDate="formDate(this.inspectionDate)"
                            :projectName="projectName"
                            :productName="tabName"
                            @transferFlag="getTransferData"
                          >
                          </inspection-table>
                        </div>
                      </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
      <inspection-node-detail v-model="detailModel.flag" :data="detailData" :title="detailModel.title"></inspection-node-detail>
    </div>
</template>

<script>
import { buildTree } from '@/assets/js/utils';
import FTree from "@/components/h3c-tree/index";
import InspectionPassAndError from "./components/InspectionPassAndError.vue";
import InspectionTable from "./components/InspectionTable.vue";
import InspectionNodeDetail from "./components/InspectionNodeDetail.vue";

export default {
    name: "InspectionManage",
    components: {
        "h3c-tree": FTree,
        "pass-error": InspectionPassAndError,
        "inspection-table": InspectionTable,
        "inspection-node-detail": InspectionNodeDetail,
    },
    data() {
        return {
            inspectionDate: new Date().toISOString().slice(0, 10),
            resourceTreeArr: [], // 资源列表
            searchValue: "", // 资源列表实际搜索值
            inputName: "", // 资源列表所填搜索值
            projectName: "", // 资源列表当前选中项
            list: {
                passData: {
                    id: 1,
                    title: "巡检通过项",
                    isPass: true,
                    count: 0,
                    diffCount: "",
                    className: 'inspection-box'
                },
                failData: {
                    id: 2,
                    title: "巡检不通过项",
                    isPass: false,
                    count: 0,
                    diffCount: 0,
                    className: 'inspection-box',
                    other: []
                },
                handlerData: {
                    id: 3,
                    title: "巡检未处理项",
                    isPass: false,
                    count: 0,
                    diffCount: '',
                    className: 'inspection-box',
                    other: []
                },
            },
            nodeList: [],
            tabName: "CAS",
            detailModel: {
              flag: false,
              title: '节点信息'
            },
            detailData: {
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
            this.getPassAndError();
        },
        // 日期查询
        handleSearch() {
            this.getPassAndError();
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
      queryDetail(id) {
        this.detailModel.flag = true;
        this.detailData = {
          id: id,
          dateTime: this.formDate(this.inspectionDate),
          projectName: this.projectName
        };
      },
        // 获取巡检通过、失败信息
        getPassAndError() {
            this.inspectionDate = this.formDate(this.inspectionDate)
            this.$http
                .get(`/inspection/count?dateTime=${this.inspectionDate}&projectName=${this.projectName}`)
                .then(({ data }) => {
                    if (data.status) {
                        let resp = data.data
                        this.list.passData.count = resp.passCount
                        this.list.failData.count = resp.failCount
                        this.list.failData.diffCount = resp.failDiffCount
                        this.list.handlerData.count = resp.unhandledCount
                        this.list.failData.other = [resp.fail1Count, resp.fail2Count, resp.fail3Count, resp.fail4Count]
                        this.list.handlerData.other = [resp.unhandled1Count, resp.unhandled2Count, resp.unhandled3Count, resp.unhandled4Count]
                    }
                });
                this.$http
                  .get(`/inspection/node/count?dateTime=${this.inspectionDate}&projectName=${this.projectName}`)
                  .then(({ data }) => {
                    this.nodeList = [
                    {
                      id: 'cas',
                      title: "CAS巡检节点数",
                      isPass: true,
                      count: 0,
                      node:[],
                      className: 'inspection-box'
                    },
                    {
                      id: 'cloudos',
                      title: "CloudOS巡检节点数",
                      isPass: true,
                      count: 0,
                      node:[],
                      className: 'inspection-box'
                    },
                    {
                      id: 'onestor',
                      title: "ONEStor巡检节点数",
                      isPass: true,
                      count: 0,
                      node:[],
                      className: 'inspection-box'
                    },
                    {
                      id: 'uis',
                      title: "UIS巡检节点数",
                      isPass: true,
                      count: 0,
                      node:[],
                      className: 'inspection-box'
                    }];
                    if (data.status) {
                      this.nodeList = this.nodeList.map((item) => {
                        const sameItem = data.data.find(obj => obj.id === item.id)
                        return {...item, ...sameItem}
                      })
                    }
                  });
                },
                getTransferData() {
                    this.getPassAndError()
                },
          // 全部导出
          handleExport() {
            this.$loading.show();
            this.$http.get(
              `/inspection/all/export`,
              { responseType: 'blob' })
              .then((res)=>{
                let a = document.createElement('a'),
                  url = window.URL.createObjectURL(res.data);
                a.href = url;
                a.download = this.inspectionDate + "_" + '巡检结果信息.xlsx';
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
          this.getResourceList();
      },
      watch: {
          projectName: {
              handler(newVal, oldVal) {
                  if(newVal !== oldVal) {
                      this.getPassAndError()
                  }
              },
          },
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
            .detail-top {
                height: 138px;
                margin-bottom: 14px;
                display: flex;
                width: 100%;
                overflow-x: scroll;
                overflow-y: hidden;
                white-space: nowrap;
                div {
                  height: 120px;
                  border-radius: 8px;
                }
                .split {
                  margin-right: 14px;
                  border-right:5px solid #3399FF;
                }
            }
            .detail-bottom {
                position: absolute;
                left: 0;
                right: 0;
                top: 134px;
                bottom: 0;
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
