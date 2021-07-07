<template>
  <div class="px-20 py-10">
    <div class="grid grid-cols-1 md:grid-cols-3 pb-10 mr-1 grid-rows-1 justify-items-center">
      <div></div>
      <h1 class="text-2xl ">角色管理</h1>
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
        title="角色信息"
        width="30%"
        :before-close="handleClose"
        top="20vh">
        <div>
          <input type="text" class="input-box m-20 w-4/6" v-model="roleName" placeholder="角色名称" />
          <input type="text" class="input-box m-20 w-4/6" v-model="roleRemark" placeholder="角色描述" />
          <div class="mx-20 mt-2">
            <el-select
              v-model="rolePowerListArray"
              multiple
              placeholder="请选择权限">
              <el-option
                v-for="item in PowerAllList"
                :key="item.PowerId"
                :label="item.PowerName"
                :value="item.PowerId">
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
            class="btn bg-blue-400 ring-blue-400" @click="addRole">确&nbsp;定</button>
            <button v-if="dialogType === 'EDIT'"
            class="btn bg-blue-400 ring-blue-400" @click="editRole">确&nbsp;定</button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="">
      <el-table
        :data="roleList"
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
          prop="RoleId"
          label="角色编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="RoleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="RoleRemark"
          label="角色描述">
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
import { computed, defineComponent } from '@vue/runtime-core'
export default defineComponent({
  setup() {
    const roleList = ref(null)
    const multipleSelection = ref([])
    const tipBox = ref(null)
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogType = ref('ADD')
    const PowerAllList = ref([])
    const roleId = ref(0)
    const roleName = ref('')
    const roleRemark = ref('')
    const rolePowerListArray = ref([])
    const rolePowerList = computed(() => {
      var result = ''
      rolePowerListArray.value.forEach(item => {
        result += item
        result += ' '
      })
      result = result.substring(0 ,result.length - 1)
      return result
    })

    function getData() {
      loading.value = true
      request({
        url: apiConfig.getAllRole.url,
        method: apiConfig.getAllRole.method
      })
      .then(res => {
        if (res.Code === 200){
          roleList.value = res.Data
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
        multipleSelection.value.push(item.RoleId)
      });
    }

    function getPower() {
      request({
        url: apiConfig.getAllPower.url.replace('/{id}', ''),
        method: apiConfig.getAllPower.method
      })
      .then(res => {
        if (res.Code === 200)
          PowerAllList.value = res.Data
      })
      .catch(err => {
        console.log(err)
      })
    }

    function editClick(row) {
      getPower()
      roleId.value = row.RoleId
      roleName.value = row.RoleName
      roleRemark.value = row.RoleRemark
      rolePowerListArray.value = row.RolePowerList.split(' ')
      dialogType.value = 'EDIT'
      dialogVisible.value = true
    }

    function editRole() {
      request({
        url: apiConfig.updateRole.url.replace('{id}', roleId.value),
        method: apiConfig.updateRole.method,
        data: {
          RoleName: roleName.value,
          RoleRemark: roleRemark.value,
          RolePowerList: rolePowerList.value
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
      getPower()
      dialogType.value = 'ADD'
      dialogVisible.value = true
    }

    function addRole() {
      request({
        url: apiConfig.createRole.url,
        method: apiConfig.createRole.method,
        data: {
          RoleName: roleName.value,
          RoleRemark: roleRemark.value,
          RolePowerList: rolePowerList.value
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
      roleName.value = ''
      roleRemark.value = ''
      rolePowerListArray.value.length = 0
    }

    function removeClick(row) {
      ElMessageBox.confirm("确定删除该角色？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        request({
          url: apiConfig.deleteRole.url.replace('{id}', row.RoleId),
          method: apiConfig.deleteRole.method
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
      ElMessageBox.confirm("确定删除所选角色？", "提示", {
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
          url: apiConfig.deleteMultipleRole.url,
          method: apiConfig.deleteMultipleRole.method,
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
      roleList,
      multipleSelection,
      tipBox,
      dialogVisible,
      dialogType,
      PowerAllList,
      roleId,
      roleName,
      roleRemark,
      rolePowerList,
      rolePowerListArray,
      loading,
      getData,
      getPower,
      selectedChange,
      handleClose,
      dialogClose,
      addRole,
      addClick,
      editRole,
      editClick,
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