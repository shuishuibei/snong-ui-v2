<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:41
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-22 16:51:57
 -->
<template>
  <div id="radio-table">
    <i-table
      :columns="columnsRadio"
      :data="data"
      :style="styleSet"
      :loading="config"
      stripe
      @on-select="onSelect"
      @on-select-all="onSelectAll"
      :height="height ? height : void(0)">
    </i-table>
    <div
      class="page-wrapper cds-clearfix cds-margin-top-14"
      v-if="pageOnoff">
      <div class="cds-float-left">共有{{page.totalCount}}条记录，当前页{{page.currentPage}}/{{page.totalPage ? page.totalPage : 1}}页</div>
      <div class="cds-float-right">
        <i-page
          :total="page.totalCount"
          :current="page.currentPage"
          :page-size="page.pageSize"
          :size="pageSize"
          show-sizer
          placement="top"
          @on-change="getTableData({currentPage: $event, pageSize: page.pageSize})"
          @on-page-size-change="getTableData({pageSize: $event})"
          :page-size-opts="pageSizeOpts">
        </i-page>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'H3cTableRadio',
  /**
   * @property {Array}            columns        - 表格列的描述（必传）
   * @property {Array}            data           - 表格的数据（非必传）
   * @property {string}           size           - 表格的尺寸（非必传）
   * @property {Function}         onRadio        - 单选选中之后触发的回调函数（必传）
   * @property {[string, Object]} styleSet       - 样式
   * @property {Object}           select         - 子组件的父级class选择器（必传）
   * @property {Object}           page           - 分页信息（非必传）
   * @property {Function}         getTableData   - 点击页数触发的回调函数（非必传）
   * @property {boolean}          config         - 配置loading（非必传）
   * @property {[string, number]} checkeded      - 是否默认选中（非必传）
   * @property {Array}            pageSizeOpts   - 分页的每页显示多少条（非必传）
   * @property {boolean}          radio          - 是否开启单选（非必传）
   * @property {Function}         onSelect       - 只在多选状态下有效,多选选中时触发（非必传）
   * @property {Function}         onSelectAll    - 只在多选状态下有效,点击全选触发的方法（非必传）
   * @property {boolean}          pageOnoff      - 分页开关（非必传）
   * @property {string}           disabled       - 前端控制是否禁用,默认与id挂钩,传与id对应的值此行单选会被禁用（非必传）
   * @property {string}           backEndField   - 利用后端返回的字段来控制此行是否禁止选中（非必传）
   * @property {number}           height         - 表格高度（非必传）
   * @property {string}           pageSize       - 分页大小（非必传）
   */
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'small'
    },
    onRadio: {
      type: Function,
      default: () => {}
    },
    styleSet: [String, Object],
    select: {
      type: Object,
      required: true
    },
    page: {
      type: Object,
      default: () => {}
    },
    getTableData: {
      type: Function,
      default: () => {}
    },
    config: {
      type: Boolean,
      default: false
    },
    checkeded: {
      type: [String, Number],
      default: ''
    },
    pageSizeOpts: {
      type: Array,
      default: () => [5, 10, 20]
    },
    radio: {
      type: Boolean,
      default: true
    },
    onSelect: {
      type: Function,
      default: () => {}
    },
    onSelectAll: {
      type: Function,
      default: () => {}
    },
    pageOnoff: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: String,
      default: ''
    },
    backEndField: {
      type: String,
      default: 'disabled'
    },
    height: {
      type: Number
    },
    pageSize: {
      type: String
    }
  },
  data() {
    return {
      radioArry: [
        // 单选的render函数和列标签
        {
          title: '选择',
          width: 70,
          key: 'action',
          render: (h, params) => {
            //render函数
            return h('div', [
              h(
                'label',
                {
                  /**
                   * 利用class类名来控制单选是否被选中
                   * ivu-radio-wrapper: true,任何情况下都会被选中
                   * ivu-radio-checked: true,默认选中
                   * ivu-radio-wrapper-disabled: true,禁止次按钮被选中
                   * 非必传,默认值disabled
                   */
                  class: {
                    'ivu-radio-wrapper': true,
                    'ivu-radio-checked':
                      params.row.id === this.checkeded ?
                        true :
                        false || params.row.specificationsName === this.checkeded ?
                        true :
                        false || params.row.name === this.checkeded ?
                        true :
                        false,
                    'ivu-radio-wrapper-disabled':
                      (params.row[this.backEndField] !== undefined &&
                        !params.row[this.backEndField]) ||
                      params.row.id === this.disabled
                  },
                  on: {
                    click: e => {
                      const cancelCheckAll = document.getElementsByClassName(
                        this.select.className
                      )[0]; // 获取表格组件的父级元素
                      var cancelCheck = cancelCheckAll.getElementsByClassName(
                        'ivu-radio-checked'
                      )[0]; //然后获取父级元素下面是否有选中的元素
                      if (cancelCheck) {
                        //如果有给添加类名ivu-radio-wrapper
                        cancelCheck.className = 'ivu-radio-wrapper';
                      }
                      if (e.srcElement.labels) {
                        e.srcElement.labels[0].className += ' ivu-radio-checked';
                        this.onRadio(params);
                      } else if (e.srcElement.parentElement.parentElement.nodeName === 'LABEL') {
                        //兼容IE
                        e.srcElement.parentElement.parentElement.className += ' ivu-radio-checked';
                        this.onRadio(params);
                      }
                    }
                  }
                },
                [
                  h(
                    'span',
                    {
                      class: {
                        'ivu-radio': true,
                        'ivu-radio-disabled':
                          (params.row[this.backEndField] !== undefined &&
                            !params.row[this.backEndField]) ||
                          params.row.id === this.disabled
                      }
                    },
                    [
                      h('span', {
                        class: {
                          'ivu-radio-inner': true
                        }
                      }),
                      h('input', {
                        class: {
                          'ivu-radio-input': true
                        },
                        attrs: {
                          type: 'radio',
                          name: this.select.name,
                          value:
                            params.row.id === this.checkeded ?
                              true :
                              false || params.row.specificationsName === this.checkeded ?
                              true :
                              false || params.row.name === this.checkeded ?
                              true :
                              false,
                          disabled:
                            (params.row[this.backEndField] !== undefined &&
                              !params.row[this.backEndField]) ||
                            params.row.id === this.disabled
                        }
                      })
                    ]
                  )
                ]
              )
            ]);
          }
        }
      ],
      columnsRadio: []
    };
  },
  created() {
    if (this.radio) {
      this.columnsRadio = this.radioArry.concat(this.columns); //将单选的数组和父组件传来的数组合并
    } else {
      this.columnsRadio = this.columns;
    }
  }
};
</script>
<style lang="less" scoped>
#radio-table {
  width: 100%;
  height: 100%;
}
</style>
