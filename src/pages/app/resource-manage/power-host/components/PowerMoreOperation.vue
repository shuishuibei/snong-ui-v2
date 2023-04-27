<!--
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-09-05 13:32:10
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-17 15:12:43
 -->
<template>
  <div class="power-host-operation">
    <i-dropdown
      trigger="click"
      :key="tableKey"
      transfer
      transfer-class-name="power-host-dropdown"
      stop-propagation
      @on-click="moreOperate">
      <a href="javascript:void(0)">
        <i class="iconfont icon-gengduo"></i>
      </a>
      <i-dropdown-menu slot="list">
        <i-dropdown-item name="open" class="virtual-dropdown-menu">
          <i class="iconfont icon-kaiqi virtual-op-iconfont-normal"></i>
          <span>开启</span>
        </i-dropdown-item>
        <i-dropdown-item name="close" class="virtual-dropdown-menu">
          <i class="iconfont icon-guanbi virtual-op-iconfont-normal"></i>
          <span>关闭</span>
        </i-dropdown-item>
        <i-dropdown-item name="restart" class="virtual-dropdown-menu">
          <i class="iconfont icon-lvzhou_zhongqi virtual-op-iconfont-normal"></i>
          <span>重启</span>
        </i-dropdown-item>
        <i-dropdown-item name="addNetwork" class="virtual-dropdown-menu">
          <i class="iconfont icon-738bianjiqi_chaolianjie virtual-op-iconfont-normal"></i>
          <span>加载网卡</span>
        </i-dropdown-item>
        <i-dropdown-item name="removeNetwork" class="virtual-dropdown-menu">
          <i class="iconfont icon-739bianjiqi_qingchuchaolianjie virtual-op-iconfont-normal"></i>
          <span>卸载网卡</span>
        </i-dropdown-item>
        <i-dropdown-item name="mountDisk" class="virtual-dropdown-menu">
          <i class="iconfont icon-guazai virtual-op-iconfont-normal"></i>
          <span>挂载硬盘</span>
        </i-dropdown-item>
        <i-dropdown-item name="unloadDisk" class="virtual-dropdown-menu">
          <i class="iconfont icon-xiezai virtual-op-iconfont-normal"></i>
          <span>卸载硬盘</span>
        </i-dropdown-item>
        <i-dropdown-item name="editSpec" class="virtual-dropdown-menu">
          <i class="iconfont icon-guige virtual-op-iconfont-normal"></i>
          <span>更改规格</span>
        </i-dropdown-item>
        <i-dropdown-item name="apply" class="virtual-dropdown-menu">
          <i class="iconfont icon-tuihuozhong virtual-op-iconfont-normal"></i>
          <span>申请退订</span>
        </i-dropdown-item>
      </i-dropdown-menu>
    </i-dropdown>
    <!--添加网卡-->
    <add-network
      v-if="showAdd"
      tips="ip地址不填写将随机分配"
      ref="addNetworkNode"
      :host-id="hostId"
      :tips-flag="tipsFlag"
      @show="(Bool)=>{this.showAdd = Bool}"
      title="加载网卡"></add-network>
    <remove-network
      tips="卸载的网卡会直接删除"
      v-model="flag.removeNet"
      :host-id="hostId"
      :tips-flag="tipsFlag"
      title="卸载网卡"></remove-network>
    <!--挂载硬盘-->
    <power-host-mount-disk
      @_getData="_getData"
      tips="硬盘挂载完成后还需要在虚拟机操作系统中启用或mount新增的硬盘才能对其正常使用"
      v-model="flag.mountDisk"
      :host-id="hostId"
      :tips-flag="tipsFlag"
      title="挂载硬盘"></power-host-mount-disk>
    <!--卸载硬盘-->
    <power-host-uninstall-disk
      tips="卸载硬盘前，建议先在操作系统中停用或umount要卸载的硬盘，以免造成虚拟机操作系统异常"
      v-model="flag.removeDisk"
      :tips-flag="tipsFlag"
      :host-id="hostId"
      title="卸载硬盘"></power-host-uninstall-disk>
    <!--power虚拟机的退订时可以选择要一起退订的power硬盘-->
    <back-disk
      @_getData="_getData"
      v-model="flag.backDisk"
      :host-id="hostId"
      title="选择可同时退订的硬盘"></back-disk>
    <!--更改规格-->
    <change-power-host-edit
      :refresh="_getData"
      apply-list-id=""
      success="成功加入申请变更清单"
      warning="加入申请变更清单失败"
      :server-id="hostId"
      :power-edit-spec="powerEditSpec"
      :name="nameHost"
      text="确 认"
      v-model="showSpec">
    </change-power-host-edit>
  </div>
