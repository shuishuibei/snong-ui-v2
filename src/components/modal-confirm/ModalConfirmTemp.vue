<template>
    <Modal ref="modalConfirmTemp"
           :value="value"
           class="modal-confirm-temp"
           :title="title"
           :width="width"
           :mask-closable="false"
           @on-cancel="cancel">
        <div :class="bodyBgCls">
            <div class="conform-icon">
                <i :class="iconNameCls"></i>
            </div>
            <div class="conform-info">
                <span>{{info}}</span>
            </div>
            <div class="confirm-warning">{{warning}}</div>
        </div>
        <div class="confirm-slot">
            <slot></slot>
        </div>
        <div slot="footer">
            <Button type="primary" @click="ok">确认</Button>
            <Button  @click="cancel" style="margin-left: 30px">取消</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        name: "ModalConfirmTemp",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            width: {   //对话框宽度
                type: [Number, String]
            },
            showBackgroudColor: {
                type: Boolean,
                default: true
            },
            icon: {
                type: String
            },
            title: {   //标题
                type: String,
                default: '信息确认'
            },
            info: {    //提示信息
                type: String,
                default: ''
            },
            warning: {  //警告信息
                type: String
            }
        },
        computed: {
            bodyBgCls() {
                return this.showBackgroudColor ? 'confirm-body confrim-modal-bg' : 'confirm-body'
            },
            iconNameCls() {
                return [
                    'iconfont',
                    this.icon ? this.icon : 'icon-wenhaofill'
                ]
            },
        },
        methods: {
            ok() {
                this.$emit('input', false);
                this.$emit('on-ok');
            },
            cancel() {
                this.$emit('input', false);
                this.$emit('on-cancel');
            }
        }
    }
</script>

<style lang="less">
    .modal-confirm-temp {
        .confirm-body {
            position: relative;
            padding: 10px;
            text-align: center;
            .conform-icon {
                display: inline-block;
                vertical-align: middle;
                padding-right: 10px;
                .iconfont {
                    font-size: 36px;
                    color: #ff8605;
                }
            }
            .conform-info {
                display: inline-block;
                padding: 10px 0;
                vertical-align: middle;
                font-size: 20px;
                max-width: 70%;
                word-break: break-all;
                text-align: left;
            }
            .confirm-warning {
                color: #ff5d05;
                word-wrap: break-word;
                padding: 0 20px;
                line-height: 24px;
            }
        }
        .confirm-slot {
            text-align: center;
        }
    }
</style>
