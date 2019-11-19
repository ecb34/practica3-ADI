const express = require('express');
const router = express.Router();
const queries = require('../db/database')
//crear un grupo 
router.post('/',queries.createGroup);

//obtener grupos creados
router.get('/', queries.getGroups);

module.exports = router;