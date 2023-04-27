<!--
 * @Description: 公网IP模块，暂时不做该模块功能
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-12 11:25:24
 -->

<template>
  <div class="public-ip-container cds-border">
    <div id="network" class="cds-wrapper">
      <i-row style="padding-bottom: 15px;">
        <div class="public-network-search" style="float:left;">
          <i-input
            v-model="queryName"
            clearable
            style="width: 240px"
            @on-select="handleSelect"
            @on-search="changeName"
            @on-enter="getPublicNetwork()"
            placeholder="请输入名称进行查询">
          </i-input>
          <i-button
            type="primary"
            @click="getPublicNetwork()">
            <i class="iconfont icon-chaxun">查 询</i>
          </i-button>
        </div>
        <div class="public-net-work-ip-operate cds-float-right">
          <i-button
            type="primary"
            @click="createNetModal">
            <i class="iconfont icon-xinjian">新 建</i>
          </i-button>
          <i-button
            type="primary"
            class="btn-long"
            @click="deleteNetwork(true)">
            <i class="iconfont icon-shanchu">释 放</i>
          </i-button>
          <i-button
            class="cds-btn-refresh"
            type="primary"
            @click="refreshPublicNetwork">
            <i class="iconfont icon-shuaxin1"></i>
          </i-button>
        </div>
      </i-row>
      <i-row style="overflow-y: auto;">
        <div>
          <i-table
            stripe
            :columns="networkItem"
            :data="netTablePage.getShowData()"
            @on-selection-change="changeSelected">
          </i-table>
        </div>
      </i-row>
      <i-row>
        <div class="public-network-page cds-clearfix">
          <div class="cds-float-left">
            共有{{netTablePage.getDataNum()}}条记录，当前页{{netTablePage.getCurrentPage()}}/{{netTablePage.getPageNum()}}页
          </div>
          <div class="cds-float-right">
            <i-page
              show-sizer
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :current="1"
              placement="top"
              size="small"
              :total="netTablePage.getDataNum()"
              :page-size="netTablePage.getPageSize()"
              :page-size-opts="netTablePage.getPageSizeOpts()">
            </i-page>
          </div>
        </div>
      </i-row>

      <!--确认释放单项对话框-->
      <i-modal
        v-model="modal.deleteModal"
        :scrollable="true"
        class-name="modal-content"
        id="deletePublicNetwork"
        width="600px"
        @on-cancel="cancelDelete">
        <p slot="header">
          <span class="vertical-line"></span>
          <span class="pop-title">信息确认</span>
        </p>
        <div class="warn-content">
          <div class="warn-content2">
            <div class="warn-info">
              <div>
                <i class="iconfont icon-wenhaofill" style="color: #f90;">是否确认释放公网IP</i>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <i-button
            type="primary"
            class="save"
            @click="confirmDeletion">
            确 认
          </i-button>
          <i-button
            class="cancel"
            @click="cancelDelete">
            取 消
          </i-button>
        </div>
      </i-modal>

      <!-- 显示详细信息对话框-->
      <i-modal
        v-model="modal.netDetailInfo"
        :scrollable="true"
        class-name="modal-content"
        id="netDetailInfo">
        <p slot="header">
          <span class="vertical-line"></span>
          <span class="pop-title">公网IP基本信息</span>
        </p>
        <div style="text-align:left">
          <div class="basic-info-content">
            <ul>
              <li>
                <span class="diskAttr">名称 :</span>
                <span class="diskAttrVal">{{publicNetInfo.id}}</span>
              </li>
              <li>
                <span class="diskAttr">IP地址 :</span>
                <span class="diskAttrVal">{{publicNetInfo.name}}</span>
              </li>
              <li>
                <span class="diskAttr">状态 :</span>
                <span
                  class="diskAttrVal"
                  :style="{color: publicNetInfo.statusColor}">
                <f-icon name="circle"></f-icon>
                {{publicNetInfo.statusLabel}}
              </span>
              </li>
              <li>
                <span class="diskAttr">带宽 :</span>
                <span class="diskAttrVal">{{publicNetInfo.size}}GB</span>
              </li>
              <li>
                <span class="diskAttr">地址池 :</span>
                <span class="diskAttrVal">{{publicNetInfo.azoneNameLable}}</span>
              </li>
              <li>
                <span class="diskAttr">资源名称 :</span>
                <span class="diskAttrVal">{{publicNetInfo.storageType === null || publicNetInfo.storageType === ''?"普通":publicNetInfo.storageType}}</span>
              </li>
              <li>
                <span class="diskAttr">资源类型 :</span>
                <span class="diskAttrVal">{{publicNetInfo.userName}}</span>
              </li>
              <li>
                <span class="diskAttr">所有者 :</span>
                <span class="diskAttrVal">{{publicNetInfo.createdDate}}</span>
              </li>
              <li>
                <span class="diskAttr">组织 :</span>
                <span class="diskAttrVal">{{publicNetInfo.description}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div slot="footer">
          <i-button
            type="primary"
            @click="modal.netDetailInfo=false">
            <span class="btn-title">关 闭</span>
          </i-button>
        </div>
      </i-modal>

      <!--公网IP创建-->
      <create-net-modal
        ref="createNetworkMethod"
        @updateDisks="closeModal"
        :user-name="userName"></create-net-modal>
      <!--设置带宽-->
      <expand-net-modal
        ref="expandNetworkMethod"
        @updateNets="closeModal"></expand-net-modal>
      <!--分配资源-->
      <res-list-modal
        ref="selectRes"
        @changeUser="changeUserName"></res-list-modal>
      <!--确认释放多项及回收对话框-->
      <info-confirm
        ref="deleteSome"
        :delete-flag="deleteFlag"
        :selected-num="selectedNum"
        :content="content"
        :notes="notes"
        :number-flag="numberFlag"
        @makeSure="confirmDeletion"></info-confirm>
    </div>
  </div>
</template>

<script>
  import mixins from "@/assets/js/mixins";
  import mixinsUtil from "@/pages/app/resource-manage/mixins-util.js";
  import {TablePage} from "@/assets/js/TablePage.js";
  import ExpandNetModal from "./ExpandNetModal.vue";
  import CreateNetModal from "./CreateNetModal.vue";
  import ResListModal from "./ResListModal2.vue";
  import InfoConfirm from "./InfoConfirm.vue"

  export default {
    mixins: [mixins, mixinsUtil],
    name: "PublicNetworkIp",
    components: {
      "expand-net-modal": ExpandNetModal,
      "create-net-modal": CreateNetModal,
      "res-list-modal": ResListModal,
      "info-confirm": InfoConfirm
    },
    created() {
      this.init();
      this.userName = this.$store.state.login.userName;
    },
    data() {
      return {
        numberFlag: false,
        notes: '',
        content: '',
        selectedNum: 0,
        userName: '',
        // 回收公网IP时信息存储对象
        backInfo: {
          id: '',
          // 多项删除时被选中的数据
          idsStr: ''
        },
        // 公网IP详细信息对象
        publicNetInfo: {},
        // 删除公网IP时信息存储对象
        deletedInfo: {
          id: '',
          // 多项删除时被选中的数据
          idsStr: ''
        },
        modal: {
          deleteModal: false,
          netDetailInfo: false
        },
        // false: 表示单选删除; true: 表示多选删除
        deleteFlag: false,
        netTablePage: new TablePage(),
        // 公网IP数据
        networkItem: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "名称",
            sortable: true,
            key: "name",
            width: 100,
            render: (h, params) => {
              let _this = this,
                id = params.row.id,
                name = params.row.name;
              return h("div", {
                "class": {tableInfo: true},
                style: {
                  color: "#78B2F8",
                  cursor: "pointer"
                },
                attrs: {title: name},
                on: {
                  click: () => {
                    _this.showNetDetail({id: id, name: name});
                  }
                }
              }, name)
            }
          }, {
            title: "IP地址",
            key: "ipAddress",
            width: 100
          },
          {
            title: "状态",
            key: "status",
            width: 100,
          }, {
            title: "带宽（Mbps）",
            sortable: true,
            width: 140,
            key: "serverName"
          }, {
            title: "地址池",
            sortable: true,
            key: "userName",
            width: 120,
            render: (h, params) => {
              return h("div", {
                "class": {tableInfo: true},
                attrs: {title: params.row.userName}
              }, params.row.userName)
            }
          }, {
            title: "资源名称",
            sortable: true,
            width: 120
          }, {
            title: "资源类型",
            sortable: true,
            key: "edit",
            width: 120,
            align: "center"
          }, {
            title: "所有者",
            sortable: true,
            width: 120,
            key: "dilatation",
            align: "center"
          }, {
            title: "组织",
            sortable: true,
            width: 80,
            key: "modifyOwner",
            align: "center"
          }, {
            title: "分配",
            key: "delete",
            align: "center",
            render: (h, params) => {
              return h("div", {
                on: {
                  click: () => {
                    this.$refs.selectRes.showModal();
                  }
                }
              }, [
                h("i", {
                  class: "iconfont icon-renwufenpei tableIcon",
                  style: {
                    color: "#818E9E",
                    cursor: "pointer"
                  }
                })
              ])
            }
          },
          {
            title: "回收",
            key: "delete",
            align: "center",
            render: (h, params) => {
              let _this = this,
                id = params.row.id;
              return h("div", {
                on: {
                  click: () => {
                    _this.backInfo.id = id;
                    _this.backNetwork();
                  }
                }
              }, [
                h("i", {
                  class: "iconfont icon-recycle tableIcon",
                  style: {
                    color: "#818E9E",
                    cursor: "pointer"
                  }
                })
              ])
            }
          }, {
            title: "设置带宽",
            key: "delete",
            align: "center",
            width: 100,
            render: (h, params) => {
              let id = params.row.id,
                size = params.row.size,
                name = params.row.name;
              return h("div", {
                on: {
                  click: () => {
                    // 调用子组件方法
                    this.$refs.expandNetworkMethod.showModal(id, name, size);
                  }
                }
              }, [
                h("i", {
                  class: "iconfont icon-shezhi tableIcon",
                  style: {
                    color: "#5FEDFE",
                    cursor: "pointer"
                  }
                })
              ])
            }
          }, {
            title: "释放",
            key: "delete",
            align: "center",
            render: (h, params) => {
              let _this = this,
                id = params.row.id;
              return h("div", {
                on: {
                  click: () => {
                    _this.deletedInfo.id = id;
                    _this.deleteNetwork(false);
                  }
                }
              }, [
                h("i", {
                  class: "iconfont icon-shanchu tableIcon",
                  style: {
                    color: "#818E9E",
                    cursor: "pointer"
                  }
                })
              ])
            }
          }]

      }
    },
    methods: {
      // 删除公网IP时被选中个数
      changeSelected(data) {
        this.selectedNum = data.length;
        this.deletedInfo.idsStr = [];
        for (let i = 0; i < this.selectedNum; i++) {
          this.deletedInfo.idsStr.push(data[i].id);
        }
      },
      changeUserName(str) {
        return str;
      },
      handleSelect(value) {
        this.queryName = value;
        if (value !== "") this.getPublicNetwork();
      },
      changeName(value) {
        if (value === "") {
          this.init();
        }
        this.queryName = value;
      },
      closeModal() {
        this.init();
      },
      // 显示公网IP详细信息
      showNetDetail(obj) {
        let id = obj.id;
        this.modal.netDetailInfo = true;
        this.$loading.show();
        this.$http.get(`/volume/${id}`).then(({data}) => {
          if (data.status) {
            let t = data.data;
            this.publicNetInfo = t;
            if (t.createdDate) {
              this.publicNetInfo.createdDate = this.transformTime(t.createdDate);
            }
            if (t.status) {
              if (t.status === "creating") {
                this.publicNetInfo.statusLabel = "创建中";
                this.publicNetInfo.statusColor = "#40D1FB";
              } else if (t.status === "available") {
                this.publicNetInfo.statusLabel = "可用";
                this.publicNetInfo.statusColor = "#54CE83";
              } else if (t.status === "in-use") {
                this.publicNetInfo.statusLabel = "已加载";
                this.publicNetInfo.statusColor = "#8FA7F8";
              } else if (t.status === "error") {
                this.publicNetInfo.statusLabel = "不可用";
                this.publicNetInfo.statusColor = "#ED1C24";
              } else if (t.status === "attaching") {
                this.publicNetInfo.statusLabel = "挂载中";
                this.publicNetInfo.statusColor = "#FFC90E";
              } else if (t.status === "detaching") {
                this.publicNetInfo.statusLabel = "正在卸载中";
                this.publicNetInfo.statusColor = "#FFC90E";
              }
            }
          }
          this.$loading.hide();
        });
      },
      // 确认删除/释放公网IP
      confirmDeletion() {
        // if this.deleteFlag 为true，即为多选时 取this.deletedInfo.idsStr，else 取this.deletedInfo.id
        let ids = this.deleteFlag ? this.deletedInfo.idsStr : this.deletedInfo.id;
        this.$loading.show();
        this.$http.delete(`/floatingip/delete/${ids}`).then(({data}) => {
          if (data.status) {
            this.$Notice.success({desc: "删除成功!"});
            this.init();
          }
          // 单项释放对话框关闭
          this.modal.deleteModal = false;
          // 多项释放及回收对话框关闭
          this.$refs.deleteSome.closeModal();

          this.$loading.hide();
        });
      },
      cancelDelete() {
        this.modal.deleteModal = false;
      },
      // 回收公网IP
      backNetwork() {
        this.deleteFlag = false;
        this.selectedNum = 0;
        this.content = "是否确认回收公网IP";
        this.notes = "注：回收公网IP后，外部网络的用户将无法通过相应的IP地址访问虚拟机提供的服务";
        this.$refs.deleteSome.showModal();
      },
      // 删除/释放公网IP
      deleteNetwork(flag) {
        this.content = "是否确认释放公网IP";
        // false: 表示单选删除; true: 表示多选删除
        this.deleteFlag = flag;
        this.notes = '';
        if (flag) {
          this.numberFlag = true;
          this.$refs.deleteSome.showModal();
        } else {
          this.modal.deleteModal = true;
        }
      },
      changePage(page) {
        this.netTablePage.setCurrentPage(page);
        this.getPublicNetwork();
      },
      changePageSize(size) {
        this.netTablePage.setPageSize(size);
        this.getPublicNetwork();
      },
      refreshPublicNetwork() {
        this.netTablePage = new TablePage();
        this.init();
      },
      createNetModal() {
        this.$refs.createNetworkMethod.showModal();
      },
      getPublicNetwork() {
        this.netTablePage.setLoading(true);
        // 模糊查询待定
        this.$http.post("/floatingip/list/page", {
          "pageModel": {
            "current": this.netTablePage.getCurrentPage(),
            "pageSize": this.netTablePage.getPageSize(),
            "searchMap": {}
          },
          "paramMap": {
            "param": this.queryName
          }
        }).then(({data}) => {
          this.netTablePage.setLoading(false);
          if (data.status) {
            let d = data.data;
            this.setTablePageData(this.netTablePage, d);
          }
        }).catch(function (error) {
          this.netTablePage.setLoading(false);
        });
      },
      init() {
        this.getPublicNetwork();
        return 1;
      }

    }
  }
</script>
<style lang="less" scoped>
  .public-ip-container {
    background: #fff;
    position: absolute;
    width: 100%;
    bottom: 0;
    top: 0;
    min-width: 900px;
    .public-network-page {
      padding: 15px 0;
      line-height: 25px;
    }
  }
</style>
