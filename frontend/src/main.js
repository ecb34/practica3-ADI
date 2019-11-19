import Vue from 'vue'
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'
import VueToasted from 'vue-toasted';

// load Toast Plugin
Vue.use(VueToasted);
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
