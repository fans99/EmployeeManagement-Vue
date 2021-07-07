<template>
  <div class="w-full h-24 py-1.5 md:px-24 stick flex justify-between shadow z-50">
    <div class="flex items-center">
      <img class="w-10 h-10 md:w-20 md:h-20 inline-block" src="../assets/logo.png" alt="EM管理系统">
      <span class="bg-color-gradient text-transparent bg-clip-text md:text-4xl text-2xl ml-5 leading-none">EM管理系统</span>
    </div>
    <div class="h-full flex items-center justify-around space-x-8">
      <span class="text-lg text-blue-500 cursor-pointer tracking-xs">{{userName}}</span>
      <button class="btn bg-blue-400 ring-blue-400" type="button" @click="ToSpace">
        <i class="el-icon-user"></i>
        个人中心
      </button>
      <button class="btn bg-red-400 ring-red-400 px-3" type="button" @click="Exit">
        <i class="el-icon-switch-button"></i>
        退&nbsp;出
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/runtime-core'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
export default defineComponent({
  props: {
    userName: String,
    spaceUrl: String,
  },

  setup(props, ctx) {
    const router = useRouter()

    function ToSpace() {
      //router.push(props.spaceUrl)
    }

    function Exit() {
      Cookies.remove('em_token')
      window.location = '/login.html'
    }

    return {
      ToSpace,
      Exit
    }
  }
})
</script>

<style lang="postcss">

</style>