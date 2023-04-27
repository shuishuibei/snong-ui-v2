<!--cfw2157-->
<template>
  <div>
    <i-modal v-model="visible" scrollable class-name="modal-content" width="600px">
      <p slot="header">
        <span class="vertical-line"></span>
        <span class="pop-title">信息确认</span>
      </p>
      <div class="info-body">
        <div class="info-content">
          <i class="iconfont icon-wenhaofill"></i>
          <span>{{content}}</span>
          <span v-if="numberFlag">（ 数量:{{selectedNum}}个）</span>
        </div>
        <div class="info-notes">{{notes}}</div>
      </div>
      <div style="text-align: center" v-if="pwdFlag">
        <i-form
          ref="pwdForm"
          :model="pwdForm"
          :rules="pwdFormRules"
          :label-width="240">
          <i-form-item
            label="请输入当前用户密码："
            prop="password"
            style="font-size: 16px">
            <i-input
              type="password"
              clearable
              v-model="pwdForm.password"
              autocomplete="off"></i-input>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <i-button type="primary" class="save" @click="submitHandle()">确 认</i-button>
        <i-button class="cancel" @click="closeModal">取 消</i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
  export default {
    name: 'InfoConfirm',
    data() {
      return {
        visible: false,
        // 删除硬盘密码
        pwdForm: {
          password: ''
        },
        pwdFormRules: {
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    props: {
      // 是否显示输入密码
      pwdFlag: {
        type: Boolean,
        default: false
      },
      // 是否显示删除数量
      numberFlag: {
        type: Boolean,
        default: false
      },
      selectedNum: {
        type: Number,
        default: 0
      },
      content: {
        type: String,
        required: true,
        default: ''
      },
      notes: {
        type: String,
        default: ''
      }
    },
    methods: {
      submitHandle() {
        // 若有密码输入框,则将密码传递出去
        if (this.pwdFlag) {
          this.$refs.pwdForm.validate((valid) => {
            if (valid) {
              this.$emit('makeSure', this.pwdForm.password);
            }
          });
        } else {
          this.$emit('makeSure', {});
        }
      },
      showModal() {
        this.pwdForm.password = '';
        this.visible = true;
      },
      closeModal() {
        this.visible = false;
        this.pwdForm.password = '';
      }
    },
    mounted() {
      this.$on('close', () => {
        this.closeModal();
      })
    }
  }
</script>

<style lang="less" scoped>

  .info-body {
    background-color: #FEEFE6;
    padding: 20px 0;
  }

  .info-content {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 21px;
    text-align: center;
    line-height: 54px;
  }

  .info-notes {
    color: #ff5d05;
    text-align: center;
    padding: 0 10px;
  }

  .icon-wenhaofill {
    color: #ff8605;
    font-size: 36px;
  }

  // 确认弹出框样式
  .warn-content {
    clear: both;
    text-align: center;
    background-color: #FEEFE6;
  }

  .warn-content1 {
    float: left;
    text-align: center;
    height: 100%;
    width: 15%;
    font-size: 20px;
    .problemImg {
      position: relative;
      top: 20%;
      left: 10%;
    }
  }

  .warn-content2 {
    float: left;
    text-align: left;
    height: 100%;
    width: 85%;
    .warn-info {
      font-size: 20px;
      height: 50%;
      position: relative;
      div {
        width: 100%;
        position: absolute;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .notes {
      color: #FF6410;
      height: 50%;
      line-height: 30px;
    }
  }

  .modal-content {
    .ivu-table th {
      background-color: #E2ECF5;
    }
  }

  .iconfont {
    &:before {
      font-size: inherit !important;
    }
  }
</style>
