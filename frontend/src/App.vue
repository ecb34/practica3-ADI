<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h2>Práctica 3 ADI</h2>
      </div>
      <v-spacer></v-spacer>
      <router-link to="/login">
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
};
</script>
