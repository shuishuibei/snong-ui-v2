<template>
    <div class="daily-report-preview">
        <div class="drp-header">
            <span style="margin-right:5px;">请选择项目</span>
            <Select v-model="projectId" style="width: 230px;" @on-change="projectChange" filterable clearable>
                <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
            </Select>
            <div class="drph-right">
                <span style="margin-right:5px;">请选择日期</span>
                <DatePicker type="date" :value="reportDate" placeholder="选择日期" style="width: 160px" format="yyyy-MM-dd" @on-change="reportDateChange" placement="bottom-end"></DatePicker>
            </div>
        </div>
        <div v-if="data.length > 0">
            <div v-for="(item,index) in data" :key="index">
                <div class="drp-content">
                    <div class="progress center">
                        <div class="progress-title center-title">
                            <span>{{item.userName}}</span>&nbsp;&nbsp;
                        </div>
                        <div class="progress-bottom">
                            <div class="pb-box">
                                <div class="pb-box-title">
                                    <span>昨日计划</span>
                                </div>
                                <Input type="textarea" :value="item.yesterdayWork" :rows="7" :disabled="true" @on-change="textareaChange"/>
                            </div>
                            <div class="pb-box">
                                <div class="pb-box-title">
                                    <span>今日计划</span>
                                </div>
                                <Input type="textarea" :value="item.todayWorkPlan" :rows="7" :disabled="true" @on-change="textareaChange"/>
                            </div>
                            <div class="pb-box">
                                <div class="pb-box-title">
                                    <span>问题及原因</span>
                                </div>
                                <Input type="textarea" :value="item.problem" :rows="7" :disabled="true" @on-change="textareaChange"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="data-null" v-else>
            暂无数据
        </div>
        <div class="footer">
            <div class="footer-button">
                <Button type="primary" @click="closeReport">关闭</Button>
            </div>
        </div>
    </div>
</template>

<script>
import {dataFormat} from '@/assets/js/format.js';
export default {
    data(){
        return {
            projectList: [], // 项目列表
            projectId: '', // 项目ID
            reportDate: '', // 日报日期
            data: [], // 周报数据
        }
    },
    methods:{
        // 设置textarea高度
        textareaChange(event){
            /* setTimeout(()=>{
                let clientHeight = event.target.clientHeight;
                Array.from(event.target.parentElement.parentElement.parentElement.children).forEach((item)=>{
                    item.children[1].children[0].style.height = clientHeight + 'px';
                })
            },50) */
        },
        // 获取项目列表
        getProjectList(){
            this.$http({
                method:'GET',
                url:'/project-management/listAll'
            }).then(({data})=>{
                if(data.status){
                    this.projectList = data.data;
                    this.projectId = this.projectList[0].id;
                    this.getPreviewData();
                }
            })
        },
        // 项目切换时
        projectChange(){
            this.getPreviewData();
        },
        // 修改日报日期
        reportDateChange(reportTime){
            this.reportDate = reportTime;
            this.getPreviewData();
        },
        // 获取预览数据
        getPreviewData(){
            this.$http({
                method:'GET',
                url: `daily-report/list?projectId=${this.projectId}&reportDate=${this.reportDate}`
            }).then(({data})=>{
                if(data.status){
                    this.data = data.data;
                }
            })
        },
        closeReport(){
            this.$emit('shouldComponentShow','shouldTableShow');
        }
    },
    mounted(){
        // 获取项目列表
        this.getProjectList();
        // 设置日报日期
        let today = dataFormat(new Date(), '-').substr(0,10);
        this.reportDate = today;
    }
}
</script>

<style lang="less">
.daily-report-preview {

    .drp-content {
        .progress{
            .pb-box{
                .ivu-input-wrapper {
                    width: 95%;
                    margin-left: 5%;
                }
                .ivu-input {
                    border: none !important;
                    resize:none
                }
                .ivu-input:hover{
                    border: none !important;
                }
                textarea:focus {
                    outline: none;
                    box-shadow: none;
                }
            }
        }
    }
}
</style>


<style lang="less" scoped>
.daily-report-preview {
    .drp-header {
        box-sizing: content-box;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #339AFF;
        padding-bottom: 10px;
        border-bottom: 1px solid #E3E8EE;
        position: relative;
        i {
            display: inline-block;
            width: 24px;
            height: 24px;
            background-color: #339AFF;
            border-radius: 50%;
            color: #FFFDFF;
            font-size: 12px;
            position: relative;
            vertical-align: middle;
            margin-right: 5px;
            &::before {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
        }
        & > span {
            vertical-align: middle;
        }
        .drph-right {
            float: left;
            padding-right: 20px;
            // position: absolute;
            // right: 100px;
            // top: 0;
        }
    }
    .drp-content {
        margin: 10px 0px;
        .center {
            border: 1px solid #DADBDF;
            margin-bottom: 10px;
            .center-title{
                height: 40px;
                line-height: 40px;
                background-color: #E6F1F7;
                padding-left: 8px;
                font-size: 14px;
                color: #64707C;
                .icon-common {
                    display: inline-block;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    vertical-align: middle;
                    margin: 0 2px;
                    position: relative;
                    background-color: #2B99FF;
                    cursor: pointer;
                    &::before{
                        color: #FFFCF6;
                        font-size: 12px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                    }
                }
            }
        }
        .progress {
            .progress-title {
                .deleteBgc {
                    background-color: #BFC7D2;
                }
            }
            .progress-bottom {
                // height: 230px;
                .pb-box:nth-last-of-type(1){
                    margin-right: 1.2%;
                }
                .pb-box {
                    box-sizing: border-box;
                    display: inline-block;
                    min-height: 135px;
                    max-height: 190px;
                    border: 1px solid #DADBDF;
                    border-radius: 3px;
                    width: 31.5%;
                    margin-left: 1.2%;
                    margin-top: 20px;
                    margin-bottom: 20px;
                    position: relative;
                    .pb-box-title {
                        width: 5%;
                        height: 100%;
                        background-color: #E6F1F7;
                        position: absolute;
                        span {
                            display: inline-block;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            color: #64707C;
                        }
                    }
                }
            }
        }
    }
    .data-null {
        margin-top: 20px;
        font-size: 14px;
        text-align: center;
    }
    .footer {
        height: 80px;
        background-color:#f5f8fd;
        box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.2);
        border-top: 2px solid rgba(0, 0, 0, 0.2);
        position: fixed;
        bottom: 0;
        right: 10px;
        width: calc(~"100% - 261px");
        .footer-button {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(-50%, -50%);
            .cancel {
                margin-left: 8px;
            }
        }
    }
}
</style>

