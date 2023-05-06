<!--
 * @Author: cfw2157 yz.caiyijun@h3c.com
 * @Date: 2023-05-04 16:34:03
 * @LastEditors:  yz.caiyijun@h3c.com
 * @LastEditTime: 2023-05-06 10:33:44
 * @FilePath: \snong-ui-v2\src\pages\app\personal-report\project-work\components\WorkList.vue
 * @Description: 点击日历详情展示页面
-->
<template>
  <div class="work-list-wrapper">
    <div class="head">
      <h2>{{ `${projectName}标准化工作清单确认（${date}）` }}</h2>
    </div>
    <div class="menu-bar">
      <i-button type="primary">新建</i-button>
      <i-button style="margin-left: 10px">确认</i-button>
      <i-button style="margin-left: 10px" @click="goBack">返回日历</i-button>
    </div>
    <template v-for="(item, index) in tableList">
      <div class="table-container" v-if="item.data.length > 0" :key="index">
        <h2 class="table-label">{{ item.label }}</h2>
        <Table :columns="columns" :data="item.data" border>
          <template slot-scope="{ row }" slot="action">
            <a @click="upload(row)">上传</a>
            <a @click="download(row)">模板下载</a>
          </template>
        </Table>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    projectName: {
      type: String,
      default: '',
      required: true,
    },
    date: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      dayData: [],
      weekData: [],
      yearData: [],
      quarterData: [],
      monthData: [],
      tempData: [],
      tableData: [
        {
          zoneId: "0888ebdf3831798a0cbdda24815e4519",
          projectName: "四川政务云-西云",
          workId: "26e3d8fc3fb09851c3d72f6efca6ff74",
          workDate: "2023-05-04",
          workStatus: "undone",
          completeNum: 0,
          completeFile: null,
          reviewer: null,
          reviewTime: null,
          executor: null,
          lastExecutTime: null,
          workType: "day",
          workName: "日巡检",
          workContent:
            "早晚各一次对关键软硬件进行巡检（关键软件参考项目产品信息）",
          fixed: false,
          frequency: 2,
        },
        {
          zoneId: "0888ebdf3831798a0cbdda24815e4519",
          projectName: "四川政务云-西云",
          workId: "2ba909fe3925b457a16226e0f1013c17",
          workDate: "2023-05-04",
          workStatus: "undone",
          completeNum: 0,
          completeFile: null,
          reviewer: null,
          reviewTime: null,
          executor: null,
          lastExecutTime: null,
          workType: "day",
          workName: "机房巡检",
          workContent: "服务器、存储、网络、安全、机房环境等巡检",
          fixed: false,
          frequency: 1,
        },
      ],
      columns: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          width: 90,
        },
        {
          title: "工作名称",
          key: "workName",
          align: 'center',
        },
        {
          title: "工作内容和要求",
          key: "workContent",
          align: 'center',
          width: 300,
        },
        {
          title: "执行人",
          align: 'center',
          key: "",
        },
        {
          title: "涉及数据中心",
          align: 'center',
          key: "",
        },
        {
          title: "频次",
          align: 'center',
          key: "",
        },
        {
          title: "涉及BOM",
          align: 'center',
          key: "",
        },
        {
          title: "操作",
          slot: 'action',
          align: 'center'
        },
      ],
    };
  },
  mounted() {
    // 调用接口获取tableData
    this.tableData.forEach((item) => {
        switch (item.workType) {
          case 'day': this.dayData.push(item); break;
          case 'week': this.weekData.push(item); break;
          case 'year': this.yearData.push(item); break;
          case 'quarter': this.quarterData.push(item); break;
          case 'month': this.monthData.push(item); break;
          case 'temp': this.tempData.push(item); break;
          default: break;
        }
    })
  },
  methods: {
    // 上传
    upload(row) {

    },
    // 下载
    download(row) {

    },
    goBack() {
      this.$emit('close');
    }
  },
  computed: {
    tableList() {
      return [
        {
          label: '每日工作',
          data: this.dayData,
        },
        {
          label: '每周工作',
          data: this.weekData,
        },
        {
          label: '每年工作',
          data: this.yearData,
        },
        {
          label: '每季工作',
          data: this.quarterData,
        },
        {
          label: '每月工作',
          data: this.monthData,
        },
        {
          label: '按需工作',
          data: this.tempData,
        },
      ]
    },
  },
};
</script>

<style lang="less" scoped>
.work-list-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .head {
    height: 76px;
    padding: 20px 20px;
    font-size: 16px;
    font-weight: 800;
    border-bottom: 1px solid #ccc;
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
