<template>
  <v-container>
  <v-data-table :headers="headers" :items="publicaciones" sort-by="id" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Lista Publicaciones</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nueva Publicación</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.titulo" label="Titulo" loading="true"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea v-model="editedItem.contenido" label="Contenido" loading="true"></v-textarea>
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
      <v-btn text icon :to="{ name: 'publicacion', params: {id: item.id } }" color="success">
        <v-icon class="mr-2">
          mdi-eye
        </v-icon>
      </v-btn>
      <v-btn text icon @click="editItem(item)" color="primary">
        <v-icon class="mr-2" >
          mdi-pencil
        </v-icon>
      </v-btn>
      <v-btn text icon @click="deleteItem(item)" v-if="item.autor_id == $store.getters.getId" color="error">
        <v-icon >
          mdi-delete
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Recargar</v-btn>
    </template>
  </v-data-table>
  </v-container>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({
      //modal
      dialog: false,
      headers: [
        { text: 'ID', value: 'id', width: '10%'},
        { text: 'Titulo', value: 'titulo'},
        { text: 'Contenido', value: 'contenido'},
        { text: 'Acciones', value: 'accion', sortable: false,  width: '15%' },
      ],
      publicaciones: [],
      editedIndex: -1,
      editedItem: {
        id: -1,
        titulo: '',
        contenido: '',
      },
      defaultItem: {
        id: -1,
        name: '',
        contenido: ''
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nueva Publicación' : 'Editar Publicación'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        axios.get('/api/publicaciones').then((res)=>{
          this.publicaciones = res.data;
        })
      },
      editItem (item) { //para mostrar modal de editar publicacion
        this.editedIndex = item.id
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        axios.delete('/api/publicaciones/'+ item.id).then((res)=>{
          this.publicaciones.splice(this.publicaciones.indexOf(item), 1)//quitarlo de la lista dinamicamente
          this.$toasted.show("Borrada la publicación "+ item.id, { 
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
          this.editedIndex = -1
        }, 300)
      },
      save () {//guardar nuevo objeto o el objeto editado
        if (this.editedIndex > -1) {//editar
          axios.patch('/api/publicaciones/'+ this.editedItem.id, {
            titulo: this.editedItem.titulo,
            contenido: this.editedItem.contenido
          }).then(()=>{
            for (var publicacion of this.publicaciones) {
              if(publicacion.id === this.editedIndex){
                publicacion.titulo = this.editedItem.titulo;
                publicacion.contenido = this.editedItem.contenido;
              }
            }
            this.$toasted.show("Editada la publicación "+ this.editedItem.id, { 
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
            axios.post('/api/publicaciones', {
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
    },
  }
</script>


