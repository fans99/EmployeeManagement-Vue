<template>
  <div class="w-48 overflow-hidden border-r bg-blue-50">
    <el-menu
      default-active=""
      background-color="#ffffff"
      text-color="#000000"
      active-text-color="#60A5FA"
      v-if="MenuList != null && MenuList.length > 0"
      :router="true"
      class="shadow">
      <template v-for="item in MenuList" :key="item.PowerId">
        <el-menu-item
          v-if="item.children == null || item.children.length < 1"
          :index="item.PowerPage"
          :title="item.PowerName">
          <template #title>{{item.PowerName}}</template>
        </el-menu-item>
        <el-submenu
          v-else
          :index="item.PowerPage"
          :title="item.PowerName">
          <template #title>{{item.PowerName}}</template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.PowerId"
            :index="child.PowerPage"
            :title="child.PowerName">
            <template #title>{{child.PowerName}}</template>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
    <el-empty v-else description="暂无数据"></el-empty>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  props: {
    MenuList: {
      type: Array,
      default: []
    },
  },

  setup(props, ctx) {
    const activeNames = ref(Array())

    return {
      activeNames,
    }
  },
})
</script>

<style>

</style>