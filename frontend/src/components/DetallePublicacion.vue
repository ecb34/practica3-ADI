<template>
    <v-container>
        <dl>
            <dt>ID:</dt>
            <dd>{{publicacion.id}}</dd>
            <dt>Titulo:</dt>
            <dd>{{publicacion.titulo}}</dd>
            <dt>Contenido:</dt>
            <dd>{{publicacion.contenido}}</dd>   
            <dt>Autor ID:</dt>
            <dd>{{publicacion.autor_id}}</dd>  
            <dt>Imagen:</dt>
            <dd><img :src="publicacion.imagen" alt="imagen"></dd>          
        </dl>
        <v-btn color="red" to="/usuarios" class="white--text">Volver</v-btn>
    </v-container>
    
</template>

<script>
import axios from "axios";
export default {
 data: () => ({
    publicacion: {
       id: -1,
       titulo: '',
       contenido: '',
       autor_id: '',
       imagen: ''
     }
 }),
 created() {
    axios.get('/api/publicaciones/'+ this.$route.params.id).then((res)=>{
        console.log(res.data)
        this.publicacion = res.data;
    }).catch((err)=>{
        this.$toasted.show(err.response.data.error, { 
            theme: "toasted-primary", 
            position: "top-center", 
            duration : 2000
        });
    })
 }
}
</script>
<style>
/*DL, DT, DD TAGS LIST DATA*/
dl {
    margin-bottom:50px;
}
 
dl dt {
    background:red;
    color:#fff;
    float:left; 
    font-weight:bold; 
    margin-right:10px; 
    padding:5px;  
    width:100px; 
}
 
dl dd {
    margin:2px 0; 
    padding:5px 0;
}
</style>

