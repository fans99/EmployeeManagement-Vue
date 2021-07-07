<template>
  <div class="bg-main">
    <div class="space-x-5 -mt-20 mb-10">
      <img class="inline-block md:w-28 md:h-28 w-20 h-20" src="/src/assets/logo.png" alt="EM管理系统">
      <span class="bg-color-gradient text-transparent bg-clip-text md:text-6xl text-4xl leading-none align-middle">EM管理系统</span>
    </div>

    <div class="bg-white h-2/5 min-height-410 w-1/2 lg:w-1/3 xl:w-1/4 min-width-420 rounded-lg p-4 shadow-lg flex flex-col items-center">
      <h1 class="text-3xl text-center m-6">用户登录</h1>
      <p v-if="ErrorTip" class="text-red-400" >{{state.ErrorMessage}}</p>
      <div v-else style="width: 100%; height: 24px;"></div>
      <input type="text" v-model="state.UserAccount" placeholder="请输入用户名" class="input-box w-4/6" />
      <input type="password" v-model="state.UserPwd" placeholder="请输入密码" class="input-box w-4/6" />
      <div class="w-4/6 space-x-8">
        <input type="text" v-model="state.ValidateCode" placeholder="验证码" class="input-box w-28 inline-block" />
        <img class="inline-block cursor-pointer" @click="Refresh" :src="validateImgUrl" alt="验证码" />
      </div>
      <button type="button" class="btn" @click="SignUp">登&nbsp;录</button>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { reactive, ref } from '@vue/reactivity'
import { computed, defineComponent } from '@vue/runtime-core'
import Cookies from 'js-cookie'
import { request } from '/@/network/request'
import apiConfig from '../../api.config'
export default defineComponent({
  setup() {
    const state = reactive({
      ErrorMessage: '',
      UserAccount: '',
      UserPwd: '',
      ValidateCode: ''
    })
    const TipBox = ref('')
    const ErrorTip = ref(computed(() => state.ErrorMessage != ''))
    const validateImgUrl = ref(apiConfig.getValidateImg.url + "?cache=" + Number(Math.random().toString().substr(3,length) + Date.now()).toString(36))

    function Refresh() {
      var rnd = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36)
      validateImgUrl.value = apiConfig.getValidateImg.url + "?cache=" + rnd.toString()
    }

    function SignUp() {
      request({
        url: apiConfig.isLogin.url,
        method: apiConfig.login.method,
        data: {
          UserAccount: state.UserAccount,
          UserPwd: state.UserPwd,
          ValidateCode: state.ValidateCode
        }
      })
      .then(res => {
        if (TipBox.value != '')
          TipBox.value.close()
        if (res.Code != 200){
          state.ErrorMessage = res.ErrorMessage
          TipBox.value = ElMessage({
            message: '登录失败',
            type: 'error',
            showClose: true
          })
        }
        else if (res.Data != null){
          Cookies.set('em_token', res.Data.token, { expires: 1 })
          state.ErrorMessage = ''
          TipBox.value = ElMessage({
            message: '登录成功',
            type: 'success',
            showClose: true
          })
          setTimeout(() => window.location = '/', 500)
        }
      })
      .catch(err => {
        if (TipBox.value != '')
          TipBox.value.close()
        TipBox.value = ElMessage({
          message: '网络错误',
          type: 'warning',
          showClose: true
        })
      })
    }

    return {
      state,
      ErrorTip,
      TipBox,
      validateImgUrl,
      Refresh,
      SignUp
    }
  },

})
</script>

<style lang="postcss">
  .min-height-410{
    min-height: 410px;
  }
  .min-width-420{
    min-width: 420px;
  }
  .bg-main {
    @apply w-screen h-screen flex flex-col items-center justify-center bg-blue-500 bg-opacity-90
  }

  .btn {
    @apply ring p-2 mt-4 w-48 rounded bg-blue-400 text-white hover:bg-opacity-95 focus:ring-offset-1 select-none
  }
</style>