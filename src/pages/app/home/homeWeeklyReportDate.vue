<template>
    <div class="home-weekly-report-date">
        <p>云智运维服务部周报<span>（{{startDate}} - {{endDate}}）</span></p>
    </div>
</template>

<script>
export default {
    data(){
        return {
            startDate: '', // 开始日期
            endDate: '' // 结束日期
        }
    },
    mounted(){
        this.$http({
            method: 'GET',
            url: `/overview/weekly/date/last`
        }).then(({data})=>{
            if(data.status){
                this.startDate = data.data.startDate.replace(/-/g,'/');
                this.endDate = data.data.endDate.replace(/-/g,'/');
            }
        })
    }
}
</script>

<style lang="less" scoped>
.home-weekly-report-date {
    width: 100%;
    height: 40px;
    background-color: #FFF;
    border: 1px solid #D8DCE5;
    margin-bottom: 10px;
    line-height: 40px;
    font-size: 16px;
    padding-left: 20px;
    span {
        color: #3399FD;
    }
}
</style>

