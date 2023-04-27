<template>
    <div class="home-top">
        <div class="ht-left ht-box">
            <div class="htl-titleBox titleBox">
                <span class="hasBeenSendNum sendNum">{{String(this.sendNames.length).length < 2 ? '0' + String(this.sendNames.length) : this.sendNames.length}}</span>
                <p v-if="type === 'personnel' || type === 'preview-person'">已填写周报人数</p>
                <p v-else-if="type === 'project'">已汇报项目</p>
            </div>
            <div class="allname-box">
                <div class="sendName allName">
                    <div v-if="sendNames.length > 0">
                        <ul v-if="type === 'personnel'">
                            <li v-for="item in sendNames"><a href="javascript:;" @click="handleAnchors(item)">{{item}}</a></li>
                        </ul>
                        <ul v-if="type === 'preview-person'">
                            <li v-for="item in sendNames"><a href="javascript:;" @click="transferName(item)">{{item}}</a></li>
                        </ul>
                    </div>
                    <div v-else>暂无</div>
                </div>
            </div>
        </div>
        <div class="ht-right ht-box">
            <div class="titleBox">
                <span class="unsendNum sendNum">{{String(this.unSendNames.length).length < 2 ? '0' + String(this.unSendNames.length) : this.unSendNames.length}}</span>
                <p v-if="type === 'personnel'|| type === 'preview-person'">未填写周报人数</p>
                <p v-else-if="type === 'project'">未汇报项目</p>
            </div>
            <div class="allname-box">
                <div class="unsendName allName">
                    <div v-if="unSendNames.length > 0">
                        <ul>
                            <li v-for="item in unSendNames">{{item}}</li>
                        </ul>
                    </div>
                    <div v-else>暂无</div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    props:{
        type: {
            type: String
        }
    },
    data(){
        return {
            sendNames: [], // 已发送人员列表
            unSendNames: [] // 未发送人员列表
        }
    },
    methods:{
        getPersonnelCount(){
            this.$http({
                method: 'GET',
                url: `/overview/user/list`
            }).then(({data})=>{
                if(data.status){
                    this.unSendNames  = data.data.unSendNames;
                    this.sendNames = data.data.sendNames;
                }
            })
        },
        getProjectCount(){
            this.$http({
                method: 'GET',
                url: `/overview/project/list`
            }).then(({data})=>{
                if(data.status){
                    this.unSendNames  = data.data.unSendNames;
                    this.sendNames = data.data.sendNames;
                }
            })
        },
        handleAnchors(anchorsTo){
            // 获取top值
            let offsetTop = this.$parent.$children[1].$refs[anchorsTo][0].offsetTop;
            // 赋值，进行滚动
            this.$parent.$refs['homeBottomBox'].scrollTop = offsetTop - 50;
        },
        transferName(item) {
            this.$emit('clickName', item)
        }
    },
    mounted(){
        if(this.type === 'personnel' || this.type === 'preview-person'){
            this.getPersonnelCount();
        } else {
            this.getProjectCount();
        }
    }
}
</script>

<style lang="less" scoped>
.home-top {
    width: 100%;
    height: 140px;
    margin-bottom: 10px;
    position: relative;
    .ht-left {
        width: 50%;
        background-color: #fff;
        top: 0;
        left: 0;
    }
    .ht-right {
        width: 49.5%;
        background-color: #fff;
        right: 0;
        top: 0;
    }
    .ht-box {
        height: 140px;
        border: 1px solid #D8DCE5;
        position: absolute;

    }
}
.titleBox {
    height: 100%;
    background-color: #E6F1F7;
    line-height: 140px;
    width: 240px;
    padding-left: 20px;
    position: absolute;
    top: 0;
    left: 0;
    p {
        display: inline-block;
        font-size: 16px;
        color: #51677F;
        padding-left: 10px;
    }
}
.allname-box {
    height: 100%;
    width: calc(~"100% - 240px");
    position: absolute;
    right: 0;
    top: 0;
    overflow: hidden;
}
.allName {
    color: #64707c;
    font-size: 14px;
    padding: 10px 10px 0 10px;
    width: calc(~"100%");
    height: 100%;
    overflow: auto;
    ul {
        list-style-type: none;
        li {
            padding: 5px;
            float: left;
        }
    }
}
.ht-left {
    .sendName {
        color: #3399FD;
    }
}
.ht-right {
    .unsendNum {
        background-color: #FF9900 !important;
    }
}
.home-top {
    .sendNum {
        display: inline-block;
        width: 70px;
        height: 70px;
        background-color: #00CC65;
        border-radius: 50%;
        color: #FFFFFD;
        font-size: 50px;
        text-align: center;
        line-height: 70px;
        font-family: 'Fette-Engschrift';
        vertical-align: middle;
    }
}
</style>

