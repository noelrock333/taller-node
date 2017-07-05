var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/nuevo', function(req, res, next) {
  res.render('CRUD_views/nuevo', {
    titulo: 'Taller de node.js',
    saludo: 'Hola desde node yey!'
  });
});

router.post('/guardar', function(req, res, next) {
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
