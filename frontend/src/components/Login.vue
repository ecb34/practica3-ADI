<template>
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            md4
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Iniciar Sesión</v-toolbar-title>

              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Nombre"
                    name="Nombre"
                    v-model="credentials.nombre"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    label="Contraseña"
                    name="contraseña"
                    v-model="credentials.password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn  @click="submit">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
</template>

<script>
export default {
    name: 'Login',
    data: ()=> ({
        credentials: {
            nombre: '',
            password: ''
        },
        errorValidacion: false
    }),
    methods: {
        submit(){
            this.$store.dispatch('authenticate', this.credentials).then(()=>{
              this.$router.push('/publicaciones')
            }).catch(()=>{
                this.$toasted.show("Error de credenciales", { 
                    theme: "toasted-primary", 
                    position: "top-center", 
                    duration : 2000
                });
            })         
        }
    }
}
</script>

<style>

</style>