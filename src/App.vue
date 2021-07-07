<template>
  <div class="h-screen flex flex-col" >
    <nav-menu :userName="state.UserName" />
    <div class="flex-1 flex flex-col">
      <el-tabs
        :model-value="activeName"
        type="card"
        @tab-click="clickTab">
        <el-tab-pane
          v-for="item in powerList"
          :key="item.PowerId"
          :label="item.PowerName"
          :name="item.PowerId">
        </el-tab-pane>
      </el-tabs>
      <div class="flex-1 flex">
        <side-bar-menu :MenuList="subMenuList" ref="sideBar" />
        <div class="flex-1 overflow-hidden"><router-view ></router-view></div>
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue'
import { request } from './network/request'
import apiConfig from './api.config'
import Cookies from 'js-cookie'
import { reactive, ref } from '@vue/reactivity'
import { computed, defineComponent } from '@vue/runtime-core'
import SideBarMenu from './components/SideBarMenu.vue'
import { format, findPower } from './utils/power.util'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  components: { NavMenu, SideBarMenu },
  setup() {
    const powerList = ref([])
    const activeName = ref('999')
    const router = useRouter()
    const route = useRoute()
    const subMenuList = computed(() => {
      for (let i = 0; i < powerList.value.length; i++) {
        if (powerList.value[i].PowerId === activeName.value){
          return powerList.value[i].children
        }
      }
      return null
    })

    const state = reactive({
      UserId: undefined,
      UserName: ''
    })

    function clickTab(tab) {
      activeName.value = tab.props.name
      router.push(findPower(tab.props.name, powerList.value).PowerPage)
    }

    return {
      powerList,
      activeName,
      subMenuList,
      state,
      clickTab
    }
  },

  beforeMount() {
    if (!Cookies.get('em_token')){
      window.location = 'login.html'
    }
    else{
      request({
        url: apiConfig.isLogin.url,
        method: apiConfig.isLogin.method
      })
      .then(res => {
        if (res.Data.IsLogin){
          this.state.UserId = res.Data.UserId
          this.state.UserName = res.Data.UserName

          request({
            url: apiConfig.getAllPower.url.replace('{id}', this.state.UserId),
            method: apiConfig.getAllPower.method
          })
          .then(res => {
            if (res.Code === 200)
              this.powerList = format(res.Data)
          })
          .catch(err => {
            console.log(err)
          })
        }
        else{
          window.location = 'login.html'
        }
      })
      .catch(err => {
        console.log(err)
        //window.location = 'login.html'
      })
    }


  },

})
</script>

<style>

</style>
