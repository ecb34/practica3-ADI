import Vue from 'vue'
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store/index'
import VueToasted from 'vue-toasted';
import axios from 'axios';

// load Toast Plugin
Vue.use(VueToasted);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  mounted(){//check if this works
    axios.interceptors.request.use(async config => {
      const token = store.getters.getToken;
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
     });
  },
  render: h => h(App)
}).$mount('#app')
