import Vue from 'vue';
import Router from 'vue-router';
import Publicaciones from './components/Publicaciones'
import Home from './components/Home'
import Login from './components/Login'
import Usuarios from './components/Usuarios'
import Store from './store/index';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            beforeEnter(to,from,next){
                if(!Store.getters.loggedIn){
                    next()
                }else{
                    next({name: 'Home'})
                }
            }
        },
        {
            path: '/publicaciones',
            name: 'publicaciones',
            component: Publicaciones,
            beforeEnter(to,from,next){
                if(Store.getters.loggedIn){
                    next()
                }else{
                    next({name: 'Login'})
                }
            }
        },
        {
            path: '/usuarios',
            name: 'usuarios',
            component: Usuarios,
            beforeEnter(to,from,next){
                if(Store.getters.loggedIn){
                    next()
                }else{
                    next({name: 'Login'})
                }
            }
        }
       
    ]
});