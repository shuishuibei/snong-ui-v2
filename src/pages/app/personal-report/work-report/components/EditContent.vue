<template>
  <div class="content-container">
    <h3 class="title">
      <B>本周重点工作</B>
    </h3>
    <Input
      type="textarea"
      v-model="content.reportData"
      :rows="6"
      placeholder="请输入本周重点工作内容"
      :readonly="flag == 'preview'"
    />
    <edit-table
      type="project"
      :formData="content.projectData"
      @transferData="getProjectData"
      :flag="flag"
    ></edit-table>
    <edit-table
      type="ability"
      :formData="content.abilityData"
      @transferData="getAbilityData"
      :flag="flag"
    ></edit-table>
    <edit-table
      type="develop"
      :formData="content.developData"
      @transferData="getDevelopData"
      :flag="flag"
    ></edit-table>
    <edit-table
      type="product"
      :formData="content.productData"
      @transferData="getProductData"
      :flag="flag"
    ></edit-table>
    <edit-table
      type="expand"
      :formData="content.expandData"
      @transferData="getExpandData"
      :flag="flag"
    ></edit-table>
    <h3 class="title">
      <B>其他工作</B>
    </h3>
    <div class="progress">
      <div class="pb-box pb-box-3">
        <span class="pb-box-title">本周其他工作</span>
        <Input
          class="pb-box-content"
          type="textarea"
          :rows="6"
          v-model="content.other.mainWork"
          :readonly="flag == 'preview'"
        />
      </div>
      <div class="pb-box pb-box-4">
        <span class="pb-box-title">下周其他计划</span>
        <Input
          class="pb-box-content"
          type="textarea"
          :rows="6"
          v-model="content.other.nextWork"
          :readonly="flag == 'preview'"
        />
      </div>
      <div class="pb-box pb-box-4">
        <span class="pb-box-title">风险与求助</span>
        <Input
          class="pb-box-content"
          type="textarea"
          :rows="6"
          v-model="content.other.riskWork"
          :readonly="flag == 'preview'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EditTable from "./EditTable.vue";

export default {
  name: "work-report-edit-content",
  props: {
    content: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 判断是新增还是预览
    flag: {
      type: String,
      default: "edit",
    },
  },
  components: {
    "edit-table": EditTable,
  },
  data() {
    return {};
  },
  methods: {
    // 获取到组件中传递过来的数据
    getProjectData(data) {
      this.content.projectData = data;
      this.$emit("transferContent", this.content);
    },
    getAbilityData(data) {
      this.content.abilityData = data;
      this.$emit("transferContent", this.content);
    },
    getDevelopData(data) {
      this.content.developData = data;
      this.$emit("transferContent", this.content);
    },
    getProductData(data) {
      this.content.productData = data;
      this.$emit("transferContent", this.content);
    },
    getExpandData(data) {
      this.content.expandData = data;
      this.$emit("transferContent", this.content);
    },
  },
  watch: {
    "content.reportData": {
      handler(newVal, oldVal) {
        this.$emit("transferContent", this.content);
      },
    },
    "content.other": {
      handler(newVal, oldVal) {
        this.$emit("transferContent", this.content);
      },
    },
  },
};
</script>

<style scoped lang="less">
.content-container {
  margin-bottom: 80px;
  .title {
    position: relative;
    padding-left: 8px;
    height: 30px;
    line-height: 30px;
    font-weight: normal;
    border-bottom: 2px solid #d4dee6;
    margin: 10px 0;
    &:before {
      position: absolute;
      background-color: #ff0042;
      width: 3px;
      height: 18px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      content: "";
    }
  }
  .progress {
    border: 1px solid #dadbdf;
    margin-bottom: 10px;
    .pb-box {
      position: relative;
      min-height: 160px;
      max-height: 200px;
      margin-top: 5px;
      margin-left: 5px;
      display: inline-block;
      border: 1px solid #dadbdf;
      border-radius: 3px;
      box-sizing: border-box;
      font-size: 12px;
      .pb-box-title {
        width: 100%;
        height: 25px;
        background-color: #e6f1f7;
        position: absolute;
        text-align: center;
        line-height: 25px;
        color: #64707c;
      }
      .pb-box-content {
        width: 100%;
        position: absolute;
        top: 25px;
        /deep/ .ivu-input {
          border: none !important;
          resize: none;
        }
        /deep/ .ivu-input:hover {
           border: none !important;
         }
        /deep/ textarea:focus {
          outline: none;
          box-shadow: none;
        }
      }
    }
    .pb-box-3 {
      width: 55%;
    }
    .pb-box-4 {
      width: 21%;
    }
  }
}
</style>
