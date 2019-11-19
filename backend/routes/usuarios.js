const express = require('express');
const router = express.Router();
const queries = require('../db/database');
//ver usuarios
router.get('/', queries.getUsuarios);

router.get('/:nombre', queries.getUsuario);

//actualizar informacion de usuario, tiene que ser el usuario autenticado
router.put('/:nombre', queries.updateUsuario);

router.delete('/:nombre', queries.deleteUsuario);

module.exports = router;