<!--
 * @Description: x86虚拟机模块
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-29 14:21:10
 -->
<template>
  <div class="cds-wrapper cds-border cds-padding-14">
    <!--虚拟机主页面-->
    <div class="cds-clearfix cds-margin-bottom-14">
      <div class="cds-float-left-btn">
        <i-input
          clearable
          class="cds-input-search"
          v-model="queryName"
          :placeholder="'请输入'+hostKey+'名称进行查询'"></i-input>
        <i-button type="primary" class="cds-btn-search" @click="handleSearch">
          <i class="iconfont icon-iconfontsousuo"></i>
        </i-button>
      </div>
      <div class="cds-float-right-btn">
        <i-button type="primary" class="virtual-play" @click="ejectConfirmModal('open')">
          <i class="iconfont icon-kaiqi">开启</i>
        </i-button>
        <i-button type="primary" class="virtual-off" @click="ejectConfirmModal('close')">
          <i class="iconfont icon-guanbi">关闭</i>
        </i-button>
        <i-dropdown @on-click="ejectConfirmModal">
          <i-button type="primary">更多操作</i-button>
          <i-dropdown-menu slot="list">
            <i-dropdown-item name="restart">
              <i class="iconfont icon-lvzhou_zhongqi"> 重 启</i>
            </i-dropdown-item>
            <i-dropdown-item name="hangup">
              <i class="iconfont icon-guaqi"> 挂 起</i>
            </i-dropdown-item>
            <i-dropdown-item name="recovery">
              <i class="iconfont icon-huifu"> 恢 复</i>
            </i-dropdown-item>
          </i-dropdown-menu>
        </i-dropdown>
        <i-button class="cds-btn-refresh" @click="refresh">
          <i class="iconfont icon-shuaxin1"></i>
        </i-button>
      </div>
    </div>
    <div>
      <i-table
          stripe
          highlight-row
          :key="tableKey"
          :data="cloudHostTable.showData"
          :columns="virtualColumns"
          :loading="cloudHostTable.loading"
          no-data-text="暂无数据"
          @on-select="handleSelectSingle"
          @on-select-cancel="handleSelectSingleCancel"
          @on-select-all="handleSelectAll"
          @on-select-all-cancel="handleSelectAllCancel"
          @on-sort-change="sortChange">
      </i-table>
    </div>
    <div class="cds-clearfix cds-margin-top-14">
      <div class="cds-float-left">
        共有{{cloudHostTable.total}}条记录，当前页{{cloudHostTable.current}}/{{cloudHostTable.getPageNum()}}页
      </div>
      <div class="cds-float-right">
        <i-page
          show-sizer
          placement="top"
          :total="cloudHostTable.total"
          :current="cloudHostTable.current"
          :page-size="cloudHostTable.size"
          :page-size-opts="cloudHostTable.pageSizeOpts"
          @on-page-size-change="changePageSize($event, cloudHostTable)"
          @on-change="changePage($event, cloudHostTable)"></i-page>
      </div>
    </div>

    <delete-host ref="deleteHostComponent"></delete-host>
    
    <h3c-modal-table
      ref="mountDiskModal"
      title="挂载硬盘"
      :width="800"
      :tips-flag="true"
      tips="硬盘挂载完成后还需要在虚拟机操作系统中启用或mount新增的硬盘才能对其正常使用。"
      placeholder="请输入名称进行查询"
      :query-flag="true"
      query-key="name"
      :url="availableDiskListUrl"
      :table-item="mountDiskItem">
    </h3c-modal-table>

    <h3c-modal-table
      ref="unloadDiskModal"
      title="卸载硬盘"
      :width="800"
      :tips-flag="true"
      tips="卸载硬盘前，建议先在操作系统中停用或umount要卸载的硬盘，以免造成虚拟机操作系统异常。"
      placeholder="请输入名称进行查询"
      :url="mountedDiskUrl"
      :table-item="mountedDiskItem">
    </h3c-modal-table>
    <h3c-modal-table
      ref="loadNetworkCardModal"
      title="加载虚拟网卡"
      :tips-flag="false"
      query-key="name"
      :url="networkCardUrl"
      :width="800"
      :query-flag="true"
      :table-item="networkCardItem">
    </h3c-modal-table>
    <h3c-modal-table
      :width="800"
      ref="unloadNetworkCardModal"
      title="卸载虚拟网卡"
      :tips-flag="true"
      tips="创建虚拟机时自动创建的虚拟网卡，卸载后会自动删除。CAS虚拟机卸载网卡之后，如需再加载网卡请重启虚拟机，否则会导致加载失败。"
      :url="networkUrl"
      :table-item="networkColumns">
    </h3c-modal-table>
    <!--是否确认开启选中的虚拟机-->
    <h3c-modal-confirm
      :value="modalObj.open.flag"
      :title="modalObj.open.title"
      :info="modalObj.open.info"
      :warning="modalObj.open.warning"
      @on-cancel="cancelModal('open')"
      @on-ok="batchOperHost('open')">
    </h3c-modal-confirm>
    <!--是否确认关闭选中的虚拟机-->
    <h3c-modal-confirm
      :value="modalObj.close.flag"
      :title="modalObj.close.title"
      :info="modalObj.close.info"
      :warning="modalObj.close.warning"
      @on-cancel="cancelModal('close')"
      @on-ok="batchOperHost('close')">
    </h3c-modal-confirm>
    <!--是否确认重启选中的虚拟机-->
    <h3c-modal-confirm
      :value="modalObj.restart.flag"
      :title="modalObj.restart.title"
      :info="modalObj.restart.info"
      :warning="modalObj.restart.warning"
      @on-cancel="cancelModal('restart')"
      @on-ok="batchOperHost('restart')">
    </h3c-modal-confirm>
    <!--是否确认挂起选中的虚拟机-->
    <h3c-modal-confirm
      :value="modalObj.hangup.flag"
      :title="modalObj.hangup.title"
      :info="modalObj.hangup.info"
      :warning="modalObj.hangup.warning"
      @on-cancel="cancelModal('hangup')"
      @on-ok="batchOperHost('hangup')">
    </h3c-modal-confirm>
    <!--是否确认恢复选中的虚拟机-->
    <h3c-modal-confirm
      :value="modalObj.recovery.flag"
      :title="modalObj.recovery.title"
      :info="modalObj.recovery.info"
      :warning="modalObj.recovery.warning"
      @on-cancel="cancelModal('recovery')"
      @on-ok="batchOperHost('recovery')">
    </h3c-modal-confirm>
    
    <change-spec ref="changeSpecModal"></change-spec>
  </div>
</template>

<script>
import virtual from './virtual.js';
export default virtual;
</script>

<style lang="less" scoped>
@import './virtual.less';
</style>
