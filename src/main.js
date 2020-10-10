// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import service from './utils/request'
import store from './store'

// localStorage.clear()
// localStorage.setItem('token', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImNyZWF0ZWQiOjE2MDA5MzIxNTM2NzcsImV4cCI6MTYwMTUzNjk1M30.QAPv3GqUeH4AzqDy0x6uVBPDdWU1wxV0sjLYOfWPWefrF7Q5bPwPPvJy4Zr4t9Z-qJOTKWYWfbbUs4SGpUL5LA')
// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
// var axios = require('axios')
// axios.defaults.baseURL = 'http://localhost:8080'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = service()
/*
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('token')) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
*/
Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
