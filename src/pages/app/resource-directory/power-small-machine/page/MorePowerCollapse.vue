<!--
 * @Description Power虚拟机模板创建之后的配置页面
 * @Author ys1983/张睿博
 * @Date 2019-08-29 09:47:09
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:56:53
 -->
<template>
  <div class="more-power-collapse">
    <i-collapse
      v-model="defaule"
      :accordion="true">
      <i-panel
        v-for="item in $route.params.data"
        :key="item.display_name + item.name"
        :name="item.name">
        {{item.name}}
        <template #content>
          <m-collapse-form
            ref="formValidate"
            :target="item">
          </m-collapse-form>
        </template>
      </i-panel>
    </i-collapse>
    <mall-footer
      :handler-submit="handleSubmit"
      submit-title="加入申请清单">
      <template #cancel>
        <i-button
          style="margin-left: 8px;"
          @click="handleCancel(true)">
          取消
        </i-button>
      </template>
    </mall-footer>
  </div>
</template>

<script>
import MorePowerCollapseForm from '../components/MorePowerCollapseForm.vue';
import MallFooter from '../../components/MallFooter.vue'; // 引入商城提交的页脚
export default {
  name: 'MorePowerCollapse',
  components: {
    'm-collapse-form': MorePowerCollapseForm,
    'mall-footer': MallFooter
  },
  data() {
    return {
      defaule: '',
      isSubmit: false,
      form: null,
      isCancel: false
    };
  },
  methods: {
    /**
     * @function handleSubmit
     * @description 提交订单触发的方法
     * @returns {void}
     */
    handleSubmit() {
      let submitControl = [];
      this.isSubmit = true;
      this.$refs.formValidate.forEach(({ $refs }) => {
        submitControl.push(
          new Promise((resolve, reject) => {
            $refs.formValidate.validate(valid => {
              valid ? resolve($refs.formValidate.model) : reject('表单校验未通过');
            });
          })
        );
      });
      Promise.all(submitControl)
        .then(list => {
          this.$loading.show();
          let {
            biz_name,
            name,
            count,
            image_name,
            memory,
            units,
            description,
            password,
            specificationsId
          } = this.form;
          this.$http({
            url: 'applyList/server/biz',
            method: 'POST',
            data: {
              applyListId: '',
              bizList: list,
              bizName: biz_name,
              count: +count,
              cpu: units,
              imageAlias: image_name,
              tenancy: '',
              description,
              memory,
              name,
              password,
              specificationsId
            }
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$Notice.success({
                desc: data.message
              });
              this.$router.push({
                name: 'resource-directory/power-small-machine/template',
                query: { time: new Date().getTime() }
              });
            } else if (data.code === 700) {
              this.isSubmit = false;
              this.$Notice.error({
                desc: data.message
              });
            } else {
              this.isSubmit = false;
            }
          });
        })
        .catch(error => {
          this.isSubmit = false;
          this.$Notice.error({
            desc: error
          });
        });
    },
    /**
     * @function handleCancel
     * @description 点击取消触发的方法
     * @param {Boolean} is -判断是否是点击取消按钮触发的方法
     * @returns {void}
     */
    handleCancel(is = false) {
      let { biz_name, name, count, image_name, memory, units } = this.form;
      this.$http({
        url: 'power/server/biz/cancel',
        method: 'POST',
        data: {
          biz_name,
          name,
          count,
          image_name,
          memory,
          units
        }
      }).then(({ data }) => {
        if (data.status) {
          this.isCancel = true;
          this.$Notice.success({
            desc: data.message
          });
          is &&
            this.$router.push({
              name: 'resource-directory/power-small-machine/template',
              query: { time: new Date().getTime() }
            });
        } else if (data.code === 700) {
          this.$Notice.error({
            desc: data.message
          });
        }
      });
    }
  },
  mounted() {
    this.defaule = this.$route.params.data[0].name;
    this.form = this.$route.params.form;
  },
  beforeRouteEnter(to, from, next) {
    if (Object.keys(to.params).length > 0) {
      next();
    } else {
      next({
        name: 'resource-directory/power-small-machine/template',
        query: { time: new Date().getTime() }
      });
    }
  },
  beforeDestroy() {
    !this.isSubmit && !this.isCancel && this.handleCancel();
  }
};
</script>

<style lang="less" scoped>
.more-power-collapse {
  width: 100%;
  min-height: 100%;
}
</style>
