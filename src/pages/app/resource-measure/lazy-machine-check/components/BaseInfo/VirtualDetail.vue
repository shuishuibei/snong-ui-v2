<!--
 * @Description: 僵尸机监测详情页面
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:35
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-16 17:39:33
 -->
<template>
    <div>
        <i-row class="virtual-detail-container cds-wrapper">
            <i-row :gutter="16" class="virtual-detail-row">
                <i-col :lg="8" :md="24" class="virtual-detail-left" ref="dynamic-height">
                <div class="base-info">
                    <h3 class="base-info-title title-line">基本信息</h3>
                    <ul class="base-info-list info-list">
                        <li>
                            <div class="base-info-list-left">名称 :</div>
                            <div class="base-info-list-right" :title="info.serverName || info.name">{{info.serverName || info.name}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">ID :</div>
                            <div class="base-info-list-right" :title="info.id">{{info.id}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">状态 :</div>
                            <div class="base-info-list-right" :title="statusText">
                                <div class="statusCircle" :style="{backgroundColor: color}"></div>
                                <span :style="{marginLeft: '6px', color: color}">{{statusText}}</span>
                            </div>
                        </li>
                        <li>
                            <div class="base-info-list-left">初始密码 :</div>
                            <div class="base-info-list-right password-top">
                                <div v-if="!showPwd" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                    {{info.password}}
                                </div>
                                <div v-if="showPwd" style="height:100%">
                                    <div class="black-ball"></div>
                                    <div class="black-ball"></div>
                                    <div class="black-ball"></div>
                                    <div class="black-ball"></div>
                                    <div class="black-ball"></div>
                                    <div class="black-ball"></div>
                                </div>
                                <div @click="showPwd = !showPwd" style="cursor: pointer;margin-left: 5px">
                                    <i class="iconfont icon-xianshikejian" v-if="!showPwd"></i>
                                    <i class="iconfont icon-yincangbukejian" v-if="showPwd"></i>
                                </div>
                            </div>
                        </li>
                        <li v-if="baseInfo.type === 'X86'">
                            <div class="base-info-list-left">虚拟化类型 :</div>
                            <div class="base-info-list-right">{{info.virtType}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">创建时间 :</div>
                            <div class="base-info-list-right">{{info.createDate}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">结束时间 :</div>
                            <div class="base-info-list-right">{{info.endDate || info.tenancy}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">描述 :</div>
                            <div class="base-info-list-right" :title="info.description">{{info.description}}</div>
                        </li>
                    </ul>
                </div>
                <div class="lease-info">
                    <h3 class="lease-info-title title-line">配置信息</h3>
                    <ul class="lease-info-list info-list">
                        <li>
                            <div class="lease-info-list-left">镜像 :</div>
                            <div class="lease-info-list-right">{{info.imageName}}</div>
                        </li>
                        <li>
                            <div class="lease-info-list-left">CPU :</div>
                            <div class="lease-info-list-right">{{info.cpu}}</div>
                        </li>
                        <li>
                            <div class="lease-info-list-left">内存(G) :</div>
                            <div class="lease-info-list-right">{{info.memory || info.memroy}}</div>
                        </li>
                        <li v-if="baseInfo.type === 'X86'">
                            <div class="lease-info-list-left">存储规格 :</div>
                            <div class="lease-info-list-right">{{info.storageType}}</div>
                        </li>
                        <li>
                            <div class="lease-info-list-left">系统盘(G) :</div>
                            <div class="lease-info-list-right">{{info.storage}}</div>
                        </li>
                        <li>
                        </li>
                    </ul>
                </div>
                </i-col>
                <i-col :lg="16" :md="24" class="virtual-detail-right">
                    <div class="virtual-detail-right-tab">
                        <i-tabs :animated="false" @on-click="changeTimer">
                            <i-tab-pane label="最近8小时" name="过去八小时"></i-tab-pane>
                            <i-tab-pane label="最近一周" name="过去一周"></i-tab-pane>
                            <i-tab-pane label="最近一月" name="过去一月"></i-tab-pane>
                        </i-tabs>
                        <div class="chart-container">
                            <div class="chart-bar cds-clearfix">
                                <div class="cds-float-left">
                                    <ve-rect-coordinate
                                            id="cpuUsage"
                                            :color="['#3299fe']"
                                            :x-axis-data="cpuxAxis"
                                            :cover-option="getCoverOption('CPU利用率','#3299fe','%')"
                                            background-color="#f6f7f9">
                                        <ve-line symbol="rect"
                                                start-gradient
                                                :data="cpuData"
                                                :linear-gradient="getLinerGradient('rgba(51,154,255,1)','rgba(51,154,255,0.3)','rgba(51,154,255,0)')"></ve-line>
                                    </ve-rect-coordinate>
                                </div>
                                <div class="cds-float-left">
                                    <ve-rect-coordinate
                                            id="memoryUsage"
                                            :color="['#01cd65']"
                                            :x-axis-data="memoryxAxis"
                                            :cover-option="getCoverOption('内存利用率','#01cd65','%')"
                                            background-color="#f6f7f9">
                                        <ve-line symbol="rect"
                                                start-gradient
                                                :data="memoryData"
                                                :linear-gradient="getLinerGradient('rgba(0,205,100,1)','rgba(0,205,100,0.3)','rgba(0,205,100,0)')">
                                        </ve-line>
                                    </ve-rect-coordinate>
                                </div>
                            </div>
                            <div class="chart-bar cds-clearfix">
                                <div class="cds-float-left">
                                    <ve-rect-coordinate
                                            id="diskRead"
                                            :color="['#fe9901']"
                                            :x-axis-data="diskReadxAxis"
                                            :cover-option="getCoverOption('磁盘读取速率', '#fe9901','b/s')"
                                            background-color="#f6f7f9">
                                        <ve-line symbol="rect"
                                                start-gradient
                                                :data="diskReadData"
                                                :linear-gradient="getLinerGradient('rgba(254,153,1,1)','rgba(254,153,1,.4)','rgba(254,153,1,0)')"></ve-line>
                                    </ve-rect-coordinate>
                                </div>
                                <div class="cds-float-left">
                                    <ve-rect-coordinate
                                            id="diskWrite"
                                            :color="['#9fb0e8']"
                                            :x-axis-data="diskWritexAxis"
                                            :cover-option="getCoverOption('磁盘写入速率','#9fb0e8','b/s')"
                                            background-color="#f6f7f9">
                                        <ve-line symbol="rect"
                                                start-gradient
                                                :data="diskWriteData"
                                                :linear-gradient="getLinerGradient('rgba(156,177,232,1)','rgba(156,177,232,0.3)','rgba(156,177,232,0)')"></ve-line>
                                    </ve-rect-coordinate>
                                </div>
                            </div>
                            <div class="chart-bar cds-clearfix" v-for="(item,index) in networkArr" :key="index">
                                <div class="cds-float-left">
                                    <ve-rect-coordinate
                                            :id="item.macName+'read'"
                                            :color="['#33b4f7']"
                                            :x-axis-data="item.incomingXAxis"
                                            :cover-option="getCoverOption(`网卡${item.macName}接受速率`,'#33b4f7','b/s')"
                                            background-color="#f6f7f9">
                                        <ve-line symbol="rect"
                                                start-gradient
                                                :data="item.incomingList"
                                                :linear-gradient="getLinerGradient('rgba(51,180,247,1)','rgba(51,180,247,0.3)','rgba(51,180,247,0)')"></ve-line>
                                    </ve-rect-coordinate>
                                </div>
                                <div class="cds-float-left">
                                    <ve-rect-coordinate
                                            :id="item.macName + 'write'"
                                            :color="['#09ceb0']"
                                            :x-axis-data="item.outgoingXAxis"
                                            :cover-option="getCoverOption(`网卡${item.macName}传送速率`,'#09ceb0','b/s')"
                                            background-color="#f6f7f9">
                                        <ve-line symbol="rect"
                                                start-gradient
                                                :data="item.outgoingList"
                                                :linear-gradient="getLinerGradient('rgba(8,209,177,1)','rgba(8,209,177,0.3)','rgba(8,209,177,0)')"></ve-line>
                                    </ve-rect-coordinate>
                                </div>
                            </div>
                        </div>
                    </div>
                </i-col>
            </i-row>
        </i-row>
    </div>
</template>

<script>
    import virtualDetail from './virtualDetail';
    export default virtualDetail;
</script>

<style lang="less" scoped>
    @import './virtualDetail.less';
</style>