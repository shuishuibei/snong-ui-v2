<!--
 * @Author: cfw2157 yz.caiyijun@h3c.com
 * @Date: 2023-05-04 16:34:03
 * @LastEditors: cfw2157 yz.caiyijun@h3c.com
 * @LastEditTime: 2023-05-08 14:32:46
 * @FilePath: \snong-ui-v2\src\pages\app\personal-report\project-work\components\WorkList.vue
 * @Description: 点击日历详情展示页面
-->
<template>
  <div class="work-list-wrapper">
    <div class="head">
      <h3>
        <span style="color: #3399ff">{{
          `【${projectName}（${date}）】工作任务列表`
        }}</span>
      </h3>
      <i-button class="button" type="primary" @click="goBack">返回</i-button>
    </div>
    <!--    <div class="menu-bar">
      <i-button type="primary" @click="createWork">新建</i-button>
      <i-button style="margin-left: 10px">确认</i-button>
    </div>-->
    <template v-for="(item, index) in tableList">
      <div class="table-container" v-if="item.data.length > 0" :key="index">
        <h2 class="table-label">{{ item.label }}</h2>
        <Table :columns="columns" :data="item.data" border> </Table>
      </div>
    </template>
    <ModalConfirm
      ref="downloadRef"
      v-model="flag.download"
      title="确认模板下载"
      :info="`确认下载当前模板？`"
      @on-ok="submitDownLoad"
      @on-cancel="cancelDownLoad"
      :showBackgroudColor="false"
    >
    </ModalConfirm>
    <ModalConfirm
      ref="checkRef"
      v-model="flag.check"
      title="复核"
      :info="`确认复核当前工作？`"
      @on-ok="submitCheck"
      @on-cancel="cancelCheck"
      :showBackgroudColor="false"
    >
    </ModalConfirm>
    <ModalConfirm
      ref="uploadRef"
      v-model="flag.upload"
      title="上传"
      :info="`确认上传当前工作？`"
      @on-ok="submitUpload"
      @on-cancel="cancelUpload"
      :showBackgroudColor="false"
    >
      <Upload
        multiple
        type="drag"
        action="uploadUrl"
        @on-success="uploadSuccess"
        @on-error="uploadError"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或拖拽文件进行上传</p>
        </div>
      </Upload>
    </ModalConfirm>
  </div>
</template>

<script>
import TableOperation from "./TableOperation.vue";
import ModalConfirm from "@/components/modal-confirm/ModalConfirmTemp";

