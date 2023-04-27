<template>
    <div class="weekly-report-component">
        <h3 class="title">
            个人周报汇报
        </h3>
        <div v-for="(item,index) in progress">
            <weeklyReportProgress :item="item"></weeklyReportProgress>
        </div>
        <div v-if="study.length > 0">
            <h3 class="title">
                能力提升汇报
            </h3>
            <div v-for="(item,index) in study">
                <div class="study center">
                    <div class="study-title center-title">
                        <span>标题：{{item.studyContent}}</span>
                        
                    </div>
                    <div class="study-bottom">
                        <span>内容：</span>
                        <Input type="textarea" v-model="item.studyFeelings" :rows="4" :disabled="true" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import weeklyReportProgress from './weeklyReportProgress.vue'; // 引入周报组件
export default {
    components: {
        weeklyReportProgress
    },
    props: {
        transProgress:{
            type: Array,
            default: []
        },
        transStudy: {
            type: Array,
            default: []
        },
    },
    data(){
        return {
            progress:[], // 项目进展汇报列表
            study: [], // 自我学习汇报列表
        }
    },
    methods:{

    },
    mounted(){
        this.progress = this.transProgress;
        this.study = this.transStudy;
    },
    watch:{
        
    }
}
</script>
<style lang="less">
@import url("./weeklyReportGlobal.less");
</style>

<style lang="less" scoped>
@import url("./weeklyReport.less");
    
</style>

