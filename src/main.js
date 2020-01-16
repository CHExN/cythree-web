import Vue from 'vue'
import Febs from './FEBS.vue'
import router from './router'
// import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import store from './store'
import request from '@/utils/request'
import db from '@/utils/localstorage'
import tools from '@/utils/tools'
// import VueApexCharts from 'vue-apexcharts'
import 'babel-polyfill'

import 'ant-design-vue/dist/antd.css'

import '@/utils/install'
import '@/utils/filter' // global filter
import '@/store/lazy_lib/components_use'

Vue.config.devtools = true
Vue.config.productionTip = false
// Vue.use(Antd)
Vue.use(Viser)
Vue.use(db)
Vue.use(tools)
// Vue.use(VueApexCharts)

// Vue.component('apexchart', VueApexCharts)

Vue.use({
  install (Vue) {
    Vue.prototype.$db = db
    Vue.prototype.$tools = tools
  }
})
Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$export = request.export
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(Febs)
}).$mount('#febs')
