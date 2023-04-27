<!--
 * @Description: 确认弹出框
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-01 13:27:58
 -->
<template>
  <i-modal
    ref="modalConfirmTemp"
    class-name="modal-confirm-temp"
    :value="value"
    :title="title"
    :width="width"
    :mask-closable="false"
    :closable="closable"
    @on-cancel="cancel">
    <slot name="content">
      <div :class="bodyBgCls">
        <div class="conform-icon" :style="{color: iconColor}">
          <i :class="iconNameCls"></i>
        </div>
        <div class="conform-info">
          <span>{{info}}</span>
        </div>
        <div class="confirm-warning">{{warning}}</div>
      </div>
    </slot>
    <div class="confirm-slot">
      <slot></slot>
    </div>
    <div slot="footer">
      <slot name="footer">
        <i-button type="primary" @click="ok">确 认</i-button>
        <i-button @click="cancel">取 消</i-button>
      </slot>
    </div>
  </i-modal>
</template>

<script>
export default {
  name: 'H3cModalConfirm',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      // 对话框宽度
      type: [Number, String],
      default: 620
    },
    showBackgroundColor: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    iconColor: {
      type: String,
      default: '#ff6600'
    },
    title: {
      // 标题
      type: String,
      default: '信息确认'
    },
    info: {
      // 提示信息
      type: String,
      default: ''
    },
    warning: {
      // 警告信息
      type: String
    },
    validate: {
      // 在确认时是否需要校验表单，表单校验成功才可以关闭对话框，失败时不关闭对话框
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    bodyBgCls() {
      if(this.showBackgroundColor || this.warning) {
        return 'confirm-body confrim-modal-bg';
      } else {
        return 'confirm-body';
      }
    },
    iconNameCls() {
      return ['iconfont', this.icon ? this.icon : 'icon-wenhaofill'];
    }
  },
  methods: {
    ok() {
      if (this.validate) {
          this.$emit('on-ok', () => {
          this.$emit('input', false);
        });
      } else {
        this.$emit('input', false);
        this.$emit('on-ok');
      }
    },
    cancel() {
      this.$emit('input', false);
      this.$emit('on-cancel');
    }
  }
};
</script>

<style lang="less" scoped>
.modal-confirm-temp {
  .confirm-body.confrim-modal-bg {
    background: #fff0e1;
  }
  .confirm-body {
    position: relative;
    padding: 10px;
    text-align: center;

    .conform-icon {
      display: inline-block;
      vertical-align: middle;
      color: #ff6600;

      .iconfont:before {
        font-size: 42px;
        padding-right: 8px;
      }
    }
    .conform-info {
      display: inline-block;
      padding: 10px 0;
      vertical-align: middle;
      font-size: 18px;
      max-width: 75%;
      word-break: break-all;
      text-align: left;
    }
    .confirm-warning {
      color: #ff6600;
      word-wrap: break-word;
      padding: 0 20px 8px 20px;
      line-height: 24px;
    }
  }
  .confirm-slot {
    text-align: center;
  }
}
</style>
