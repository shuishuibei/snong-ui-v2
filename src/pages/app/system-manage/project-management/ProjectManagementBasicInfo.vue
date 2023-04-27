<template>
    <div class="cds-wrapper project-management-basic-info">
        <div class="info-left info-box">
            <h3 class="title">基本信息</h3>
            <div class="content-grid">
                <Row>
                    <Col span="6" class="props-style">项目名称：</Col>
                    <Col span="18">{{data.projectName}}</Col>
                </Row>
              <Row>
                <Col span="6" class="props-style">项目编号：</Col>
                <Col span="18">{{data.projectNo}}</Col>
              </Row>
                <Row>
                    <Col span="6" class="props-style">项目类型：</Col>
                    <Col span="18" >{{data.projectType}}</Col>
                </Row>
                <Row>
                    <Col span="6" class="props-style">项目阶段：</Col>
                    <Col span="18">{{data.projectProgress}}</Col>
                </Row>
                <Row>
                  <Col span="6" class="props-style">服务合同号：</Col>
                  <Col span="18" >{{ data.contractNumber }}</Col>
                </Row>
                <Row>
                    <Col span="6" class="props-style">服务合同名称：</Col>
                    <Col span="18" >{{ data.contractName }}</Col>
                </Row>
              <Row>
                <Col span="6" class="props-style">交付规格：</Col>
                <Col span="18" >{{ data.paySpec }}</Col>
              </Row>
              <Row>
                <Col span="6" class="props-style">服务性质：</Col>
                <Col span="18" >{{ data.serviceProperty }}</Col>
              </Row>
              <Row>
                <Col span="6" class="props-style">代表处：</Col>
                <Col span="18" >{{ data.companyOffice }}</Col>
              </Row>
              <Row>
                <Col span="6" class="props-style">区域：</Col>
                <Col span="18" >{{ data.area }}</Col>
              </Row>
              <Row>
                <Col span="6" class="props-style">行业：</Col>
                <Col span="18" >{{ data.projectTrade }}</Col>
              </Row>
                <Row>
                    <Col span="6" class="props-style">开始时间：</Col>
                    <Col span="18">{{data.dateStart}}</Col>
                </Row>
                <Row>
                    <Col span="6" class="props-style">结束时间：</Col>
                    <Col span="18">{{data.dateEnd}}</Col>
                </Row>
                <Row>
                    <Col span="6" class="props-style">项目经理：</Col>
                    <Col span="18">{{data.managerName}}</Col>
                </Row>
                <Row>
                    <Col span="6" class="props-style">项目成员：</Col>
                    <Col span="18" v-if="membersList.length > 0" class="projectMembers">
                        <span v-for="(item,index) in membersList" :key="index">{{item.userName}}</span>
                    </Col>
                    <Col span="18" v-else>暂无成员</Col>
                </Row>
                <Row>
                    <Col span="6" class="props-style">项目描述：</Col>
                    <Col span="18">{{data.projectDesc}}</Col>
                </Row>
            </div>
        </div>
        <div class="info-right info-box">
          <h3 class="title">数据中心</h3>
          <div class="cds-border cds-padding-14">
          <!-- 头部搜索和按钮操作 -->
          <div >
            <!-- 搜索 -->
            <div class="cds-clearfix cds-margin-bottom-14">
              <!-- 按钮操作 -->
              <div class="cds-float-right">
                <i-button type="primary"  @click="flag.add = true">
                  <i class="iconfont icon-plus">新增</i>
                </i-button>
                <i-button type="primary"  class="cds-btn-refresh" @click="handleRefresh">
                  <i class="iconfont icon-shuaxin1"></i>
                </i-button>
              </div>
            </div>
            <!-- 表格 -->
            <Table ref="zoneTable"
                   size="small"
                   class="cds-margin-bottom-14"
                   stripe
                   :key="tableConfig.key"
                   :loading="tableConfig.loading"
                   :columns="tableConfig.columns"
                   :data="tableConfig.data"
                   @on-sort-change="sortChange">
              <template slot="action" slot-scope="{ row, $index }">
                <div>
                  <i class="iconfont icon-edit-1-copy" title="修改" @click="editData(row)"></i>
                  <i class="iconfont icon-shanchu" title="删除" @click="deleteData(row)"></i>
                </div>
              </template>
            </Table>
            <!-- 分页 -->
            <div class="page-wrapper clearfix">
              <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
              <div class="cds-float-right">
                <Page :total="page.totalCount"
                      :current="page.currentPage"
                      :page-size="page.pageSize"
                      :page-size-opts="[5, 10, 20, 100]"
                      show-sizer
                      size="small"
                      placement="top"
                      @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                      @on-page-size-change="getTableData({pageSize: $event})">
                </Page>
              </div>
            </div>
          </div>
        </div>
        </div>
      <!-- 新增 -->
      <ProjectZoneEdit v-model="flag.add"
                      title="新增数据中心"
                       @refresh-table="handleRefresh"
                      :dataList="{add: true, projectId: this.data.id}">
      </ProjectZoneEdit>
      <!-- 修改 -->
      <ProjectZoneEdit v-model="flag.update"
                      title="修改数据中心"
                       @refresh-table="handleRefresh"
                      :dataList="{rowData: currentRow, projectId: this.data.id}">
      </ProjectZoneEdit>
      <!-- 单条删除 -->
      <ModalConfirm ref="deleteSingle"
                    v-model="flag.delete"
                    title="删除数据中心"
                    :info="'确认删除：【' + currentRow.zoneName + '】数据中心吗？'"
                    @on-cancel="deleteIds = []"
                    @on-ok="submitDelete"
                    :showBackgroudColor="false">
      </ModalConfirm>
