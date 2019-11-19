import Vue from 'vue'
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store/index'
import VueToasted from 'vue-toasted';

// load Toast Plugin
Vue.use(VueToasted);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
