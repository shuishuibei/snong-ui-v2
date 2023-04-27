<!--
 * @Description Power硬盘申请主页面
 * @Author ys1983/张睿博
 * @Date 2019-07-25 15:40:00
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:55:53
 -->
<template>
  <div class="power-disk cds-padding-14 cds-border cds-scroll-wrap">
    <div class="cds-scroll-content">
      <h3c-title title="Power硬盘">
        <template #other>
          <a
            class="cds-float-right back-to-mall"
            @click="backHome">
            返回云资源
          </a>
        </template>
      </h3c-title>
      <h3c-mall
        title="基本配置"
        class-name="icon-ai-tool"
        style-set="#55ce5b">
        <template #mallContent>
          <power-disk-base-info
            ref="baseInfo"
            @e-mount="getVolumeTemplateHttp"
            :resource-content="resourceContent"
            :the-remaining-capacity="theRemainingCapacity">
          </power-disk-base-info>
        </template>
      </h3c-mall>
      <h3c-mall
        title="存储模板"
        class-name="icon-zhuji"
        style-set="#00cc66">
        <template #mallContent>
          <i-form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="150">
            <i-form-item
              label="存储模板"
              prop="volumeTypeId">
              <i-select
                style="width:300px;"
                v-model="formValidate.volumeTypeId">
                <i-option
                  v-for="item in volumeTemplateData"
                  :value="item.id"
                  :key="item.id">
                  {{item.name}}
                </i-option>
              </i-select>
            </i-form-item>
            <i-form-item>
              <i-table
                size="small"
                :columns="storageTemplateConfig.columns"
                :loading="storageTemplateConfig.loading"
                :data="storageTemplateConfig.data">
              </i-table>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <mall-footer
        :handler-submit="handleSubmit"
        :submit-title="$route.query.id ? '修改申请清单' :'加入申请清单'">
      </mall-footer>
    </div>
  </div>
</template>

<script>
import H3cTitle from '@/components/h3c-title/H3cTitle.vue'; // 引入全局组件title组件
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // // 引入商城分块组件
import PowerDiskBaseInfo from './components/PowerDiskBaseInfo.vue'; // 引入基本信息组件
import MallFooter from '../components/MallFooter.vue'; // 引入商城提交的页脚
export default {
  name: 'PowerDisk',
  components: {
    'h3c-title': H3cTitle,
    'h3c-mall': H3cMall,
    'power-disk-base-info': PowerDiskBaseInfo,
    'mall-footer': MallFooter
  },
  inject: {
    isAbsolute: {
      default: () => ({ scrollEmit: false })
    }
  },
  data() {
    return {
      formValidate: {
        applyListId: '',
        volumeTypeId: '', // 存储模板id
        volumeType: {} // 存储模板单行数据
      },
      ruleValidate: {
        volumeTypeId: {
          required: true,
          message: '存储模板不能为空',
          trigger: 'change'
        }
      },
      storageTemplateConfig: {
        columns: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '存储器名称',
            key: 'storage'
          },
          {
            title: '存储池名称',
            key: 'pool'
          },
          {
            title: '存储池剩余容量（GB）',
            key: 'freeSize'
          },
          {
            title: '存储池总容量（GB）',
            key: 'totalSize'
          }
        ],
        loading: true,
        data: []
      },
      volumeTemplateData: [],
      theRemainingCapacity: 1,
      resourceContent: {}
    };
  },
  methods: {
    /**
     * @function backHome
     * @description 点击返回云商城触发的方法
     * @returns {void}
     */
    backHome() {
      this.$router.push({
        name: 'resource-directory/index',
        query: { time: new Date().getTime() }
      });
    },
    /**
     * @function handleSubmit
     * @description 提交订单触发的方法
     * @returns {void}
     */
    handleSubmit() {
      let { formValidate, baseInfo } = this.$refs;
      let promiseAll = [
        new Promise((resolve, reject) => {
          formValidate.validate(valid => {
            valid ? resolve(this.formValidate) : reject('表单校验未通过');
          });
        }),
        new Promise((resolve, reject) => {
          baseInfo.$refs.formValidate.validate(valid => {
            valid ? resolve(baseInfo.$refs.formValidate.model) : reject('表单校验未通过');
          });
        })
      ];
      Promise.all(promiseAll)
        .then(([baseInfoData, volumeTemplateData]) => {
          this.$loading.show();
          this.$http({
            url: 'applyList/volume',
            method: 'POST',
            data: { ...baseInfoData, ...volumeTemplateData }
          }).then(({ data }) => {
            this.$loading.hide();
            let { status, code } = data;
            if (status) {
              this.$Notice.success({
                desc: data.message
              });
            } else if (code === 700) {
              this.$Notice.error({
                desc: data.message
              });
            }
          });
        })
        .catch(message => {
          this.$Notice.error({
            desc: message
          });
        });
    },
    /**
     * @function getVolumeTemplateHttp
     * @description 获取存储模板列表的方法
     * @param {Object} option
     * @param {String} option.mount
     * @param {Boolean} option.is
     * @returns {void}
     */
    getVolumeTemplateHttp({ mount, is }) {
      this.$http({
        url: `power/volume/type/list?powerServerId=${mount}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.volumeTemplateData = data.data;
          if (is) {
            this.formValidate.volumeTypeId = this.resourceContent.volumeTypeId;
          } else {
            let { id } = this.volumeTemplateData[0];
            this.formValidate.volumeTypeId = id;
          }
        } else {
          this.volumeTemplateData = [];
          this.formValidate.volumeTypeId = '';
          this.storageTemplateConfig.data = [];
          this.formValidate.volumeType = {};
          this.theRemainingCapacity = 1;
        }
      });
    },
    /**
     * @function getVolumePoolHttp
     * @description 根据存储模板获取存储池
     * @returns {void}
     */
    getVolumePoolHttp() {
      this.$http({
        url: `power/volume/type/list?id=${this.formValidate.volumeTypeId}`,
        method: 'GET'
      }).then(({ data }) => {
        this.storageTemplateConfig.loading = false;
        if (data.status) {
          this.storageTemplateConfig.data = [data.data];
          this.formValidate.volumeType = data.data;
          this.theRemainingCapacity = data.data.freeSize;
        } else {
          this.storageTemplateConfig.data = [];
          this.formValidate.volumeType = {};
          this.theRemainingCapacity = 1;
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
      this.formValidate.applyListId = id;
      this.$http({
        url: `applyList/editResourceInfo/${id}`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status) {
          let { resourceContent, resourceNumber } = data.data;
          this.resourceContent = JSON.parse(resourceContent);
          this.resourceContent.count = resourceNumber;
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
  },
  watch: {
    'formValidate.volumeTypeId'(newValue) {
      newValue && this.getVolumePoolHttp();
    }
  }
};
</script>

<style lang="less" scoped>
.power-disk {
  .back-to-mall {
    font-weight: normal;
    font-size: 12px;
  }
}
</style>
