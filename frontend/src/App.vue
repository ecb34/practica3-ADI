<template>
  <v-app>
    <v-app-bar
      app
      color="red"
      dark
    >
      <div class="d-flex align-center">
        <router-link to="/" tag="button">Práctica 3 ADI</router-link>
      </div>
      <v-spacer></v-spacer>

      <div v-if="this.$store.getters.loggedIn">
        <v-btn text color="white" to="/publicaciones">Publicaciones</v-btn>
        <v-btn text color="white" to="/usuarios">Usuarios</v-btn>
        <v-btn  @click="logout()">Logout</v-btn>
      </div>
      
      <router-link to="/login" v-else tag="button">
        <span class="mr-2 text--white">Login</span>
        <v-icon>mdi-login</v-icon>
      </router-link>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  methods: {
    logout(){
      this.$store.commit('logout');
      this.$router.push('/')
      this.$toasted.show("Cerrada sesión correctamente", { 
        theme: "toasted-primary", 
        position: "top-center", 
        duration : 2000
      });
    }
  }
};
</script>
