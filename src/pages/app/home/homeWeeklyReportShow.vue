<template>
    <div class="weekly-report-preview">
        <div v-if="data.length > 0">
            <div v-for="(item,index) in data" class="weekly-report-box" :ref="item.userName">
                <div class="user-box">
                    <i class="iconfont icon-username"></i>
                    <span :id="item.userName">{{item.userName}}</span>
                </div>
                <weekly-report :transProgress="item.reportProject" :transStudy="item.reportStudy"></weekly-report>
            </div>
        </div>
        <div class="data-null" v-else>
            暂无数据
        </div>
    </div>
</template>

<script>
import weeklyReport from '@/components/weekly-report/weeklyReport.vue';

export default {
    data(){
        return {
            data: [],
            progress:[
                {
                    id: '',
                    projectJSON: '',
                    projectId: '', // 项目ID
                    projectName: '', // 项目名称
                    managerName: '', // 项目经理名称
                    managerId: '', // 项目经理ID
                    weekProgress: '', // 本周进展
                    projectProgress: '', // 整体进度
                    projectRisk: '', // 项目风险
                    nextWeekPlan: '', // 下周计划
                }
            ],
            study: [
                {
                    id: '',
                    studyContent: '', // 学习简介
                    studyFeelings: '', // 心得体会
                }
            ],
        }
    },
    components:{
        'weekly-report':weeklyReport
    },
    methods:{
        getWeeklyReport(){
            this.$http({
                method: 'GET',
                url: `/overview/weekly/list`
            }).then(({data})=>{
                if(data.status){
                    this.data = data.data
                }
            })
        }
    },
    created(){
        this.getWeeklyReport();
    }
}
</script>

<style lang="less" scoped>
@import url("../personal-report/weekly-report/weekly-report-personal/WeeklyReportPreview.less");

.weekly-report-preview {
    height: calc(~"100% - 155px");
    .weekly-report-box {
        background-color: #FFF;
        border: 1px solid #D8DCE5;
        padding: 0 15px 15px 15px;
        padding-bottom: 0;
        margin-bottom: 10px;
        .user-box {
            margin-top: 0;
        }
    }
    .data-null {
        margin-top: 5px;
        padding-top: 10px;
        font-size: 14px;
        text-align: center;
        background-color: #FFF;
        border: 1px solid #D8DCE5;
        height: 100%;
    }
}

</style>

<style lang="less">


</style>
