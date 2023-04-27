<template>
    <Modal ref="modalDetail"
           v-model="visible"
           class="cds-modal-detail"
           :width="width"
           :title="title"
           :mask-closable="false"
           @on-cancel="ok">
        <div class="modal-content">
            <ul>
                <li class="clearfix" v-for="item in rows">
                    <div class="title" :style="labelStyle">{{item.title}}：</div>
                    <Item v-if="item.render"
                          :render="item.render"
                          :data="data[item.key]"
                          :row="data">
                    </Item>
                    <div v-else class="value" :style="contentStyle">{{data[item.key]}}</div>
                </li>
            </ul>
        </div>
        <div slot="footer">
            <Button type="primary" @click.native="ok">关闭</Button>
        </div>
    </Modal>
</template>

<script>
    const Item = {
        name: 'Item',
        functional: true,
        props: {
            render: Function,
            data: {
                type: [Object, Boolean, Number, String, Array, Function]
            },
            row: Object
        },
        render: (h, ctx) => {
            return ctx.props.render(h, {row: ctx.props.row});
        }
    };

    export default {
        name: "ModalDetail",
        components: {Item},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            width: {   //对话框宽度
                type: [Number, String]
            },
            labelWidth: {
                type: [Number, String],
                default: 100
            },
            title: {
                type: String,
                default: '标题'
            },
            rows: {
                type: Array
            },
            data: {
                type: Object
            }
        },
        data() {
            return {
                visible: false
            }
        },
        computed: {
            labelStyle() {
                return {
                    width: `${this.labelWidth}px`
                };
            },
            contentStyle() {
                return {
                    marginLeft: `${this.labelWidth}px`
                };
            }
        },
        methods: {
            ok() {
                this.visible = false;
                this.$emit('on-ok');
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

<style lang="less">
    .cds-modal-detail {
        .modal-content {
            ul {
                list-style: none;
                border: 1px solid #e9eaec;
                li {
                    padding: 6px 10px;
                    &:nth-child(odd) {
                        background-color: #F5F8FD;
                    }
                }
                .title {
                    float: left;
                    padding-right: 10px;
                    text-align: right;
                }
                .value {
                    position: relative;
                    word-break: break-all;
                }
            }
        }
    }
</style>