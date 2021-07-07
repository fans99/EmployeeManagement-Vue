<template>
  <div class="px-20 py-10">
    <div class="grid grid-cols-1 md:grid-cols-3 pb-10 mr-1 grid-rows-1 justify-items-center">
      <div></div>
      <h1 class="text-2xl ">用户管理</h1>
      <div class="md:space-x-8 justify-self-end">
        <button class="btn bg-green-400 ring-green-400" @click="addClick">
          <i class="el-icon-plus"></i>
          添&nbsp;加
        </button>
        <button class="btn bg-blue-400 ring-blue-400" @click="getData">
          <i class="el-icon-refresh-left"></i>
          刷&nbsp;新
        </button>
      </div>
      <el-dialog
        :model-value="dialogVisible"
        title="用户信息"
        width="30%"
        :before-close="handleClose"
        top="20vh">
        <div>
          <div class="mx-20 flex w-4/6">
            <div class="w-2/5">
              <el-select
                v-model="departmentId"
                placeholder="请选择部门">
                <el-option
                  v-for="item in departmentList"
                  :key="item.DepartmentId"
                  :label="item.DepartmentName"
                  :value="item.DepartmentId">
                </el-option>
              </el-select>
            </div>
            <div class="w-2/5 ml-10">
              <el-select
                v-model="roleId"
                placeholder="请选择角色">
                <el-option
                  v-for="item in roleList"
                  :key="item.RoleId"
                  :label="item.RoleName"
                  :value="item.RoleId">
                </el-option>
              </el-select>
            </div>
          </div>
          <input type="text" class="input-box mx-20 w-4/6" v-model="userAccount" placeholder="用户名" />
          <input type="password" class="input-box mx-20 w-4/6" v-if="dialogType === 'ADD'" v-model="userPwd" placeholder="密&nbsp;码" />
          <input type="text" class="input-box mx-20 w-4/6" v-model="userRealName" placeholder="真实姓名" />
          <input type="text" class="input-box mx-20 w-4/6" v-model="userSex" placeholder="性&nbsp;别" />
          <input type="number" class="input-box mx-20 w-4/6" v-model="userPhone" placeholder="电&nbsp;话" />
          <div class="mx-20 mt-2">
            <el-select
              v-model="userPowerListArray"
              multiple
              @focus="setSelected(event)"
              :loading="selectLoading"
              placeholder="请选择权限">
              <el-option
                v-for="item in powerAllList"
                :key="item.PowerId"
                :label="item.PowerName"
                :value="item.PowerId"
                :disabled="item.disabled">
                <span class="float-left">{{item.PowerName}}</span>
                <span class="float-right text-blue-400">{{item.PowerId}}</span>
              </el-option>
            </el-select>
          </div>
        </div>
        <template #footer>
          <span class=" space-x-5">
            <button class="btn-online hover:text-blue-400 hover:bg-blue-100 hover:border-blue-300"
            @click="dialogClose">取&nbsp;消</button>
            <button v-if="dialogType === 'ADD'"
            class="btn bg-blue-400 ring-blue-400" @click="addUser">确&nbsp;定</button>
            <button v-if="dialogType === 'EDIT'"
            class="btn bg-blue-400 ring-blue-400" @click="editUser">确&nbsp;定</button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="">
      <el-table
        :data="userList"
        border
        empty-text="暂无数据"
        @selection-change="selectedChange"
        style="margin: 0 auto; width: 100%"
        v-loading="loading">

      <el-table-column
        type="selection"
        width="50">
      </el-table-column>

        <el-table-column
          prop="UserId"
          label="用户编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="DepartmentName"
          label="所属部门">
        </el-table-column>
        <el-table-column
          prop="RoleName"
          label="角&nbsp;色">
        </el-table-column>
        <el-table-column
          prop="UserAccount"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="UserRealName"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="UserSex"
          label="性&nbsp;别">
        </el-table-column>
        <el-table-column
          prop="UserPhone"
          label="电&nbsp;话">
        </el-table-column>
        <el-table-column
          prop="UserStatus"
          label="状&nbsp;态"
          width="200">
          <template #default="scope">
            <span
              v-if="scope.row.UserStatus"
              class="text-green-400 link select-none"
              @click="toggleState(scope.row)">正常</span>
            <span
              v-else
              class="text-red-400 link select-none"
              @click="toggleState(scope.row)">禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template #default="scope">
            <span class="text-indigo-400 link select-none" @click="editClick(scope.row)">编辑</span>
            <span class="text-red-400 link select-none" @click="removeClick(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-5">
        <button
          class="btn-online hover:bg-red-100 hover:border-red-300 hover:text-red-400"
          @click="removeAll">
          删除所有选择项
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { request } from '/@/network/request'
import apiConfig from '../../api.config'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, watch } from '@vue/runtime-core'
import { simplify } from '../../utils/power.util'
export default defineComponent({
  setup() {
    const userList = ref(null)
    const multipleSelection = ref([])
    const tipBox = ref(null)
    const loading = ref(false)
    const selectLoading = ref(false)
    const dialogVisible = ref(false)
    const dialogType = ref('ADD')
    const powerAllList = ref([])
    const departmentList = ref([])
    const roleList = ref([])
    const userId = ref(0)
    const roleId = ref('')
    const departmentId = ref('')
    const userAccount = ref('')
    const userPwd = ref('')
    const userRealName = ref('')
    const userSex = ref('')
    const userPhone = ref('')
    const rolePowerListArray =ref([])
    const userPowerListArray = ref([])
    const userPowerList = ref('')

    watch(userPowerListArray, (value, oldValue) => {
      var aux = []
      value.forEach(i => {
        rolePowerListArray.value.forEach(j => {
          if (i != j)
            aux.push(i)
        })
      })
      var result = ''
      aux.forEach(item => {
        result += item
        result += ' '
      })
      userPowerList.value = result.substring(0 ,result.length - 1)
    })

    function getData() {
      loading.value = true
      request({
        url: apiConfig.getAllUser.url,
        method: apiConfig.getAllUser.method,
      })
      .then(res => {
        if (res.Code === 200){
          userList.value = res.Data
        }
        else{
          if (tipBox.value != null)
            tipBox.value.close()

          tipBox.value = ElMessage({
            message: '数据获取失败',
            type: 'error',
            showClose: true
          })
        }
        loading.value = false
      })
      .catch(err => {
        console.log(err)
        loading.value = false
      })
    }

    function selectedChange(selection) {
      multipleSelection.value.length = 0
      selection.forEach(item => {
        multipleSelection.value.push(item.UserId)
      });
    }

    function setSelected(event) {
      selectLoading.value = true
      powerAllList.value.forEach(i => {
        rolePowerListArray.value.forEach(j => {
          if (i.PowerId === j){
            i["disabled"] = true
          }
        })
      })
      selectLoading.value = false
    }

    function getPower() {
      request({
        url: apiConfig.getAllPower.url.replace('/{id}', ''),
        method: apiConfig.getAllPower.method
      })
      .then(res => {
        if (res.Code === 200)
          powerAllList.value = res.Data
      })
      .catch(err => {
        console.log(err)
      })
    }

    function getDepartmentList() {
      request({
        url: apiConfig.getAllDepartment.url,
        method: apiConfig.getAllDepartment.method
      })
      .then(res => {
        if (res.Code === 200)
          departmentList.value = res.Data
      })
      .catch(err => {
        console.log(err)
      })
    }

    function getRoleList() {
      request({
        url: apiConfig.getAllRole.url,
        method: apiConfig.getAllRole.method
      })
      .then(res => {
        if (res.Code === 200)
          roleList.value = res.Data
      })
      .catch(err => {
        console.log(err)
      })
    }

    function getUserPower(roleId, userPowerList) {
      request({
        url: apiConfig.getPowerToRole.url.replace('{id}', roleId),
        method: apiConfig.getPowerToRole.method
      })
      .then(res => {
        if (res.Code === 200){
          res.Data.forEach(item => {
            rolePowerListArray.value.push(item.PowerId)
          })
          userPowerList.split(' ').forEach(item => {
            userPowerListArray.value.push(item)
          })
          rolePowerListArray.value = simplify(rolePowerListArray.value)
          userPowerListArray.value = userPowerListArray.value.concat(rolePowerListArray.value)
          userPowerListArray.value = userPowerListArray.value.filter(item => item && item.trim())
        }
      })
      .catch(err => {
        console.log(err)
      })
    }

    function editClick(row) {
      getDepartmentList()
      getRoleList()
      getUserPower(row.RoleId, row.UserPowerList)
      getPower()
      roleId.value = row.RoleId
      departmentId.value = row.DepartmentId
      userAccount.value = row.UserAccount
      userRealName.value = row.UserRealName
      userSex.value = row.UserSex
      userPhone.value = row.UserPhone
      dialogType.value = 'EDIT'
      dialogVisible.value = true
    }

    function editUser() {
      request({
        url: apiConfig.updateUser.url.replace('{id}', roleId.value),
        method: apiConfig.updateUser.method,
        data: {
          RoleId: roleId.value,
          DepartmentId: departmentId.value,
          UserId: userId.value,
          UserAccount: userAccount.value,
          UserRealName: userRealName.value,
          UserSex: userSex.value,
          UserPhone: userPhone.value,
          UserPowerList: userPowerList.value
        }
      })
      .then(res => {
        if (tipBox.value != null)
          tipBox.value.close()
        if (res.Code === 200){
          tipBox.value = ElMessage({
            message: '修改成功',
            type: 'success',
            showClose: true
          })
        }
        else{
          tipBox.value = ElMessage({
            message: '修改失败',
            type: 'error',
            showClose: true
          })
        }
        getData()
      })
      .catch(err => {
        if (tipBox.value != null)
          tipBox.value.close()
        tipBox.value = ElMessage({
          message: '修改失败',
          type: 'error',
          showClose: true
        })
        console.log(err)
      })
      dialogClose()
    }

    function addClick() {
      getDepartmentList()
      getRoleList()
      getPower()
      dialogType.value = 'ADD'
      dialogVisible.value = true
    }

    function addUser() {
      request({
        url: apiConfig.createUser.url,
        method: apiConfig.createUser.method,
        data: {
          RoleId: roleId.value,
          DepartmentId: departmentId.value,
          UserId: userId.value,
          UserAccount: userAccount.value,
          UserPwd: userPwd.value,
          UserRealName: userRealName.value,
          UserSex: userSex.value,
          UserPhone: userPhone.value,
          UserPowerList: userPowerList.value
        }
      })
      .then(res => {
        if (tipBox.value != null)
          tipBox.value.close()

        if (res.Code === 200 && res.Data === true){
          tipBox.value = ElMessage({
            message: '添加成功',
            type: 'success',
            showClose: true
          })
        }
        else{
          tipBox.value = ElMessage({
            message: '添加失败',
            type: 'error',
            showClose: true
          })
        }
        getData()
      })
      .catch(err => {
        if (tipBox.value != null)
          tipBox.value.close()
        tipBox.value = ElMessage({
          message: '添加失败',
          type: 'error',
          showClose: true
        })
        console.log(err)
      })
      dialogClose()
    }

    function handleClose(done) {
      dialogClose()
      done()
    }

    function dialogClose() {
      dialogVisible.value = false
      roleId.value = ''
      departmentId.value = ''
      userAccount.value = ''
      userPwd.value = ''
      userRealName.value = ''
      userSex.value = ''
      userPhone.value = ''
      rolePowerListArray.value.length = 0
      userPowerListArray.value.length = 0
    }

    function toggleState(row) {
      request({
        url: apiConfig.updateUserToStatus.url.replace('{id}', row.UserId).replace('{status}', !row.UserStatus),
        method: apiConfig.updateUserToStatus.method
      })
      .then(res => {
        if (res.Code === 200)
          getData()
        else{
          if (tipBox.value != null)
            tipBox.value.close()
          tipBox.value = ElMessage({
            message: '修改失败',
            type: 'error',
            showClose: true
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }

    function removeClick(row) {
      ElMessageBox.confirm("确定删除该用户？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        request({
          url: apiConfig.deleteUser.url.replace('{id}', row.UserId),
          method: apiConfig.deleteUser.method
        })
        .then(res => {
          if (tipBox.value != null)
            tipBox.value.close()

          if (res.Code === 200){
            tipBox.value = ElMessage({
              message: '删除成功',
              type: 'success',
              showClose: true
            })
          }
          else{
            tipBox.value = ElMessage({
              message: '删除失败',
              type: 'error',
              showClose: true
            })
          }
          getData()
        })
        .catch(err => {
          console.log(err)
        })
      })
      .catch(() => {})
    }

    function removeAll() {
      ElMessageBox.confirm("确定删除所选用户？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        var targetArr = []
        multipleSelection.value.forEach(item => {
          targetArr.push(item)
        })

        request({
          url: apiConfig.deleteMultipleUser.url,
          method: apiConfig.deleteMultipleUser.method,
          data: {
            RoleId: targetArr
          }
        })
        .then(res => {
          if (tipBox.value != null)
            tipBox.value.close()

          tipBox.value = ElMessage({
            message: '成功删除' + res.Data.count + '条记录',
            type: 'success',
            showClose: true
          })
          getData()
        })
        .catch(err => {
          console.log(err)
          if (tipBox.value != null)
            tipBox.value.close()

          tipBox.value = ElMessage({
            message: '删除失败',
            type: 'error',
            showClose: true
          })
        })
      })
      .catch(() => {})
    }

    return {
      userList,
      multipleSelection,
      tipBox,
      dialogVisible,
      dialogType,
      powerAllList,
      departmentList,
      roleList,
      userId,
      roleId,
      departmentId,
      userAccount,
      userPwd,
      userRealName,
      userSex,
      userPhone,
      userPowerList,
      userPowerListArray,
      rolePowerListArray,
      loading,
      selectLoading,
      getData,
      getPower,
      getDepartmentList,
      getRoleList,
      getUserPower,
      setSelected,
      selectedChange,
      handleClose,
      dialogClose,
      addUser,
      addClick,
      editUser,
      editClick,
      toggleState,
      removeClick,
      removeAll,
    }
  },

  beforeMount() {
    this.getData()
  }
})
</script>

<style>

</style>