<template>

</template>

<script>
import { ref } from '@vue/reactivity'
import { useRoute } from 'vue-router'
export default {
  props: {
    RootMenuList: {
      type: Array,
      default: [
        {
          PowerId: '999',
          PowerName: '系统管理',
          PowerPage: '/system',
          children: [
            {
              PowerId: '999001',
              PowerName: '角色管理',
              PowerPage: '/system/role'
            },
            {
              PowerId: '999002',
              PowerName: '用户',
              PowerPage: '/system/user'
            },
          ]
        },
        {
          PowerId: '001',
          PowerName: '测试管理',
          PowerPage: '/test',
        }
      ]
    }
  },

  setup() {
    const route = useRoute()
    const activeNames = ref('/system')

    return {
      activeNames
    }
  }
}
</script>

<style>

</style>