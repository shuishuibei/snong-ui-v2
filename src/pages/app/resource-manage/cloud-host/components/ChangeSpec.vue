<!--
 * @Description: x86虚拟机下修改规格组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-28 16:07:16
 -->
<!--cfw2157-->
<template>
    <div>
        <i-modal 
            scrollable 
            v-model="visible" 
            title="更改规格"
            :mask-closable="false" 
            width="700px" 
            id="changeSpec">
            <div class="contain">
                <div class="info-content">
                    <i class="iconfont icon-tixingtishi"></i>
                    <div class="content-div">更改规格可能会造成虚拟机重启，执行操作前请确认虚拟机是否可以随时重启。</div>
                </div>
                <div>
                    <i-form ref="formValidateForm" :model="formValidate" :rules="ruleValidate" :label-width="80">
                        <i-form-item label="CPU" prop="cpu">
                            <i-radio-group v-model="formValidate.cpu" type="button" @on-change="changeCpu" :key="cpuKey">
                                <i-radio :label="item.value + '核'" v-for="item in formValidate.cpuArr"
                                       :key="item.value"></i-radio>
                            </i-radio-group>
                        </i-form-item>
                        <i-form-item label="内存" prop="memory">
                            <i-radio-group v-model="formValidate.memory" type="button" @on-change="changeMemory"
                                        :key="memoryKey">
                                <i-radio :label="item.value + 'G'" :key="item.index"
                                       v-for="item in formValidate.memoryArr" :disabled="item.disabled"></i-radio>
                            </i-radio-group>
                        </i-form-item>
                        <i-form-item label="存储类型" prop="storageType">
                            <i-select v-model="formValidate.storageType" style="width:300px;" disabled 
                              @on-change="changeStorageType">
                                <i-option v-for="item in formValidate.stoTypeArr" :value="item" :key="item.index">
                                    {{item}}
                                </i-option>
                            </i-select>
                        </i-form-item>
                        <i-form-item label="系统盘" prop="disk">
                            <h3c-array-slider
                                ref="sizeSlider"
                                style="width:500px"
                                v-model="formValidate.disk"
                                slider-tooltip-color="#3399fe"
                                :slider-button-style="buttonStyle"
                                :vertical-line-style="lineStyle"
                                :data="formValidate.diskArr"
                                @on-change="changeSlider">
                            </h3c-array-slider>
                        </i-form-item>
                    </i-form>
                    <div class="spec-detail cds-clearfix">
                        <div class="spec-title cds-float-left">规格详情</div>
                        <div class="spec-col cds-float-left">
                            <div class="old-spec">原规格：{{oldSpec.cpu}}核 {{oldSpec.memory}}G {{oldSpec.disk}}G {{oldSpec.storageType}}</div>
                        </div>
                        <div class="spec-col cds-float-left">
                            <div class="new-spec">新规格：{{formValidate.cpu}} {{formValidate.memory}} {{formValidate.disk}}G {{formValidate.storageType}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" style="text-align: center;padding: 0 15px 15px 15px">
                <i-button type="primary" @click="submit">确 认</i-button>
                <i-button @click="handleReset()">取 消</i-button>
            </div>
        </i-modal>
    </div>
</template>

<script>
    import api from '../api.js';
    import emitter from '@/assets/js/emitter.js';
    import H3cArraySlider from '@/components/h3c-slider/H3cArraySlider.vue';

    export default {
        mixins: [emitter],
        components: {
          H3cArraySlider
        },
        data() {
            return {
                cpuKey: '',
                memoryKey: '',
                diskKey: '',
                buttonStyle: {
                    backgroundColor: '#3399fe'
                },
                lineStyle: {
                    backgroundColor: '#fff'
                },
                imageInfo: {
                    cpu: 0,
                    memory: 0,
                    storage: 0
                },
                visible: false,
                loadingFlag: false,
                serverId: '',
                circleSize: 80,
                circleFontSize: '18px',
                oldSpec: {
                    cpu: 0,
                    memory: 0,
                    disk: 0,
                    storageType: ''
                },
                formValidate: {
                    cpu: '',
                    cpuArr: [],
                    memory: '',
                    memoryArr: [],
                    disk: 0,
                    diskArr: [],
                    storageType: '',
                    stoTypeArr: [],
                    storagePool: ''
                },
                ruleValidate: {
                    cpu: [{
                        type: 'string',
                        required: true,
                        trigger: 'change'
                    }],
                    memory: [{
                        required: true,
                        trigger: 'change'
                    }],
                    disk: [{
                        type: 'number',
                        required: true,
                        trigger: 'change'
                    }],
                    storageType: [{
                        required: true
                    }],
                    storagePool: [{
                        required: true
                    }]
                },
            }
        },
        props: {},
        methods: {
            /**
             * @description: 更改规格
             * @return: null
             */
            updateSpec() {
                this.$loading.show();
                let {cpu, memory, disk} = this.formValidate,
                    cpuVal = cpu.split('核')[0],
                    memoryVal = memory.split('G')[0];
                this.$http.post(api.applyChangeUrl + '/' + this.serverId + '/' + cpuVal + '*' + memoryVal + '*' + disk).then((data) => {
                    if (data.data.status) {
                        this.$Notice.success({desc: data.data.message});
                        this.dispatch('CloudHost', 'refresh');
                        this.visible = false;
                    } 
                    this.$loading.hide();
                }).catch(()=>{
                    this.$loading.hide();
                });
            },
            submit() {
                /*若有密码输入框,则将密码传递出去*/
                this.$refs['formValidateForm'].validate((valid) => {
                    if (valid) {
                        this.updateSpec();
                    } else {
                        this.$Notice.error({desc: '修改规格失败!'});
                        this.visible = false;
                    }
                });
            },
            /**
             * @description: 重置规格表单
             * @return: null
             */
            handleReset() {
                this.$refs['formValidateForm'].resetFields();
                this.visible = false;
            },
            /**
             * @description: 展示弹出框并进行初始化
             * @param param {Object} 父组件传进来的初始化参数
             * @return: null
             */
            showModal(param) {
                this.$loading.show();
                this.loadingFlag = true;
                this.visible = true;
                this.initPage(param);
            },
            /**
             * @description: 关闭弹出框
             * @return: null
             */
            closeModal() {
                this.visible = false;
            },
            /**
             * @description: 移动系统盘滑块
             * @param val {Number} 修改滑块后返回值
             * @return: null
             */
            changeSlider(val) {
                this.formValidate.disk = val;
            },
            /**
             * @description: 刷新cpu、内存、硬盘组件key值
             * @return: null
             */
            refresh() {
                this.cpuKey = new Date() + Math.random();
                this.memoryKey = new Date() + Math.random();
                this.diskKey = new Date() + Math.random();
            },
            /**
             * @description: 初始化页面 
             * @param param {Object} 初始化参数对象
             * @return: null
             */
            initPage(param) {
                this.serverId = param.id;
                let minCpu = Number(param.cpu),
                    minRam = Number(param.memory),
                    minDisk = Number(param.storage);
                this.imageInfo.cpu = minCpu;
                this.imageInfo.memory = minRam;
                this.imageInfo.storage = minDisk;
                let {cpu, memory, storage, storageType} = param;
                this.oldSpec.cpu = cpu;
                this.oldSpec.memory = memory;
                this.oldSpec.disk = storage;
                this.oldSpec.storageType = storageType;
                this.formValidate.cpu = cpu + '核';
                this.formValidate.memory = memory + 'G';
                this.formValidate.disk = storage;
                this.formValidate.storageType = storageType;
                this.refresh();
                this.$nextTick(() => {
                    this.$http.get('/serverNorm/' + minCpu + '/' + minRam + '/' + minDisk).then(({data}) => {
                        if (data.status) {
                            /*获取总范围*/
                            let {cpuRange, memoryRange, diskRange, typeRange} = data.data;
                            this.formValidate.cpuArr = this.initJudgment(cpuRange);
                            this.formValidate.memoryArr = this.initJudgment(memoryRange);
                            this.formValidate.diskArr = diskRange;
                            this.formValidate.stoTypeArr = typeRange;
                            this.refresh();
                            /*原规格cpu设定*/
                            this.$http.post(api.getSpecRangUrl, {
                                cpuType: 'cpu',
                                cpuValue: cpu,
                                minCpu: minCpu,
                                minRam: minRam,
                                minDisk: minDisk
                            }).then(({data}) => {
                                if (data.status) {
                                    /*获取最大范围*/
                                    let {memoryRange, diskRange, typeRange} = data.data;
                                    /*开始渲染，获取可选的范围*/
                                    this.addJudgment(this.formValidate.memoryArr, memoryRange);
                                    this.formValidate.diskArr = diskRange;
                                    this.formValidate.stoTypeArr = typeRange;
                                    let array = this.formValidate.memoryArr;
                                    for (let i = 0; i < array.length; i++) {
                                        if (!array[i].disabled) {
                                            this.formValidate.memory = array[i].value + 'G';
                                            break;
                                        }
                                    }
                                    this.changeMemory(this.formValidate.memory);
                                }
                                if (this.loadingFlag) {
                                    this.$loading.hide();
                                }
                            });
                        }
                    });
                });
            },
            /**
             * @description: 给cpu、内存添加是否可选标识
             * @param arr {Array} cpu、内存数据数组
             * @return: 返回添加了disabled之后的数组
             */
            initJudgment(arr) {
                let result = [];
                arr.forEach(function (val) {
                    let obj = {};
                    obj.value = val;
                    obj.disabled = true;
                    result.push(obj);
                });
                return result;
            },
            addJudgment(arr1, arr2) {
                arr1.forEach(function (val) {
                    let value = val.value;
                    /*在可选范围内*/
                    if (arr2.includes(value)) {
                        val.disabled = false;
                    } else {
                        val.disabled = true;
                    }
                })
            },
            changeCpu(value) {
                let cpu = value.split('核')[0];
                this.$nextTick(() => {
                    //todo 修改url
                    this.$http.post(api.getSpecRangUrl, {
                        cpuType: 'cpu',
                        cpuValue: cpu,
                        minCpu: this.imageInfo.cpu,
                        minRam: this.imageInfo.memory,
                        minDisk: this.imageInfo.storage
                    }).then(({data}) => {
                        if (data.status) {
                            /*获取最大范围*/
                            let {memoryRange, diskRange, typeRange} = data.data;
                            /*开始渲染，获取可选的范围*/
                            this.addJudgment(this.formValidate.memoryArr, memoryRange);
                            this.formValidate.diskArr = diskRange;
                            this.formValidate.disk = diskRange[0];
                            this.formValidate.stoTypeArr = typeRange;
                            this.formValidate.storageType = typeRange[0];
                            let array = this.formValidate.memoryArr;
                            for (let i = 0; i < array.length; i++) {
                                if (!array[i].disabled) {
                                    this.formValidate.memory = array[i].value + 'G';
                                    break;
                                }
                            }
                            this.changeMemory(this.formValidate.memory);
                        }
                        if (this.loadingFlag) {
                            this.$loading.hide();
                        }
                    });
                });
            },
            changeMemory(value) {
                let memory = value.split('G')[0];
                this.$nextTick(() => {
                    //todo 修改url
                    this.$http.post(api.getSpecRangUrl, {
                        memoryType: 'memory',
                        memoryValue: memory,
                        cpuType: 'cpu',
                        cpuValue: this.formValidate.cpu.split('核')[0],
                        minCpu: this.imageInfo.cpu,
                        minRam: this.imageInfo.memory,
                        minDisk: this.imageInfo.storage
                    }).then(({data}) => {
                        if (data.status) {
                            /*获取最大范围*/
                            let {diskRange, typeRange} = data.data;
                            /*开始渲染，获取可选的范围*/
                            this.formValidate.diskArr = diskRange;
                            this.formValidate.disk = diskRange[0];
                            this.formValidate.stoTypeArr = typeRange;
                            this.formValidate.storageType = typeRange[0];
                        }
                        if (this.loadingFlag) {
                            this.$loading.hide();
                        }
                    });
                });
            },
            changeStorageType(value) {
                this.formValidate.storageType = value;
            }
        }
    }
</script>

<style lang="less" scoped>

    .ivu-radio-group-button .ivu-radio-wrapper-checked {
        background: #3399fe;
        border-color: #3399fe;
        color: #fff;
        box-shadow: none;
    }

    .ivu-radio-group-button .ivu-radio-wrapper {
        border: 1px solid #3399fe;
    }

    .ivu-radio-group-button .ivu-radio-wrapper-disabled {
        border-color: #dddee1;
    }

    .ivu-chart-circle {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

</style>

<style lang="less" scoped>
    #changeSpec {
        
        /deep/.ivu-modal-body {
            margin: 14px 30px 18px 30px;
            padding: 0;
        }
        /deep/.ivu-modal-footer {
            padding-bottom: 5px;
        }

        /deep/.ivu-modal .ivu-form {
            padding: 14px 70px 0 30px;
        }

        .contain {
            .spec-detail {
                width: 100%;
                height: 40px;
                padding-left: 30px;
                margin-bottom: 10px;
                .spec-title {
                    padding-right: 16px;
                    width: 80px;
                    line-height: 30px;
                    text-align: right;
                }
                .spec-col {
                    width: 200px;
                    height: 30px;
                    line-height: 30px;
                    & > div {
                        width: 100%;
                        text-align: center;
                        border: 1px solid #F3F3F3;
                    }
                    .old-spec {
                        background: #f3f3f3;
                    }
                    .new-spec {
                        font-family: 'Microsoft-YaHei';
                        font-size: 12px;
                        color: #ff6600;
                    }
                }
            }
        }

        .info-content {
            color: #ff6600;
            padding: 10px;
            background-color: #fff0e1;
            position: relative;
            display: flex;
            align-items: center;

            .iconfont {
                align-self: flex-start;
                font-size: 18px;
                &:before {
                    font-size: inherit !important;
                }
            }

            .content-div {
                line-height: 22px;
            }
        }

      
    }
</style>