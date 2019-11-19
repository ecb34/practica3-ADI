const express = require('express');
const router = express.Router();
const queries = require('../db/database');



//mostrar info publicacion, no autenticacion
router.get('/:id', queries.getPublicacion);

//eliminar publicacion, usar autenticacion
router.delete('/:id', queries.deletePublicacion);

//mostrar publicaciones mas importantes
router.get('/', queries.getPublicaciones);

//añadir publicacion
router.post('/', queries.addPublicacion);

//actualizar publicacion
router.patch('/:id', queries.updatePublicacion);


/***************  COMENTARIOS *************/

//ver comentarios de una publicacion
router.get('/:idPublicacion/comentarios', queries.getComentariosPublicacion);

//eliminar comentario publicacion -> para creador publicacion, con autenticacion
router.delete('/:idPublicacion/comentarios', queries.deleteComentariosPublicacion);

//comentar en una publicacion
router.post('/:idPublicacion/comentarios', queries.addComentarioPublicacion);


module.exports = router;