<template>
    <v-container>
         <v-row>
          <v-col cols="12">
               <v-row align="center" justify="center" class="grey lighten-5" style="height: 300px;">
                    <router-link to="/publicaciones" tag="button">
                         <v-btn x-large color="info" dark>
                              Ver Publicaciones
                         </v-btn>
                    </router-link>
               </v-row>
          </v-col>
         </v-row>
    </v-container>
</template>
<script>
export default {
     name: 'Home'
}
</script>