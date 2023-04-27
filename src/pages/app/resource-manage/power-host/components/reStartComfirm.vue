<!--
 * @Description: power虚拟机重启弹窗
 * @Author: lys1626
 * @Date: 2019-09-06 13:38:06
 * @LastEditors: lys1626
 * @LastEditTime: 2019-09-11 17:22:04
 -->
<template>
  <i-modal
    :value="value"
    class="modal-confirm-temp"
    :title="title"
    :mask-closable="false"
    @on-cancel="cancel">
    <div style="padding-bottom: 35px">
      <div :class="bodyBgCls" style="background: #fff;">
        <div class="conform-icon">
          <i :class="iconNameCls"></i>
        </div>
        <div class="conform-info">
          <span>{{info}}</span>
        </div>
      </div>
      <div class="confirm-slot">
        <i-radio-group v-model="reStartType">
          <i-radio label="hard">硬重启</i-radio>
          <i-radio label="soft">软重启</i-radio>
        </i-radio-group>
      </div>
    </div>
    <div slot="footer">
      <i-button type="primary" @click="ok">确 认</i-button>
      <i-button @click="cancel" style="margin-left: 6px">取 消</i-button>
    </div>
  </i-modal>
</template>

<script>
  export default {
    name: 'ReStartComfirm',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      showBgColor: {
        type: Boolean,
        default: false
      },
      icon: {
        type: String
      },
      /* 标题 */
      title: {
        type: String,
        default: '信息确认'
      },
      /* 提示信息 */
      info: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        reStartType: 'hard'
      }
    },
    computed: {
      bodyBgCls() {
        return this.showBgColor ? 'confirm-body confrim-modal-bg' : 'confirm-body'
      },
      iconNameCls() {
        return [
          'iconfont',
          this.icon ? this.icon : 'icon-wenhaofill'
        ]
      },
    },
    methods: {
      ok() {
        this.$emit('input', false);
        this.$emit('on-ok');
      },
      cancel() {
        this.reStartType = 'hard';
        this.$emit('input', false);
        this.$emit('on-cancel');
      }
    },
    watch: {
      value(newVal) {
        if(newVal) {
          this.reStartType = 'hard'
        }
      }
    }
  }
</script>

<style scoped lang="less">
  div.ivu-modal-body {
    background: #ff0000;
  }

  .modal-confirm-temp {
    .confirm-body {
      position: relative;
      padding: 10px;
      text-align: center;

      .conform-icon {
        display: inline-block;
        vertical-align: middle;

        .iconfont:before {
          font-size: 42px;
          color: #ff6600;
          padding-right: 8px;
        }
      }

      .conform-info {
        display: inline-block;
        padding: 10px 0;
        vertical-align: middle;
        font-size: 18px;
        max-width: 70%;
        word-break: break-all;
        text-align: left;
      }

      .confirm-warning {
        color: #ff6600;
        word-wrap: break-word;
        padding: 0 20px;
        line-height: 24px;
      }
    }

    .confirm-slot {
      text-align: center;
    }
  }
</style>
