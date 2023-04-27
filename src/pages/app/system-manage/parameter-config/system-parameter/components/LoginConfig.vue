<!--
 * @Description: 登录页背景配置
 * @Author: ys2234
 * @Date: 2019-10-22 09:23:07
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:36:11
 -->
<template>
  <div class="login-config">
    <i-form :label-width="80">
      <i-form-item label="登录页背景">
        <i-upload
          accept="image"
          :action="isBaseUrl + uploadLoginBgUrl"
          :on-error="uploadError"
          :on-success="uploadLoginBgSuccess"
          :show-upload-list="false"
          :disabled="uploadLoginBgDisabled">
          <i-button
            :disabled="uploadLoginBgDisabled"
            type="primary">
            <i class="iconfont icon-plus iconfont-normal">添加图片</i>
          </i-button>
        </i-upload>
        <span class="tips">最多可以上传4张，图片尺寸1920*1080，图片大小不得超过3M</span>
        <div class="picture-card-wrapper cds-clearfix">
          <div
            class="cds-float-left picture-card"
            v-for="(item, index) in loginBgInfo"
            :key="index">
            <picture-card
              class="cds-float-left"
              :url="item.url"
              :status="item.status"
              :default-type="index === 0"
              :login-image="true"
              @on-change="changeLoginBg(index)"
              @delete="deleteLoginBg(index)">
            </picture-card>
          </div>
        </div>
      </i-form-item>
      <i-form-item label="首页Logo">
        <i-upload
          accept="image"
          :action="isBaseUrl + uploadLogoUrl"
          :on-error="uploadError"
          :on-success="uploadLogoSuccess"
          :show-upload-list="false"
          :disabled="uploadLogoDisabled">
          <i-button
            :disabled="uploadLogoDisabled"
            type="primary">
            <i class="iconfont icon-plus iconfont-normal">添加图片</i>
          </i-button>
        </i-upload>
        <span class="tips">最多可以上传4张，图片大小不得超过100K</span>
        <div class="picture-card-wrapper cds-clearfix">
          <div
            class="cds-float-left picture-card"
            v-for="(item, index) in logoInfo"
            :key="index">
            <picture-card
              class="cds-float-left"
              :url="item.url"
              :status="item.status"
              :default-type="index === 0"
              :logo-image="true"
              @on-change="changeLogo(index)"
              @delete="deleteLogo(index)">
            </picture-card>
          </div>
        </div>
      </i-form-item>
      <i-form-item label="版权信息">
        <i-input
          type="textarea"
          style="width: 400px"
          :rows="2"
          :maxlength="30"
          v-model="formObject.copyright" />
      </i-form-item>
    </i-form>
  </div>
</template>

