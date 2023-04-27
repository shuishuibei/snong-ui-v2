<template>
    <div class='mall-Common'>
        <div class='mall-Common-left' :style='{padding:padding?padding:0}'>
            <div class="icon-area">
                <i :class="Object.assign({iconfont:true,'iconfont-radius':true},{[className]:true})"
                   :style='{color:styleSet,borderColor:styleSet,fontSize:fs?fs:false}'></i>
                {{title}}
            </div>
        </div>
        <div class='mall-Common-right'>
            <slot name="mallContent"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'MallCommon',
        props: ['className', 'title', 'styleSet', 'padding', 'fs']
    }
</script>
<style lang="less" scoped>
    .mall-Common {
        width: 100%;
        border: 1px solid #ebfbfa;
        box-sizing: border-box;
        margin: 10px 0 20px 0;
        position: relative;
        min-height: 100px;
        display: flex;
        > .mall-Common-left {
            background-color: #f5f8fd;
            //表示父元素小于120px时，aside不缩小宽度
            //同时父元素大于120px时，aside也不扩大宽度
            flex: 0 0 120px;
            text-align: center;
            position: relative;
            box-sizing: content-box;
            > .icon-area {
                width: 100%;
                height: 5rem;
                //居中
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -60%);
                .iconfont {
                    margin: auto;
                    display: block;
                    font-size: 1.5rem;
                    &:before {
                        font-size: inherit !important;
                    }
                }
            }
        }
        > .mall-Common-right {
            //父元素大于120px时，div占据所有多出的宽度
            flex: 1;
            min-height: 6rem;
            padding: 15px;
            position: relative;
            /*width: calc(~"100% - 122px")*/
        }
    }

    .iconfont-radius {
        position: relative;
        padding: 15px 0;
        &:before {
            padding: 8.5px 10px;
            color: inherit;
            border-radius: 50%;
            border-width: 2px;
            border-style: solid;
            border-color: inherit;
        }
    }
</style>
