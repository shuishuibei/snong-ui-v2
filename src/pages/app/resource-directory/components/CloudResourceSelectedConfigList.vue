<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-10-18 11:16:09
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-21 10:58:59
 -->
<template>
  <div
    class="cloud-resource-selected-config-list"
    v-show="value">
    <p class="config-list-header cds-clearfix">
      <span class="cds-float-left">已选配置</span>
      <i
        class="cds-float-right ivu-icon ivu-icon-ios-close"
        @click="$emit('input', false)">
      </i>
    </p>
    <ul
      class="config-list-content"
      v-html="filterHtml">
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CloudResourceSelectedConfigList',
  inheritAttrs: false,
  props: {
    rows: {
      type: Array,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    /**
     * @function _toolStringTransform
     * @description 把lowerCamelCase字符串转换为lowercase-lowercase
     * @param {String} str
     * @returns {String}
     */
    _toolStringTransform(str) {
      let reg = /[A-Z]{1}/g;
      return str.replace(reg, item => `-${item.toLowerCase()}`);
    }
  },
  computed: {
    filterHtml() {
      let html = '';
      this.rows.forEach(item => {
        if (!item.traversing) {
          let key = this._toolStringTransform(item.key);
          html += `
            <li>
              <span class="config-label">${item.title}：</span>
              <span
                class="config-content cds-ellipsis"
                title="${item.template ? item.template(this.$attrs[key]) : this.$attrs[key]}">
                ${item.template ? item.template(this.$attrs[key]) : this.$attrs[key]}
              </span>
            </li>
          `;
        } else {
          let childrenHtml = '';
          let key = this._toolStringTransform(item.key);
          this.$attrs[key].forEach(childrenItem => {
            childrenHtml += `<span
                              title="${item.template(childrenItem)}"
                              class="cds-ellipsis">
                              ${item.template(childrenItem)}
                             </span>`;
          });
          html += `<li>
              <span class="config-label">${item.title}：</span>
              <span class="config-content cds-ellipsis">
                ${childrenHtml}
              </span>
            </li>`;
        }
      });
      return html;
    }
  }
};
</script>

<style lang="less" scoped>
.cloud-resource-selected-config-list {
  position: absolute;
  top: 60px;
  right: 22px;
  width: 365px;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.2);
  z-index: 9999;
  background: #fff;
  .config-list-header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #6e7588;
    padding: 0 15px;
    color: #fff;
    font-size: 14px;
    letter-spacing: 2px;
    .ivu-icon-ios-close {
      height: 40px;
      color: #fff;
      font-size: 31px;
      line-height: 40px;
      margin-right: -10px;
      cursor: pointer;
    }
  }
  .config-list-content {
    width: 100%;
    min-height: calc(~'100% - 40px');
    padding: 24px 15px;
    /deep/ li {
      font-size: 12px;
      width: 100%;
      line-height: 12px;
      &:nth-of-type(2n-1) {
        background: #f6f7f9;
      }
      span {
        display: inline-block;
        padding: 10px 0;
      }
      .config-label {
        width: 125px;
        text-align: right;
        vertical-align: top;
      }
      .config-content {
        > span {
          display: block;
          padding: 0 0 10px 0;
          &:nth-last-of-type(1) {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
