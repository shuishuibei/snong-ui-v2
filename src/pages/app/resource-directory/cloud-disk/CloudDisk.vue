<!--
 * @Description 云硬盘主页面
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:41
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:55:32
 -->
<template>
  <div class="cloud-disk cds-padding-14 cds-border cds-scroll-wrap">
    <div class="cds-scroll-content">
      <h3c-title title="X86硬盘">
        <template #other>
          <a
            class="cds-float-right back-to-mall"
            @click="back">
            返回云资源
          </a>
        </template>
      </h3c-title>
      <div class="cloud-disk-wrap">
        <h3c-mall
          class-name="icon-xinxi"
          title="基本信息"
          style-set="#55ce5b">
          <template slot="mallContent">
            <cloud-disk-base-info
              ref="cloudDiskBaseInfo"
              :resource-content="resourceContent">
            </cloud-disk-base-info>
          </template>
        </h3c-mall>
        <h3c-mall
          class-name="icon-gouwuchekong"
          title="数量"
          style-set="#27b9f9">
          <template slot="mallContent">
            <cloud-disk-cart-nums
              ref="cloudDiskCartNums"
              :volume-nums-size="volumeNumsAndSize">
            </cloud-disk-cart-nums>
          </template>
        </h3c-mall>
      </div>
      <mall-footer
        :handler-submit="handlerSubmit"
        :submit-title="$route.query.id ? '修改申请清单' :'加入申请清单'">
      </mall-footer>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // 引入商城分块组件
import CloudDiskBaseInfo from './components/CloudDiskBaseInfo.vue'; //引入基本信息组件
import CloudDiskCartNums from './components//CloudDiskCartNums.vue'; // 引入购物量组件
import MallFooter from '../components/MallFooter.vue'; // 引入商城提交的页脚
export default {
  name: 'CloudDisk',
  components: {
    'h3c-title': H3cTitle,
    'h3c-mall': H3cMall,
    'cloud-disk-base-info': CloudDiskBaseInfo,
    'cloud-disk-cart-nums': CloudDiskCartNums,
    'mall-footer': MallFooter
  },
  data() {
    return {
      resourceContent: {}
    };
  },
  methods: {
    back() {
      this.$router.push({
        name: 'resource-directory/index',
        query: { time: new Date().getTime() }
      });
    },
    /**
     * @function handlerSubmit
     * @description 加入申请清单触发的方法
     * @returns {void}
     */
    handlerSubmit() {
      this.$loading.show();
      let _childBaseInfo = this.$refs.cloudDiskBaseInfo;
      let _childCartNums = this.$refs.cloudDiskCartNums;
      _childBaseInfo.$refs.formValidate.validate(valid => {
        if (valid) {
          this.$http({
            url: 'serverApply/volume',
            method: 'POST',
            data: {
              ..._childBaseInfo._data.formValidate,
              ..._childCartNums._data.formValidate
            }
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                desc: data.message
              });
            } else if (data.code === 700) {
              this.$Notice.error({
                desc: data.message
              });
            }
          });
        } else {
          this.$loading.hide();
        }
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
          let { resourceNumber, resourceContent } = data.data;
          this.resourceContent = JSON.parse(resourceContent);
          this.resourceContent.volumeNums = resourceNumber;
        } else if (data.code === 700) {
          this.$Notice.error({ desc: data.message });
        }
      });
    }
  },
  computed: {
    /**
     * @function volumeNumsAndSize
     * @description 过滤出硬盘大小和数量的数据
     * @returns {void}
     */
    volumeNumsAndSize() {
      let { volumeNums, volumeSize } = this.resourceContent;
      return { volumeNums, volumeSize };
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

<style scoped lang="less">
.cloud-disk {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
}
</style>
