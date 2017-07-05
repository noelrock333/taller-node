var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('CRUD_views/new', {
  	titulo: 'Taller de node.js',
  	saludo: 'Hola desde node yey!'
  });
});

module.exports = router;
