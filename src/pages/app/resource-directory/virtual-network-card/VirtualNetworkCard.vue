<!--
 * @Description 虚拟网卡主申请页面
 * @Author ys1983/张睿博
 * @Date 2019-07-25 16:03:32
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:58:11
 -->
<template>
  <div class="virtual-network-card cds-padding-14 cds-border cds-scroll-wrap">
    <div class="cds-scroll-content">
      <h3c-title title="虚拟网卡">
        <template #other>
          <a
            class="cds-float-right back-to-mall"
            @click="backHome">
            返回云资源
          </a>
        </template>
      </h3c-title>
      <h3c-mall
        class-name="icon-xinxi"
        title="基本信息"
        style-set="#55ce5b">
        <template #mallContent>
          <v-base-info
            ref="formBaseInfo"
            :port-name="resourceContent.portName"></v-base-info>
        </template>
      </h3c-mall>
      <h3c-mall
        class-name="icon-gouwuchekong"
        title="数量"
        style-set="#27b9f9">
        <template #mallContent>
          <v-cart-nums
            ref="formBaseCartNums"
            :net-work-id="resourceContent.netWorkId"
            :ip-address="resourceContent.ipAddress"></v-cart-nums>
        </template>
      </h3c-mall>
      <mall-footer
        :handler-submit="handlerSubmit"
        :submit-title="$route.query.id ? '修改申请清单' :'加入申请清单'">
      </mall-footer>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // // 引入商城分块组件
import VirtualNetworkCardBaseInfo from './components/VirtualNetworkCardBaseInfo.vue'; // 引入虚拟网卡基本信息组件
import VirtualNetworkCardCartNums from './components/VirtualNetworkCardCartNums.vue'; // 引入虚拟网卡购买量组件
import MallFooter from '../components/MallFooter.vue'; // 引入商城提交的页脚
export default {
  name: 'VirtualNetworkCard',
  components: {
    'h3c-title': H3cTitle,
    'h3c-mall': H3cMall,
    'v-base-info': VirtualNetworkCardBaseInfo,
    'v-cart-nums': VirtualNetworkCardCartNums,
    'mall-footer': MallFooter
  },
  inject: {
    isAbsolute: {
      default: () => ({ scrollEmit: false })
    }
  },
  data() {
    return {
      throttling: true,
      resourceContent: {}
    };
  },
  methods: {
    backHome() {
      this.$router.push({
        name: 'resource-directory/index',
        query: { time: new Date().getTime() }
      });
    },
    /**
     * @function handlerSubmit
     * @description 加入申请清单的方法
     * @returns {void}
     */
    handlerSubmit() {
      if (!this.throttling) {
        return null;
      }
      this.throttling = false;
      let allPromise = [];
      let { formBaseInfo, formBaseCartNums } = this.$refs;
      [formBaseInfo, formBaseCartNums].forEach(value => {
        allPromise.push(
          new Promise((resolve, reject) => {
            value.$refs.formValidate.validate(valid => {
              valid ? resolve(value.formValidate) : reject(valid);
            });
          })
        );
      });
      Promise.all(allPromise)
        .then(data => {
          this.$loading.show();
          this.$http({
            url: 'serverApply/port',
            method: 'POST',
            data: { ...data[0], ...data[1] }
          }).then(({ data }) => {
            this.throttling = true;
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                desc: data.message
              });
            }
          });
        })
        .catch(data => {
          this.throttling = true;
          this.$loading.hide();
          this.$Notice.error({
            desc: '表单验证未通过，请检查'
          });
        });
    },
    /**
     * @function getRouterResourceHttp
     * @description 获取申请清单编辑资源
     * @param {String} id
     * @returns {void}
     */
    getRouterResourceHttp(id) {
      this.$http({
        url: `applyList/editResourceInfo/${id}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status) {
          let { resourceContent } = data.data;
          this.resourceContent = JSON.parse(resourceContent);
        } else if (data.code === 700) {
          this.$Notice.error({ desc: data.message });
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.hasOwnProperty('id')) {
      next(vm => {
        vm.getRouterResourceHttp(to.query.id);
        next();
      });
    } else {
      next();
    }
  }
};
</script>

<style lang="less" scoped>
.virtual-network-card {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
}
</style>
