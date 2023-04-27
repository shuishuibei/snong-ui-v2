<!--
 * @Description Power虚拟机模板创建之后单独每项的表单配置页面
 * @Author ys1983/张睿博
 * @Date 2019-08-29 11:09:21
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:40:46
 -->
<template>
  <i-form
    ref="formValidate"
    :model="formValidate"
    :label-width="300">
    <i-form-item
      label="虚拟机名称"
      :rules="ruleValidate.name"
      prop="name">
      <i-input
        v-model="formValidate.name"
        style="width:300px">
      </i-input>
      <span class="cds-margin-left-10 cds-color-999">只能由字母、数字、短横线组成，且只能以字母开头,字数不超过32</span>
    </i-form-item>
    <i-form-item label="主机">
      <span>{{formValidate.display_name}}</span>
    </i-form-item>
    <i-form-item label="镜像">
      <span>{{formValidate.image_name}}</span>
    </i-form-item>
    <i-form-item
      v-for="item in formValidate.volumes"
      :label="item.name"
      :key="item .id + item.volumeType.name">
      <span>{{item.volumeType.name}}</span>
    </i-form-item>
    <div
      v-for="(item, index) in formValidate.networks"
      :key="item.id + item.name">
      <i-form-item :label="item.type==='MNG'?'管理网名称':'业务网名称'">
        <span>{{item.name}}</span>
      </i-form-item>
      <i-form-item label="IP范围">
        <span>{{item.pools}}</span>
      </i-form-item>
      <i-form-item
        :label="item.type==='MNG'?'管理网IP':'业务网IP'"
        :prop="'networks['+index+'].ip'"
        :rules="ruleValidate.ip">
        <i-input
          v-model="item.ip"
          style="width:300px">
        </i-input>
      </i-form-item>
      <i-form-item
        :label="item.type==='MNG'?'管理网虚拟NIC(%)':'业务网虚拟NIC(%)'"
        :prop="'networks['+index+'].vnicCap'"
        :rules="ruleValidate.vnicCap">
        <i-input
          v-model="item.vnicCap"
          style="width:300px">
        </i-input>
        <span style="margin-left:10px;color:#999">最大可用虚拟NIC：{{item.free_vnic}}%</span>
      </i-form-item>
    </div>
  </i-form>
</template>

<script>
import { required, name, ip, int, max, even } from '@/assets/js/rule-validate.js'; // 引入名称的校验规则
export default {
  name: 'MorePowerCollapseForm',
  props: {
    target: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formValidate: {
        name: '',
        display_name: '',
        image_name: '',
        volumes: [],
        networks: []
      },
      ruleValidate: {
        name: [
          required({ message: '名称不能为空' }),
          name({ message: '只能由字母、数字、短横线组成，且只能以字母开头' })
        ],
        ip: ip({ message: 'ip格式不正确', http: this.ipValidate }),
        vnicCap: [
          required({ message: '管理网虚拟NIC(%)不能为空' }),
          int({ message: '管理网虚拟NIC(%)只能为整数并且不能小于2', min: 1 }),
          max({ message: '管理网虚拟NIC(%)不能大于', max: this.target.networks, key: 'free_vnic' }),
          even({ message: '管理网虚拟NIC(%)必须为偶数' })
        ]
      }
    };
  },
  methods: {
    /**
     * @function ipValidate
     * @description 校验IP是否合法的的方法
     * @param {Function} callback
     * @param {String} ip
     * @returns {void}
     */
    ipValidate(callback, ip) {
      let index = this.formValidate.networks.findIndex(item => item.ip === ip);
      if (index >= 0) {
        this.$http({
          url: 'power/server/check/biz/ip',
          method: 'POST',
          data: this.formValidate.networks[index]
        }).then(({ data }) => {
          if (data.status) {
            callback();
          } else {
            callback(data.message);
          }
        });
      } else {
        callback('ip检测为空值');
      }
    }
  },
  mounted() {
    this.formValidate = JSON.parse(JSON.stringify(this.target));
    this.formValidate.networks.forEach(target => {
      target.vnicCap = target.vnicCap + '';
    });
  }
};
</script>
