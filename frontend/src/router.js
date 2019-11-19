import Vue from 'vue';
import Router from 'vue-router';
import Publicaciones from './components/Publicaciones'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/publicaciones',
            name: 'publicaciones',
            component: Publicaciones
        }
    ]
});