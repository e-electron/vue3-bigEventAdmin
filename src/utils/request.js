import axios from 'axios'
import {useUserStore} from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 1. 创建实例：官网
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout:10000,
})
// 2. 请求拦截器：在请求或响应被 then 或 catch 处理前拦截它们。
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    if(useStore.token){
      config.headers.Authorization=useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 3.响应拦截器：
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    if(res.data.code===0){
      return res
    }
    // 处理业务失败 给错误提示 并抛出提示
    ElMessage.error(res.data.message||'服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊请款401->权限不足、token国企=>拦截到登录
    if(err.response.status===401){
      router.push('/login')
    }

    // 错误的默认情况 给提示就好
    ElMessage.error(err.response.data.message||'服务异常')
    return Promise.reject(err)
  }
)

export default instance
export {baseURL}