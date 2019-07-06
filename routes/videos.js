var express = require('express');
var router = express.Router();
const Video = require('../models/videos');

router.post('/create', function(req, res, next) {
  new Video().save(req.body).then(model => {
    res.json(model.toJSON());
  });
});

router.get('/show/:id', function(req, res, next) {
  new Video({ id: req.params.id }).fetch().then(model => {
    res.json(model.toJSON());
  });
});

router.get('/list', function(req, res, next) {
  new Video().fetchAll().then(model => {
    console.log(model.toJSON()[200]);
    res.json(model.toJSON());
  });
});

router.get('/editar/:id', function(req, res, next) {
  // Obtenemos un asistente por medio del id y lo enviamos a la vista
  new Asistente({ id: req.params.id }).fetch().then(model => {
    res.render('CRUD_views/editar', {
      titulo: 'Editar',
      asistente: model.toJSON()
    });
  });
});

router.post('/editar', function(req, res, next) {
  // Automaticamente busca por el id que trae req.body y hace la actualizacion de los demás campos dependiendo del contenido del objeto
  new Asistente(req.body).save().then(model => {
    if (req.xhr) { // si la llamada es realizada usando ajax
      res.json(model.toJSON());
    } else {
      res.redirect('/crud/lista');
    }
  });
});

module.exports = router;
