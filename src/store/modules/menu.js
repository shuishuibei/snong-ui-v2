/**
 * 面包屑中的文字需要从菜单中获取数据,而不是前端写好的路由中
 */

const state = {
    menuData: []
};

const mutations = {
    setMenuData(state, menuData) {
        state.menuData = menuData;
    }
};

export default {
    namespaced: true,
    state,
    mutations
};