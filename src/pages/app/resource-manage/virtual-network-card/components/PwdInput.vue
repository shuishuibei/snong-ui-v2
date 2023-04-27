<!--
 * @Description: 虚拟网卡挂载时表格上密码输入组件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:35
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-18 10:55:20
 -->
<template>
    <div class="pwd-container">
        <i-nput :type="inputType" @input="inputPwd" v-model="passVal" class="pwd-input"></i-nput>
        <div @click="changeType" class="eye">
            <i class="iconfont icon-xianshikejian" v-if="showPwd"></i>
            <i class="iconfont icon-yincangbukejian" v-if="!showPwd"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PwdInput',
        data(){
            return {
                inputType: 'password',
                showPwd: false,
                passVal: ''
            }
        },
        methods: {
            inputPwd(event){
              this.$emit('inputPwd',event);
            },
            changeType(){
                this.showPwd = !this.showPwd;
                if(this.showPwd){
                    this.inputType = 'text';
                }else {
                    this.inputType = 'password';
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .pwd-container {
        .iconfont:hover:before {
            font-size: 18px !important;
        }
    }
    .pwd-input {
        float: left;
        width: 85px;
    }
    .eye {
        cursor: pointer;
        margin-left: 5px;
        float: right;
    }
</style>