import axios from "axios"
import Cookies from "js-cookie"

export function request(config) {
  const instance = axios.create({
    timeout: 5000,
    withCredentials: true
  })

  instance.defaults.headers['Access-Control-Allow-Credentials', 'true']
  instance.defaults.headers['Access-Control-Allow-Origin','http://localhost:49894']

  //@ 请求拦截
  instance.interceptors.request.use(req => {
    var token = Cookies.get('em_token')
    if (token){
      req.headers['Token'] = token
    }
    return req
  })

  //@ 响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  })

  return instance(config)
}