<!--
 * @Descripttion: 主机详情页面
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-25 14:57:19
 -->
<template>
    <div class="virtual-detail-container">
        <div class="virtual-detail-row">
            <div class="virtual-detail-left">
                <div class="base-info">
                    <h3 class="base-info-title title-line">基本信息</h3>
                    <ul class="base-info-list info-list">
                        <li>
                            <div class="base-info-list-left">UUID :</div>
                            <div class="base-info-list-right" :title="info.id">{{info.id}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">名称 :</div>
                            <div class="base-info-list-right" :title="info.serverName">{{info.serverName}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">别名 :</div>
                            <div class="base-info-list-right" :title="info.alias">{{info.alias}}</div>
                        </li>

                        <li>
                            <div class="base-info-list-left">状态 :</div>
                            <div class="base-info-list-right" :title="statusText">
                                <div class="cds-status-dot" :style="{backgroundColor: color}"></div>
                                <span :style="{color: color, verticalAlign: 'middle'}">{{statusText}}</span>
                            </div>
                        </li>
                        <li>
                            <div class="base-info-list-left">镜像 :</div>
                            <div class="base-info-list-right">
                                    <span :title="info.imageName">
                                        <span :class="info.classes"></span>
                                        <span style="'vertical-align: middle">
                                            {{info.imageName}}
                                        </span>
                                    </span>
                            </div>
                        </li>
                        <li>
                            <div class="base-info-list-left">规格 :</div>
                            <div class="base-info-list-right" :title="info.flavorInfo">{{info.flavorInfo}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">初始密码 :</div>
                            <div class="base-info-list-right password-top cds-clearfix">
                                <div v-if="!showPwd" class="cds-ellipsis">
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
                                    <i class="iconfont icon-htmal5icon09" v-if="!showPwd"></i>
                                    <i class="iconfont icon-yincangbukejian" v-if="showPwd"></i>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="base-info-list-left">虚拟化类型 :</div>
                            <div class="base-info-list-right">{{info.virtType}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">所有者 :</div>
                            <div class="base-info-list-right">{{info.userName}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">资源区域 :</div>
                            <div class="base-info-list-right">{{info.zone}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">主机名称 :</div>
                            <div class="base-info-list-right">{{info.compute}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">创建时间 :</div>
                            <div class="base-info-list-right">{{info.createDate | date}}</div>
                        </li>
                        <li>
                            <div class="base-info-list-left">描述 :</div>
                            <div class="base-info-list-right" :title="info.description">{{info.description}}</div>
                        </li>
                    </ul>
                </div>
                <div class="lease-info" ref="dynamic-height">
                    <h3 class="lease-info-title title-line">租期信息</h3>
                    <ul class="lease-info-list info-list">
                        <li>
                            <div class="lease-info-list-left">开始时间 :</div>
                            <div class="lease-info-list-right">{{info.createDate | date}}</div>
                        </li>
                        <li>
                            <div class="lease-info-list-left">到期时间 :</div>
                            <div class="lease-info-list-right">{{info.endDate | date}}</div>
                        </li>
                        <li>
                            <div class="lease-info-list-left">到期操作 :</div>
                            <div class="lease-info-list-right">自动关闭</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="virtual-detail-right">
                <div class="virtual-detail-right-tab">
                    <i-tabs :animated="false">
                        <i-tab-pane label="硬件配置">
                            <div class="hard-config">
                                <div class="network-card">
                                    <div class="hard-config-header cds-clearfix">
                                        <h3c-title title="网卡" class="cds-float-left" :style-set="{'border-bottom': 'none'}">
                                            <template #other>
                                                <i-button class="cds-btn-refresh cds-float-right" @click="getNetwork">
                                                    <i class="iconfont icon-shuaxin1"></i>
                                                </i-button>
                                            </template>
                                        </h3c-title>
                                    </div>
                                    <div class="network-card-table-page">
                                        <div class="network-card-table">
                                            <i-table
                                                stripe
                                                highlight-row
                                                no-data-text="暂无网卡"
                                                :columns="networkColumns"
                                                :data="networkPageObj.showData" size="small"
                                                :loading="networkPageObj.loading"></i-table>
                                        </div>
                                        <div class="network-card-page page-container cds-clearfix">
                                            <div class="cds-float-left">
                                                共有{{networkPageObj.total}}条记录，当前页{{networkPageObj.current}}/{{networkPageObj.getPageNum()}}页
                                            </div>
                                            <div class="cds-float-right">
                                                <i-page
                                                    show-sizer
                                                    placement="top"
                                                    :total="networkPageObj.total"
                                                    :current="networkPageObj.current"
                                                    :page-size="networkPageObj.size"
                                                    :page-size-opts="networkPageObj.pageSizeOpts"
                                                    @on-page-size-change="changePageSize($event, networkPageObj,getNetwork)"
                                                    @on-change="changePage($event, networkPageObj,getNetwork)"
                                                    size="small">
                                                </i-page>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="disk">
                                    <div class="hard-config-header cds-clearfix">
                                        <h3c-title title="硬盘" class="cds-float-left" :style-set="{'border-bottom': 'none'}">
                                            <template #other>
                                                <i-button class="cds-btn-refresh cds-float-right" @click="refreshDisk">
                                                    <i class="iconfont icon-shuaxin1"></i>
                                                </i-button>
                                            </template>
                                        </h3c-title>
                                    </div>
                                    <div class="disk-table-page">
                                        <div class="network-card-table">
                                            <i-table
                                                stripe
                                                highlight-row
                                                size="small"
                                                no-data-text="暂无硬盘"
                                                :columns="diskColumns"
                                                :data="diskPageObj.showData"
                                                :loading="diskPageObj.loading">
                                                </i-table>
                                        </div>
                                        <div class="disk-page page-container cds-clearfix">
                                            <div class="cds-float-left">
                                                共有{{diskPageObj.total}}条记录，当前页{{diskPageObj.current}}/{{diskPageObj.getPageNum()}}页
                                            </div>
                                            <div class="cds-float-right">
                                                <i-page
                                                    show-sizer
                                                    placement="top"
                                                    :total="diskPageObj.total"
                                                    :current="diskPageObj.current"
                                                    :page-size="diskPageObj.size"
                                                    :page-size-opts="diskPageObj.pageSizeOpts"
                                                    @on-page-size-change="changePageSize($event, diskPageObj,getDisk)"
                                                    @on-change="changePage($event, diskPageObj,getDisk)"
                                                    size="small">
                                                </i-page>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </i-tab-pane>
                    </i-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import virtualDetail from './virtualDetail';
    export default virtualDetail;
</script>
<style lang="less">
    .virtual-detail-container {
        .virtual-detail-right-tab {
            .ivu-tabs {
                height: 100%;
                padding: 4px 15px;
                overflow-y: auto;
                border: 1px solid #ddd;
                .ivu-tabs-bar {
                    margin-bottom: 0;
                    background-color: #fff;
                    .ivu-tabs-nav {
                        .ivu-tabs-tab {
                            border-color: #d8e0eb;
                            border-radius: 10px 10px 0 0;
                        }
                    }
                }
                .ivu-tabs-content {
                    .ivu-tabs-tabpane {
                        height: 100%;
                    }
                }
            }
        }
    }

</style>
<style lang="less" scoped>
    @import './virtualDetail.less';
</style>
