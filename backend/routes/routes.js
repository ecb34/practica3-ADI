const express = require('express');
const router = express.Router();
const queries = require('../db/database');


router.post('/login', queries.authenticate);
router.use('/publicaciones', require('./publicaciones'));
router.use('/usuarios', require('./usuarios'));
router.use('/grupos', require('./grupos'));

module.exports = router;