export default {
  name: "WorkList",
  components: {
    ModalConfirm,
    TableOperation,
  },
  props: {
    projectName: {
      type: String,
      default: "",
      required: true,
    },
    projectId: {
      type: String,
      default: "",
      required: true,
    },
    date: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      uploadUrl: '', // 文件上传的路径
      flag: {
        download: false,
        check: false,
        upload: false,
      },
      downLoadData: {}, // 下载模板数据
      checkData: {}, // 复核数据
      uploadData: {}, // 上传数据
      dayData: [],
      weekData: [],
      yearData: [],
      quarterData: [],
      monthData: [],
      tempData: [],
      tableData: [
        // {
        //   zoneId: "0888ebdf3831798a0cbdda24815e4519",
        //   projectName: "四川政务云-西云",
        //   workId: "26e3d8fc3fb09851c3d72f6efca6ff74",
        //   workDate: "2023-05-04",
        //   workStatus: "undone",
        //   completeNum: 0,
        //   completeFile: null,
        //   reviewer: null,
        //   reviewTime: null,
        //   executor: null,
        //   lastExecutTime: null,
        //   workType: "day",
        //   workName: "日巡检",
        //   workContent:
        //     "早晚各一次对关键软硬件进行巡检（关键软件参考项目产品信息）",
        //   fixed: false,
        //   frequency: 2,
        // }
      ],
      columns: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 90,
        },
        {
          title: "工作名称",
          key: "workName",
          align: "center",
        },
        {
          title: "工作内容和要求",
          key: "workContent",
          width: 300,
        },
        {
          title: "完成数",
          key: "completeNum",
          align: "center",
        },
        {
          title: "频次",
          align: "center",
          key: "frequency",
        },
        {
          title: "执行人",
          align: "center",
          key: "executor",
        },
        {
          title: "执行时间",
          align: "center",
          key: "lastExecutTime",
        },
        {
          title: "复核人",
          align: "center",
          key: "reviewer",
        },
        {
          title: "复核时间",
          align: "center",
          key: "reviewTime",
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          render: (h, params) => {
            return h(TableOperation, {
              props: {
                params,
              },
            });
          },
        },
      ],
    };
  },
  mounted() {
    this.getTableData();
    this.$on("download", (row) => {
      this.flag.download = true;
      this.downLoadData = row;
    });
    this.$on("check", (row) => {
      this.flag.check = true;
      this.checkData = row;
    });
    this.$on("upload", (row) => {
      this.flag.upload = true;
      this.uploadData = row;
    });
  },
  methods: {
    submitDownLoad() {
      // 调用下载接口，当前表格项数据：this.downLoadData
      console.log(this.downLoadData);
    },
    submitCheck() {
      // 调用复核接口，当前表格项数据：this.checkData
      console.log(this.checkData);
    },
    // 
    submitUpload() {
      console.log(this.checkData);
    },
    // 上传成功回调
    uploadSuccess(response, file, fileList) {

    },
    // 上传失败回调
    uploadError(error, file, fileList) {

    },
    cancelDownLoad() {
      this.flag.download = false;
    },
    cancelCheck() {
      this.flag.check = false;
    },
    cancelUpload() {
      this.flag.upload = false;
    },
    getTableData: function () {
      this.$loading.show();
      this.$http
        .get(
          `/projectWorkState/day?projectId=${this.projectId}&date=${this.date}`
        )
        .then(({ data }) => {
          if (data.status) {
            this.tableData = data.data;
            // 调用接口获取tableData
            this.tableData.forEach((item) => {
              switch (item.workType) {
                case "day":
                  this.dayData.push(item);
                  break;
                case "week":
                  this.weekData.push(item);
                  break;
                case "year":
                  this.yearData.push(item);
                  break;
                case "quarter":
                  this.quarterData.push(item);
                  break;
                case "month":
                  this.monthData.push(item);
                  break;
                case "temp":
                  this.tempData.push(item);
                  break;
                default:
                  break;
              }
            });
          }
          this.$loading.hide();
        });
    },
    // 上传
    upload(row) {},
    // 下载
    download(row) {},
    goBack() {
      this.$emit("close");
    },
    close() {},
  },
  computed: {
    tableList() {
      return [
        {
          label: "每日工作",
          data: this.dayData,
        },
        {
          label: "每周工作",
          data: this.weekData,
        },
        {
          label: "每年工作",
          data: this.yearData,
        },
        {
          label: "每季工作",
          data: this.quarterData,
        },
        {
          label: "每月工作",
          data: this.monthData,
        },
        {
          label: "按需工作",
          data: this.tempData,
        },
      ];
    },
  },
};
</script>

<style lang="less" scoped>
.work-list-wrapper {
  width: 100%;
  //height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .head {
    display: flex;
    height: 55px;
    padding: 10px 0;
    font-size: 16px;
    font-weight: 800;
    border-bottom: 4px solid #ccc;
    h3 {
      flex-grow: 1;
    }
    .button {
      margin-right: 10px;
    }
  }
  .menu-bar {
    height: 52px;
    padding: 20px 20px 0 20px;
  }
  .table-container {
    flex-grow: 1;
    padding: 20px 20px;
    .table-label {
      padding-bottom: 10px;
    }
  }
}
</style>
