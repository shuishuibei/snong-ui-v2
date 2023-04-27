<template>
    <div class="home-bottom-box" ref="homeBottomBox">
<!--        <home-weekly-people-counting type="personnel"></home-weekly-people-counting>-->
        <app-list></app-list>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">巡检节点统计[{{currentDate}}]</span>
        </div>
        <div>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">CAS巡检统计</div>
              <div class="content">
                <el-progress type="dashboard"  :percentage="data.cas.rate" />
              </div>
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  总节点：{{ data.cas.total }}
                </div>
                <div style="padding: 3px">
                  成功节点：{{ data.cas.success }}
                </div>
              </div>
              <div class="footer">{{ data.cas.success }} / {{ data.cas.total }}</div>
            </el-tooltip>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">CloudOS巡检统计</div>
              <div class="content">
                <el-progress type="dashboard"  :percentage="data.cloudos.rate" />
              </div>
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  总节点：{{ data.cloudos.total }}
                </div>
                <div style="padding: 3px">
                  成功节点：{{ data.cloudos.success }}
                </div>
              </div>
              <div class="footer">{{ data.cloudos.success }} / {{ data.cloudos.total }}</div>
            </el-tooltip>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">ONEStor巡检统计</div>
              <div class="content">
                <el-progress type="dashboard"  :percentage="data.onestor.rate" />
              </div>
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  总节点：{{ data.onestor.total }}
                </div>
                <div style="padding: 3px">
                  成功节点：{{ data.onestor.success }}
                </div>
              </div>
              <div class="footer">{{ data.onestor.success }} / {{ data.onestor.total }}</div>
            </el-tooltip>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">UIS巡检统计</div>
            <div class="content">
                <div class="content">
                  <el-progress type="dashboard" :percentage="data.uis.rate" />
                </div>
            </div>
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px;">
                  总节点：{{ data.uis.total }}
                </div>
                <div style="padding: 3px">
                  成功节点：{{ data.uis.success }}
                </div>
              </div>
              <div class="footer">{{ data.uis.success }} / {{ data.uis.total }}</div>
            </el-tooltip>
          </el-col>
        </div>
      </el-card>
<!--        <home-weekly-report-show></home-weekly-report-show>-->
    </div>
</template>

<script>
import homeWeeklyPeopleCounting from './homeWeeklyPeopleCounting.vue'
import appList from "./components/appList.vue";
import inspectionCount from "./components/inspectionCount.vue";
import H3cTitle from '@/components/h3c-title/H3cTitle.vue';
// import homeWeeklyReportShow from './homeWeeklyReportShow.vue' // 引入周报展示组件
export default {
    components:{
        // 'home-weekly-people-counting': homeWeeklyPeopleCounting,
        'app-list': appList,
        'inspection-count':inspectionCount
        // 'home-weekly-report-show': homeWeeklyReportShow
    },
    data() {
      return {
        currentDate: this.$moment().format('YYYY-MM-DD'),
        monitor: null,
        data:{cas:{
            total: 0,
            success: 0,
            rate: 0
          },cloudos:{
            total: 0,
            success: 0,
            rate: 0
          },onestor:{
            total: 0,
            success: 0,
            rate:0
          },uis:{
            total: 0,
            success: 0,
            rate: 0
          }}
      }
    },
    created() {
      this.init()
      // this.monitor = window.setInterval(() => {
      //   setTimeout(() => {
      //     this.init()
      //   }, 2)
      // }, 3500)
    },
    destroyed() {
      clearInterval(this.monitor)
    },
    methods: {
      init() {
        this.$http({
          method: 'GET',
          url: `/inspection/node/home/count`
        }).then(({data}) => {
          if (data.status) {
            if (Object.keys(data.data).length !== 0) {
              this.data = data.data;
            }
          }
        })
      },
      rateCompute(t, u) {
        if (t === 0) {
          return 0;
        } else {
          return parseFloat((u / t).toFixed(2) * 100);
        }
      }
    }
}
</script>

<style lang="less" scoped>
::v-deep .box-card {
  margin-top: 5px;
  margin-bottom: 5px;
  .title {
    font-weight: bold;
    color: #666;
    font-size: 15px
  }
  span {
    position: relative;
    width: 100%;
    padding: 14px 0 14px 5px;
    line-height: 15px;
    height: 43px;
    box-sizing: border-box;
    background: #fff;
    &:before {
      position: absolute;
      background-color: #ff0042;
      content: '';
      width: 3px;
      height: 15px;
      margin-left: -5px;
      left: 0;
      top: 48%;
      transform: translateY(-50%);
    }
  }
  .el-icon-refresh {
    margin-right: 10px;
    float: right;
    cursor:pointer;
  }
}
.cpu, .memory, .swap, .disk  {
  width: 20%;
  float: left;
  padding-bottom: 20px;
  margin-right: 5%;
}
.title {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #3b3a3a;
  margin-bottom: 16px;
}
.footer {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #999;
  margin-top: -5px;
  margin-bottom: 10px;
}
.content {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
}
.home-bottom-box {
    height: calc(~"100% - 50px");
    overflow-y:auto;
}
</style>
