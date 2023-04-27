/*
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-09-23 15:43:12
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-09-24 10:26:42
 */
export default {
  data() {
    return {
      selectAll: [] // 所有被选中的数据，包含当前页和之前页被选中的，
    };
  },
  methods: {
    /**
     * @function handleSelectAll
     * @description 点击全选表格全选触发的方法
     * @param {Array} selection  - 当前页所有选中的数据
     * @returns {void}
     */
    handleSelectAll(selection) {
      let currentSelectAll = [];
      selection.forEach(item => {
        currentSelectAll.push(item[this.keyList.tableKey]);
      });
      this.selectAll = [...new Set([...this.selectAll, ...currentSelectAll])];
    },
    /**
     * @function handleSelectAllCancel
     * @description 取消全选触发的方法
     * @param {Array} selection - 当前页已经选中的数据
     * @returns {void}
     */
    handleSelectAllCancel(selection) {
      this.transformString.forEach(item => {
        this.selectAll = this.selectAll.filter(
          select => item[this.keyList.tableKey] !== select
        );
      });
      this.selectAll = [...new Set(this.selectAll)];
    },
    /**
     * @function handleSelectSingle
     * @description 选中单个时触发的方法
     * @param {Array} selection - 当前页面已选择数据
     * @param {Object} row      - 刚选择的数据行的数据
     * @returns {void}
     */
    handleSelectSingle(selection, row) {
      let index = this.selectAll.findIndex(
        item => item === row[this.keyList.tableKey]
      );
      if (index < 0) {
        this.selectAll.push(row[this.keyList.tableKey]);
      }
    },
    /**
     * @function handleSelectSingleCancel
     * @description 取消单个选择是触发的方法
     * @param {Array} selection - 当前页面已选择数据
     * @param {Object} row      - 刚选择的数据行的数据
     * @returns {void}
     */
    handleSelectSingleCancel(selection, row) {
      let index = this.selectAll.findIndex(
        item => item === row[this.keyList.tableKey]
      );
      if (index > -1) {
        this.selectAll.splice(index, 1);
      }
    },
    /**
     * @function defaultSelect
     * @description 默认选中在this.selectAll里的数据
     * @returns {void}
     */
    defaultSelect() {
      this.transformString.forEach(item => {
        let index = this.selectAll.findIndex(
          select => select === item[this.keyList.tableKey]
        );
        if (index > -1) {
          item._checked = true;
        }
      });
    },
    /**
     * @function disabledSelectSingle
     * @description 根据字段来禁用这行的选择状态
     * @returns {void}
     */
    disabledSelectSingle() {
      this.transformString.forEach(item => {
        item._disabled = item[this.keyList.disabledKey] ? false : true;
      });
    }
  },
  computed: {
    transformString() {
      let {
        dataKey
      } = this.selectTableConfig;
      let data = dataKey.split('.').reduce((key, item) => key[item], this);
      return data;
    },
    keyList() {
      let {
        tableKey,
        dataKey,
        disabledKey
      } = this.selectTableConfig;
      return {
        tableKey,
        dataKey,
        disabledKey
      };
    }
  }
};
