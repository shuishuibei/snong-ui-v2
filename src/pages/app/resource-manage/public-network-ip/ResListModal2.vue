<template>
  <div>
    <i-modal
      v-model="visible"
      :scrollable="true"
      :mask-closable="false"
      @on-cancel="cancel">
      <p slot="header">
        <span class="vertical-line"></span>
        <span class="pop-title">分配资源</span>
      </p>
      <div style="text-align:left">
        <div
          class="tabs"
          style="display: flex;justify-content: flex-start">
          <span
            class="pop-title"
            style="width: 15%;display: inline-block;line-height: 35px">资源类型</span>
          <div
            class="tabs-virtual-machine"
            :class="isShow == 'virtual-machine' ? 'active':''"
            style="width: 20%;height:35px;text-align: center;line-height:35px;border: 1px solid #A5B8E8;border-right: 0;cursor: pointer"
            @click="choose('virtual-machine')">
            虚拟机
          </div>
          <div
            class="tabs-load-balancing"
            :class="isShow == 'load-balancing' ? 'active':''"
            style="width: 20%;height:35px;text-align: center;line-height:35px;border: 1px solid #A5B8E8;cursor: pointer"
            @click="choose('load-balancing')">
            负载均衡
          </div>
        </div>
      </div>
      <div style="text-align:left;margin-top: 20px;">
        <div v-if="isShow == 'virtual-machine'">
          <form-table
            :title-item="netItem"
            :table-data="data1"
            :choosed-id="choosedId"
            ref="loadTable"></form-table>
        </div>

        <div v-else-if="isShow == 'load-balancing'">
          <form-table
            :title-item="netItem"
            :table-data="data2"
            :url="url"
            ref="loadTable"></form-table>
        </div>
      </div>

      <div slot="footer">
        <i-button
          type="primary"
          class="save"
          @click="save()">
          保存
        </i-button>
        <i-button
          class="cancel"
          @click="cancel()">
          取消
        </i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
  import {TablePage} from '@/assets/js/TablePage.js';
  import FormTable from "./FormTable.vue";

  export default {
    name: "ResListModal2",
    components: {
      'form-table': FormTable
    },
    props: {
      chooseId: {
        type: String,
        default: function () {
          return '';
        }
      },
      chooseIp: {
        type: String,
        default: function () {
          return '';
        }
      }
    },
    data() {
      return {
        choosedId: '',
        url: '',
        queryRes: '',
        isShow: 'virtual-machine',
        visible: false,
        resTablePage: new TablePage(),
        auditorSelection: '',
        netItem: [
          {
            title: ' ',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h(
                "RadioGroup",
                {
                  style: {
                    color: "transparent"
                  },
                  on: {
                    "on-change": () => {
                      // this.$set(this.auditorSelection, 0, params.index);
                      this.auditorSelection = params.row.address;
                    }
                  }
                }, [h("Radio", {
                  props: {
                    label: params.index
                  }
                }, params.index)]
              );
            }
          },
          {
            title: '名称',
            key: 'name',
            render: (h, params) => {
              let name = params.row.name;
              return h('div', {
                'class': {tableInfo: true},
                attrs: {title: name},
              }, name)
            }
          }, {
            title: '子网地址',
            key: 'description',
            render: (h, params) => {
              let description = params.row.description;
              return h('div', {
                'class': {tableInfo: true},
                attrs: {title: description},
              }, description)
            }
          }],
        data1: [],
        data2: [
          {
            loginName: 'John Brown',
            address: 'hh'
          }
        ]
      }
    },
    methods: {
      showModal() {
        this.visible = true;
        this.queryRes = '';
        this.getData()
      },

      getData() {
        var _this = this;
        this.resTablePage.setLoading(true);
        if (this.chooseId) {
          this.choosedId = this.chooseId;
          this.$http.post(`/floatingip/list/serverByUser/${this.chooseId}`, {
            "current": this.resTablePage.getCurrentPage(),
            "pageSize": this.resTablePage.getPageSize(),
            "searchMap": {
              "cidr": _this.chooseIp
            }
          }).then(({data}) => {
            _this.resTablePage.setLoading(false);
            if (data.status) {
              let d = data.data;
              this.data1 = d;
              this.setTablePageData(_this.resTablePage, d);
            }
          }).catch(function (error) {
            _this.resTablePage.setLoading(false);
          });
        } else {
          this.visible = false;
        }
      },

      cancel: function () {
        this.visible = false;
      },

      choose: function (str) {
        if (str) {
          this.isShow = str;
        }

        if (str == 'virtual-machine') {
          // 加载虚拟机数据
          this.url = 'virtual-machine';

        } else if (str == 'load-balancing') {
          // 加载负载均衡数据
          this.url = 'load-balancing';
        }
      },
      save: function () {
        // let obj = this.virtualTablePage.getShowData()[this.auditorSelection[0]];
        this.$emit('changeUser', this.auditorSelection);
        this.visible = false;
      }
    }
  }
</script>

<style scoped lang="less">
  .active {
    background: #eaf0fe;
  }
</style>
