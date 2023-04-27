import PieChart from './charts/pie';
import RectCoordinate from './charts/scatter-bar-line';
import Echarts from 'echarts';

const echart = {
    've-pie': PieChart['pie'],
    've-sub-pie': PieChart['pie'].subPie,
    've-rect-coordinate': RectCoordinate['coordinate'],
    've-line': RectCoordinate['coordinate'].line,
    've-bar': RectCoordinate['coordinate'].bar,
    've-pictorialBar': RectCoordinate['coordinate'].pictorialBar,
    've-scatter': RectCoordinate['coordinate'].scatter,
};

const install = function(Vue, opts = {}){
    Vue.prototype.$echarts = Echarts;
    Object.keys(echart).forEach(key => {
        Vue.component(key, echart[key]);
    });
};

const API = {
    install
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default API;