<!--        <div class="footer">-->
<!--            <div class="footer-button">-->
<!--                <Button type="primary" @click="closeBasicInfo">关闭</Button>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>
import * as CONST from './components/ProjectConst';
import ProjectZoneEdit from './components/ProjectZoneEdit';
import ModalConfirm from "@/components/modal-confirm/ModalConfirmTemp";
import ModalDetail from "@/components/modal-detail/ModalDetail";
const Status = [
  {
    label: '是',
    value: 1,
    color: '#55ce5b'
  },
  {
    label: '否',
    value: 0,
    color: '#acacac'
  }
];
export default {
    name: 'project-management-basic-info',
    components: {ModalConfirm, ProjectZoneEdit, ModalDetail},
    props:{
        data:{
            type: Object,
            default:[]
        }
    },
    data(){
        return {
          // createTime:'',
          membersList: [],
          projectProgressList: CONST.projectProgressList,
          previousPlanTask:{
                columns:[
                    {
                        title:'上周计划任务',
                        key: 'taskContent'

                    },
                    {
                        title:'任务责任人',
                        key: 'responsiblePerson'
                    }
                ],
                data:[]
            },
          filterMap: {},  //表格筛选参数
          orderMap: {},   //表格排序参数
          deleteIds: [], //表格中选中的数据
          currentRow: {}, //表格中当前操作行
          //分页
          page: {
            pageSize: 10,   //每页条数
            totalCount: 0,  //总数
            totalPage: 1,   //总页数
            currentPage: 1  //当前页码
          },
          // 表格配置信息
          tableConfig: {
            key: new Date().toString(), //表格的属性key
            loading: false, //表格是否加载中
            //表格列的配置描述
            columns: [
              {
                title: '数据中心名称',
                key: 'projectName',
                align: 'center',
                width: 150,
                render: (h, params) => {
                  return h('span', {
                    attrs: {
                      title: params.row.projectName
                    }
                  }, params.row.projectName);
                }
              },
              {
                title: '远程运维',
                key: 'remoted',
                width:84,
                align: 'center',
                render: (h, params) => {
                  let remoted = params.row.remoted ? 1 : 0,
                    node = Status.filter((item) => {
                      return item.value === remoted
                    })[0];
                  return h('div',
                    {
                      attrs: {
                        title: node.label
                      }
                    },
                    [
                      h('span', {
                        class: 'cds-status-dot',
                        style: {
                          backgroundColor: node.color
                        }
                      }),
                      h('span', {
                        style: {
                          verticalAlign: 'middle',
                          color: node.color
                        }
                      }, node.label)
                    ])
                }
              },
              {
                title: '远程代理IP',
                key: 'proxyIp',
                align: 'center',
                ellipsis: true,
                sortable: 'custom',
                render: (h, params) => {
                  return h('span', {
                    attrs: {
                      title: params.row.proxyIp
                    },
                  }, params.row.proxyIp);
                }
              },
              {
                title: '本地部署',
                key: 'localDeploy',
                align: 'center',
                width:84,
                render: (h, params) => {
                  let localDeploy = params.row.localDeploy ? 1 : 0,
                    node = Status.filter((item) => {
                      return item.value === localDeploy
                    })[0];
                  return h('div',
                    {
                      attrs: {
                        title: node.label
                      }
                    },
                    [
                      h('span', {
                        class: 'cds-status-dot',
                        style: {
                          backgroundColor: node.color
                        }
                      }),
                      h('span', {
                        style: {
                          verticalAlign: 'middle',
                          color: node.color
                        }
                      }, node.label)
                    ])
                }
              },
              {
                title: '创建日期',
                key: 'createTime',
                align: 'center',
                sortable: 'custom',
                render: (h, params) => {
                  return h('span', {
                    attrs: {
                      title: params.row.createTime
                    },
                  }, params.row.createTime);
                }
              },
              {
                title: '操作',
                key: 'action',
                width: 120,
                align: 'center', // 居中对齐
                slot: 'action'
              }
            ],
            data: []  //表格中的
          },
          flag: {
            add: false,
            update: false,
            delete: false
          }
        }
    },
    methods:{
      /**
       * 发送请求获取表格数据，并且做相应处理
       * @param loading {boolean} 表格缓冲，默认值为false
       * @param currentPage {number} 分页当前页，默认值为第一页
       * @param pageSize {number} 分页每页条数，默认值为每页10条
       */
      getTableData({loading = false, currentPage = 1, pageSize = 10} = {}) {
        if (loading) {
          //设置表格缓冲
          this.tableConfig.loading = loading;
          //将表格数据data设置为空数组
          this.tableConfig.data = [];
        }
        //设置分页每页条数
        this.page.pageSize = pageSize;
        //设置分页当前页
        this.page.currentPage = currentPage;
        //清空表格中选中的数据（除了批量删除其他操作都需要清空该值，故在获取数据时清空）
        this.deleteIds = [];
        //发送请求并且做相应处理
        this.$http.post("project-management/page/list", {
          current: currentPage,
          orderMap: this.orderMap,
          pageSize: pageSize,
          searchMap: {
            projectId: this.data.id,     // 固定
            // ...this.searchMap, //包含下拉框联动时的传参方式
            // ...this.filterMap
          }
        }).then(({data}) => {
          //请求状态status为true时的处理，为false不需要单独处理（因为在入口文件中已经做了全局处理）
          if (data.status) {
            let resp = data.data;
            //将获取的分页数据赋值给表格数据data
            this.tableConfig.data = resp.records;
            //设置分页总条数
            this.page.totalCount = resp.total;
            //设置分页总页数，当总页数为0时显示为1
            this.page.totalPage = resp.pages ? resp.pages : 1;
          }
          //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
          loading ? this.tableConfig.loading = false : '';
        })
      },
      /**
       * 当表格点击排序时触发
       * @param column {object} 当前列数据
       * @param key {string} 排序依据的指标，即当前列的key值
       * @param order {string} 排序的顺序，值为asc（升序）、desc（降序）或normal（不排序）
       */
      sortChange({column, key, order}) {
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
        this.orderMap = {[key]: flag};
        this.getTableData({pageSize: this.page.pageSize});
      },
      //点击刷新按钮触发
      handleRefresh() {
        //清空搜索输入框
        // this.setInputEmpty();
        //清空筛选
        this.filterMap = {};
        //清空排序
        this.orderMap = {};
        //重设Table组件的key，促使Table组件重新渲染
        this.tableConfig.key = new Date().toString();
        //请求表格数据：显示缓冲状态，保留每页条数
        this.getTableData({
          loading: true,
          pageSize: this.page.pageSize
        });
      },
      editData(rowData) {
        // 设置当前操作行
        this.currentRow = rowData;
        this.flag.update = true;
      },
      deleteData(rowData) {
        // 设置当前操作行
        this.currentRow = rowData;
        this.deleteIds = [rowData.id];
        this.flag.delete = true;
      },
      //提交删除
      submitDelete() {
        this.$http.post(`project-management/delete`,
          this.deleteIds
        ).then(({data}) => {
          //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
          if (data.status) {
            //删除成功后的提示信息
            this.$Notice.success({
              desc: data.message && data.message !== '' ? data.message : '删除数据中心成功。'
            });
            this.getTableData({loading: true});
          } else {
            this.$Notice.error({
              desc: data.message && data.message !== '' ? data.message : '删除数据中心成功。'
            });
          }
        })
      },
        // 获取项目成员列表
        getExistingMembers(){
            this.$http({
                url:`/project-management/usersInProject/${this.data.id}`,
                method: 'GET'
            }).then(({data})=>{
                if(data.status){
                    this.membersList = data.data;
                }
            })
        },
        // 获取项目信息
        getProjectInfo(){
            this.$http({
                url:`/project/${this.data.id}`,
                method: 'GET'
            }).then(({data})=>{
                if(data.status){
                    // 任务创建时间
                    if (this.data.projectProgress) {
                      this.data.projectProgress = CONST.projectProgressList
                        .filter((item) => item.value === this.data.projectProgress)[0].label;
                    }
                    if(this.data.projectType) {
                      this.data.projectType = CONST.projectTypeList
                        .filter((item) => item.value === this.data.projectType)[0].label;
                    }
                    // if (data.data.zones) {
                    //   // 数据中心数据
                    //   this.tableConfig.data = data.data.zones;
                    // }
                }
            })
        },
        // 关闭并显示表格页
        closeBasicInfo(){
            this.$emit('shouldComponentShow','shouldTableShow');
        }
    },
  //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
  created() {
    this.getTableData({loading: true});
  },
  mounted(){
      this.getExistingMembers(); // 获取项目成员列表
      this.getProjectInfo(); // 获取项目信息
  }
}
</script>