<script>
import PictureCard from './PictureCard.vue';
const defaultBackgroundUrl = require('@/assets/imgs/login.png');
const defaultLogoUrl = require('@/assets/imgs/logo-index.png');
export default {
  name: 'LoginConfig',
  components: {
    'picture-card': PictureCard
  },
  data() {
    return {
      uploadLoginBgUrl: 'loginparams/upload/background_image',  // 上传登录页背景图片地址
      uploadLogoUrl: 'loginparams/upload/logo_image', // 上传首页Logo图片地址
      /**
       * @description 登录页背景图片信息
       * @property {string}  fileName - 登录页背景图片名称
       * @property {boolean} status   - 登录页背景图片状态
       * @property {string}  url      - 登录页背景图片地址
       */
      loginBgInfo: [
        {
          fileName: 'login.png',
          status: true,
          url: defaultBackgroundUrl
        }
      ],
      logoInfo: [
        {
          fileName: 'logo-index.png',
          status: true,
          url: defaultLogoUrl
        }
      ],
      uploadLoginBgDisabled: true,
      uploadLogoDisabled: true,
      formObject: {
        backgroundImage: '',
        logoImage: '',
        copyright: ''
      }

    }
  },
  methods: {
    /**
     * @description: 添加图片失败回调
     * @param {string} error - 错误信息
     * @return: null
     */
    uploadError(error) {
      this.$Notice.error({
        desc: error
      });
    },
    /**
     * @description: 上传图片成功回调，当上传成功后，获取图片的 base64
     * @param {string} response - 请求返回体
     * @return: null
     */
    uploadLoginBgSuccess(response) {
      if (response.status) {
        this.$Notice.success({
          desc: response.message
        });
        this.updateLoginBgInfo();
      } else {
        this.$Notice.error({
          desc: response.message
        });
      }
    },
    /**
     * @description: 上传图片成功回调，当上传成功后，获取图片的 base64
     * @param {string} response - 请求返回体
     * @return: null
     */
    uploadLogoSuccess(response) {
      if (response.status) {
        this.$Notice.success({
          desc: response.message
        });
        this.updateLogoInfo();
      } else {
        this.$Notice.error({
          desc: response.message
        });
      }
    },
    /**
     * @function 更新登录页背景图片信息
     * @description: 只会获取用户上传的图片，不包含本地图片
     */
    updateLoginBgInfo() {
      return this.$http({
        method: 'GET',
        url: 'loginparams/listBackgroundImagePaths'
      }).then(({ data }) => {
        if(data.status) {
          let arr = data.data;
          if(arr.length >= 4) {
            this.uploadLoginBgDisabled = true;
          } else {
            this.uploadLoginBgDisabled = false;
          }
          for(let [index, item] of arr.entries()) {
            if(index <= 4) {
              this.$set(this.loginBgInfo, index + 1, {
                fileName: item,
                status: false,
                url: ''
              })
              this._getLoginBgFlow(item, index + 1);
            } else {
              break;
            }
          }
        }
      })
    },
    /**
     * @function 获取登录图片流
     * @param {string} name 图片名称
     * @param {number} index 图片序号
     * @private
     */
    _getLoginBgFlow(name, index) {
      if(name === this.loginBgInfo[0].fileName){
        return ;
      }
      this.$http({
        method: 'GET',
        url: `/loginparams/showBackgroundImg/${name}`,
        responseType: 'arraybuffer'
      }).then(({ data }) => {
        this.loginBgInfo[index].url = 'data:image/jpeg;base64,' + btoa(
          new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      })
    },
    /**
     * @function 更改登录页背景图片
     * @param {number} key - 选中的背景图片的序号
     */
    changeLoginBg(key) {
      this.formObject.backgroundImage = this.loginBgInfo[key].fileName;
      this.loginBgInfo.forEach((value, index) => {
        value.status = (key === index);
      });
    },
    /**
     * @function 删除登录页背景图片
     * @param {number} key - 选中的背景图片的序号
     */
    deleteLoginBg(key) {
      if(key === 0) {
        return ;
      }
      this.$loading.show();
      this.$http({
        method: 'DELETE',
        url: `loginparams/delBackgroundImage/${this.loginBgInfo[key].fileName}`
      }).then(({ data }) => {
        this.$loading.hide();
        if(data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.loginBgInfo.splice(key, 1);
          this.updateLoginBgInfo();
        }
      })
    },
    /**
     * @function 更新Logo图片信息
     * @description: 只会获取用户上传的图片，不包含本地图片
     */
    updateLogoInfo() {
      return this.$http({
        method: 'GET',
        url: 'loginparams/listLogoImagePaths'
      }).then(({ data }) => {
        if(data.status) {
          let arr = data.data;
          if(arr.length >= 4) {
            this.uploadLogoDisabled = true;
          } else {
            this.uploadLogoDisabled = false;
          }
          for(let [index, item] of arr.entries()) {
            if(index <= 4) {
              this.$set(this.logoInfo, index + 1, {
                fileName: item,
                status: false,
                url: ''
              });
              this._getLogoFlow(item, index + 1);
            } else {
              break;
            }
          }
        }
      })
    },
    /**
     * @function 获取Logo图片流
     * @param {string} name 图片名称
     * @param {number} index 图片序号
     * @private
     */
    _getLogoFlow(name, index) {
      if(name === this.logoInfo[0].fileName) {
        return ;
      }
      this.$http({
        method: 'GET',
        url: `/loginparams/showLogoImg/${name}`,
        responseType: 'arraybuffer'
      }).then(({ data }) => {
        this.logoInfo[index].url = 'data:image/jpeg;base64,' + btoa(
          new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      })
    },
    /**
     * @function 更改Logo
     * @param {number} key - 选中的Logo的序号
     */
    changeLogo(key) {
      this.formObject.logoImage = this.logoInfo[key].fileName;
      this.logoInfo.forEach((item, index) => {
        item.status = (key === index);
      });
    },
    /**
     * @function 删除Logo图片
     * @param {number} key - 选中的Logo的序号
     */
    deleteLogo(key) {
      if(key === 0) {
        return ;
      }
      this.$loading.show();
      this.$http({
        method: 'DELETE',
        url: `loginparams/delLogoImage/${this.logoInfo[key].fileName}`
      }).then(({ data }) => {
        this.$loading.hide();
        if(data.status) {
          this.$Notice.success({
            desc: data.message
          });
          this.logoInfo.splice(key, 1);
          this.updateLogoInfo();
        }
      })
    },
    getDefaultConfig() {
      this.$http({
        method: 'GET',
        url: '/loginparams/getCurrentLoginParam'
      }).then(({ data }) => {
        if(data.status) {
          this.formObject.copyright = data.data.copyright;
          /* 选中当前应用的登录页背景图片 */
          this.loginBgInfo.forEach(item => {
            item.status = (item.fileName === data.data.backgroundImage);
          });
          this.formObject.backgroundImage = data.data.backgroundImage;
          /* 选中当前应用的Logo图片 */
          this.logoInfo.forEach(item => {
            item.status = (item.fileName === data.data.logoImage);
          });
          this.formObject.logoImage = data.data.logoImage;
          this.commitStore({ loginBgName: data.data.backgroundImage, logoName: data.data.logoImage });
        }
      })
    },
    /**
     * @function 将当前应用的配置信息存入Store，并使用事件中心监听首页Logo的变化
     */
    commitStore({ loginBgName = '', logoName = this.formObject.logoImage } = {}) {
      if( loginBgName && loginBgName.length > 0 ) {
        for(let item in this.loginBgInfo.values()) {
          if(loginBgName === item.fileName) {
            this.$store.commit('login/setBackgroundImage', item.url);
            break;
          }
        }
      }
      if( logoName && logoName.length > 0 ) {
        for(let item of this.logoInfo.values()) {
          if(logoName === item.fileName) {
            this.$store.commit('login/setLogoImage', item.url);
            this.$eventHub.$emit('changeLogo');
          }
        }
      }
    },
  },
  created() {
    Promise.all([this.updateLoginBgInfo(), this.updateLogoInfo()]).then(() => {
      this.getDefaultConfig();
    })
  },
  computed: {
    /**
     * @function 判断是否是开发环境
     * @returns {string} isBaseUrl
     */
    isBaseUrl() {
      return process.env.NODE_ENV === 'development' ? baseUrl : '';
    }
  },
}
</script>

<style lang="less" scoped>
.login-config {
  .tips {
    position: absolute;
    top: 0;
    left: 8%;
    margin-left: 15px;
    color: #FF2756;
  }
  .picture-card-wrapper {
    margin-top: 18px;
    .picture-card {
      margin-right: 20px;
    }
  }
}
</style>
