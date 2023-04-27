<!--
 * @Description: 
 * @Author: caiyijun
 * @Date: 2019-09-07 15:09:26
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-07 20:41:49
 -->
<template>
    <div></div>
</template>
<script>
    /**
     * name：系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
     * childType: 自图表类型，用于父组件里判断类别
     * */
    import emitter from '../../mixins/emitter.js';
    export default {
        name: 'VePictorialBar',
        mixins: [emitter],
        props: {
            name: {
                type: String,
                default: ''
            },
            childType: {
                type: String,
                default: 'pictorialbar'
            },
            data: {
                type: Array,
                default: () => []
            }
        },
        data(){return {}},
        watch: {
            data:function(val,oldVal){
                if(val !== oldVal) {
                    this.dispatch('VeRectCoordinate', 'changeData', val);
                }
            }
        }
    }
</script>
