<template>
    <div class="cds-wrapper cds-border cds-padding-14">
        <div >
            <!-- 搜索 -->
            <div class="cds-clearfix cds-margin-bottom-14">
              <!--<Input-->
                <!--clearable-->
                <!--v-model="inputAlarmId"-->
                <!--style="width: 6%"-->
                <!--placeholder="请输入告警ID"-->
                <!--@keyup.enter.native = "handleSearch"-->
              <!--&gt;-->
              <!--</Input>-->
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
                placeholder="请输入策略名称/资源/告警概要/告警详情"
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
              <!--<DatePicker type="datetime" placeholder="选择开始时间" style="width: 9.5%" :value="pickStartDate" format="yyyy-MM-dd HH:mm:ss" @on-change="startDateChange"></DatePicker>-->
              <!--&nbsp;&nbsp;至&nbsp;&nbsp;-->
              <!--<DatePicker type="datetime" placeholder="选择结束时间" style="width: 9.5%;margin-right: 6px; " :value="pickEndDate"  format="yyyy-MM-dd HH:mm:ss" @on-change="endDateChange"></DatePicker>-->
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
              <!--<i-button-->
                <!--type="primary"-->
                <!--@click="handleExcel">-->
                <!--<i class="iconfont icon-daochu">导出全部</i>-->
              <!--</i-button>-->
            <!-- 按钮操作 -->
          <!--<div class="cds-float-right">-->
            <i-button
              type="primary"
              @click="flag.add = true">
              <i class="iconfont icon-plus">新增策略</i>
            </i-button>
              <i-button
                type="primary"
                @click="handleExcel">
                <i class="iconfont icon-daochu">导出全部</i>
              </i-button>
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
            <!--<i-button-->
              <!--class="cds-btn-refresh"-->
              <!--type="primary"-->
              <!--@click="handleRefresh">-->
              <!--<i class="iconfont icon-shuaxin1"></i>-->
            <!--</i-button>-->
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
      <AlarmPolicyAdd v-model="flag.add"
                      title="告警收敛策略新增"
                      :dataList="{add: true}">
      </AlarmPolicyAdd>
      <!-- 修改 -->
      <AlarmPolicyAdd v-model="flag.update"
                      title="告警收敛策略修改"
                      :dataList="currentRow">
      </AlarmPolicyAdd>

      <AlarmConfirm v-model="flag.conFirmBatch"
                 title="告警批量确认"
                 :dataList="this.alarmIds">
      </AlarmConfirm>

      <ModalConfirm ref="deleteSingle"
                    v-model="flag.delete"
                    title="告警收敛策略"
                    :info="'确认删除：这条告警收敛策略吗？'"
                    @on-cancel="deleteIds = []"
                    @on-ok="submitDelete"
                    :showBackgroudColor="false">
      </ModalConfirm>


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
import AlarmPolicyAdd from './components/AlarmPolicyAdd.vue';
import ModalConfirm from '@/components/modal-confirm/ModalConfirmTemp.vue';
import H3cModalDetail from '@/components/h3c-modal-detail/H3cModalDetail.vue';
import CountTo from 'vue-count-to';
import AlarmConfirm from './components/AlarmConfirm.vue';
    export default {
      name: "alarm-manage",
      components: {AlarmEdit,AlarmPolicyAdd,ModalConfirm,AlarmConfirm, H3cModalDetail, CountTo},
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
                deleteIds: [],
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
                        key: 'Id',
                        width: 60,
                        ellipsis: true,
                        render: (h, params) => {
                          return h('span', {
                            attrs: {
                              title: params.row.id
                            }
                          }, params.row.id);
                        }
                      },
                    {
                      title: '策略名称',
                        key: 'policyName',
                      width: 120,
                      ellipsis: true,
                      render: (h, params) => {
                      return h('span', {
                        attrs: {
                          title: params.row.policyName
                        }
                      }, params.row.policyName);
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
                        title: '告警概要',
                          key: 'alarmOutline',
                        width: 150,
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
                          width: 193,
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
                        title: '策略状态',
                          width: 80,
                        key: 'status',
                        render: (h, params) => {
                        let text = params.row.status;
                        let col="red";
                        console.log(text)
                        if(text==0){
                          text="失效"
                        }else{
                          text="正常"
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
                        title: '策略生效时间',
                          width: 140,
                        key: 'effectStartdate',
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.effectStartdate
                          }
                        }, params.row.effectStartdate);
                      }
                      },
                      {
                        title: '策略结束时间',
                          width: 140,
                        key: 'effectEnddate',
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.effectEnddate
                          }
                        }, params.row.effectEnddate);
                      }
                      },
                      {
                        title: '创建人',
                          width: 80,
                        key: 'creator',
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.creator
                          }
                        }, params.row.creator);
                      }
                      },
                      {
                        title: '创建时间',
                          width: 140,
                        key: 'createTime',
                        render: (h, params) => {
                        return h('span', {
                          attrs: {
                            title: params.row.createTime
                          }
                        }, params.row.createTime);
                      }
                      },
                      {
                        title: '收敛数量',
                          width: 80,
                        key: 'policyNum',
                        render: (h, params) => {
                          let text = params.row.policyNum;
                          if(!text){
                            text=0;
                          }
                        return h('span', {
                          attrs: {
                            title: params.row.policyNum
                          }
                        }, text);
                      }
                      },
                     {
                        title: '修改',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                    h('i', {
                                        class: {
                                            'iconfont': true,
                                            'icon-edit-1-copy': true
                                        },
                                        on: {
                                            click: () => {
                                                // 设置当前操作行
                                                this.currentRow = params.row;
                                                this.flag.update = true;
                                            }
                                        }
                                    })
                                ]
                            )
                        }
                    },
                    {
                        title: '删除',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('i', {
                                    class: {
                                        'iconfont': true,
                                        'icon-shanchu': true
                                    },
                                    on: {
                                        click: () => {
                                            //设置当前操作行
                                            this.currentRow = params.row;
                                            this.deleteIds = [params.row.id];
                                            this.flag.delete = true;
                                        }
                                    }
                                })
                            ])
                        }
                    }
                      // {
                      //   title: '更新时间',
                      //     width: 140,
                      //   key: 'updateTime',
                      //   render: (h, params) => {
                      //   return h('span', {
                      //     attrs: {
                      //       title: params.row.updateTime
                      //     }
                      //   }, params.row.updateTime);
                      // }
                      // },
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
                this.$http.post(`alarm/policy/page/list`, {
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
          //提交删除
          submitDelete() {
            this.$http.post(`alarm/policy/delete`,
              this.deleteIds
            ).then(({data}) => {
              //删除成功后需要重新获取数据，表格显示缓冲，定位到第一页（操作失败不作处理，已在入口文件做了统一处理）
              if (data.status) {
              //删除成功后的提示信息
              this.$Notice.success({
                desc: '删除告警策略成功'
              });
              this.getTableData({loading: true});
            } else {
              this.$Notice.error({
                desc: '删除告警策略失败！'
              });
            }
          })
          },
          //点击下载
          handleExcel() {
            //   this.$http.post(`alarm/excel`).then(({data}) => {
            // })
            this.loading = true;
            this.$http({
              method: 'GET',
              url: "alarm/policy/excel",
              responseType: 'blob'
            }).then((res)=>{
              window.open(res.config.url)
              this.$Notice.success({
                desc: '告警数据导出成功！'
              });
              this.loading = true;
            })
          },



        },


        //Vue实例创建生命周期函数，在这里请求页面创建时需要的数据
        created() {
            this.pickStartDate = this.getNowFormatDateBefore();
            this.pickEndDate = this.getNowFormatDate();
            this.getTableData({loading: true});
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


