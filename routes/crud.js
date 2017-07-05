var express = require('express');
var router = express.Router();
var bookshelf = require('../bookshelf');
var knex = bookshelf.knex;
var multer = require('multer');
var subidas = multer({ dest: 'subidas/' })

/* GET home page. */
router.get('/nuevo', function(req, res, next) {
  res.render('CRUD_views/nuevo', {
    titulo: 'Taller de node.js',
    saludo: 'Hola desde node yey!'
  });
});

router.post('/guardar', function(req, res, next) {
  knex('asistentes').insert(req.body).then((data) => {
    knex('asistentes').where('id', data.pop()).then(reg => {
      res.json(reg[0]);
    });
  });
});

router.get('/cargar', function(req, res, next) {
  res.render('CRUD_views/cargar');
});

router.post('/cargar', subidas.single('archivo'), function(req, res, next) {
  if(req.file) {
    return res.send('Archivo enviado');
  }
  return res.send('Ha ocurrido un error');
});

module.exports = router;
