<!--
 * @Descripttion:
 * @Author: z12956
 * @Date: 2019-08-21 16:33:18
 * @LastEditors: z12956
 * @LastEditTime: 2019-10-30 16:28:50
 -->
<template>
  <i-modal
    ref="modalDetail"
    v-model="visible"
    class="cds-modal-detail"
    :width="width"
    :mask-closable="false"
    :title="title"
    @on-cancel="ok">
    <div class="modal-content">
      <ul>
        <li class="cds-clearfix" v-for="item in rows" :key="item.key">
          <div class="title" :style="labelStyle">{{item.title}}：</div>
          <h3c-item
            v-if="item.render"
            :render="item.render"
            :data="data[item.key]"
            :column="item"
            :row="data">
          </h3c-item>
          <div v-else class="value" :style="contentStyle">{{data[item.key]}}</div>
        </li>
      </ul>
    </div>
    <div slot="footer">
      <i-button type="primary" @click.native="ok">关闭</i-button>
    </div>
  </i-modal>
</template>

<script>
const H3cItem = {
  name: 'H3cItem',
  functional: true,
  props: {
    render: Function,
    data: {
      type: [Object, Boolean, Number, String, Array, Function]
    },
    row: Object,
    column: Object
  },
  render: (h, ctx) => {
    return ctx.props.render(h, { row: ctx.props.row, column: ctx.props.column});
  }
};

export default {
  name: 'H3cModalDetail',
  components: { H3cItem },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      // 对话框宽度
      type: [Number, String]
    },
    labelWidth: {
      type: [Number, String],
      default: 100
    },
    title: {
      type: String,
      default: '标题'
    },
    rows: {
      type: Array
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    labelStyle() {
      return {
        width: `${this.labelWidth}px`
      };
    },
    contentStyle() {
      return {
        marginLeft: `${this.labelWidth}px`
      };
    }
  },
  methods: {
    ok() {
      this.visible = false;
      this.$emit('on-ok');
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.visible = newVal;
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('input', newVal);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cds-modal-detail {
  .modal-content {
    ul {
      list-style: none;
      border: 1px solid #e9eaec;
      li {
        padding: 10px;
        &:nth-child(odd) {
          background-color: #f5f8fd;
        }
      }
      .title {
        float: left;
        padding-right: 10px;
        text-align: right;
      }
      .value {
        position: relative;
        word-break: break-all;
      }
    }
  }
}
</style>
