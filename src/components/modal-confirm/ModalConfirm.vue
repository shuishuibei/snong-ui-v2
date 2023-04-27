<template>
    <Modal ref="confirmModal"
           v-model="visible"
           :title="title"
           :mask-closable="false">
        <div class="conform-body">
            <div class="conform-icon">
                <Icon type="help-circled"></Icon>
            </div>
            <div class="conform-msg">
                <span>{{msg}}</span>
            </div>
        </div>
        <div slot="footer">
            <Button type="primary" @click="submit">确 认</Button>
            <Button  @click="visible=false" style="margin-left: 30px">取 消</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        name: "ModalConfirm",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            msg: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                visible: false
            }
        },
        methods: {
            submit() {
                this.$emit('submitConfirm');
                this.visible = false;
            }
        },
        watch: {
            value(newVal) {
                if (newVal) {
                    this.visible = newVal;
                }
            },
            visible(newVal) {
                if (!newVal) {
                    this.$emit('input', newVal);
                }
            }
        }
    }
</script>

<style scoped>

</style>
