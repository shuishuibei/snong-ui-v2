<template>
  <Modal
    v-model="visible"
    :scrollable="true"
    class-name="vertical-center-modal"
    class="project-management-add-plan"
    width="40"
    :title="title"
    :mask-closable="false">
    <div class="addplan-center" :class="{'plan-info':data.mode == 'planInfo'}">
        <div class="title-box">
            <span class="title-box-left">项目名称：<span class="projectName">{{data.projectName}}</span></span>
            <span>项目经理：{{data.managerName}}</span>
            <span class="title-box-right">
                <span style="vertical-align:top">项目进度：</span>
                <span v-if="data.mode !== 'planInfo'">
                    <InputNumber
                        :max="100"
                        :min="1"
                        v-model="projectProgress"
                        :formatter="value => `${value}%`"
                        :parser="value => value.replace('%', '')"
                        style="width: 40px">
                    </InputNumber>
                </span>
                <span v-else>{{projectProgress + '%'}}</span>
            </span>
        </div>
        <div class="table-box">
            <div class="plan-table">
                <!-- 上周计划任务 -->
                <Table ref="lastTwoWeeksPlanTaskTable"
                       size="small"
                       stripe
                       :columns="previousPlanTask.columns"
                       :data="previousPlanTask.data">
                </Table>
            </div>
            <div class="plan-table">
                <!-- 上周交付任务 -->
                <Table ref="table"
                       size="small"
                       stripe
                       :columns="completedTask.columns"
                       :data="completedTask.data">
                </Table>
            </div>
            <div class="plan-table">
                <!-- 后续计划任务 -->
                <Table ref="table"
                       size="small"
                       stripe
                       :columns="planTask.columns"
                       :data="planTask.data">
                </Table>
            </div>
        </div>
    </div>
    <div v-if="data.mode == 'planInfo'" slot="footer">
        <Button type="primary" @click.native="close">关闭</Button>
    </div>
    <div v-else slot="footer">
      <Button type="primary" @click.native="ok">保存</Button>
      <Button  @click="cancel" style="margin-left: 30px">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
    name: "project-management-add-plan",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object
        },
        title: {
            type: String,
            default: "添加计划"
        }
    },
    data() {
        return {
            visible: false, // 控制弹出框是否显示
            projectProgress: 0, // 项目进度
            previousPlanTask:{
                columns:[
                    {
                        title:'上周计划任务',
                        key: 'taskContent'

                    },
                    {
                        title:'任务责任人',
                        width: 120,
                        key: 'responsiblePerson'
                    }
                ],
                data:[]
            },
            completedTask:{
                columns:[
                    {
                        title: '序号',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            this.completedTask.data[params.index].orderFlag = params.index + 1;
                            return h('span', params.index + 1)
                        }
                    },
                    {
                        title:'上周交付任务',
                        key: 'taskContent',
                        render: (h, params) => {
                            return h('Input', {
                                type: "textarea",
                                row: "5",
                                props: {
                                    placeholder: '',
                                    value: params.row.taskContent
                                },
                                on:{
                                    'on-blur':(event) => {
                                        params.row.taskContent = event.target.value;
                                        this.completedTask.data[params.index] = params.row;
                                        this.completedTask.data[params.index].orderFlag = params.index + 1;
                                    }
                                },
                            })
                        }
                    },
                    {
                        title:'任务进度',
                        key: 'taskProgress',
                        width: 100,
                        render: (h, params) => {
                            return h('InputNumber', {
                                props: {
                                    value: params.row.taskProgress,
                                    min: 0,
                                    max: 100,
                                    formatter: function (value) {
                                        return `${value}%`
                                    },
                                    parser: function (value) {
                                        return value.replace('%', '')
                                    },
                                    editable: true
                                },
                                style: {
                                    width: '65px'
                                },
                                on:{
                                    'on-change':(value) => {
                                        params.row.taskProgress = value;
                                        this.completedTask.data[params.index] = params.row;
                                        this.completedTask.data[params.index].orderFlag = params.index + 1;
                                    }
                                },
                            })
                        }

                    },
                    {
                        title: '添加',
                        width: 64,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                    h('i', {
                                        style: {
                                            color: '#27b9f9',
                                        },
                                        class: 'iconfont icon-active icon-plus',
                                        on: {
                                            click: () => {
                                                this.completedTask.data.push(
                                                    {
                                                        taskContent: '',
                                                        taskProgress: 1
                                                    }
                                                );
                                            }
                                        }
                                    })
                                ]
                            )
                        }
                    },
                    {
                        title: '删除',
                        width: 64,
                        align: 'center',
                        render: (h, params) => {
                            let color = this.completedTask.data.length > 1 ? '#359CFF' : '#6e7589';
                            return h('div', [
                                h('i', {
                                    style: {
                                        color: color,
                                    },
                                    class: 'iconfont icon-shanchu icon-active',
                                    on: {
                                        click: () => {
                                            if (this.completedTask.data.length > 1) {
                                                this.completedTask.data.splice(params.index,1)
                                            }
                                        }
                                    }
                                })
                            ])
                        }
                    },
                ],
                data:[
                    {
                        taskContent: '',
                        taskProgress: 1
                    }
                ]
            },
            planTask:{
                columns:[
                    {
                        title: '序号',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            this.planTask.data[params.index].orderFlag = params.index + 1;
                            return h('span', params.index + 1)
                        }
                    },
                    {
                        title:'后续计划任务',
                        key: 'taskContent',
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    placeholder: '',
                                    value: params.row.taskContent
                                },
                                on:{
                                    'on-blur':(event) => {
                                        params.row.taskContent = event.target.value;
                                        this.planTask.data[params.index] = params.row;
                                        this.planTask.data[params.index].orderFlag = params.index + 1;
                                    }
                                },
                            })
                        }
                    },
                    {
                        title:'任务责任人',
                        width: 100,
                        key: 'responsiblePerson',
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    placeholder: '',
                                    value: params.row.responsiblePerson
                                },
                                on:{
                                    'on-blur':(event) => {
                                        params.row.responsiblePerson = event.target.value;
                                        this.planTask.data[params.index] = params.row;
                                        this.planTask.data[params.index].orderFlag = params.index + 1;
                                    }
                                },
                            })
                        }

                    },
                    {
                        title: '添加',
                        width: 64,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                    h('i', {
                                        style: {
                                            color: '#27b9f9',
                                        },
                                        class: 'iconfont icon-active icon-plus',
                                        on: {
                                            click: () => {
                                                this.planTask.data.push(
                                                    {
                                                        taskContent: '',
                                                        responsiblePerson: ''
                                                    }
                                                );
                                            }
                                        }
                                    })
                                ]
                            )
                        }
                    },
                    {
                        title: '删除',
                        width: 64,
                        align: 'center',
                        render: (h, params) => {
                            let color = this.planTask.data.length > 1 ? '#359CFF' : '#6e7589';
                            return h('div', [
                                h('i', {
                                    style: {
                                        color: color,
                                    },
                                    class: 'iconfont icon-shanchu icon-active',
                                    on: {
                                        click: () => {
                                            if (this.planTask.data.length > 1) {
                                                this.planTask.data.splice(params.index,1);
                                            }
                                        }
                                    }
                                })
                            ])
                        }
                    },
                ],
                data:[
                    {
                        taskContent: '',
                        responsiblePerson: ''
                    }
                ]
            },
            planId: ''
        };
  },
    methods: {
        // 获取上周计划任务
        getpreviousPlanTaskData(){
            this.$http({
                method:'GET',
                url:`/plan-management/addPlanPage/${this.data.id}`,
            }).then(({data})=>{
                if(data.status){
                    if (data.data) {
                        this.previousPlanTask.data = data.data;
                    } else {
                        this.previousPlanTask.data = [];
                    }
                }
            })
        },
        ok() {
            let existResponsiblePerson = this.planTask.data.every((item,index) => {
                return item.taskContent.length > 0 && item.responsiblePerson.length > 0;
            })
            if(existResponsiblePerson){
                this.$loading.show();
                if (this.data.mode == 'addPlan') {
                    // 添加计划
                    this.$http({
                        method: 'POST',
                        url: `/plan-management/add`,
                        data:{
                            projectId: this.data.id,
                            // projectId: this.data.projectId,
                            projectName: this.data.projectName,
                            projectProgress:this.projectProgress,
                            managerName: this.data.managerName,
                            createTime: this.data.createTime,
                            completedTask: this.completedTask.data,
                            planTask: this.planTask.data,
                            previousPlanId: '',

                        }
                    }).then(({data})=>{
                        if(data.status){
                            this.$Notice.success({
                                desc:'添加计划成功'
                            })
                            this.visible = false;
                            this.$parent.handleRefresh();
                        }
                        this.$loading.hide();
                    })
                } else {
                    // 修改计划
                    this.$http({
                        method: 'PUT',
                        url: `/plan-management/update`,
                        data:{
                            id:this.planId,
                            projectId: this.data.id,
                            projectName: this.data.projectName,
                            projectProgress:this.projectProgress,
                            managerName: this.data.managerName,
                            createTime: this.data.createTime,
                            completedTask: this.completedTask.data,
                            planTask: this.planTask.data,

                        }
                    }).then(({data})=>{
                        if(data.status){
                            this.$Notice.success({
                                desc:'修改计划成功'
                            })
                            this.visible = false;
                            this.$parent.handleRefresh();
                        }
                        this.$loading.hide();
                    })
                }
            } else {
                this.$Notice.warning({
                    desc: '请填写后续计划任务和任务责任人。若无后续计划任务，请填无。'
                })
            }


        },
        close(){
            // 关闭对话框
            this.visible = false;
        },
        cancel() {
            // 关闭对话框
            this.visible = false;
            // 表单清空
            this.$emit("on-cancel");
        }
    },
    watch: {
        value(newVal) {
            if (newVal) {
                /*=== 可修改 start ===*/
                if(this.data.mode == 'addPlan'){
                    // 添加计划时
                    this.projectProgress = Number(this.data.projectProgress); // 设置项目进度
                    this.getpreviousPlanTaskData(); // 获取上周计划任务
                    this.completedTask.data = [
                        {
                            taskContent: '',
                            taskProgress: 1
                        }
                    ];
                    this.planTask.data = [
                        {
                            taskContent: '',
                            responsiblePerson: ''
                        }
                    ];
                } else if(this.data.mode == 'planInfo') {
                    // 计划详情时
                    this.projectProgress = Number(this.data.projectProgress);
                    this.completedTask.columns = [
                        {
                            title:'上周交付任务',
                            key: 'taskContent'

                        },
                        {
                            title:'任务进度',
                            width: 120,
                            key: 'taskProgress',
                            render: (h, params) => {
                                return h('span', params.row.taskProgress + '%');
                            }
                        }
                    ];
                    this.planTask.columns = [
                        {
                            title:'后续计划任务',
                            key: 'taskContent'

                        },
                        {
                            title:'任务责任人',
                            width: 120,
                            key: 'responsiblePerson'
                        }
                    ];
                    this.$http({
                        method:'GET',
                        url: `/plan-management/get/${this.data.id}`
                    }).then(({data})=>{
                        if(data.status){
                            // 上周计划任务
                            if(data.data.previousPlanTask){
                                this.previousPlanTask.data = data.data.previousPlanTask;
                            } else {
                                this.previousPlanTask.data = [];
                            }
                            if(this.previousPlanTask.data.length){
                                this.previousPlanTask.data.forEach((item,index)=>{
                                    if(item.taskContent == null || item.taskContent.length == 0){
                                        this.previousPlanTask.data[index].taskContent = '无'
                                    }
                                    if(item.responsiblePerson == null || item.responsiblePerson.length == 0){
                                        this.previousPlanTask.data[index].responsiblePerson = '无'
                                    }
                                })
                            }
                            // 上周交付任务
                            this.completedTask.data = data.data.completedTask;
                            // 后续计划任务
                            this.planTask.data = data.data.planTask;

                        }
                    })
                } else {
                    // 修改计划
                    this.$http({
                        url:`/project-management/${this.data.id}`,
                        method: 'GET'
                    }).then(({data})=>{
                        if(data.status){
                            // 项目进度
                            this.projectProgress = Number(data.data.projectProgress);
                            // 上周计划任务
                            this.previousPlanTask.data = data.data.previousPlanTask;
                            // 上周交付任务
                            this.completedTask.data = data.data.completedTask;
                            data.data.completedTask.forEach((item,index) => {
                                this.completedTask.data[index].taskProgress = Number(item.taskProgress)
                            })
                            // 后续计划任务
                            this.planTask.data = data.data.planTask;
                            if(this.planTask.data.length > 0) {
                                this.planId = this.planTask.data[0].planId;
                            }
                        }
                    })
                }

                /*=== 可修改 end ===*/
                this.$Notice.destroy(); // 清楚右上角提示信息
                this.visible = newVal; // 显示对话框
            }
        },
        visible(newVal) {
            if (!newVal) {
                this.$emit("input", newVal);
            }
        }
    }
};
</script>

<style lang="less">
.plan-info {

}
</style>


<style lang="less" scoped>
.project-management-add-plan {
    .title-box {
        text-align: center;
        & > span {
            display: inline-block;
            height: 32px;
            line-height: 32px;
        }
        .title-box-left {
            float: left;
            .projectName{
                color: #3399FD;
            }
        }
        .title-box-right {
            float: right;
        }
    }
    .table-box {
        .plan-table {
            padding-top: 10px;
        }
    }
}

</style>
