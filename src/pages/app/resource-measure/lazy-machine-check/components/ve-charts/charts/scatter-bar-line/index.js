import RectCoordinate from './rect-coordinate.vue';
import line from './line.vue';
import bar from './bar.vue';
import pictorialBar from './pictorialBar.vue';
import scatter from './scatter.vue';
import Echarts from 'echarts';

RectCoordinate.line = line;
RectCoordinate.bar = bar;
RectCoordinate.scatter = scatter;
RectCoordinate.pictorialBar = pictorialBar;
/*export default RectCoordinate;*/
const install = function(Vue, opts = {}){
    Vue.prototype.$echarts = Echarts;
    Vue.component('ve-rect-coordinate', RectCoordinate);
    Vue.component('ve-line', line);
    Vue.component('ve-bar', bar);
    Vue.component('ve-scatter', scatter);
    Vue.component('ve-pictorialBar', pictorialBar);
};

const API = {
    install,
    'coordinate': RectCoordinate
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default API;
