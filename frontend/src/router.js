import Vue from 'vue';
import Router from 'vue-router';
import Publicaciones from './components/Publicaciones'
import Home from './components/Home'
import Login from './components/Login'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/publicaciones',
            name: 'publicaciones',
            component: Publicaciones
        },
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        }
    ]
});