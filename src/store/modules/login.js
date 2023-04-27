/**
 * 登录
 */

const state = {
    userName: '',
    userId: '',
    backgroundImageSrc: 'img/src/assets/imgs/login.png',
    logoImageSrc: 'img/src/assets/imgs/logo-index.png',
    copyright: ''
};

const mutations = {
    resetUserName(state) {
        state.userName = '';
        state.userId = ''
    },
    setUserName(state, userName) {
        // state.userName = userName;
        state.userName = localStorage.getItem('userName');
        state.userId = localStorage.getItem('userId');
    },
    setBackgroundImage(state, url){
        state.backgroundImageSrc = url;
    },
    setLogoImage(state, url){
        state.logoImageSrc = url;
    },
    setCopyright(state, content){
        state.copyright = content;
    }
};

export default {
    namespaced: true,
    state,
    mutations
};
