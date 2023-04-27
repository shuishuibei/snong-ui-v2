<!--
 * @Description: 日志保留时间配置
 * @Author: ys2234
 * @Date: 2019-09-26 14:22:47
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:32:53
 -->
<template>
  <div class="log-clear">
    <i-form
      ref="form"
      class="log-config"
      :model="formObject"
      :label-width="80">
      <i-form-item label="保留时间">
        <i-select v-model="formObject.cleanLogger" style="width: 200px">
          <i-option
            v-for="item in cleanLoggerList"
            :value="item.value"
            :key="item.value">
            {{ item.label }}
          </i-option>
        </i-select>
      </i-form-item>
    </i-form>
  </div>
</template>

<script>
export default {
  name: 'LogClear',
  data() {
    return {
      cleanLoggerList: [
        {
          label: '一个月',
          value: '1'
        },
        {
          label: '三个月',
          value: '3'
        },
        {
          label: '六个月',
          value: '6'
        },
        {
          label: '十二个月',
          value: '12'
        }
      ],
      formObject: {
        cleanLogger: '12'
      }
    };
  },
  methods: {
    getDefaultValue() {
      this.$http({
        method: 'GET',
        url: '/loginparams/getSysParam/cleanLogger'
      }).then(({ data }) => {
        if (data.status) {
          this.formObject.cleanLogger = data.data.cleanLogger;
        }
      });
    }
  },
  created() {
    this.getDefaultValue();
  }
};
</script>
