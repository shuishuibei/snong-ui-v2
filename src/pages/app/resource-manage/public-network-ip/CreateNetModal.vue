<!--
 * @Description: 
 * @Author: caiyijun
 * @Date: 2019-08-30 16:00:13
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-12 11:36:48
 -->
<template>
  <div>
    <i-modal v-model="visible" :mask-closable="false" @on-cancel="closeModal">
      <p slot="header">
        <span class="vertical-line"></span>
        <span class="pop-title">新建公网IP</span>
      </p>
      <div>
        <i-form
          ref="formRef"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="100">
          <i-form-item label="选择用户" prop="userName">
            <i-select
              v-model="formValidate.userName"
              @on-change="chooseIdValue"
              label-in-value>
              <i-option
                v-for="item in resourceAreaList"
                :value="item.id" :key="item.id"
                :label="item.loginName">
                {{ item.loginName }}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="名称" prop="name">
            <i-input v-model="formValidate.name" placeholder="请输入名称"></i-input>
          </i-form-item>
          <i-form-item label="公网IP地址池" prop="ips">
            <i-row>
              <i-col span="14">
                <i-input v-model="formValidate.ips"></i-input>
              </i-col>
              <i-col span="2" offset="1">
                <i-button @click="chooseIP()" class="btn">选择公网IP</i-button>
              </i-col>
            </i-row>
          </i-form-item>
          <i-form-item label="公网IP" prop="publicIP">
            <i-input
              v-model="formValidate.publicIP"
              placeholder="如不填系统会自动分配"></i-input>
          </i-form-item>
          <i-form-item label="状态" prop="status">
            <i-radio-group v-model="formValidate.status">
              <i-radio label="start">
                <span>启用</span>
              </i-radio>
              <i-radio label="stop">
                <span>禁止</span>
              </i-radio>
            </i-radio-group>
          </i-form-item>
          <i-form-item label="带宽(Mbps)" prop="size">
            <h3c-step-slider
              v-model="formValidate.size"
              :min="0"
              :max="100"
              :step="10"
              ref="sizeSlider"
              @on-change="changeSlider"></h3c-step-slider>
          </i-form-item>
          <i-form-item label="价格">
            <span class="price" style="color: #FDCA88">200</span>
            <span>CNY/小时</span>
          </i-form-item>
          <i-form-item label="分配" prop="distribution">
            <i-row>
              <i-col span="14">
                <i-input v-model="formValidate.distribution"></i-input>
              </i-col>
              <i-col span="2" offset="1">
                <i-button @click="chooseDistribution()" class="btn">选择分配</i-button>
              </i-col>
            </i-row>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <i-button type="primary" class="save" @click="save()">保存</i-button>
        <i-button class="cancel" @click="closeModal()">取消</i-button>
      </div>
    </i-modal>
    <!--ip地址池-->
    <ip-list-modal
      ref="selectIp"
      @changeCidr="changeCidr"></ip-list-modal>
    <!--分配资源-->
    <res-list-modal
      ref="selectRes"
      :choose-id="chooseId"
      :choose-ip="this.formValidate.ips"
      @changeUser="changeUserName"></res-list-modal>
  </div>
</template>

<script>
  import H3cStepSlider from "@/components/h3c-slider/H3cStepSlider.vue";
  import IpListModal from './IpListModal.vue';
  import ResListModal from './ResListModal2.vue'

  export default {
    name: 'CreateNetModal',
    components: {
      'h3c-step-slider': H3cStepSlider,
      'ip-list-modal': IpListModal,
      'res-list-modal': ResListModal
    },
    props: {
      userName: {
        type: String,
        default: function () {
          return this.$store.state.login.userName;
        }
      }
    },
    data() {
      return {
        chooseId: '',
        // chooseIp:'',
        visible: false,
        resourceAreaList: [],  // 新建硬盘时资源区域数组
        serverList: [],   // 公网IP列表
        formValidate: {
          userName: this.userName,
          name: '',
          ips: '',  // 公网IP地址池
          publicIP: '',
          status: 'start',
          size: 10,
          distribution: ''
        },
        ruleValidate: {
          userName: [{
            required: true,
            message: '所有者不能为空'
          }],
          name: [{
            required: true,
            // pattern: /^[\\u4E00-\\u9FA5A-Za-z0-9][\\u4E00-\\u9FA5A-Za-z0-9.\\-@_]{0,41}$/,
            message: '请输入正确格式的名称'
          }],
          ips: [{
            required: true,
            message: '请选择ip地址池'
          }],
          size: [{
            required: true
          }],
          status: [{
            required: true
          }]
        }
      }
    },
    methods: {
      // 选择公网IP
      chooseIP() {
        this.$refs.selectIp.showModal()
      },
      chooseIdValue(val) {
        this.chooseId = val.value;
      },
      // 选择分配资源
      chooseDistribution() {
        this.$refs.selectRes.showModal();
      },
      // 新建用户时改变子网IP地址池
      changeCidr(address) {
        this.formValidate.ips = address;
      },
      changeUserName() {

      },
      selectUsers() {
        this.$refs.selectUser.showModal();
      },
      showModal() {
        //this.handleReset();
        this.getUsers();
        this.formValidate.size = 100;//自定义组件，需要手动重置
        this.visible = true;
      },
      changeSlider(val) {
        this.formValidate.size = val;
      },
      handleReset() {
        this.$refs['formRef'].resetFields();
      },
      save() {
        /* this.$refs['formRef'].validate((valid) => {
             if (valid) {
             */
        this.$loading.show();
        this.$http.post('volume/add', this.formValidate)
          .then(({data}) => {
            if (data.status) {
              this.closeModal();
            }
            this.$loading.hide();
          })
        /*   }

       })*/
      },
      closeModal() {
        this.visible = false;
        this.$emit('updateDisks');
      },
      // 获取用户列表
      getUsers() {
        this.$http.post('/user/resource/list', {
          "current": 0,
          "pageSize": 10000,
          "searchMap": {}
        }).then(({data}) => {
          if (data.status) {
            let d = data.data;
            this.resourceAreaList = d.records;
            // this.formValidate.ips = d[0].labelName;//默认显示第一个
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./network.less";

  .ivu-form-item {
    margin-bottom: 15px;
  }

  .ivu-modal-footer {
    padding: 0 0 15px 0;
  }

  .ivu-modal-body {
    padding: 10px 20px;
  }

  .icon-yonghu {
    float: left;
    color: #0071BC;
    font-size: 1.2rem;
    cursor: pointer;
    display: inline-block;
  }

  .icon-yonghu + span {
    float: left;
    margin-left: 6px;
    display: inline-block;
  }
</style>
