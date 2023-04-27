<!--
 * @Description: 硬盘详情
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-25 14:57:52
 -->
<template>
  <i-modal v-model="visible" :mask-closable="false" :title="title">
    <div style="text-align:left">
      <div class="basic-info-content">
        <ul>
          <li>
            <div class="diskAttr">UUID :</div>
            <div class="diskAttrVal">{{ formObject.id }}</div>
          </li>
          <li>
            <div class="diskAttr">名称 :</div>
            <div class="diskAttrVal">{{ formObject.name }}</div>
          </li>
          <li>
            <div class="diskAttr">运行状态 :</div>
            <div class="diskAttrVal" :style="{color: formObject.statusColor}">
              <div class="cds-status-dot" :style="{backgroundColor: formObject.statusColor}"></div>
              <div style="vertical-align: middle;display: inline-block">{{ formObject.statusLabel }}</div>
            </div>
          </li>
          <li>
            <div class="diskAttr">容量 :</div>
            <div class="diskAttrVal">{{ formObject.size }}GB</div>
          </li>
          <li>
            <div class="diskAttr">可用域 :</div>
            <div class="diskAttrVal">{{ formObject.azoneNameLabel }}</div>
          </li>
          <li>
            <div class="diskAttr">存储规格 :</div>
            <div class="diskAttrVal">{{formObject.storageType == null || formObject.storageType == ''?'普通':formObject.storageType}}</div>
          </li>
          <li>
            <div class="diskAttr">已挂载虚拟机 :</div>
            <div class="diskAttrVal">{{formObject.serverName}}</div>
          </li>
          <li>
            <div class="diskAttr">所有者 :</div>
            <div class="diskAttrVal">{{ formObject.loginName }}</div>
          </li>
          <li>
            <div class="diskAttr">创建时间 :</div>
            <div class="diskAttrVal">{{ formObject.createdDate }}</div>
          </li>
          <li>
            <div class="diskAttr">描述 :</div>
            <div class="diskAttrVal">{{ formObject.description }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer">
      <i-button
        type="primary"
        @click="visible=false">
        关 闭
      </i-button>
    </div>
  </i-modal>
</template>

<script>
import { dataFormat } from '@/assets/js/format';
import { VolumeStatus } from '@/assets/js/status/index.js';

export default {
  name: 'DetailsInfoModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      requires: true
    },
    title: {
      //标题
      type: String,
      requires: true
    }
  },
  data() {
    return {
      visible: false,
      formObject: {}
    };
  },
  watch: {
    value(newVal) {
      if (newVal) {
        /*=== 可修改 start ===*/
        this.formObject = Object.assign({}, this.data);
        let id = this.formObject.id;
        this.$loading.show();
        this.$http
          .get(`volume/${id}`)
          .then(({ data }) => {
            if (data.status) {
              let t = data.data;
              this.formObject = t;
              if (t.createdDate) {
                this.formObject.createdDate = dataFormat(t.createdDate, '-');
              }
              if (t.status) {
                let active = t.status;
                if (active !== null && active !== undefined) {
                  let node = VolumeStatus.filter(item => {
                    return item.value == active;
                  })[0];
                  this.formObject.statusLabel = node.label;
                  this.formObject.statusColor = node.color;
                }
              }
            }
            this.$loading.hide();
          })
          .catch(() => {
            this.$loading.hide();
          });
        /*=== 可修改 end ===*/
        this.$Notice.destroy(); //清楚右上角提示信息
        this.visible = newVal; //显示对话框
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('input', newVal);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.basic-info-content {
  border: 1px solid #dee5ef;
  line-height: 40px;
  color: #666;
  ul {
    list-style: none;
    li:nth-child(odd) {
      background-color: #f5f8fd;
    }
    li {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
    .diskAttr {
      width: 100px;
      float: left;
      text-align: right;
    }
    .diskAttrVal {
      float: right;
      width: calc(~'100% - 100px');
      padding-left: 20px;
    }
  }
}
</style>
