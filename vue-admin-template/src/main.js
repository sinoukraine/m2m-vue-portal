import Vue from 'vue'

import ImageUploader from 'vue-image-upload-resize'
Vue.use(ImageUploader);

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'leaflet/dist/leaflet.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import {i18n} from '@/utils/i18n'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import { ToastPlugin } from '@syncfusion/ej2-vue-notifications';
import { ButtonPlugin } from '@syncfusion/ej2-vue-buttons';
Vue.use(ToastPlugin);
Vue.use(ButtonPlugin);


import moment from 'moment'
Vue.prototype.moment = moment

import simStateColorFilter from '@/filters/simStateColor.filter'
import simRagColorFilter from '@/filters/simRagColor.filter'

import '@/utils/jquery-global.js';
import '@/utils/jquery.vmap/jqvmap.css';
import '@/utils/jquery.vmap/jquery.vmap.js';
import '@/utils/jquery.vmap/jquery.vmap.world.js';

import * as ModalDialogs from 'vue-modal-dialogs'
Vue.use(ModalDialogs)               // No options

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.filter('simStateColor', simStateColorFilter)
Vue.filter('simRagColor', simRagColorFilter)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
