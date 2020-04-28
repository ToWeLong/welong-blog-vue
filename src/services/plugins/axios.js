import Vue from 'vue'
import axios from 'axios'
import Config from '@/config/index'
import { getToken } from '@/services/utils/cookie'
import store from '@/store'
import author from '@/services/models/user'


const config = {
  baseURL: Config.baseUrl,
  timeout: 5 * 1000,
  crossDomain: true,
  validateStatus(status) {
    return status >= 200 && status < 500
  }
}

const _axios = axios.create(config)

_axios.interceptors.request.use(originConfig => {
  const reqConfig = { ...originConfig }

  // step1: 容错处理
  if (!reqConfig.url) {
    throw new Error({
      source: 'axiosInterceptors',
      message: 'request need url',
    })
  }

  // 默认使用 get 请求
  if (!reqConfig.method) {
    reqConfig.method = 'get'
  }

  // 大小写
  reqConfig.method = reqConfig.method.toLowerCase()

  if (reqConfig.method === 'get') {
    if (!reqConfig.params) {  // 防止字段用错
      reqConfig.params = reqConfig.data || {}
    } 
  } else if (reqConfig.method === 'post') {
    if (!reqConfig.data) {
      reqConfig.data = reqConfig.params || {}
    }

    let hasFile = false
    Object.keys(reqConfig.data).forEach((key) => {
      if (typeof reqConfig.data[key] === 'object') {
        const item = reqConfig.data[key]
        if (item instanceof FileList || item instanceof File || item instanceof Blob) {
          hasFile = true
        } else if (Object.prototype.toString.call(item) === '[object Object]') {
          reqConfig.data[key] = JSON.stringify(reqConfig.data[key])
        }
      }
    })

    if (hasFile) {
      const formData = new FormData()
      Object.keys(reqConfig.data).forEach(key => {
        formData.append(key, reqConfig.data[key])
      })
      reqConfig.data = formData
    }
  }

  // step2: auth 处理
  const accessToken = getToken('access_token')
  if (accessToken) {
      reqConfig.headers.Authorization = accessToken
  }
  return reqConfig
}, error => {
  Promise.reject(error)
})

_axios.interceptors.response.use(async (res) => {
  if (res.status.toString().charAt(0) === '2') {
    return res.data
  }
  
  return new Promise(async (resolve, reject) => {
    // 将本次失败请求保存
    const { params, url, method ,data } = res.config
    if(method =="POST" || method =="PUT" || method =="DELETE"){
      const Json_data = JSON.parse(data)
      store.commit('SET_REFRESH_OPTION', {
        data: Json_data,
        params,
        url,
        method
      })
    }
    store.commit('SET_REFRESH_OPTION', {
      params,
      url,
      method
    })

    // 处理 API 异常
    let { code, message } = res.data
    if (message instanceof Object) {
      let showMsg = ''
      Object.getOwnPropertyNames(message).forEach((key, index) => {
        if (index === 0) {
          showMsg = message[key]  // 如果是数组，展示第一条
        }
      })
      message = showMsg
    }

    // 如果是令牌无效或者是 refreshToken 相关异常
    if (code === 10004 || code === 10008) {
      setTimeout(() => {
        store.dispatch('loginOut')
        const { origin } = window.location
        window.location.href = origin
      }, 1500)
    }

    // 令牌失效 或 令牌过期 需要重新刷新令牌
    if (code === 10007) {
      const cache = {}
      if (cache.url !== url) {
        cache.url = url
        console.log(url);
        
        await author.getRefreshToken()
        const result = await _axios(store.state.refreshOptions)
        resolve(result)
        return
      }
    }
    
    Vue.prototype.$message({
      message: message || '未知的errorCode',
      type: 'error',
    })

    reject(res.data)
  })
}, error => {
  // eslint-disable-next-line no-console
  console.log(error)
})

Plugin.install = function (Vue) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}

if (!Vue.axios) {
  Vue.use(Plugin)
}

// 导出常用函数

export function post(url, data = {}, params = {}) {
  return _axios({
    method: 'post',
    url,
    data,
    params,
  })
}


export function get(url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params
  })
}

export function put(url, data = {}, params = {}) {
  return _axios({
    method: 'put',
    url,
    params,
    data,
  })
}

export function _delete(url, params = {}) {
  return _axios({
    method: 'delete',
    url,
    params,
  })
}

export default _axios