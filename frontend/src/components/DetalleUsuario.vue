<template>
    <v-container>
        <dl>
            <dt>ID:</dt>
            <dd>{{usuario.id}}</dd>
            <dt>Nombre:</dt>
            <dd>{{usuario.nombre}}</dd>
            <dt>Alias:</dt>
            <dd>{{usuario.alias}}</dd>   
            <dt>Popularidad:</dt>
            <dd>{{usuario.popularidad}}</dd>  
            <dt>Edad:</dt>
            <dd>{{usuario.edad}}</dd>
        </dl>
        <v-btn color="red" to="/usuarios" class="white--text">Volver</v-btn>
    </v-container>
</template>

<script>
import axios from "axios";
export default {
 data: () => ({
    usuario: {
       id: -1,
       nombre: '',
       alias: '',
       popularidad: -1,
       edad: -1
     }
 }),
 created() {
    axios.get('/api/usuarios/'+ this.$route.params.nombre).then((res)=>{
        console.log(res.data)
        this.usuario = res.data;
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

