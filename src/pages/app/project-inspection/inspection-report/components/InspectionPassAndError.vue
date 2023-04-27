<template>
    <div class="wrap">
        <div class="wrap-top">
        <div :class="{ greenColor: isPass, redColor: !isPass }">
            {{ list.title }}
        </div>
        </div>
        <div class="wrap-bottom" :class="{ textCenter: isPass}">
        <div :class="{ textBox: !isPass}">
            <span>{{ list.count }}</span>
            <span>个</span>
        </div>
        <div v-show="!isPass && list.title !== '巡检未处理项'" class="diff" :class="{ greenColor: list.diffCount <= 0, redColor: list.diffCount > 0 }">
            <Tooltip placement="top">
                <Icon type="arrow-up-c" v-if="list.diffCount > 0"></Icon>
                <Icon type="arrow-down-c" v-if="list.diffCount <= 0"></Icon>
                <span>
                    {{ Math.abs(list.diffCount) }}个
                </span>
                <div slot="content">
                    <p>与上次巡检结果相比，{{ (list.diffCount > 0)?'增加':'减少' }}{{ Math.abs(list.diffCount) }}个</p>
                </div>
            </Tooltip>
        </div>
        </div>
        <div class="circle" v-if="list.other && list.other.length != 0">
            <ul class="circle-ul">
                <li v-for="(item, id) in list.other" :key="id">
                  <div class="node-value">{{ flagType[id] }}</div>
                  <div class="node-value">{{ item }}</div>
                </li>
            </ul>
        </div>
      <div class="circle" v-if="list.node && list.node.length !== 0">
        <ul class="node-ul">
          <li v-for="(item, id) in list.node" :key="id">
              <div class="node-value">{{ nodeType[id] }}</div>
              <div class="node-value">{{ item }}</div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  name: "InspectionPassAndError",
  props: {
    isPass: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Object,
      default: {},
    },
  },
  data() {
      return {
          flagType: ['紧急', '重要', '一般', '提示'],
          nodeType: ['完成','备节点','失败']
      }
  }
};
</script>

<style lang="less" scoped>
.wrap {
  position: relative;
  width: 200px;
  height: 100%;
  background-color: #fff;
  border: 1px solid #d8e0eb;
  .wrap-top {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: green;
    font-weight: bold;
    font-size: 20px;
  }
  .wrap-bottom {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 28px;
    font-weight: bold;
    height: 42px;
    .textBox {
        width: 64%;
        text-align: end;
    }
  }
  .textCenter {
    text-align: center;
  }
  .circle {
      position: absolute;
      top: 84px;
      width: 100%;
      height: 26px;
      text-align: center;
      line-height: 26px;
      padding: 0 20px;
      font-weight: bold;
      .circle-ul {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
          width: 70px;
          height: 30px;
          //border-radius: 50%;
          &:nth-of-type(1) {
            border-left: 8px solid red;
            color: red;
            .tooltip-color {
                color: red;
            }
          }
          &:nth-of-type(2) {
            border-left: 8px solid #ECE50E;
            color: #ECE50E;
            .tooltip-color {
                color:#ECE50E;
            }
          }
          &:nth-of-type(3) {
            border-left: 8px solid skyblue;
            color: skyblue;
            .tooltip-color {
                color:skyblue;
            }
          }
          &:nth-of-type(4) {
            border-left: 8px solid #bbb8b8;
            color: #bbb8b8;
            .tooltip-color {
                color:#bbb8b8;
            }
          }
        }
      }
    .node-ul {
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      li {
        width: 70px;
        height: 30px;
        //border-radius: 50%;
        &:nth-of-type(1) {
          border-left: 8px solid #00CC66;
          margin-left: 5px;
          color: #00CC66;
        }
        &:nth-of-type(2) {
          border-left: 8px solid #3399FF;
          margin-left: 5px;
          color: #3399FF;
        }
        &:nth-of-type(3) {
          border-left: 8px solid #f92727;
          margin-left: 5px;
          color: #f92727;
        }
      }
    }
    .node-value {
      margin-top: -7px;
    }
  }
}
.greenColor {
  color: #00CC66;
}
.redColor {
  color: red;
}
.diff {
    position: absolute;
    left: 64%;
    top: 42%;
    line-height: 1;
    font-size: 16px;
}
</style>