</template>

<script>
import emitter from '@/assets/js/emitter.js';
import PowerHostMountDisk from './PowerHostMountDisk.vue';
import PowerHostUninstallDisk from './PowerHostUninstallDisk.vue';
import BackDisk from './BackDisk.vue';
import AddNetwork from './AddNetwork.vue';
import RemoveNetwork from './RemoveNetwork.vue';
import ChangePowerHostEdit from './ChangesPowerHostEdit.vue';

export default {
  mixins: [emitter],
  components: {
    'power-host-mount-disk': PowerHostMountDisk,
    'power-host-uninstall-disk': PowerHostUninstallDisk,
    'add-network': AddNetwork,
    'remove-network': RemoveNetwork,
    'back-disk': BackDisk,
    'change-power-host-edit': ChangePowerHostEdit
  },
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      tableKey: 0,
      flag: {
        removeNet: false,
        mountDisk: false,
        backDisk: false,
        removeDisk: false
      },
      applyListId: '',
      powerEditSpec: {},
      nameHost: '', // 主机name
      hostId: '', // 当前主机id
      showBgColor: true,
      tipsFlag: true,
      // 显示添加网卡页面
      showAdd: false,
      // 显示更改规格页面
      showSpec: false
    };
  },
  methods: {
    moreOperate(name) {
      if (this[name]) {
        this[name]();
      }
    },
    _getData() {
      this.$emit('_getDataHost');
    },
    open() {
      this.dispatch('PowerHost', 'openPowerHost', this.params.row);
    },
    close() {
      this.dispatch('PowerHost', 'closePowerHost', this.params.row);
    },
    restart() {
      this.dispatch('PowerHost', 'restartPowerHost', this.params.row);
    },
    addNetwork() {
      this.hostId = this.params.row.id;
      this.showAdd = true;
    },
    removeNetwork() {
      this.flag.removeNet = true;
      this.hostId = this.params.row.id;
    },
    mountDisk() {
      this.flag.mountDisk = true;
      this.hostId = this.params.row.id;
    },
    /**
     * @description: 卸载硬盘
     */
    unloadDisk() {
      this.flag.removeDisk = true;
      this.hostId = this.params.row.id;
    },
    apply() {
      this.flag.backDisk = true;
      this.hostId = this.params.row.id;
    },
    /**
     * @description: 发送退订请求
     */
    submitUnsubscribe() {
      this.loading = true;
      this.$http.delete('power/server/delete/' + this.params.row.id).then(({ data }) => {
        if (data.status) {
          this.$Notice.success({
            desc: '成功加入申请退订清单！'
          });
        }
        this.loading = false;
        this.$emit('_getDataHost'); // 刷新页面
      });
    },

    /**
     * @description: 更改power虚拟机规格
     */
    editSpec() {
      this.hostId = this.params.row.id;
      this.nameHost = this.params.row.name;
      this.$loading.show();
      this.$http({
        url: `power/server/${this.hostId}/flavor`,
        method: 'GET'
      }).then(({ data }) => {
        if (data.status) {
          this.$loading.hide();
          this.powerEditSpec = {
            cpu: data.data.cpu.init,
            memory: data.data.memory.init,
            vcpu: data.data.vcpu.init
          };
          this.showSpec = true;
        }
        this.$loading.hide();
      });
    }
  },
  computed: {
    auths() {
      return this.$store.state.auth.auths;
    }
  }
};
</script>

<style lang="less" scoped>
.virtual-dropdown-menu {
  color: #495060 !important;
}

.virtual-dropdown-menu:hover {
  background: #6299fe;
  color: #fff !important;
}
</style>

