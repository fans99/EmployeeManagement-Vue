//? 网站根目录
const root = 'http://localhost:49894/'

export default {
  //? `{id}`将替换为参数
  isLogin: {
    url: root + 'api/user/login',
    method: 'GET'
  },

  login: {
    url: root + 'api/user/login',
    method: 'POST'
  },

  getValidateImg: {
    url: root + 'api/image/validate',
    method: 'GET'
  },

  getAllUser: {
    url: root + 'api/user',
    method: 'GET'
  },

  getUser: {
    url: root + 'api/user/{id}',
    method: 'GET'
  },

  createUser: {
    url: root + 'api/user',
    method: 'POST'
  },

  updateUser: {
    url: root + 'api/user/{id}',
    method: 'PUT'
  },

  updateUserToStatus: {
    url: root + 'api/user/status?id={id}&status={status}',
    method: 'PUT'
  },

  deleteUser: {
    url: root + 'api/user/{id}',
    method: 'DELETE'
  },

  deleteMultipleUser: {
    url: root + 'api/user/deletemultiple',
    method: 'POST'
  },

  getAllRole: {
    url: root + 'api/role',
    method: 'GET'
  },

  getRole: {
    url: root + 'api/role/{id}',
    method: 'GET'
  },

  createRole: {
    url: root + 'api/role',
    method: 'POST'
  },

  updateRole: {
    url: root + 'api/role/{id}',
    method: 'PUT'
  },

  deleteRole: {
    url: root + 'api/role/{id}',
    method: 'DELETE'
  },

  deleteMultipleRole: {
    url: root + 'api/role/deletemultiple',
    method: 'POST'
  },

  getAllDepartment: {
    url: root + 'api/department',
    method: 'GET'
  },

  getDepartment: {
    url: root + 'api/department/{id}',
    method: 'GET'
  },

  createDepartment: {
    url: root + 'api/department',
    method: 'POST'
  },

  updateDepartment: {
    url: root + 'api/department/{id}',
    method: 'PUT'
  },

  deleteDepartment: {
    url: root + 'api/department/{id}',
    method: 'DELETE'
  },

  deleteMultipleDepartment: {
    url: root + 'api/department/deletemultiple',
    method: 'POST'
  },

  getAllPower: {
    url: root + 'api/power/{id}',
    method: 'GET'
  },

  getPowerToUser: {
    url: root + 'api/power/user?userid={id}',
    method: 'GET'
  },

  getPowerToRole: {
    url: root + 'api/power/role?roleid={id}',
    method: 'GET'
  },

  setPowerToUser: {
    url: root + 'api/power/user',
    method: 'POST'
  },

  setPowerToRole: {
    url: root + 'api/power/role',
    method: 'POST'
  },

  getAllLoginLog: {
    url: root + 'api/log/login',
    method: 'GET'
  },

  getLoginLog: {
    url: root + 'api/log/login?logid={id}',
    method: 'GET'
  },

  getAllException: {
    url: root + 'api/log/exception',
    method: 'GET'
  },

  getException: {
    url: root + 'api/log/exception?exceptionid={id}',
    method: 'GET'
  },

  deleteAllLoginLog: {
    url: root + 'api/log/login',
    method: 'DELETE'
  },

  deleteLoginLog: {
    url: root + 'api/log/login?logid={id}',
    method: 'DELETE'
  },

  deleteAllException: {
    url: root + 'api/log/exception',
    method: 'DELETE'
  },

  deleteException: {
    url: root + 'api/log/exception?exceptionid={id}',
    method: 'DELETE'
  },
}