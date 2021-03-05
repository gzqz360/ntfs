import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App'
import router from './router'
import store from './store'

import { i18n, langSetup } from './lang'


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$http=axios
/* eslint-disable no-new */
Vue.langSetup = Vue.prototype.$langSetup = langSetup

new Vue({
  components: { App },
  router,
  store,
  i18n, //多语言i18n
  template: '<App/>'
}).$mount('#app')
