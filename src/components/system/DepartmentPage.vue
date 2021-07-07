<template>
  <div class="px-20 py-10">
    <div class="grid grid-cols-1 md:grid-cols-3 pb-10 mr-1 grid-rows-1 justify-items-center">
      <div></div>
      <h1 class="text-2xl ">部门管理</h1>
      <div class="md:space-x-8 justify-self-end">
        <button class="btn bg-green-400 ring-green-400" @click="dialogVisible = true">
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
        title="部门信息"
        width="30%"
        :before-close="handleClose"
        top="20vh">
        <div>
          <input type="text" class="input-box m-20 w-4/6" :disabled="dialogType === 'EDIT'" v-model="departmentId" placeholder="部门编号" />
          <input type="text" class="input-box m-20 w-4/6" v-model="departmentName" placeholder="部门名称" />
        </div>
        <template #footer>
          <span class=" space-x-5">
            <button class="btn-online hover:text-blue-400 hover:bg-blue-100 hover:border-blue-300"
            @click="() => {dialogVisible = false;departmentName = '';departmentId = ''}">取&nbsp;消</button>
            <button v-if="dialogType === 'ADD'"
            class="btn bg-blue-400 ring-blue-400" @click="addDepartment">确&nbsp;定</button>
            <button v-if="dialogType === 'EDIT'"
            class="btn bg-blue-400 ring-blue-400" @click="editDepartment">确&nbsp;定</button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="">
      <el-table
        :data="departmentList"
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
          prop="DepartmentId"
          label="部门编号"
          width="200">
        </el-table-column>
        <el-table-column
          prop="DepartmentName"
          label="部门名称">
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
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
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  setup() {
    const departmentList = ref(null)
    const multipleSelection = ref([])
    const tipBox = ref(null)
    const dialogVisible = ref(false)
    const dialogType = ref('ADD')
    const departmentId = ref('')
    const departmentName = ref('')
    const loading = ref(false)

    function getData() {
      loading.value = true
      request({
        url: apiConfig.getAllDepartment.url,
        method: apiConfig.getAllDepartment.method
      })
      .then(res => {
        if (res.Code === 200){
          departmentList.value = res.Data
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
        multipleSelection.value.push(item.DepartmentId)
      });
    }

    function editClick(row) {
      departmentId.value = row.DepartmentId
      departmentName.value = row.DepartmentName
      dialogType.value = 'EDIT'
      dialogVisible.value = true
    }

    function editDepartment() {
      request({
        url: apiConfig.updateDepartment.url.replace('{id}', departmentId.value),
        method: apiConfig.updateDepartment.method,
        data: {
          DepartmentName: departmentName.value
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
      dialogVisible.value = false
      departmentId.value = ''
      departmentName.value = ''
    }

    function addDepartment() {
      request({
        url: apiConfig.createDepartment.url,
        method: apiConfig.createDepartment.method,
        data: {
          DepartmentId: departmentId.value,
          DepartmentName: departmentName.value
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

      dialogVisible.value = false
      departmentId.value = ''
      departmentName.value = ''
    }

    function handleClose(done) {
      dialogVisible.value = false
      departmentId.value = ''
      departmentName.value = ''
      done()
    }

    function removeClick(row) {
      ElMessageBox.confirm("确定删除该部门？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        request({
          url: apiConfig.deleteDepartment.url.replace('{id}', row.DepartmentId),
          method: apiConfig.deleteDepartment.method
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
      ElMessageBox.confirm("确定删除所选部门？", "提示", {
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
          url: apiConfig.deleteMultipleDepartment.url,
          method: apiConfig.deleteMultipleDepartment.method,
          data: {
            DepartmentId: targetArr
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
      departmentList,
      multipleSelection,
      tipBox,
      dialogVisible,
      dialogType,
      departmentId,
      departmentName,
      loading,
      getData,
      selectedChange,
      handleClose,
      addDepartment,
      editDepartment,
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