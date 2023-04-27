<!--
 * @Description: 用户注册配置
 * @Author: ys2234
 * @Date: 2019-09-26 13:56:10
 * @LastEditors: ys2234
 * @LastEditTime: 2019-11-04 16:31:57
 -->
<template>
  <div class="cmd-config">
    <Form
      ref="formCmd"
      :model="formObject"
      :label-width="80">
      <FormItem v-for="(item, index) in this.cmdList"
                :key="index"
                :label="'命令' + index">
        <Row>
          <Col span="6">
            <Input type="text" v-model="item.value" placeholder="请输入命令"></Input>
          </Col>
          <Col span="4" offset="1">
            <i class="icon-common icon-dynamic iconfont icon-plus" @click="addCmd"></i>
            <i class="icon-common icon-dynamic iconfont icon-shanchu" @click="removeCmd(index)"></i>
          </Col>
        </Row>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'CmdConfig',
  props: {
    data: {
      type: String,
      default: 'close'
    }
  },
  data() {
    return {
      formObject: {
      },
      cmdList : [{
        value:''
      }],
    };
  },
  methods: {
    // 添加命令
    addCmd() {
      this.cmdList.push({
        value:''
      });
    },
    // 移除命令
    removeCmd(index) {
      if (this.cmdList.length > 1) {
        this.cmdList.splice(index, 1);
      }
    },
    getDefaultValue() {
      this.$http({
        method: 'GET',
        url: '/loginparams/cmdStrings'
      }).then(({ data }) => {
        if (data.status) {
          this.cmdList = [];
          if (data.data.length > 0) {
            data.data.forEach((v) => {
              this.cmdList.push({
                value: v
              });
            });
          } else {
            this.cmdList.push({
              value: ''
            })
          }
        }
      });
    }
  },
  created() {
    this.getDefaultValue();
  }
};
</script>
<style lang="less">
.cmd-config {
  .icon-common {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    vertical-align: middle;
    margin: 0 2px;
    position: relative;
    background-color: #2b99ff;
    cursor: pointer;
    &::before {
      color: #fffcf6;
      font-size: 12px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

</style>
