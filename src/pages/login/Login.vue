<template>
  <div class="login" @keydown.enter="handleSubmit" :style="{backgroundImage: 'url(' + url + ')'}">
    <div class="login-container" @click="changeShowLoginInfo">
      <div class="login-header">
        <div class="login-header-logo"></div>
      </div>
      <div class="form-container">
        <p class="form-title">云智运维管理系统</p>
        <Form ref="loginRef" :model="loginModel" :rules="loginRules">
          <FormItem prop="loginName">
            <i class="iconfont icon-yonghu1 form-icon"></i>
            <Input type="text" v-model="loginModel.loginName" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem prop="password">
            <i class="iconfont icon-mima form-icon"></i>
            <Input type="password" v-model="loginModel.password" placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem class="login-btn-container">
            <Button long @click="handleSubmit" type="primary" class="submit-btn">登 录</Button>
            <div class="login-info" v-show="showLoginInfo">{{loginInfo}}</div>
          </FormItem>
        </Form>
        <div class="cds-clearfix">
          <span class="cds-float-right soft-register" @click="downloadFile">产品注册</span>
        </div>
      </div>

    </div>
    <div class="copyright">{{copyright}}</div>
  </div>
</template>
<script type="text/javascript">
import qs from 'qs';
const defaultBackgroundUrl = require('@/assets/imgs/login.png');

export default {
  data() {
    return {
      registerUser: false, // 注册用户
      url: '',
      copyright: '',
      showLoginInfo: false,
      loginInfo: '',
      loginModel: {
        loginName: '',
        password: ''
      },
      loginRules: {
        loginName: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
            validator(rule, value, callback) {
              if (value.trim() === '') {
                callback(new Error('用户名不能为空'));
              } else {
                callback();
              }
            }
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
            validator(rule, value, callback) {
              if (value.trim() === '') {
                callback(new Error('密码不能为空'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs['loginRef'].validate(valid => {
        if (valid) {
          //200 , 400 , 500 ,,进哪个回调函数
          //此处显示加载动画,在vue-router全局钩子中隐藏加载动画
          this.$loading.show();
          this.$http
            .post(
              'user/login',
              qs.stringify({
                loginName: this.loginModel.loginName,
                //密码转为base64
                // password: this.$base64.encode(this.loginModel.password)
                password: this.loginModel.password
              })
            )
            .then(({ data }) => {
              if (data.status) {
                /*设置用户信息*/
                localStorage.setItem('userName', data.data.userName);
                localStorage.setItem('userId', data.data.id);
                localStorage.setItem('loginName', data.data.loginName);
                localStorage.setItem('owner', data.data.owner);
                this.$store.commit('login/setUserName', data.data.userName);
                if (data.data.active !== 0) {
                  //路由跳转到主页面
                  this.$router.push({
                    name: 'home'
                  });
                  //监控台成员
                } else if (data.data.authId === 'a9452904dfd68fd0ecc1ad0fdbf6b7c2') {
                  //路由跳转到告警页面
                  this.$router.push({
                    name: 'alarm-list'
                  });
                } else {
                  this.$router.push({
                    name: 'task-check'
                  });
                }
              } else {
                this.loginModel.password = '';
                this.loginInfo = data.message;
                this.showLoginInfo = true;
              }
              this.$loading.hide();
            });
        }
      });
    },
    changeShowLoginInfo(e) {
      if (e.target.nodeName.toUpperCase() === 'INPUT') {
        this.showLoginInfo = false;
      }
    },
    // 获取背景图片流
    getBackImageFlow(name) {
      this.$http
        .get(`/loginparams/showBackgroundImg/${name}`, {
          responseType: 'arraybuffer'
        })
        .then(({ data }) => {
          this.url =
            'data:weekly/image/jpeg;base64,' +
            btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        });
    },
    handleJoin() {
      this.$router.push({
        name: 'join'
      });
    },
    downloadFile() {
      this.$http({
        method: 'GET',
        url: 'user/product/download',
        responseType: 'blob'
      }).then((res)=> {
        let a = document.createElement('a'),
          url = window.URL.createObjectURL(res.data);
        a.href = url;
        a.download = 'product.info';
        a.click();
        window.URL.revokeObjectURL(url);
      })
    },
    getDefaultRegisterUser() {
      this.$http({
        method: 'GET',
        url: '/loginparams/getSysParam/registerUser'
      }).then(({ data }) => {
        if (data.status) {
          this.registerUser = data.data.registerUser === 'open' ? true : false;
        }
      });
    }
  },
  mounted() {
    // 先获取登录背景图片和copyright信息
    this.$http.get('/loginparams/getCurrentLoginParam').then(({ data }) => {
      // 查询成功，使用数据库中图片路径；失败时使用默认图片路径
      if (data.status) {
        if (data.data.backgroundImage && data.data.backgroundImage !== 'login.png') {
          this.getBackImageFlow(data.data.backgroundImage);
        } else {
          this.url = defaultBackgroundUrl;
        }
        if (data.data.copyright) {
          this.copyright = data.data.copyright;
        } else {
          this.copyright = this.$store.state.login.copyright;
        }
      } else {
        this.url = defaultBackgroundUrl;
        this.copyright = this.$store.state.login.copyright;
      }
    });
  },
  created() {
    this.getDefaultRegisterUser();
  }
};
</script>

<style lang="less" scoped>
@import './login.less';
</style>
