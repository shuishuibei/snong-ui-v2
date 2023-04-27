<template>
    <div class="home-bottom-box" ref="homeBottomBox">
        <home-weekly-people-counting type="project"></home-weekly-people-counting>
        <home-weekly-project-show></home-weekly-project-show>
    </div>
</template>

<script>
import homeWeeklyPeopleCounting from './homeWeeklyPeopleCounting.vue' // 引入周报人数组件
import homeWeeklyProjectShow from './homeWeeklyProjectShow.vue' // 引入周报展示组件
export default {
    name: 'home-project',
    components:{
        'home-weekly-people-counting': homeWeeklyPeopleCounting,
        'home-weekly-project-show': homeWeeklyProjectShow
    }
}
</script>

<style scoped lang="less">
.home-bottom-box {
    height: calc(~"100% - 50px");
    overflow-y:auto;
}
</style>
