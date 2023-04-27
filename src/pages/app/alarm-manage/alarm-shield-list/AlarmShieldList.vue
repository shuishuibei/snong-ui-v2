<template>
    <div class="cds-wrapper cds-border cds-padding-14">
        <!-- 头部搜索和按钮操作 -->
        <div  class="d-bord " @click="cardSearch(-1)">
          <div id="clickclassL" class="l-bord d-hover" >
            <svg t="1661932961759" class="icon" viewBox="0 0 1024 1024" version="1.1"  p-id="1378" width="100%" height="100%"><path d="M101.964 482.708c5.746-19.334 26.228-26.474 46.376-27.284 46.002-1.84 151.37-4.674 364.66-4.674 213.29 0 318.658 2.832 364.66 4.674 20.148 0.81 40.63 7.95 46.376 27.284 2.324 7.82 3.964 17.774 3.964 30.292 0 12.52-1.64 22.47-3.964 30.292-5.746 19.334-26.228 26.474-46.376 27.284-46.002 1.84-151.37 4.674-364.66 4.674-213.29 0-318.658-2.832-364.66-4.674-20.148-0.81-40.63-7.95-46.376-27.284C99.64 535.472 98 525.52 98 513c0-12.52 1.64-22.47 3.964-30.292z" fill="#53B5FF" p-id="1379"></path><path d="M367.75 513m-145.25 0a145.25 145.25 0 1 0 290.5 0 145.25 145.25 0 1 0-290.5 0Z" fill="#FF934A" p-id="1380"></path><path d="M924.036 212.958c-5.746-19.334-26.228-26.474-46.376-27.284-46.002-1.84-151.37-4.674-364.66-4.674-213.29 0-318.658 2.832-364.66 4.674-20.148 0.81-40.63 7.95-46.376 27.284C99.64 220.778 98 230.732 98 243.25c0 12.52 1.64 22.47 3.964 30.292 5.746 19.334 26.228 26.474 46.376 27.284 46.002 1.84 151.37 4.674 364.66 4.674 213.29 0 318.658-2.832 364.66-4.674 20.148-0.81 40.63-7.95 46.376-27.284 2.324-7.82 3.964-17.774 3.964-30.292 0-12.52-1.64-22.47-3.964-30.292z" fill="#53B5FF" p-id="1381"></path><path d="MNaNNaNmNaNNaNaNaNNaNNaN 1 0NaNNaNNaNNaNNaN 1 0NaNNaNZ" fill="#FFDA8F" p-id="1382"></path><path d="M924.036 752.458c-5.746-19.334-26.228-26.474-46.376-27.284-46.002-1.84-151.37-4.674-364.66-4.674-213.29 0-318.658 2.832-364.66 4.674-20.148 0.81-40.63 7.95-46.376 27.284C99.64 760.278 98 770.232 98 782.75c0 12.52 1.64 22.47 3.964 30.292 5.746 19.334 26.228 26.474 46.376 27.284 46.002 1.84 151.37 4.674 364.66 4.674 213.29 0 318.658-2.832 364.66-4.674 20.148-0.81 40.63-7.95 46.376-27.284 2.324-7.82 3.964-17.774 3.964-30.292 0-12.52-1.64-22.47-3.964-30.292z" fill="#53B5FF" p-id="1383"></path><path d="MNaNNaNmNaNNaNaNaNNaNNaN 1 0NaNNaNNaNNaNNaN 1 0NaNNaNZ" fill="#FFDA8F" p-id="1384"></path></svg>
          </div>
          <div class="r-bord" >
            <div class="r-t-bord">全部</div>
              <div class="r-b-bord">
                <count-to :start-val="0" :end-val="statisticsData.allCount" :duration="1" />
              </div>
          </div>
        </div>
        <div class="d-bord" style="margin-left: 50px;" @click="cardSearch(0)">
          <div id="clickclassC" class="l-bord l-hover" >
            <svg t="1662002130427" class="icon" viewBox="0 0 1024 1024" version="1.1"  p-id="1101" width="100%" height="100%"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#f23504" p-id="1102" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path><path d="M771.656 704.254c-63.656 87.816-164.966 135.53-268.148 133.504-166.044-3.264-306.84-139.13-316.776-306.686C176 349.956 322.15 190.156 503.508 186.26c90.964-1.958 185.35 34.574 248.782 100.036 0.306 0.32 0.612 0.646 0.918 0.97 14.864-9.22 27.612-16.276 38.282-21.66 22.828-11.526 45.574 3.72 46.144 29.416 0.714 31.54-0.488 78.908-8.368 141.336-3.218 25.496-27.186 42.844-52.254 37.822-61.356-12.296-106.42-26.166-135.926-36.856-24.05-8.708-31.198-35.228-13.094-53.356 8.654-8.66 19.65-18.824 33.498-30.406a160.624 160.624 0 0 1-1.284-1.484c-39.2-46.806-85.812-74.81-156.698-72.702-130.898 3.894-234.772 121.146-223.98 251.7 9.632 116.72 108.112 210.332 223.98 213.564 71.172 1.986 141.304-29.198 187.386-87.35 13.908-17.546 32.928-31.252 53.292-22.054a135.776 135.776 0 0 1 12.178 6.304 135.548 135.548 0 0 1 11.506 7.452c18.102 13.128 16.94 37.13 3.786 55.264z" fill="#FFFFFF" p-id="1103"></path></svg>
          </div>
          <div class="r-bord " >
            <div class="r-t-bord" style="color: red;">未恢复</div>
              <div class="r-b-bord ">
                <count-to :start-val="0" :end-val="statisticsData.abnormalCount" :duration="1" />
              </div>
            </div>
        </div>
        <div class="d-bord" style="margin-left: 50px;" @click="cardSearch(1)">
          <div id="clickclassR" class="l-bord r-hover" >
            <svg t="1662002777390" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="1747" width="100%" height="100%"><path d="M64 512c0 247.424 200.576 448 448 448s448-200.576 448-448S759.424 64 512 64 64 264.576 64 512z" fill="#34bfa3" p-id="1748" data-spm-anchor-id="a313x.7781069.0.i9" class="selected"></path><path d="M519.66 525.44a10.654 10.654 0 0 1-15.32 0c-21.14-21.718-82.92-84.97-147.134-148.374-14.508-14.336-35.158-19.86-51.414-7.744-6.656 4.972-14.186 11.584-22.272 20.352-11.03 11.926-18.39 23.296-23.274 32.768-8.022 15.51-3.948 33.686 6.228 47.766 79.574 110.25 165.484 185.43 211.606 221.802 20.288 15.98 47.552 15.98 67.84 0 46.122-36.372 132.032-111.552 211.606-221.802 10.176-14.08 14.25-32.256 6.228-47.766-4.884-9.472-12.244-20.842-23.274-32.768-8.086-8.768-15.616-15.38-22.272-20.352-16.256-12.116-36.906-6.592-51.414 7.744-64.212 63.404-125.994 126.656-147.136 148.374z" fill="#FFFFFF" p-id="1749"></path></svg>
          </div>
          <div class="r-bord" >
            <div class="r-t-bord" style="color: green;">已恢复</div>
              <div class="r-b-bord">
                <count-to :start-val="0" :end-val="statisticsData.recoveredCount" :duration="1" />
              </div>
          </div>
        </div>


        <div >
            <!-- 搜索 -->
            <div class="cds-clearfix cds-margin-bottom-14">
              <Input
                clearable
                v-model="inputAlarmId"
                style="width: 6%"
                placeholder="请输入告警ID"
                @keyup.enter.native = "handleSearch"
              >
              </Input>
              <Input
                  clearable
                  v-model="inputProjectName"
                  style="width: 6.5%"
                  placeholder="请输入项目名称"
                  @keyup.enter.native = "handleSearch"
              >
              </Input>
              <!--<Input-->
                <!--clearable-->
                <!--v-model="inputAlarmObject"-->
                <!--style="width: 8.5%"-->
                <!--placeholder="请输入资源名称"-->
              <!--&gt;-->
              <!--</Input>-->
              <!--<Input-->
                <!--clearable-->
                <!--v-model="inputKeywords"-->
                <!--style="width: 6%"-->
                <!--placeholder="请输入告警等级"-->
              <!--&gt;-->
              <!--</Input>-->
              <Input
                clearable
                v-model="inputKeywords"
                style="width: 20%"
                placeholder="请输入资源/告警等级/告警类型/告警概要/告警详情"
                @keyup.enter.native = "handleSearch"
              >
              </Input>
              <!--<Input-->
                <!--clearable-->
                <!--v-model="inputAlarmOutline"-->
                <!--style="width: 10%"-->
                <!--placeholder="请输入"-->
              <!--&gt;-->
              <!--</Input>-->
              <!--<Input-->
                <!--clearable-->
                <!--v-model="inputAlarmMessage"-->
                <!--style="width: 10%"-->
                <!--placeholder="请输入"-->
              <!--&gt;-->
              <!--</Input>-->
              <DatePicker type="datetime" placeholder="选择开始时间" style="width: 9.5%" :value="pickStartDate" format="yyyy-MM-dd HH:mm:ss" @on-change="startDateChange"></DatePicker>
              &nbsp;&nbsp;至&nbsp;&nbsp;
              <DatePicker type="datetime" placeholder="选择结束时间" style="width: 9.5%;margin-right: 6px; " :value="pickEndDate"  format="yyyy-MM-dd HH:mm:ss" @on-change="endDateChange"></DatePicker>
              <!--<Input-->
                  <!--clearable-->
                  <!--v-model="inputHostName"-->
                  <!--style="width: 160px"-->
                  <!--placeholder="请输入主机名称"-->
              <!--&gt;-->
              <!--</Input>-->
              <!--<Input-->
                <!--clearable-->
                <!--v-model="inputIp"-->
                <!--style="width: 160px"-->
                <!--placeholder="请输入IP地址"-->
              <!--&gt;-->
              <!--</Input>-->
              <i-button
                class="cds-btn-search"
                type="primary"
                @click="handleSearch">
                <i class="iconfont icon-iconfontsousuo"></i>
              </i-button>
              <i-button
                type="primary"
                @click="handleExcel">
                <i class="iconfont icon-daochu">导出全部</i>
              </i-button>
            <!-- 按钮操作 -->
          <!--<div class="cds-float-right">-->
            <!--<i-button-->
              <!--type="primary"-->
              <!--@click="flag.add = true">-->
              <!--<i class="iconfont icon-plus">新增</i>-->
            <!--</i-button>-->
            <!--<i-button-->
              <!--type="primary"-->
              <!--@click="flag.import = true">-->
              <!--<i class="iconfont icon-zu">导入主机</i>-->
            <!--</i-button>-->
            <!--<i-button-->
              <!--type="primary"-->
              <!--@click="submitSync">-->
              <!--<i class="iconfont icon-shuaxin1">同步</i>-->
            <!--</i-button>-->
            <!--<i-button-->
              <!--type="primary" :disabled="alarmIds.length<2"-->
              <!--@click="flag.conFirmBatch = true">-->
              <!--<i class="iconfont icon-shuaxin1">批量确认</i>-->
            <!--</i-button>-->
            <i-button
              class="cds-btn-refresh"
              type="primary"
              @click="handleRefresh">
              <i class="iconfont icon-shuaxin1"></i>
            </i-button>
          <!--</div>-->
        </div>
        <!-- 表格 -->
        <Table ref="table"
               size="small"
               class="alarmTable"
               stripe
               :key="tableConfig.key"
               :loading="tableConfig.loading"
               :columns="tableConfig.columns"
               :data="tableConfig.data"
               @on-selection-change="selectionChange"
               @on-sort-change="sortChange">
        </Table>
        <!-- 分页 -->
        <div class="page-wrapper clearfix cds-margin-bottom-14">
            <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage}}页</div>
            <div class="cds-float-right">
                <Page :total="page.totalCount"
                      :current="page.currentPage"
                      :page-size="page.pageSize"
                      show-sizer
                      size="small"
                      placement="top"
                      :page-size-opts="[10,20,50,100]"
                      @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
                      @on-page-size-change="getTableData({pageSize: $event})">
                </Page>
            </div>
        </div>
    </div>
      <!-- 新增 -->
      <AlarmOrder v-model="flag.add"
                      title="告警转工单"
                      :dataList="currentRow">
      </AlarmOrder>
      <!-- 修改 -->
      <AlarmEdit v-model="flag.update"
                      title="告警确认"
                      :dataList="currentRow">
      </AlarmEdit>

      <AlarmConfirm v-model="flag.conFirmBatch"
                 title="告警批量确认"
                 :dataList="this.alarmIds">
      </AlarmConfirm>


      <!-- 详情信息 -->
      <!--<h3c-modal-detail-->
        <!--title="主机资产详情"-->
        <!--label-width="140"-->
        <!--width="600"-->
        <!--:data="currentRow"-->
        <!--:rows="detailRows"-->
        <!--v-model="flag.info">-->
      <!--</h3c-modal-detail>-->
    </div>
