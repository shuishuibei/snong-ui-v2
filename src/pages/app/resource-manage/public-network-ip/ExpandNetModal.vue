<template>
  <div>
    <i-modal
      v-model="visible"
      width="500px"
      @on-cancel="closeModal">
      <p slot="header">
        <span class="vertical-line"></span>
        <span class="pop-title">设置带宽</span>
      </p>
      <div style="text-align:left">
        <i-row>
          <i-col span="5">公网IP</i-col>
          <i-col span="15">{{publicNetName}}</i-col>
        </i-row>
        <br>
        <i-row>
          <i-col span="5">带宽（Mbps）</i-col>
          <i-col span="18">
            <h3c-step-slider
              v-model="size"
              :min="min"
              :max="1000"
              :step="100"
              @on-change="changeSlider">
            </h3c-step-slider>
          </i-col>
        </i-row>
        <br>
      </div>
      <div slot="footer">
        <i-button type="primary" class="save" @click="expandNetworkSize()">确 认</i-button>
        <i-button class="cancel" @click="visible=false">取 消</i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
  import H3cStepSlider from "@/components/h3c-slider/H3cStepSlider.vue";

  export default {
    name: "ExpandNetModal",
    components: {
      'h3c-step-slider': H3cStepSlider,
    },
    data() {
      return {
        publicNetId: '',
        publicNetName: '',
        visible: false,
        size: 100,
        min: 0
      }
    },
    methods: {
      showModal(id, name, size) {
        this.visible = true;
        this.publicNetId = id;
        this.publicNetName = name;
        this.min = size;
        this.size = size;
      },
      expandNetworkSize() {
        this.$loading.show();
        this.$http.post(`volume/expand/${this.publicNetId}/${this.size}`)
          .then(({data}) => {
            if (data.status) {
              this.$Notice.success({desc: '带宽设置成功!'});
              this.$emit('updateNets');
            }
            this.closeModal();
            this.$loading.hide();
          });
      },
      closeModal() {
        this.visible = false;
      },
      changeSlider(val) {
        this.size = val;
      }
    }
  }
</script>
