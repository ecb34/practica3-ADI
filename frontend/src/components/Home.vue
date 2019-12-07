<template>
    <v-container>
         <v-row>
          <v-col cols="12">
               <v-row align="center" justify="center" class="grey lighten-5" style="height: 300px;">
                    <v-btn to="/publicaciones" x-large color="info" dark>
                         Ver Publicaciones
                    </v-btn>
               </v-row>
               <v-row align="center" justify="center" class="grey lighten-5" >
                         <v-btn to="/usuarios" x-large color="green" dark>
                              Ver Usuarios
                         </v-btn>    
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