</template>

<script>
const HostType = [
  {
    value: 0,
    label: '物理主机'
  },
  {
    value: 1,
    label: '云主机'
  }
]
import AlarmEdit from './components/AlarmEdit.vue';
import AlarmOrder from './components/AlarmOrder.vue';
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue';
import H3cModalDetail from '@/components/h3c-modal-detail/H3cModalDetail.vue';
import CountTo from 'vue-count-to';
import AlarmConfirm from './components/AlarmConfirm.vue';
    export default {
      name: "alarm-manage",
      components: {AlarmEdit,AlarmOrder,ModalConfirm,AlarmConfirm, H3cModalDetail, CountTo},
        data() {
            return {
                /**
                 * 搜索功能定义两个变量inputValue和searchValue
                 * 原因：当在输入框中输入值后没有点击查询按钮，然后进行分页等操作，此时应保留上次查询的值，所以定义两个变量区分开来
                 */
                statisticsData:{
                  allCount: 0,
                  abnormalCount: 0,
                  recoveredCount: 0
                },
                inputProjectName: '', //搜索框中显示的值
                inputKeywords: '', //模糊匹配的关键字
                inputAlarmId:'',
                alarmStatusCard:"",
                pickStartDate: '',
                pickEndDate: '',
                // searchValue: '', //实际点击查询按钮发送的值
                searchMap: {
                  projectName: "", // 项目名称
                  alarmId:'',
                  keywords: '',
                  policyStatus: 2,
                  alarmStatus: "",
                  startDate: "",  // 开始日期
                  endDate: ""    //结束日期
                },
                showUserMembers: false, // 删除权限弹框
                membersList:[], // 项目成员数据
                //分页
                page: {
                    pageSize: 20,   //每页条数
                    totalCount: 0,  //总数
                    totalPage: 1,   //总页数
                    currentPage: 1  //当前页码
                },
                //表格配置信息
                tableConfig: {
                    key: new Date().toString(), //表格的属性key
                    loading: false, //表格是否加载中
                    //表格列的配置描述
                    columns: [
                      {
                        type: 'selection',
                        width: 40,
                        align: 'center',
                      },
                      {
                        title: 'ID',
                        key: 'alarmId',
                        width: 60,
                        ellipsis: true,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.alarmId
                            }
                          }, params.row.alarmId);
                        }
                      },
                      {
                        title: '项目名称',
                        key: 'projectName',
                        ellipsis: true,
                        width: 100,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.projectName
                            }
                          }, params.row.projectName);
                        }
                      },
                      {
                        title: '资源',
                          key: 'alarmObject',
                        width: 150,
                        ellipsis: true,
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.alarmObject
                          }
                        }, params.row.alarmObject);
                      }
                      },

                      {
                        title: '告警等级',
                        key: 'level',
                        width: 68,
                        ellipsis: true,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.level
                            }
                          }, params.row.level);
                        }
                      },
                      {
                        title: '告警类型',
                          key: 'strategy',
                        width: 120,
                        ellipsis: true,
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.strategy
                          }
                        }, params.row.strategy);
                      }
                      },
                      {
                        title: '告警概要',
                          key: 'alarmOutline',
                        width: 200,
                        ellipsis: true,
                        render: (h, params) => {
                        let text = params.row.alarmOutline;
                        return h('span', {
                          attrs: {
                            title: params.row.alarmOutline
                          }
                        }, text);
                      }
                      },
                      {
                        title: '告警详情',
                          width: 305,
                          key: 'alarmMessage',
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.alarmMessage
                          }
                        }, params.row.alarmMessage);
                      }
                      },
                      {
                        title: '告警时间',
                          width: 135,
                        key: 'alarmTime',
                        ellipsis: true,
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.alarmTime
                          }
                        }, params.row.alarmTime);
                      }
                      },
                      {
                        title: '初次发生时间',
                          width: 135,
                          key: 'alarmFirstTime',
                        ellipsis: true,
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.alarmFirstTime
                          }
                        }, params.row.alarmFirstTime);
                      }
                      },{
                        title: '持续时长',
                          key: 'alarmDuration',
                          ellipsis: true,
                          width: 95,
                          render: (h, params) => {
                          let text=this.toHourMinute(params.row.alarmTime,params.row.alarmFirstTime)
                          return h('span', {
                            attrs: {
                              title: text
                            }
                          }, text);
                        }
                      },
                      {
                        title: '告警次数',
                          width:70,
                          key: 'alarmTimes',
                        ellipsis: true,
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.alarmTimes
                          }
                        }, params.row.alarmTimes);
                      }
                      },
                      {
                        title: '告警状态',
                          width:70,
                        key: 'alarmStatus',
                        ellipsis: true,
                        render: (h, params) => {
                          let text = params.row.alarmStatus;
                          let ploicytext = params.row.policyStatus;
                          let col="red";
                          if(text==0){
                            text="未恢复"
                          }else{
                            text="已恢复"
                            col="green"
                          }
                        return h('span', {
                          attrs: {
                            title: text
                          },
                          style: {
                            color: col
                          }
                        },text);
                      }

                      },
                      {
                        title: '屏蔽状态',
                          width:70,
                        key: 'policyStatus',
                        ellipsis: true,
                        render: (h, params) => {
                        let text = params.row.policyStatus;
                        let ploicytext = params.row.policyStatus;
                        let col="red";
                        if(text==1){
                          text="未屏蔽"
                        }else{
                          text="已屏蔽"
                          col="green"
                        }
                        return h('span', {
                          attrs: {
                            title: text
                          },
                          style: {
                            color: col
                          }
                        },text);
                      }

                      },


                      // {
                      //   title: '系统类型',
                      //   key: 'systemType',
                      //   sortable: 'custom',
                      //   ellipsis: true,
                      //   render: (h, params) => {
                      //     return h('span', {
                      //       attrs: {
                      //         title: params.row.systemType
                      //       }
                      //     }, params.row.systemType);
                      //   }
                      // },
                      //   {
                      //       title: '创建时间',
                      //       key: 'createTime',
                      //       ellipsis: true,
                      //     width: 160,
                      //       align: 'center',
                      //       sortable: 'custom',
                      //       render: (h, params) => {
                      //         let time = params.row.createTime
                      //         time = time.replace(/T/g, ' ')
                      //           return h('span', {
                      //               attrs: {
                      //                   title:time
                      //               }
                      //           }, time);
                      //       }
                      //   },
                      //    {
                      //       title: '告警确认',
                      //       width: 70,
                      //       align: 'center',
                      //       render: (h, params) => {
                      //         let confirm="";
                      //         let isicon=true;
                      //         let col ="";
                      //           if(params.row.confirmed==1){
                      //             isicon=false;
                      //             confirm="已确认"
                      //             col="#2dcb56";
                      //           }
                      //           return h('div', [
                      //                   h('i', {
                      //                       class: {
                      //                         'iconfont': isicon,
                      //                         'icon-plus': isicon
                      //                       },
                      //                       on: {
                      //                           click: () => {
                      //                               // 设置当前操作行
                      //                               this.currentRow = params.row;
                      //                               if(params.row.alarmStatus==1){
                      //                                 this.$Notice.error({
                      //                                   desc: '已恢复的告警不能确认！'
                      //                                 });
                      //                               }else{
                      //                                 if(params.row.confirmed==0){
                      //                                   this.flag.update = true;
                      //                                 }
                      //                               }
                      //
                      //
                      //                           }
                      //                       },
                      //                        style: {
                      //                          color: col
                      //                        }
                      //                   },confirm)
                      //               ]
                      //           )
                      //       }
                      //   },
                      //   {
                      //       title: '创建工单',
                      //       width: 70,
                      //       align: 'center',
                      //       render: (h, params) => {
                      //           let ordercontent="";
                      //           let isicon=true;
                      //           let col ="";
                      //           if(params.row.orderNo!=null){
                      //             isicon=false;
                      //             ordercontent="已创建";
                      //             col="#2dcb56";
                      //           }
                      //           return h('div', [
                      //               h('i', {
                      //                   class: {
                      //                       'iconfont': isicon,
                      //                       'icon-plus': isicon,
                      //
                      //                   },
                      //                   on: {
                      //                       click: () => {
                      //                           //设置当前操作行
                      //                           this.currentRow = params.row;
                      //                           if(params.row.orderNo==null) {
                      //                             if(params.row.confirmed==0&&params.row.alarmStatus==0){
                      //                               this.$Notice.warning({
                      //                                 desc: '请您先确认告警之后，再创建工单！'
                      //                               });
                      //                             }else{
                      //                               this.flag.add = true;
                      //                             }
                      //
                      //                           }else{
                      //                             window.open("http://opscloud.h3c.com/o/bk_itsm/#/ticket/detail?id="+params.row.orderNo.split("+")[0]+"&from=AllTicket");
                      //
                      //                           }
                      //                       }
                      //                   },
                      //                   style: {
                      //                     color:col,
                      //                     'cursor':'pointer'
                      //                   }
                      //               },ordercontent)
                      //           ])
                      //       }
                      //   }
                    ],
                    data: []  //表格中的数据
                },
                filterMap: {},  //表格筛选参数
                orderMap: {},   //表格排序参数
                alarmIds: [], //表格中选中的数据
                currentRow: {}, //表格中当前操作行
                //对话框标志位
                flag: {
                    add: false, //新增
                    delete: false,  //删除
                    conFirmBatch: false, // 批量确认
                    update: false, // 修改
                },
              //详情信息的标题配置信息
              detailRows: [
                {
                  title: '主机名称',
                  key: 'hostName'
                },
                {
                  title: 'IP地址',
                  key: 'ip'
                },
                {
                  title: '所属项目',
                  key: 'projectName'
                },
                {
                  title: 'CPU(核)',
                  key: 'cpu'
                },
                {
                  title: '内存(G)',
                  key: 'memory'
                },
                {
                  title: '主机状态',
                  key: 'status'
                },
                {
                  title: '主机型号',
                  key: 'deviceType'
                },
                {
                  title: '平台ID',
                  key: 'bkInstId'
                },
                {
                  title: '创建时间',
                  key: 'createTime',
                  render: (h, params) => {
                    let time = params.row.createTime
                    if (time) {
                      time = time.replace(/T/g, ' ')
                    }
                    return h('span', {
                      attrs: {
                        title:time
                      }
                    }, time);
                  }
                },
                {
                  title: '序列号',
                  key: 'sn'
                },
                {
                  title: '制造商',
                  key: 'company'
                }
              ],

            }
        },
        computed: {},
        methods: {
            //点击查询按钮触发
          handleSearch() {
            //将输入框中的值首尾去空格后赋值给查询字段searchValue
            this.searchMap.projectName = this.inputProjectName.trim();
            this.searchMap.keywords= this.inputKeywords.trim();
            this.searchMap.alarmId= this.inputAlarmId.trim();
            this.searchMap.startDate = this.pickStartDate;
            this.searchMap.alarmStatus = this.alarmStatusCard.trim();
            this.searchMap.endDate = this.pickEndDate;
            //请求表格数据：不显示缓冲状态，保留每页条数
            this.getTableData({
              loading: true,
              pageSize: this.page.pageSize
            });
          },
          //点击查询按钮触发
          cardSearch(alarmStatusCard) {
            //将输入框中的值首尾去空格后赋值给查询字段searchValue
            this.searchMap.projectName = this.inputProjectName.trim();
            this.searchMap.keywords= this.inputKeywords.trim();
            this.searchMap.alarmId= this.inputAlarmId.trim();
            this.searchMap.startDate = this.pickStartDate;
            if(alarmStatusCard==-1){
              this.searchMap.alarmStatus = '';
            }else{
              this.searchMap.alarmStatus = alarmStatusCard;
            }
            this.searchMap.endDate = this.pickEndDate;
            //请求表格数据：不显示缓冲状态，保留每页条数
            this.getCabTableData({
              loading: true,
              pageSize: this.page.pageSize
            });
            if(alarmStatusCard==-1){
              document.getElementById("clickclassL").style.background='#dbdbdb'
              document.getElementById("clickclassC").style.background='white'
              document.getElementById("clickclassR").style.background='white'
            }else if(alarmStatusCard==0){
              document.getElementById("clickclassL").style.background='white'
              document.getElementById("clickclassC").style.background='#f4516c'
              document.getElementById("clickclassR").style.background='white'
            }else{
              document.getElementById("clickclassL").style.background='white'
              document.getElementById("clickclassC").style.background='white'
              document.getElementById("clickclassR").style.background='#34bfa3'
            }

          },
            //点击下载
            handleExcel() {
              //   this.$http.post(`alarm/excel`).then(({data}) => {
              // })
              this.loading = true;
              this.$http({
                method: 'GET',
                url: `alarm/excel?projectName=`+this.searchMap.projectName+"&alarmStatus="+this.searchMap.alarmStatus+"&policyStatus="+this.searchMap.policyStatus+"&alarmId="+this.searchMap.alarmId+"&keywords="+this.searchMap.keywords+"&startDate="+this.searchMap.startDate+"&endDate="+this.searchMap.endDate,
                responseType: 'blob'
              }).then((res)=>{
              window.open(res.config.url)
              this.$Notice.success({
                desc: '告警数据导出成功！'
              });
              this.loading = true;
            })
            },
            // 修改开始日期
            startDateChange(startTime) {
              this.pickStartDate = startTime;
            },
            // 修改结束日期
            endDateChange(endTime) {
            console.log("!endTime",!endTime)
              if(!endTime){
                this.pickEndDate = this.getNowFormatDate();
              }else{
                this.pickEndDate = endTime;

              }

            },
            //点击刷新按钮触发dateUtil
            handleRefresh() {
              this.pickStartDate = this.getNowFormatDateBefore();
              this.pickEndDate = this.getNowFormatDate();
                //清空搜索输入框
                this.setInputEmpty();
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
          /**
           * @description 分页切换时触发的方法
           * @param {object} option
           * @param {number} option.current
           * @param {number} option.pageSize
           * @returns {void}
           */
          handlerChangePage({ current = 1, pageSize = 20 } = {}) {
            this.page.current = current;
            this.page.pageSize = pageSize;
            this.getTableData({pageSize: this.page.pageSize});
          },
            //清空搜索框
            setInputEmpty() {
              this.searchMap.projectName = this.inputProjectName = '';
              this.searchMap.alarmStatus = this.alarmStatusCard = '';
              this.searchMap.keywords= this.inputKeywords = '';
              this.searchMap.alarmId= this.inputAlarmId = '';
            },
            //表格选中项发生变化时触发
            selectionChange(selection) {
                //清空表格中选中的数据
                this.alarmIds = [];
                //重置选中项
                selection.forEach((item) => {
                    this.alarmIds.push(item.alarmId);
                });
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
            /**
             * 发送请求获取表格数据，并且做相应处理
             * @param loading {boolean} 表格缓冲，默认值为false
             * @param currentPage {number} 分页当前页，默认值为第一页
             * @param pageSize {number} 分页每页条数，默认值为每页10条
             */
            getTableData({loading = false, currentPage = 1, pageSize = 20} = {}) {
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
                this.alarmIds = [];
                this.searchMap.startDate = this.pickStartDate;
                this.searchMap.endDate = this.pickEndDate;
                //发送请求并且做相应处理
                this.$http.post(`alarm/page/list`, {
                    current: currentPage,
                    orderMap: this.orderMap,
                    pageSize: pageSize,
                    searchMap: {
                        // url: this.searchValue,     //不包含下拉框联动时的传参方式
                        ...this.searchMap, //包含下拉框联动时的传参方式
                        ...this.filterMap
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
                        this.getCountAlarm();
                    }

              //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
                    loading ? this.tableConfig.loading = false : '';
                })
            },
          /**
           * 发送请求获取表格数据，并且做相应处理
           * @param loading {boolean} 表格缓冲，默认值为false
           * @param currentPage {number} 分页当前页，默认值为第一页
           * @param pageSize {number} 分页每页条数，默认值为每页10条
           */
          getCabTableData({loading = false, currentPage = 1, pageSize = 20} = {}) {
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
            this.alarmIds = [];
            this.searchMap.startDate = this.pickStartDate;
            this.searchMap.endDate = this.pickEndDate;
            //发送请求并且做相应处理
            this.$http.post(`alarm/page/list`, {
              current: currentPage,
              orderMap: this.orderMap,
              pageSize: pageSize,
              searchMap: {
                // url: this.searchValue,     //不包含下拉框联动时的传参方式
                ...this.searchMap, //包含下拉框联动时的传参方式
              ...this.filterMap
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
              // this.getCountAlarm();
            }

            //如果设置了表格缓冲则需要关闭表格缓冲，未设置则不需要
            loading ? this.tableConfig.loading = false : '';
          })
          },

          submitSync(){
            this.$loading.show();
            this.$http.get(`host/sync`).then(({data}) => {
              //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
              if (data.status) {
                //删除成功后的提示信息
                this.$Notice.success({
                  desc: '同步主机资产成功'
                });
                this.getTableData({loading: true});
              } else {
                // 分配权限失败后的提示信息
                this.$Notice.error({
                  desc: data.message && data.message !== '' ? data.message : '导入主机资产数据失败。'
                });
              }
              this.$loading.hide();
            })
          },

          //查询未恢复告警数
          getCountAlarm(){
            this.$http.post(`alarm/getAlarmCount`,{
              searchMap: {
                // url: this.searchValue,     //不包含下拉框联动时的传参方式
                ...this.searchMap, //包含下拉框联动时的传参方式
              ...this.filterMap
            }
            }).then(({data}) => {
                if(data !="" && data != null){
                this.statisticsData.abnormalCount=data.abnormalCount;
                this.statisticsData.recoveredCount=data.recoveredCount;
                this.statisticsData.allCount=this.statisticsData.abnormalCount + this.statisticsData.recoveredCount
              }else{
              this.statisticsData.abnormalCount=0;
              this.statisticsData.recoveredCount=0;
              this.statisticsData.allCount=0;
            }
          });
          },
          getNowFormatDateBefore(){
              let date = new Date(),
                seperator1 = '-', //格式分隔符
                seperator2 = ':',
                year = date.getFullYear(), //获取完整的年份(4位)
                month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
                strDate = date.getDate() - 1, // 获取当前日(1-31)
                hours = date.getHours(),
                menutes = date.getMinutes(),
                seconds = date.getSeconds();
              if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
              if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0
              let currentdate = year + seperator1 + month + seperator1 + strDate +" "+ hours+ seperator2 +menutes+ seperator2+seconds;
              return currentdate
            },
          getNowFormatDate(){
            let date = new Date(),
              seperator1 = '-', //格式分隔符
              seperator2 = ':',
              year = date.getFullYear(), //获取完整的年份(4位)
              month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
              strDate = date.getDate(), // 获取当前日(1-31)
              hours = date.getHours(),
              menutes = date.getMinutes(),
              seconds = date.getSeconds();
            if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
            if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0
            let currentdate = year + seperator1 + month + seperator1 + strDate +" "+ hours+ seperator2 +menutes+ seperator2+seconds;
            return currentdate
          },
          toHourMinute(alarmTime,alarmFirstTime){
            var beginDate = new Date(alarmFirstTime);
            var endDate = new Date(alarmTime);
            var minutes=Math.floor((endDate - beginDate)/(1000 * 60));
            if(minutes>1440){
              return ((Math.floor(minutes/1440) + "天"+Math.floor((minutes/60)%24) + "小时" + (minutes%60) + "分" ));
            }else{
              return (Math.floor(minutes/60) + "小时" + (minutes%60) + "分" );
            }
          },

        },
        //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
        created() {
            this.pickStartDate = this.getNowFormatDateBefore();
            this.pickEndDate = this.getNowFormatDate();
            this.getTableData({loading: true});
            this.getCountAlarm();
        }


    }
</script>
<style>
  .d-bord{
    height: 110px;
    width: 250px;
    margin-bottom: 18px;
    color: #666;
    cursor: pointer;
    border-radius: 5px 4px 4px 40px rgb(0 0 0 / 7%);
    box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
    border-color: rgba(0,0,0,.05);
    float: left;
  }
  .l-bord{
    height: 80px;
    width: 80px;
    /*border: 1px solid #5EBBF7;*/
    margin-bottom: 8px;
    float: left;
    margin: 15px 15px 15px 15px;
  }

  .r-bord{
    height: 80px;
    width: 100px;
    margin-bottom: 8px;
    float: left;
    margin: 15px 15px 15px 15px;
  }
  .r-t-bord{
    height: 39px;
    width: 90px;
    clear: both;
    text-align:right;
    line-height: 18px;
    color: rgba(0,0,0,.45);
    font-size: 19px;
    font-weight: bold;
  }
  .r-b-bord{
    height: 39px;
    width: 90px;
    text-align:right;
    font-size: 20px;
    font-weight: bold;
  }

  .d-hover:hover{
    color: #fff !important;
    background: #dbdbdb !important;
  }
  .d-hover{
    color: #fff ;
    background: #dbdbdb ;
  }

  .l-hover:hover{
    color: #fff !important;
    background: #f4516c !important;
  }


  .r-hover:hover{
    color: #fff !important;
    background: #34bfa3 !important;
  }
  .alarmTable{
    table-layout: fixed;
  }
  .alarmTable tbody tr td div span{
    word-wrap:break-word;
    white-space:normal;
  }
</style>

<style scoped lang="less">
    .search-wrapper, .btn-wrapper {
        padding-bottom: 15px;
    }

    .page-wrapper {
        position: relative;
        margin-top: 12px;
    }

</style>


