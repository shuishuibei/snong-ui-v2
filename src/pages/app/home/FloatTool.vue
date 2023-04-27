<template>
    <div class="float-tool">
        <div class="tool-top" @click="backTop" ref="toolTop">
            <a href="#">
                <i class="iconfont icon-huidaodingbu"></i>
            </a>
        </div>
        <div class="tool-bottom">
            <div class="tb-figure tb-figure1" @click="personnelShow" :class="{active: personnelActive}">
                <a href="#">
                    <i class="iconfont icon-yonghu1"></i>
                </a>
                <span>
                    人<br/>员
                </span>
                
            </div>
            <div class="tb-figure tb-figure2" @click="projectShow" :class="{active: projectActive}">
                <a href="#">
                    <i class="iconfont icon-xiangmu1"></i>
                </a>
                <span>
                    项<br/>目
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'float-tool',
    data(){
        return {
            personnelActive: false,
            projectActive: false
        }
    },
    methods:{
        // 点击后回到顶部
        backTop(){
            switch (true) {
                case this.$parent.shouldShow.personnel === true:
                    this.$parent.$refs.homePersonnel.$refs['homeBottomBox'].scrollTop = 0
                    break;
                case this.$parent.shouldShow.project === true:
                    this.$parent.$refs.homeProject.$refs['homeBottomBox'].scrollTop = 0
                    break;
                default:
                    break;
            }
        },
        personnelShow(){
            this.personnelActive = true;
            this.projectActive = false;
            this.$emit('shouldComponentShow','personnel');
        },
        projectShow(){
            this.personnelActive = false;
            this.projectActive = true;
            this.$emit('shouldComponentShow','project');
        }
    }
}
</script>

<style lang="less" scoped>
.float-tool {
    // width: 50px;
    // height: 50px;
    // background-color: aqua;
    // border: 1px solid #ccc;
    i {
        color: #FAFEFD;
        font-size: 14px;
    }
    
    .tool-top {
        width: 40px;
        height: 40px;
        background-color: #3399FE;
        margin-bottom: 12px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
    }
    .tool-bottom {
        width: 40px;
        height: 148px;
        background-color: #3399FE;
        .tb-figure {
            width: 100%;
            height: 50%;
            text-align: center;
            cursor: pointer;
        }
        .active {
            background-color: #59acfd !important;
        }
        .tb-figure1 {
            padding-top: 8px;
        }
        span {
            display: block;
            color: #FAFEFD;
            font-size: 14px;
        }
    }
    .tool-top:hover, .tb-figure:hover {
        background-color: #59acfd;
    }
}
</style>
