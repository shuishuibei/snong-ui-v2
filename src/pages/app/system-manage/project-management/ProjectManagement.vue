<template>
    <div style="width:100%;height:100%">
        <project-management-table v-show="shouldShow.shouldTableShow" @shouldComponentShow="shouldComponentShow" ref="projectManagementTable"></project-management-table>
        <project-management-edit v-if="shouldShow.shouldEditShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></project-management-edit>
        <project-management-basic-info v-if="shouldShow.shouldBasicInfoShow" @shouldComponentShow="shouldComponentShow" :data="transferData"></project-management-basic-info>
    </div>
</template>

<script>
import ProjectManagementTable from './ProjectManagementTable.vue' // 表格页面
import ProjectManagementEdit from './ProjectManagementEdit.vue' // 添加页面
import ProjectManagementBasicInfo from './ProjectManagementBasicInfo.vue' // 基本信息页面
export default {
    components:{
        'project-management-table': ProjectManagementTable,
        'project-management-edit': ProjectManagementEdit,
        'project-management-basic-info':ProjectManagementBasicInfo
    },
    data(){
        return {
            transferData:{},
            shouldShow: {
                shouldTableShow: false,
                shouldEditShow: false,
                shouldBasicInfoShow: false
            },
            shouldShowDuplicate: {
                shouldTableShow: false,
                shouldEditShow: false,
                shouldBasicInfoShow: false
            }
        }
    },
    methods:{
        shouldComponentShow(componentsName,data){
            this.transferData = data;
            Object.assign(this.shouldShow,this.shouldShowDuplicate,{[componentsName]:true})
            if(data === 'refreshTable'){
                this.$refs['projectManagementTable'].handleRefresh();
            }
        }
    },
    created(){
        this.shouldComponentShow('shouldTableShow');
    }

}
</script>

<style>

</style>
