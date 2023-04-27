<template>
  <i-modal
    title="删除实服务"
    v-model="modal9"
    class-name="vertical-center-modal vertical-center-common"
    @on-visible-change="change">
    <i-row style="height:40px" class-name="delete-search">
      <i-col span="4">
      <label class="ivu-form-item-label">实服务</label>
      </i-col>
      <i-col span="14">
      <i-input placeholder="请输入名称进行查询查询" style="height:45px"></i-input>
      </i-col>
      <i-col span="6">
      <i-button
        type="primary"
        icon="ios-search"
        style="background:#78ceff;border:0;width:80%;margin-left:18.8%;height:40px">
        查询
      </i-button>
      </i-col>
    </i-row>
    <i-row style="margin-top:18px">
      <i-col span="4" style="min-height:10px"></i-col>
      <i-col span="20">
      <i-table
        :columns="columns5"
        :data="data5"
        stripe
        size="small"></i-table>
      <i-row class="page-contain">
        <div class="page-left">
          共有{{data5.length}}条记录，当前页1/1页
        </div>
        <div class="page-right">
          <i-page placement="top" size="small"></i-page>
        </div>
      </i-row>
      </i-col>
    </i-row>
    <div slot="footer">
      <i-button type="primary" @click="handleSubmit('formValidate')">确认</i-button>
      <i-button @click="handleReset('formValidate')" style="margin-left: 8px">取消</i-button>
    </div>
  </i-modal>
</template>
<script>
export default {
  name: "DeleteServer",
  props: ["modal10"],
  data() {
    return {
      modal9: false,
      columns5: [
        {
          type: "selection",
          align: "center",
          width: 55
        },
        {
          title: "名称",
          key: "date",
          sortable: true
        },
        {
          title: "IP",
          key: "name",
          sortable: true
        }
      ],
      data5: [
        {
          name: "John Brown",
          date: "2016-10-03"
        },
        {
          name: "John Brown",
          date: "2016-10-03"
        },
        {
          name: "John Brown",
          date: "2016-10-03"
        },
        {
          name: "John Brown",
          date: "2016-10-03"
        },
        {
          name: "John Brown",
          date: "2016-10-03"
        }
      ]
    };
  },
  methods: {
    change(a) {
      this.$emit("DeleteServerchangeValue", a);
    },
  },
  watch: {
    modal10(newValue, oldValue) {
      this.modal9 = this.modal10;
    }
  },
  handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
};
</script>
<style lang="less" scoped>
</style>
<style>
.delete-search .ivu-input {
  height: 40px;
}
.delete-search .ivu-form-item-label {
  height: 40px;
  line-height: 1.5 !important;
}
.vertical-center-modal .ivu-form-item-label:before {
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed3f14;
}
.vertical-center-modal .ivu-form-item-label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 12px;
  color: #495060;
  line-height: 1;
  padding: 10px 12px 10px 0;
  box-sizing: border-box;
}
</style>



