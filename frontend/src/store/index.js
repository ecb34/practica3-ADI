import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)


export default new Vuex.Store({

    state: {
        token : localStorage.getItem('token') || null

    },
    //Getters are function which consult the variables of the state.
    getters: {
        loggedIn(state){
            return state.token !==null
        },
        getToken(state){
            return state.token
        }
    },

    //Mutations are synchronous operation which can modify the application's state.
    mutations: {
        setToken(state, token){
            state.token = token
        },
        logout(state){
            state.token = null;
            localStorage.setItem('token', '');
        }
    },

    //Actions are asynchronous operations which can modify the application's state or call the mutations, they're normally used for axios requests.
    actions: {
        authenticate(context, credentials){
            return new Promise((resolve,reject) =>{
                axios.post('/api/login', {
                    nombre: credentials.nombre,
                    password: credentials.password
                }).then(response =>{
                    var token = response.data.token
                    localStorage.setItem('token', token)
                    context.commit('setToken', token)
                    resolve(true)
                }).catch(error =>{
                    reject(error)
                })
            })
        }
    }
})
