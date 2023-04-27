import PieChart from './echarts-pie.vue';
import subPieChart from './echarts-sub-pie.vue';
import Echarts from 'echarts';

PieChart.subPie = subPieChart;
/*export default PieChart;*/
const install = function(Vue, opts = {}){
    Vue.prototype.$echarts = Echarts;
    Vue.component('ve-pie', PieChart);
    Vue.component('ve-sub-pie', subPieChart);
};

const API = {
    install,
    'pie': PieChart
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default API;
