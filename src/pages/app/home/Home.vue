<template>
    <div style="width: 100%; height: 100%; ">
<!--        <home-weekly-report-date></home-weekly-report-date>-->
        <home-personnel v-show="shouldShow.personnel" ref="homePersonnel"></home-personnel>

<!--        <home-project v-show="shouldShow.project" ref="homeProject"></home-project>-->
<!--        <float-tool class="float-tool" @shouldComponentShow="shouldComponentShow"></float-tool>-->
    </div>
</template>

<script>
import homeWeeklyReportDate from './homeWeeklyReportDate.vue' // 引入周报日期组件
import homePersonnel from './homePersonnel.vue'
import homeProject from './homeProject.vue'
import FloatTool from './FloatTool.vue'
export default {
    components:{
        // 'home-weekly-report-date': homeWeeklyReportDate,
        'home-personnel': homePersonnel,
        // 'home-project': homeProject,
        // 'float-tool': FloatTool,
    },
    data(){
        return {
            shouldShow:{
                personnel: false,
                project: false
            },
            shouldShowDuplicate: {
                personnel: false,
                project: false
            }
        }
    },
    methods: {
        shouldComponentShow(componentsName){
            Object.assign(this.shouldShow,this.shouldShowDuplicate,{[componentsName]:true})
        }
    },
    created(){
        this.shouldComponentShow('personnel');
    }
}
</script>

<style scoped lang="less">
    .float-tool {
        position: fixed;
        top:50%;
        right: 30px;
        z-index: 3;
    }
</style>


