<!--
 * @Description: 头部内容
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:09
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-22 11:34:41
 -->
<template>
  <div class="header-avator-con">
    <div>
      <i-tooltip
        content="故障管理"
        placement="bottom"
        class="icon-middle">
        <i class="iconfont icon-liuchengtu header-icon header-icon-color" @click="faultManage"></i>
      </i-tooltip>
    </div>
    <div>
      <i-tooltip
        content="iKnow知识库"
        placement="bottom"
        class="icon-middle">
        <i class="iconfont icon-zcpt-zhishikuguanli header-icon header-icon-color" @click="iknow"></i>
      </i-tooltip>
    </div>
    <div>
      <i-tooltip
        content="运维大屏"
        placement="bottom"
        class="icon-middle">
        <i class="iconfont icon-dapingzhanshi header-icon header-icon-color" @click="screen"></i>
      </i-tooltip>
    </div>
    <div class="split"></div>
    <div class="user-info">
      <i-dropdown trigger="click" @on-click="changeInfo">
        <i class="iconfont icon-username header-icon header-icon-color icon-user-info"></i>
        <span class="user-info-name">{{ userName }}</span>
        <i-icon type="ios-arrow-down" class="arrow-down"></i-icon>
        <i-dropdown-menu slot="list">
          <i-dropdown-item name="edit-info">修改个人信息</i-dropdown-item>
          <i-dropdown-item name="edit-password">修改密码(非域账号)</i-dropdown-item>
          <i-dropdown-item name="version" class="dropdown-version">版本号: 1.0.2</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
    </div>
    <div class="split"></div>
    <div class="sign-out" @click="signOutShow">
      <i class="iconfont icon-swticontuichu1 header-icon header-icon-color"></i>
    </div>
    <!-- 修改用户信息 -->
    <modify-user-info v-model="flag.modifyUserInfo" :title="'修改用户信息'"></modify-user-info>
    <!-- 修改用户密码 -->
    <modify-user-password v-model="flag.modifyUserPassword" :title="'修改密码'"></modify-user-password>
    <!-- 退出登录 -->
    <h3c-modal-confirm v-model="flag.signOut" :title="'退出登录'" :info="'确认退出？'" @on-ok="signOut"></h3c-modal-confirm>
  </div>
</template>

<script>
import H3cModalConfirm from '@/components/h3c-modal-confirm/H3cModalConfirm.vue';
import ModifyUserInfo from './ModifyUserInfo.vue'; // 引入修改用户信息
import modifyUserPassword from './ModifyUserPassword.vue'; // 引入修改用户密码
import { removeWatermark, setWaterMark } from '@/assets/js/watermark.js';
export default {
  components: {
    'h3c-modal-confirm': H3cModalConfirm,
    'modify-user-info': ModifyUserInfo,
    'modify-user-password': modifyUserPassword
  },
  data() {
    return {
      flag: {
        signOut: false,
        modifyUserInfo: false,
        modifyUserPassword: false
      },
      userName: "",
      passwordModal: false, // 修改密码对话框
    };
  },
  // computed: {
  //   userName() {
  //     if(this.$store.state.login.userName === '') {
  //       this.$store.commit('login/setUserName');
  //     }
  //     return this.$store.state.login.userName;
  //   }
  // },
  created() {
    this.getUserInfo();
  },
  mounted() {
    setWaterMark(localStorage.getItem('userName'), localStorage.getItem('loginName'));
  },
  destroyed() {
    removeWatermark();
  },
  methods: {
    getUserInfo() {
      this.$http.get('user/info').then(({ data }) => {
        if(data.status) {
          /*设置用户信息*/
          this.userName = data.data.userName;
          localStorage.setItem('userName', data.data.userName);
          localStorage.setItem('userId', data.data.id);
          localStorage.setItem('loginName', data.data.loginName);
          localStorage.setItem('owner', data.data.owner);
        }
      })
    },
    faultManage() {
      let url = 'http://opscloud.h3c.com/console/'
      window.open(url,'_blank')
    },
    /**
     * 跳转iknow知识库链接
     */
    iknow() {
      this.$http.get('user/iknow/login').then(({ data }) => {
          if(data.status) {
            window.open(data.message,'_blank')
          }
      })
    },
    screen() {
      let url = 'http://10.10.1.35:8081/'
      window.open(url,'_blank')
    },
    /**
     * @function 修改用户信息或者密码
     * @description 点击菜单项时触发
     */
    changeInfo(name) {
      switch (name) {
        case 'edit-info':
          this.flag.modifyUserInfo = true;
          break;
        case 'edit-password':
          this.flag.modifyUserPassword = true;
          break;
        default:
          break;
      }
    },
    /**
     * @function 退出登录弹出框显示
     */
    signOutShow() {
      this.flag.signOut = true;
    },
    /**
     * @function 退出登录
     */
    signOut() {
      /* 由于退出返回的code是403,直接在在入口文件中做了axios拦截,此处不需要处理 */
      this.$loading.show();
      this.$http.get('user/logout').then(({ data }) => {
        this.$loading.hide();
        if(data.status) {
            /**
             * 此处不能清空用户数据(否则会导致Error in nextTick: "NotFoundError)
             */
            //将用户权限清空
            //this.$store.commit('auth/resetState');
            //将跟菜单相关数据
            //this.$store.commit('menu/resetState');
            //this.$store.state.login.needAskIsLogin = true;
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
            // window.open(data.data)
            /* 跳转到登录页面 */
            this.$router.push({
              name: 'login'
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../assets/css/theme.less';

.header-avator-con {
  position: relative;
  z-index: 20;
  line-height: @headerHeight;
  height: @headerHeight;
  & > div {
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
    cursor: pointer;
  }
  & > div:nth-of-type(1), & > div:nth-of-type(2) {
    &:hover {
      i {
        color: #FFF;
      }
    }
  }
  & > .split {
    width: 1px;
    height: @headerIconHeight;
    background-color: #3c4459;
    padding: 0;
    position: relative;
  }
  .header-icon {
    font-size: @headerIconSize;
  }
  .header-icon-color {
    color: @headerIconColor;
  }
  .user-info {
    .icon-user-info {
      border: 1px solid #8c93a1;
      border-radius: 50%;
      padding: 5px;
    }
    .user-info-name {
      display: inline-block;
      vertical-align: top;
      padding: 0 5px;
      font-size: 12px;
      color: #fff;
    }
    .arrow-down {
      display: inline-block;
      vertical-align: middle;
      height: @headerIconSize;
      color: #fff;
    }
    /deep/ .ivu-dropdown-rel {
      height: 60px;
    }
    /deep/ .ivu-select-dropdown {
      margin: 0;
      .dropdown-version {
        cursor: default;
      }
      .dropdown-version:hover {
        background: none;
      }
    }
  }
  .sign-out {
    color: #e8ecf0;
    .iconfont {
      &:hover {
        color: #ff0042;
      }
    }
  }
}
</style>
