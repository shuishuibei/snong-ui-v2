export default {
  data() {
    return {
      globalTableLoading: true,
      server: [], // X86虚拟机
      volume: [], // X86硬盘
      powerVM: [], // power虚拟机
      powerVolume: [], // power硬盘
      bareMetal: [], // 裸金属没有变更
      port: [], // 虚拟网卡也没有变更
      selectAllList: [],
      selectAllListBackup: [],
      selectAll: true, // 是否全选
      resourcePreflightShow: false,
      resourcePreflightConfirmShow: false,
    }
  },
  methods: {
    /**
     * @function isResourceShow
     * @description 资源是否显示
     * @param {String} key
     * @returns {Boolean}
     */
    isResourceShow(key) {
      return this[key].length > 0 ? true : false;
    },
    /**
     * @function backCloudResourcePage
     * @description 返回云资源页面的方法
     * @returns {void}
     */
    backCloudResourcePage() {
      this.$router.push({
        name: 'resource-directory/index',
        query: {
          time: new Date().getTime()
        }
      });
    },
    /**
     * @function handlerSubmit
     * @description 点击提交订单触发的方法
     * @returns {void}
     */
    handlerSubmit() {
      this.resourcePreflightShow = true;
    },
    /**
     * @function resourcePreflightResult
     * @description 资源预检完成时触发的事件函数
     * @param {Object} option
     * @param {Boolean} option.status
     * @param {String} option.message
     * @returns {void}
     */
    resourcePreflightResult({
      status,
      message
    }) {
      this.resourcePreflightConfirmShow = true;
      this.previewStatus = status;
    },
    /**
     * @function selectSingleResource
     * @description 选中单个资源时触发的方法
     * @param {Array} selection
     * @param {Object} 选中行的数据
     * @returns {void}
     */
    selectSingleResource(selection, row) {
      let {
        applyListId
      } = row;
      this.changeResourceSelect(true, applyListId);
    },
    /**
     * @function changeResourceSelect
     * @description 当资源是否为选中状态时触发
     * @param {Boolean} isSelect
     * @param {String} id
     * @returns {void}
     */
    changeResourceSelect(isSelect, id) {
      if (isSelect) {
        !this.selectAllList.includes(id) && this.selectAllList.push(id);
      } else {
        let index = this.selectAllList.findIndex(item => item === id);
        index > -1 && this.selectAllList.splice(index, 1);
      }
    },
    /**
     * @function changeResourceSelectAll
     * @description 当全选按钮状态改变时触发该方法
     * @param {Boolean} select
     * @returns {void}
     */
    changeResourceSelectAll(select) {
      let refs = ['serverTable', 'volumeTable', 'powerVMTable', 'powerVolumeTable', 'portTable', 'bareMetalTable'];
      refs.forEach(item => {
        this.$refs[item] && this.$refs[item].selectAll(select);
      });
      this.selectAllList = select ? [...this.selectAllListBackup] : [];
    },
    /**
     * @function selectCancelSingleResource
     * @description 取消选中某个资源时触发的方法
     * @param {Array} selection
     * @param {Object} 取消选中行的数据
     * @returns {void}
     */
    selectCancelSingleResource(selection, row) {
      let {
        applyListId
      } = row;
      this.changeResourceSelect(false, applyListId);
    },
    /**
     * @function selectAllResource
     * @description 表格全选时触发
     * @param {Array} selection
     * @returns {void}
     */
    selectAllResource(selection) {
      selection.forEach(item => {
        this.changeResourceSelect(true, item.applyListId);
      });
    },
    /**
     * @function selectCancelAllResource
     * @description 表格全选取消时触发
     * @param {Array} selection
     * @returns {void}
     */
    selectCancelAllResource(selection) {
      selection.forEach(item => {
        this.changeResourceSelect(false, item.applyListId);
      });
    }
  },
  computed: {
    /**
     * @function isAllSelect
     * @description 判断全部的id是否和选中的id相等
     * @returns {Boolean}
     */
    isAllSelect() {
      return this.selectAllList.length === this.selectAllListBackup.length ? true : false;
    },
    /**
     * @function isContentShow
     * @description 判断是否有申请的资源,如果有资源则为true，没有则为false
     * @returns {Boolean}
     */
    isContentShow() {
      let {
        bareMetal,
        port,
        powerVM,
        powerVolume,
        server,
        volume
      } = this;
      let resourceList = [bareMetal, port, powerVM, powerVolume, server, volume];
      return resourceList.some(item => item.length > 0);
    }
  },
  watch: {
    isAllSelect(newValue) {
      this.selectAll = newValue;
    }
  }
}
