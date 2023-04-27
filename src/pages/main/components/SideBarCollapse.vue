<!--
 * @Description: 侧边栏（收缩状态）
 * @Author: ys2234
 * @Date: 2019-08-26 11:15:10
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-26 16:33:29
 -->
<template>
    <div class="side-bar-collapse">
        <template v-for="item of menuData">
            <i-dropdown placement="right-start" @on-click="selectMenu" class="dropdown-container" :key="item.name">
                <i-button type="text" class="shrink-btn" @click="selectMenu(item.name)">
                    <template v-if="item.icon && item.icon !== ''">
                        <i class="iconfont" :class="item.icon"></i>
                    </template>
                </i-button>
                <i-dropdown-menu slot="list">
                    <i-dropdown v-if="item.children && item.children.length !== 0" :placement=" item.children? 'right-start' : '' ">
                        <i-dropdown-item :name=" item.name ">
                            {{item.title}}
                            <i-icon type="ios-arrow-forward" v-if="item.children"></i-icon>
                        </i-dropdown-item>
                        <i-dropdown-menu slot="list">
                            <template v-for="secondMenu of item.children">
                                <i-dropdown v-if="secondMenu.children && secondMenu.children.length !== 0" :key="secondMenu.name" :placement=" secondMenu.children? 'right-start' : '' ">
                                    <i-dropdown-item :name=" secondMenu.name ">
                                        {{secondMenu.title}}
                                        <i-icon type="ios-arrow-right" v-if="item.children"></i-icon>
                                    </i-dropdown-item>
                                    <i-dropdown-menu slot="list">
                                        <template v-for="thirdMenu of secondMenu.children">
                                            <i-dropdown-item :name="thirdMenu.name" :key="thirdMenu.name">
                                                {{thirdMenu.title}}
                                            </i-dropdown-item>
                                        </template>
                                    </i-dropdown-menu>
                                </i-dropdown>
                                <i-dropdown-item :name="secondMenu.name" v-else :key="secondMenu.name">
                                    {{secondMenu.title}}
                                </i-dropdown-item>
                            </template>
                        </i-dropdown-menu>
                    </i-dropdown>
                    <i-dropdown-item :name="item.name" v-else>
                        {{item.title}}
                    </i-dropdown-item>
                </i-dropdown-menu>
            </i-dropdown>
        </template>
    </div>
</template>

<script>
export default {
  name: 'SideBarCollapse',
  props: {
    menuData: {
      required: true,
      type: Array
    },
    iconSize: {
      type: Number,
      default: 20
    }
  },
  methods: {
    /**
     * @param {string} name: menuData循环时的item中的name，与路由相匹配
     */
    selectMenu(name) {
      this.$emit('on-router-change', name);
    },
  }
};
</script>

<style lang="less">
@import '../../../assets/css/theme.less';
.side-bar-collapse {
  text-align: center;
  overflow: hidden;
  width: @shrinkMenuWidth;
  .dropdown-container {
    min-width: @shrinkMenuWidth;
    .shrink-btn {
      color: @darkMenuNormalColor;
      display: block;
      width: 100%;
      border-radius: 0;
      height: 40px;
      /* line-height: 40px;*/
      &:hover {
        background-color: @shrinkMenuBtnBgColorActive;
      }
    }

    .ivu-select-dropdown {
      background-color: #2b3245;
      .ivu-dropdown-item {
        background-color: @shrinkDropDownBgColor;
        color: #93989d;
      }
      .ivu-dropdown-item {
        &:hover {
          background-color: @shrinkDropDownBgColorActive;
          color: #fff;
        }
      }
    }
  }
  .ivu-btn-text:focus {
    box-shadow: none;
  }
  .ivu-btn:focus {
    box-shadow: none;
  }

}
</style>