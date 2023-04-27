home<template>
    <div class="cds-wrapper">
        <daily-report-table v-if="shouldShow.shouldTableShow" @shouldComponentShow="shouldComponentShow"></daily-report-table>
        <daily-report-preview v-if="shouldShow.shouldPreviewShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></daily-report-preview>
    </div>
</template>

<script>
import DailyReportTable from './DailyReportTable.vue'
import DailyReportPreview from './DailyReportPreview.vue'
export default {
    components:{
        'daily-report-table':DailyReportTable,
        'daily-report-preview': DailyReportPreview
    },
    data(){
        return {
            transferData:{},
            shouldShow: {
                shouldTableShow: false,
                shouldPreviewShow: false
            },
            shouldShowDuplicate: {
                shouldTableShow: false,
                shouldPreviewShow: false
            }
        }
    },
    methods:{
        shouldComponentShow(componentsName,data){
            this.transferData = data;
            Object.assign(this.shouldShow,this.shouldShowDuplicate,{[componentsName]:true})
        }
    },
    created(){
        this.shouldComponentShow('shouldTableShow');
    }

}
</script>

<style>

</style>
