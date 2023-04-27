<!--
 * @Description Power虚拟机模板申请主页面
 * @Author ys1983/张睿博
 * @Date 2019-08-22 17:22:57
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 13:57:04
 -->
<template>
  <div class="more-power-small-machine">
    <div v-if="$route.meta.breadcrumb !== '个性配置'">
      <h3c-mall
        title="基本配置"
        class-name="icon-xinxi"
        style-set="#00cc66">
        <template #mallContent>
          <i-form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="150">
            <i-form-item
              label="虚拟机名称"
              prop="name">
              <i-input
                placeholder="请输入虚拟机名称"
                style="width:300px"
                v-model="formValidate.name">
              </i-input>
              <span class="cds-color-999 cds-margin-left-10">只能由字母、数字、短横线组成，且只能以字母开头,字数不超过32</span>
            </i-form-item>
            <i-form-item
              label="业务模板"
              prop="biz_name">
              <i-select
                style="width:300px;"
                v-model="formValidate.biz_name">
                <i-option
                  v-for="item in businessTemplate"
                  :key="item"
                  :value="item">
                  {{item}}
                </i-option>
              </i-select>
            </i-form-item>
            <i-form-item
              label="数量"
              prop="count">
              <i-input
                placeholder="请输入虚拟机数量"
                style="width:300px"
                v-model="formValidate.count">
              </i-input>
            </i-form-item>
            <i-form-item
              label="镜像"
              prop="image_name">
              <i-select
                style="width:300px;"
                v-model="formValidate.image_name">
                <i-option
                  v-for="item in images"
                  :key="item"
                  :value="item">
                  {{item}}
                </i-option>
              </i-select>
            </i-form-item>
            <i-form-item
              label="资源规格"
              prop="specificationsId">
              <i-select
                placeholder="请选择资源规格"
                style="width:300px;"
                @on-change="changeSpecifications"
                v-model="formValidate.specificationsId">
                <i-option
                  v-for="item in specifications"
                  :key="item.id"
                  :value="item.id">
                  {{`处理单元：${item.cpu}、内存：${item.memory}`}}
                </i-option>
              </i-select>
            </i-form-item>
            <i-form-item
              label="处理单元"
              required>
              <span>{{formValidate.units}}</span>
            </i-form-item>
            <i-form-item
              label="内存"
              required>
              <span>{{formValidate.memory}}</span>
            </i-form-item>
            <i-form-item
              label="虚拟机描述"
              prop="description">
              <i-input
                v-model="formValidate.description"
                type="textarea"
                :maxlength="128"
                style="width: 550px;"
                :rows="5"
                placeholder="描述虚拟机用途，例如：ERP系统，字数不超过128">
              </i-input>
            </i-form-item>
            <i-form-item
              label="密码"
              prop="password">
              <i-input
                placeholder="请输入密码"
                :type="passwordIsShow ? 'password' : 'text'"
                style="width: 300px"
                v-model="formValidate.password">
              </i-input>
              <span
                class="password-eye-wrap"
                @click="passwordIsShow = !passwordIsShow">
                <i
                  v-if="passwordIsShow"
                  class="iconfont icon-yincangbukejian">
                </i>
                <i
                  v-else
                  class="iconfont icon-xianshikejian">
                </i>
              </span>
              <span class="cds-margin-left-15 cds-color-999">长度8-20位，必須包含数字、字母和特殊字符(!@#$&*_)这三种类型</span>
            </i-form-item>
            <i-form-item
              label="确认密码"
              prop="confirmPassword">
              <i-input
                placeholder="请输入密码"
                :type="passwordIsShow ? 'password' : 'text'"
                style="width: 300px"
                v-model="formValidate.confirmPassword">
              </i-input>
              <span
                class="password-eye-wrap"
                @click="passwordIsShow = !passwordIsShow">
                <i
                  v-if="passwordIsShow"
                  class="iconfont icon-yincangbukejian">
                </i>
                <i
                  v-else
                  class="iconfont icon-xianshikejian">
                </i>
              </span>
            </i-form-item>
          </i-form>
        </template>
      </h3c-mall>
      <mall-footer
        :handler-submit="handleSubmit"
        submit-title="创建">
      </mall-footer>
    </div>
    <template>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import H3cMall from '@/components/h3c-mall/H3cMall.vue'; // 引入商城分块组件
import MallFooter from '../../components/MallFooter.vue'; // 引入商城提交的页脚
import { required, name, int, password, confirmPassword } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'MorePowerSmallMachine',
  components: {
    'h3c-mall': H3cMall,
    'mall-footer': MallFooter
  },
  data() {
    return {
      formValidate: {
        name: '', // 虚拟机名称
        biz_name: '', // 业务模板名称
        count: '2', // 虚拟机数量
        image_name: '', // 镜像名称
        specificationsId: '', // 规格id
        memory: '', // 规格内存
        units: '', // 处理单元
        description: '', // 虚拟机描述
        password: '', // 密码
        confirmPassword: '' // 确认密码
      },
      ruleValidate: {
        name: [
          required({ message: '虚拟机名称不能为空' }),
          name({ message: '只能由字母、数字、短横线组成，且只能以字母开头' })
        ],
        biz_name: required({ message: '业务模板不能为空' }),
        count: [
          required({ message: '虚拟机数量不能为空' }),
          int({ message: '虚拟机数量只能输入整数且必须大于1', min: 1 })
        ],
        image_name: required({ message: '镜像不能为空' }),
        specificationsId: required({ message: '规格不能为空' }),
        password: [required({ message: '密码不能为空' }), password({ message: '密码不符合要求' })],
        confirmPassword: [
          required({ message: '确认密码不能为空' }),
          confirmPassword({ _this: this })
        ]
      },
      businessTemplate: [], // 业务模板数据
      images: [], // 镜像数据
      specifications: [], // 规格数据
      passwordIsShow: true
    };
  },
  methods: {
    /**
     * @function getBusinessTemplateHttp
     * @description 获取业务模板数据的方法
     * @returns {void}
     */
    getBusinessTemplateHttp() {
      this.$http({
        url: 'power/server/network/alias',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.businessTemplate = data.data;
          this.formValidate.biz_name = data.data[0];
        } else {
          this.businessTemplate = [];
          this.formValidate.biz_name = '';
        }
      });
    },
    /**
     * @function getImageHttp
     * @description 获取镜像数据
     * @returns {void}
     */
    getImageHttp() {
      this.$http({
        url: 'power/server/image/alias',
        method: 'GET'
      }).then(({ data }) => {
        if (data.status && data.data.length > 0) {
          this.images = data.data;
          this.formValidate.image_name = data.data[0];
        } else {
          this.images = [];
          this.formValidate.image_name = '';
        }
      });
    },
    /**
     * @function getSpecificationsHttp
     * @description 获取规格数据
     * @returns {void}
     */
    getSpecificationsHttp() {
      this.$http({
        url: 'power/server/host/all/flavor',
        method: 'POST',
        data: {
          current: 1, //当前页码
          orderMap: {},
          pageSize: 1000, //每条页数
          searchMap: {}
        }
      }).then(({ data }) => {
        if (data.status && data.data.records.length > 0) {
          this.specifications = data.data.records;
          let { id, cpu, memory } = this.specifications[0];
          this.formValidate.specificationsId = id;
          this.formValidate.units = cpu;
          this.formValidate.memory = memory;
        } else {
          this.specifications = [];
          this.formValidate.specificationsId = '';
          this.formValidate.units = '';
          this.formValidate.memory = '';
        }
      });
    },
    /**
     * @function handleSubmit
     * @description 点击创建的时候触发的方法
     * @returns {void}
     */
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.$loading.show();
          let { biz_name, name, count, image_name, memory, units } = this.formValidate;
          count = +count;
          this.$http({
            url: 'power/server/biz',
            method: 'POST',
            data: {
              biz_name,
              count,
              image_name,
              memory,
              name,
              units
            }
          }).then(({ data }) => {
            this.$loading.hide();
            if (data.status) {
              this.$router.push({
                name: 'resource-directory/power-small-machine/template/config',
                query: { time: new Date().getTime() },
                params: { data: data.data, form: this.formValidate }
              });
            } else if (data.code === 700) {
              this.$Notice.error({
                title: '失败',
                desc: data.message
              });
            }
          });
        } else {
          this.$Notice.warning({
            desc: '表单验证未通过'
          });
        }
      });
    },
    /**
     * @function changeSpecifications
     * @description 当资源区域变化的时候触发的方法
     * @param {String} id
     * @returns {void}
     */
    changeSpecifications(id) {
      let { cpu, memory } = this.specifications.find(item => item.id === id);
      this.formValidate.units = cpu;
      this.formValidate.memory = memory;
    }
  },
  mounted() {
    this.getBusinessTemplateHttp();
    this.getImageHttp();
    this.getSpecificationsHttp();
  }
};
</script>

<style lang="less" scoped>
.more-power-small-machine {
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  .password-eye-wrap {
    color: #39f;
    cursor: pointer;
  }
}
</style>
