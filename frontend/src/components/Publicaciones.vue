<template>
  <v-data-table
    :headers="headers"
    :items="publicaciones"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Lista Publicaciones</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
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
      <v-icon      
        class="mr-2"
        @click="viewItem(item)"
      >
        mdi-eye
      </v-icon>
      <v-icon
        
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Recargar</v-btn>
    </template>
  </v-data-table>
</template>

<script>//TODO: crear para ver publicacion una vista en especial que se acceda por publicaciones/{id}
  import axios from 'axios'
  export default {
    data: () => ({
      //modal
      dialog: false,
      headers: [
        {
          text: 'id',
          align: 'left',
          value: 'id',
        },
        { text: 'Titulo', value: 'titulo' },
        { text: 'Contenido', value: 'contenido' },
        { text: 'Acciones', value: 'accion', sortable: false },
      ],
      publicaciones: [],
      editedIndex: -1,
      editedItem: {
        titulo: '',
        contenido: '',
      },
      defaultItem: {
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
        axios.get('/api/publicaciones').then((res)=>{//TODO toca hacer catch? o no lo detectaria como error? mirar practica taes
          this.publicaciones = res.data;
        })
      },
      editItem (item) { //para mostrar modal de editar publicacion
        this.editedIndex = this.publicaciones.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {//TODO llamada con axios al servidor y crearle un modal para el delete
        const index = this.publicaciones.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.publicaciones.splice(index, 1)
      },
      close () {//cerrar modal
        this.dialog = false 
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem) //se vacia el modal
          this.editedIndex = -1
        }, 300)
      },
      save () {//guardar nuevo objeto o el objeto editado
        if (this.editedIndex > -1) {
          Object.assign(this.publicaciones[this.editedIndex], this.editedItem)//TODO hacer llamada con axios a editPublicacion
        } else {
            axios.post('/api/publicaciones', {
              titulo: this.editItem.titulo,
              contenido: this.editItem.contenido
            }).then(()=>{//TODO peticion necesita token
              this.publicaciones.push(this.editedItem)
            }).catch(()=>{//cuando es codigo peticion diferente a 2xx
              //TODO cambiar a que muestre un mensaje de error
              this.publicaciones = []
            })
          }
        this.close()
      },
    },
  }
</script>