<style lang="less" scoped>
.action-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 86px;
  margin: 0 auto 0 auto;
}
.project-management-basic-info {
    width: 100%;
    height: 100%;
    position: relative;
    .info-box {
        padding: 0 15px 15px 15px;
        background-color: #FFF;
    }
    .title {
        position: relative;
        padding-left: 8px;
        height: 40px;
        line-height: 40px;
        font-weight: normal;
        border-bottom: 1px solid #E4E8EB;
        margin-bottom: 5px;
        &:before {
            position: absolute;
            background-color: #ff0042;
            width: 3px;
            height: 18px;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            content: "";
        }
    }
    .projectMembers {
        span {
            display: inline-block;
            padding-right: 5px;
        }
    }
}
.info-left{
    width: 35%;
    height: 100%;

    .content-grid {
        .ivu-row:nth-child(odd) {
            background-color: #F6F7F9;
        }
        .ivu-row {
            min-height: 30px;
            padding: 6px 0;
            .props-style {
                text-align: right;
                align-self: center;
            }
        }
    }
}
.info-right {
    position: absolute;
    width: calc(~"65% - 12px");
    height: 100%;
    right: 0;
    top: 0;
    margin-bottom: 80px;
    overflow: auto;
    .plan-table {
        padding-bottom: 18px;
    }
}
</style>

