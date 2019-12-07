<template>
    <v-data-table :headers="headers" :items="usuarios" sort-by="id" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Lista Usuarios</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Usuario</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.alias" label="Alias" loading="true"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea v-model="editedItem.popularidad" label="Popularidad" loading="true"></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.accion="{ item }">
      <router-link :to="{ name: 'usuario', params: {nombre: item.nombre } }">
        <v-icon class="mr-2">
          mdi-eye
        </v-icon>
      </router-link>
      <v-icon class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Recargar</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios"
export default {
    data: () => ({
      //modal
      dialog: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Alias', value: 'alias'},
        { text: 'Popularidad', value: 'popularidad' },
        { text: 'Acciones', value: 'accion', sortable: false },
      ],
      usuarios: [],
      editedIndex: '',
      editedItem: {
        alias: '',
        popularidad: '',
      },
      defaultItem: {
        alias: '',
        popularidad: ''
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },created () {
      this.initialize()
    },
    methods: {
      initialize () {
        axios.get('/api/usuarios').then((res)=>{
            console.log(res.data)
          this.usuarios = res.data;
        })
      },
       editItem (item) { //para mostrar modal de editar publicacion
        this.editedIndex = item.nombre
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        axios.delete('/api/usuarios/'+ item.nombre).then((res)=>{
          this.usuarios.splice(this.usuarios.indexOf(item), 1)//quitarlo de la lista dinamicamente
          this.$toasted.show("Borrada el usuario "+ item.nombre, { 
                theme: "toasted-primary", 
                position: "top-center", 
                duration : 2000
              });
        }).catch((err)=>{
          this.$toasted.show(err.response.data.error, { 
                theme: "toasted-primary", 
                position: "top-center", 
                duration : 2000
              });
        })
        
      },
      close () {//cerrar modal
        this.dialog = false 
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem) //se vacia el modal
          this.editedIndex = ''
        }, 300)
      },
      save () {//guardar nuevo objeto o el objeto editado
        if (this.editedIndex !== '') {//editar
          axios.patch('/api/usuarios/'+ this.editedIndex, {
            alias: this.editedItem.alias,
            popularidad: this.editedItem.popularidad
          }).then((res)=>{
            console.log(res.data)
            for (var usuario of this.usuarios) {
              if(usuario.nombre === this.editedIndex){
                usuario.alias = this.editedItem.alias;
                usuario.popularidad = this.editedItem.popularidad;
              }
            }
            this.$toasted.show("Editado el usuario "+ this.editedIndex, { 
              theme: "toasted-primary", 
              position: "top-center", 
              duration : 2000
            });
          }).catch((err)=>{
            this.$toasted.show(err.response.data.error, { 
              theme: "toasted-primary", 
              position: "top-center", 
              duration : 2000
            });
          })    
        } else {//crear
            axios.post('/api/usuarios', {
              titulo: this.editedItem.titulo,
              contenido: this.editedItem.contenido
            }).then((res)=>{
              this.publicaciones.push(res.data);
              this.$toasted.show("Agregada la publicación con id "+ res.data.id, { 
                theme: "toasted-primary", 
                position: "top-center", 
                duration : 2000
              });
            }).catch((err)=>{//cuando es codigo peticion diferente a 2xx
              this.$toasted.show(err.response.data.error, { 
                theme: "toasted-primary", 
                position: "top-center", 
                duration : 2000
              });
            })
          }
        this.close()
      },
    }
}
</script>

<style>

</style>